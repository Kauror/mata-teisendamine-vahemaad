import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import type { RewardPolicyV2 } from '@/lib/server/rewards/policy';
import {
  applyRewardProjectionV2,
  projectCanonicalRewardsPure,
  type ProjectionAttempt
} from '@/lib/server/rewards/projection';

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

function insertAttempt(attempt: ProjectionAttempt) {
  db.prepare(`
    INSERT INTO attempts (
      id, createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions,
      learner, exerciseId, runnerId, clientAttemptId, completedAt, effectiveCompletedAt,
      completionDate, rewardPolicyVersion, protocolVersion
    ) VALUES (?, ?, 'cat', 'easy', ?, ?, 1, '[]', ?, ?, ?, ?, ?, ?, ?, ?, 2)
  `).run(
    attempt.id, attempt.effectiveCompletedAt, attempt.questionCount, attempt.score, attempt.learner,
    attempt.exerciseId, attempt.runnerId, attempt.clientAttemptId, attempt.effectiveCompletedAt,
    attempt.effectiveCompletedAt, attempt.completionDate, attempt.rewardPolicyVersion
  );
}

beforeEach(() => {
  db.exec(`
    DELETE FROM attempt_reward_components;
    DELETE FROM reward_projection_runs;
    DELETE FROM study_attempt_rewards;
    DELETE FROM point_ledger;
    DELETE FROM attempts;
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
