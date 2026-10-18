import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import { generateKiurMathSession } from '@/lib/exercises/kiurMath';
import { MATH_GENERATOR_VERSION, MATH_GENERATOR_VERSION_V1, MATH_GENERATOR_VERSION_V2, MATH_GENERATOR_VERSION_V3, MATH_GENERATOR_VERSION_V4 } from '@/lib/exercises/mathGeneratorVersion';
import { updateChildLearningExerciseStatus } from '@/lib/learningExercises';
import { getOfflineRunnerCapability } from '@/lib/offline/capabilities';
import { runSyncPullV2, runSyncPushV2 } from '@/lib/offline/server/syncService';
import type { GeneratedQuestion } from '@/lib/types';
import type { OfflineSyncCursorV2, OfflineSyncDevice } from '@/lib/shared/types';

// End to end through the sync contract: a phone that made a maths attempt (or
// paused a run) on the old generator must still have it accepted and scored
// after the server learns the new one, and the other way round.

const deviceId = '018f47f6-9f2c-7b9a-8a2e-0000000000aa';
const EXERCISE = 'kiur.math.ring-ja-ringjoon';
const TOPIC = 'ring-ja-ringjoon';

function cursor(): OfflineSyncCursorV2 {
  return { lastServerAttemptId: 0, lastTombstoneId: 0, lastTaskChangeId: 0, lastRemediationChangeId: 0, lastAttemptChangeId: 0, historyEpoch: 0, catalogueVersions: {} };
}

function device(): OfflineSyncDevice {
  return { deviceId, appVersion: 'generator-version-test', timeZone: 'Europe/Tallinn', clientNow: new Date().toISOString() };
}

function answerFor(question: GeneratedQuestion) {
  if (question.kind === 'choice' && question.choiceOptions) return question.choiceOptions[question.correctAnswer];
  return String(question.correctAnswer);
}

beforeEach(() => {
  process.env.OFFLINE_PROTOCOL_V2_ENABLED = '1';
  db.pragma('foreign_keys = OFF');
  db.exec(`
    DELETE FROM attempt_reward_components;
    DELETE FROM reward_projection_runs;
    DELETE FROM study_attempt_rewards;
    DELETE FROM point_ledger;
    DELETE FROM attempts;
    DELETE FROM catalogue_grants;
    DELETE FROM offline_catalog_versions;
    DELETE FROM reward_policy_current;
    DELETE FROM reward_policy_versions;
  `);
  db.pragma('foreign_keys = ON');
  updateChildLearningExerciseStatus(EXERCISE, 'kiur', 'permanent');
});

function grant() {
  const pull = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor() });
  const catalogue = pull.pull.catalogues!.kiur!;
  const kiurGrant = pull.pull.catalogueGrants!.kiur!;
  expect(catalogue.entries.some((entry) => entry.id === EXERCISE)).toBe(true);
  return { catalogue, grant: kiurGrant };
}

function push(attemptId: string, generatorVersion: string, questions: GeneratedQuestion[], seed: number) {
  const { catalogue, grant: served } = grant();
  return pushWith(attemptId, generatorVersion, questions, seed, catalogue.version, served.rewardPolicyVersion);
}

function pushWith(attemptId: string, generatorVersion: string, questions: GeneratedQuestion[], seed: number, catalogueVersion: string, rewardPolicyVersion: string) {
  const capability = getOfflineRunnerCapability('math')!;
  const completedAt = new Date(Date.now() - 60_000).toISOString();
  return runSyncPushV2({
    protocolVersion: 2,
    phase: 'push',
    pushKind: 'attempts',
    device: device(),
    cursor: cursor(),
    pending: {
      attempts: [{
        clientAttemptId: attemptId,
        deviceId,
        learner: 'kiur',
        subject: 'matemaatika',
        topic: TOPIC,
        category: 'Segaharjutus',
        difficulty: 'Lihtne',
        exerciseId: EXERCISE,
        catalogueVersion,
        rewardPolicyVersion,
        generatorVersion,
        runnerVersion: capability.runnerVersion,
        rotationVersion: capability.rotationVersion,
        startedAt: completedAt,
        rawDeviceCompletedAt: completedAt,
        completedAt,
        clientCorrectedCompletedAt: completedAt,
        clientTimeZone: 'Europe/Tallinn',
        clientUtcOffsetMinutes: 180,
        questionCount: questions.length,
        score: 0,
        elapsedSeconds: 120,
        seed,
        runnerId: 'math',
        questionIds: questions.map((question) => question.id),
        questions: questions.map((question) => ({ ...question, userAnswer: answerFor(question), isCorrect: false }))
      }]
    }
  }).attemptResults[0];
}

function storedScore(attemptId: string) {
  return db.prepare('SELECT score, generatorVersion FROM attempts WHERE clientAttemptId = ?').get(attemptId) as { score: number; generatorVersion: string } | undefined;
}

describe('maths generator version across sync', () => {
  it('serves the new version in the grant and keeps verifying an old-version attempt', () => {
    expect(getOfflineRunnerCapability('math')!.generatorVersion).toBe(MATH_GENERATOR_VERSION_V4);
    const seed = 4242;
    const old = generateKiurMathSession(TOPIC, 'Segaharjutus', 'Lihtne', 15, seed, MATH_GENERATOR_VERSION_V1);
    const id = '018f47f6-9f2c-4b9a-8a2e-000000000001';
    expect(push(id, MATH_GENERATOR_VERSION_V1, old, seed)).toMatchObject({ status: 'created' });
    expect(storedScore(id)).toEqual({ score: 15, generatorVersion: MATH_GENERATOR_VERSION_V1 });
  });

  it('keeps verifying an attempt made on the previous version (v3)', () => {
    const seed = 4247;
    const previous = generateKiurMathSession(TOPIC, 'Segaharjutus', 'Lihtne', 15, seed, MATH_GENERATOR_VERSION_V3);
    const id = '018f47f6-9f2c-4b9a-8a2e-000000000016';
    expect(push(id, MATH_GENERATOR_VERSION_V3, previous, seed)).toMatchObject({ status: 'created' });
    expect(storedScore(id)).toEqual({ score: 15, generatorVersion: MATH_GENERATOR_VERSION_V3 });
  });

  it('keeps verifying an attempt made on the previous version (v2)', () => {
    const seed = 4246;
    const previous = generateKiurMathSession(TOPIC, 'Segaharjutus', 'Lihtne', 15, seed, MATH_GENERATOR_VERSION_V2);
    const id = '018f47f6-9f2c-4b9a-8a2e-000000000006';
    expect(push(id, MATH_GENERATOR_VERSION_V2, previous, seed)).toMatchObject({ status: 'created' });
    expect(storedScore(id)).toEqual({ score: 15, generatorVersion: MATH_GENERATOR_VERSION_V2 });
  });

  it('accepts and scores a new-version attempt', () => {
    const seed = 4243;
    const fresh = generateKiurMathSession(TOPIC, 'Segaharjutus', 'Lihtne', 15, seed);
    const id = '018f47f6-9f2c-4b9a-8a2e-000000000002';
    expect(push(id, MATH_GENERATOR_VERSION, fresh, seed)).toMatchObject({ status: 'created' });
    expect(storedScore(id)).toEqual({ score: 15, generatorVersion: MATH_GENERATOR_VERSION });
  });

  it('accepts a new-version attempt against a grant still holding the old runner contract', () => {
    const { catalogue, grant: served } = grant();
    // The device updated its app and ran a session before its next pull, so the
    // server's grant row still snapshots the pre-bump runner contracts.
    const row = db.prepare('SELECT rowid, runnerContractsJson FROM catalogue_grants WHERE learner = ? AND deviceId = ?').get('kiur', deviceId) as { rowid: number; runnerContractsJson: string };
    const contracts = JSON.parse(row.runnerContractsJson) as Array<{ runnerId: string; generatorVersion: string }>;
    for (const contract of contracts) if (contract.runnerId === 'math') contract.generatorVersion = MATH_GENERATOR_VERSION_V1;
    db.prepare('UPDATE catalogue_grants SET runnerContractsJson = ? WHERE rowid = ?').run(JSON.stringify(contracts), row.rowid);

    const seed = 4244;
    const fresh = generateKiurMathSession(TOPIC, 'Segaharjutus', 'Lihtne', 15, seed);
    const id = '018f47f6-9f2c-4b9a-8a2e-000000000003';
    expect(pushWith(id, MATH_GENERATOR_VERSION, fresh, seed, catalogue.version, served.rewardPolicyVersion)).toMatchObject({ status: 'created' });
    expect(storedScore(id)?.score).toBe(15);
  });

  it('rejects questions that do not match the version they claim, and unknown versions', () => {
    const seed = 4245;
    const fresh = generateKiurMathSession(TOPIC, 'Segaharjutus', 'Lihtne', 15, seed);
    expect(push('018f47f6-9f2c-4b9a-8a2e-000000000004', MATH_GENERATOR_VERSION_V1, fresh, seed)).toMatchObject({ status: 'rejected', reasonCode: 'question_contract_mismatch' });
    expect(push('018f47f6-9f2c-4b9a-8a2e-000000000005', 'math-1999', fresh, seed)).toMatchObject({ status: 'rejected' });
    expect(storedScore('018f47f6-9f2c-4b9a-8a2e-000000000004')).toBeUndefined();
    expect(storedScore('018f47f6-9f2c-4b9a-8a2e-000000000005')).toBeUndefined();
  });
});
