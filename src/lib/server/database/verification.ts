import fs from 'node:fs';
import path from 'node:path';
import { openDatabase, type DatabaseConnection } from '@/lib/db';

const RFC3339 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/;
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export type DatabaseVerification = {
  integrity: 'ok';
  foreignKeyErrors: 0;
  counts: Record<string, number>;
  balances: Record<string, number>;
  migrationCount: number;
};

function strictTimestamp(value: unknown) {
  return typeof value === 'string' && RFC3339.test(value) && Number.isFinite(Date.parse(value));
}

function strictDate(value: unknown) {
  if (typeof value !== 'string' || !DATE_ONLY.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function assertRequiredDates(connection: DatabaseConnection) {
  const attempts = connection.prepare(`
    SELECT id, createdAt, completedAt, rawDeviceCompletedAt, syncedAt, completionDate
    FROM attempts
  `).all() as Array<Record<string, unknown>>;
  for (const row of attempts) {
    if (!strictTimestamp(row.createdAt)) throw new Error(`Database verification failed: attempt ${row.id} has invalid createdAt.`);
    for (const key of ['completedAt', 'rawDeviceCompletedAt', 'syncedAt'] as const) {
      if (row[key] != null && !strictTimestamp(row[key])) {
        throw new Error(`Database verification failed: attempt ${row.id} has invalid ${key}.`);
      }
    }
    if (row.completionDate != null && !strictDate(row.completionDate)) {
      throw new Error(`Database verification failed: attempt ${row.id} has invalid completionDate.`);
    }
  }

  const taskDates = connection.prepare('SELECT id, date FROM task_instances').all() as Array<{ id: number; date: string }>;
  for (const row of taskDates) {
    if (!strictDate(row.date)) throw new Error(`Database verification failed: task instance ${row.id} has invalid date.`);
  }
}

function assertClientAttemptIdsUnique(connection: DatabaseConnection) {
  const duplicate = connection.prepare(`
    SELECT clientAttemptId, COUNT(*) AS count
    FROM attempts
    WHERE clientAttemptId IS NOT NULL
    GROUP BY clientAttemptId
    HAVING COUNT(*) > 1
    LIMIT 1
  `).get() as { clientAttemptId: string; count: number } | undefined;
  if (duplicate) {
    throw new Error(`Database verification failed: duplicate clientAttemptId ${duplicate.clientAttemptId}.`);
  }
}

function assertLegacyReconciliationIsNotPartial(connection: DatabaseConnection) {
  const legacy = connection.prepare(`
    SELECT COUNT(*) AS count
    FROM point_ledger
    WHERE source = 'reconciliation_adjustment'
  `).get() as { count: number };
  if (legacy.count === 0) return;

  const cutover = connection.prepare('SELECT status FROM reward_cutover_state WHERE id = 1').get() as { status: string } | undefined;
  if (cutover?.status !== 'legacy_adjustments_acknowledged') {
    throw new Error(
      `Database verification failed: ${legacy.count} legacy reconciliation adjustment(s) require an explicit copied-database review.`
    );
  }
}

export function verifyDatabase(connection: DatabaseConnection): DatabaseVerification {
  const integrityRows = connection.pragma('integrity_check') as Array<{ integrity_check: string }>;
  if (integrityRows.length !== 1 || integrityRows[0]?.integrity_check !== 'ok') {
    throw new Error(`Database integrity check failed: ${JSON.stringify(integrityRows)}`);
  }

  const foreignKeys = connection.pragma('foreign_key_check') as unknown[];
  if (foreignKeys.length > 0) {
    throw new Error(`Database foreign-key check failed with ${foreignKeys.length} violation(s).`);
  }

  assertClientAttemptIdsUnique(connection);
  assertRequiredDates(connection);
  assertLegacyReconciliationIsNotPartial(connection);

  const tables = ['attempts', 'point_ledger', 'study_attempt_rewards', 'task_instances', 'store_purchases'] as const;
  const counts: Record<string, number> = {};
  for (const table of tables) {
    counts[table] = (connection.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get() as { count: number }).count;
  }

  const balanceRows = connection.prepare(`
    SELECT learner, COALESCE(SUM(amount), 0) AS balance
    FROM point_ledger
    GROUP BY learner
  `).all() as Array<{ learner: string; balance: number }>;
  const balances: Record<string, number> = {};
  for (const row of balanceRows) {
    if (!Number.isFinite(row.balance)) throw new Error(`Database verification failed: non-finite balance for ${row.learner}.`);
    balances[row.learner] = row.balance;
  }

  const migrationCount = (connection.prepare('SELECT COUNT(*) AS count FROM schema_migrations').get() as { count: number }).count;
  return { integrity: 'ok', foreignKeyErrors: 0, counts, balances, migrationCount };
}

function fsyncFile(filename: string) {
  // Windows rejects fsync on a read-only descriptor; r+ is safe here because
  // the backup has just been created and this function performs no writes.
  const descriptor = fs.openSync(filename, 'r+');
  try {
    fs.fsyncSync(descriptor);
  } finally {
    fs.closeSync(descriptor);
  }
}

export type StartupPreparation = {
  databaseFile: string;
  backupFile: string | null;
  verification: DatabaseVerification;
};

export function prepareDatabaseForStartup(databaseFile: string, backupDirectory?: string): StartupPreparation {
  if (!databaseFile) throw new Error('Database file is required.');
  if (databaseFile === ':memory:') {
    const connection = openDatabase(':memory:');
    try {
      return { databaseFile, backupFile: null, verification: verifyDatabase(connection) };
    } finally {
      connection.close();
    }
  }

  const absoluteDatabase = path.resolve(databaseFile);
  let backupFile: string | null = null;
  if (fs.existsSync(absoluteDatabase)) {
    const targetDirectory = path.resolve(backupDirectory ?? path.join(path.dirname(absoluteDatabase), 'backups'));
    fs.mkdirSync(targetDirectory, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    backupFile = path.join(targetDirectory, `${path.basename(absoluteDatabase)}.${stamp}.bak`);
    if (path.resolve(backupFile) === absoluteDatabase) throw new Error('Backup path must differ from the live database path.');
    fs.copyFileSync(absoluteDatabase, backupFile, fs.constants.COPYFILE_EXCL);
    fsyncFile(backupFile);
  }

  const connection = openDatabase(absoluteDatabase);
  try {
    const verification = verifyDatabase(connection);
    connection.pragma('wal_checkpoint(TRUNCATE)');
    return { databaseFile: absoluteDatabase, backupFile, verification };
  } catch (error) {
    throw new Error(
      `Startup verification failed${backupFile ? `; untouched backup is ${backupFile}` : ''}: ${error instanceof Error ? error.message : String(error)}`
    );
  } finally {
    connection.close();
  }
}
