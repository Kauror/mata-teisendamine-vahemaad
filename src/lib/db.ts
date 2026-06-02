import Database from 'better-sqlite3';
import fs from 'node:fs';

const dataDir = '/data';
const dbFile = `${dataDir}/maths-game.sqlite`;

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(dbFile);
db.pragma('journal_mode = WAL');
db.pragma('busy_timeout = 5000');

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
`);

export default db;
