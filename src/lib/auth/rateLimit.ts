import { createHash } from 'node:crypto';
import { isIP } from 'node:net';
import db from '@/lib/db';

export type LoginScope = 'family_login' | 'parent_login';
export type TrustedProxyMode = 'direct' | 'cloudflare' | 'reverse_proxy';

// Per client key (Cloudflare's CF-Connecting-IP in production): five free
// failures, then an exponential block that doubles with every further failure
// (5 min, 10 min, 20 min, ... capped at 24 h). Failures are counted over 24 h,
// so one address gets about 14 guesses a day instead of ~720 (C3).
const SOURCE_WINDOW_MS = 24 * 60 * 60 * 1000;
const SOURCE_FREE_FAILURES = 5;
const SOURCE_BASE_BLOCK_MS = 5 * 60 * 1000;
const SOURCE_MAX_BLOCK_MS = 24 * 60 * 60 * 1000;
// Across every key: a distributed guesser must not be able to lock the family
// out, so the global ceiling never blocks. Past 30 failures in 15 minutes each
// login attempt waits a little longer (capped at 5 s) before it is checked.
const GLOBAL_WINDOW_MS = 15 * 60 * 1000;
const GLOBAL_SLOWDOWN_AFTER = 30;
const GLOBAL_SLOWDOWN_STEP_MS = 200;
const GLOBAL_MAX_SLOWDOWN_MS = 5000;
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

function bucketRow(scope: LoginScope, identity: string) {
  return db.prepare(`
    SELECT windowStartedAt, failureCount, blockedUntil FROM auth_login_limits WHERE scope = ? AND identityHash = ?
  `).get(scope, identityHash(identity)) as { windowStartedAt: string; failureCount: number; blockedUntil: string | null } | undefined;
}

export function sourceBlockMs(failures: number) {
  if (failures < SOURCE_FREE_FAILURES) return 0;
  return Math.min(SOURCE_MAX_BLOCK_MS, SOURCE_BASE_BLOCK_MS * 2 ** (failures - SOURCE_FREE_FAILURES));
}

// How long every login attempt waits while the global failure count is high.
export function globalSlowdownMs(scope: LoginScope, nowMs = Date.now()) {
  const row = bucketRow(scope, bucketIdentity('global', ''));
  if (!row || Date.parse(row.windowStartedAt) + GLOBAL_WINDOW_MS <= nowMs) return 0;
  const excess = row.failureCount - GLOBAL_SLOWDOWN_AFTER;
  return excess < 0 ? 0 : Math.min(GLOBAL_MAX_SLOWDOWN_MS, (excess + 1) * GLOBAL_SLOWDOWN_STEP_MS);
}

// Throws { code: 'rate_limited', retryAfterSeconds } while this client key is
// blocked. Otherwise returns how long the caller should wait before checking
// the credential (the global slowdown; 0 normally).
export function assertLoginAllowed(scope: LoginScope, identity: string, nowMs = Date.now()) {
  cleanupLoginLimits(nowMs);
  const retryAfterSeconds = blockedRetrySeconds(scope, bucketIdentity('source', identity), nowMs);
  if (retryAfterSeconds > 0) {
    const error = new Error('Too many failed sign-in attempts.');
    Object.assign(error, { code: 'rate_limited', retryAfterSeconds });
    throw error;
  }
  return { slowdownMs: globalSlowdownMs(scope, nowMs) };
}

export function waitForLoginSlowdown(ms: number) {
  return ms > 0 ? new Promise<void>((resolve) => setTimeout(resolve, ms)) : Promise.resolve();
}

function recordBucketFailure(
  scope: LoginScope,
  identity: string,
  windowMs: number,
  blockMsFor: (failures: number) => number,
  nowMs: number
) {
  const key = identityHash(identity);
  const now = new Date(nowMs).toISOString();
  const row = bucketRow(scope, identity);
  const insideWindow = row && Date.parse(row.windowStartedAt) + windowMs > nowMs;
  const failures = insideWindow ? row.failureCount + 1 : 1;
  const windowStartedAt = insideWindow ? row.windowStartedAt : now;
  const blockMs = blockMsFor(failures);
  const blockedUntil = blockMs > 0 ? new Date(nowMs + blockMs).toISOString() : null;
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
    recordBucketFailure(scope, bucketIdentity('source', identity), SOURCE_WINDOW_MS, sourceBlockMs, nowMs);
    recordBucketFailure(scope, bucketIdentity('global', identity), GLOBAL_WINDOW_MS, () => 0, nowMs);
  })();
}

// A successful login clears only that source bucket. It must not let one known
// credential erase the global slowdown.
export function clearLoginFailures(scope: LoginScope, identity: string) {
  db.prepare('DELETE FROM auth_login_limits WHERE scope = ? AND identityHash = ?')
    .run(scope, identityHash(bucketIdentity('source', identity)));
}
