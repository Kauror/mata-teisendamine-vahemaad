import Database from 'better-sqlite3';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { hashSecret } from '@/lib/auth/password';

/**
 * The application has historically imported a singleton `db` object directly.
 * Keep that API, but defer opening SQLite (and therefore migrations) until the
 * first actual database operation. Merely importing a route during `next build`
 * is now side-effect free.
 */
export type DatabaseConnection = InstanceType<typeof Database>;

function applyLegacySchema(db: DatabaseConnection) {

db.exec(`
  CREATE TABLE IF NOT EXISTS attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    createdAt TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    questionCount INTEGER NOT NULL,
    score INTEGER NOT NULL,
    elapsedSeconds INTEGER NOT NULL,
    questions TEXT NOT NULL
  )
`);

const cols = db.prepare('PRAGMA table_info(attempts)').all() as Array<{ name: string }>;
const hasLearner = cols.some((c) => c.name === 'learner');
const hasSubject = cols.some((c) => c.name === 'subject');
const hasTopic = cols.some((c) => c.name === 'topic');
const hasExerciseId = cols.some((c) => c.name === 'exerciseId');

function addColumnIfMissing(hasColumn: boolean, statement: string) {
  if (hasColumn) return;
  try {
    db.exec(statement);
  } catch (error) {
    if (error instanceof Error && error.message.includes('duplicate column name')) return;
    throw error;
  }
}

addColumnIfMissing(hasLearner, 'ALTER TABLE attempts ADD COLUMN learner TEXT');
addColumnIfMissing(hasSubject, 'ALTER TABLE attempts ADD COLUMN subject TEXT');
addColumnIfMissing(hasTopic, 'ALTER TABLE attempts ADD COLUMN topic TEXT');
addColumnIfMissing(hasExerciseId, 'ALTER TABLE attempts ADD COLUMN exerciseId TEXT');

// Offline-sync columns on attempts (all nullable so legacy rows stay valid).
// clientAttemptId is the device-minted UUID that makes uploads idempotent;
// completedAt is the effective Tallinn-corrected completion time used for
// day-based reward logic, distinct from syncedAt (when the server received it).
const attemptOfflineCols = db.prepare('PRAGMA table_info(attempts)').all() as Array<{ name: string }>;
const attemptHas = (name: string) => attemptOfflineCols.some((c) => c.name === name);
addColumnIfMissing(attemptHas('clientAttemptId'), 'ALTER TABLE attempts ADD COLUMN clientAttemptId TEXT');
addColumnIfMissing(attemptHas('deviceId'), 'ALTER TABLE attempts ADD COLUMN deviceId TEXT');
addColumnIfMissing(attemptHas('startedAt'), 'ALTER TABLE attempts ADD COLUMN startedAt TEXT');
addColumnIfMissing(attemptHas('completedAt'), 'ALTER TABLE attempts ADD COLUMN completedAt TEXT');
addColumnIfMissing(attemptHas('rawDeviceCompletedAt'), 'ALTER TABLE attempts ADD COLUMN rawDeviceCompletedAt TEXT');
addColumnIfMissing(attemptHas('syncedAt'), 'ALTER TABLE attempts ADD COLUMN syncedAt TEXT');
addColumnIfMissing(attemptHas('catalogueVersion'), 'ALTER TABLE attempts ADD COLUMN catalogueVersion TEXT');
addColumnIfMissing(attemptHas('clientTimeZone'), 'ALTER TABLE attempts ADD COLUMN clientTimeZone TEXT');
addColumnIfMissing(attemptHas('clientUtcOffsetMinutes'), 'ALTER TABLE attempts ADD COLUMN clientUtcOffsetMinutes INTEGER');
// Idempotency at the DB level: one row per non-null clientAttemptId. Legacy rows
// (null) are unconstrained.
assertNoDuplicateClientAttemptIds(db);
db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_attempts_client_attempt_id ON attempts(clientAttemptId) WHERE clientAttemptId IS NOT NULL');
db.exec('CREATE INDEX IF NOT EXISTS idx_attempts_learner_completed ON attempts(learner, completedAt)');

db.exec(`
  CREATE TABLE IF NOT EXISTS point_ledger (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    learner TEXT NOT NULL,
    amount INTEGER NOT NULL,
    source TEXT NOT NULL,
    sourceId INTEGER,
    description TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    metadataJson TEXT
  );

  CREATE TABLE IF NOT EXISTS task_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    points INTEGER NOT NULL,
    assignmentMode TEXT NOT NULL,
    recurrenceType TEXT NOT NULL,
    selectedWeekdaysJson TEXT,
    startDate TEXT,
    onceDate TEXT,
    requiresApproval INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL,
    deletedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS task_instances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    templateId INTEGER NOT NULL,
    date TEXT NOT NULL,
    titleSnapshot TEXT NOT NULL,
    pointsSnapshot INTEGER NOT NULL,
    assignmentModeSnapshot TEXT NOT NULL,
    requiresApprovalSnapshot INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL,
    completedBy TEXT,
    completedAt TEXT,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (templateId) REFERENCES task_templates(id)
  );

  CREATE TABLE IF NOT EXISTS task_instance_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    taskInstanceId INTEGER NOT NULL,
    learner TEXT NOT NULL,
    status TEXT NOT NULL,
    completedAt TEXT,
    pointsAwarded INTEGER,
    ledgerEntryId INTEGER,
    FOREIGN KEY (taskInstanceId) REFERENCES task_instances(id),
    FOREIGN KEY (ledgerEntryId) REFERENCES point_ledger(id)
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_task_instances_template_date
    ON task_instances(templateId, date);

  CREATE UNIQUE INDEX IF NOT EXISTS idx_task_assignments_instance_learner
    ON task_instance_assignments(taskInstanceId, learner);

  CREATE INDEX IF NOT EXISTS idx_point_ledger_learner_created
    ON point_ledger(learner, createdAt);

  CREATE INDEX IF NOT EXISTS idx_task_instances_date
    ON task_instances(date);

  CREATE TABLE IF NOT EXISTS store_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    visibility TEXT NOT NULL,
    stockType TEXT NOT NULL,
    fixedStockRemaining INTEGER,
    dailyStockLimit INTEGER,
    availableFrom TEXT,
    availableUntil TEXT,
    availableWeekdaysJson TEXT,
    isActive INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    deletedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS store_purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    storeItemId INTEGER,
    learner TEXT NOT NULL,
    titleSnapshot TEXT NOT NULL,
    descriptionSnapshot TEXT,
    priceSnapshot INTEGER NOT NULL,
    visibilitySnapshot TEXT NOT NULL,
    stockTypeSnapshot TEXT NOT NULL,
    purchasedAt TEXT NOT NULL,
    ledgerEntryId INTEGER NOT NULL,
    balanceAfterPurchase INTEGER NOT NULL,
    metadataJson TEXT,
    FOREIGN KEY (storeItemId) REFERENCES store_items(id),
    FOREIGN KEY (ledgerEntryId) REFERENCES point_ledger(id)
  );

  CREATE TABLE IF NOT EXISTS store_item_hidden_dates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    storeItemId INTEGER NOT NULL,
    date TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (storeItemId) REFERENCES store_items(id)
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_store_hidden_item_date
    ON store_item_hidden_dates(storeItemId, date);

  CREATE INDEX IF NOT EXISTS idx_store_purchases_learner_date
    ON store_purchases(learner, purchasedAt);

  CREATE TABLE IF NOT EXISTS learning_point_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    baseValue REAL NOT NULL,
    decayStep REAL NOT NULL,
    minimumValue REAL NOT NULL,
    dailyCap REAL NOT NULL,
    streakIntervalDays INTEGER NOT NULL,
    streakBonusAmount REAL NOT NULL,
    learningPointsEnabled INTEGER NOT NULL,
    streakBonusEnabled INTEGER NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS study_attempt_rewards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    attemptId INTEGER NOT NULL UNIQUE,
    learner TEXT NOT NULL,
    exerciseKey TEXT NOT NULL,
    score INTEGER NOT NULL,
    questionCount INTEGER NOT NULL,
    scorePercent REAL NOT NULL,
    baseValueBeforeScore REAL NOT NULL,
    earnedBeforeCap REAL NOT NULL,
    awardedAmount REAL NOT NULL,
    dailyCap REAL NOT NULL,
    dailyLearningEarnedBefore REAL NOT NULL,
    dailyLearningEarnedAfter REAL NOT NULL,
    decayAttemptNumberToday INTEGER NOT NULL,
    ledgerEntryId INTEGER,
    createdAt TEXT NOT NULL,
    metadataJson TEXT,
    FOREIGN KEY (attemptId) REFERENCES attempts(id),
    FOREIGN KEY (ledgerEntryId) REFERENCES point_ledger(id)
  );

  CREATE TABLE IF NOT EXISTS streak_bonus_awards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    learner TEXT NOT NULL,
    streakLength INTEGER NOT NULL,
    streakDate TEXT NOT NULL,
    amount REAL NOT NULL,
    attemptId INTEGER NOT NULL,
    ledgerEntryId INTEGER NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (attemptId) REFERENCES attempts(id),
    FOREIGN KEY (ledgerEntryId) REFERENCES point_ledger(id)
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_streak_bonus_unique
    ON streak_bonus_awards(learner, streakDate, streakLength);

  CREATE INDEX IF NOT EXISTS idx_study_rewards_learner_key_date
    ON study_attempt_rewards(learner, exerciseKey, createdAt);

  CREATE TABLE IF NOT EXISTS parent_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS daily_task_bonuses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    kiurLedgerEntryId INTEGER NOT NULL,
    kirsiLedgerEntryId INTEGER NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (kiurLedgerEntryId) REFERENCES point_ledger(id),
    FOREIGN KEY (kirsiLedgerEntryId) REFERENCES point_ledger(id)
  );

  CREATE TABLE IF NOT EXISTS daily_leaderboard (
    date TEXT PRIMARY KEY,
    kiurCount INTEGER NOT NULL DEFAULT 0,
    kirsiCount INTEGER NOT NULL DEFAULT 0,
    winner TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS monthly_competition_awards (
    month TEXT PRIMARY KEY,
    winner TEXT NOT NULL,
    kiurTrophies INTEGER NOT NULL,
    kirsiTrophies INTEGER NOT NULL,
    kiurExercises INTEGER NOT NULL,
    kirsiExercises INTEGER NOT NULL,
    prizeStars REAL NOT NULL,
    ledgerEntryId INTEGER,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (ledgerEntryId) REFERENCES point_ledger(id)
  );

  CREATE TABLE IF NOT EXISTS trophy_adjustments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    learner TEXT NOT NULL,
    month TEXT NOT NULL,
    amount INTEGER NOT NULL,
    reason TEXT,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS learning_exercises (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    learnerScopeJson TEXT NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT,
    category TEXT,
    routePath TEXT NOT NULL,
    sortOrder INTEGER NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS child_learning_exercise_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exerciseId TEXT NOT NULL,
    learner TEXT NOT NULL,
    status TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (exerciseId) REFERENCES learning_exercises(id)
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_child_learning_exercise_settings_unique
    ON child_learning_exercise_settings(exerciseId, learner);

  CREATE INDEX IF NOT EXISTS idx_child_learning_exercise_settings_learner_status
    ON child_learning_exercise_settings(learner, status);

  CREATE TABLE IF NOT EXISTS mistake_pool (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    learner TEXT NOT NULL,
    mistakeKey TEXT NOT NULL,
    exerciseKey TEXT NOT NULL,
    rendererType TEXT NOT NULL,
    status TEXT NOT NULL,
    promptSnapshotJson TEXT NOT NULL,
    correctAnswerSnapshot TEXT NOT NULL,
    lastWrongAnswerSnapshot TEXT,
    wrongCount INTEGER NOT NULL DEFAULT 1,
    reviewWrongCount INTEGER NOT NULL DEFAULT 0,
    firstWrongAt TEXT NOT NULL,
    lastWrongAt TEXT NOT NULL,
    lastReviewedAt TEXT,
    resolvedAt TEXT,
    resolvedByAttemptId INTEGER,
    sourceAttemptId INTEGER,
    sourceQuestionIndex INTEGER,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    UNIQUE(learner, mistakeKey),
    FOREIGN KEY (sourceAttemptId) REFERENCES attempts(id),
    FOREIGN KEY (resolvedByAttemptId) REFERENCES attempts(id)
  );

  CREATE INDEX IF NOT EXISTS idx_mistake_pool_learner_status
    ON mistake_pool(learner, status, rendererType);

  CREATE TABLE IF NOT EXISTS remediation_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    learner TEXT NOT NULL,
    startedAt TEXT NOT NULL,
    completedAt TEXT,
    score INTEGER,
    questionCount INTEGER NOT NULL DEFAULT 15,
    historyAttemptId INTEGER,
    earnedStars REAL,
    metadataJson TEXT,
    FOREIGN KEY (historyAttemptId) REFERENCES attempts(id)
  );

  CREATE TABLE IF NOT EXISTS remediation_session_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sessionId INTEGER NOT NULL,
    mistakeId INTEGER NOT NULL,
    position INTEGER NOT NULL,
    renderedQuestionJson TEXT NOT NULL,
    childAnswer TEXT,
    isCorrect INTEGER,
    answeredAt TEXT,
    FOREIGN KEY (sessionId) REFERENCES remediation_sessions(id),
    FOREIGN KEY (mistakeId) REFERENCES mistake_pool(id)
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_remediation_session_position
    ON remediation_session_items(sessionId, position);

  CREATE TABLE IF NOT EXISTS reward_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL DEFAULT 'learning_streak',
    thresholdDays INTEGER NOT NULL,
    rewardStars REAL NOT NULL,
    learnerScope TEXT NOT NULL DEFAULT 'both',
    enabled INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    deletedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS reward_rule_awards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ruleId INTEGER NOT NULL,
    learner TEXT NOT NULL,
    thresholdDays INTEGER NOT NULL,
    streakLength INTEGER NOT NULL,
    streakDate TEXT NOT NULL,
    amount REAL NOT NULL,
    attemptId INTEGER NOT NULL,
    ledgerEntryId INTEGER NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (ruleId) REFERENCES reward_rules(id),
    FOREIGN KEY (attemptId) REFERENCES attempts(id),
    FOREIGN KEY (ledgerEntryId) REFERENCES point_ledger(id)
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_reward_rule_awards_unique
    ON reward_rule_awards(ruleId, learner, streakDate);

  CREATE INDEX IF NOT EXISTS idx_reward_rule_awards_attempt
    ON reward_rule_awards(attemptId);
`);

const taskTemplateCols = db.prepare('PRAGMA table_info(task_templates)').all() as Array<{ name: string }>;
addColumnIfMissing(taskTemplateCols.some((c) => c.name === 'requiresApproval'), 'ALTER TABLE task_templates ADD COLUMN requiresApproval INTEGER NOT NULL DEFAULT 0');
const taskInstanceCols = db.prepare('PRAGMA table_info(task_instances)').all() as Array<{ name: string }>;
addColumnIfMissing(taskInstanceCols.some((c) => c.name === 'requiresApprovalSnapshot'), 'ALTER TABLE task_instances ADD COLUMN requiresApprovalSnapshot INTEGER NOT NULL DEFAULT 0');
const trophyAdjustmentCols = db.prepare('PRAGMA table_info(trophy_adjustments)').all() as Array<{ name: string }>;
addColumnIfMissing(trophyAdjustmentCols.some((c) => c.name === 'month'), "ALTER TABLE trophy_adjustments ADD COLUMN month TEXT NOT NULL DEFAULT ''");
// Index created after the migration above so it works whether the table is
// brand new (month from CREATE TABLE) or pre-existing (month just added).
db.exec('CREATE INDEX IF NOT EXISTS idx_trophy_adjustments_month_learner ON trophy_adjustments(month, learner)');

// ---- Offline / sync support (additive; safe on existing databases) ----
db.exec(`
  CREATE TABLE IF NOT EXISTS offline_catalog_versions (
    version TEXT NOT NULL,
    learner TEXT NOT NULL,
    issuedAt TEXT NOT NULL,
    refreshAfter TEXT NOT NULL,
    validUntil TEXT NOT NULL,
    algorithmVersion INTEGER NOT NULL,
    generatorVersion TEXT NOT NULL,
    dailyLimit INTEGER NOT NULL,
    catalogueJson TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    PRIMARY KEY (learner, version)
  );

  CREATE INDEX IF NOT EXISTS idx_offline_catalog_versions_learner_created
    ON offline_catalog_versions(learner, createdAt);

  -- Singleton sync-state row (id = 1). historyEpoch is bumped by "delete all
  -- history" (Phase 4); stays 0 otherwise so the protocol always has a value.
  CREATE TABLE IF NOT EXISTS offline_sync_state (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    historyEpoch INTEGER NOT NULL DEFAULT 0,
    updatedAt TEXT NOT NULL
  );

  -- Idempotent record of offline task-completion actions, keyed by the device's
  -- clientActionId. Retrying the same action returns the stored result.
  CREATE TABLE IF NOT EXISTS offline_task_actions (
    clientActionId TEXT PRIMARY KEY,
    deviceId TEXT,
    learner TEXT NOT NULL,
    actionType TEXT NOT NULL,
    templateId INTEGER,
    templateVersion TEXT,
    taskDate TEXT NOT NULL,
    snapshotJson TEXT,
    completedAt TEXT,
    status TEXT NOT NULL,
    reasonCode TEXT,
    serverResultJson TEXT,
    createdAt TEXT NOT NULL,
    processedAt TEXT
  );

  -- Individual history deletions leave a tombstone so offline devices learn which
  -- confirmed attempts to drop from their cache (without ever touching the ledger
  -- or a still-pending local attempt).
  CREATE TABLE IF NOT EXISTS attempt_tombstones (
    tombstoneId INTEGER PRIMARY KEY AUTOINCREMENT,
    serverAttemptId INTEGER,
    clientAttemptId TEXT,
    deletedAt TEXT NOT NULL
  );

  -- Shadow-mode reconciliation audit: proposed compensating deltas for late
  -- arrivals. In shadow mode nothing is written to the ledger; this table records
  -- what a live run WOULD adjust, for validation on a copied database first.
  CREATE TABLE IF NOT EXISTS reconciliation_audits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    learner TEXT NOT NULL,
    fromDate TEXT NOT NULL,
    expectedStudyTotal REAL NOT NULL,
    actualStudyTotal REAL NOT NULL,
    delta REAL NOT NULL,
    mode TEXT NOT NULL,
    trigger TEXT,
    detailJson TEXT,
    createdAt TEXT NOT NULL
  );
`);
db.prepare("INSERT OR IGNORE INTO offline_sync_state (id, historyEpoch, updatedAt) VALUES (1, 0, ?)").run(new Date().toISOString());

}

type Migration = {
  id: number;
  name: string;
  checksumSource: string;
  up: (connection: DatabaseConnection) => void;
};

function hasColumn(connection: DatabaseConnection, table: string, column: string) {
  const rows = connection.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
  return rows.some((row) => row.name === column);
}

function addColumn(connection: DatabaseConnection, table: string, column: string, definition: string) {
  if (!hasColumn(connection, table, column)) {
    connection.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

function assertNoDuplicateClientAttemptIds(connection: DatabaseConnection) {
  const duplicate = connection.prepare(`
    SELECT clientAttemptId, COUNT(*) AS count
    FROM attempts
    WHERE clientAttemptId IS NOT NULL
    GROUP BY clientAttemptId
    HAVING COUNT(*) > 1
    LIMIT 1
  `).get() as { clientAttemptId: string; count: number } | undefined;
  if (duplicate) {
    throw new Error(`Migration blocked: duplicate clientAttemptId ${duplicate.clientAttemptId} (${duplicate.count} rows).`);
  }
}

function applyProtocolV2Schema(connection: DatabaseConnection) {
  assertNoDuplicateClientAttemptIds(connection);

  addColumn(connection, 'attempts', 'clientCorrectedCompletedAt', 'TEXT');
  addColumn(connection, 'attempts', 'effectiveCompletedAt', 'TEXT');
  addColumn(connection, 'attempts', 'completionDate', 'TEXT');
  addColumn(connection, 'attempts', 'clockStatus', "TEXT NOT NULL DEFAULT 'legacy'");
  addColumn(connection, 'attempts', 'clockSkewMs', 'INTEGER');
  addColumn(connection, 'attempts', 'rewardPolicyVersion', 'TEXT');
  addColumn(connection, 'attempts', 'rewardEngineVersion', 'INTEGER');
  addColumn(connection, 'attempts', 'rewardRevision', 'INTEGER NOT NULL DEFAULT 0');
  addColumn(connection, 'attempts', 'generatorVersion', 'TEXT');
  addColumn(connection, 'attempts', 'runnerId', 'TEXT');
  addColumn(connection, 'attempts', 'runnerVersion', 'TEXT');
  addColumn(connection, 'attempts', 'rotationVersion', 'INTEGER');
  addColumn(connection, 'attempts', 'runnerSeed', 'TEXT');
  addColumn(connection, 'attempts', 'questionIdsJson', 'TEXT');
  addColumn(connection, 'attempts', 'protocolVersion', 'INTEGER NOT NULL DEFAULT 1');

  addColumn(connection, 'point_ledger', 'effectiveDate', 'TEXT');
  addColumn(connection, 'point_ledger', 'idempotencyKey', 'TEXT');
  addColumn(connection, 'point_ledger', 'rewardRevision', 'INTEGER');

  connection.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_attempts_client_attempt_id
      ON attempts(clientAttemptId) WHERE clientAttemptId IS NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_attempts_completion_order
      ON attempts(learner, completionDate, effectiveCompletedAt, clientAttemptId, id);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_point_ledger_idempotency_key
      ON point_ledger(idempotencyKey) WHERE idempotencyKey IS NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_point_ledger_effective_date
      ON point_ledger(learner, effectiveDate);

    CREATE TABLE IF NOT EXISTS reward_policy_versions (
      version TEXT PRIMARY KEY,
      contentHash TEXT NOT NULL UNIQUE,
      policyJson TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      supersedesVersion TEXT,
      FOREIGN KEY (supersedesVersion) REFERENCES reward_policy_versions(version)
    );

    CREATE TABLE IF NOT EXISTS reward_policy_current (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      version TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (version) REFERENCES reward_policy_versions(version)
    );

    CREATE TABLE IF NOT EXISTS catalogue_grants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      learner TEXT NOT NULL,
      catalogueVersion TEXT NOT NULL,
      deviceId TEXT,
      rewardPolicyVersion TEXT NOT NULL,
      generatorVersion TEXT NOT NULL,
      runnerVersion TEXT NOT NULL,
      runnerContractsJson TEXT NOT NULL DEFAULT '{}',
      rotationVersion INTEGER NOT NULL,
      issuedAt TEXT NOT NULL,
      validUntil TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      UNIQUE(learner, catalogueVersion, deviceId),
      FOREIGN KEY (rewardPolicyVersion) REFERENCES reward_policy_versions(version)
    );

    CREATE TABLE IF NOT EXISTS reward_projection_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      learner TEXT NOT NULL,
      fromDate TEXT NOT NULL,
      throughDate TEXT NOT NULL,
      engineVersion INTEGER NOT NULL,
      triggerAttemptId INTEGER,
      status TEXT NOT NULL,
      detailJson TEXT,
      createdAt TEXT NOT NULL,
      completedAt TEXT,
      FOREIGN KEY (triggerAttemptId) REFERENCES attempts(id)
    );

    CREATE TABLE IF NOT EXISTS attempt_reward_components (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attemptId INTEGER NOT NULL,
      componentKey TEXT NOT NULL,
      revision INTEGER NOT NULL,
      canonicalAmount REAL NOT NULL,
      previousCanonicalAmount REAL NOT NULL,
      deltaAmount REAL NOT NULL,
      policyVersion TEXT NOT NULL,
      effectiveDate TEXT NOT NULL,
      ledgerEntryId INTEGER,
      projectionRunId INTEGER,
      createdAt TEXT NOT NULL,
      UNIQUE(attemptId, componentKey, revision),
      FOREIGN KEY (attemptId) REFERENCES attempts(id),
      FOREIGN KEY (policyVersion) REFERENCES reward_policy_versions(version),
      FOREIGN KEY (ledgerEntryId) REFERENCES point_ledger(id),
      FOREIGN KEY (projectionRunId) REFERENCES reward_projection_runs(id)
    );

    CREATE INDEX IF NOT EXISTS idx_reward_components_attempt_component
      ON attempt_reward_components(attemptId, componentKey, revision DESC);
    CREATE INDEX IF NOT EXISTS idx_reward_components_effective_date
      ON attempt_reward_components(effectiveDate, attemptId);

    CREATE TABLE IF NOT EXISTS reward_cutover_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      cutoverAt TEXT,
      baselineLedgerId INTEGER,
      baselineBalancesJson TEXT,
      status TEXT NOT NULL,
      driftReportJson TEXT,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS auth_login_limits (
      scope TEXT NOT NULL,
      identityHash TEXT NOT NULL,
      windowStartedAt TEXT NOT NULL,
      failureCount INTEGER NOT NULL,
      blockedUntil TEXT,
      updatedAt TEXT NOT NULL,
      PRIMARY KEY (scope, identityHash)
    );

    CREATE TABLE IF NOT EXISTS device_change_cursors (
      deviceId TEXT PRIMARY KEY,
      protocolVersion INTEGER NOT NULL,
      lastAttemptId INTEGER NOT NULL DEFAULT 0,
      lastTombstoneId INTEGER NOT NULL DEFAULT 0,
      lastTaskChangeId INTEGER NOT NULL DEFAULT 0,
      lastRemediationChangeId INTEGER NOT NULL DEFAULT 0,
      lastSeenAt TEXT NOT NULL,
      resetRequired INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS server_change_log (
      changeId INTEGER PRIMARY KEY AUTOINCREMENT,
      stream TEXT NOT NULL,
      entityType TEXT NOT NULL,
      entityId TEXT NOT NULL,
      operation TEXT NOT NULL,
      payloadJson TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_server_change_log_stream_id
      ON server_change_log(stream, changeId);
  `);

  connection.prepare(`
    INSERT OR IGNORE INTO reward_cutover_state (id, status, updatedAt)
    VALUES (1, 'not_started', ?)
  `).run(new Date().toISOString());

  // Migrate the only legacy credential while the schema migration lock is
  // held. Plaintext is deleted in the same transaction and the auth version is
  // bumped so deterministic legacy parent cookies stop working immediately.
  const legacyPassword = connection.prepare(`
    SELECT value FROM parent_settings WHERE key = 'parent_password'
  `).get() as { value: string } | undefined;
  if (legacyPassword?.value) {
    const now = new Date().toISOString();
    connection.prepare(`
      INSERT INTO parent_settings (key, value, updatedAt) VALUES ('parent_password_hash', ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt
    `).run(hashSecret(legacyPassword.value), now);
    connection.prepare(`
      INSERT INTO parent_settings (key, value, updatedAt) VALUES ('parent_auth_version', '2', ?)
      ON CONFLICT(key) DO UPDATE SET value = CAST(CAST(parent_settings.value AS INTEGER) + 1 AS TEXT), updatedAt = excluded.updatedAt
    `).run(now);
    connection.prepare("DELETE FROM parent_settings WHERE key = 'parent_password'").run();
  }
}

function applyRewardSettlementState(connection: DatabaseConnection) {
  // Explicit reward eligibility per attempt (RTM-003). Only 'eligible' attempts
  // enter the canonical reward projection; 'withheld' (rejected/unpermitted) and
  // 'needs_review' attempts never award, affect caps/decay/streaks, nor can they
  // throw an unknown-policy error inside a later valid learner's projection.
  addColumn(connection, 'attempts', 'rewardSettlementStatus', "TEXT NOT NULL DEFAULT 'eligible'");
  addColumn(connection, 'attempts', 'recordBeforeRun', 'INTEGER');
  addColumn(connection, 'attempts', 'requiredScore', 'INTEGER');
  addColumn(connection, 'attempts', 'sprintQualified', 'INTEGER');
  addColumn(connection, 'attempts', 'qualificationRuleVersion', 'TEXT');
  // Hiding history must not remove the accounting source row.
  addColumn(connection, 'attempts', 'deletedAt', 'TEXT');
  addColumn(connection, 'attempts', 'deletedReason', 'TEXT');

  // Cure any already-poisoned data: a protocol-v2 attempt that was never
  // projected has no reward components. Those are exactly the unpermitted /
  // needs-review attempts that must be excluded from reward projection.
  connection.exec(`
    UPDATE attempts SET rewardSettlementStatus = 'withheld'
    WHERE protocolVersion = 2
      AND id NOT IN (SELECT DISTINCT attemptId FROM attempt_reward_components);
  `);

  connection.exec(`
    CREATE INDEX IF NOT EXISTS idx_attempts_reward_settlement
      ON attempts(learner, rewardSettlementStatus, protocolVersion);
    CREATE INDEX IF NOT EXISTS idx_attempts_sprint_qualification
      ON attempts(learner, subject, topic, effectiveCompletedAt, clientAttemptId, id);
  `);

  addColumn(connection, 'monthly_competition_awards', 'configuredPrizeStars', 'REAL');
  addColumn(connection, 'monthly_competition_awards', 'prizePolicyVersion', 'TEXT');
  addColumn(connection, 'monthly_competition_awards', 'settledAt', 'TEXT');
  // Existing awards predate policy snapshots; their actually awarded amount is
  // the only safe historical policy value we can infer.
  connection.exec(`
    UPDATE monthly_competition_awards
    SET configuredPrizeStars = prizeStars,
        prizePolicyVersion = COALESCE(prizePolicyVersion, 'legacy-unsnapshotted'),
        settledAt = COALESCE(settledAt, createdAt)
    WHERE configuredPrizeStars IS NULL OR prizePolicyVersion IS NULL OR settledAt IS NULL
  `);
}

function neutralizeRewardSettlementHeuristic(connection: DatabaseConnection) {
  // RTM2-C02: migration 3 inferred eligibility from the mere presence of reward
  // components, which is unsafe. A legitimate attempt can have no component when
  // its canonical reward is zero (below threshold, daily cap already reached,
  // decayed to zero), so migration 3 could wrongly mark it 'withheld' and drop it
  // from future decay/streak projections.
  //
  // We do not (and cannot) reconstruct true eligibility from components, so we
  // undo migration 3's inference and fall back to the safe default: eligibility
  // is authoritative only when set by insertAttempt at write time. At the moment
  // migrations run, every 'withheld' row was produced by migration 3's heuristic
  // (authoritative withholding is only ever written by the post-migration
  // insert path), so reverting them to 'eligible' is safe here.
  //
  // Note: any attempt "poisoned" by the original RTM-003 defect (unpermitted but
  // already carrying a component) was left 'eligible' by migration 3 and is not
  // touched here; reconciling those requires an audited production-copy report,
  // not a blind migration. This deployment enabled offline protocol v2 for the
  // first time, so in practice there are no such pre-existing v2 attempts.
  connection.exec(`
    UPDATE attempts SET rewardSettlementStatus = 'eligible'
    WHERE protocolVersion = 2 AND rewardSettlementStatus = 'withheld';
  `);
}

function persistReviewReasonCode(connection: DatabaseConnection) {
  // RTM3-M02: hold reasons other than clock drift (unknown_catalogue_grant,
  // not_permitted, unknown_topic, …) were computed at insert time but never
  // stored, so the parent review surface could only reconstruct the clock-drift
  // case. Persist the authoritative reason on the row so every held attempt can
  // explain itself before a parent approves it. Legacy rows stay NULL and fall
  // back to the derived clock-drift reason for backward compatibility.
  addColumn(connection, 'attempts', 'reviewReasonCode', 'TEXT');
}

function addAttemptFingerprint(connection: DatabaseConnection) {
  addColumn(connection, 'attempts', 'attemptFingerprint', 'TEXT');
  connection.exec('CREATE INDEX IF NOT EXISTS idx_attempts_fingerprint ON attempts(clientAttemptId, attemptFingerprint)');
}

function addAttemptStatsWindowIndex(connection: DatabaseConnection) {
  connection.exec('CREATE INDEX IF NOT EXISTS idx_attempts_created_at ON attempts(createdAt)');
}

// "Külmutus": a child buys one ahead of time and a single missed day spends it,
// so one bad day does not reset a long study streak. A freeze is stored rather
// than folded into the streak number because the streak itself is derived from
// study history on every read — this table is the record of the exception.
function addStreakFreezes(connection: DatabaseConnection) {
  connection.exec(`
    CREATE TABLE IF NOT EXISTS streak_freezes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      learner TEXT NOT NULL,
      source TEXT NOT NULL,
      priceStars REAL NOT NULL DEFAULT 0,
      ledgerEntryId INTEGER,
      acquiredAt TEXT NOT NULL,
      consumedAt TEXT,
      coveredDate TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (ledgerEntryId) REFERENCES point_ledger(id)
    )
  `);
  // Settlement is lazy and runs on every dashboard read, so it must be safe to
  // repeat: a day can only ever be covered once.
  connection.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_streak_freeze_covered_date
      ON streak_freezes(learner, coveredDate) WHERE coveredDate IS NOT NULL
  `);
  connection.exec(`
    CREATE INDEX IF NOT EXISTS idx_streak_freeze_held
      ON streak_freezes(learner, consumedAt)
  `);
}

// English vocabulary units ("Sõnavara"): textbook units imported by the parent,
// a study → test progression per unit, resumable sessions and per-word
// statistics. Purely additive — no existing table is touched. The canonical
// learning attempt a passed test produces still goes into `attempts`, so
// history, stars, streaks and the leaderboard need no special case.
//
// Words are never deleted: a removed word is retired (`retiredAt`) so its
// events and statistics keep pointing at a real row, and each content change is
// kept in english_vocab_word_revisions. Sessions copy the words they use into
// `stateJson`, so editing a unit never changes a session already in progress.
function addEnglishVocabulary(connection: DatabaseConnection) {
  connection.exec(`
    CREATE TABLE IF NOT EXISTS english_vocab_units (
      id TEXT PRIMARY KEY,
      unitNumber INTEGER NOT NULL UNIQUE CHECK (unitNumber BETWEEN 1 AND 999),
      title TEXT NOT NULL,
      published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0, 1)),
      contentVersion INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS english_vocab_words (
      id TEXT PRIMARY KEY,
      unitId TEXT NOT NULL,
      position INTEGER NOT NULL,
      estonian TEXT NOT NULL,
      english TEXT NOT NULL,
      pronunciation TEXT NOT NULL DEFAULT '',
      acceptedAnswersJson TEXT NOT NULL DEFAULT '[]',
      revision INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      retiredAt TEXT,
      FOREIGN KEY (unitId) REFERENCES english_vocab_units(id)
    );
    CREATE INDEX IF NOT EXISTS idx_english_vocab_words_unit
      ON english_vocab_words(unitId, retiredAt, position);

    CREATE TABLE IF NOT EXISTS english_vocab_word_revisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wordId TEXT NOT NULL,
      revision INTEGER NOT NULL,
      changeKind TEXT NOT NULL,
      source TEXT NOT NULL,
      estonian TEXT NOT NULL,
      english TEXT NOT NULL,
      pronunciation TEXT NOT NULL,
      acceptedAnswersJson TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      UNIQUE (wordId, revision),
      FOREIGN KEY (wordId) REFERENCES english_vocab_words(id)
    );

    CREATE TABLE IF NOT EXISTS english_vocab_progress (
      learner TEXT NOT NULL CHECK (learner IN ('kiur', 'kirsi')),
      unitId TEXT NOT NULL,
      manualUnlock INTEGER NOT NULL DEFAULT 0 CHECK (manualUnlock IN (0, 1)),
      manualUnlockUpdatedAt TEXT,
      studyCompletedAt TEXT,
      studyFirstKnown INTEGER,
      studyTotal INTEGER,
      studyCompletions INTEGER NOT NULL DEFAULT 0,
      testPassedAt TEXT,
      passedScore INTEGER,
      passedTotal INTEGER,
      passedRound INTEGER,
      passedSessionId TEXT,
      passedAttemptId INTEGER,
      testPasses INTEGER NOT NULL DEFAULT 0,
      updatedAt TEXT NOT NULL,
      PRIMARY KEY (learner, unitId),
      FOREIGN KEY (unitId) REFERENCES english_vocab_units(id),
      FOREIGN KEY (passedAttemptId) REFERENCES attempts(id)
    );

    CREATE TABLE IF NOT EXISTS english_vocab_sessions (
      id TEXT PRIMARY KEY,
      learner TEXT NOT NULL CHECK (learner IN ('kiur', 'kirsi')),
      unitId TEXT,
      scopeKey TEXT NOT NULL,
      mode TEXT NOT NULL CHECK (mode IN ('study', 'test', 'practice')),
      status TEXT NOT NULL CHECK (status IN ('active', 'completed')),
      unitContentVersion INTEGER,
      stateJson TEXT NOT NULL,
      revision INTEGER NOT NULL DEFAULT 0,
      lastActionId TEXT,
      attemptId INTEGER,
      startedAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      completedAt TEXT,
      FOREIGN KEY (unitId) REFERENCES english_vocab_units(id),
      FOREIGN KEY (attemptId) REFERENCES attempts(id)
    );
    -- At most one session in progress per child, unit and mode: "Jätka" always
    -- means one specific session, and two tabs cannot fork a unit's progress.
    CREATE UNIQUE INDEX IF NOT EXISTS idx_english_vocab_sessions_active
      ON english_vocab_sessions(learner, scopeKey, mode) WHERE status = 'active';
    CREATE INDEX IF NOT EXISTS idx_english_vocab_sessions_unit
      ON english_vocab_sessions(learner, unitId, mode, status);

    CREATE TABLE IF NOT EXISTS english_vocab_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sessionId TEXT NOT NULL,
      learner TEXT NOT NULL,
      unitId TEXT,
      wordId TEXT NOT NULL,
      phase TEXT NOT NULL CHECK (phase IN ('study', 'full', 'correction', 'practice')),
      roundNumber INTEGER NOT NULL,
      correct INTEGER NOT NULL CHECK (correct IN (0, 1)),
      answer TEXT,
      expected TEXT NOT NULL,
      firstEncounter INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (sessionId) REFERENCES english_vocab_sessions(id),
      FOREIGN KEY (wordId) REFERENCES english_vocab_words(id)
    );
    CREATE INDEX IF NOT EXISTS idx_english_vocab_events_session ON english_vocab_events(sessionId, id);
    CREATE INDEX IF NOT EXISTS idx_english_vocab_events_word ON english_vocab_events(learner, wordId, phase);

    CREATE TABLE IF NOT EXISTS english_vocab_test_rounds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sessionId TEXT NOT NULL,
      learner TEXT NOT NULL,
      unitId TEXT NOT NULL,
      roundNumber INTEGER NOT NULL,
      kind TEXT NOT NULL CHECK (kind IN ('full', 'correction')),
      total INTEGER NOT NULL,
      correct INTEGER NOT NULL,
      wrongWordIdsJson TEXT NOT NULL,
      answerCount INTEGER NOT NULL,
      passed INTEGER NOT NULL DEFAULT 0 CHECK (passed IN (0, 1)),
      completedAt TEXT NOT NULL,
      UNIQUE (sessionId, kind, roundNumber),
      FOREIGN KEY (sessionId) REFERENCES english_vocab_sessions(id),
      FOREIGN KEY (unitId) REFERENCES english_vocab_units(id)
    );
    CREATE INDEX IF NOT EXISTS idx_english_vocab_rounds_unit ON english_vocab_test_rounds(learner, unitId, kind, id);

    CREATE TABLE IF NOT EXISTS english_vocab_word_stats (
      learner TEXT NOT NULL,
      wordId TEXT NOT NULL,
      studyCorrect INTEGER NOT NULL DEFAULT 0,
      studyWrong INTEGER NOT NULL DEFAULT 0,
      testCorrect INTEGER NOT NULL DEFAULT 0,
      testWrong INTEGER NOT NULL DEFAULT 0,
      correctionCorrect INTEGER NOT NULL DEFAULT 0,
      correctionWrong INTEGER NOT NULL DEFAULT 0,
      practiceCorrect INTEGER NOT NULL DEFAULT 0,
      practiceWrong INTEGER NOT NULL DEFAULT 0,
      needsPractice INTEGER NOT NULL DEFAULT 0 CHECK (needsPractice IN (0, 1)),
      recoveryStreak INTEGER NOT NULL DEFAULT 0,
      lastResult TEXT,
      lastPhase TEXT,
      lastAttemptAt TEXT,
      updatedAt TEXT NOT NULL,
      PRIMARY KEY (learner, wordId),
      FOREIGN KEY (wordId) REFERENCES english_vocab_words(id)
    );
    CREATE INDEX IF NOT EXISTS idx_english_vocab_word_stats_weak ON english_vocab_word_stats(learner, needsPractice);

    CREATE TABLE IF NOT EXISTS english_vocab_imports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fileName TEXT,
      mode TEXT NOT NULL,
      planHash TEXT NOT NULL,
      summaryJson TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);
}

// The words a child has studied in each unit. A test that has not been passed
// yet stays closed until every current word has been studied, so words the
// parent adds later are studied before they are tested. Backfilled from
// completed study sessions: every word in one got at least one swipe event.
function addEnglishVocabularyStudiedWords(connection: DatabaseConnection) {
  addColumn(connection, 'english_vocab_progress', 'studiedWordIdsJson', 'TEXT');
  const rows = connection.prepare(`
    SELECT p.learner, p.unitId FROM english_vocab_progress p WHERE p.studyCompletedAt IS NOT NULL
  `).all() as Array<{ learner: string; unitId: string }>;
  const words = connection.prepare(`
    SELECT DISTINCT e.wordId FROM english_vocab_events e
    JOIN english_vocab_sessions s ON s.id = e.sessionId
    WHERE s.learner = ? AND s.unitId = ? AND s.mode = 'study' AND s.status = 'completed' AND e.phase = 'study'
    ORDER BY e.wordId
  `);
  const update = connection.prepare('UPDATE english_vocab_progress SET studiedWordIdsJson = ? WHERE learner = ? AND unitId = ?');
  for (const row of rows) {
    const ids = (words.all(row.learner, row.unitId) as Array<{ wordId: string }>).map((item) => item.wordId);
    update.run(JSON.stringify(ids), row.learner, row.unitId);
  }
}

// The textbook framework (Õpiku õppetükid, docs/textbook-framework.md).
// Content lives in the repo; this stores only publication, manual unlocks and
// progress. Every progress table takes the learner 'preview' too — the
// parent's isolated preview learner — and ONLY these tables do: the learner
// CHECKs of every existing table stay 'kiur'/'kirsi', so a preview run can
// never land in attempts, the ledger, the leaderboard or history.
function addTextbookFramework(connection: DatabaseConnection) {
  connection.exec(`
    CREATE TABLE IF NOT EXISTS textbook_unit_publication (
      courseId TEXT NOT NULL,
      unitId TEXT NOT NULL,
      published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0, 1)),
      publishedAt TEXT,
      publishedContentVersion TEXT,
      updatedAt TEXT NOT NULL,
      PRIMARY KEY (courseId, unitId)
    );

    -- A parent override that opens a unit early. It never records a pass.
    CREATE TABLE IF NOT EXISTS textbook_manual_unlocks (
      learner TEXT NOT NULL CHECK (learner IN ('kiur', 'kirsi', 'preview')),
      courseId TEXT NOT NULL,
      unitId TEXT NOT NULL,
      unlocked INTEGER NOT NULL DEFAULT 0 CHECK (unlocked IN (0, 1)),
      updatedAt TEXT NOT NULL,
      PRIMARY KEY (learner, courseId, unitId)
    );

    CREATE TABLE IF NOT EXISTS textbook_lesson_reads (
      learner TEXT NOT NULL CHECK (learner IN ('kiur', 'kirsi', 'preview')),
      courseId TEXT NOT NULL,
      unitId TEXT NOT NULL,
      lessonId TEXT NOT NULL,
      contentVersion TEXT NOT NULL,
      firstCompletedAt TEXT NOT NULL,
      lastCompletedAt TEXT NOT NULL,
      completions INTEGER NOT NULL DEFAULT 1,
      PRIMARY KEY (learner, courseId, unitId, lessonId)
    );

    -- Per learner and unit: practice completion and the FIRST pass (the record;
    -- later passes only count). Never revoked by content changes.
    CREATE TABLE IF NOT EXISTS textbook_unit_progress (
      learner TEXT NOT NULL CHECK (learner IN ('kiur', 'kirsi', 'preview')),
      courseId TEXT NOT NULL,
      unitId TEXT NOT NULL,
      practiceCompletedAt TEXT,
      practiceRuns INTEGER NOT NULL DEFAULT 0,
      firstPassedAt TEXT,
      passedSessionId TEXT,
      passedScore INTEGER,
      passedTotal INTEGER,
      passedContentVersion TEXT,
      passedAttemptId INTEGER,
      passCount INTEGER NOT NULL DEFAULT 0,
      updatedAt TEXT NOT NULL,
      PRIMARY KEY (learner, courseId, unitId),
      FOREIGN KEY (passedAttemptId) REFERENCES attempts(id)
    );

    -- A practice run: the frozen PracticeState (pool, queue, answers) plus the
    -- objective texts at start. 'targeted' runs follow a failed test.
    CREATE TABLE IF NOT EXISTS textbook_practice_sessions (
      id TEXT PRIMARY KEY,
      learner TEXT NOT NULL CHECK (learner IN ('kiur', 'kirsi', 'preview')),
      courseId TEXT NOT NULL,
      unitId TEXT NOT NULL,
      mode TEXT NOT NULL CHECK (mode IN ('normal', 'targeted')),
      status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'abandoned')),
      contentVersion TEXT NOT NULL,
      afterTestSessionId TEXT,
      stateJson TEXT NOT NULL,
      objectivesJson TEXT NOT NULL,
      lastFeedbackJson TEXT,
      revision INTEGER NOT NULL DEFAULT 0,
      lastActionId TEXT,
      startedAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      completedAt TEXT
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_textbook_practice_active
      ON textbook_practice_sessions(learner, courseId, unitId) WHERE status = 'active';
    CREATE INDEX IF NOT EXISTS idx_textbook_practice_unit
      ON textbook_practice_sessions(learner, courseId, unitId, mode, status);

    -- A final test: the frozen TestRunState (20 questions, option order, keys)
    -- and the learner's saved answers. Keys never leave the server unsubmitted.
    CREATE TABLE IF NOT EXISTS textbook_test_sessions (
      id TEXT PRIMARY KEY,
      learner TEXT NOT NULL CHECK (learner IN ('kiur', 'kirsi', 'preview')),
      courseId TEXT NOT NULL,
      unitId TEXT NOT NULL,
      attemptNumber INTEGER NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('active', 'submitted')),
      contentVersion TEXT NOT NULL,
      stateJson TEXT NOT NULL,
      objectivesJson TEXT NOT NULL,
      revision INTEGER NOT NULL DEFAULT 0,
      lastActionId TEXT,
      correct INTEGER,
      total INTEGER,
      passed INTEGER CHECK (passed IN (0, 1)),
      attemptId INTEGER,
      startedAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      submittedAt TEXT,
      UNIQUE (learner, courseId, unitId, attemptNumber),
      FOREIGN KEY (attemptId) REFERENCES attempts(id)
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_textbook_test_active
      ON textbook_test_sessions(learner, courseId, unitId) WHERE status = 'active';

    -- Every submitted round, permanently.
    CREATE TABLE IF NOT EXISTS textbook_test_rounds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sessionId TEXT NOT NULL UNIQUE,
      learner TEXT NOT NULL CHECK (learner IN ('kiur', 'kirsi', 'preview')),
      courseId TEXT NOT NULL,
      unitId TEXT NOT NULL,
      attemptNumber INTEGER NOT NULL,
      contentVersion TEXT NOT NULL,
      correct INTEGER NOT NULL,
      total INTEGER NOT NULL,
      requiredCorrect INTEGER NOT NULL,
      passed INTEGER NOT NULL CHECK (passed IN (0, 1)),
      questionIdsJson TEXT NOT NULL,
      missedObjectiveIdsJson TEXT NOT NULL,
      submittedAt TEXT NOT NULL,
      FOREIGN KEY (sessionId) REFERENCES textbook_test_sessions(id)
    );
    CREATE INDEX IF NOT EXISTS idx_textbook_test_rounds_unit
      ON textbook_test_rounds(learner, courseId, unitId, id);

    -- Weak areas per learning objective (real learners only).
    CREATE TABLE IF NOT EXISTS textbook_objective_stats (
      learner TEXT NOT NULL CHECK (learner IN ('kiur', 'kirsi', 'preview')),
      courseId TEXT NOT NULL,
      unitId TEXT NOT NULL,
      objectiveId TEXT NOT NULL,
      practiceCorrect INTEGER NOT NULL DEFAULT 0,
      practiceWrong INTEGER NOT NULL DEFAULT 0,
      testCorrect INTEGER NOT NULL DEFAULT 0,
      testWrong INTEGER NOT NULL DEFAULT 0,
      missCount INTEGER NOT NULL DEFAULT 0,
      lastMissedAt TEXT,
      updatedAt TEXT NOT NULL,
      PRIMARY KEY (learner, courseId, unitId, objectiveId)
    );

    -- The canonical learning attempt a passed test settled (once per unit per
    -- app day). One row per test session at most: the idempotency anchor.
    CREATE TABLE IF NOT EXISTS textbook_rewards (
      sessionId TEXT PRIMARY KEY,
      learner TEXT NOT NULL CHECK (learner IN ('kiur', 'kirsi')),
      courseId TEXT NOT NULL,
      unitId TEXT NOT NULL,
      attemptId INTEGER NOT NULL UNIQUE,
      completionDate TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (sessionId) REFERENCES textbook_test_sessions(id),
      FOREIGN KEY (attemptId) REFERENCES attempts(id)
    );
    CREATE INDEX IF NOT EXISTS idx_textbook_rewards_day
      ON textbook_rewards(learner, courseId, unitId, completionDate);
  `);
}

// Kaardimäng (the map game): its own rounds and per-place mastery. Like the
// textbook it allows the 'preview' learner, and nothing else in the database
// references these tables: the game gives no stars and writes no attempts.
function addKaardimang(connection: DatabaseConnection) {
  connection.exec(`
    CREATE TABLE IF NOT EXISTS kaardimang_rounds (
      id TEXT PRIMARY KEY,
      learner TEXT NOT NULL CHECK (learner IN ('kiur', 'kirsi', 'preview')),
      viewId TEXT NOT NULL,
      setId TEXT,
      level TEXT NOT NULL CHECK (level IN ('explorer', 'traveler', 'geographer')),
      dataVersion TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'abandoned')),
      stateJson TEXT NOT NULL,
      revision INTEGER NOT NULL DEFAULT 0,
      startActionId TEXT NOT NULL,
      lastActionId TEXT,
      lastResultJson TEXT,
      correct INTEGER NOT NULL DEFAULT 0,
      firstTryCorrect INTEGER NOT NULL DEFAULT 0,
      total INTEGER NOT NULL,
      startedAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      completedAt TEXT,
      UNIQUE (learner, startActionId)
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_kaardimang_rounds_active
      ON kaardimang_rounds(learner) WHERE status = 'active';

    -- One row per learner and place ('country:EST', 'capital:EST', 'ocean:pacific', …).
    CREATE TABLE IF NOT EXISTS kaardimang_target_stats (
      learner TEXT NOT NULL CHECK (learner IN ('kiur', 'kirsi', 'preview')),
      targetKey TEXT NOT NULL,
      seen INTEGER NOT NULL DEFAULT 0,
      firstTryCorrect INTEGER NOT NULL DEFAULT 0,
      missCount INTEGER NOT NULL DEFAULT 0,
      lastSeenAt TEXT NOT NULL,
      lastMissedAt TEXT,
      PRIMARY KEY (learner, targetKey)
    );
  `);
}

// Kaardimäng for the whole family (backlog KM-02): Kairi and Kaur play too,
// rounds can count for a competition, places remember when they were learned,
// and a competition's points and prizes are kept. The two tables from
// migration 13 are rebuilt because SQLite cannot widen a CHECK constraint;
// every existing row is copied.
function addKaardimangCompetition(connection: DatabaseConnection) {
  connection.exec(`
    DROP INDEX IF EXISTS idx_kaardimang_rounds_active;
    ALTER TABLE kaardimang_rounds RENAME TO kaardimang_rounds_v13;
    CREATE TABLE kaardimang_rounds (
      id TEXT PRIMARY KEY,
      learner TEXT NOT NULL CHECK (learner IN ('kiur', 'kirsi', 'kairi', 'kaur', 'preview')),
      viewId TEXT NOT NULL,
      setId TEXT,
      level TEXT NOT NULL CHECK (level IN ('explorer', 'traveler', 'geographer')),
      dataVersion TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'abandoned')),
      stateJson TEXT NOT NULL,
      revision INTEGER NOT NULL DEFAULT 0,
      startActionId TEXT NOT NULL,
      lastActionId TEXT,
      lastResultJson TEXT,
      correct INTEGER NOT NULL DEFAULT 0,
      firstTryCorrect INTEGER NOT NULL DEFAULT 0,
      total INTEGER NOT NULL,
      startedAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      completedAt TEXT,
      -- The competition this round counts for (null: practice), and the app day it started on.
      competitionId INTEGER,
      playDate TEXT,
      UNIQUE (learner, startActionId)
    );
    INSERT INTO kaardimang_rounds (id, learner, viewId, setId, level, dataVersion, status, stateJson, revision, startActionId,
      lastActionId, lastResultJson, correct, firstTryCorrect, total, startedAt, updatedAt, completedAt)
    SELECT id, learner, viewId, setId, level, dataVersion, status, stateJson, revision, startActionId,
      lastActionId, lastResultJson, correct, firstTryCorrect, total, startedAt, updatedAt, completedAt
    FROM kaardimang_rounds_v13;
    DROP TABLE kaardimang_rounds_v13;
    CREATE UNIQUE INDEX idx_kaardimang_rounds_active ON kaardimang_rounds(learner) WHERE status = 'active';
    CREATE INDEX idx_kaardimang_rounds_counted ON kaardimang_rounds(learner, competitionId, playDate);

    ALTER TABLE kaardimang_target_stats RENAME TO kaardimang_target_stats_v13;
    CREATE TABLE kaardimang_target_stats (
      learner TEXT NOT NULL CHECK (learner IN ('kiur', 'kirsi', 'kairi', 'kaur', 'preview')),
      targetKey TEXT NOT NULL,
      seen INTEGER NOT NULL DEFAULT 0,
      firstTryCorrect INTEGER NOT NULL DEFAULT 0,
      missCount INTEGER NOT NULL DEFAULT 0,
      lastSeenAt TEXT NOT NULL,
      lastMissedAt TEXT,
      -- A place is learned once it was right on the first try on two different app days.
      firstTryDays INTEGER NOT NULL DEFAULT 0,
      lastFirstTryDay TEXT,
      learnedAt TEXT,
      PRIMARY KEY (learner, targetKey)
    );
    INSERT INTO kaardimang_target_stats (learner, targetKey, seen, firstTryCorrect, missCount, lastSeenAt, lastMissedAt)
    SELECT learner, targetKey, seen, firstTryCorrect, missCount, lastSeenAt, lastMissedAt FROM kaardimang_target_stats_v13;
    DROP TABLE kaardimang_target_stats_v13;

    -- Each player's level, set by the parent.
    CREATE TABLE IF NOT EXISTS kaardimang_player_settings (
      player TEXT PRIMARY KEY CHECK (player IN ('kiur', 'kirsi', 'kairi', 'kaur')),
      level TEXT NOT NULL CHECK (level IN ('explorer', 'traveler', 'geographer')),
      updatedAt TEXT NOT NULL
    );

    -- A competition the parent opens: its map areas, its days and its prizes.
    CREATE TABLE IF NOT EXISTS kaardimang_competitions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      viewsJson TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      rewardsJson TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('active', 'ended')),
      createdAt TEXT NOT NULL,
      endedAt TEXT,
      resultsJson TEXT
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_kaardimang_competitions_active ON kaardimang_competitions(status) WHERE status = 'active';

    -- The points one answered question earned in a counted round.
    CREATE TABLE IF NOT EXISTS kaardimang_points (
      roundId TEXT NOT NULL,
      questionIndex INTEGER NOT NULL,
      competitionId INTEGER NOT NULL,
      player TEXT NOT NULL,
      targetKey TEXT NOT NULL,
      points INTEGER NOT NULL,
      speedBonus INTEGER NOT NULL,
      newlyLearned INTEGER NOT NULL,
      createdAt TEXT NOT NULL,
      PRIMARY KEY (roundId, questionIndex)
    );
    CREATE INDEX IF NOT EXISTS idx_kaardimang_points_player ON kaardimang_points(competitionId, player);

    -- A finished competition's top three: the medal, and for a child the stars paid.
    CREATE TABLE IF NOT EXISTS kaardimang_awards (
      competitionId INTEGER NOT NULL,
      player TEXT NOT NULL,
      place INTEGER NOT NULL CHECK (place IN (1, 2, 3)),
      points INTEGER NOT NULL,
      stars REAL NOT NULL,
      ledgerEntryId INTEGER,
      createdAt TEXT NOT NULL,
      PRIMARY KEY (competitionId, player)
    );
  `);
}

// A Kaardimäng competition can be cancelled (Kaur, 23.10): ended without
// prizes. SQLite cannot widen the status CHECK, so the table is rebuilt and
// every competition copied, as in migration 14.
function addKaardimangCancelledCompetitions(connection: DatabaseConnection) {
  connection.exec(`
    DROP INDEX IF EXISTS idx_kaardimang_competitions_active;
    ALTER TABLE kaardimang_competitions RENAME TO kaardimang_competitions_v14;
    CREATE TABLE kaardimang_competitions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      viewsJson TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      rewardsJson TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('active', 'ended', 'cancelled')),
      createdAt TEXT NOT NULL,
      endedAt TEXT,
      resultsJson TEXT
    );
    INSERT INTO kaardimang_competitions (id, title, viewsJson, startDate, endDate, rewardsJson, status, createdAt, endedAt, resultsJson)
    SELECT id, title, viewsJson, startDate, endDate, rewardsJson, status, createdAt, endedAt, resultsJson FROM kaardimang_competitions_v14;
    DROP TABLE kaardimang_competitions_v14;
    CREATE UNIQUE INDEX idx_kaardimang_competitions_active ON kaardimang_competitions(status) WHERE status = 'active';
  `);
}

// Kaardimäng one-shot notices (Kaur, 31.10): which player has dismissed the
// results splash or the last-days reminder of which competition.
function addKaardimangNotices(connection: DatabaseConnection) {
  connection.exec(`
    CREATE TABLE IF NOT EXISTS kaardimang_notices (
      competitionId INTEGER NOT NULL,
      player TEXT NOT NULL CHECK (player IN ('kiur', 'kirsi', 'kairi', 'kaur')),
      kind TEXT NOT NULL CHECK (kind IN ('results', 'last_days')),
      seenAt TEXT NOT NULL,
      PRIMARY KEY (competitionId, player, kind)
    );
  `);
}

const migrations: Migration[] = [
  {
    id: 1,
    name: 'legacy_schema_baseline',
    checksumSource: 'legacy_schema_baseline:v1:2026-07-11',
    up: applyLegacySchema
  },
  {
    id: 2,
    name: 'offline_protocol_v2_foundation',
    checksumSource: 'offline_protocol_v2_foundation:v1:2026-07-12',
    up: applyProtocolV2Schema
  },
  {
    id: 3,
    name: 'reward_settlement_state',
    checksumSource: 'reward_settlement_state:v1:2026-07-12',
    up: applyRewardSettlementState
  },
  {
    id: 4,
    name: 'neutralize_reward_settlement_heuristic',
    checksumSource: 'neutralize_reward_settlement_heuristic:v1:2026-07-12',
    up: neutralizeRewardSettlementHeuristic
  },
  {
    id: 5,
    name: 'persist_review_reason_code',
    checksumSource: 'persist_review_reason_code:v1:2026-07-12',
    up: persistReviewReasonCode
  },
  {
    id: 6,
    name: 'attempt_fingerprint',
    checksumSource: 'attempt_fingerprint:v1:2026-07-13',
    up: addAttemptFingerprint
  },
  {
    id: 7,
    name: 'attempt_stats_window_index',
    checksumSource: 'attempt_stats_window_index:v1:2026-07-13',
    up: addAttemptStatsWindowIndex
  },
  {
    id: 8,
    name: 'streak_freezes',
    checksumSource: 'streak_freezes:v1:2026-07-28',
    up: addStreakFreezes
  },
  {
    id: 9,
    name: 'english_vocabulary',
    checksumSource: 'english_vocabulary:v1:2026-10-11',
    up: addEnglishVocabulary
  },
  {
    id: 10,
    name: 'english_vocabulary_studied_words',
    checksumSource: 'english_vocabulary_studied_words:v1:2026-10-12',
    up: addEnglishVocabularyStudiedWords
  },
  {
    id: 11,
    name: 'store_purchases_item_index',
    checksumSource: 'store_purchases_item_index:v1:2026-10-15',
    // The store's per-item daily-stock and one-time checks seek one item's
    // purchases (store.ts getDailyUsed / oneTimeBought).
    up: (connection) => {
      connection.exec('CREATE INDEX IF NOT EXISTS idx_store_purchases_item ON store_purchases(storeItemId, purchasedAt)');
    }
  },
  {
    id: 12,
    name: 'textbook_framework',
    checksumSource: 'textbook_framework:v1:2026-10-17',
    up: addTextbookFramework
  },
  {
    id: 13,
    name: 'kaardimang',
    checksumSource: 'kaardimang:v1:2026-10-17',
    up: addKaardimang
  },
  {
    id: 14,
    name: 'kaardimang_competition',
    checksumSource: 'kaardimang_competition:v1:2026-10-23',
    up: addKaardimangCompetition
  },
  {
    id: 15,
    name: 'kaardimang_cancelled_competitions',
    checksumSource: 'kaardimang_cancelled_competitions:v1:2026-10-23',
    up: addKaardimangCancelledCompetitions
  },
  {
    id: 16,
    name: 'kaardimang_notices',
    checksumSource: 'kaardimang_notices:v1:2026-10-31',
    up: addKaardimangNotices
  }
];

export function expectedSchemaMigrationCount() {
  return migrations.length;
}

function migrationChecksum(migration: Migration) {
  return createHash('sha256')
    .update(`${migration.id}:${migration.name}:${migration.checksumSource}`)
    .digest('hex');
}

// `upTo` stops after that migration (tests of a later migration's data copy).
export function runMigrations(connection: DatabaseConnection, upTo = Number.POSITIVE_INFINITY) {
  connection.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      checksum TEXT NOT NULL,
      appliedAt TEXT NOT NULL
    )
  `);

  const applied = connection.prepare('SELECT id, name, checksum FROM schema_migrations ORDER BY id').all() as Array<{
    id: number;
    name: string;
    checksum: string;
  }>;
  const byId = new Map(applied.map((row) => [row.id, row]));

  for (const migration of migrations) {
    if (migration.id > upTo) break;
    const checksum = migrationChecksum(migration);
    const previous = byId.get(migration.id);
    if (previous) {
      if (previous.name !== migration.name || previous.checksum !== checksum) {
        throw new Error(`Migration checksum mismatch for ${migration.id}:${migration.name}.`);
      }
      continue;
    }

    connection.exec('BEGIN IMMEDIATE');
    try {
      migration.up(connection);
      connection.prepare(`
        INSERT INTO schema_migrations (id, name, checksum, appliedAt)
        VALUES (?, ?, ?, ?)
      `).run(migration.id, migration.name, checksum, new Date().toISOString());
      connection.exec('COMMIT');
    } catch (error) {
      connection.exec('ROLLBACK');
      throw error;
    }
  }
}

// Open the SQLite file with the standard pragmas but WITHOUT running application
// migrations. Used to take a pre-migration backup (RTM2-H01) before the normal
// migrating open touches the schema or data.
export function openRawConnection(filename: string): DatabaseConnection {
  if (filename !== ':memory:') {
    const parentDir = path.dirname(filename);
    if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, { recursive: true });
  }
  const connection = new Database(filename, { timeout: 30000 }) as DatabaseConnection;
  connection.pragma('busy_timeout = 30000');
  connection.pragma('foreign_keys = ON');
  if (filename !== ':memory:') connection.pragma('journal_mode = WAL');
  return connection;
}

export function openDatabase(filename: string): DatabaseConnection {
  const connection = openRawConnection(filename);
  runMigrations(connection);
  return connection;
}

export function configuredDatabaseFile() {
  return process.env.MATHS_GAME_DB_FILE || '/data/maths-game.sqlite';
}

let singleton: DatabaseConnection | null = null;

export function getDatabase(): DatabaseConnection {
  if (!singleton) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      throw new Error('Database access is disabled during next build. Make the route dynamic and access SQLite at request time.');
    }
    if (
      process.env.NODE_ENV === 'production' &&
      configuredDatabaseFile() !== ':memory:' &&
      process.env.DATABASE_STARTUP_VERIFIED !== '1'
    ) {
      throw new Error('Refusing unverified production database startup. Use the verified startup workflow.');
    }
    singleton = openDatabase(configuredDatabaseFile());
  }
  return singleton;
}

export function closeDatabaseForTests() {
  statementCache.clear();
  statementCacheOwner = null;
  if (!singleton) return;
  singleton.close();
  singleton = null;
}

export type CachedStatement = ReturnType<DatabaseConnection['prepare']>;

// Prepared statements keyed by their exact SQL text (SRV-09). `db.prepare`
// compiles anew on every call; hot paths (the sync/projection loop) use `stmt`
// so each statement is compiled once per connection. The cache belongs to one
// connection: it is dropped when the singleton is closed or replaced, so a
// statement is never run against a closed or different database. Callers must
// not switch a cached statement into raw/pluck/expand mode, because that state
// would leak to the next caller.
const statementCache = new Map<string, CachedStatement>();
let statementCacheOwner: DatabaseConnection | null = null;

export function stmt(sql: string): CachedStatement {
  const connection = getDatabase();
  if (statementCacheOwner !== connection) {
    statementCache.clear();
    statementCacheOwner = connection;
  }
  let statement = statementCache.get(sql);
  if (!statement) {
    statement = connection.prepare(sql);
    statementCache.set(sql, statement);
  }
  return statement;
}

const db = new Proxy({} as DatabaseConnection, {
  get(_target, property) {
    const connection = getDatabase() as unknown as Record<PropertyKey, unknown>;
    const value = connection[property];
    return typeof value === 'function' ? value.bind(connection) : value;
  }
});

export default db;
