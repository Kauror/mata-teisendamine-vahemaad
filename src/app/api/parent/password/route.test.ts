import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { hashSecret } from '@/lib/auth/password';
import { issueSession } from '@/lib/auth/session';
import { POST } from '@/app/api/parent/password/route';

// SEC-04: the current-password check of "Muuda parooli" is a password oracle
// for whoever holds an open parent session (a parent signed in on the child's
// phone). It must be throttled like the parent sign-in itself.

const cookieState = vi.hoisted(() => ({ parentToken: '' }));

vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) => name === 'parent_session' && cookieState.parentToken ? { name, value: cookieState.parentToken } : undefined,
    set: () => undefined
  })
}));

const change = (body: unknown) => POST(new NextRequest('https://example.test/api/parent/password', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body)
}));

let passwordHash = '';
beforeAll(() => { passwordHash = hashSecret('right-password'); });

beforeEach(async () => {
  process.env.APP_SESSION_SECRET_CURRENT = 'parent-password-test-secret-0123456789';
  db.exec('DELETE FROM parent_settings; DELETE FROM auth_login_limits;');
  process.env.PARENT_PASSWORD_HASH = passwordHash;
  cookieState.parentToken = (await issueSession('parent', { maxAgeSeconds: 60, authVersion: 1 })).token;
});

describe('POST /api/parent/password', { timeout: 60_000 }, () => {
  it('requires a parent session', async () => {
    cookieState.parentToken = '';
    expect((await change({ currentPassword: 'right-password', nextPassword: 'new-password-1' })).status).toBe(401);
  });

  it('stops guessing the current password after the sign-in failure limit', async () => {
    const statuses: number[] = [];
    for (let attempt = 0; attempt < 7; attempt += 1) {
      statuses.push((await change({ currentPassword: `guess-${attempt}`, nextPassword: 'new-password-1' })).status);
    }
    expect(statuses.slice(0, 5)).toEqual([400, 400, 400, 400, 400]);
    expect(statuses.slice(5)).toEqual([429, 429]);
    // Even the right password is refused while blocked.
    expect((await change({ currentPassword: 'right-password', nextPassword: 'new-password-1' })).status).toBe(429);
  });

  it('changes the password with the right current password', async () => {
    expect((await change({ currentPassword: 'right-password', nextPassword: 'new-password-1' })).status).toBe(200);
  });

  it('answers a malformed body without leaking an internal error', async () => {
    const response = await change(null);
    expect(response.status).toBe(400);
    expect(JSON.stringify(await response.json())).not.toMatch(/Cannot read|null/);
  });
});
