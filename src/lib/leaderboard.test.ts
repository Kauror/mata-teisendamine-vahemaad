import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import type { RewardPolicyV2 } from '@/lib/server/rewards/policy';
import { getLeaderboardHistory, rebuildDailyLeaderboard, recordDailyLeaderboard } from '@/lib/leaderboard';
import { approveHeldRewardAttempt } from '@/lib/server/rewards/projection';
import { getMonthlyTrophies } from '@/lib/monthlyCompetition';
import { deleteAttempt } from '@/lib/historyMaintenance';

// Reward engine and leaderboard must apply the SAME eligibility gate. These
// tests exercise the leaderboard side of RTM3-C01: a held protocol-v2 attempt
// still living in `attempts` must never move the daily winner, the trophy count
// or the monthly standings, even when a later valid attempt (or the backfill)
// recalculates the same date.

const policy: RewardPolicyV2 = {
  schemaVersion: 2,
  learning: {
    baseValue: 1, decayStep: 0.1, minimumValue: 0, dailyCap: 10, minimumScorePercent: 0.5,
    learningPointsEnabled: true, streakIntervalDays: 2, streakBonusAmount: 2, streakBonusEnabled: true
  },
  rules: []
};

type Settlement = 'eligible' | 'withheld' | 'needs_review';

let nextId = 1;

function insertLeaderboardAttempt(
  learner: 'kiur' | 'kirsi',
  completedAt: string,
  settlement: Settlement,
  options: { protocolVersion?: 1 | 2; score?: number } = {}
) {
  const id = nextId++;
  const protocolVersion = options.protocolVersion ?? 2;
  const score = options.score ?? 10;
  db.prepare(`
    INSERT INTO attempts (
      id, createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions,
      learner, subject, topic, exerciseId, runnerId, clientAttemptId, completedAt, effectiveCompletedAt,
      completionDate, rewardPolicyVersion, protocolVersion, rewardSettlementStatus
    ) VALUES (?, ?, 'Korrutamine', 'Lihtne', 10, ?, 100, '[]', ?, 'matemaatika', 'korrutamine', 'exercise', 'math', ?, ?, ?, ?, 'p1', ?, ?)
  `).run(
    id,
    completedAt,
    score,
    learner,
    `client-${id}`,
    completedAt,
    completedAt,
    completedAt.slice(0, 10),
    protocolVersion,
    settlement
  );
  return id;
}

function countsFor(date: string) {
  const row = db
    .prepare('SELECT kiurCount, kirsiCount, winner FROM daily_leaderboard WHERE date = ?')
    .get(date) as { kiurCount: number; kirsiCount: number; winner: string } | undefined;
  return row ?? { kiurCount: 0, kirsiCount: 0, winner: 'tie' };
}

beforeEach(() => {
  nextId = 1;
  db.pragma('foreign_keys = OFF');
  db.exec(`
    DELETE FROM attempt_reward_components;
    DELETE FROM reward_projection_runs;
    DELETE FROM study_attempt_rewards;
    DELETE FROM point_ledger;
    DELETE FROM attempts;
    DELETE FROM daily_leaderboard;
    DELETE FROM reward_policy_current;
    DELETE FROM reward_policy_versions;
  `);
  db.pragma('foreign_keys = ON');
  db.prepare(`INSERT INTO reward_policy_versions (version, contentHash, policyJson, createdAt) VALUES ('p1', 'hash-p1', ?, ?)`)
    .run(JSON.stringify(policy), '2026-01-01T00:00:00.000Z');
});

describe('daily leaderboard eligibility gate (RTM3-C01)', () => {
  it('keeps a hidden authoritative attempt in historical competition results', () => {
    const date = '2026-03-09';
    const id = insertLeaderboardAttempt('kiur', `${date}T08:00:00.000Z`, 'eligible');
    recordDailyLeaderboard(date);
    expect(countsFor(date)).toMatchObject({ kiurCount: 1, winner: 'kiur' });

    deleteAttempt(id);
    recordDailyLeaderboard(date);

    expect(countsFor(date)).toMatchObject({ kiurCount: 1, winner: 'kiur' });
  });

  it('a needs_review attempt does not affect the daily winner', () => {
    const date = '2026-03-10';
    // Kiur and Kirsi each have one authoritative attempt → a genuine tie.
    insertLeaderboardAttempt('kiur', `${date}T08:00:00.000Z`, 'eligible');
    insertLeaderboardAttempt('kirsi', `${date}T09:00:00.000Z`, 'eligible');
    // Kirsi also has a held attempt that would tip the day in her favour if it
    // were ever counted.
    insertLeaderboardAttempt('kirsi', `${date}T10:00:00.000Z`, 'needs_review');

    recordDailyLeaderboard(date);

    const { kiurCount, kirsiCount, winner } = countsFor(date);
    expect(kiurCount).toBe(1);
    expect(kirsiCount).toBe(1);
    expect(winner).toBe('tie');
  });

  it('a held attempt does not affect monthly trophies', () => {
    // A finished past month so the day is final and its trophy is settled.
    const day = '2026-03-05';
    // Kiur wins the day legitimately (2 eligible vs Kirsi's 1 eligible).
    insertLeaderboardAttempt('kiur', `${day}T08:00:00.000Z`, 'eligible');
    insertLeaderboardAttempt('kiur', `${day}T08:30:00.000Z`, 'eligible');
    insertLeaderboardAttempt('kirsi', `${day}T09:00:00.000Z`, 'eligible');
    // Two withheld attempts for Kirsi that, if counted, would flip the day (and
    // hence the month's trophy) to her.
    insertLeaderboardAttempt('kirsi', `${day}T10:00:00.000Z`, 'withheld');
    insertLeaderboardAttempt('kirsi', `${day}T11:00:00.000Z`, 'needs_review');

    recordDailyLeaderboard(day);

    // Evaluate later in the same month, so the day is over (final trophy) but the
    // month is still the current one that getMonthlyTrophies reports on.
    const asOf = '2026-03-15';
    expect(getMonthlyTrophies('kiur', asOf)).toBe(1);
    expect(getMonthlyTrophies('kirsi', asOf)).toBe(0);
  });

  it('approving a held attempt adds it to the leaderboard exactly once', () => {
    const date = '2026-03-12';
    insertLeaderboardAttempt('kiur', `${date}T08:00:00.000Z`, 'eligible');
    const heldId = insertLeaderboardAttempt('kirsi', `${date}T09:00:00.000Z`, 'needs_review');

    recordDailyLeaderboard(date);
    expect(countsFor(date)).toMatchObject({ kiurCount: 1, kirsiCount: 0, winner: 'kiur' });

    approveHeldRewardAttempt(heldId);
    expect(countsFor(date)).toMatchObject({ kiurCount: 1, kirsiCount: 1, winner: 'tie' });

    // Idempotent: a second approval must not double-count.
    approveHeldRewardAttempt(heldId);
    expect(countsFor(date)).toMatchObject({ kiurCount: 1, kirsiCount: 1, winner: 'tie' });
  });

  it('a later valid attempt does not drag an earlier held attempt into the leaderboard', () => {
    const date = '2026-03-20';
    // A held Kiur attempt arrives first; its own upload does not count it.
    insertLeaderboardAttempt('kiur', `${date}T08:00:00.000Z`, 'needs_review');
    recordDailyLeaderboard(date);
    expect(countsFor(date)).toMatchObject({ kiurCount: 0, kirsiCount: 0 });

    // A later valid Kirsi attempt recalculates the same date. The recalculation
    // must not pull the earlier held Kiur attempt into the counts.
    insertLeaderboardAttempt('kirsi', `${date}T12:00:00.000Z`, 'eligible');
    recordDailyLeaderboard(date);

    const { kiurCount, kirsiCount, winner } = countsFor(date);
    expect(kiurCount).toBe(0);
    expect(kirsiCount).toBe(1);
    expect(winner).toBe('kirsi');
  });

  it('legacy v1 attempts still count regardless of settlement status', () => {
    const date = '2026-03-25';
    // A v1 attempt row carries the default 'eligible' but the leaderboard must
    // count legacy rows under legacy rules irrespective of the v2 gate.
    insertLeaderboardAttempt('kiur', `${date}T08:00:00.000Z`, 'eligible', { protocolVersion: 1 });
    recordDailyLeaderboard(date);
    expect(countsFor(date)).toMatchObject({ kiurCount: 1 });
  });
});

describe('historical leaderboard rebuild (RTM4-H03)', () => {
  it('corrects a stored row that an earlier build poisoned with a held attempt', () => {
    const date = '2026-02-14';
    // One eligible Kiur attempt and one held Kirsi attempt on the same day.
    insertLeaderboardAttempt('kiur', `${date}T08:00:00.000Z`, 'eligible');
    insertLeaderboardAttempt('kirsi', `${date}T09:00:00.000Z`, 'needs_review');

    // Simulate a pre-fix build that counted the held attempt: Kirsi shown winning.
    db.prepare(`
      INSERT INTO daily_leaderboard (date, kiurCount, kirsiCount, winner, updatedAt)
      VALUES (?, 1, 1, 'tie', '2026-01-01T00:00:00.000Z')
    `).run(date);
    db.prepare("UPDATE daily_leaderboard SET kirsiCount = 1, winner = 'tie' WHERE date = ?").run(date);

    rebuildDailyLeaderboard();

    const row = db.prepare('SELECT kiurCount, kirsiCount, winner FROM daily_leaderboard WHERE date = ?').get(date);
    expect(row).toMatchObject({ kiurCount: 1, kirsiCount: 0, winner: 'kiur' });
  });
});

describe('leaderboard history totals exclude held attempts', () => {
  it('backfilled totals do not award a day to a child on held attempts alone', () => {
    const date = '2026-03-28';
    insertLeaderboardAttempt('kirsi', `${date}T09:00:00.000Z`, 'withheld');
    // A day made up solely of a held attempt has no real activity.
    recordDailyLeaderboard(date);
    const { days } = getLeaderboardHistory();
    const day = days.find((d) => d.date === date);
    expect(day).toMatchObject({ kiurCount: 0, kirsiCount: 0, winner: 'tie' });
  });
});
