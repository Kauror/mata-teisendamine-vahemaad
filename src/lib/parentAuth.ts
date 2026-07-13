import { cookies } from 'next/headers';
import db from '@/lib/db';
import { hashSecret, isScryptHash, verifySecretHash } from '@/lib/auth/password';
import { issueSession, verifySession } from '@/lib/auth/session';
import { PARENT_CSRF_COOKIE, PARENT_SESSION_COOKIE } from '@/lib/auth/constants';

const HASH_KEY = 'parent_password_hash';
const LEGACY_PASSWORD_KEY = 'parent_password';
const AUTH_VERSION_KEY = 'parent_auth_version';
const MAX_AGE_SECONDS = 60 * 60 * 12;

function setting(key: string) {
  return (db.prepare('SELECT value FROM parent_settings WHERE key = ?').get(key) as { value: string } | undefined)?.value ?? null;
}
function setSetting(key: string, value: string) {
  db.prepare(`
    INSERT INTO parent_settings (key, value, updatedAt)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt
  `).run(key, value, new Date().toISOString());
}

function authVersion() {
  const parsed = Number(setting(AUTH_VERSION_KEY));
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
}

function migrateLegacyPassword() {
  const existingHash = setting(HASH_KEY);
  if (existingHash && isScryptHash(existingHash)) return existingHash;

  const legacy = setting(LEGACY_PASSWORD_KEY);
  if (!legacy) return null;
  const migrated = hashSecret(legacy);
  const transaction = db.transaction(() => {
    setSetting(HASH_KEY, migrated);
    setSetting(AUTH_VERSION_KEY, String(authVersion() + 1));
    db.prepare('DELETE FROM parent_settings WHERE key = ?').run(LEGACY_PASSWORD_KEY);
  });
  transaction();
  return migrated;
}

function configuredPasswordHash() {
  const stored = migrateLegacyPassword();
  if (stored) return stored;
  const environment = process.env.PARENT_PASSWORD_HASH?.trim() || null;
  if (environment && !isScryptHash(environment)) throw new Error('PARENT_PASSWORD_HASH is not a supported scrypt hash.');
  return environment;
}

export function isParentPasswordConfigured() {
  return Boolean(configuredPasswordHash());
}

export function verifyParentPassword(input: string) {
  const configured = configuredPasswordHash();
  return configured ? verifySecretHash(input, configured) : false;
}

export function updateParentPassword(currentPassword: string, nextPassword: string) {
  if (!verifyParentPassword(currentPassword)) throw new Error('Praegune parool on vale.');
  const cleanNext = nextPassword.trim();
  if (cleanNext.length < 8) throw new Error('Uus parool peab olema vähemalt 8 märki.');
  const nextHash = hashSecret(cleanNext);
  const transaction = db.transaction(() => {
    setSetting(HASH_KEY, nextHash);
    setSetting(AUTH_VERSION_KEY, String(authVersion() + 1));
    db.prepare('DELETE FROM parent_settings WHERE key = ?').run(LEGACY_PASSWORD_KEY);
  });
  transaction();
}

export async function hasParentSession() {
  if (!isParentPasswordConfigured()) return false;
  const jar = await cookies();
  const payload = await verifySession(jar.get(PARENT_SESSION_COOKIE)?.value, 'parent');
  return Boolean(payload && payload.authVersion === authVersion());
}

export async function setParentSession() {
  const jar = await cookies();
  const session = await issueSession('parent', { maxAgeSeconds: MAX_AGE_SECONDS, authVersion: authVersion() });
  const secure = process.env.NODE_ENV === 'production';
  jar.set(PARENT_SESSION_COOKIE, session.token, {
    httpOnly: true,
    sameSite: 'strict',
    secure,
    path: '/',
    maxAge: MAX_AGE_SECONDS
  });
  jar.set(PARENT_CSRF_COOKIE, session.payload.csrf, {
    httpOnly: false,
    sameSite: 'strict',
    secure,
    path: '/',
    maxAge: MAX_AGE_SECONDS
  });
}

export async function clearParentSession() {
  const jar = await cookies();
  for (const name of [PARENT_SESSION_COOKIE, PARENT_CSRF_COOKIE]) {
    jar.set(name, '', {
      httpOnly: name === PARENT_SESSION_COOKIE,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0
    });
  }
}
