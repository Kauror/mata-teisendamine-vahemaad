import { createHash } from 'node:crypto';
import { vi } from 'vitest';
import db from '@/lib/db';
import { generateKiurMathSession } from '@/lib/exercises/kiurMath';
import { getOfflineRunnerCapability } from '@/lib/offline/capabilities';
import type { InsertAttemptInput } from '@/lib/offline/server/insertAttempt';
import { runSyncPullV2 } from '@/lib/offline/server/syncService';
import type { GeneratedQuestion } from '@/lib/types';

// Test-only. Real protocol-v2 submissions for insertAttempt: a served catalogue
// grant, a seeded maths runner and answers the server re-scores. Callers fake
// Date (vi.useFakeTimers({ toFake: ['Date'] })) so the grant can be served
// before the attempts it covers, and set OFFLINE_PROTOCOL_V2_ENABLED=1.

export const FIXTURE_DEVICE_ID = '018f47f6-9f2c-7b9a-8a2e-0000000000b1';
export const FIXTURE_EXERCISE = 'kiur.math.mootuhikud-pikkused';
const GRANT_TIME = '2026-07-11T06:00:00.000Z';
export const FIXTURE_NOW = '2026-07-14T12:00:00.000Z';

export function resetAttemptData() {
  db.pragma('foreign_keys = OFF');
  db.exec(`
    DELETE FROM attempt_reward_components; DELETE FROM reward_projection_runs; DELETE FROM point_ledger;
    DELETE FROM study_attempt_rewards; DELETE FROM streak_bonus_awards; DELETE FROM reward_rule_awards;
    DELETE FROM mistake_pool; DELETE FROM attempts; DELETE FROM daily_leaderboard;
    DELETE FROM catalogue_grants; DELETE FROM offline_catalog_versions; DELETE FROM attempt_tombstones;
  `);
  db.pragma('foreign_keys = ON');
}

export type ServedGrant = ReturnType<typeof serveGrant>;

// Serves Kiur's catalogue + grant at GRANT_TIME, then moves the clock to NOW.
export function serveGrant() {
  vi.setSystemTime(new Date(GRANT_TIME));
  const pull = runSyncPullV2({
    protocolVersion: 2,
    phase: 'pull',
    device: { deviceId: FIXTURE_DEVICE_ID, appVersion: 'insert-attempt-test', timeZone: 'Europe/Tallinn', clientNow: GRANT_TIME },
    cursor: { lastServerAttemptId: 0, lastTombstoneId: 0, lastTaskChangeId: 0, lastRemediationChangeId: 0, lastAttemptChangeId: 0, historyEpoch: 0, catalogueVersions: {} }
  });
  vi.setSystemTime(new Date(FIXTURE_NOW));
  return { catalogue: pull.pull.catalogues!.kiur!, grant: pull.pull.catalogueGrants!.kiur! };
}

// A stable RFC 4122 v4 id per label, as the v2 contract requires.
export function cid(label: string) {
  const hex = createHash('sha256').update(label).digest('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-8${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

function answerFor(question: GeneratedQuestion) {
  if (question.kind === 'choice' && question.choiceOptions) return question.choiceOptions[question.correctAnswer];
  if (question.kind === 'text' || question.correctAnswerText) return question.correctAnswerText;
  return String(question.correctAnswer);
}

export function v2Attempt(served: ServedGrant, label: string, completedAt: string, correct = 14): InsertAttemptInput {
  const entry = served.catalogue.entries.find((candidate) => candidate.id === FIXTURE_EXERCISE)!;
  const capability = getOfflineRunnerCapability('math')!;
  const seed = 42;
  const generated = generateKiurMathSession(entry.topic, entry.category, 'Lihtne', 15, seed);
  return {
    protocolVersion: 2,
    clientAttemptId: cid(label),
    deviceId: FIXTURE_DEVICE_ID,
    learner: 'kiur',
    subject: entry.subject,
    topic: entry.topic,
    category: entry.category,
    difficulty: 'Lihtne',
    exerciseId: entry.id,
    catalogueVersion: served.catalogue.version,
    rewardPolicyVersion: served.grant.rewardPolicyVersion,
    generatorVersion: capability.generatorVersion,
    runnerVersion: capability.runnerVersion,
    rotationVersion: served.grant.rotationVersion,
    runnerId: 'math',
    seed,
    startedAt: completedAt,
    rawDeviceCompletedAt: completedAt,
    completedAt,
    clientCorrectedCompletedAt: completedAt,
    clientTimeZone: 'Europe/Tallinn',
    clientUtcOffsetMinutes: 180,
    questionCount: generated.length,
    score: correct,
    elapsedSeconds: 100,
    questionIds: generated.map((question) => question.id),
    questions: generated.map((question, index) => ({ ...question, userAnswer: index < correct ? answerFor(question) : 'vale' }))
  };
}
