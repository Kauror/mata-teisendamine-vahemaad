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

if (!hasLearner) db.exec('ALTER TABLE attempts ADD COLUMN learner TEXT');
if (!hasSubject) db.exec('ALTER TABLE attempts ADD COLUMN subject TEXT');
if (!hasTopic) db.exec('ALTER TABLE attempts ADD COLUMN topic TEXT');

export default db;
