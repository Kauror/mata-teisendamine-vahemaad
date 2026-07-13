import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import { GET } from '@/app/api/history/route';
import { deleteAttempt } from '@/lib/historyMaintenance';

beforeEach(() => {
  db.pragma('foreign_keys = OFF');
  db.exec(`
    DELETE FROM attempt_tombstones;
    DELETE FROM attempts;
  `);
  db.pragma('foreign_keys = ON');
});

describe('history visibility', () => {
  it('omits hidden attempts from the normal history response', async () => {
    const insert = db.prepare(`
      INSERT INTO attempts (
        id, createdAt, category, difficulty, questionCount, score,
        elapsedSeconds, questions, learner, protocolVersion, rewardSettlementStatus
      ) VALUES (?, ?, 'Korrutamine', 'Lihtne', 10, 10, 60, '[]', 'kiur', 2, 'eligible')
    `);
    insert.run(1, '2026-07-01T08:00:00.000Z');
    insert.run(2, '2026-07-01T09:00:00.000Z');

    expect(deleteAttempt(1)).toBe(1);
    const response = await GET();
    const rows = await response.json() as Array<{ id: number }>;

    expect(rows.map((row) => row.id)).toEqual([2]);
  });
});
