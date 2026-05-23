import Database from 'better-sqlite3';
import fs from 'node:fs';

const dataDir = '/data';
const dbFile = `${dataDir}/maths-game.sqlite`;

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(dbFile);
db.pragma('journal_mode = WAL');

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

export default db;
