import db from '@/lib/db';
import { addAppDays } from '@/lib/appDate';
import { getBalance, type Learner } from '@/lib/tasks';
import { recordDailyLeaderboard } from '@/lib/leaderboard';
import { REWARD_ENGINE_VERSION, rewardPolicyByVersion, type RewardPolicyV2 } from '@/lib/server/rewards/policy';
import { emitAttemptChange } from '@/lib/offline/server/attemptChanges';
import { sprintAttemptQualifies } from '@/lib/sprintReward';

export type ProjectionAttempt = {
  id: number;
  clientAttemptId: string | null;
  learner: Learner;
  exerciseId: string;
  runnerId: string;
  score: number;
  questionCount: number;
  completionDate: string;
  effectiveCompletedAt: string;
  rewardPolicyVersion: string;
  subject?: string | null;
  topic?: string | null;
};

export type CanonicalComponent = {
  attemptId: number;
  componentKey: string;
  amount: number;
  effectiveDate: string;
  policyVersion: string;
};

function rounded(value: number) {
  return Math.round(value * 100) / 100;
}

function compareAttempts(left: ProjectionAttempt, right: ProjectionAttempt) {
  if (left.completionDate !== right.completionDate) return left.completionDate.localeCompare(right.completionDate);
  if (left.effectiveCompletedAt !== right.effectiveCompletedAt) return left.effectiveCompletedAt.localeCompare(right.effectiveCompletedAt);
  const leftClient = left.clientAttemptId ?? '';
  const rightClient = right.clientAttemptId ?? '';
  if (leftClient !== rightClient) return leftClient.localeCompare(rightClient);
  return left.id - right.id;
}

function ruleApplies(rule: RewardPolicyV2['rules'][number], learner: Learner) {
  return rule.learnerScope === 'both' || rule.learnerScope === learner;
}

export function projectCanonicalRewardsPure(
  attempts: ProjectionAttempt[],
  policies: ReadonlyMap<string, RewardPolicyV2>
): CanonicalComponent[] {
  const ordered = [...attempts].sort(compareAttempts);
  const components: CanonicalComponent[] = [];
  const qualifyingByDate = new Map<string, ProjectionAttempt[]>();

  for (let cursor = 0; cursor < ordered.length;) {
    const date = ordered[cursor].completionDate;
    const rows: ProjectionAttempt[] = [];
    while (cursor < ordered.length && ordered[cursor].completionDate === date) rows.push(ordered[cursor++]);
    let dailyAwarded = 0;
    const exerciseCounts = new Map<string, number>();
    const qualified: ProjectionAttempt[] = [];
    for (const attempt of rows) {
      const policy = policies.get(attempt.rewardPolicyVersion);
      if (!policy) throw new Error(`Unknown reward policy ${attempt.rewardPolicyVersion}.`);
      const exerciseKey = `${attempt.runnerId}:${attempt.exerciseId}`;
      const attemptNumber = (exerciseCounts.get(exerciseKey) ?? 0) + 1;
      exerciseCounts.set(exerciseKey, attemptNumber);
      const scorePercent = attempt.questionCount > 0 ? attempt.score / attempt.questionCount : 0;
      const qualifies = policy.learning.learningPointsEnabled && scorePercent >= policy.learning.minimumScorePercent &&
        sprintAttemptQualifies(attempt);
      const base = Math.max(policy.learning.minimumValue, policy.learning.baseValue - policy.learning.decayStep * (attemptNumber - 1));
      const remaining = Math.max(0, policy.learning.dailyCap - dailyAwarded);
      const study = qualifies ? rounded(Math.min(base, remaining)) : 0;
      dailyAwarded = rounded(dailyAwarded + study);
      if (qualifies) qualified.push(attempt);
      components.push({
        attemptId: attempt.id,
        componentKey: 'study',
        amount: study,
        effectiveDate: date,
        policyVersion: attempt.rewardPolicyVersion
      });
    }
    if (qualified.length > 0) qualifyingByDate.set(date, qualified);
  }

  let previousDate: string | null = null;
  let streak = 0;
  for (const date of [...qualifyingByDate.keys()].sort()) {
    streak = previousDate && addAppDays(previousDate, 1) === date ? streak + 1 : 1;
    previousDate = date;
    const owner = qualifyingByDate.get(date)![0];
    const policy = policies.get(owner.rewardPolicyVersion);
    if (!policy) throw new Error(`Unknown reward policy ${owner.rewardPolicyVersion}.`);
    if (
      policy.learning.streakBonusEnabled &&
      policy.learning.streakBonusAmount > 0 &&
      streak % policy.learning.streakIntervalDays === 0
    ) {
      components.push({
        attemptId: owner.id,
        componentKey: 'streak:standard',
        amount: rounded(policy.learning.streakBonusAmount),
        effectiveDate: date,
        policyVersion: owner.rewardPolicyVersion
      });
    }
    for (const rule of policy.rules) {
      if (rule.thresholdDays !== streak || !ruleApplies(rule, owner.learner)) continue;
      components.push({
        attemptId: owner.id,
        componentKey: `rule:${rule.id}`,
        amount: rounded(rule.rewardStars),
        effectiveDate: date,
        policyVersion: owner.rewardPolicyVersion
      });
    }
  }
  return components;
}

export function projectCanonicalRewards(attempts: ProjectionAttempt[]): CanonicalComponent[] {
  const versions = new Set(attempts.map((attempt) => attempt.rewardPolicyVersion));
  const policies = new Map<string, RewardPolicyV2>();
  for (const version of versions) {
    const policy = rewardPolicyByVersion(version);
    if (!policy) throw new Error(`Unknown reward policy ${version}.`);
    policies.set(version, policy);
  }
  return projectCanonicalRewardsPure(attempts, policies);
}

function projectionAttempts(learner: Learner): ProjectionAttempt[] {
  // Only authoritative, reward-eligible attempts feed the canonical projection.
  // Attempts that were unpermitted, rejected for policy, or held for review are
  // 'withheld'/'needs_review' and must never earn points, affect the daily cap or
  // decay, contribute to a streak, or throw an unknown-policy error here (RTM-003).
  // `deletedAt` is intentionally not a predicate: hiding a history row is only
  // a display preference and cannot rewrite canonical accounting.
  return db.prepare(`
    SELECT id, clientAttemptId, learner, exerciseId, runnerId, score, questionCount,
           completionDate, effectiveCompletedAt, rewardPolicyVersion, subject, topic
    FROM attempts
    WHERE learner = ? AND protocolVersion = 2 AND rewardPolicyVersion IS NOT NULL
      AND rewardSettlementStatus = 'eligible'
      AND completionDate IS NOT NULL AND effectiveCompletedAt IS NOT NULL
      AND exerciseId IS NOT NULL AND runnerId IS NOT NULL
  `).all(learner) as ProjectionAttempt[];
}

function latestComponents(attemptId: number) {
  return db.prepare(`
    SELECT c.componentKey, c.revision, c.canonicalAmount
    FROM attempt_reward_components c
    JOIN (
      SELECT componentKey, MAX(revision) AS revision
      FROM attempt_reward_components
      WHERE attemptId = ?
      GROUP BY componentKey
    ) latest ON latest.componentKey = c.componentKey AND latest.revision = c.revision
    WHERE c.attemptId = ?
  `).all(attemptId, attemptId) as Array<{ componentKey: string; revision: number; canonicalAmount: number }>;
}

export type AppliedProjection = {
  projectionRunId: number;
  changedComponents: number;
  rewardForTrigger: { awardedAmount: number; balanceAfter: number } | null;
};

// Promote a withheld / needs-review attempt to eligible and settle it exactly
// once. Idempotent: a second call is a no-op because the attempt is already
// eligible, and the projection itself is revision/idempotency-keyed (RTM-003).
export function approveHeldRewardAttempt(attemptId: number): AppliedProjection | null {
  const row = db.prepare(
    'SELECT learner, rewardSettlementStatus, rewardPolicyVersion, completionDate FROM attempts WHERE id = ? AND protocolVersion = 2'
  ).get(attemptId) as { learner: Learner; rewardSettlementStatus: string; rewardPolicyVersion: string | null; completionDate: string | null } | undefined;
  if (!row) return null;
  if (row.rewardSettlementStatus === 'eligible') return null;
  if (!row.rewardPolicyVersion || !rewardPolicyByVersion(row.rewardPolicyVersion)) {
    throw new Error(`Cannot approve attempt ${attemptId}: reward policy is unavailable.`);
  }
  return db.transaction(() => {
    db.prepare("UPDATE attempts SET rewardSettlementStatus = 'eligible' WHERE id = ? AND rewardSettlementStatus <> 'eligible'").run(attemptId);
    const applied = applyRewardProjectionV2(row.learner, attemptId);
    // The approved attempt itself changed (settlement flipped to eligible, stars
    // now awarded). It is the projection trigger, so the projection loop skips it;
    // emit an update notice so devices that cached it as held refresh it (RTM3-H01).
    emitAttemptChange(attemptId, 'approved');
    // The attempt now counts: refresh every derived aggregate it feeds, including
    // the daily leaderboard for its completion day (RTM2-H03).
    if (row.completionDate) recordDailyLeaderboard(row.completionDate);
    return applied;
  })();
}

export type HeldRewardAttempt = {
  id: number;
  learner: Learner;
  completionDate: string | null;
  score: number;
  questionCount: number;
  exerciseId: string | null;
  status: 'withheld' | 'needs_review';
  reviewReasonCode: string | null;
};

// Attempts held out of reward settlement, for a parent review surface (RTM2-H03).
export function listHeldRewardAttempts(): HeldRewardAttempt[] {
  return db.prepare(`
    SELECT id, learner, completionDate, score, questionCount, exerciseId,
           rewardSettlementStatus AS status,
           COALESCE(reviewReasonCode,
             CASE WHEN clockStatus = 'needs_review' THEN 'clock_drift' ELSE NULL END) AS reviewReasonCode
    FROM attempts
    WHERE protocolVersion = 2 AND rewardSettlementStatus IN ('withheld', 'needs_review')
    ORDER BY completionDate DESC, id DESC
  `).all() as HeldRewardAttempt[];
}

export function getProjectedRewardV2(attemptId: number) {
  const attempt = db.prepare('SELECT learner FROM attempts WHERE id = ? AND protocolVersion = 2').get(attemptId) as { learner: Learner } | undefined;
  if (!attempt) return null;
  const row = db.prepare(`
    SELECT COALESCE(SUM(latest.canonicalAmount), 0) AS awardedAmount
    FROM attempt_reward_components latest
    JOIN (
      SELECT componentKey, MAX(revision) AS revision
      FROM attempt_reward_components
      WHERE attemptId = ?
      GROUP BY componentKey
    ) revisions ON revisions.componentKey = latest.componentKey AND revisions.revision = latest.revision
    WHERE latest.attemptId = ?
  `).get(attemptId, attemptId) as { awardedAmount: number };
  return { attemptId, awardedAmount: rounded(row.awardedAmount), balanceAfter: getBalance(attempt.learner) };
}

export type CanonicalRewardComponent = { componentKey: string; amount: number };
export type CanonicalRewardSummary = {
  attemptId: number;
  total: number;
  study: number;
  streakBonus: number;
  ruleRewards: CanonicalRewardComponent[];
  components: CanonicalRewardComponent[];
  balanceAfter: number;
};

// Canonical reward breakdown for a protocol-v2 attempt from the authoritative
// attempt_reward_components ledger (latest revision per component). Used so the
// result-detail page reports the same total as the history list and the actual
// balance, instead of the study component alone (RTM4-M01).
export function getCanonicalRewardSummary(attemptId: number): CanonicalRewardSummary | null {
  const attempt = db.prepare('SELECT learner FROM attempts WHERE id = ? AND protocolVersion = 2').get(attemptId) as { learner: Learner } | undefined;
  if (!attempt) return null;
  const components = (latestComponents(attemptId) as Array<{ componentKey: string; canonicalAmount: number }>)
    .map((row) => ({ componentKey: row.componentKey, amount: rounded(row.canonicalAmount) }))
    .filter((component) => component.amount !== 0);
  const total = rounded(components.reduce((sum, component) => sum + component.amount, 0));
  const study = components.find((component) => component.componentKey === 'study')?.amount ?? 0;
  const streakBonus = components.find((component) => component.componentKey === 'streak:standard')?.amount ?? 0;
  const ruleRewards = components.filter((component) => component.componentKey.startsWith('rule:'));
  return { attemptId, total, study, streakBonus, ruleRewards, components, balanceAfter: getBalance(attempt.learner) };
}

/** Apply inside the authoritative attempt transaction. Any thrown error must roll
 * back the attempt, components and ledger together. */
export function applyRewardProjectionV2(
  learner: Learner,
  triggerAttemptId: number,
  options: { faultInjector?: (stage: string) => void } = {}
): AppliedProjection {
  const attempts = projectionAttempts(learner);
  const canonical = projectCanonicalRewards(attempts);
  const byAttempt = new Map<number, Map<string, CanonicalComponent>>();
  for (const component of canonical) {
    const target = byAttempt.get(component.attemptId) ?? new Map<string, CanonicalComponent>();
    target.set(component.componentKey, component);
    byAttempt.set(component.attemptId, target);
  }
  const dates = attempts.map((attempt) => attempt.completionDate).sort();
  const now = new Date().toISOString();
  const run = db.prepare(`
    INSERT INTO reward_projection_runs (learner, fromDate, throughDate, engineVersion, triggerAttemptId, status, createdAt)
    VALUES (?, ?, ?, ?, ?, 'running', ?)
  `).run(learner, dates[0] ?? '0000-00-00', dates.at(-1) ?? '0000-00-00', REWARD_ENGINE_VERSION, triggerAttemptId, now);
  const projectionRunId = Number(run.lastInsertRowid);
  options.faultInjector?.('after_projection_run');
  let changedComponents = 0;

  for (const attempt of attempts) {
    const desired = byAttempt.get(attempt.id) ?? new Map<string, CanonicalComponent>();
    const previousRows = latestComponents(attempt.id);
    const previous = new Map(previousRows.map((component) => [component.componentKey, component]));
    const keys = new Set([...desired.keys(), ...previous.keys()]);
    let maximumRevision = 0;
    let attemptChanged = false;
    for (const key of [...keys].sort()) {
      const before = previous.get(key);
      const target = desired.get(key);
      const priorAmount = rounded(before?.canonicalAmount ?? 0);
      const canonicalAmount = rounded(target?.amount ?? 0);
      maximumRevision = Math.max(maximumRevision, before?.revision ?? 0);
      if (priorAmount === canonicalAmount) continue;
      const revision = (before?.revision ?? 0) + 1;
      const delta = rounded(canonicalAmount - priorAmount);
      const effectiveDate = target?.effectiveDate ?? attempt.completionDate;
      const policyVersion = target?.policyVersion ?? attempt.rewardPolicyVersion;
      const idempotencyKey = `reward:v2:${attempt.id}:${key}:${revision}`;
      const ledger = db.prepare(`
        INSERT OR IGNORE INTO point_ledger (
          learner, amount, source, sourceId, description, createdAt, metadataJson,
          effectiveDate, idempotencyKey, rewardRevision
        ) VALUES (?, ?, 'reward_v2', ?, ?, ?, ?, ?, ?, ?)
      `).run(
        learner,
        delta,
        attempt.id,
        `Reward v2: ${key}`,
        now,
        JSON.stringify({ attemptId: attempt.id, componentKey: key, revision, priorAmount, canonicalAmount, delta, policyVersion }),
        effectiveDate,
        idempotencyKey,
        revision
      );
      const ledgerRow = db.prepare('SELECT id FROM point_ledger WHERE idempotencyKey = ?').get(idempotencyKey) as { id: number } | undefined;
      if (!ledgerRow || (ledger.changes !== 0 && ledger.changes !== 1)) throw new Error(`Could not persist reward ledger component ${idempotencyKey}.`);
      options.faultInjector?.('after_ledger');
      db.prepare(`
        INSERT OR IGNORE INTO attempt_reward_components (
          attemptId, componentKey, revision, canonicalAmount, previousCanonicalAmount,
          deltaAmount, policyVersion, effectiveDate, ledgerEntryId, projectionRunId, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        attempt.id,
        key,
        revision,
        canonicalAmount,
        priorAmount,
        delta,
        policyVersion,
        effectiveDate,
        ledgerRow.id,
        projectionRunId,
        now
      );
      maximumRevision = Math.max(maximumRevision, revision);
      changedComponents += 1;
      attemptChanged = true;
      options.faultInjector?.('after_component');
    }
    db.prepare('UPDATE attempts SET rewardRevision = ? WHERE id = ?').run(maximumRevision, attempt.id);
    // RTM3-H01: a reprojection triggered by a *later* attempt can revise this
    // earlier attempt's reward. It keeps its id, so the ID-cursor pull would miss
    // it — notify devices to refresh their cached copy. The trigger attempt is
    // delivered by the normal id-cursor pull (or, for approval, emitted by the
    // caller), so it does not need a change-log row here.
    if (attemptChanged && attempt.id !== triggerAttemptId) emitAttemptChange(attempt.id);

    const study = desired.get('study');
    const policy = rewardPolicyByVersion(attempt.rewardPolicyVersion);
    if (!policy) throw new Error(`Unknown reward policy ${attempt.rewardPolicyVersion}.`);
    const studyLedger = db.prepare(`
      SELECT ledgerEntryId FROM attempt_reward_components
      WHERE attemptId = ? AND componentKey = 'study'
      ORDER BY revision DESC LIMIT 1
    `).get(attempt.id) as { ledgerEntryId: number | null } | undefined;
    const scorePercent = attempt.questionCount > 0 ? attempt.score / attempt.questionCount : 0;
    const studyAmount = study?.amount ?? 0;
    db.prepare(`
      INSERT INTO study_attempt_rewards (
        attemptId, learner, exerciseKey, score, questionCount, scorePercent,
        baseValueBeforeScore, earnedBeforeCap, awardedAmount, dailyCap,
        dailyLearningEarnedBefore, dailyLearningEarnedAfter, decayAttemptNumberToday,
        ledgerEntryId, createdAt, metadataJson
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 1, ?, ?, ?)
      ON CONFLICT(attemptId) DO UPDATE SET
        awardedAmount = excluded.awardedAmount,
        ledgerEntryId = excluded.ledgerEntryId,
        metadataJson = excluded.metadataJson
    `).run(
      attempt.id,
      learner,
      `${attempt.runnerId}:${attempt.exerciseId}`,
      attempt.score,
      attempt.questionCount,
      scorePercent,
      policy.learning.baseValue,
      studyAmount,
      studyAmount,
      policy.learning.dailyCap,
      studyAmount,
      studyLedger?.ledgerEntryId ?? null,
      attempt.effectiveCompletedAt,
      JSON.stringify({ engineVersion: REWARD_ENGINE_VERSION, policyVersion: attempt.rewardPolicyVersion })
    );
  }

  options.faultInjector?.('before_complete');
  db.prepare(`
    UPDATE reward_projection_runs SET status = 'applied', detailJson = ?, completedAt = ? WHERE id = ?
  `).run(JSON.stringify({ changedComponents }), now, projectionRunId);

  const triggerComponents = byAttempt.get(triggerAttemptId);
  const total = triggerComponents ? rounded([...triggerComponents.values()].reduce((sum, component) => sum + component.amount, 0)) : 0;
  return {
    projectionRunId,
    changedComponents,
    rewardForTrigger: { awardedAmount: total, balanceAfter: getBalance(learner) }
  };
}
