import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import { generateKiurMathSession } from '@/lib/exercises/kiurMath';
import { MATH_GENERATOR_VERSION_V4, MATH_GENERATOR_VERSION_V5 } from '@/lib/exercises/mathGeneratorVersion';
import { updateChildLearningExerciseStatus } from '@/lib/learningExercises';
import { getOfflineRunnerCapability } from '@/lib/offline/capabilities';
import { runSyncPullV2, runSyncPushV2 } from '@/lib/offline/server/syncService';
import { getMathLevel } from '@/lib/server/mathLevels';
import { isDifficulty } from '@/lib/mathDifficulty';
import type { GeneratedQuestion } from '@/lib/types';
import type { OfflineSyncCursorV2, OfflineSyncDevice } from '@/lib/shared/types';

// Adaptive difficulty through the sync contract: the server verifies a run at
// the level it was made at, steps the level from the stored history, exposes
// it on the dashboard snapshot, and holds (never loses) a run made easier than
// the rule allows.

const deviceId = '018f47f6-9f2c-7b9a-8a2e-0000000000bb';
const EXERCISE = 'kiur.math.jagamine-kahekohaline-uhekohaline';
const TOPIC = 'jagamine-kahekohaline-uhekohaline';

const cursor = (): OfflineSyncCursorV2 => ({ lastServerAttemptId: 0, lastTombstoneId: 0, lastTaskChangeId: 0, lastRemediationChangeId: 0, lastAttemptChangeId: 0, historyEpoch: 0, catalogueVersions: {} });
const device = (): OfflineSyncDevice => ({ deviceId, appVersion: 'difficulty-test', timeZone: 'Europe/Tallinn', clientNow: new Date().toISOString() });

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

let counter = 0;

// One finished run, `right` of 15 answered right; a larger `minutesAgo` is earlier.
function push(input: { difficulty: string; right: number; minutesAgo: number; version?: string }) {
  const pull = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor() });
  const catalogue = pull.pull.catalogues!.kiur!;
  const served = pull.pull.catalogueGrants!.kiur!;
  const capability = getOfflineRunnerCapability('math')!;
  const version = input.version ?? MATH_GENERATOR_VERSION_V5;
  const seed = 9000 + counter;
  // A made-up level is sent with Lihtne questions; the server must refuse the level itself.
  const questions = generateKiurMathSession(TOPIC, 'Segaharjutus', isDifficulty(input.difficulty) ? input.difficulty : 'Lihtne', 15, seed, version as typeof MATH_GENERATOR_VERSION_V5);
  // Within the grant's tolerance (it was issued just now): «minutes» are 0.4 s.
  const completedAt = new Date(Date.now() - input.minutesAgo * 400).toISOString();
  const startedAt = new Date(Date.now() - input.minutesAgo * 400 - 200).toISOString();
  counter += 1;
  const clientAttemptId = `018f47f6-9f2c-4b9a-8a2e-${String(counter).padStart(12, '0')}`;
  const result = runSyncPushV2({
    protocolVersion: 2, phase: 'push', pushKind: 'attempts', device: device(), cursor: cursor(),
    pending: {
      attempts: [{
        clientAttemptId, deviceId, learner: 'kiur', subject: 'matemaatika', topic: TOPIC, category: 'Segaharjutus', difficulty: input.difficulty,
        exerciseId: EXERCISE, catalogueVersion: catalogue.version, rewardPolicyVersion: served.rewardPolicyVersion, generatorVersion: version,
        runnerVersion: capability.runnerVersion, rotationVersion: capability.rotationVersion,
        startedAt, rawDeviceCompletedAt: completedAt, completedAt, clientCorrectedCompletedAt: completedAt,
        clientTimeZone: 'Europe/Tallinn', clientUtcOffsetMinutes: 120, questionCount: 15, score: input.right, elapsedSeconds: 300, seed, runnerId: 'math',
        questionIds: questions.map((question) => question.id),
        questions: questions.map((question, index) => ({ ...question, userAnswer: index < input.right ? answerFor(question) : '-1', isCorrect: index < input.right }))
      }]
    }
  }).attemptResults[0];
  const stored = db.prepare('SELECT score, difficulty, rewardSettlementStatus, reviewReasonCode FROM attempts WHERE clientAttemptId = ?').get(clientAttemptId) as { score: number; difficulty: string; rewardSettlementStatus: string; reviewReasonCode: string | null } | undefined;
  return { result, stored };
}

describe('adaptive maths difficulty on the server', () => {
  it('verifies a run at each level by replaying it at that level', () => {
    for (const difficulty of ['Lihtne', 'Keskmine', 'Raske']) {
      const { result, stored } = push({ difficulty, right: 15, minutesAgo: 30 });
      expect(result.status, difficulty).not.toBe('rejected');
      expect(stored?.score, difficulty).toBe(15);
    }
  });

  it('steps up after two good runs and shows the level on the dashboard snapshot', () => {
    push({ difficulty: 'Lihtne', right: 14, minutesAgo: 120 });
    push({ difficulty: 'Lihtne', right: 15, minutesAgo: 90 });
    expect(getMathLevel('kiur', TOPIC).level).toBe('Keskmine');
    const pull = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor() });
    expect(pull.pull.dashboards?.kiur?.mathLevels?.[TOPIC]).toEqual({ level: 'Keskmine', goodSessions: 0 });
    expect(pull.pull.dashboards?.kirsi?.mathLevels).toBeUndefined();

    // At Keskmine now: a Keskmine run is settled normally...
    expect(push({ difficulty: 'Keskmine', right: 10, minutesAgo: 60 }).stored).toMatchObject({ rewardSettlementStatus: 'eligible', reviewReasonCode: null });
    // ...a Raske one too (harder never earns more)...
    expect(push({ difficulty: 'Raske', right: 10, minutesAgo: 40 }).stored).toMatchObject({ rewardSettlementStatus: 'eligible' });
    // In real use the earlier runs reached the server before the next began.
    db.prepare('UPDATE attempts SET syncedAt = effectiveCompletedAt').run();
    // ...but a Lihtne one is kept and held for the parent.
    const easy = push({ difficulty: 'Lihtne', right: 15, minutesAgo: 20 });
    expect(easy.result.status).toBe('needs_review');
    expect(easy.stored).toMatchObject({ rewardSettlementStatus: 'needs_review', reviewReasonCode: 'difficulty_below_level' });
    // A held run does not move the level.
    expect(getMathLevel('kiur', TOPIC).level).toBe('Keskmine');
  });

  it('steps down after a run below 60 %', () => {
    push({ difficulty: 'Lihtne', right: 15, minutesAgo: 120 });
    push({ difficulty: 'Lihtne', right: 15, minutesAgo: 100 });
    push({ difficulty: 'Keskmine', right: 8, minutesAgo: 80 });
    expect(getMathLevel('kiur', TOPIC).level).toBe('Lihtne');
    expect(push({ difficulty: 'Lihtne', right: 12, minutesAgo: 10 }).stored).toMatchObject({ rewardSettlementStatus: 'eligible' });
  });

  it('rejects a level that does not exist in the new version, and leaves older versions alone', () => {
    expect(push({ difficulty: 'Ülikerge', right: 15, minutesAgo: 10 }).result).toMatchObject({ status: 'rejected', reasonCode: 'question_contract_mismatch' });
    push({ difficulty: 'Lihtne', right: 15, minutesAgo: 120 });
    push({ difficulty: 'Lihtne', right: 15, minutesAgo: 100 });
    // A v4 run (every one of them was Lihtne) synced late is never held.
    expect(push({ difficulty: 'Lihtne', right: 15, minutesAgo: 10, version: MATH_GENERATOR_VERSION_V4 }).stored).toMatchObject({ rewardSettlementStatus: 'eligible' });
  });
});
