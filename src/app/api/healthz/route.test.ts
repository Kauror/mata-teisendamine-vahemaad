import { describe, expect, it } from 'vitest';
import db from '@/lib/db';
import { GET } from '@/app/api/healthz/route';
import { databaseHealth } from '@/lib/server/databaseHealth';

// C8: the healthcheck touches SQLite, so a database the app cannot use makes
// the container unhealthy instead of "healthy" forever.
describe('/api/healthz', () => {
  it('is healthy when SQLite answers and takes the write lock', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('is unhealthy when the write lock cannot be taken, and restores the busy timeout', async () => {
    const before = db.pragma('busy_timeout', { simple: true });
    db.exec('BEGIN IMMEDIATE');
    try {
      expect(databaseHealth()).toEqual({ ok: false, reason: 'locked' });
    } finally {
      if (db.inTransaction) db.exec('ROLLBACK');
    }
    expect(db.pragma('busy_timeout', { simple: true })).toBe(before);
    expect((await GET()).status).toBe(200);
  });

  it('reveals nothing but ok', async () => {
    const body = await (await GET()).json();
    expect(Object.keys(body)).toEqual(['ok']);
  });
});
