import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { openDatabase, type DatabaseConnection } from '@/lib/db';
import { isLegacyFamilySession, issueSession, verifySession } from '@/lib/auth/session';
import { parentSessionMatchesCurrentVersion, revokeParentSession } from '@/lib/auth/parentState';
import { APP_ACCESS_COOKIE, APP_CSRF_COOKIE } from '@/lib/auth/constants';
import { middleware } from '@/middleware';

// A2/C4: sessions must be revocable. Changing the family PIN signs every
// device out; parent logout ends that parent token everywhere it was copied.

let connection: DatabaseConnection;

beforeEach(() => {
  vi.stubEnv('APP_SESSION_SECRET_CURRENT', 'revocation-test-secret-0123456789abcdef');
  vi.stubEnv('APP_SESSION_SECRET_PREVIOUS', '');
  vi.stubEnv('APP_ORIGIN', 'https://example.test');
  vi.stubEnv('APP_ACCESS_PIN_HASH', 'scrypt$first-pin-hash');
  vi.stubEnv('APP_FAMILY_SESSION_EPOCH', '');
  connection = openDatabase(':memory:');
});

afterEach(() => {
  connection.close();
  vi.unstubAllEnvs();
});

describe('family session epoch', () => {
  it('signs out every family session when the PIN changes', async () => {
    const { token } = await issueSession('family', { maxAgeSeconds: 60 });
    expect(await verifySession(token, 'family')).not.toBeNull();
    vi.stubEnv('APP_ACCESS_PIN_HASH', 'scrypt$second-pin-hash');
    expect(await verifySession(token, 'family')).toBeNull();
  });

  it('signs out every family session when the epoch is bumped', async () => {
    const { token } = await issueSession('family', { maxAgeSeconds: 60 });
    vi.stubEnv('APP_FAMILY_SESSION_EPOCH', '2');
    expect(await verifySession(token, 'family')).toBeNull();
  });

  it('re-signs a pre-epoch family session with the current epoch, keeping its CSRF token', async () => {
    const legacy = await issueSession('family', { maxAgeSeconds: 600 });
    // Simulate a token from before the epoch: re-sign the payload without it.
    const { familyEpoch: _omit, ...payload } = legacy.payload;
    void _omit;
    const legacyToken = await (async () => {
      const { encodeBase64Url, hmac } = await import('@/lib/auth/session');
      const encoded = encodeBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
      return `${encoded}.${encodeBase64Url(await hmac(process.env.APP_SESSION_SECRET_CURRENT!, encoded))}`;
    })();
    const verified = await verifySession(legacyToken, 'family');
    expect(verified && isLegacyFamilySession(verified)).toBe(true);

    const response = await middleware(new NextRequest('https://example.test/kiur', {
      headers: { cookie: `${APP_ACCESS_COOKIE}=${legacyToken}` }
    }));
    const upgraded = response.cookies.get(APP_ACCESS_COOKIE)?.value;
    expect(upgraded).toBeTruthy();
    const session = await verifySession(upgraded, 'family');
    expect(session?.familyEpoch).toBeTruthy();
    expect(session?.csrf).toBe(payload.csrf);
    expect(session?.expiresAt).toBe(payload.expiresAt);
    expect(response.cookies.get(APP_CSRF_COOKIE)?.value).toBe(payload.csrf);

    // ...and that upgraded session is now revocable by a PIN change.
    vi.stubEnv('APP_ACCESS_PIN_HASH', 'scrypt$second-pin-hash');
    expect(await verifySession(upgraded, 'family')).toBeNull();
  });
});

describe('parent logout revocation', () => {
  it('refuses a parent token after logout but keeps other parent sessions', async () => {
    const first = await issueSession('parent', { maxAgeSeconds: 600, authVersion: 1 });
    const second = await issueSession('parent', { maxAgeSeconds: 600, authVersion: 1 });
    expect(parentSessionMatchesCurrentVersion(connection, first.payload)).toBe(true);
    revokeParentSession(connection, first.payload);
    expect(parentSessionMatchesCurrentVersion(connection, first.payload)).toBe(false);
    expect(parentSessionMatchesCurrentVersion(connection, second.payload)).toBe(true);
    // Revoking twice is harmless.
    revokeParentSession(connection, first.payload);
  });

  it('prunes revocations of tokens that have expired anyway', async () => {
    const old = await issueSession('parent', { maxAgeSeconds: 60, authVersion: 1, nowMs: Date.parse('2026-01-01T00:00:00Z') });
    revokeParentSession(connection, old.payload, Date.parse('2026-01-01T00:00:10Z'));
    const fresh = await issueSession('parent', { maxAgeSeconds: 60, authVersion: 1 });
    revokeParentSession(connection, fresh.payload);
    const rows = connection.prepare('SELECT COUNT(*) AS count FROM parent_session_revocations').get() as { count: number };
    expect(rows.count).toBe(1);
  });
});
