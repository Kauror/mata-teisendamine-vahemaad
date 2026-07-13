import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import { GET, POST } from '@/app/api/history/route';

beforeEach(() => {
  db.pragma('foreign_keys = OFF');
  db.exec('DELETE FROM attempts;');
  db.pragma('foreign_keys = ON');
});

describe('history API compatibility', () => {
  it('retires direct attempt writes without inserting or rewarding', async () => {
    const before = (db.prepare('SELECT COUNT(*) AS count FROM attempts').get() as { count: number }).count;
    const response = await POST();
    expect(response.status).toBe(410);
    expect(await response.json()).toMatchObject({ code: 'legacy_write_retired' });
    expect((db.prepare('SELECT COUNT(*) AS count FROM attempts').get() as { count: number }).count).toBe(before);
  });

  it('keeps existing protocol-v1 rows readable', async () => {
    db.prepare(`
      INSERT INTO attempts (
        createdAt, category, difficulty, questionCount, score, elapsedSeconds,
        questions, learner, protocolVersion, rewardSettlementStatus
      ) VALUES ('2025-01-01T10:00:00.000Z', 'Ajalooline', 'Lihtne', 5, 4, 30,
        '[]', 'kiur', 1, 'eligible')
    `).run();
    const rows = await (await GET()).json() as Array<{ category: string }>;
    expect(rows.map((row) => row.category)).toContain('Ajalooline');
  });
});
