import Database from 'better-sqlite3';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { openDatabase, runMigrations } from '@/lib/db';
import { verifySecretHash } from '@/lib/auth/password';
import { applyBackupRetention, prepareDatabaseForStartup, verifyDatabase } from '@/lib/server/database/verification';

const cleanup: string[] = [];
afterEach(() => {
  for (const target of cleanup.splice(0)) fs.rmSync(target, { recursive: true, force: true });
});

describe('versioned SQLite migrations', () => {
  it('applies ordered checksummed migrations once to an empty database', () => {
    const connection = openDatabase(':memory:');
    try {
      expect(connection.prepare('SELECT id, name, length(checksum) AS length FROM schema_migrations ORDER BY id').all()).toEqual([
        { id: 1, name: 'legacy_schema_baseline', length: 64 },
        { id: 2, name: 'offline_protocol_v2_foundation', length: 64 },
        { id: 3, name: 'reward_settlement_state', length: 64 },
        { id: 4, name: 'neutralize_reward_settlement_heuristic', length: 64 },
        { id: 5, name: 'persist_review_reason_code', length: 64 },
        { id: 6, name: 'attempt_fingerprint', length: 64 }
      ]);
      runMigrations(connection);
      expect((connection.prepare('SELECT COUNT(*) AS count FROM schema_migrations').get() as { count: number }).count).toBe(6);
      expect(verifyDatabase(connection).integrity).toBe('ok');
    } finally {
      connection.close();
    }
  });

  it('migrates a legacy plaintext parent password atomically', () => {
    const connection = new Database(':memory:');
    connection.exec(`
      CREATE TABLE parent_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updatedAt TEXT NOT NULL);
      INSERT INTO parent_settings VALUES ('parent_password', 'not-a-default-secret', '2026-01-01T00:00:00.000Z');
    `);
    try {
      runMigrations(connection);
      const plaintext = connection.prepare("SELECT value FROM parent_settings WHERE key = 'parent_password'").get();
      const hash = connection.prepare("SELECT value FROM parent_settings WHERE key = 'parent_password_hash'").get() as { value: string };
      expect(plaintext).toBeUndefined();
      expect(verifySecretHash('not-a-default-secret', hash.value)).toBe(true);
    } finally {
      connection.close();
    }
  });

  it('fails closed on duplicate client attempt IDs', () => {
    const connection = new Database(':memory:');
    connection.exec(`
      CREATE TABLE attempts (
        id INTEGER PRIMARY KEY, createdAt TEXT NOT NULL, category TEXT NOT NULL,
        difficulty TEXT NOT NULL, questionCount INTEGER NOT NULL, score INTEGER NOT NULL,
        elapsedSeconds INTEGER NOT NULL, questions TEXT NOT NULL, clientAttemptId TEXT
      );
      INSERT INTO attempts VALUES (1, '2026-01-01T00:00:00.000Z', 'a', 'a', 1, 1, 1, '[]', 'same');
      INSERT INTO attempts VALUES (2, '2026-01-01T00:00:00.000Z', 'a', 'a', 1, 1, 1, '[]', 'same');
    `);
    try {
      expect(() => runMigrations(connection)).toThrow(/duplicate clientAttemptId same/);
      expect((connection.prepare('SELECT COUNT(*) AS count FROM schema_migrations').get() as { count: number }).count).toBe(0);
    } finally {
      connection.close();
    }
  });

  it('detects a changed checksum instead of silently rerunning code', () => {
    const connection = openDatabase(':memory:');
    try {
      connection.prepare("UPDATE schema_migrations SET checksum = 'tampered' WHERE id = 1").run();
      expect(() => runMigrations(connection)).toThrow(/checksum mismatch/);
    } finally {
      connection.close();
    }
  });

  it('backs up a disposable file before migration and verifies dates/FKs', async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'maths-db-startup-'));
    cleanup.push(directory);
    const file = path.join(directory, 'fixture.sqlite');
    const legacy = new Database(file);
    legacy.exec(`CREATE TABLE attempts (
      id INTEGER PRIMARY KEY, createdAt TEXT NOT NULL, category TEXT NOT NULL,
      difficulty TEXT NOT NULL, questionCount INTEGER NOT NULL, score INTEGER NOT NULL,
      elapsedSeconds INTEGER NOT NULL, questions TEXT NOT NULL
    )`);
    legacy.close();

    const result = await prepareDatabaseForStartup(file, path.join(directory, 'backups'));
    expect(result.backupFile).toBeTruthy();
    expect(fs.existsSync(result.backupFile!)).toBe(true);
    expect(result.verification.migrationCount).toBe(6);

    // RTM2-H01: the backup must be the PRE-migration database, so it can restore
    // the original if a migration corrupts data. Prove it lacks anything the
    // migrations add.
    const backup = new Database(result.backupFile!, { readonly: true });
    try {
      const hasMigrationsTable = backup.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='schema_migrations'").all();
      expect(hasMigrationsTable).toHaveLength(0);
      const columns = backup.prepare('PRAGMA table_info(attempts)').all() as Array<{ name: string }>;
      expect(columns.some((c) => c.name === 'protocolVersion')).toBe(false);
      expect(columns.some((c) => c.name === 'rewardSettlementStatus')).toBe(false);
    } finally {
      backup.close();
    }

    const migrated = openDatabase(file);
    try {
      migrated.prepare(`
        INSERT INTO attempts (createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions)
        VALUES ('not-a-date', 'a', 'a', 1, 1, 1, '[]')
      `).run();
      expect(() => verifyDatabase(migrated)).toThrow(/invalid createdAt/);
    } finally {
      migrated.close();
    }
  });

  it('bounds backup age/count while protecting the newest and current deployment backups', () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'maths-backup-retention-'));
    cleanup.push(directory);
    const databaseFile = path.join(directory, 'fixture.sqlite');
    const backupDirectory = path.join(directory, 'backups');
    fs.mkdirSync(backupDirectory);
    const names = ['fixture.sqlite.old.bak', 'fixture.sqlite.current.bak', 'fixture.sqlite.newest.bak'];
    for (const name of names) fs.writeFileSync(path.join(backupDirectory, name), name);
    fs.utimesSync(path.join(backupDirectory, names[0]), new Date('2025-01-01'), new Date('2025-01-01'));
    fs.utimesSync(path.join(backupDirectory, names[1]), new Date('2025-01-02'), new Date('2025-01-02'));
    fs.utimesSync(path.join(backupDirectory, names[2]), new Date('2025-01-03'), new Date('2025-01-03'));

    const result = applyBackupRetention(databaseFile, backupDirectory, path.join(backupDirectory, names[1]), {
      maxAgeDays: 1,
      maxCount: 1,
      now: new Date('2026-01-01')
    });
    expect(result.retained.sort()).toEqual([names[1], names[2]].sort());
    expect(result.deleted).toEqual([names[0]]);
  });

  it('does not delete any old backup when current database verification fails', async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'maths-backup-failure-'));
    cleanup.push(directory);
    const file = path.join(directory, 'fixture.sqlite');
    const backupDirectory = path.join(directory, 'backups');
    fs.mkdirSync(backupDirectory);
    const oldBackup = path.join(backupDirectory, 'fixture.sqlite.old.bak');
    fs.writeFileSync(oldBackup, 'recovery-anchor');
    fs.utimesSync(oldBackup, new Date('2020-01-01'), new Date('2020-01-01'));
    const connection = openDatabase(file);
    connection.prepare(`INSERT INTO attempts (createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions) VALUES ('invalid', 'a', 'a', 1, 1, 1, '[]')`).run();
    connection.close();

    await expect(prepareDatabaseForStartup(file, backupDirectory, { maxAgeDays: 1, maxCount: 1 })).rejects.toThrow(/verification failed/i);
    expect(fs.readFileSync(oldBackup, 'utf8')).toBe('recovery-anchor');
  });

  it('migration 4 corrects migration 3 mis-withholding of a zero-reward attempt (RTM2-C02)', () => {
    const connection = openDatabase(':memory:');
    try {
      // A legitimate protocol-v2 attempt whose canonical reward is zero has no
      // attempt_reward_components row, so migration 3's heuristic would have
      // marked it 'withheld'. Reproduce that bad state and re-apply migration 4.
      connection.prepare(`
        INSERT INTO attempts (id, createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions, protocolVersion, rewardSettlementStatus)
        VALUES (1, '2026-07-01T08:00:00.000Z', 'c', 'e', 10, 0, 1, '[]', 2, 'withheld')
      `).run();
      connection.prepare('DELETE FROM schema_migrations WHERE id = 4').run();
      runMigrations(connection);
      const row = connection.prepare('SELECT rewardSettlementStatus AS s FROM attempts WHERE id = 1').get() as { s: string };
      expect(row.s).toBe('eligible');
    } finally {
      connection.close();
    }
  });
});
