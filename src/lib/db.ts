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

export function runMigrations(connection: DatabaseConnection) {
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
  if (!singleton) return;
  singleton.close();
  singleton = null;
}

const db = new Proxy({} as DatabaseConnection, {
  get(_target, property) {
    const connection = getDatabase() as unknown as Record<PropertyKey, unknown>;
    const value = connection[property];
    return typeof value === 'function' ? value.bind(connection) : value;
  }
});

export default db;
