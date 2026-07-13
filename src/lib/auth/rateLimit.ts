import { createHash } from 'node:crypto';
import { isIP } from 'node:net';
import db from '@/lib/db';

export type LoginScope = 'family_login' | 'parent_login';
export type TrustedProxyMode = 'direct' | 'cloudflare' | 'reverse_proxy';

const WINDOW_MS = 15 * 60 * 1000;
const SOURCE_BLOCK_MS = 30 * 60 * 1000;
const SOURCE_MAX_FAILURES = 5;
const GLOBAL_BLOCK_MS = 60 * 60 * 1000;
const GLOBAL_MAX_FAILURES = 30;
const RETENTION_MS = 7 * 24 * 60 * 60 * 1000;

function identityHash(identity: string) {
  return createHash('sha256').update(identity.slice(0, 1024)).digest('hex');
}

function validAddress(value: string | null) {
  const candidate = value?.trim() ?? '';
  return candidate && !candidate.includes(',') && isIP(candidate) ? candidate.toLowerCase() : null;
}

export function trustedProxyMode(): TrustedProxyMode {
  const configured = process.env.AUTH_TRUSTED_PROXY_MODE?.trim();
  if (configured === 'cloudflare' || configured === 'reverse_proxy' || configured === 'direct') return configured;
  return 'direct';
}

// Forwarding headers are trusted only under an explicit deployment topology.
// User-Agent and x-forwarded-for never participate in the primary identity.
export function loginIdentity(headers: Headers, mode = trustedProxyMode()) {
  if (mode === 'cloudflare') return `source:${validAddress(headers.get('cf-connecting-ip')) ?? 'unknown'}`;
  if (mode === 'reverse_proxy') return `source:${validAddress(headers.get('x-real-ip')) ?? 'unknown'}`;
  return 'source:direct';
}

function bucketIdentity(kind: 'source' | 'global', identity: string) {
  return kind === 'source' ? identity : 'global';
}

function blockedRetrySeconds(scope: LoginScope, identity: string, nowMs: number) {
  const row = db.prepare(`
    SELECT blockedUntil FROM auth_login_limits WHERE scope = ? AND identityHash = ?
  `).get(scope, identityHash(identity)) as { blockedUntil: string | null } | undefined;
  if (!row?.blockedUntil) return 0;
  const retryAt = Date.parse(row.blockedUntil);
  return Number.isFinite(retryAt) && retryAt > nowMs ? Math.ceil((retryAt - nowMs) / 1000) : 0;
}

export function cleanupLoginLimits(nowMs = Date.now()) {
  const cutoff = new Date(nowMs - RETENTION_MS).toISOString();
  const now = new Date(nowMs).toISOString();
  return db.prepare(`
    DELETE FROM auth_login_limits
    WHERE updatedAt < ? AND (blockedUntil IS NULL OR blockedUntil < ?)
  `).run(cutoff, now).changes;
}

export function assertLoginAllowed(scope: LoginScope, identity: string, nowMs = Date.now()) {
  cleanupLoginLimits(nowMs);
  const retryAfterSeconds = Math.max(
    blockedRetrySeconds(scope, bucketIdentity('source', identity), nowMs),
    blockedRetrySeconds(scope, bucketIdentity('global', identity), nowMs)
  );
  if (retryAfterSeconds <= 0) return;
  const error = new Error('Too many failed sign-in attempts.');
  Object.assign(error, { code: 'rate_limited', retryAfterSeconds });
  throw error;
}

function recordBucketFailure(
  scope: LoginScope,
  identity: string,
  maxFailures: number,
  blockMs: number,
  nowMs: number
) {
  const key = identityHash(identity);
  const now = new Date(nowMs).toISOString();
  const row = db.prepare(`
    SELECT windowStartedAt, failureCount FROM auth_login_limits WHERE scope = ? AND identityHash = ?
  `).get(scope, key) as { windowStartedAt: string; failureCount: number } | undefined;
  const insideWindow = row && Date.parse(row.windowStartedAt) + WINDOW_MS > nowMs;
  const failures = insideWindow ? row.failureCount + 1 : 1;
  const windowStartedAt = insideWindow ? row.windowStartedAt : now;
  const blockedUntil = failures >= maxFailures ? new Date(nowMs + blockMs).toISOString() : null;
  db.prepare(`
    INSERT INTO auth_login_limits (scope, identityHash, windowStartedAt, failureCount, blockedUntil, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(scope, identityHash) DO UPDATE SET
      windowStartedAt = excluded.windowStartedAt,
      failureCount = excluded.failureCount,
      blockedUntil = excluded.blockedUntil,
      updatedAt = excluded.updatedAt
  `).run(scope, key, windowStartedAt, failures, blockedUntil, now);
}

export function recordLoginFailure(scope: LoginScope, identity: string, nowMs = Date.now()) {
  cleanupLoginLimits(nowMs);
  db.transaction(() => {
    recordBucketFailure(scope, bucketIdentity('source', identity), SOURCE_MAX_FAILURES, SOURCE_BLOCK_MS, nowMs);
    recordBucketFailure(scope, bucketIdentity('global', identity), GLOBAL_MAX_FAILURES, GLOBAL_BLOCK_MS, nowMs);
  })();
}

// A successful login clears only that source bucket. It must not let one known
// credential erase a global distributed-attack throttle.
export function clearLoginFailures(scope: LoginScope, identity: string) {
  db.prepare('DELETE FROM auth_login_limits WHERE scope = ? AND identityHash = ?')
    .run(scope, identityHash(bucketIdentity('source', identity)));
}
