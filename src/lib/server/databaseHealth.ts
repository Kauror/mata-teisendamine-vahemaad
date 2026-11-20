import fs from 'node:fs';
import path from 'node:path';
import db, { configuredDatabaseFile } from '@/lib/db';

// Below this much free space on the data volume SQLite writes start failing
// (WAL growth, the next backup), so the container reports unhealthy first.
const MIN_FREE_BYTES = 64 * 1024 * 1024;

// Public liveness probe for orchestration (docker compose healthcheck, uptime
// checks). Marked public in middleware so it never requires a family session
// (RTM2-H02), and it reveals nothing private. It touches SQLite cheaply (C8):
// a one-row read, a write-lock probe that writes nothing, and the free space
// of the data volume, so a locked, unreadable or full database is unhealthy.
export function databaseHealth(): { ok: true } | { ok: false; reason: 'read' | 'locked' | 'disk_full' } {
  try {
    db.prepare('SELECT id FROM schema_migrations ORDER BY id DESC LIMIT 1').get();
  } catch {
    return { ok: false, reason: 'read' };
  }
  const previousTimeout = db.pragma('busy_timeout', { simple: true }) as number;
  try {
    db.pragma('busy_timeout = 1000');
    db.exec('BEGIN IMMEDIATE');
    db.exec('ROLLBACK');
  } catch {
    try { if (db.inTransaction) db.exec('ROLLBACK'); } catch { /* nothing to undo */ }
    return { ok: false, reason: 'locked' };
  } finally {
    db.pragma(`busy_timeout = ${Number(previousTimeout) || 30000}`);
  }
  const file = configuredDatabaseFile();
  if (file !== ':memory:') {
    try {
      const stats = fs.statfsSync(path.dirname(path.resolve(file)));
      if (stats.bavail * stats.bsize < MIN_FREE_BYTES) return { ok: false, reason: 'disk_full' };
    } catch {
      // statfs is unavailable on some platforms; the read and lock probes stand.
    }
  }
  return { ok: true };
}
