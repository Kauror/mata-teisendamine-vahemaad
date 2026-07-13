import { expectedSchemaMigrationCount, type DatabaseConnection } from '@/lib/db';

const REQUIRED_TABLES = ['attempts', 'parent_settings', 'point_ledger', 'schema_migrations'] as const;

export function checkDatabaseReadiness(connection: DatabaseConnection, startupVerified = process.env.DATABASE_STARTUP_VERIFIED === '1') {
  if (!startupVerified) throw new Error('Startup verification has not completed.');
  const probe = connection.prepare('SELECT 1 AS ok').get() as { ok: number };
  if (probe.ok !== 1) throw new Error('Database read probe failed.');
  const existing = new Set((connection.prepare(
    `SELECT name FROM sqlite_master WHERE type = 'table' AND name IN (${REQUIRED_TABLES.map(() => '?').join(',')})`
  ).all(...REQUIRED_TABLES) as Array<{ name: string }>).map((row) => row.name));
  if (REQUIRED_TABLES.some((table) => !existing.has(table))) throw new Error('Required database tables are missing.');
  const count = (connection.prepare('SELECT COUNT(*) AS count FROM schema_migrations').get() as { count: number }).count;
  if (count !== expectedSchemaMigrationCount()) throw new Error('Database migrations are incomplete.');
  return true;
}
