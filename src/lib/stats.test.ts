import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import { getStatsOverview } from '@/lib/stats';

beforeEach(() => {
  db.prepare('DELETE FROM attempts').run();
});

function insertAttempt(id: number, createdAt: string, learner: 'kiur' | 'kirsi') {
  db.prepare(`
    INSERT INTO attempts (
      id, createdAt, category, difficulty, questionCount, score, elapsedSeconds,
      questions, learner, subject, topic, protocolVersion, rewardSettlementStatus
    ) VALUES (?, ?, 'Test', 'Lihtne', 2, 1, 1, '[]', ?, 'matemaatika', 'liitmine', 2, 'eligible')
  `).run(id, createdAt, learner);
}

describe('bounded statistics overview', () => {
  it('keeps exact Tallinn days across the spring DST boundary', () => {
    insertAttempt(1, '2026-03-28T20:59:59.000Z', 'kiur');
    insertAttempt(2, '2026-03-28T22:30:00.000Z', 'kiur');
    insertAttempt(3, '2026-03-30T20:00:00.000Z', 'kirsi');
    insertAttempt(4, '2026-03-30T22:00:00.000Z', 'kirsi');

    const overview = getStatsOverview(2, '2026-03-30');
    expect(overview.days.map((day) => [day.date, day.kiur.exercises, day.kirsi.exercises])).toEqual([
      ['2026-03-29', 1, 0],
      ['2026-03-30', 0, 1]
    ]);
  });

  it('uses the createdAt range index', () => {
    const plan = db.prepare('EXPLAIN QUERY PLAN SELECT id FROM attempts WHERE createdAt >= ? AND createdAt < ?')
      .all('2026-01-01T00:00:00.000Z', '2026-02-01T00:00:00.000Z') as Array<{ detail: string }>;
    expect(plan.some((row) => row.detail.includes('idx_attempts_created_at'))).toBe(true);
  });
});
