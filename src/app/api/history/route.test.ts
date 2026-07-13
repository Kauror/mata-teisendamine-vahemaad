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
    const page = await (await GET(new Request('https://example.test/api/history'))).json() as { items: Array<{ category: string }> };
    expect(page.items.map((row) => row.category)).toContain('Ajalooline');
  });

  it('uses a deterministic bounded cursor without duplicates and supports filters', async () => {
    const insert = db.prepare(`
      INSERT INTO attempts (
        id, createdAt, category, difficulty, questionCount, score, elapsedSeconds,
        questions, learner, subject, topic, protocolVersion, rewardSettlementStatus
      ) VALUES (?, ?, 'Test', 'Lihtne', 1, 1, 1, '[]', ?, ?, ?, 2, 'eligible')
    `);
    insert.run(10, '2026-07-01T10:00:00.000Z', 'kiur', 'matemaatika', 'liitmine');
    insert.run(11, '2026-07-01T10:00:00.000Z', 'kirsi', 'lugemine', 'sprint');
    insert.run(12, '2026-07-01T11:00:00.000Z', 'kirsi', 'lugemine', 'sprint');

    const first = await (await GET(new Request('https://example.test/api/history?limit=2'))).json() as { items: Array<{ id: number }>; nextCursor: string };
    expect(first.items.map((row) => row.id)).toEqual([12, 11]);
    const second = await (await GET(new Request(`https://example.test/api/history?limit=2&cursor=${encodeURIComponent(first.nextCursor)}`))).json() as { items: Array<{ id: number }>; nextCursor: null };
    expect(second.items.map((row) => row.id)).toEqual([10]);

    const filtered = await (await GET(new Request('https://example.test/api/history?learner=kirsi&subject=lugemine&topic=sprint'))).json() as { items: Array<{ id: number }> };
    expect(filtered.items.map((row) => row.id)).toEqual([12, 11]);
  });

  it('rejects malformed and over-limit pagination', async () => {
    expect((await GET(new Request('https://example.test/api/history?limit=101'))).status).toBe(400);
    expect((await GET(new Request('https://example.test/api/history?cursor=not-json'))).status).toBe(400);
  });
});
