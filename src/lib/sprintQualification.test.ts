import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import { qualifySprintsPure, recomputeSprintQualifications, sprintQualificationForAttempt } from '@/lib/sprintQualification';
import { approveHeldRewardAttempt } from '@/lib/server/rewards/projection';

const row = (id: number, score: number, completedAt: string, clientAttemptId: string) => ({
  id, score, effectiveCompletedAt: completedAt, createdAt: completedAt, clientAttemptId
});

describe('Kiur sprint qualification', () => {
  it('uses completion order rather than server arrival order', () => {
    const chronological = [
      row(100, 40, '2026-07-01T10:00:00.000Z', 'a'),
      row(101, 1, '2026-07-01T10:01:00.000Z', 'b')
    ];
    const reverseArrival = [
      row(1, 1, '2026-07-01T10:01:00.000Z', 'b'),
      row(2, 40, '2026-07-01T10:00:00.000Z', 'a')
    ];
    const first = [...qualifySprintsPure(chronological).values()].map((item) => ({ record: item.recordBeforeRun, qualified: item.qualified }));
    const second = [...qualifySprintsPure(reverseArrival).values()].map((item) => ({ record: item.recordBeforeRun, qualified: item.qualified }));
    expect(first).toEqual([{ record: 0, qualified: false }, { record: 40, qualified: false }]);
    expect(second).toEqual(first);
  });

  it('uses clientAttemptId then server id only to break exact timestamp ties', () => {
    const qualification = qualifySprintsPure([
      row(2, 20, '2026-07-01T10:00:00.000Z', 'b'),
      row(1, 12, '2026-07-01T10:00:00.000Z', 'a')
    ]);
    expect(qualification.get(1)).toMatchObject({ recordBeforeRun: 0, qualified: false });
    expect(qualification.get(2)).toMatchObject({ recordBeforeRun: 12, requiredScore: 6, qualified: true });
  });
});

const sprintPolicy = {
  schemaVersion: 2,
  learning: {
    baseValue: 1, decayStep: 0.1, minimumValue: 0, dailyCap: 10, minimumScorePercent: 0.5,
    learningPointsEnabled: true, streakIntervalDays: 7, streakBonusAmount: 1, streakBonusEnabled: true
  },
  rules: []
};

function insertSprint(id: number, at: string, score: number, status: 'eligible' | 'needs_review', deletedAt: string | null = null) {
  db.prepare(`
    INSERT INTO attempts (
      id, createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions, learner, subject, topic,
      exerciseId, runnerId, clientAttemptId, completedAt, effectiveCompletedAt, completionDate, rewardPolicyVersion,
      protocolVersion, rewardSettlementStatus, deletedAt
    ) VALUES (?, ?, 'Inglise keel - sprint', 'Lihtne', ?, ?, 60, '[]', 'kiur', 'inglise-keel', 'sprint',
      'sprint', 'sprint', ?, ?, ?, ?, 'p1', 2, ?, ?)
  `).run(id, at, score, score, `c${id}`, at, at, at.slice(0, 10), status, deletedAt);
}

describe('Kiur sprint qualification in the database', () => {
  beforeEach(() => {
    db.exec(`
      DELETE FROM attempt_reward_components;
      DELETE FROM reward_projection_runs;
      DELETE FROM study_attempt_rewards;
      DELETE FROM point_ledger;
      DELETE FROM daily_leaderboard;
      DELETE FROM attempts;
      DELETE FROM reward_policy_versions;
    `);
    db.prepare(`INSERT INTO reward_policy_versions (version, contentHash, policyJson, createdAt) VALUES ('p1', 'hash-p1', ?, ?)`)
      .run(JSON.stringify(sprintPolicy), '2026-01-01T00:00:00.000Z');
  });

  it('qualifies, rewards and counts a held sprint once the parent approves it (SRV-03)', () => {
    insertSprint(1, '2026-10-01T08:00:00.000Z', 10, 'eligible');
    recomputeSprintQualifications();
    insertSprint(2, '2026-10-02T08:00:00.000Z', 9, 'needs_review');
    recomputeSprintQualifications(); // what insertAttempt does for a held sprint
    expect(db.prepare('SELECT sprintQualified FROM attempts WHERE id = 2').get()).toEqual({ sprintQualified: null });

    approveHeldRewardAttempt(2);

    // Record 10 → half-of-record threshold 5; 9 clears it.
    expect(sprintQualificationForAttempt(2)).toMatchObject({ recordBeforeRun: 10, requiredScore: 5, qualified: true });
    const stars = db.prepare("SELECT COALESCE(SUM(amount), 0) AS total FROM point_ledger WHERE source = 'reward_v2' AND sourceId = 2")
      .get() as { total: number };
    expect(stars.total).toBeGreaterThan(0);
    expect(db.prepare("SELECT kiurCount FROM daily_leaderboard WHERE date = '2026-10-02'").get()).toEqual({ kiurCount: 1 });
  });

  it('an approved held record revises a later sprint and its leaderboard day', () => {
    insertSprint(1, '2026-10-01T08:00:00.000Z', 4, 'eligible');
    insertSprint(2, '2026-10-02T08:00:00.000Z', 20, 'needs_review');
    insertSprint(3, '2026-10-03T08:00:00.000Z', 3, 'eligible');
    recomputeSprintQualifications();
    expect(sprintQualificationForAttempt(3)).toMatchObject({ qualified: true });

    approveHeldRewardAttempt(2);

    // With record 20 the threshold is 10, so the score-3 run no longer qualifies.
    expect(sprintQualificationForAttempt(3)).toMatchObject({ recordBeforeRun: 20, qualified: false });
    expect(db.prepare("SELECT kiurCount FROM daily_leaderboard WHERE date = '2026-10-03'").get()).toEqual({ kiurCount: 0 });
  });

  it('hiding a sprint from history does not change the standing record (SRV-04)', () => {
    insertSprint(1, '2026-10-01T08:00:00.000Z', 10, 'eligible', '2026-10-05T08:00:00.000Z');
    insertSprint(2, '2026-10-02T08:00:00.000Z', 4, 'eligible');
    recomputeSprintQualifications();
    expect(sprintQualificationForAttempt(2)).toMatchObject({ recordBeforeRun: 10, requiredScore: 5, qualified: false });
  });
});
