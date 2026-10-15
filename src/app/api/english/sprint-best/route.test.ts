import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import { GET } from '@/app/api/english/sprint-best/route';

beforeEach(() => {
  db.pragma('foreign_keys = OFF');
  db.exec('DELETE FROM attempts;');
  db.pragma('foreign_keys = ON');
});

function insert(id: number, score: number, subject: string, topic: string, deletedAt: string | null = null, learner = 'kiur') {
  db.prepare(`
    INSERT INTO attempts (
      id, createdAt, category, difficulty, questionCount, score, elapsedSeconds,
      questions, learner, subject, topic, protocolVersion, rewardSettlementStatus, deletedAt
    ) VALUES (?, '2026-07-01T10:00:00.000Z', 'Inglise keel - sprint', 'Lihtne', 20, ?, 60, '[]', ?, ?, ?, 2, 'eligible', ?)
  `).run(id, score, learner, subject, topic, deletedAt);
}

async function best() {
  const response = await GET();
  expect(response.status).toBe(200);
  return (await response.json() as { best: number }).best;
}

describe('GET /api/english/sprint-best (PAR-11)', () => {
  it('is 0 with no sprint history', async () => {
    expect(await best()).toBe(0);
  });

  it('takes the best visible English sprint score only', async () => {
    insert(1, 7, 'inglise-keel', 'sprint');
    insert(2, 12, 'inglise-keel', 'sprint');
    insert(3, 30, 'inglise-keel', 'sprint', '2026-07-02T00:00:00.000Z'); // hidden by the parent
    insert(4, 40, 'inglise-keel', 'sonavara'); // another English topic
    insert(5, 50, 'lugemine', 'sprint', null, 'kirsi'); // Kirsi's reading sprint
    expect(await best()).toBe(12);
  });

  it('counts every learner, like the old unfiltered history query', async () => {
    insert(1, 9, 'inglise-keel', 'sprint', null, 'kirsi');
    expect(await best()).toBe(9);
  });
});
