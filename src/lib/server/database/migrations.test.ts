import Database from 'better-sqlite3';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { openDatabase, runMigrations } from '@/lib/db';
import { verifySecretHash } from '@/lib/auth/password';
import { prepareDatabaseForStartup, verifyDatabase } from '@/lib/server/database/verification';

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
        { id: 3, name: 'reward_settlement_state', length: 64 }
      ]);
      runMigrations(connection);
      expect((connection.prepare('SELECT COUNT(*) AS count FROM schema_migrations').get() as { count: number }).count).toBe(3);
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
    expect(result.verification.migrationCount).toBe(3);

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
});
