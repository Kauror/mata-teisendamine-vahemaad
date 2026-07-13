import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { hashSecret } from '@/lib/auth/password';
import {
  assertParentAuthReady,
  parentAuthVersion,
  parentSessionMatchesCurrentVersion,
  replaceParentPasswordHash
} from '@/lib/auth/parentState';
import { openDatabase, type DatabaseConnection } from '@/lib/db';
import type { SignedSession } from '@/lib/auth/session';

let connection: DatabaseConnection;

beforeEach(() => {
  connection = openDatabase(':memory:');
});

afterEach(() => {
  connection.close();
});

function store(key: string, value: string) {
  connection.prepare('INSERT INTO parent_settings (key, value, updatedAt) VALUES (?, ?, ?)').run(key, value, new Date().toISOString());
}

describe('production parent authentication readiness', () => {
  it('fails when neither environment nor stored parent authentication is available', () => {
    expect(() => assertParentAuthReady(connection, undefined)).toThrow(/Parent authentication is unavailable/);
  });

  it('accepts a valid environment hash', () => {
    expect(assertParentAuthReady(connection, hashSecret('environment-parent-password'))).toBe('environment');
  });

  it('accepts a valid migrated stored hash without an environment hash', () => {
    store('parent_password_hash', hashSecret('stored-parent-password'));
    expect(assertParentAuthReady(connection, undefined)).toBe('stored');
  });

  it('rejects malformed environment and stored hashes', () => {
    expect(() => assertParentAuthReady(connection, 'not-a-hash')).toThrow(/PARENT_PASSWORD_HASH/);
    store('parent_password_hash', 'also-not-a-hash');
    expect(() => assertParentAuthReady(connection, hashSecret('otherwise-valid-environment'))).toThrow(/Stored parent password hash/);
  });

  it('increments the auth version and invalidates previous parent sessions on password change', () => {
    const previousVersion = parentAuthVersion(connection);
    const previousSession = { authVersion: previousVersion } as SignedSession;
    expect(parentSessionMatchesCurrentVersion(connection, previousSession)).toBe(true);

    const nextVersion = replaceParentPasswordHash(connection, hashSecret('replacement-parent-password'));
    expect(nextVersion).toBe(previousVersion + 1);
    expect(parentAuthVersion(connection)).toBe(nextVersion);
    expect(parentSessionMatchesCurrentVersion(connection, previousSession)).toBe(false);
    expect(parentSessionMatchesCurrentVersion(connection, { authVersion: nextVersion } as SignedSession)).toBe(true);
  });
});
