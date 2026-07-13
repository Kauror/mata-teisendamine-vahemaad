import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { closeOfflineDbForTests, OFFLINE_DB_NAME } from '@/lib/offline/db';
import { attemptRepo } from '@/lib/offline/repositories';
import { syncNow } from '@/lib/offline/syncEngine';
import type { LocalAttempt } from '@/lib/offline/records';

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

function mockServer(pushStatus: number) {
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('/api/offline/ping')) {
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
  }));
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
