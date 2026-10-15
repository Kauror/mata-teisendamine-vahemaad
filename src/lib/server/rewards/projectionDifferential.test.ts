import { afterAll, describe, expect, it } from 'vitest';
import db, { closeDatabaseForTests, getDatabase, stmt } from '@/lib/db';
import { getBalance, type Learner } from '@/lib/tasks';
import { REWARD_ENGINE_VERSION, rewardPolicyByVersion, type RewardPolicyV2 } from '@/lib/server/rewards/policy';
import { emitAttemptChange } from '@/lib/offline/server/attemptChanges';
import {
  applyRewardProjectionV2,
  projectCanonicalRewardsPure,
  type AppliedProjection,
  type CanonicalComponent,
  type ProjectionAttempt
} from '@/lib/server/rewards/projection';

// SRV-07 equivalence proof. `legacyApplyRewardProjectionV2` below is the
// implementation as it stood before the "persist only what changed" rewrite
// (main 4cdedd2), copied verbatim apart from its name and local helpers. Both
// implementations are driven through identical randomized learner histories on
// identically reset databases, and every persisted reward table must match row
// for row after every step.

// ---------------------------------------------------------------------------
// Reference: the pre-SRV-07 implementation (do not "fix" this copy).
// ---------------------------------------------------------------------------

function rounded(value: number) {
  return Math.round(value * 100) / 100;
}

function legacyProjectionAttempts(learner: Learner): ProjectionAttempt[] {
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

function legacyProjectCanonicalRewards(attempts: ProjectionAttempt[]): CanonicalComponent[] {
  const versions = new Set(attempts.map((attempt) => attempt.rewardPolicyVersion));
  const policies = new Map<string, RewardPolicyV2>();
  for (const version of versions) {
    const policy = rewardPolicyByVersion(version);
    if (!policy) throw new Error(`Unknown reward policy ${version}.`);
    policies.set(version, policy);
  }
  return projectCanonicalRewardsPure(attempts, policies);
}

function legacyLatestComponents(attemptId: number) {
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

function legacyApplyRewardProjectionV2(learner: Learner, triggerAttemptId: number): AppliedProjection {
  const attempts = legacyProjectionAttempts(learner);
  const canonical = legacyProjectCanonicalRewards(attempts);
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
  let changedComponents = 0;

  for (const attempt of attempts) {
    const desired = byAttempt.get(attempt.id) ?? new Map<string, CanonicalComponent>();
    const previousRows = legacyLatestComponents(attempt.id);
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
        learner, delta, attempt.id, `Reward v2: ${key}`, now,
        JSON.stringify({ attemptId: attempt.id, componentKey: key, revision, priorAmount, canonicalAmount, delta, policyVersion }),
        effectiveDate, idempotencyKey, revision
      );
      const ledgerRow = db.prepare('SELECT id FROM point_ledger WHERE idempotencyKey = ?').get(idempotencyKey) as { id: number } | undefined;
      if (!ledgerRow || (ledger.changes !== 0 && ledger.changes !== 1)) throw new Error(`Could not persist reward ledger component ${idempotencyKey}.`);
      db.prepare(`
        INSERT OR IGNORE INTO attempt_reward_components (
          attemptId, componentKey, revision, canonicalAmount, previousCanonicalAmount,
          deltaAmount, policyVersion, effectiveDate, ledgerEntryId, projectionRunId, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(attempt.id, key, revision, canonicalAmount, priorAmount, delta, policyVersion, effectiveDate, ledgerRow.id, projectionRunId, now);
      maximumRevision = Math.max(maximumRevision, revision);
      changedComponents += 1;
      attemptChanged = true;
    }
    db.prepare('UPDATE attempts SET rewardRevision = ? WHERE id = ?').run(maximumRevision, attempt.id);
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
      attempt.id, learner, `${attempt.runnerId}:${attempt.exerciseId}`, attempt.score, attempt.questionCount,
      scorePercent, policy.learning.baseValue, studyAmount, studyAmount, policy.learning.dailyCap, studyAmount,
      studyLedger?.ledgerEntryId ?? null, attempt.effectiveCompletedAt,
      JSON.stringify({ engineVersion: REWARD_ENGINE_VERSION, policyVersion: attempt.rewardPolicyVersion })
    );
  }

  db.prepare(`
    UPDATE reward_projection_runs SET status = 'applied', detailJson = ?, completedAt = ? WHERE id = ?
  `).run(JSON.stringify({ changedComponents }), now, projectionRunId);

  const triggerComponents = byAttempt.get(triggerAttemptId);
  const total = triggerComponents ? rounded([...triggerComponents.values()].reduce((sum, component) => sum + component.amount, 0)) : 0;
  return { projectionRunId, changedComponents, rewardForTrigger: { awardedAmount: total, balanceAfter: getBalance(learner) } };
}

// ---------------------------------------------------------------------------
// Harness
// ---------------------------------------------------------------------------

type Apply = (learner: Learner, triggerAttemptId: number) => AppliedProjection;
const legacy: Apply = (learner, id) => db.transaction(() => legacyApplyRewardProjectionV2(learner, id))();
const current: Apply = (learner, id) => db.transaction(() => applyRewardProjectionV2(learner, id))();

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const POLICIES: Record<string, RewardPolicyV2> = {
  p1: {
    schemaVersion: 2,
    learning: {
      baseValue: 1, decayStep: 0.1, minimumValue: 0, dailyCap: 10, minimumScorePercent: 0.5,
      learningPointsEnabled: true, streakIntervalDays: 7, streakBonusAmount: 1, streakBonusEnabled: true
    },
    rules: [{ id: 1, type: 'learning_streak', thresholdDays: 3, rewardStars: 2, learnerScope: 'both' }]
  },
  // Tight cap and steep decay so the cap and decay ordering bite.
  p2: {
    schemaVersion: 2,
    learning: {
      baseValue: 1.5, decayStep: 0.35, minimumValue: 0.2, dailyCap: 2.3, minimumScorePercent: 0.6,
      learningPointsEnabled: true, streakIntervalDays: 2, streakBonusAmount: 0.5, streakBonusEnabled: true
    },
    rules: [
      { id: 2, type: 'learning_streak', thresholdDays: 2, rewardStars: 1, learnerScope: 'kiur' },
      { id: 3, type: 'learning_streak', thresholdDays: 4, rewardStars: 3, learnerScope: 'kirsi' }
    ]
  },
  p3: {
    schemaVersion: 2,
    learning: {
      baseValue: 0.7, decayStep: 0.05, minimumValue: 0.1, dailyCap: 1.5, minimumScorePercent: 0.4,
      learningPointsEnabled: true, streakIntervalDays: 3, streakBonusAmount: 2, streakBonusEnabled: false
    },
    rules: [{ id: 4, type: 'learning_streak', thresholdDays: 5, rewardStars: 4, learnerScope: 'both' }]
  },
  // Learning points switched off: qualifies for nothing, so it also breaks streaks.
  p4: {
    schemaVersion: 2,
    learning: {
      baseValue: 1, decayStep: 0.1, minimumValue: 0, dailyCap: 10, minimumScorePercent: 0.5,
      learningPointsEnabled: false, streakIntervalDays: 2, streakBonusAmount: 1, streakBonusEnabled: true
    },
    rules: []
  }
};
const POLICY_NAMES = Object.keys(POLICIES);

function resetDatabase() {
  db.exec(`
    DELETE FROM attempt_reward_components;
    DELETE FROM reward_projection_runs;
    DELETE FROM study_attempt_rewards;
    DELETE FROM point_ledger;
    DELETE FROM server_change_log;
    DELETE FROM attempts;
    DELETE FROM reward_policy_current;
    DELETE FROM reward_policy_versions;
    DELETE FROM sqlite_sequence;
  `);
  const insert = db.prepare('INSERT INTO reward_policy_versions (version, contentHash, policyJson, createdAt) VALUES (?, ?, ?, ?)');
  for (const [version, policy] of Object.entries(POLICIES)) {
    insert.run(version, `hash-${version}`, JSON.stringify(policy), '2026-01-01T00:00:00.000Z');
  }
}

type SyntheticAttempt = {
  id: number; learner: Learner; date: string; time: string; exerciseId: string; runnerId: string;
  score: number; questionCount: number; policy: string; status: 'eligible' | 'withheld' | 'needs_review';
};

function insertSynthetic(attempt: SyntheticAttempt) {
  const completed = `${attempt.date}T${attempt.time}.000Z`;
  db.prepare(`
    INSERT INTO attempts (
      id, createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions,
      learner, exerciseId, runnerId, clientAttemptId, completedAt, effectiveCompletedAt,
      completionDate, rewardPolicyVersion, protocolVersion, rewardSettlementStatus
    ) VALUES (?, ?, 'cat', 'easy', ?, ?, 1, '[]', ?, ?, ?, ?, ?, ?, ?, ?, 2, ?)
  `).run(
    attempt.id, completed, attempt.questionCount, attempt.score, attempt.learner, attempt.exerciseId,
    attempt.runnerId, `00000000-0000-4000-8000-${String(attempt.id).padStart(12, '0')}`, completed, completed,
    attempt.date, attempt.policy, attempt.status
  );
}

function dayAfter(base: string, days: number) {
  return new Date(Date.parse(`${base}T00:00:00.000Z`) + days * 86_400_000).toISOString().slice(0, 10);
}

type Event =
  | { kind: 'insert'; attempt: SyntheticAttempt }
  | { kind: 'approve'; attemptId: number }
  | { kind: 'hide'; attemptId: number }
  | { kind: 'resync'; attemptId: number }
  | { kind: 'drift'; attemptId: number; how: 'revision' | 'study_delete' | 'study_amount' };

// A history is a sequence of sync events. Dates are drawn over ~4 weeks in
// random order, so most inserts are late-arriving offline attempts with an
// earlier completionDate than attempts already synced.
function buildScenario(seed: number): Event[] {
  const random = mulberry32(seed);
  const pick = <T,>(values: readonly T[]) => values[Math.floor(random() * values.length)];
  const events: Event[] = [];
  const inserted: SyntheticAttempt[] = [];
  const eventCount = 25 + Math.floor(random() * 50);
  const spanDays = 10 + Math.floor(random() * 20);
  // Several attempts per day: concentrate on a subset of days.
  const hotDays = Array.from({ length: Math.max(3, Math.floor(spanDays / 2)) }, () => Math.floor(random() * spanDays));
  let nextId = 1;
  for (let index = 0; index < eventCount; index += 1) {
    const roll = random();
    const held = inserted.filter((attempt) => attempt.status !== 'eligible');
    if (roll < 0.08 && held.length > 0) {
      const target = pick(held);
      target.status = 'eligible';
      events.push({ kind: 'approve', attemptId: target.id });
    } else if (roll < 0.12 && inserted.length > 0) {
      events.push({ kind: 'hide', attemptId: pick(inserted).id });
    } else if (roll < 0.16 && inserted.some((attempt) => attempt.status === 'eligible')) {
      events.push({ kind: 'resync', attemptId: pick(inserted.filter((attempt) => attempt.status === 'eligible')).id });
    } else if (roll < 0.20 && inserted.some((attempt) => attempt.status === 'eligible')) {
      events.push({
        kind: 'drift',
        attemptId: pick(inserted.filter((attempt) => attempt.status === 'eligible')).id,
        how: pick(['revision', 'study_delete', 'study_amount'] as const)
      });
    } else {
      const statusRoll = random();
      const day = random() < 0.7 ? pick(hotDays) : Math.floor(random() * spanDays);
      const attempt: SyntheticAttempt = {
        id: nextId++,
        learner: random() < 0.7 ? 'kiur' : 'kirsi',
        date: dayAfter('2026-06-01', day),
        time: `${String(6 + Math.floor(random() * 14)).padStart(2, '0')}:${String(Math.floor(random() * 60)).padStart(2, '0')}:${String(Math.floor(random() * 60)).padStart(2, '0')}`,
        exerciseId: pick(['ex-a', 'ex-b', 'ex-c']),
        runnerId: pick(['math', 'math', 'reading']),
        score: Math.floor(random() * 11),
        questionCount: random() < 0.05 ? 0 : 10,
        // Policy mostly follows time (a parent changed settings mid-period),
        // with some devices still on an older grant.
        policy: random() < 0.75 ? POLICY_NAMES[Math.min(POLICY_NAMES.length - 1, Math.floor((day / spanDays) * 3))] : pick(POLICY_NAMES),
        status: statusRoll < 0.8 ? 'eligible' : statusRoll < 0.9 ? 'withheld' : 'needs_review'
      };
      inserted.push(attempt);
      events.push({ kind: 'insert', attempt: { ...attempt } });
    }
  }
  return events;
}

function learnerOf(attemptId: number) {
  return (db.prepare('SELECT learner FROM attempts WHERE id = ?').get(attemptId) as { learner: Learner }).learner;
}

// Every persisted row a reader can observe, minus wall-clock timestamps.
function snapshot() {
  return {
    ledger: db.prepare(`
      SELECT id, learner, amount, source, sourceId, description, metadataJson, effectiveDate, idempotencyKey, rewardRevision
      FROM point_ledger ORDER BY id
    `).all(),
    components: db.prepare(`
      SELECT id, attemptId, componentKey, revision, canonicalAmount, previousCanonicalAmount, deltaAmount,
             policyVersion, effectiveDate, ledgerEntryId, projectionRunId
      FROM attempt_reward_components ORDER BY id
    `).all(),
    // Every column except the AUTOINCREMENT surrogate `id`: the legacy upsert
    // burned one sequence value per past attempt per sync even when it only
    // updated (SQLite allocates the rowid before the conflict check), so the
    // new row of a later attempt gets a smaller, but still unique and
    // increasing, id. No reader keys on study_attempt_rewards.id; all join on
    // attemptId (UNIQUE).
    study: db.prepare(`
      SELECT attemptId, learner, exerciseKey, score, questionCount, scorePercent, baseValueBeforeScore,
             earnedBeforeCap, awardedAmount, dailyCap, dailyLearningEarnedBefore, dailyLearningEarnedAfter,
             decayAttemptNumberToday, ledgerEntryId, createdAt, metadataJson
      FROM study_attempt_rewards ORDER BY attemptId
    `).all(),
    // ...but the relative order of the ids (insertion order) must still match.
    studyInsertionOrder: db.prepare('SELECT attemptId FROM study_attempt_rewards ORDER BY id').all(),
    attempts: db.prepare('SELECT id, rewardRevision, rewardSettlementStatus, deletedAt FROM attempts ORDER BY id').all(),
    runs: db.prepare(`
      SELECT id, learner, fromDate, throughDate, engineVersion, triggerAttemptId, status, detailJson
      FROM reward_projection_runs ORDER BY id
    `).all(),
    changes: db.prepare('SELECT changeId, stream, entityType, entityId, operation, payloadJson FROM server_change_log ORDER BY changeId').all(),
    balances: { kiur: getBalance('kiur'), kirsi: getBalance('kirsi') },
    ledgerSum: (db.prepare("SELECT COALESCE(SUM(amount), 0) AS total FROM point_ledger WHERE source = 'reward_v2'").get() as { total: number }).total
  };
}

function stepDigest() {
  return db.prepare(`
    SELECT
      (SELECT group_concat(id || ':' || rewardRevision, ',') FROM (SELECT id, rewardRevision FROM attempts ORDER BY id)) AS revisions,
      (SELECT group_concat(attemptId || ':' || awardedAmount || ':' || COALESCE(ledgerEntryId, '-') || ':' || COALESCE(metadataJson, '-'), ',')
         FROM (SELECT * FROM study_attempt_rewards ORDER BY attemptId)) AS study,
      (SELECT COUNT(*) FROM point_ledger) AS ledgerRows,
      (SELECT group_concat(learner || '=' || total, ',') FROM (
         SELECT learner, ROUND(SUM(amount), 6) AS total FROM point_ledger GROUP BY learner ORDER BY learner)) AS balances
  `).get();
}

function runScenario(events: Event[], apply: Apply) {
  resetDatabase();
  const trace: unknown[] = [];
  for (const event of events) {
    switch (event.kind) {
      case 'insert':
        insertSynthetic(event.attempt);
        if (event.attempt.status === 'eligible') trace.push(apply(event.attempt.learner, event.attempt.id));
        break;
      case 'approve':
        // approveHeldRewardAttempt's reward-relevant steps, with the
        // implementation under test as the projection.
        db.prepare("UPDATE attempts SET rewardSettlementStatus = 'eligible' WHERE id = ? AND rewardSettlementStatus <> 'eligible'").run(event.attemptId);
        trace.push(apply(learnerOf(event.attemptId), event.attemptId));
        emitAttemptChange(event.attemptId, 'approved');
        break;
      case 'hide':
        db.prepare("UPDATE attempts SET deletedAt = '2026-07-01T00:00:00.000Z', deletedReason = 'test' WHERE id = ?").run(event.attemptId);
        break;
      case 'resync':
        trace.push(apply(learnerOf(event.attemptId), event.attemptId));
        break;
      case 'drift':
        // Derived rows out of step with the ledger must be repaired by the
        // next projection exactly as the full rewrite repaired them.
        if (event.how === 'revision') db.prepare('UPDATE attempts SET rewardRevision = 0 WHERE id = ?').run(event.attemptId);
        if (event.how === 'study_delete') db.prepare('DELETE FROM study_attempt_rewards WHERE attemptId = ?').run(event.attemptId);
        if (event.how === 'study_amount') db.prepare('UPDATE study_attempt_rewards SET awardedAmount = awardedAmount + 0.5 WHERE attemptId = ?').run(event.attemptId);
        trace.push(apply(learnerOf(event.attemptId), event.attemptId));
        break;
    }
    // Ledger, components, runs and the change log are append-only, so the final
    // snapshot covers their whole history; the mutable state (rewardRevision and
    // study rows) and the balances are also checked after every step.
    trace.push(stepDigest());
  }
  trace.push(snapshot());
  return trace;
}

// ---------------------------------------------------------------------------
// Statement counting
// ---------------------------------------------------------------------------

type Counts = { prepares: number; executions: number; writes: number; rowsChanged: number };

function countStatements<T>(body: () => T): { result: T; counts: Counts } {
  const connection = getDatabase();
  const databaseProto = Object.getPrototypeOf(connection) as { prepare: (...args: unknown[]) => unknown };
  const statementProto = Object.getPrototypeOf(connection.prepare('SELECT 1')) as Record<string, (...args: unknown[]) => unknown>;
  const counts: Counts = { prepares: 0, executions: 0, writes: 0, rowsChanged: 0 };
  const originalPrepare = databaseProto.prepare;
  const originals = { run: statementProto.run, get: statementProto.get, all: statementProto.all };
  databaseProto.prepare = function (this: unknown, ...args: unknown[]) {
    counts.prepares += 1;
    return originalPrepare.apply(this, args);
  };
  for (const name of ['run', 'get', 'all'] as const) {
    const original = originals[name];
    statementProto[name] = function (this: { reader: boolean }, ...args: unknown[]) {
      counts.executions += 1;
      const value = original.apply(this, args);
      if (name === 'run') {
        counts.writes += 1;
        counts.rowsChanged += (value as { changes: number }).changes;
      }
      return value;
    };
  }
  try {
    return { result: body(), counts };
  } finally {
    databaseProto.prepare = originalPrepare;
    Object.assign(statementProto, originals);
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

// The legacy reference is quadratic per history, so the default keeps the suite
// fast; set SRV07_SEEDS (e.g. 1000) for a deeper run.
const SEEDS = Number(process.env.SRV07_SEEDS) > 0 ? Number(process.env.SRV07_SEEDS) : 100;

afterAll(() => closeDatabaseForTests());

describe('SRV-07 differential: write-only-changes projection equals the full rewrite', () => {
  it(`persists identical ledgers, components, study rows, revisions and balances over ${SEEDS} random histories`, () => {
    let projections = 0;
    for (let seed = 1; seed <= SEEDS; seed += 1) {
      const events = buildScenario(seed);
      const expected = runScenario(events, legacy);
      const actual = runScenario(events, current);
      projections += expected.filter((entry) => entry && typeof entry === 'object' && 'projectionRunId' in entry).length;
      // Compare step by step so a failure names the seed and the first diverging step.
      expect(actual.length).toBe(expected.length);
      for (let step = 0; step < expected.length; step += 1) {
        // String comparison first (fast); a deep diff only on divergence.
        if (JSON.stringify(actual[step]) !== JSON.stringify(expected[step])) {
          expect(actual[step], `seed ${seed}, trace step ${step}`).toEqual(expected[step]);
        }
      }
    }
    expect(projections).toBeGreaterThan(SEEDS * 20);
  }, 300_000);

  it('measures statements and writes for one sync on a 300-attempt history', () => {
    // 300 eligible attempts for one learner over 60 days, five a day, already
    // settled; then one new attempt syncs. Two triggers: a normal attempt on the
    // newest day, and a late offline attempt on the oldest day (which revises
    // decay/cap on that day and shifts nothing else).
    const history: SyntheticAttempt[] = [];
    for (let index = 0; index < 300; index += 1) {
      history.push({
        id: index + 1, learner: 'kiur', date: dayAfter('2026-04-01', Math.floor(index / 5)),
        time: `${String(8 + (index % 5)).padStart(2, '0')}:00:00`, exerciseId: index % 2 ? 'ex-a' : 'ex-b', runnerId: 'math',
        score: 8, questionCount: 10, policy: index < 150 ? 'p1' : 'p2', status: 'eligible'
      });
    }
    const triggers: Array<[string, SyntheticAttempt]> = [
      ['newest day', { ...history[0], id: 301, date: dayAfter('2026-04-01', 60), time: '09:00:00', policy: 'p2' }],
      ['late offline, oldest day', { ...history[0], id: 302, date: '2026-04-01', time: '07:00:00', policy: 'p1' }]
    ];
    const build = () => {
      resetDatabase();
      for (const attempt of history) insertSynthetic(attempt);
      current('kiur', 300);
    };
    const report: string[] = [];
    for (const [label, trigger] of triggers) {
      const measured: Record<string, { counts: Counts; ms: number[]; state: unknown }> = {};
      for (const [name, apply] of [['before', legacy], ['after', current]] as const) {
        const ms: number[] = [];
        let counts: Counts | null = null;
        let state: unknown = null;
        for (let repeat = 0; repeat < 7; repeat += 1) {
          build();
          insertSynthetic(trigger);
          if (repeat === 0) {
            counts = countStatements(() => apply('kiur', trigger.id)).counts;
          } else {
            const started = performance.now();
            apply('kiur', trigger.id);
            ms.push(performance.now() - started);
          }
          state = snapshot();
        }
        measured[name] = { counts: counts!, ms: ms.sort((left, right) => left - right), state };
      }
      expect(measured.after.state).toEqual(measured.before.state);
      expect(measured.after.counts.writes).toBeLessThan(measured.before.counts.writes);
      const median = (values: number[]) => values[Math.floor(values.length / 2)].toFixed(2);
      report.push(
        `[SRV-07] ${label}: before ${JSON.stringify(measured.before.counts)} median ${median(measured.before.ms)} ms; ` +
        `after ${JSON.stringify(measured.after.counts)} median ${median(measured.after.ms)} ms`
      );
    }
    console.log(report.join('\n'));
  }, 120_000);
});

describe('SRV-09 statement cache', () => {
  it('reuses one compiled statement per SQL text and drops the cache with the connection', () => {
    const first = stmt('SELECT 1 AS one');
    expect(stmt('SELECT 1 AS one')).toBe(first);
    expect(stmt('SELECT 2 AS two')).not.toBe(first);
    closeDatabaseForTests();
    const reopened = stmt('SELECT 1 AS one');
    expect(reopened).not.toBe(first);
    expect(reopened.get()).toEqual({ one: 1 });
  });
});
