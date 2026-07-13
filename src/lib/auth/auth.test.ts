import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import { hashSecret, verifySecretHash } from '@/lib/auth/password';
import { configuredAppOrigin, hasExactOrigin, issueSession, verifySession } from '@/lib/auth/session';
import { assertLoginAllowed, cleanupLoginLimits, clearLoginFailures, loginIdentity, recordLoginFailure } from '@/lib/auth/rateLimit';

const previous = { ...process.env };

beforeEach(() => {
  process.env.APP_SESSION_SECRET_CURRENT = 'current-secret-that-is-at-least-thirty-two-characters';
  process.env.APP_SESSION_SECRET_PREVIOUS = '';
  process.env.APP_ORIGIN = 'https://example.test';
  process.env.AUTH_TRUSTED_PROXY_MODE = 'cloudflare';
  db.exec('DELETE FROM auth_login_limits');
});

afterEach(() => {
  process.env.APP_SESSION_SECRET_CURRENT = previous.APP_SESSION_SECRET_CURRENT;
  process.env.APP_SESSION_SECRET_PREVIOUS = previous.APP_SESSION_SECRET_PREVIOUS;
  process.env.APP_ORIGIN = previous.APP_ORIGIN;
  process.env.AUTH_TRUSTED_PROXY_MODE = previous.AUTH_TRUSTED_PROXY_MODE;
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

  // RTM3-M01: production must reject a plaintext network origin but accept
  // http-loopback (a browser secure context), so the prod-build E2E can use a
  // single consistent origin the test browser actually sends.
  it('accepts http-loopback but rejects plaintext network origins in production', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    // NODE_ENV is readonly in the ambient types; assign through the record.
    (process.env as Record<string, string>).NODE_ENV = 'production';
    try {
      process.env.APP_ORIGIN = 'http://localhost:3000';
      expect(configuredAppOrigin()).toBe('http://localhost:3000');
      expect(hasExactOrigin('http://localhost:3000')).toBe(true);
      expect(hasExactOrigin('http://evil.example')).toBe(false);

      process.env.APP_ORIGIN = 'http://example.test';
      expect(() => configuredAppOrigin()).toThrow(/HTTPS/);
    } finally {
      (process.env as Record<string, string>).NODE_ENV = originalNodeEnv ?? 'test';
    }
  });

  it('blocks repeated login failures in SQLite and clears on success', () => {
    const identity = 'source:203.0.113.8';
    for (let attempt = 0; attempt < 5; attempt += 1) recordLoginFailure('family_login', identity, 1_000_000 + attempt);
    expect(() => assertLoginAllowed('family_login', identity, 1_001_000)).toThrow(/Too many/);
    clearLoginFailures('family_login', identity);
    expect(() => assertLoginAllowed('family_login', identity, 1_001_000)).not.toThrow();
  });

  it('shares a trusted-IP bucket across user-agent changes', () => {
    const first = loginIdentity(new Headers({ 'cf-connecting-ip': '203.0.113.8', 'user-agent': 'Browser A' }));
    const second = loginIdentity(new Headers({ 'cf-connecting-ip': '203.0.113.8', 'user-agent': 'Browser B' }));
    expect(first).toBe(second);
    for (let attempt = 0; attempt < 5; attempt += 1) recordLoginFailure('family_login', first, 2_000_000 + attempt);
    expect(() => assertLoginAllowed('family_login', second, 2_001_000)).toThrow(/Too many/);
  });

  it('does not accept malformed forwarding headers as arbitrary identities', () => {
    expect(loginIdentity(new Headers({
      'cf-connecting-ip': '203.0.113.8, 198.51.100.2',
      'x-forwarded-for': '192.0.2.123',
      'user-agent': 'attacker-controlled'
    }))).toBe('source:unknown');
  });

  it('reports an exact Retry-After and keeps family and parent scopes separate', () => {
    const identity = 'source:203.0.113.9';
    for (let attempt = 0; attempt < 5; attempt += 1) recordLoginFailure('family_login', identity, 3_000_000 + attempt);
    try {
      assertLoginAllowed('family_login', identity, 3_001_000);
      throw new Error('Expected rate limit');
    } catch (error) {
      expect((error as { retryAfterSeconds?: number }).retryAfterSeconds).toBe(1800);
    }
    expect(() => assertLoginAllowed('parent_login', identity, 3_001_000)).not.toThrow();
  });

  it('activates the global scope throttle across distributed source identities', () => {
    for (let attempt = 0; attempt < 30; attempt += 1) {
      recordLoginFailure('parent_login', `source:198.51.100.${attempt + 1}`, 4_000_000 + attempt);
    }
    expect(() => assertLoginAllowed('parent_login', 'source:203.0.113.200', 4_001_000)).toThrow(/Too many/);
  });

  it('cleans expired limiter rows without touching current blocks', () => {
    recordLoginFailure('family_login', 'source:192.0.2.1', 1_000);
    expect((db.prepare('SELECT COUNT(*) AS count FROM auth_login_limits').get() as { count: number }).count).toBe(2);
    expect(cleanupLoginLimits(8 * 24 * 60 * 60 * 1000)).toBe(2);
    expect((db.prepare('SELECT COUNT(*) AS count FROM auth_login_limits').get() as { count: number }).count).toBe(0);
  });
});
