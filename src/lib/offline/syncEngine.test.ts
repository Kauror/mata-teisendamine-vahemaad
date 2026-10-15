import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { closeOfflineDbForTests, OFFLINE_DB_NAME } from '@/lib/offline/db';
import { attemptRepo, metaRepo, taskActionRepo } from '@/lib/offline/repositories';
import { SYNC_COMPLETE_EVENT, syncNow, type SyncCompleteDetail } from '@/lib/offline/syncEngine';
import type { LocalAttempt, LocalTaskAction } from '@/lib/offline/records';

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

function pendingAttempt(): LocalAttempt {
  return {
    clientAttemptId: '018f47f6-9f2c-7b9a-8a2e-abcdefabcdef',
    deviceId: '018f47f6-9f2c-7b9a-8a2e-123456789abc',
    learner: 'kiur', subject: 'matemaatika', topic: 'pikkused', category: 'Teisendamine', difficulty: 'Lihtne',
    exerciseId: 'kiur.math.mootuhikud-pikkused', catalogueVersion: 'catalogue-version',
    rewardPolicyVersion: 'reward-policy', generatorVersion: 'generator-v2', runnerVersion: 'math-v1', rotationVersion: 1,
    runnerId: 'math', seed: 42, questionIds: ['q1'],
    startedAt: '2026-07-13T09:59:00.000Z', rawDeviceCompletedAt: '2026-07-13T10:00:00.000Z',
    completedAt: '2026-07-13T10:00:00.000Z', clientCorrectedCompletedAt: '2026-07-13T10:00:00.000Z',
    clientTimeZone: 'Europe/Tallinn', clientUtcOffsetMinutes: 180,
    questionCount: 1, score: 1, elapsedSeconds: 60, questions: [{ id: 'q1', userAnswer: '1' }],
    status: 'pending', retryCount: 0, createdLocallyAt: '2026-07-13T10:00:00.000Z'
  };
}

function mockServer(pushStatus: number, options: { pingStatus?: number } = {}) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('/api/offline/ping')) {
      if (options.pingStatus && options.pingStatus !== 200) {
        return Response.json({ code: 'reauth_required', message: 'PIN on vajalik.' }, { status: options.pingStatus });
      }
      return Response.json({
        ok: true,
        serverTime: '2026-07-13T10:00:00.000Z',
        protocolVersion: 2,
        supportedProtocolVersions: [2],
        appVersion: 'test'
      });
    }
    const body = JSON.parse(String(init?.body ?? '{}')) as { phase?: string };
    if (body.phase === 'push') {
      return Response.json({ code: pushStatus === 422 ? 'invalid_request' : 'internal_error' }, { status: pushStatus });
    }
    return Response.json({
      protocolVersion: 2,
      phase: 'pull',
      serverTime: '2026-07-13T10:00:00.000Z',
      historyEpoch: 0,
      pull: { attempts: [], tombstones: [], taskChanges: [], remediationChanges: [] },
      hasMore: { attempts: false, tombstones: false, taskChanges: false, remediationChanges: false, historyBackfill: false },
      nextCursor: {
        lastServerAttemptId: 0, lastTombstoneId: 0, lastTaskChangeId: 0,
        lastRemediationChangeId: 0, lastAttemptChangeId: 0, historyEpoch: 0,
        catalogueVersions: {}, syncedAt: '2026-07-13T10:00:00.000Z'
      }
    });
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function pushCalls(fetchMock: ReturnType<typeof mockServer>) {
  return fetchMock.mock.calls.filter(([, init]) => (JSON.parse(String(init?.body ?? '{}')) as { phase?: string }).phase === 'push');
}

describe('sync HTTP failure handling', () => {
  it('moves a semantic 422 record to manual review', async () => {
    const attempt = pendingAttempt();
    await attemptRepo.put(attempt);
    mockServer(422);

    await syncNow('manual:test');

    expect(await attemptRepo.get(attempt.clientAttemptId)).toMatchObject({ status: 'needs_review', reasonCode: 'invalid_request' });
  });

  it('keeps a transient 500 pending with retry metadata', async () => {
    const attempt = pendingAttempt();
    await attemptRepo.put(attempt);
    mockServer(500);

    expect(await syncNow('manual:test')).toMatchObject({ ok: false, reason: 'retryable' });
    expect(await attemptRepo.get(attempt.clientAttemptId)).toMatchObject({ status: 'pending', retryCount: 1 });
    expect((await attemptRepo.get(attempt.clientAttemptId))?.nextRetryAt).toBeTruthy();
  });

  it.each([[426, 'upgrade_required'], [401, 'auth_blocked']] as const)(
    'keeps HTTP %i pending and blocks for %s',
    async (status, reason) => {
      const attempt = pendingAttempt();
      await attemptRepo.put(attempt);
      mockServer(status);

      expect(await syncNow('manual:test')).toMatchObject({ ok: false, reason });
      expect(await attemptRepo.get(attempt.clientAttemptId)).toMatchObject({ status: 'pending' });
    }
  );
});

describe('expired family session at ping (OFF-01)', () => {
  it.each([401, 403])('reports ping HTTP %i as auth_blocked, not offline, and keeps results queued', async (status) => {
    const attempt = pendingAttempt();
    await attemptRepo.put(attempt);
    const fetchMock = mockServer(200, { pingStatus: status });

    expect(await syncNow('attempt-complete')).toMatchObject({ ok: false, reason: 'auth_blocked', pushed: 0 });
    expect(pushCalls(fetchMock)).toHaveLength(0);
    expect(await attemptRepo.get(attempt.clientAttemptId)).toMatchObject({ status: 'pending' });
    expect(await metaRepo.get('syncRetryState', null)).toMatchObject({ status: 'auth_blocked' });

    // Background triggers then stay blocked without hammering the server
    // until the PIN is entered again.
    fetchMock.mockClear();
    expect(await syncNow('interval')).toMatchObject({ ok: false, reason: 'auth_blocked' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('still reports an unreachable server as offline', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('Failed to fetch'); }));
    expect(await syncNow('interval')).toMatchObject({ ok: false, reason: 'offline' });
    expect(await metaRepo.get('syncRetryState', null)).toBeNull();
  });
});

describe('manual sync ignores per-row backoff (OFF-02)', () => {
  const later = () => new Date(Date.now() + 10 * 60_000).toISOString();

  const pushKinds = (fetchMock: ReturnType<typeof mockServer>) =>
    pushCalls(fetchMock).map(([, init]) => (JSON.parse(String(init?.body)) as { pushKind?: string }).pushKind);

  it('pushes an attempt that is still backing off', async () => {
    await attemptRepo.put({ ...pendingAttempt(), retryCount: 2, nextRetryAt: later() });
    const fetchMock = mockServer(500);

    await syncNow('manual:sync-now');

    expect(pushKinds(fetchMock)).toEqual(['attempts']);
  });

  it('pushes a backing-off task action on manual sync but not on a background one', async () => {
    await taskActionRepo.put({
      clientActionId: '018f47f6-9f2c-4b9a-8a2e-000000000002',
      deviceId: '018f47f6-9f2c-7b9a-8a2e-123456789abc',
      learner: 'kiur',
      actionType: 'complete',
      templateId: 1,
      templateVersion: 'v1',
      taskDate: '2026-07-13',
      completedAt: '2026-07-13T10:00:00.000Z',
      status: 'pending',
      nextRetryAt: later(),
      createdLocallyAt: '2026-07-13T10:00:00.000Z'
    } satisfies LocalTaskAction);
    const background = mockServer(500);
    await syncNow('interval');
    expect(pushCalls(background)).toHaveLength(0);

    const manual = mockServer(500);
    await syncNow('manual:sync-now');
    expect(pushKinds(manual)).toEqual(['actions']);
  });

  it('leaves a backing-off attempt alone on a background sync', async () => {
    await attemptRepo.put({ ...pendingAttempt(), retryCount: 2, nextRetryAt: later() });
    const fetchMock = mockServer(500);

    expect(await syncNow('interval')).toMatchObject({ ok: true, pushed: 0 });
    expect(pushCalls(fetchMock)).toHaveLength(0);
  });
});

describe('sync completion event (OFF-04)', () => {
  it('announces every finished cycle with its outcome', async () => {
    const target = new EventTarget();
    vi.stubGlobal('window', target);
    const seen: SyncCompleteDetail[] = [];
    target.addEventListener(SYNC_COMPLETE_EVENT, (event) => seen.push((event as CustomEvent<SyncCompleteDetail>).detail));
    mockServer(500, { pingStatus: 401 });

    await syncNow('attempt-complete');

    expect(seen).toHaveLength(1);
    expect(seen[0]).toMatchObject({ reason: 'attempt-complete', outcome: { ok: false, reason: 'auth_blocked' } });
  });
});
