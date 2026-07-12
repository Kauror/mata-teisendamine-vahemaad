import db from '@/lib/db';

// Incremental attempt-update stream (RTM3-H01). The normal history pull is
// ID-cursor based (`WHERE a.id > ?`), so a device that already cached an attempt
// never re-pulls it. But an attempt row can change *after* it was first synced:
//
//   * a parent approves a held attempt — its rewardSettlementStatus flips to
//     'eligible' and its awarded stars appear;
//   * a late attempt triggers reward reprojection that revises an *earlier*
//     attempt's canonical reward (streak/decay recomputed).
//
// Neither mints a new attempt id, so without a dedicated stream the cached
// history on other devices stays stale (wrong stars, wrong review resolution).
//
// We reuse the existing server_change_log table with a 'attemptChanges' stream
// carrying the affected serverAttemptId. On pull the server re-materialises the
// canonical attempt rows referenced after the device's cursor and re-delivers
// them through the normal `attempts` array, so the client's existing
// put-canonical-by-id path overwrites the stale record.

export const MAX_ATTEMPT_CHANGES_PER_SYNC = 300;

// Emit an update notice for an attempt whose settlement status or reward
// components changed. Runs inside the caller's transaction so the change is
// atomic with the mutation. Safe to call repeatedly; each call is one log row
// and the pull dedupes by attempt id.
export function emitAttemptChange(attemptId: number, reasonCode?: string): void {
  const exists = db.prepare('SELECT 1 FROM attempts WHERE id = ? AND protocolVersion = 2').get(attemptId);
  if (!exists) return;
  db.prepare(`
    INSERT INTO server_change_log (stream, entityType, entityId, operation, payloadJson, createdAt)
    VALUES ('attemptChanges', 'attempt', ?, 'update', ?, ?)
  `).run(String(attemptId), JSON.stringify({ attemptId, reasonCode: reasonCode ?? null }), new Date().toISOString());
}

export type AttemptChangeCursor = { attemptIds: number[]; lastChangeId: number };

// Distinct attempt ids changed after the cursor, plus the advanced cursor. Ids
// are returned oldest-change-first and de-duplicated; the caller loads their
// canonical rows and folds them into the pulled attempts.
export function getChangedAttemptIdsAfter(cursorId: number, limit = MAX_ATTEMPT_CHANGES_PER_SYNC): AttemptChangeCursor {
  const rows = db.prepare(`
    SELECT changeId, entityId FROM server_change_log
    WHERE stream = 'attemptChanges' AND changeId > ?
    ORDER BY changeId ASC
    LIMIT ?
  `).all(cursorId, limit) as Array<{ changeId: number; entityId: string }>;
  const seen = new Set<number>();
  const attemptIds: number[] = [];
  let lastChangeId = cursorId;
  for (const row of rows) {
    lastChangeId = row.changeId;
    const attemptId = Number(row.entityId);
    if (!Number.isInteger(attemptId) || seen.has(attemptId)) continue;
    seen.add(attemptId);
    attemptIds.push(attemptId);
  }
  return { attemptIds, lastChangeId };
}
