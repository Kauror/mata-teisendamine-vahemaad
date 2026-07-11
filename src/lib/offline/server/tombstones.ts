import db from '@/lib/db';
import { nowIso } from '@/lib/tasks';
import { MAX_HISTORY_PULL_PER_SYNC, type AttemptTombstone } from '@/lib/shared/types';

// A deleted attempt leaves a tombstone so offline devices drop the matching
// confirmed cache entry. Deleting history never changes the ledger, and a
// tombstone never reverses a balance or removes an unsynced local attempt.
export function writeTombstone(serverAttemptId: number | null, clientAttemptId: string | null) {
  db.prepare('INSERT INTO attempt_tombstones (serverAttemptId, clientAttemptId, deletedAt) VALUES (?, ?, ?)').run(serverAttemptId, clientAttemptId, nowIso());
}

export function getTombstonesAfter(cursorId: number): AttemptTombstone[] {
  return db.prepare('SELECT tombstoneId, serverAttemptId, clientAttemptId, deletedAt FROM attempt_tombstones WHERE tombstoneId > ? ORDER BY tombstoneId ASC LIMIT ?')
    .all(cursorId, MAX_HISTORY_PULL_PER_SYNC) as AttemptTombstone[];
}

export function getHistoryEpoch(): number {
  const row = db.prepare('SELECT historyEpoch FROM offline_sync_state WHERE id = 1').get() as { historyEpoch: number } | undefined;
  return row?.historyEpoch ?? 0;
}

// Bumped by "delete all history": devices with an older epoch clear their
// confirmed cache and re-bootstrap, while keeping unsynced pending work.
export function bumpHistoryEpoch(): number {
  db.prepare('UPDATE offline_sync_state SET historyEpoch = historyEpoch + 1, updatedAt = ? WHERE id = 1').run(nowIso());
  return getHistoryEpoch();
}
