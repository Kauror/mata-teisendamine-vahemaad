import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import { generateKiurMathSession } from '@/lib/exercises/kiurMath';
import { updateChildLearningExerciseStatus } from '@/lib/learningExercises';
import { runSyncPullV2, runSyncPushV2 } from '@/lib/offline/server/syncService';
import type { GeneratedQuestion } from '@/lib/types';
import type { OfflineSyncCursorV2, OfflineSyncDevice } from '@/lib/shared/types';

const deviceId = '018f47f6-9f2c-7b9a-8a2e-123456789abc';

function answerFor(question: GeneratedQuestion) {
  if (question.kind === 'ordering' && question.orderingCards) {
    return [...question.orderingCards]
      .sort((a, b) => question.orderingDirection === 'desc' ? b.valueMm - a.valueMm : a.valueMm - b.valueMm)
      .map((card) => card.label)
      .join(' → ');
  }
  if (question.kind === 'choice' && question.choiceOptions) return question.choiceOptions[question.correctAnswer];
  if (question.kind === 'text' || question.correctAnswerText) return question.correctAnswerText;
  return String(question.correctAnswer);
}

function cursor(): OfflineSyncCursorV2 {
  return {
    lastServerAttemptId: 0,
    lastTombstoneId: 0,
    lastTaskChangeId: 0,
    lastRemediationChangeId: 0,
    lastAttemptChangeId: 0,
    historyEpoch: 0,
    catalogueVersions: {}
  };
}

function device(): OfflineSyncDevice {
  return {
    deviceId,
    appVersion: 'phase-3-test',
    timeZone: 'Europe/Tallinn',
    clientNow: new Date().toISOString()
  };
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
  updateChildLearningExerciseStatus('kiur.math.mootuhikud-pikkused', 'kiur', 'permanent');
});

describe('protocol-v2 attempt writes', () => {
  it('accepts a valid submission and ignores a forged client score', () => {
    const pull = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor() });
    const catalogue = pull.pull.catalogues?.kiur;
    const grant = pull.pull.catalogueGrants?.kiur;
    expect(catalogue).toBeTruthy();
    expect(grant).toBeTruthy();
    const entry = catalogue!.entries.find((candidate) => candidate.id === 'kiur.math.mootuhikud-pikkused');
    expect(entry).toBeTruthy();

    const generated = generateKiurMathSession(entry!.topic, entry!.category, 'Lihtne', 1, 42);
    const completedAt = new Date(Date.now() - 60_000).toISOString();
    const response = runSyncPushV2({
      protocolVersion: 2,
      phase: 'push',
      pushKind: 'attempts',
      device: device(),
      cursor: cursor(),
      pending: {
        attempts: [{ clientAttemptId: 'malformed-sibling' } as never, {
          clientAttemptId: '018f47f6-9f2c-7b9a-8a2e-abcdefabcdef',
          deviceId,
          learner: 'kiur',
          subject: entry!.subject,
          topic: entry!.topic,
          category: entry!.category,
          difficulty: 'Lihtne',
          exerciseId: entry!.id,
          catalogueVersion: catalogue!.version,
          rewardPolicyVersion: grant!.rewardPolicyVersion,
          generatorVersion: grant!.generatorVersion,
          runnerVersion: 'math-v1',
          rotationVersion: grant!.rotationVersion,
          startedAt: completedAt,
          rawDeviceCompletedAt: completedAt,
          completedAt,
          clientCorrectedCompletedAt: completedAt,
          clientTimeZone: 'Europe/Tallinn',
          clientUtcOffsetMinutes: 180,
          questionCount: 1,
          score: 0,
          elapsedSeconds: 60,
          seed: 42,
          runnerId: 'math',
          questionIds: generated.map((question) => question.id),
          questions: generated.map((question) => ({ ...question, userAnswer: answerFor(question), isCorrect: false }))
        }]
      }
    });

    expect(response.attemptResults[0]).toMatchObject({ status: 'rejected' });
    expect(response.attemptResults[1]).toMatchObject({ status: 'created' });
    const stored = db.prepare('SELECT protocolVersion, score, questionCount FROM attempts').get() as { protocolVersion: number; score: number; questionCount: number };
    expect(stored).toEqual({ protocolVersion: 2, score: 1, questionCount: 1 });
  });
});
