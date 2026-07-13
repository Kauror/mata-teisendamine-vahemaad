import { beforeEach, describe, expect, it, vi } from 'vitest';
import db from '@/lib/db';
import { hashSecret } from '@/lib/auth/password';
import { issueSession } from '@/lib/auth/session';
import { DELETE as hideAll } from '@/app/api/parent/history/route';
import { DELETE as hideOne } from '@/app/api/parent/history/[id]/route';

const cookieState = vi.hoisted(() => ({ parentToken: '' }));

vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) => name === 'parent_session' && cookieState.parentToken
      ? { name, value: cookieState.parentToken }
      : undefined
  })
}));

function insertAttempt(id: number) {
  db.prepare(`
    INSERT INTO attempts (
      id, createdAt, category, difficulty, questionCount, score,
      elapsedSeconds, questions, learner, protocolVersion, rewardSettlementStatus
    ) VALUES (?, ?, 'Korrutamine', 'Lihtne', 10, 10, 60, '[]', 'kiur', 2, 'eligible')
  `).run(id, `2026-07-01T0${id}:00:00.000Z`);
}

beforeEach(async () => {
  process.env.APP_SESSION_SECRET_CURRENT = 'parent-history-test-secret-0123456789';
  process.env.PARENT_PASSWORD_HASH = hashSecret('parent-test-password');
  cookieState.parentToken = '';
  db.pragma('foreign_keys = OFF');
  db.exec(`
    DELETE FROM attempt_tombstones;
    DELETE FROM attempts;
    DELETE FROM parent_settings;
  `);
  db.pragma('foreign_keys = ON');
});

async function authenticateParent() {
  cookieState.parentToken = (await issueSession('parent', { maxAgeSeconds: 60, authVersion: 1 })).token;
}

describe('parent history routes', () => {
  it('rejects direct route invocation without a parent session', async () => {
    expect((await hideOne(new Request('https://example.test'), { params: Promise.resolve({ id: '1' }) })).status).toBe(401);
    expect((await hideAll()).status).toBe(401);
  });

  it('lets an authenticated parent hide one result', async () => {
    insertAttempt(1);
    await authenticateParent();

    expect((await hideOne(new Request('https://example.test'), { params: Promise.resolve({ id: '1' }) })).status).toBe(200);
    expect((db.prepare('SELECT deletedAt FROM attempts WHERE id = 1').get() as { deletedAt: string | null }).deletedAt).toBeTruthy();
  });

  it('lets an authenticated parent hide all results', async () => {
    insertAttempt(1);
    insertAttempt(2);
    await authenticateParent();

    expect((await hideAll()).status).toBe(200);
    expect((db.prepare('SELECT COUNT(*) AS count FROM attempts WHERE deletedAt IS NULL').get() as { count: number }).count).toBe(0);
  });

  it('leaves old history routes without destructive handlers', async () => {
    const collection = await import('@/app/api/history/route');
    const item = await import('@/app/api/history/[id]/route');
    expect('DELETE' in collection).toBe(false);
    expect('DELETE' in item).toBe(false);
  });
});
