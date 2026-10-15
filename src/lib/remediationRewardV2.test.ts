import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import db from '@/lib/db';
import { getLearningPointSettings, updateLearningPointSettings } from '@/lib/learningPoints';
import { captureMistakesForAttempt, startRemediationSession, submitRemediationSession } from '@/lib/remediation';
import { ensureCurrentRewardPolicy, REWARD_ENGINE_VERSION } from '@/lib/server/rewards/policy';
import { applyRewardProjectionV2 } from '@/lib/server/rewards/projection';
import { getBalance, type Learner } from '@/lib/tasks';

// SRV-06: Kordamine is settled by the protocol-v2 reward projection, so it
// shares the one daily cap and the one streak with every other exercise, and
// sessions completed under the old v1 engine keep exactly what they were paid.

const TODAY = '2026-07-20';
const NOW = `${TODAY}T09:00:00.000Z`;
const DEFAULTS = getLearningPointSettings();

beforeAll(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(NOW));
});
afterAll(() => {
  vi.useRealTimers();
});

beforeEach(() => {
  db.pragma('foreign_keys = OFF');
  for (const table of [
    'remediation_session_items', 'remediation_sessions', 'mistake_pool', 'attempt_reward_components',
    'reward_projection_runs', 'study_attempt_rewards', 'streak_bonus_awards', 'reward_rule_awards',
    'point_ledger', 'attempts', 'daily_leaderboard', 'server_change_log'
  ]) db.prepare(`DELETE FROM ${table}`).run();
  db.pragma('foreign_keys = ON');
  updateLearningPointSettings(DEFAULTS);
});

let seq = 0;

// One ordinary v2 exercise, settled the way insertAttempt settles it.
function v2Exercise(learner: Learner, completedAt: string, score = 10) {
  const policy = ensureCurrentRewardPolicy();
  seq += 1;
  const id = Number(db.prepare(`
    INSERT INTO attempts (
      createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions, learner, subject, topic,
      exerciseId, runnerId, clientAttemptId, completedAt, effectiveCompletedAt, completionDate,
      rewardPolicyVersion, rewardEngineVersion, protocolVersion, rewardSettlementStatus
    ) VALUES (?, 'Korrutamine', 'Lihtne', 10, ?, 60, '[]', ?, 'matemaatika', 'korrutamine', ?, 'math', ?, ?, ?, ?, ?, ?, 2, 'eligible')
  `).run(completedAt, score, learner, `exercise-${seq}`, `client-${seq}`, completedAt, completedAt, completedAt.slice(0, 10),
    policy.version, REWARD_ENGINE_VERSION).lastInsertRowid);
  db.transaction(() => applyRewardProjectionV2(learner, id))();
  return id;
}

function seedMistakes(learner: Learner, count = 15) {
  const attemptId = Number(db.prepare(`
    INSERT INTO attempts (createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions, learner, subject, topic)
    VALUES ('2026-07-01T10:00:00.000Z', 'Segaharjutus', 'Lihtne', 15, 0, 60, '[]', ?, 'matemaatika', 'arvud-10000')
  `).run(learner).lastInsertRowid);
  captureMistakesForAttempt({
    attemptId, learner, subject: 'matemaatika', topic: 'arvud-10000', category: 'Segaharjutus',
    questions: Array.from({ length: count }, (_, index) => ({
      id: `n-${index}`, question: `Arvuta: ${index} + ${index}`, correctAnswer: index * 2, userAnswer: String(index * 2 + 1), isCorrect: false
    }))
  });
}

function completeRemediation(learner: Learner, correct = true) {
  seedMistakes(learner);
  const session = startRemediationSession(learner);
  return submitRemediationSession({
    learner,
    sessionId: session.sessionId,
    answers: session.questions.map((question) => ({ sessionItemId: question.sessionItemId, answer: correct ? question.correctAnswerLabel : 'vale' })),
    elapsedSeconds: 60
  });
}

function ledgerSum(learner: Learner, where = '1 = 1') {
  return (db.prepare(`SELECT COALESCE(SUM(amount), 0) AS total FROM point_ledger WHERE learner = ? AND ${where}`).get(learner) as { total: number }).total;
}

describe('Kordamine on the v2 reward engine', () => {
  it('writes a protocol-v2 eligible attempt and no legacy ledger rows', () => {
    const result = completeRemediation('kiur');
    const row = db.prepare('SELECT protocolVersion, rewardSettlementStatus, completionDate, runnerId, exerciseId, clientAttemptId FROM attempts WHERE id = ?')
      .get(result.historyAttemptId);
    expect(row).toEqual({
      protocolVersion: 2, rewardSettlementStatus: 'eligible', completionDate: TODAY,
      runnerId: 'remediation', exerciseId: 'kiur.remediation.mixed', clientAttemptId: expect.stringMatching(/^remediation:\d+$/)
    });
    expect(result.reward).toEqual({ awardedAmount: 1, balanceAfter: 1, capReached: false });
    expect(ledgerSum('kiur', "source IN ('study_exercise', 'streak_bonus', 'reward_streak')")).toBe(0);
    expect(ledgerSum('kiur', "source = 'reward_v2'")).toBe(1);
  });

  it('shares the one daily cap with the other exercises: 9 + Kordamine stops at 10', () => {
    for (let index = 0; index < 9; index++) v2Exercise('kiur', `${TODAY}T0${index}:00:00.000Z`);
    expect(getBalance('kiur')).toBe(9);

    const first = completeRemediation('kiur');
    expect(first.reward).toEqual({ awardedAmount: 1, balanceAfter: 10, capReached: false });

    // The second Kordamine would earn 0.9 (decay) but the shared cap is full.
    const second = completeRemediation('kiur');
    expect(second.reward).toEqual({ awardedAmount: 0, balanceAfter: 10, capReached: true });

    // A later ordinary exercise is capped too: the cap counts Kordamine.
    v2Exercise('kiur', `${TODAY}T08:59:00.000Z`);
    expect(getBalance('kiur')).toBe(10);
  });

  it('caps a half-star remainder exactly like any other exercise', () => {
    updateLearningPointSettings({ ...DEFAULTS, dailyCap: 9.5 });
    for (let index = 0; index < 9; index++) v2Exercise('kiur', `${TODAY}T0${index}:00:00.000Z`);
    const result = completeRemediation('kiur');
    expect(result.reward).toEqual({ awardedAmount: 0.5, balanceAfter: 9.5, capReached: true });
  });

  it('awards the streak bonus once per day, not once per engine', () => {
    updateLearningPointSettings({ ...DEFAULTS, streakIntervalDays: 1, streakBonusAmount: 2 });
    v2Exercise('kiur', `${TODAY}T06:00:00.000Z`);
    completeRemediation('kiur');

    const streakComponents = db.prepare("SELECT COUNT(*) AS count FROM attempt_reward_components WHERE componentKey = 'streak:standard' AND canonicalAmount > 0").get() as { count: number };
    expect(streakComponents.count).toBe(1);
    expect(ledgerSum('kiur', "source = 'streak_bonus'")).toBe(0);
    // 1 (exercise) + 1 (Kordamine) + 2 (one streak bonus).
    expect(getBalance('kiur')).toBe(4);
  });

  it('a Kordamine-only day earns that day\'s streak bonus on the Kordamine', () => {
    updateLearningPointSettings({ ...DEFAULTS, streakIntervalDays: 1, streakBonusAmount: 2 });
    const result = completeRemediation('kiur');
    expect(result.reward?.awardedAmount).toBe(3);
    expect(getBalance('kiur')).toBe(3);
  });

  it('counts in the daily leaderboard for its own day, without the route', () => {
    v2Exercise('kirsi', `${TODAY}T06:00:00.000Z`);
    completeRemediation('kiur');
    completeRemediation('kiur', false);
    // Kiur: two Kordamine (the second scored 0 — it still counts as an
    // exercise, as before) plus the seed rows from 2026-07-01, which are not today.
    const row = db.prepare('SELECT kiurCount, kirsiCount, winner FROM daily_leaderboard WHERE date = ?').get(TODAY);
    expect(row).toEqual({ kiurCount: 2, kirsiCount: 1, winner: 'kiur' });
  });

  it('rolls the whole submission back when settlement fails', () => {
    seedMistakes('kiur');
    const session = startRemediationSession('kiur');
    db.exec('DROP TABLE IF EXISTS daily_leaderboard_backup; ALTER TABLE daily_leaderboard RENAME TO daily_leaderboard_backup');
    try {
      expect(() => submitRemediationSession({
        learner: 'kiur', sessionId: session.sessionId,
        answers: session.questions.map((question) => ({ sessionItemId: question.sessionItemId, answer: question.correctAnswerLabel })),
        elapsedSeconds: 60
      })).toThrow();
    } finally {
      db.exec('ALTER TABLE daily_leaderboard_backup RENAME TO daily_leaderboard');
    }
    expect(db.prepare("SELECT COUNT(*) AS count FROM attempts WHERE category = 'Kordamine'").get()).toEqual({ count: 0 });
    expect(getBalance('kiur')).toBe(0);
    expect(db.prepare('SELECT completedAt FROM remediation_sessions WHERE id = ?').get(session.sessionId)).toEqual({ completedAt: null });
  });

  it('a resubmitted session reports its reward without settling again', () => {
    const first = completeRemediationOnce();
    const ledgerRows = (db.prepare('SELECT COUNT(*) AS count FROM point_ledger').get() as { count: number }).count;
    const again = submitRemediationSession({ learner: 'kiur', sessionId: first.sessionId, answers: [], elapsedSeconds: 0 });
    expect(again.historyAttemptId).toBe(first.result.historyAttemptId);
    expect(again.reward).toEqual(first.result.reward);
    expect((db.prepare('SELECT COUNT(*) AS count FROM point_ledger').get() as { count: number }).count).toBe(ledgerRows);
  });
});

function completeRemediationOnce() {
  seedMistakes('kiur');
  const session = startRemediationSession('kiur');
  const result = submitRemediationSession({
    learner: 'kiur', sessionId: session.sessionId,
    answers: session.questions.map((question) => ({ sessionItemId: question.sessionItemId, answer: question.correctAnswerLabel })),
    elapsedSeconds: 60
  });
  return { sessionId: session.sessionId, result };
}

describe('Kordamine sessions completed under the v1 engine', () => {
  // The exact shape the old submitRemediationSession left behind: a v1 attempt,
  // its study_exercise row, a v1 streak bonus and the study_attempt_rewards row.
  function legacySession(learner: Learner, completedAt: string) {
    const attemptId = Number(db.prepare(`
      INSERT INTO attempts (createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions, learner, subject, topic)
      VALUES (?, 'Kordamine', 'Tavaline', 15, 15, 60, '[]', ?, 'kordamine', 'kordamine')
    `).run(completedAt, learner).lastInsertRowid);
    const study = Number(db.prepare(`
      INSERT INTO point_ledger (learner, amount, source, sourceId, description, createdAt, metadataJson)
      VALUES (?, 0.9, 'study_exercise', ?, 'Harjutus: Kordamine', ?, '{}')
    `).run(learner, attemptId, completedAt).lastInsertRowid);
    db.prepare(`
      INSERT INTO point_ledger (learner, amount, source, sourceId, description, createdAt, metadataJson)
      VALUES (?, 1, 'streak_bonus', ?, 'Õpiseeria boonus: 7 päeva', ?, '{}')
    `).run(learner, attemptId, completedAt);
    db.prepare(`
      INSERT INTO study_attempt_rewards (attemptId, learner, exerciseKey, score, questionCount, scorePercent,
        baseValueBeforeScore, earnedBeforeCap, awardedAmount, dailyCap, dailyLearningEarnedBefore,
        dailyLearningEarnedAfter, decayAttemptNumberToday, ledgerEntryId, createdAt, metadataJson)
      VALUES (?, ?, 'kiur.remediation.mixed', 15, 15, 1, 0.9, 0.9, 0.9, 10, 0, 0.9, 2, ?, ?, ?)
    `).run(attemptId, learner, study, completedAt, JSON.stringify({ balanceAfterAward: 1.9 }));
    const sessionId = Number(db.prepare(`
      INSERT INTO remediation_sessions (learner, startedAt, completedAt, score, questionCount, historyAttemptId, earnedStars)
      VALUES (?, ?, ?, 15, 15, ?, 0.9)
    `).run(learner, completedAt, completedAt, attemptId).lastInsertRowid);
    return { attemptId, sessionId };
  }

  it('keeps every legacy row and the balance exactly, through new v2 activity and reprojection', () => {
    const yesterday = legacySession('kiur', '2026-07-19T10:00:00.000Z');
    const today = legacySession('kiur', `${TODAY}T05:00:00.000Z`);
    const snapshot = () => db.prepare("SELECT id, amount, source, createdAt FROM point_ledger WHERE source <> 'reward_v2' ORDER BY id").all();
    const before = snapshot();
    const balanceBefore = getBalance('kiur');
    expect(balanceBefore).toBe(3.8);

    v2Exercise('kiur', `${TODAY}T06:00:00.000Z`);
    completeRemediation('kiur');

    expect(snapshot()).toEqual(before);
    expect(db.prepare('SELECT protocolVersion FROM attempts WHERE id IN (?, ?)').all(yesterday.attemptId, today.attemptId))
      .toEqual([{ protocolVersion: 1 }, { protocolVersion: 1 }]);
    expect(db.prepare('SELECT COUNT(*) AS count FROM attempt_reward_components WHERE attemptId IN (?, ?)').get(yesterday.attemptId, today.attemptId))
      .toEqual({ count: 0 });
    // The new activity adds exactly its own v2 awards on top: 1 + 1. The legacy
    // 0.9 earned today does not count toward the v2 cap (it was settled by the
    // retired engine), which is the one-day transition effect.
    expect(getBalance('kiur')).toBe(balanceBefore + 2);
  });

  it('a resubmitted legacy session reports its legacy reward and never awards it again', () => {
    const legacy = legacySession('kiur', '2026-07-19T10:00:00.000Z');
    const rows = (db.prepare('SELECT COUNT(*) AS count FROM point_ledger').get() as { count: number }).count;
    const result = submitRemediationSession({ learner: 'kiur', sessionId: legacy.sessionId, answers: [], elapsedSeconds: 0 });
    expect(result.historyAttemptId).toBe(legacy.attemptId);
    expect(result.reward).toEqual({ awardedAmount: 0.9, balanceAfter: 1.9, capReached: false });
    expect((db.prepare('SELECT COUNT(*) AS count FROM point_ledger').get() as { count: number }).count).toBe(rows);
  });
});
