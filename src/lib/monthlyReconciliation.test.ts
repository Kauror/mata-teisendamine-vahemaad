import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import type { RewardPolicyV2 } from '@/lib/server/rewards/policy';
import { recordDailyLeaderboard } from '@/lib/leaderboard';
import { ensureMonthlyPrizeAwarded, setMonthlyPrizeStars } from '@/lib/monthlyCompetition';
import { approveHeldRewardAttempt } from '@/lib/server/rewards/projection';
import { getBalance } from '@/lib/tasks';

// RTM4-C01: a settled month must be reconciled when late offline attempts or a
// held-attempt approval change its daily standings after the award was created.

const policy: RewardPolicyV2 = {
  schemaVersion: 2,
  learning: {
    baseValue: 1, decayStep: 0.1, minimumValue: 0, dailyCap: 10, minimumScorePercent: 0.5,
    learningPointsEnabled: true, streakIntervalDays: 99, streakBonusAmount: 0, streakBonusEnabled: false
  },
  rules: []
};

let nextId = 1;

function seedDay(date: string, kiurCount: number, kirsiCount: number) {
  const winner = kiurCount === kirsiCount ? 'tie' : kiurCount > kirsiCount ? 'kiur' : 'kirsi';
  db.prepare(`
    INSERT INTO daily_leaderboard (date, kiurCount, kirsiCount, winner, updatedAt)
    VALUES (?, ?, ?, ?, '2026-01-01T00:00:00.000Z')
    ON CONFLICT(date) DO UPDATE SET kiurCount = excluded.kiurCount, kirsiCount = excluded.kirsiCount, winner = excluded.winner
  `).run(date, kiurCount, kirsiCount, winner);
}

function insertAttempt(learner: 'kiur' | 'kirsi', completedAt: string, settlement: 'eligible' | 'needs_review' = 'eligible') {
  const id = nextId++;
  db.prepare(`
    INSERT INTO attempts (
      id, createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions,
      learner, subject, topic, exerciseId, runnerId, clientAttemptId, completedAt, effectiveCompletedAt,
      completionDate, rewardPolicyVersion, protocolVersion, rewardSettlementStatus
    ) VALUES (?, ?, 'Korrutamine', 'Lihtne', 10, 10, 100, '[]', ?, 'matemaatika', 'korrutamine', 'exercise', 'math', ?, ?, ?, ?, 'p1', 2, ?)
  `).run(id, completedAt, learner, `client-${id}`, completedAt, completedAt, completedAt.slice(0, 10), settlement);
  return id;
}

function monthlyPrizeApplied(month: string) {
  const rows = db.prepare(`
    SELECT learner, COALESCE(SUM(amount), 0) AS total
    FROM point_ledger
    WHERE source = 'monthly_trophy_prize' AND json_extract(metadataJson, '$.month') = ?
    GROUP BY learner
  `).all(month) as Array<{ learner: string; total: number }>;
  const applied: Record<string, number> = { kiur: 0, kirsi: 0 };
  for (const row of rows) applied[row.learner] = row.total;
  return applied;
}

function awardRow(month: string) {
  return db.prepare('SELECT winner, prizeStars FROM monthly_competition_awards WHERE month = ?').get(month) as
    | { winner: string; prizeStars: number }
    | undefined;
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
    DELETE FROM monthly_competition_awards;
    DELETE FROM server_change_log;
    DELETE FROM reward_policy_current;
    DELETE FROM reward_policy_versions;
  `);
  db.pragma('foreign_keys = ON');
  db.prepare(`INSERT INTO reward_policy_versions (version, contentHash, policyJson, createdAt) VALUES ('p1', 'hash-p1', ?, ?)`)
    .run(JSON.stringify(policy), '2026-01-01T00:00:00.000Z');
  setMonthlyPrizeStars(10);
});

describe('monthly prize reconciliation (RTM4-C01)', () => {
  it('reconciles the winner and stars when late offline attempts arrive after month-end', () => {
    // Both children are active every day (attendance met). Kiur leads 11-9.
    for (let day = 1; day <= 11; day += 1) seedDay(`2026-05-${String(day).padStart(2, '0')}`, 2, 1);
    for (let day = 12; day <= 20; day += 1) seedDay(`2026-05-${String(day).padStart(2, '0')}`, 1, 2);

    // Month settles on the first load in June: Kiur wins the prize.
    ensureMonthlyPrizeAwarded('2026-06-05');
    expect(awardRow('2026-05')).toMatchObject({ winner: 'kiur', prizeStars: 10 });
    expect(getBalance('kiur')).toBeCloseTo(10);

    // The device reconnects in June and uploads three late July... err May days
    // that Kirsi won, overtaking Kiur (12 vs 11). Each recalculation reconciles.
    for (const day of ['21', '22', '23']) {
      insertAttempt('kirsi', `2026-05-${day}T09:00:00.000Z`);
      recordDailyLeaderboard(`2026-05-${day}`);
    }

    // The award now follows the corrected standings: Kirsi holds the prize, Kiur's
    // mistaken award has been compensated back out.
    expect(awardRow('2026-05')).toMatchObject({ winner: 'kirsi', prizeStars: 10 });
    expect(monthlyPrizeApplied('2026-05')).toEqual({ kiur: 0, kirsi: 10 });
    expect(getBalance('kiur')).toBeCloseTo(0);
    expect(getBalance('kirsi')).toBeCloseTo(10);
  });

  it('is idempotent: re-recording an unchanged day does not double-adjust', () => {
    for (let day = 1; day <= 11; day += 1) seedDay(`2026-05-${String(day).padStart(2, '0')}`, 2, 1);
    for (let day = 12; day <= 20; day += 1) seedDay(`2026-05-${String(day).padStart(2, '0')}`, 1, 2);
    ensureMonthlyPrizeAwarded('2026-06-05');

    // Recording the same standings repeatedly must not move stars.
    recordDailyLeaderboard('2026-05-11');
    recordDailyLeaderboard('2026-05-11');
    expect(monthlyPrizeApplied('2026-05')).toEqual({ kiur: 10, kirsi: 0 });
    expect(getBalance('kiur')).toBeCloseTo(10);
  });

  it('reconciles when a held attempt is approved after the monthly award exists', () => {
    for (let day = 1; day <= 11; day += 1) seedDay(`2026-05-${String(day).padStart(2, '0')}`, 2, 1);
    for (let day = 12; day <= 20; day += 1) seedDay(`2026-05-${String(day).padStart(2, '0')}`, 1, 2);
    ensureMonthlyPrizeAwarded('2026-06-05');
    expect(awardRow('2026-05')).toMatchObject({ winner: 'kiur' });

    // Three held Kirsi attempts on new May days. Held → excluded, so recording
    // them does not yet move the standings (Kiur leads 11-9).
    const held = [
      insertAttempt('kirsi', '2026-05-24T09:00:00.000Z', 'needs_review'),
      insertAttempt('kirsi', '2026-05-25T09:00:00.000Z', 'needs_review'),
      insertAttempt('kirsi', '2026-05-26T09:00:00.000Z', 'needs_review')
    ];
    for (const day of ['24', '25', '26']) recordDailyLeaderboard(`2026-05-${day}`);
    expect(awardRow('2026-05')).toMatchObject({ winner: 'kiur' });

    // Approving them one by one: 10-11 (Kiur still leads), 11-11 (tie → Kiur's
    // prize revoked), 12-11 (Kirsi wins → prize granted). Each approval reconciles.
    approveHeldRewardAttempt(held[0]);
    expect(awardRow('2026-05')).toMatchObject({ winner: 'kiur', prizeStars: 10 });

    approveHeldRewardAttempt(held[1]);
    expect(awardRow('2026-05')).toMatchObject({ winner: 'tie', prizeStars: 0 });

    approveHeldRewardAttempt(held[2]);
    expect(awardRow('2026-05')).toMatchObject({ winner: 'kirsi', prizeStars: 10 });
    // The monthly prize itself ends with Kirsi holding 10 and Kiur back to 0.
    expect(monthlyPrizeApplied('2026-05')).toEqual({ kiur: 0, kirsi: 10 });
  });
});
