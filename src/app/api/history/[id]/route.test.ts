import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import { GET } from '@/app/api/history/[id]/route';

// SEC-03: a result the parent hid ("Peida") must not come back by its id.

function insertAttempt(id: number) {
  db.prepare(`
    INSERT INTO attempts (id, createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions, learner, protocolVersion, rewardSettlementStatus)
    VALUES (?, '2026-07-01T08:00:00.000Z', 'Korrutamine', 'Lihtne', 10, 10, 60, '[]', 'kiur', 2, 'eligible')
  `).run(id);
}

const get = (id: string) => GET(new Request(`https://example.test/api/history/${id}`), { params: Promise.resolve({ id }) });

beforeEach(() => {
  db.pragma('foreign_keys = OFF');
  db.exec('DELETE FROM attempts;');
  db.pragma('foreign_keys = ON');
});

describe('GET /api/history/[id]', () => {
  it('returns a visible result', async () => {
    insertAttempt(1);
    expect((await get('1')).status).toBe(200);
  });

  it('does not return a result the parent hid', async () => {
    insertAttempt(2);
    db.prepare("UPDATE attempts SET deletedAt = '2026-07-02T08:00:00.000Z', deletedReason = 'user_history_hide' WHERE id = 2").run();
    expect((await get('2')).status).toBe(404);
  });
});
