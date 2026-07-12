import { isScryptHash, verifySecretHash } from '@/lib/auth/password';
import { assertSessionEnvironment, issueSession, verifySession } from '@/lib/auth/session';
import { APP_ACCESS_COOKIE, APP_CSRF_COOKIE, FAMILY_SESSION_MAX_AGE_SECONDS } from '@/lib/auth/constants';

export { APP_ACCESS_COOKIE, APP_CSRF_COOKIE, FAMILY_SESSION_MAX_AGE_SECONDS };

function configuredPinHash() {
  const value = process.env.APP_ACCESS_PIN_HASH?.trim();
  if (!value && process.env.NODE_ENV === 'production') {
    throw new Error('APP_ACCESS_PIN_HASH is required in production. Generate one with npm run auth:hash.');
  }
  return value || null;
}

export function isAppAccessConfigured() {
  return Boolean(configuredPinHash());
}

export function assertProductionAuthConfigured() {
  const pinHash = configuredPinHash();
  if (!pinHash || !isScryptHash(pinHash)) throw new Error('APP_ACCESS_PIN_HASH must be a generated scrypt hash.');
  assertSessionEnvironment();
}

export function isValidAppAccessPin(pin: string) {
  const hash = configuredPinHash();
  return hash ? verifySecretHash(pin.trim(), hash) : false;
}

export async function createAppAccessSession() {
  return issueSession('family', { maxAgeSeconds: FAMILY_SESSION_MAX_AGE_SECONDS });
}

export async function hasValidAppAccessToken(token?: string | null) {
  return Boolean(await verifySession(token, 'family'));
}

export async function appAccessSession(token?: string | null) {
  return verifySession(token, 'family');
}
