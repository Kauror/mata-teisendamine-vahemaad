import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import type { RewardPolicyV2 } from '@/lib/server/rewards/policy';
import {
  applyRewardProjectionV2,
  approveHeldRewardAttempt,
  getProjectedRewardV2,
  listHeldRewardAttempts,
  projectCanonicalRewardsPure,
  type ProjectionAttempt
} from '@/lib/server/rewards/projection';
import { getBalance } from '@/lib/tasks';
import { getChangedAttemptIdsAfter } from '@/lib/offline/server/attemptChanges';

const policy: RewardPolicyV2 = {
  schemaVersion: 2,
  learning: {
    baseValue: 1, decayStep: 0.1, minimumValue: 0, dailyCap: 10, minimumScorePercent: 0.5,
    learningPointsEnabled: true, streakIntervalDays: 2, streakBonusAmount: 2, streakBonusEnabled: true
  },
  rules: [{ id: 7, type: 'learning_streak', thresholdDays: 2, rewardStars: 3, learnerScope: 'both' }]
};

function projected(id: number, completed: string, clientId: string): ProjectionAttempt {
  return {
    id, clientAttemptId: clientId, learner: 'kiur', exerciseId: 'exercise', runnerId: 'math', score: 10,
    questionCount: 10, completionDate: completed.slice(0, 10), effectiveCompletedAt: completed, rewardPolicyVersion: 'p1'
  };
}

function insertAttempt(attempt: ProjectionAttempt, settlementStatus: 'eligible' | 'withheld' | 'needs_review' = 'eligible') {
  db.prepare(`
    INSERT INTO attempts (
      id, createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions,
      learner, exerciseId, runnerId, clientAttemptId, completedAt, effectiveCompletedAt,
      completionDate, rewardPolicyVersion, protocolVersion, rewardSettlementStatus
    ) VALUES (?, ?, 'cat', 'easy', ?, ?, 1, '[]', ?, ?, ?, ?, ?, ?, ?, ?, 2, ?)
  `).run(
    attempt.id, attempt.effectiveCompletedAt, attempt.questionCount, attempt.score, attempt.learner,
    attempt.exerciseId, attempt.runnerId, attempt.clientAttemptId, attempt.effectiveCompletedAt,
    attempt.effectiveCompletedAt, attempt.completionDate, attempt.rewardPolicyVersion, settlementStatus
  );
}

beforeEach(() => {
  db.exec(`
    DELETE FROM attempt_reward_components;
    DELETE FROM reward_projection_runs;
    DELETE FROM study_attempt_rewards;
    DELETE FROM point_ledger;
    DELETE FROM attempts;
    DELETE FROM server_change_log;
    DELETE FROM reward_policy_current;
    DELETE FROM reward_policy_versions;
  `);
  db.prepare(`INSERT INTO reward_policy_versions (version, contentHash, policyJson, createdAt) VALUES ('p1', 'hash-p1', ?, ?)`)
    .run(JSON.stringify(policy), '2026-01-01T00:00:00.000Z');
});

describe('deterministic reward protocol v2', () => {
  it('is independent of input/sync order and uses stable completion ordering', () => {
    const attempts = [
      projected(2, '2026-07-02T08:00:00.000Z', '018f47f6-9f2c-7b9a-8a2e-000000000002'),
      projected(1, '2026-07-01T08:00:00.000Z', '018f47f6-9f2c-7b9a-8a2e-000000000001')
    ];
    const policies = new Map([['p1', policy]]);
    expect(projectCanonicalRewardsPure(attempts, policies)).toEqual(projectCanonicalRewardsPure([...attempts].reverse(), policies));
    const components = projectCanonicalRewardsPure(attempts, policies);
    expect(components).toEqual(expect.arrayContaining([
      expect.objectContaining({ attemptId: 2, componentKey: 'streak:standard', amount: 2 }),
      expect.objectContaining({ attemptId: 2, componentKey: 'rule:7', amount: 3 })
    ]));
  });

  it('applies component deltas idempotently when a late attempt changes decay order', () => {
    const later = projected(2, '2026-07-01T10:00:00.000Z', '018f47f6-9f2c-7b9a-8a2e-000000000002');
    insertAttempt(later);
    const first = db.transaction(() => applyRewardProjectionV2('kiur', later.id))();
    expect(first.changedComponents).toBe(1);
    const retry = db.transaction(() => applyRewardProjectionV2('kiur', later.id))();
    expect(retry.changedComponents).toBe(0);

    const early = projected(1, '2026-07-01T09:00:00.000Z', '018f47f6-9f2c-7b9a-8a2e-000000000001');
    insertAttempt(early);
    const lateProjection = db.transaction(() => applyRewardProjectionV2('kiur', early.id))();
    expect(lateProjection.changedComponents).toBe(2);
    const ledger = db.prepare("SELECT COALESCE(SUM(amount), 0) AS total, COUNT(*) AS count FROM point_ledger WHERE source = 'reward_v2'").get() as { total: number; count: number };
    expect(ledger.total).toBeCloseTo(1.9);
    expect(ledger.count).toBe(3);
    expect(db.transaction(() => applyRewardProjectionV2('kiur', early.id))().changedComponents).toBe(0);
  });

  it('rolls back every projection write under fault injection', () => {
    const attempt = projected(1, '2026-07-01T09:00:00.000Z', '018f47f6-9f2c-7b9a-8a2e-000000000001');
    insertAttempt(attempt);
    const transaction = db.transaction(() => applyRewardProjectionV2('kiur', attempt.id, {
      faultInjector(stage) {
        if (stage === 'after_ledger') throw new Error('injected');
      }
    }));
    expect(() => transaction()).toThrow('injected');
    expect((db.prepare("SELECT COUNT(*) AS count FROM point_ledger WHERE source = 'reward_v2'").get() as { count: number }).count).toBe(0);
    expect((db.prepare('SELECT COUNT(*) AS count FROM attempt_reward_components').get() as { count: number }).count).toBe(0);
    expect((db.prepare('SELECT COUNT(*) AS count FROM reward_projection_runs').get() as { count: number }).count).toBe(0);
  });
});

// RTM-003: an unpermitted / held attempt must never enter the canonical reward
// projection until separately approved.
describe('reward settlement eligibility', () => {
  const u = (n: number) => `018f47f6-9f2c-7b9a-8a2e-00000000000${n}`;

  it('excludes an invalid-catalogue (withheld) attempt; only the valid attempt earns', () => {
    // Same exercise and day, so a leaked withheld attempt would consume the daily
    // cap and shift decay for the valid one.
    insertAttempt(projected(1, '2026-07-01T08:00:00.000Z', u(1)), 'withheld');
    insertAttempt(projected(2, '2026-07-01T09:00:00.000Z', u(2)), 'eligible');
    db.transaction(() => applyRewardProjectionV2('kiur', 2))();

    expect(db.prepare('SELECT attemptId, componentKey, canonicalAmount FROM attempt_reward_components ORDER BY attemptId').all())
      .toEqual([{ attemptId: 2, componentKey: 'study', canonicalAmount: 1 }]);
    expect(getBalance('kiur')).toBeCloseTo(1);
    expect((db.prepare('SELECT COUNT(*) AS c FROM point_ledger WHERE sourceId = 1').get() as { c: number }).c).toBe(0);
  });

  it('does not throw or block a valid attempt when a held attempt references an unavailable policy', () => {
    insertAttempt({ ...projected(1, '2026-07-01T08:00:00.000Z', u(1)), rewardPolicyVersion: 'p-unknown' }, 'needs_review');
    insertAttempt(projected(2, '2026-07-01T09:00:00.000Z', u(2)), 'eligible');
    expect(() => db.transaction(() => applyRewardProjectionV2('kiur', 2))()).not.toThrow();
    expect(getBalance('kiur')).toBeCloseTo(1);
  });

  it('a needs_review attempt never affects balance, cap, decay or streak', () => {
    insertAttempt(projected(1, '2026-07-01T08:00:00.000Z', u(1)), 'eligible');
    insertAttempt(projected(2, '2026-07-01T09:00:00.000Z', u(2)), 'needs_review'); // same day + exercise
    insertAttempt(projected(3, '2026-07-02T08:00:00.000Z', u(3)), 'eligible');
    db.transaction(() => applyRewardProjectionV2('kiur', 3))();

    // Two full-value study days (decay not shifted by the review row) = 1 + 1;
    // a 2-day streak adds the standard bonus 2 and rule 3 → 7. A leaked review row
    // would add ~0.9 of decayed study, so 7 (not 7.9) proves exclusion.
    expect(getBalance('kiur')).toBeCloseTo(7);
    expect(getProjectedRewardV2(2)?.awardedAmount).toBe(0);
  });

  it('settles a held attempt exactly once when later approved', () => {
    insertAttempt(projected(1, '2026-07-01T08:00:00.000Z', u(1)), 'needs_review');
    expect(getBalance('kiur')).toBe(0);

    const first = approveHeldRewardAttempt(1);
    expect(first?.changedComponents).toBe(1);
    expect(getBalance('kiur')).toBeCloseTo(1);

    const second = approveHeldRewardAttempt(1);
    expect(second).toBeNull();
    expect(getBalance('kiur')).toBeCloseTo(1);
  });

  it('lists held attempts and refreshes the leaderboard on approval (RTM2-H03)', () => {
    db.exec('DELETE FROM daily_leaderboard');
    insertAttempt(projected(1, '2026-07-01T08:00:00.000Z', u(1)), 'needs_review');
    expect(listHeldRewardAttempts().map((h) => h.id)).toEqual([1]);

    approveHeldRewardAttempt(1);

    expect(listHeldRewardAttempts()).toEqual([]);
    const board = db.prepare("SELECT kiurCount FROM daily_leaderboard WHERE date = '2026-07-01'").get() as { kiurCount: number } | undefined;
    expect(board?.kiurCount).toBe(1);
  });

  // RTM3-H01: changes to an already-synced attempt (approval, or a reprojection
  // triggered by a later attempt) must be advertised on the attempt-update stream
  // so other devices refresh their cached copy.
  it('emits an attempt-update change when a held attempt is approved', () => {
    insertAttempt(projected(1, '2026-07-01T08:00:00.000Z', u(1)), 'needs_review');
    // The held attempt earned nothing yet, so nothing was projected — no change.
    expect(getChangedAttemptIdsAfter(0).attemptIds).toEqual([]);

    approveHeldRewardAttempt(1);
    expect(getChangedAttemptIdsAfter(0).attemptIds).toContain(1);
  });

  it('emits attempt-update changes for earlier attempts a late attempt reprojects', () => {
    // Two consecutive qualifying days: with streakIntervalDays=2 the streak bonus
    // + rule attach to the owner of the second day (attempt 2).
    insertAttempt(projected(1, '2026-07-01T08:00:00.000Z', u(1)));
    insertAttempt(projected(2, '2026-07-02T08:00:00.000Z', u(2)));
    applyRewardProjectionV2('kiur', 2);
    expect(getProjectedRewardV2(2)?.awardedAmount).toBeGreaterThan(1); // carries the bonus

    const cursor = getChangedAttemptIdsAfter(0).lastChangeId;
    // A late earlier-date attempt shifts the streak: the bonus moves from day 2
    // (attempt 2) to day 1 (attempt 1). Both earlier attempts are revised.
    insertAttempt(projected(3, '2026-06-30T08:00:00.000Z', u(3)));
    applyRewardProjectionV2('kiur', 3);
    const changed = getChangedAttemptIdsAfter(cursor).attemptIds;
    expect(changed).toEqual(expect.arrayContaining([1, 2]));
    // The trigger (attempt 3) is delivered by the normal id-cursor pull, not the
    // update stream.
    expect(changed).not.toContain(3);
  });

  // RTM3-M03: the history "stars earned" must be the canonical total of every
  // reward component (study + streak + rule), not only study_attempt_rewards.
  it('history star total sums all canonical components, not just the study reward', () => {
    insertAttempt(projected(1, '2026-07-01T08:00:00.000Z', u(1)));
    insertAttempt(projected(2, '2026-07-02T08:00:00.000Z', u(2)));
    applyRewardProjectionV2('kiur', 2);

    // Attempt 2 carries study + streak:standard(2) + rule:7(3): more than study.
    const studyOnly = (db.prepare('SELECT awardedAmount FROM study_attempt_rewards WHERE attemptId = 2').get() as { awardedAmount: number }).awardedAmount;
    const canonicalTotal = db.prepare(`
      SELECT COALESCE(SUM(latest.canonicalAmount), 0) AS total
      FROM attempt_reward_components latest
      JOIN (
        SELECT componentKey, MAX(revision) AS revision
        FROM attempt_reward_components WHERE attemptId = 2 GROUP BY componentKey
      ) mx ON mx.componentKey = latest.componentKey AND mx.revision = latest.revision
      WHERE latest.attemptId = 2
    `).get() as { total: number };
    expect(canonicalTotal.total).toBeGreaterThan(studyOnly);
    // The canonical total is exactly what getProjectedRewardV2 reports for the row.
    expect(canonicalTotal.total).toBeCloseTo(getProjectedRewardV2(2)!.awardedAmount);
  });
});
