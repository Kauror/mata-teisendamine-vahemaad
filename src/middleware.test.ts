import { beforeAll, describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';
import { issueSession } from '@/lib/auth/session';
import { APP_ACCESS_COOKIE, PARENT_SESSION_COOKIE } from '@/lib/auth/constants';

beforeAll(() => {
  process.env.APP_SESSION_SECRET_CURRENT = 'middleware-test-secret-0123456789abcdef';
  process.env.APP_ORIGIN = 'https://example.test';
});

async function request(options: { parent?: boolean; csrf?: string } = {}) {
  const family = await issueSession('family', { maxAgeSeconds: 60 });
  const parent = options.parent ? await issueSession('parent', { maxAgeSeconds: 60, authVersion: 1 }) : null;
  const cookie = [
    `${APP_ACCESS_COOKIE}=${family.token}`,
    parent ? `${PARENT_SESSION_COOKIE}=${parent.token}` : null
  ].filter(Boolean).join('; ');
  return {
    parent,
    response: await middleware(new NextRequest('https://example.test/api/parent/history/1', {
      method: 'DELETE',
      headers: {
        cookie,
        origin: 'https://example.test',
        'x-csrf-token': options.csrf ?? ''
      }
    }))
  };
}

describe('parent mutation middleware', () => {
  it('keeps normal family-session history reads available', async () => {
    const family = await issueSession('family', { maxAgeSeconds: 60 });
    const response = await middleware(new NextRequest('https://example.test/api/history', {
      headers: { cookie: `${APP_ACCESS_COOKIE}=${family.token}` }
    }));
    expect(response.status).toBe(200);
    expect(response.headers.get('x-middleware-next')).toBe('1');
  });

  it('rejects a family session without a parent session', async () => {
    expect((await request()).response.status).toBe(401);
  });

  it('rejects a parent session without its exact CSRF token', async () => {
    expect((await request({ parent: true, csrf: 'wrong' })).response.status).toBe(403);
  });

  it('allows a parent session carrying its exact CSRF token', async () => {
    const family = await issueSession('family', { maxAgeSeconds: 60 });
    const parent = await issueSession('parent', { maxAgeSeconds: 60, authVersion: 1 });
    const response = await middleware(new NextRequest('https://example.test/api/parent/history/1', {
      method: 'DELETE',
      headers: {
        cookie: `${APP_ACCESS_COOKIE}=${family.token}; ${PARENT_SESSION_COOKIE}=${parent.token}`,
        origin: 'https://example.test',
        'x-csrf-token': parent.payload.csrf
      }
    }));
    expect(response.status).toBe(200);
    expect(response.headers.get('x-middleware-next')).toBe('1');
  });
});
