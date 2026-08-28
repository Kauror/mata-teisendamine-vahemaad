import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import { generateKiurMathSession } from '@/lib/exercises/kiurMath';
import { buildKirsiPictureWordQuestion, KIRSI_READING_PAIRS } from '@/lib/kirsiReadingPairs';
import { updateChildLearningExerciseStatus } from '@/lib/learningExercises';
import { runSyncPullV2, runSyncPushV2 } from '@/lib/offline/server/syncService';
import { writeTombstone } from '@/lib/offline/server/tombstones';
import { getOfflineRunnerCapability } from '@/lib/offline/capabilities';
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
    DELETE FROM attempt_tombstones;
    DELETE FROM catalogue_grants;
    DELETE FROM offline_catalog_versions;
    DELETE FROM reward_policy_current;
    DELETE FROM reward_policy_versions;
  `);
  db.pragma('foreign_keys = ON');
  updateChildLearningExerciseStatus('kiur.math.mootuhikud-pikkused', 'kiur', 'permanent');
  updateChildLearningExerciseStatus('kirsi.reading.pilt-ja-sona', 'kirsi', 'permanent');
});

describe('protocol-v2 attempt writes', () => {
  it('continues pulling when more than one tombstone page exists', () => {
    const insertTombstones = db.transaction(() => {
      for (let index = 0; index < 301; index += 1) writeTombstone(null, `deleted-${index}`);
    });
    insertTombstones();

    const first = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor() });
    expect(first.pull.tombstones).toHaveLength(300);
    expect(first.hasMore.tombstones).toBe(true);
    expect(first.nextCursor.lastTombstoneId).toBe(first.pull.tombstones.at(-1)?.tombstoneId);

    const second = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: first.nextCursor });
    expect(second.pull.tombstones).toHaveLength(1);
    expect(second.pull.tombstones[0].clientAttemptId).toBe('deleted-300');
    expect(second.hasMore.tombstones).toBe(false);
    expect(second.nextCursor.lastTombstoneId).toBe(second.pull.tombstones[0].tombstoneId);
  });

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

  it('accepts the picture-word runner payload through the full sync contract', () => {
    const pull = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor() });
    const catalogue = pull.pull.catalogues?.kirsi;
    const grant = pull.pull.catalogueGrants?.kirsi;
    const entry = catalogue?.entries.find((candidate) => candidate.id === 'kirsi.reading.pilt-ja-sona');
    const capability = getOfflineRunnerCapability('kirsi-picture-word');
    expect(entry).toBeTruthy();
    expect(grant).toBeTruthy();
    expect(capability).toBeTruthy();

    const pair = KIRSI_READING_PAIRS[0];
    const questionId = `run:0:0:${pair.id}`;
    const completedAt = new Date(Date.now() - 60_000).toISOString();
    const response = runSyncPushV2({
      protocolVersion: 2,
      phase: 'push',
      pushKind: 'attempts',
      device: device(),
      cursor: cursor(),
      pending: {
        attempts: [{
          clientAttemptId: '018f47f6-9f2c-7b9a-8a2e-fedcbafedcba',
          deviceId,
          learner: 'kirsi',
          subject: entry!.subject,
          topic: entry!.topic,
          category: entry!.category,
          difficulty: 'Sprint',
          exerciseId: entry!.id,
          catalogueVersion: catalogue!.version,
          rewardPolicyVersion: grant!.rewardPolicyVersion,
          generatorVersion: capability!.generatorVersion,
          runnerVersion: capability!.runnerVersion,
          rotationVersion: capability!.rotationVersion,
          startedAt: completedAt,
          rawDeviceCompletedAt: completedAt,
          completedAt,
          clientCorrectedCompletedAt: completedAt,
          clientTimeZone: 'Europe/Tallinn',
          clientUtcOffsetMinutes: 180,
          questionCount: 1,
          score: 0,
          elapsedSeconds: 10,
          seed: 1,
          runnerId: capability!.runnerId,
          questionIds: [questionId],
          questions: [{
            taskId: questionId,
            id: questionId,
            question: buildKirsiPictureWordQuestion(pair),
            userAnswer: pair.word,
            selectedWord: pair.word,
            correctWord: pair.word,
            vocabularyId: pair.id,
            isCorrect: false,
            kind: 'choice',
            image: pair.image,
            correctAnswer: 0
          }]
        }]
      }
    });

    expect(response.attemptResults[0]).toMatchObject({ status: 'created' });
    const stored = db.prepare('SELECT score, questionCount FROM attempts WHERE clientAttemptId = ?')
      .get('018f47f6-9f2c-7b9a-8a2e-fedcbafedcba');
    expect(stored).toEqual({ score: 1, questionCount: 1 });
  });

  // Regression: an unchanged exercise pool keeps its catalogue version, so the
  // grant row was written once and never touched again while the catalogue
  // window kept rolling forward. Thirty days later every ordinary attempt was
  // held as `completion_after_grant`, which also emptied that child's day on the
  // daily leaderboard.
  it('re-extends the grant of a device that keeps syncing an unchanged catalogue', () => {
    runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor() });
    const original = db.prepare('SELECT issuedAt, validUntil FROM catalogue_grants WHERE learner = ?').get('kiur') as { issuedAt: string; validUntil: string };
    db.prepare('UPDATE catalogue_grants SET validUntil = ? WHERE learner = ?')
      .run(new Date(Date.now() - 2 * 86_400_000).toISOString(), 'kiur');

    const pull = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor() });
    const served = pull.pull.catalogueGrants?.kiur;
    const stored = db.prepare('SELECT issuedAt, validUntil FROM catalogue_grants WHERE learner = ?').get('kiur') as { issuedAt: string; validUntil: string };

    // The row the server validates against is the contract the device was handed.
    expect(stored.validUntil).toBe(served?.validUntil);
    expect(stored.validUntil).toBe(pull.pull.catalogues?.kiur?.validUntil);
    expect(new Date(stored.validUntil).getTime()).toBeGreaterThan(Date.now());
    // Only the window moves; when this catalogue version first appeared does not.
    expect(stored.issuedAt).toBe(original.issuedAt);
  });

  it('settles an attempt made after the original grant window instead of holding it', () => {
    runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor() });
    db.prepare('UPDATE catalogue_grants SET validUntil = ? WHERE learner = ?')
      .run(new Date(Date.now() - 2 * 86_400_000).toISOString(), 'kiur');

    const pull = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor() });
    const catalogue = pull.pull.catalogues!.kiur!;
    const grant = pull.pull.catalogueGrants!.kiur!;
    const entry = catalogue.entries.find((candidate) => candidate.id === 'kiur.math.mootuhikud-pikkused')!;
    const generated = generateKiurMathSession(entry.topic, entry.category, 'Lihtne', 1, 7);
    const completedAt = new Date(Date.now() - 60_000).toISOString();

    const response = runSyncPushV2({
      protocolVersion: 2,
      phase: 'push',
      pushKind: 'attempts',
      device: device(),
      cursor: cursor(),
      pending: {
        attempts: [{
          clientAttemptId: '018f47f6-9f2c-7b9a-8a2e-0123456789ab',
          deviceId,
          learner: 'kiur',
          subject: entry.subject,
          topic: entry.topic,
          category: entry.category,
          difficulty: 'Lihtne',
          exerciseId: entry.id,
          catalogueVersion: catalogue.version,
          rewardPolicyVersion: grant.rewardPolicyVersion,
          generatorVersion: grant.generatorVersion,
          runnerVersion: 'math-v1',
          rotationVersion: grant.rotationVersion,
          startedAt: completedAt,
          rawDeviceCompletedAt: completedAt,
          completedAt,
          clientCorrectedCompletedAt: completedAt,
          clientTimeZone: 'Europe/Tallinn',
          clientUtcOffsetMinutes: 180,
          questionCount: 1,
          score: 1,
          elapsedSeconds: 60,
          seed: 7,
          runnerId: 'math',
          questionIds: generated.map((question) => question.id),
          questions: generated.map((question) => ({ ...question, userAnswer: answerFor(question), isCorrect: true }))
        }]
      }
    });

    expect(response.attemptResults[0]).toMatchObject({ status: 'created' });
    const stored = db.prepare('SELECT rewardSettlementStatus, reviewReasonCode FROM attempts WHERE clientAttemptId = ?')
      .get('018f47f6-9f2c-7b9a-8a2e-0123456789ab');
    expect(stored).toEqual({ rewardSettlementStatus: 'eligible', reviewReasonCode: null });
  });

  it('never materializes a hidden attempt through normal or changed-attempt pulls', () => {
    db.prepare(`INSERT INTO attempts (createdAt, completedAt, category, difficulty, questionCount, score, elapsedSeconds, questions, learner, subject, clientAttemptId, protocolVersion, rewardSettlementStatus, deletedAt)
      VALUES (?, ?, 'x', 'x', 1, 1, 1, '[]', 'kiur', 'matemaatika', ?, 2, 'eligible', ?)`)
      .run('2026-07-13T10:00:00.000Z', '2026-07-13T10:00:00.000Z', 'hidden-attempt', '2026-07-13T11:00:00.000Z');
    const pull = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor() });
    expect(pull.pull.attempts.find((row) => row.clientAttemptId === 'hidden-attempt')).toBeUndefined();
  });
});
