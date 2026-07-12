import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { closeOfflineDbForTests, OFFLINE_DB_NAME, OFFLINE_DB_VERSION, offlineDb } from '@/lib/offline/db';
import { attemptRepo, historyRepo, runnerSessionRepo } from '@/lib/offline/repositories';
import { makeRunnerSession } from '@/lib/offline/runnerSession';
import type { LocalAttempt } from '@/lib/offline/records';

async function deleteDatabase() {
  await closeOfflineDbForTests();
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(OFFLINE_DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function createV2Fixture() {
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(OFFLINE_DB_NAME, 2);
    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore('meta', { keyPath: 'key' });
      db.createObjectStore('catalogues', { keyPath: 'learner' });
      const sessions = db.createObjectStore('sessions', { keyPath: 'sessionId' });
      sessions.createIndex('byLearner', 'learner');
      const attempts = db.createObjectStore('attempts', { keyPath: 'clientAttemptId' });
      attempts.createIndex('byStatus', 'status');
      const history = db.createObjectStore('history', { keyPath: 'id' });
      history.createIndex('byCompletedAt', 'completedAt');
      db.createObjectStore('snapshots', { keyPath: 'learner' });
      db.createObjectStore('taskTemplates', { keyPath: 'id' });
      const actions = db.createObjectStore('taskActions', { keyPath: 'clientActionId' });
      actions.createIndex('byStatus', 'status');
      sessions.add({
        sessionId: 'legacy-session', learner: 'kiur', topic: 'legacy', category: 'legacy',
        subject: 'matemaatika', exerciseId: null, catalogueVersion: null, seed: 1,
        startedAt: '2026-07-12T10:00:00.000Z', currentIndex: 2, elapsedSeconds: 5,
        questionsPayload: [{ customFutureField: true }], answers: ['1'], orderingAnswers: [[]],
        choiceAnswers: [''], appVersion: 'old', updatedAt: '2026-07-12T10:00:05.000Z',
        unknownRecordField: { preserved: true }
      });
    };
    request.onsuccess = () => { request.result.close(); resolve(); };
    request.onerror = () => reject(request.error);
  });
}

function attempt(clientAttemptId: string): LocalAttempt {
  return {
    clientAttemptId,
    deviceId: 'ba070185-02b1-4f39-9521-1ac768a35bdb',
    learner: 'kiur',
    subject: 'matemaatika',
    topic: 'liitmine',
    category: 'Arvutamine',
    difficulty: 'Lihtne',
    exerciseId: 'kiur.math.addition',
    catalogueVersion: 'catalogue-1',
    startedAt: '2026-07-12T10:00:00.000Z',
    rawDeviceCompletedAt: '2026-07-12T10:01:00.000Z',
    completedAt: '2026-07-12T10:01:00.000Z',
    clientCorrectedCompletedAt: '2026-07-12T10:01:00.000Z',
    clientTimeZone: 'Europe/Tallinn',
    clientUtcOffsetMinutes: 180,
    questionCount: 1,
    score: 1,
    elapsedSeconds: 60,
    questions: [{ id: 'q-1', answer: '2' }],
    seed: 1,
    runnerId: 'math',
    questionIds: ['q-1'],
    rewardPolicyVersion: 'policy-1',
    generatorVersion: '2026-07-1',
    runnerVersion: 'math-v1',
    rotationVersion: 1,
    status: 'pending',
    retryCount: 0,
    createdLocallyAt: '2026-07-12T10:01:00.000Z'
  };
}

beforeEach(deleteDatabase);
afterEach(deleteDatabase);

describe('offline IndexedDB v3', () => {
  it('upgrades v2 additively and preserves unknown legacy session data', async () => {
    await createV2Fixture();
    const db = await offlineDb();
    expect(db.version).toBe(OFFLINE_DB_VERSION);
    const row = await db.get('sessions', 'legacy-session') as unknown as Record<string, unknown>;
    expect(row.unknownRecordField).toEqual({ preserved: true });
    expect(db.objectStoreNames.contains('remediationBundles')).toBe(true);
    expect(db.objectStoreNames.contains('remediationActions')).toBe(true);
    expect(db.objectStoreNames.contains('catalogueGrants')).toBe(true);
    expect(db.objectStoreNames.contains('syncLeases')).toBe(true);
    expect(db.transaction('taskActions').store.indexNames.contains('byResolvedAt')).toBe(true);
  });

  it('atomically creates one outbox row and removes the exact active session', async () => {
    const runId = '77ce59e7-ae32-4b68-af70-3d5920357236';
    await runnerSessionRepo.put(makeRunnerSession({
      runId,
      learner: 'kiur', runnerId: 'math', exerciseId: 'kiur.math.addition',
      subject: 'matemaatika', topic: 'liitmine', category: 'Arvutamine', seed: 1,
      questions: [{ id: 'q-1' }], runnerState: {}, runnerVersion: 'math-v1'
    }));

    const first = await attemptRepo.finalize(runId, attempt(runId));
    const second = await attemptRepo.finalize(runId, attempt(runId));
    expect(first.created).toBe(true);
    expect(second.created).toBe(false);
    expect(await runnerSessionRepo.get(runId)).toBeUndefined();
    expect((await attemptRepo.all()).filter((row) => row.clientAttemptId === runId)).toHaveLength(1);
  });

  it('does not recreate an outbox row after the canonical history row exists', async () => {
    const clientAttemptId = 'c099f29e-e09b-43d7-9dd4-3b45fe5ce842';
    await historyRepo.putMany([{
      id: 10, clientAttemptId, createdAt: '2026-07-12T10:01:00.000Z', completedAt: '2026-07-12T10:01:00.000Z',
      category: 'Arvutamine', difficulty: 'Lihtne', questionCount: 1, score: 1, elapsedSeconds: 60,
      learner: 'kiur', subject: 'matemaatika', topic: 'liitmine', exerciseId: 'kiur.math.addition', earnedStars: 1
    }]);
    const result = await attemptRepo.finalize(clientAttemptId, attempt(clientAttemptId));
    expect(result).toMatchObject({ created: false, confirmed: { id: 10 } });
    expect(await attemptRepo.get(clientAttemptId)).toBeUndefined();
  });
});
