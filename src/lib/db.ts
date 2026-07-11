import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

const dataDir = '/data';
const dbFile = process.env.MATHS_GAME_DB_FILE || `${dataDir}/maths-game.sqlite`;

if (dbFile !== ':memory:') {
  const parentDir = path.dirname(dbFile);
  if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, { recursive: true });
}

const db = new Database(dbFile, { timeout: 30000 });
db.pragma('busy_timeout = 30000');
if (dbFile !== ':memory:') db.pragma('journal_mode = WAL');

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

export default db;
