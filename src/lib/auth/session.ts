export type SessionScope = 'family' | 'parent';

export type SignedSession = {
  version: 2;
  scope: SessionScope;
  issuedAt: number;
  expiresAt: number;
  csrf: string;
  keyId: string;
  authVersion?: number;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function encodeBase64Url(bytes: Uint8Array) {
  let value = '';
  for (const byte of bytes) value += String.fromCharCode(byte);
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeBase64Url(value: string) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4 || 4)) % 4);
  const decoded = atob(padded);
  return Uint8Array.from(decoded, (char) => char.charCodeAt(0));
}

async function digest(value: string) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
}

async function keyId(secret: string) {
  return encodeBase64Url((await digest(secret)).slice(0, 12));
}

async function hmac(secret: string, value: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value)));
}

function currentSecret() {
  const value = process.env.APP_SESSION_SECRET_CURRENT?.trim();
  if (!value && process.env.NODE_ENV === 'production') throw new Error('APP_SESSION_SECRET_CURRENT is required in production.');
  if (value && value.length < 32) throw new Error('APP_SESSION_SECRET_CURRENT must contain at least 32 characters.');
  return value || null;
}

function sessionSecrets() {
  const current = currentSecret();
  const previous = process.env.APP_SESSION_SECRET_PREVIOUS?.trim() || null;
  if (previous && previous.length < 32) throw new Error('APP_SESSION_SECRET_PREVIOUS must contain at least 32 characters.');
  return [current, previous].filter((value): value is string => Boolean(value));
}

export function assertSessionEnvironment() {
  if (!currentSecret()) throw new Error('APP_SESSION_SECRET_CURRENT is required.');
  if (!configuredAppOrigin()) throw new Error('APP_ORIGIN is required.');
}

function randomToken(bytes = 24) {
  const value = new Uint8Array(bytes);
  crypto.getRandomValues(value);
  return encodeBase64Url(value);
}

export async function issueSession(
  scope: SessionScope,
  options: { maxAgeSeconds: number; authVersion?: number; nowMs?: number }
) {
  const secret = currentSecret();
  if (!secret) throw new Error('APP_SESSION_SECRET_CURRENT is not configured.');
  const now = Math.floor((options.nowMs ?? Date.now()) / 1000);
  const payload: SignedSession = {
    version: 2,
    scope,
    issuedAt: now,
    expiresAt: now + options.maxAgeSeconds,
    csrf: randomToken(),
    keyId: await keyId(secret),
    ...(options.authVersion === undefined ? {} : { authVersion: options.authVersion })
  };
  const encoded = encodeBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = encodeBase64Url(await hmac(secret, encoded));
  return { token: `${encoded}.${signature}`, payload };
}

export async function verifySession(
  token: string | null | undefined,
  expectedScope: SessionScope,
  options: { nowMs?: number; clockToleranceSeconds?: number } = {}
): Promise<SignedSession | null> {
  if (!token || token.length > 4096) return null;
  const [encoded, signature, extra] = token.split('.');
  if (!encoded || !signature || extra) return null;

  let payload: SignedSession;
  try {
    payload = JSON.parse(decoder.decode(decodeBase64Url(encoded))) as SignedSession;
  } catch {
    return null;
  }
  if (
    payload.version !== 2 ||
    payload.scope !== expectedScope ||
    !Number.isInteger(payload.issuedAt) ||
    !Number.isInteger(payload.expiresAt) ||
    typeof payload.csrf !== 'string' ||
    payload.csrf.length < 20 ||
    typeof payload.keyId !== 'string'
  ) return null;

  const now = Math.floor((options.nowMs ?? Date.now()) / 1000);
  const tolerance = options.clockToleranceSeconds ?? 30;
  if (payload.issuedAt > now + tolerance || payload.expiresAt <= now - tolerance || payload.expiresAt <= payload.issuedAt) return null;

  for (const secret of sessionSecrets()) {
    if (await keyId(secret) !== payload.keyId) continue;
    const expected = await hmac(secret, encoded);
    const actual = decodeBase64Url(signature);
    if (actual.length !== expected.length) return null;
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    if (await crypto.subtle.verify('HMAC', key, actual, encoder.encode(encoded))) return payload;
  }
  return null;
}

export function configuredAppOrigin() {
  const configured = process.env.APP_ORIGIN?.trim();
  if (!configured) {
    if (process.env.NODE_ENV === 'production') throw new Error('APP_ORIGIN is required in production.');
    return null;
  }
  const url = new URL(configured);
  if (url.origin !== configured.replace(/\/$/, '')) throw new Error('APP_ORIGIN must be an exact origin without a path.');
  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') throw new Error('APP_ORIGIN must use HTTPS in production.');
  return url.origin;
}

export function hasExactOrigin(origin: string | null) {
  const configured = configuredAppOrigin();
  if (!configured) return process.env.NODE_ENV !== 'production' && origin !== null;
  if (!origin) return false;
  try {
    return new URL(origin).origin === configured && origin.replace(/\/$/, '') === configured;
  } catch {
    return false;
  }
}
