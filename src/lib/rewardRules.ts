import db from '@/lib/db';
import { Learner, nowIso } from '@/lib/tasks';

// The reward configuration area in the parent hub stores a list of reward
// "rules". Today the only type is `learning_streak` (give stars when a child
// reaches a set number of consecutive study days), but the table and module are
// shaped so more scenarios can be added later without reworking the storage.
export type RewardRuleType = 'learning_streak';
export type RewardLearnerScope = 'both' | 'kiur' | 'kirsi';

export type RewardRule = {
  id: number;
  type: RewardRuleType;
  thresholdDays: number;
  rewardStars: number;
  learnerScope: RewardLearnerScope;
  enabled: boolean;
};

type RewardRuleRow = {
  id: number;
  type: string;
  thresholdDays: number;
  rewardStars: number;
  learnerScope: string;
  enabled: number;
};

export type RewardRuleInput = {
  type?: RewardRuleType;
  thresholdDays: number;
  rewardStars: number;
  learnerScope: RewardLearnerScope;
  enabled: boolean;
};

export type AwardedStreakReward = {
  ruleId: number;
  thresholdDays: number;
  amount: number;
};

function mapRow(row: RewardRuleRow): RewardRule {
  return {
    id: row.id,
    type: 'learning_streak',
    thresholdDays: row.thresholdDays,
    rewardStars: row.rewardStars,
    learnerScope: row.learnerScope === 'kiur' || row.learnerScope === 'kirsi' ? row.learnerScope : 'both',
    enabled: Boolean(row.enabled)
  };
}

export function listRewardRules(): RewardRule[] {
  const rows = db.prepare(`
    SELECT id, type, thresholdDays, rewardStars, learnerScope, enabled
    FROM reward_rules
    WHERE deletedAt IS NULL
    ORDER BY thresholdDays ASC, id ASC
  `).all() as RewardRuleRow[];
  return rows.map(mapRow);
}

function validate(input: RewardRuleInput) {
  const type: RewardRuleType = 'learning_streak';
  const thresholdDays = Number(input.thresholdDays);
  const rewardStars = Number(input.rewardStars);
  const learnerScope: RewardLearnerScope =
    input.learnerScope === 'kiur' || input.learnerScope === 'kirsi' ? input.learnerScope : 'both';
  if (!Number.isInteger(thresholdDays) || thresholdDays < 1 || thresholdDays > 365) {
    throw new Error('Päevade arv peab olema 1-365.');
  }
  if (!Number.isFinite(rewardStars) || rewardStars <= 0 || rewardStars > 1000) {
    throw new Error('Tähtede arv peab olema 0 ja 1000 vahel.');
  }
  return {
    type,
    thresholdDays,
    rewardStars: Math.round(rewardStars * 10) / 10,
    learnerScope,
    enabled: input.enabled !== false
  };
}

export function createRewardRule(input: RewardRuleInput) {
  const clean = validate(input);
  const now = nowIso();
  const result = db.prepare(`
    INSERT INTO reward_rules (type, thresholdDays, rewardStars, learnerScope, enabled, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(clean.type, clean.thresholdDays, clean.rewardStars, clean.learnerScope, clean.enabled ? 1 : 0, now, now);
  return Number(result.lastInsertRowid);
}

export function updateRewardRule(id: number, input: RewardRuleInput) {
  const clean = validate(input);
  const result = db.prepare(`
    UPDATE reward_rules
    SET type = ?, thresholdDays = ?, rewardStars = ?, learnerScope = ?, enabled = ?, updatedAt = ?
    WHERE id = ? AND deletedAt IS NULL
  `).run(clean.type, clean.thresholdDays, clean.rewardStars, clean.learnerScope, clean.enabled ? 1 : 0, nowIso(), id);
  if (result.changes === 0) throw new Error('Auhinda ei leitud.');
}

export function deleteRewardRule(id: number) {
  db.prepare('UPDATE reward_rules SET deletedAt = ?, updatedAt = ? WHERE id = ? AND deletedAt IS NULL').run(nowIso(), nowIso(), id);
}

function ruleAppliesToLearner(scope: RewardLearnerScope, learner: Learner) {
  return scope === 'both' || scope === learner;
}

// Grants any learning-streak rewards that fire when `learner`'s study streak
// reaches a configured threshold on `streakDate`. Called from inside the study
// reward transaction in learningPoints, so the ledger entries and award rows are
// committed atomically with the rest of the attempt's reward. The unique index
// on (ruleId, learner, streakDate) makes this idempotent: a given streak hits a
// given threshold on exactly one date, so each milestone pays out once.
export function awardLearningStreakRewards(opts: {
  learner: Learner;
  streakLength: number;
  streakDate: string;
  attemptId: number;
  createdAt: string;
}): AwardedStreakReward[] {
  const { learner, streakLength, streakDate, attemptId, createdAt } = opts;
  if (streakLength <= 0) return [];

  const rules = db.prepare(`
    SELECT id, type, thresholdDays, rewardStars, learnerScope, enabled
    FROM reward_rules
    WHERE deletedAt IS NULL AND enabled = 1 AND type = 'learning_streak' AND thresholdDays = ?
  `).all(streakLength) as RewardRuleRow[];

  const awarded: AwardedStreakReward[] = [];
  for (const row of rules) {
    const rule = mapRow(row);
    if (!ruleAppliesToLearner(rule.learnerScope, learner)) continue;

    const ledger = db.prepare(`
      INSERT INTO point_ledger (learner, amount, source, sourceId, description, createdAt, metadataJson)
      VALUES (?, ?, 'reward_streak', ?, ?, ?, ?)
    `).run(
      learner,
      rule.rewardStars,
      rule.id,
      `Auhind: ${rule.thresholdDays} päeva seeria`,
      createdAt,
      JSON.stringify({ ruleId: rule.id, thresholdDays: rule.thresholdDays, streakLength, rewardStars: rule.rewardStars, triggeringAttemptId: attemptId })
    );

    const claim = db.prepare(`
      INSERT OR IGNORE INTO reward_rule_awards (ruleId, learner, thresholdDays, streakLength, streakDate, amount, attemptId, ledgerEntryId, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(rule.id, learner, rule.thresholdDays, streakLength, streakDate, rule.rewardStars, attemptId, ledger.lastInsertRowid, createdAt);

    if (claim.changes === 0) {
      // Already paid out for this streak milestone — roll back the ledger entry.
      db.prepare('DELETE FROM point_ledger WHERE id = ?').run(ledger.lastInsertRowid);
      continue;
    }
    awarded.push({ ruleId: rule.id, thresholdDays: rule.thresholdDays, amount: rule.rewardStars });
  }
  return awarded;
}

// Reward rows linked to a specific attempt, used to surface earned rewards on
// the attempt result page.
export function getStreakRewardsForAttempt(attemptId: number): AwardedStreakReward[] {
  const rows = db.prepare(`
    SELECT ruleId, thresholdDays, amount
    FROM reward_rule_awards
    WHERE attemptId = ?
    ORDER BY thresholdDays ASC
  `).all(attemptId) as Array<{ ruleId: number; thresholdDays: number; amount: number }>;
  return rows.map((row) => ({ ruleId: row.ruleId, thresholdDays: row.thresholdDays, amount: row.amount }));
}
