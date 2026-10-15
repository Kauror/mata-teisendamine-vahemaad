import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { closeOfflineDbForTests, OFFLINE_DB_NAME, offlineDb } from '@/lib/offline/db';
import { metaRepo } from '@/lib/offline/repositories';
import { syncNow } from '@/lib/offline/syncEngine';
import type { LocalAttempt, LocalTaskAction } from '@/lib/offline/records';
import type { ServerAttempt } from '@/lib/shared/types';

// OFF-12 characterisation: both client outboxes follow the same lifecycle
// (pending -> syncing lease -> settled, or back to pending with a retry delay).
// These tests pin that lifecycle per store through the real sync engine.

async function resetDatabase() {
  await closeOfflineDbForTests();
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(OFFLINE_DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => resolve();
  });
}

afterEach(async () => {
  vi.unstubAllGlobals();
  await resetDatabase();
});

// Current, so settled action rows are not pruned as old resolved history.
const SERVER_TIME = new Date().toISOString();
const later = () => new Date(Date.now() + 10 * 60_000).toISOString();
const earlier = () => new Date(Date.now() - 60_000).toISOString();

function id(n: number) {
  return `018f47f6-9f2c-4b9a-8a2e-${String(n).padStart(12, '0')}`;
}

function canonical(n: number, clientAttemptId: string): ServerAttempt {
  return {
    id: n, clientAttemptId, createdAt: SERVER_TIME, completedAt: SERVER_TIME, category: 'Teisendamine', difficulty: 'Lihtne',
    questionCount: 1, score: 1, elapsedSeconds: 60, learner: 'kiur', subject: 'matemaatika', topic: 'pikkused',
    exerciseId: 'kiur.math.mootuhikud-pikkused', earnedStars: 1, questions: []
  };
}

type StoreName = 'attempts' | 'taskActions';
type AnyRow = LocalAttempt | LocalTaskAction;
type PushBody = { pushKind?: string; pending?: { attempts?: { clientAttemptId: string }[]; taskActions?: { clientActionId: string }[] } };

type OutboxCase = {
  name: string;
  store: StoreName;
  row: (n: number, extra?: Record<string, unknown>) => AnyRow;
  key: (row: AnyRow) => string;
  idsIn: (body: PushBody) => string[];
  success: (ids: string[]) => Record<string, unknown>;
  // What a successful push leaves in the outbox store (undefined = removed).
  settled: Record<string, unknown> | undefined;
  // What a retryable failure leaves on the row today.
  retried: Record<string, unknown>;
};

const cases: OutboxCase[] = [
  {
    name: 'attempts',
    store: 'attempts',
    row: (n, extra = {}) => ({
      clientAttemptId: id(n),
      deviceId: '018f47f6-9f2c-7b9a-8a2e-123456789abc',
      learner: 'kiur', subject: 'matemaatika', topic: 'pikkused', category: 'Teisendamine', difficulty: 'Lihtne',
      exerciseId: 'kiur.math.mootuhikud-pikkused', catalogueVersion: 'catalogue-version',
      rewardPolicyVersion: 'reward-policy', generatorVersion: 'generator-v2', runnerVersion: 'math-v1', rotationVersion: 1,
      runnerId: 'math', seed: 42, questionIds: ['q1'],
      startedAt: '2026-07-13T09:59:00.000Z', rawDeviceCompletedAt: SERVER_TIME,
      completedAt: SERVER_TIME, clientCorrectedCompletedAt: SERVER_TIME,
      clientTimeZone: 'Europe/Tallinn', clientUtcOffsetMinutes: 180,
      questionCount: 1, score: 1, elapsedSeconds: 60, questions: [{ id: 'q1', userAnswer: '1' }],
      status: 'pending', retryCount: 0, createdLocallyAt: SERVER_TIME,
      ...extra
    } as LocalAttempt),
    key: (row) => (row as LocalAttempt).clientAttemptId,
    idsIn: (body) => (body.pending?.attempts ?? []).map((row) => row.clientAttemptId),
    success: (ids) => ({ attemptResults: ids.map((clientAttemptId, index) => ({ clientAttemptId, status: 'created', serverAttemptId: 100 + index, canonicalAttempt: canonical(100 + index, clientAttemptId) })) }),
    settled: undefined,
    retried: { status: 'pending', retryCount: 1, lastError: 'sync-http-500' }
  },
  {
    name: 'task actions',
    store: 'taskActions',
    row: (n, extra = {}) => ({
      clientActionId: id(n),
      deviceId: '018f47f6-9f2c-7b9a-8a2e-123456789abc',
      learner: 'kiur', actionType: 'complete', templateId: n, templateVersion: 'v1', taskDate: '2026-07-13',
      completedAt: SERVER_TIME, status: 'pending', createdLocallyAt: SERVER_TIME,
      ...extra
    } as LocalTaskAction),
    key: (row) => (row as LocalTaskAction).clientActionId,
    idsIn: (body) => (body.pending?.taskActions ?? []).map((row) => row.clientActionId),
    success: (ids) => ({ taskActionResults: ids.map((clientActionId) => ({ clientActionId, status: 'applied' })) }),
    settled: { status: 'applied', resolvedAt: SERVER_TIME },
    // Counted like attempts; the transport error no longer lands in
    // reasonCode, which is reserved for the server's verdict.
    retried: { status: 'pending', retryCount: 1, lastError: 'sync-http-500' }
  }
];

async function putRow(store: StoreName, row: AnyRow) {
  const db = await offlineDb();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await db.put(store, row as any);
}

async function getRow(store: StoreName, key: string): Promise<AnyRow | undefined> {
  const db = await offlineDb();
  return db.get(store, key);
}

type PushHandler = (ids: string[]) => Response;

function mockServer(outbox: OutboxCase, push: PushHandler) {
  const pushes: string[][] = [];
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('/api/offline/ping')) {
      return Response.json({ ok: true, serverTime: SERVER_TIME, protocolVersion: 2, supportedProtocolVersions: [2], appVersion: 'test' });
    }
    const body = JSON.parse(String(init?.body ?? '{}')) as PushBody & { phase?: string };
    if (body.phase === 'push') {
      const ids = outbox.idsIn(body);
      if (!ids.length) return Response.json({ protocolVersion: 2, phase: 'push', serverTime: SERVER_TIME, attemptResults: [], taskActionResults: [], remediationActionResults: [] });
      pushes.push(ids);
      return push(ids);
    }
    return Response.json({
      protocolVersion: 2,
      phase: 'pull',
      serverTime: SERVER_TIME,
      historyEpoch: 0,
      pull: { attempts: [], tombstones: [], taskChanges: [], remediationChanges: [] },
      hasMore: { attempts: false, tombstones: false, taskChanges: false, remediationChanges: false, historyBackfill: false },
      nextCursor: {
        lastServerAttemptId: 0, lastTombstoneId: 0, lastTaskChangeId: 0,
        lastRemediationChangeId: 0, lastAttemptChangeId: 0, historyEpoch: 0,
        catalogueVersions: {}, syncedAt: SERVER_TIME
      }
    });
  });
  vi.stubGlobal('fetch', fetchMock);
  return { fetchMock, pushes };
}

function ok(outbox: OutboxCase): PushHandler {
  return (ids) => Response.json({ protocolVersion: 2, phase: 'push', serverTime: SERVER_TIME, attemptResults: [], taskActionResults: [], remediationActionResults: [], ...outbox.success(ids) });
}

function status(code: number): PushHandler {
  return () => Response.json({ code: code === 400 ? 'invalid_request' : 'internal_error' }, { status: code });
}

describe.each(cases)('$name outbox lifecycle', (outbox) => {
  it('settles a pushed row on success', async () => {
    const row = outbox.row(1);
    await putRow(outbox.store, row);
    const { pushes } = mockServer(outbox, ok(outbox));

    const outcome = await syncNow('manual:test');

    expect(outcome).toMatchObject({ ok: true, pushed: 1 });
    expect(pushes).toEqual([[outbox.key(row)]]);
    const stored = await getRow(outbox.store, outbox.key(row));
    if (outbox.settled === undefined) expect(stored).toBeUndefined();
    else expect(stored).toMatchObject({ ...outbox.settled, syncLeaseUntil: undefined });
  });

  it('returns a row to pending with a retry delay on a retryable failure', async () => {
    const row = outbox.row(1);
    await putRow(outbox.store, row);
    mockServer(outbox, status(500));

    expect(await syncNow('manual:test')).toMatchObject({ ok: false, reason: 'retryable', pushed: 0 });

    const stored = await getRow(outbox.store, outbox.key(row));
    expect(stored).toMatchObject(outbox.retried);
    expect(stored?.syncLeaseUntil).toBeUndefined();
    expect((stored as { reasonCode?: string }).reasonCode).toBeUndefined();
    expect(new Date(stored!.nextRetryAt!).getTime()).toBeGreaterThan(Date.now());
    const state = await metaRepo.get<{ status: string; retryCount: number; nextRetryAt?: string }>('syncRetryState', { status: 'idle', retryCount: 0 });
    expect(state).toMatchObject({ status: 'retry_wait', retryCount: 1 });
    expect(stored?.nextRetryAt).toBe(state.nextRetryAt);
  });

  it('moves a row to manual review on a terminal rejection', async () => {
    const row = outbox.row(1);
    await putRow(outbox.store, row);
    mockServer(outbox, status(400));

    expect(await syncNow('manual:test')).toMatchObject({ ok: true, pushed: 0 });
    expect(await getRow(outbox.store, outbox.key(row))).toMatchObject({ status: 'needs_review', reasonCode: 'invalid_request' });
  });

  it('splits a batch the server finds too large and sends every row', async () => {
    const rows = [outbox.row(1), outbox.row(2), outbox.row(3)];
    for (const row of rows) await putRow(outbox.store, row);
    const success = ok(outbox);
    const { pushes } = mockServer(outbox, (ids) => ids.length > 1 ? status(413)(ids) : success(ids));

    expect(await syncNow('manual:test')).toMatchObject({ ok: true, pushed: 3 });
    expect(pushes.map((ids) => ids.length)).toEqual([3, 2, 1, 1, 1]);
    for (const row of rows) {
      const stored = await getRow(outbox.store, outbox.key(row));
      if (outbox.settled === undefined) expect(stored).toBeUndefined();
      else expect(stored).toMatchObject(outbox.settled);
    }
  });

  it('sends a single row that is still too large to manual review', async () => {
    const row = outbox.row(1);
    await putRow(outbox.store, row);
    mockServer(outbox, status(413));

    expect(await syncNow('manual:test')).toMatchObject({ ok: true, pushed: 0 });
    expect(await getRow(outbox.store, outbox.key(row))).toMatchObject({ status: 'needs_review', reasonCode: 'payload_too_large' });
  });

  it('recovers a row whose syncing lease expired and leaves a live lease alone', async () => {
    const expired = outbox.row(1, { status: 'syncing', syncLeaseUntil: earlier() });
    const live = outbox.row(2, { status: 'syncing', syncLeaseUntil: later() });
    await putRow(outbox.store, expired);
    await putRow(outbox.store, live);
    const { pushes } = mockServer(outbox, ok(outbox));

    await syncNow('manual:test');

    expect(pushes).toEqual([[outbox.key(expired)]]);
    expect(await getRow(outbox.store, outbox.key(live))).toMatchObject({ status: 'syncing' });
  });

  it('pushes a backing-off row only on a manual sync', async () => {
    const row = outbox.row(1, { nextRetryAt: later() });
    await putRow(outbox.store, row);

    const background = mockServer(outbox, ok(outbox));
    expect(await syncNow('interval')).toMatchObject({ ok: true, pushed: 0 });
    expect(background.pushes).toHaveLength(0);

    const manual = mockServer(outbox, ok(outbox));
    expect(await syncNow('manual:sync-now')).toMatchObject({ ok: true, pushed: 1 });
    expect(manual.pushes).toEqual([[outbox.key(row)]]);
  });
});
