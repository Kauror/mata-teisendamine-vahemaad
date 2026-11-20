import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import { ensureCurrentRewardPolicy, snapshotCurrentRewardPolicy, type RewardPolicyV2 } from '@/lib/server/rewards/policy';
import { applyRewardProjectionV2, getProjectedRewardV2, projectCanonicalRewardsPure, type ProjectionAttempt } from '@/lib/server/rewards/projection';
import { getBalance } from '@/lib/tasks';

// B8: the parent's star rule for exercises. Below 50% pays nothing, 50-74%
// pays half the normal study value and 75% or more the full value; a maths
// session shorter than its normal length pays in proportion. The rule lives in
// the immutable reward policy snapshot, so attempts settled under an older
// policy keep exactly the stars they had.

const learning = {
  baseValue: 1, decayStep: 0.1, minimumValue: 0, dailyCap: 10, minimumScorePercent: 0.5,
  learningPointsEnabled: true, streakIntervalDays: 7, streakBonusAmount: 1, streakBonusEnabled: false
};
const oldPolicy: RewardPolicyV2 = { schemaVersion: 2, learning, rules: [] };

function attempt(id: number, score: number, questionCount: number, options: Partial<ProjectionAttempt> = {}): ProjectionAttempt {
  const completed = `2026-07-0${id}T08:00:00.000Z`;
  return {
    id, clientAttemptId: `c-${id}`, learner: 'kiur', exerciseId: `exercise-${id}`, runnerId: 'math', score, questionCount,
    completionDate: completed.slice(0, 10), effectiveCompletedAt: completed, rewardPolicyVersion: 'p-old', topic: 'mootuhikud', ...options
  };
}

function study(components: ReturnType<typeof projectCanonicalRewardsPure>, id: number) {
  return components.find((component) => component.attemptId === id && component.componentKey === 'study')?.amount;
}

function insert(row: ProjectionAttempt) {
  db.prepare(`
    INSERT INTO attempts (
      id, createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions,
      learner, topic, exerciseId, runnerId, clientAttemptId, completedAt, effectiveCompletedAt,
      completionDate, rewardPolicyVersion, protocolVersion, rewardSettlementStatus
    ) VALUES (?, ?, 'cat', 'easy', ?, ?, 100, '[]', ?, ?, ?, ?, ?, ?, ?, ?, ?, 2, 'eligible')
  `).run(row.id, row.effectiveCompletedAt, row.questionCount, row.score, row.learner, row.topic ?? null, row.exerciseId,
    row.runnerId, row.clientAttemptId, row.effectiveCompletedAt, row.effectiveCompletedAt, row.completionDate, row.rewardPolicyVersion);
}

beforeEach(() => {
  db.exec(`
    DELETE FROM attempt_reward_components; DELETE FROM reward_projection_runs; DELETE FROM study_attempt_rewards;
    DELETE FROM point_ledger; DELETE FROM attempts; DELETE FROM server_change_log;
    DELETE FROM reward_policy_current; DELETE FROM reward_policy_versions;
  `);
  db.prepare(`INSERT INTO reward_policy_versions (version, contentHash, policyJson, createdAt) VALUES ('p-old', 'hash-old', ?, ?)`)
    .run(JSON.stringify(oldPolicy), '2026-01-01T00:00:00.000Z');
});

describe('score tiers in the reward policy', () => {
  it('pays 0 below 50%, half at 50-74% and the full value from 75%', () => {
    const current = snapshotCurrentRewardPolicy();
    const policies = new Map([['p-new', current]]);
    const rows = [
      attempt(1, 7, 15, { rewardPolicyVersion: 'p-new' }),
      attempt(2, 8, 15, { rewardPolicyVersion: 'p-new' }),
      attempt(3, 11, 15, { rewardPolicyVersion: 'p-new' }),
      attempt(4, 12, 15, { rewardPolicyVersion: 'p-new' })
    ];
    const components = projectCanonicalRewardsPure(rows, policies);
    expect(study(components, 1)).toBe(0);
    expect(study(components, 2)).toBe(0.5);
    expect(study(components, 3)).toBe(0.5);
    expect(study(components, 4)).toBe(1);
  });

  it('pays a short maths session in proportion to its normal length', () => {
    const policies = new Map([['p-new', snapshotCurrentRewardPolicy()]]);
    const components = projectCanonicalRewardsPure([
      attempt(1, 1, 1, { rewardPolicyVersion: 'p-new' }),
      attempt(2, 5, 5, { rewardPolicyVersion: 'p-new', topic: 'tekstulesanded' }),
      attempt(3, 5, 5, { rewardPolicyVersion: 'p-new', runnerId: 'kiur-reading' })
    ], policies);
    expect(study(components, 1)).toBe(0.07);
    // Word problems are five questions by design; other runners are not scaled.
    expect(study(components, 2)).toBe(1);
    expect(study(components, 3)).toBe(1);
  });

  it('keeps the old rule for attempts stamped with an older policy', () => {
    const components = projectCanonicalRewardsPure([attempt(1, 8, 15), attempt(2, 1, 1)], new Map([['p-old', oldPolicy]]));
    expect(study(components, 1)).toBe(1);
    expect(study(components, 2)).toBe(1);
  });

  it('leaves every old attempt\'s stars and ledger untouched when the projection re-runs under the new policy', () => {
    insert(attempt(1, 8, 15));
    insert(attempt(2, 1, 1));
    applyRewardProjectionV2('kiur', 2);
    const ledgerBefore = db.prepare('SELECT id, amount, idempotencyKey FROM point_ledger ORDER BY id').all();
    const componentsBefore = db.prepare('SELECT attemptId, componentKey, revision, canonicalAmount FROM attempt_reward_components ORDER BY attemptId, componentKey, revision').all();
    expect(getBalance('kiur')).toBeCloseTo(2);

    const { version } = ensureCurrentRewardPolicy();
    expect(version).not.toBe('p-old');
    insert(attempt(3, 8, 15, { rewardPolicyVersion: version }));
    applyRewardProjectionV2('kiur', 3);

    expect(db.prepare('SELECT id, amount, idempotencyKey FROM point_ledger WHERE id <= ? ORDER BY id').all((ledgerBefore.at(-1) as { id: number }).id)).toEqual(ledgerBefore);
    expect(db.prepare('SELECT attemptId, componentKey, revision, canonicalAmount FROM attempt_reward_components WHERE attemptId IN (1, 2) ORDER BY attemptId, componentKey, revision').all()).toEqual(componentsBefore);
    expect(getProjectedRewardV2(1)?.awardedAmount).toBe(1);
    expect(getProjectedRewardV2(2)?.awardedAmount).toBe(1);
    expect(getProjectedRewardV2(3)?.awardedAmount).toBe(0.5);
    expect(getBalance('kiur')).toBeCloseTo(2.5);
  });
});
