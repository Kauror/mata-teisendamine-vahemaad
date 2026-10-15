import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { closeOfflineDbForTests, OFFLINE_DB_NAME } from '@/lib/offline/db';
import { attemptRepo, bootstrapRepo, metaRepo } from '@/lib/offline/repositories';
import { prepareOffline, runCatchUpSync, runOfflineBootstrap } from '@/lib/offline/readiness';
import { syncNow } from '@/lib/offline/syncEngine';
import type { LocalAttempt } from '@/lib/offline/records';

// OFF-06: a cold start used to cost 4 pings and 2 full sync cycles. These tests
// count real requests through the real sync engine (fake IndexedDB, stubbed fetch).

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

function mockServer(options: { pingStatus?: number } = {}) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('/api/offline/ping')) {
      if (options.pingStatus) return Response.json({ code: 'reauth_required' }, { status: options.pingStatus });
      return Response.json({ ok: true, serverTime: '2026-07-13T10:00:00.000Z', protocolVersion: 2, supportedProtocolVersions: [2], appVersion: 'test' });
    }
    const body = JSON.parse(String(init?.body ?? '{}')) as { phase?: string };
    if (body.phase === 'push') {
      return Response.json({ protocolVersion: 2, phase: 'push', serverTime: '2026-07-13T10:00:00.000Z', attemptResults: [], taskActionResults: [], remediationActionResults: [] });
    }
    return Response.json({
      protocolVersion: 2,
      phase: 'pull',
      serverTime: '2026-07-13T10:00:00.000Z',
      historyEpoch: 0,
      pull: { attempts: [], tombstones: [], taskChanges: [], remediationChanges: [], taskTemplates: [] },
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

function count(fetchMock: ReturnType<typeof mockServer>) {
  const phases = fetchMock.mock.calls
    .filter(([input]) => String(input).includes('/api/offline/sync'))
    .map(([, init]) => (JSON.parse(String(init?.body ?? '{}')) as { phase?: string }).phase);
  return {
    pings: fetchMock.mock.calls.filter(([input]) => String(input).includes('/api/offline/ping')).length,
    pushes: phases.filter((phase) => phase === 'push').length,
    pulls: phases.filter((phase) => phase === 'pull').length
  };
}

describe('online cold start (OFF-06)', () => {
  it('does exactly one ping and one push/pull cycle, and the pull sets the bootstrap marker', async () => {
    await attemptRepo.put(pendingAttempt());
    const fetchMock = mockServer();

    const result = await runOfflineBootstrap({ runSync: syncNow, lastSuccessAt: () => null });

    expect(result).toMatchObject({ done: true, outcome: { ok: true } });
    expect(count(fetchMock)).toEqual({ pings: 1, pushes: 1, pulls: 1 });
    expect(await bootstrapRepo.get('taskBootstrapComplete', false)).toBe(true);
  });

  it('with nothing queued: one ping, no push, one pull (prepareOffline one-shot too)', async () => {
    const fetchMock = mockServer();

    expect(await prepareOffline()).toBe(true);

    expect(count(fetchMock)).toEqual({ pings: 1, pushes: 0, pulls: 1 });
  });

  it('an expired session is auth_blocked after one ping and is not marked prepared', async () => {
    await attemptRepo.put(pendingAttempt());
    const fetchMock = mockServer({ pingStatus: 401 });

    const result = await runOfflineBootstrap({ runSync: syncNow });

    expect(result).toMatchObject({ done: false, outcome: { ok: false, reason: 'auth_blocked' } });
    expect(count(fetchMock)).toEqual({ pings: 1, pushes: 0, pulls: 0 });
    expect(await metaRepo.get('syncRetryState', null)).toMatchObject({ status: 'auth_blocked' });
    expect(await attemptRepo.get(pendingAttempt().clientAttemptId)).toMatchObject({ status: 'pending' });
  });

  it('an unreachable server leaves preparation retriggerable (RTM-008)', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('Failed to fetch'); }));

    expect(await runOfflineBootstrap({ runSync: syncNow })).toMatchObject({ done: false, outcome: { reason: 'offline' } });
    expect(await bootstrapRepo.get('taskBootstrapComplete', false)).toBe(false);
  });

  it('reuses a successful sync from under a minute ago (family login) instead of repeating it', async () => {
    const fetchMock = mockServer();
    const runSync = vi.fn(syncNow);

    const result = await runOfflineBootstrap({ runSync, lastSuccessAt: () => Date.now() - 5_000 });

    expect(result).toEqual({ done: true, outcome: null });
    expect(runSync).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('catch-up throttle (OFF-06)', () => {
  const recent = () => Date.now() - 30_000;

  it('a visibility change within 60 s of a success with nothing pending makes no request', async () => {
    const fetchMock = mockServer();

    expect(await runCatchUpSync('visibility', { runSync: syncNow, lastSuccessAt: recent })).toBe('skipped');
    expect(await runCatchUpSync('interval', { runSync: syncNow, lastSuccessAt: recent })).toBe('skipped');
    expect(await runCatchUpSync('online-event', { runSync: syncNow, lastSuccessAt: recent })).toBe('skipped');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('syncs on visibility when a result is queued locally', async () => {
    await attemptRepo.put(pendingAttempt());
    const fetchMock = mockServer();

    expect(await runCatchUpSync('visibility', { runSync: syncNow, lastSuccessAt: recent })).toMatchObject({ ok: true });
    expect(count(fetchMock)).toEqual({ pings: 1, pushes: 1, pulls: 1 });
  });

  it('a manual sync always runs', async () => {
    const fetchMock = mockServer();

    expect(await runCatchUpSync('manual:sync-now', { runSync: syncNow, lastSuccessAt: recent })).toMatchObject({ ok: true });
    expect(count(fetchMock)).toEqual({ pings: 1, pushes: 0, pulls: 1 });
  });

  it('runs again once the last success is older than 60 s', async () => {
    const fetchMock = mockServer();

    expect(await runCatchUpSync('visibility', { runSync: syncNow, lastSuccessAt: () => Date.now() - 61_000 })).toMatchObject({ ok: true });
    expect(count(fetchMock).pings).toBe(1);
  });
});
