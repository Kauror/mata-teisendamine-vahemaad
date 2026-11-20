import { createHash } from 'node:crypto';
import db, { stmt } from '@/lib/db';
import { OFFLINE_CAPABILITY_MANIFEST, type OfflineRunnerCapability } from '@/lib/offline/capabilities';

export const REWARD_ENGINE_VERSION = 2;

export type RewardPolicyRule = {
  id: number;
  type: 'learning_streak';
  thresholdDays: number;
  rewardStars: number;
  learnerScope: 'both' | 'kiur' | 'kirsi';
};

export type RewardPolicyV2 = {
  schemaVersion: 2;
  learning: {
    baseValue: number;
    decayStep: number;
    minimumValue: number;
    dailyCap: number;
    minimumScorePercent: number;
    learningPointsEnabled: boolean;
    streakIntervalDays: number;
    streakBonusAmount: number;
    streakBonusEnabled: boolean;
    // Added 2026-11-20 (parent's decision, review B8). Absent in every older
    // policy version, whose attempts keep the old rule: the full value from
    // minimumScorePercent up. Policy versions are immutable, so re-projecting
    // old attempts never changes their stars.
    scoreTiers?: RewardScoreTiers;
    // Normal question count per runner (key `runnerId` or `runnerId:topic`).
    // A shorter session of such a runner pays in proportion, so a hand-made
    // 1-question maths link cannot earn a whole star. Same immutability rule.
    expectedQuestionCounts?: Record<string, number>;
  };
  rules: RewardPolicyRule[];
};

export type RewardScoreTiers = {
  // From minimumScorePercent up to (not including) this, the study value is
  // multiplied by partialValueFactor; from this up it is paid in full.
  fullValueScorePercent: number;
  partialValueFactor: number;
};

// The current rule: 0 below 50%, half at 50-74%, full from 75%.
export const CURRENT_SCORE_TIERS: RewardScoreTiers = { fullValueScorePercent: 0.75, partialValueFactor: 0.5 };
// Maths sessions are 15 questions; Kiur's word problems (tekstülesanded) are 5.
// Other runners have their own fixed sizes or are timed, and are not scaled.
export const CURRENT_EXPECTED_QUESTION_COUNTS: Record<string, number> = { math: 15, 'math:tekstulesanded': 5 };

// The share of an attempt's study value that its score and length earn under
// the given policy: 0 when it does not qualify, otherwise the score tier factor
// times the length factor. An old policy without tiers gives 1 or 0 as before.
export function studyValueFactor(
  policy: RewardPolicyV2,
  attempt: { score: number; questionCount: number; runnerId: string; topic?: string | null }
): number {
  const scorePercent = attempt.questionCount > 0 ? attempt.score / attempt.questionCount : 0;
  if (scorePercent < policy.learning.minimumScorePercent) return 0;
  const tiers = policy.learning.scoreTiers;
  const scoreFactor = tiers && scorePercent < tiers.fullValueScorePercent ? tiers.partialValueFactor : 1;
  const counts = policy.learning.expectedQuestionCounts;
  const expected = counts ? counts[`${attempt.runnerId}:${attempt.topic ?? ''}`] ?? counts[attempt.runnerId] : undefined;
  const lengthFactor = expected && expected > 0 ? Math.min(1, attempt.questionCount / expected) : 1;
  return scoreFactor * lengthFactor;
}

const DEFAULT_LEARNING: RewardPolicyV2['learning'] = {
  baseValue: 1,
  decayStep: 0.1,
  minimumValue: 0,
  dailyCap: 10,
  minimumScorePercent: 0.5,
  learningPointsEnabled: true,
  streakIntervalDays: 7,
  streakBonusAmount: 1,
  streakBonusEnabled: true,
  scoreTiers: CURRENT_SCORE_TIERS,
  expectedQuestionCounts: CURRENT_EXPECTED_QUESTION_COUNTS
};

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => `${JSON.stringify(key)}:${canonical(child)}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

function contentHash(policy: RewardPolicyV2) {
  return createHash('sha256').update(canonical(policy)).digest('hex');
}

export function snapshotCurrentRewardPolicy(): RewardPolicyV2 {
  const settings = db.prepare('SELECT * FROM learning_point_settings WHERE id = 1').get() as Record<string, unknown> | undefined;
  const learning = settings ? {
    baseValue: Number(settings.baseValue),
    decayStep: Number(settings.decayStep),
    minimumValue: Number(settings.minimumValue),
    dailyCap: Number(settings.dailyCap),
    minimumScorePercent: 0.5,
    learningPointsEnabled: Boolean(settings.learningPointsEnabled),
    streakIntervalDays: Number(settings.streakIntervalDays),
    streakBonusAmount: Number(settings.streakBonusAmount),
    streakBonusEnabled: Boolean(settings.streakBonusEnabled),
    scoreTiers: CURRENT_SCORE_TIERS,
    expectedQuestionCounts: CURRENT_EXPECTED_QUESTION_COUNTS
  } : DEFAULT_LEARNING;
  const rules = db.prepare(`
    SELECT id, thresholdDays, rewardStars, learnerScope
    FROM reward_rules
    WHERE deletedAt IS NULL AND enabled = 1 AND type = 'learning_streak'
    ORDER BY id ASC
  `).all() as Array<{ id: number; thresholdDays: number; rewardStars: number; learnerScope: string }>;
  return {
    schemaVersion: 2,
    learning,
    rules: rules.map((rule) => ({
      id: rule.id,
      type: 'learning_streak',
      thresholdDays: rule.thresholdDays,
      rewardStars: rule.rewardStars,
      learnerScope: rule.learnerScope === 'kiur' || rule.learnerScope === 'kirsi' ? rule.learnerScope : 'both'
    }))
  };
}

// The version ensureCurrentRewardPolicy would return, without writing.
export function currentRewardPolicyVersion(): string {
  return `rp2-${contentHash(snapshotCurrentRewardPolicy())}`;
}

export function ensureCurrentRewardPolicy() {
  const policy = snapshotCurrentRewardPolicy();
  const hash = contentHash(policy);
  const version = `rp2-${hash}`;
  const current = db.prepare('SELECT version FROM reward_policy_current WHERE id = 1').get() as { version: string } | undefined;
  const now = new Date().toISOString();
  db.prepare(`
    INSERT OR IGNORE INTO reward_policy_versions (version, contentHash, policyJson, createdAt, supersedesVersion)
    VALUES (?, ?, ?, ?, ?)
  `).run(version, hash, canonical(policy), now, current?.version ?? null);
  db.prepare(`
    INSERT INTO reward_policy_current (id, version, updatedAt)
    VALUES (1, ?, ?)
    ON CONFLICT(id) DO UPDATE SET version = excluded.version, updatedAt = excluded.updatedAt
  `).run(version, now);
  return { version, policy };
}

export function rewardPolicyByVersion(version: string): RewardPolicyV2 | null {
  const row = stmt('SELECT policyJson FROM reward_policy_versions WHERE version = ?').get(version) as { policyJson: string } | undefined;
  if (!row) return null;
  try {
    const parsed = JSON.parse(row.policyJson) as RewardPolicyV2;
    return parsed.schemaVersion === 2 ? parsed : null;
  } catch {
    return null;
  }
}

export type CatalogueGrantContract = {
  learner: 'kiur' | 'kirsi';
  catalogueVersion: string;
  deviceId: string | null;
  rewardPolicyVersion: string;
  generatorVersion: string;
  runnerVersion: string;
  runnerContractsJson?: string;
  rotationVersion: number;
  issuedAt: string;
  validUntil: string;
};

// The grant a device is handed on sync must be the grant the server later
// validates its attempts against. The row is therefore refreshed to whatever is
// being served, not written once and left behind: `issuedAt` and `createdAt` are
// the only frozen fields, because they record when this catalogue version first
// became available rather than what the contract currently says.
//
// A stale row is not a cosmetic drift. `validUntil` is copied from the rolling
// catalogue window, which `getCurrentCatalogue` pushes to now + CATALOGUE_VALID_DAYS
// on every serve. Leaving the grant on its first value meant that a child whose
// exercise pool had not changed for that long had every attempt held for parent
// review as `completion_after_grant`, which also removed the day from the daily
// leaderboard. `rewardPolicyVersion` and the runner contract have the same shape
// of failure with a harder landing: the device stamps attempts with the version
// it was served, so a frozen row rejects them outright as `metadata_mismatch`.
export function grantCatalogueContract(input: Omit<CatalogueGrantContract, 'rewardPolicyVersion'> & { rewardPolicyVersion?: string }) {
  const rewardPolicyVersion = input.rewardPolicyVersion ?? ensureCurrentRewardPolicy().version;
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO catalogue_grants (
      learner, catalogueVersion, deviceId, rewardPolicyVersion, generatorVersion,
      runnerVersion, runnerContractsJson, rotationVersion, issuedAt, validUntil, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(learner, catalogueVersion, deviceId) DO UPDATE SET
      rewardPolicyVersion = excluded.rewardPolicyVersion,
      generatorVersion = excluded.generatorVersion,
      runnerVersion = excluded.runnerVersion,
      runnerContractsJson = excluded.runnerContractsJson,
      rotationVersion = excluded.rotationVersion,
      validUntil = excluded.validUntil
  `).run(
    input.learner,
    input.catalogueVersion,
    input.deviceId,
    rewardPolicyVersion,
    input.generatorVersion,
    input.runnerVersion,
    JSON.stringify(OFFLINE_CAPABILITY_MANIFEST.runners),
    input.rotationVersion,
    input.issuedAt,
    input.validUntil,
    now
  );
  return { ...input, rewardPolicyVersion };
}

// The exact row this device was last handed for a catalogue version (no
// device-less fallback), plus whether its contract still matches what a fresh
// grant would say. The sync pull resends a grant whose contract drifted
// (policy edit, runner contract change, generator bump) even when its window
// is still long, so slimming the pull never strands a device on an old policy.
export function catalogueGrantForDevice(learner: 'kiur' | 'kirsi', catalogueVersion: string, deviceId: string) {
  return db.prepare(`
    SELECT learner, catalogueVersion, deviceId, rewardPolicyVersion, generatorVersion,
           runnerVersion, runnerContractsJson, rotationVersion, issuedAt, validUntil
    FROM catalogue_grants
    WHERE learner = ? AND catalogueVersion = ? AND deviceId = ?
  `).get(learner, catalogueVersion, deviceId) as CatalogueGrantContract | undefined;
}

export function grantContractIsCurrent(
  row: CatalogueGrantContract,
  expected: Pick<CatalogueGrantContract, 'rewardPolicyVersion' | 'generatorVersion' | 'runnerVersion' | 'rotationVersion'>
): boolean {
  return row.rewardPolicyVersion === expected.rewardPolicyVersion &&
    row.generatorVersion === expected.generatorVersion &&
    row.runnerVersion === expected.runnerVersion &&
    row.rotationVersion === expected.rotationVersion &&
    row.runnerContractsJson === JSON.stringify(OFFLINE_CAPABILITY_MANIFEST.runners);
}

export function catalogueGrantForAttempt(learner: 'kiur' | 'kirsi', catalogueVersion: string, deviceId: string | null) {
  return db.prepare(`
    SELECT learner, catalogueVersion, deviceId, rewardPolicyVersion, generatorVersion,
           runnerVersion, runnerContractsJson, rotationVersion, issuedAt, validUntil
    FROM catalogue_grants
    WHERE learner = ? AND catalogueVersion = ? AND (deviceId = ? OR deviceId IS NULL)
    ORDER BY CASE WHEN deviceId = ? THEN 0 ELSE 1 END
    LIMIT 1
  `).get(learner, catalogueVersion, deviceId, deviceId) as CatalogueGrantContract | undefined;
}

export function runnerContractForGrant(grant: CatalogueGrantContract, runnerId: string): OfflineRunnerCapability | null {
  if (grant.runnerContractsJson) {
    try {
      const contracts = JSON.parse(grant.runnerContractsJson) as OfflineRunnerCapability[];
      const match = contracts.find((contract) => contract.runnerId === runnerId);
      if (match) return match;
    } catch {
      return null;
    }
  }
  // Compatibility for the first v2 rehearsal databases created before the
  // per-runner contract snapshot column was populated.
  return OFFLINE_CAPABILITY_MANIFEST.runners.find((contract) => contract.runnerId === runnerId) ?? null;
}
