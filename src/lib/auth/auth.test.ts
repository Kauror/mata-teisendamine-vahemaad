import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import { hashSecret, verifySecretHash } from '@/lib/auth/password';
import { issueSession, verifySession } from '@/lib/auth/session';
import { assertLoginAllowed, clearLoginFailures, recordLoginFailure } from '@/lib/auth/rateLimit';

const previous = { ...process.env };

beforeEach(() => {
  process.env.APP_SESSION_SECRET_CURRENT = 'current-secret-that-is-at-least-thirty-two-characters';
  process.env.APP_SESSION_SECRET_PREVIOUS = '';
  process.env.APP_ORIGIN = 'https://example.test';
  db.exec('DELETE FROM auth_login_limits');
});

afterEach(() => {
  process.env.APP_SESSION_SECRET_CURRENT = previous.APP_SESSION_SECRET_CURRENT;
  process.env.APP_SESSION_SECRET_PREVIOUS = previous.APP_SESSION_SECRET_PREVIOUS;
  process.env.APP_ORIGIN = previous.APP_ORIGIN;
});

describe('authentication primitives', () => {
  it('uses independently salted scrypt hashes', () => {
    const left = hashSecret('correct horse battery staple');
    const right = hashSecret('correct horse battery staple');
    expect(left).not.toBe(right);
    expect(verifySecretHash('correct horse battery staple', left)).toBe(true);
    expect(verifySecretHash('wrong', left)).toBe(false);
  });

  it('signs expiring scoped sessions and accepts the previous rotation key', async () => {
    const issued = await issueSession('family', { maxAgeSeconds: 60, nowMs: 1_000_000 });
    expect(await verifySession(issued.token, 'family', { nowMs: 1_010_000 })).toMatchObject({ scope: 'family' });
    expect(await verifySession(issued.token, 'parent', { nowMs: 1_010_000 })).toBeNull();

    process.env.APP_SESSION_SECRET_PREVIOUS = process.env.APP_SESSION_SECRET_CURRENT;
    process.env.APP_SESSION_SECRET_CURRENT = 'rotated-secret-that-is-also-at-least-thirty-two-characters';
    expect(await verifySession(issued.token, 'family', { nowMs: 1_010_000 })).not.toBeNull();
    expect(await verifySession(issued.token, 'family', { nowMs: 2_000_000 })).toBeNull();
  });

  it('blocks repeated login failures in SQLite and clears on success', () => {
    const identity = '203.0.113.8|test';
    for (let attempt = 0; attempt < 5; attempt += 1) recordLoginFailure('family_login', identity, 1_000_000 + attempt);
    expect(() => assertLoginAllowed('family_login', identity, 1_001_000)).toThrow(/Too many/);
    clearLoginFailures('family_login', identity);
    expect(() => assertLoginAllowed('family_login', identity, 1_001_000)).not.toThrow();
  });
});
