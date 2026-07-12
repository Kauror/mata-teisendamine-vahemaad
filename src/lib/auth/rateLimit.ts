import { createHash } from 'node:crypto';
import db from '@/lib/db';

type Scope = 'family_login' | 'parent_login';

const WINDOW_MS = 15 * 60 * 1000;
const BLOCK_MS = 30 * 60 * 1000;
const MAX_FAILURES = 5;

function identityHash(identity: string) {
  return createHash('sha256').update(identity.slice(0, 1024)).digest('hex');
}

export function loginIdentity(headers: Headers) {
  const address = headers.get('cf-connecting-ip') || headers.get('x-real-ip') || headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const agent = headers.get('user-agent') || 'unknown';
  return `${address}|${agent}`;
}

export function assertLoginAllowed(scope: Scope, identity: string, nowMs = Date.now()) {
  const row = db.prepare(`
    SELECT blockedUntil FROM auth_login_limits WHERE scope = ? AND identityHash = ?
  `).get(scope, identityHash(identity)) as { blockedUntil: string | null } | undefined;
  if (!row?.blockedUntil) return;
  const retryAt = Date.parse(row.blockedUntil);
  if (Number.isFinite(retryAt) && retryAt > nowMs) {
    const error = new Error('Too many failed sign-in attempts.');
    Object.assign(error, { code: 'rate_limited', retryAfterSeconds: Math.ceil((retryAt - nowMs) / 1000) });
    throw error;
  }
}

export function recordLoginFailure(scope: Scope, identity: string, nowMs = Date.now()) {
  const key = identityHash(identity);
  const now = new Date(nowMs).toISOString();
  const row = db.prepare(`
    SELECT windowStartedAt, failureCount FROM auth_login_limits WHERE scope = ? AND identityHash = ?
  `).get(scope, key) as { windowStartedAt: string; failureCount: number } | undefined;
  const insideWindow = row && Date.parse(row.windowStartedAt) + WINDOW_MS > nowMs;
  const failures = insideWindow ? row.failureCount + 1 : 1;
  const windowStartedAt = insideWindow ? row.windowStartedAt : now;
  const blockedUntil = failures >= MAX_FAILURES ? new Date(nowMs + BLOCK_MS).toISOString() : null;
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

export function clearLoginFailures(scope: Scope, identity: string) {
  db.prepare('DELETE FROM auth_login_limits WHERE scope = ? AND identityHash = ?').run(scope, identityHash(identity));
}
