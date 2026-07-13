import { isScryptHash } from '@/lib/auth/password';
import type { SignedSession } from '@/lib/auth/session';
import type { DatabaseConnection } from '@/lib/db';

export const PARENT_HASH_KEY = 'parent_password_hash';
export const PARENT_LEGACY_PASSWORD_KEY = 'parent_password';
export const PARENT_AUTH_VERSION_KEY = 'parent_auth_version';

function setting(connection: DatabaseConnection, key: string) {
  return (connection.prepare('SELECT value FROM parent_settings WHERE key = ?').get(key) as { value: string } | undefined)?.value ?? null;
}

export function storedParentPasswordHash(connection: DatabaseConnection) {
  return setting(connection, PARENT_HASH_KEY);
}

export function parentAuthVersion(connection: DatabaseConnection) {
  const parsed = Number(setting(connection, PARENT_AUTH_VERSION_KEY));
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
}

export function assertParentAuthReady(connection: DatabaseConnection, environmentHash = process.env.PARENT_PASSWORD_HASH) {
  const stored = storedParentPasswordHash(connection);
  if (stored) {
    if (!isScryptHash(stored)) throw new Error('Stored parent password hash is malformed.');
    return 'stored' as const;
  }
  const configured = environmentHash?.trim() || null;
  if (!configured) throw new Error('Parent authentication is unavailable. Configure PARENT_PASSWORD_HASH or migrate a stored parent password hash.');
  if (!isScryptHash(configured)) throw new Error('PARENT_PASSWORD_HASH is not a supported scrypt hash.');
  return 'environment' as const;
}

export function replaceParentPasswordHash(connection: DatabaseConnection, nextHash: string) {
  if (!isScryptHash(nextHash)) throw new Error('Parent password replacement must be a supported scrypt hash.');
  const nextVersion = parentAuthVersion(connection) + 1;
  const now = new Date().toISOString();
  connection.transaction(() => {
    connection.prepare(`
      INSERT INTO parent_settings (key, value, updatedAt) VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt
    `).run(PARENT_HASH_KEY, nextHash, now);
    connection.prepare(`
      INSERT INTO parent_settings (key, value, updatedAt) VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt
    `).run(PARENT_AUTH_VERSION_KEY, String(nextVersion), now);
    connection.prepare('DELETE FROM parent_settings WHERE key = ?').run(PARENT_LEGACY_PASSWORD_KEY);
  })();
  return nextVersion;
}

export function parentSessionMatchesCurrentVersion(connection: DatabaseConnection, payload: SignedSession | null) {
  return Boolean(payload && payload.authVersion === parentAuthVersion(connection));
}
