import { createHash } from 'node:crypto';
import db from '@/lib/db';
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
  };
  rules: RewardPolicyRule[];
};

const DEFAULT_LEARNING: RewardPolicyV2['learning'] = {
  baseValue: 1,
  decayStep: 0.1,
  minimumValue: 0,
  dailyCap: 10,
  minimumScorePercent: 0.5,
  learningPointsEnabled: true,
  streakIntervalDays: 7,
  streakBonusAmount: 1,
  streakBonusEnabled: true
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
    streakBonusEnabled: Boolean(settings.streakBonusEnabled)
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
  const row = db.prepare('SELECT policyJson FROM reward_policy_versions WHERE version = ?').get(version) as { policyJson: string } | undefined;
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

export function freezeRewardCutoverBaseline() {
  const current = db.prepare('SELECT status FROM reward_cutover_state WHERE id = 1').get() as { status: string } | undefined;
  if (current?.status !== 'not_started') return current?.status ?? null;
  const balances = Object.fromEntries((db.prepare(`
    SELECT learner, COALESCE(SUM(amount), 0) AS balance FROM point_ledger GROUP BY learner
  `).all() as Array<{ learner: string; balance: number }>).map((row) => [row.learner, row.balance]));
  const lastLedger = (db.prepare('SELECT COALESCE(MAX(id), 0) AS id FROM point_ledger').get() as { id: number }).id;
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE reward_cutover_state
    SET cutoverAt = ?, baselineLedgerId = ?, baselineBalancesJson = ?, status = 'frozen', updatedAt = ?
    WHERE id = 1 AND status = 'not_started'
  `).run(now, lastLedger, JSON.stringify(balances), now);
  return 'frozen';
}
