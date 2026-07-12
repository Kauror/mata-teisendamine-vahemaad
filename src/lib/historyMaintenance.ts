import db from '@/lib/db';
import { bumpHistoryEpoch, writeTombstone } from '@/lib/offline/server/tombstones';

// Rewarded protocol-v2 attempts are accounting events. Deleting their source row
// invalidates reward projections and foreign-key references, so history deletion
// is deliberately a visibility operation, not physical erasure.
function hideAttemptTransaction() {
  return db.transaction((attemptId: number): number => {
    const row = db.prepare('SELECT clientAttemptId, deletedAt FROM attempts WHERE id = ?').get(attemptId) as { clientAttemptId: string | null; deletedAt: string | null } | undefined;
    if (!row || row.deletedAt) return 0;
    const now = new Date().toISOString();
    db.prepare('UPDATE attempts SET deletedAt = ?, deletedReason = ? WHERE id = ?').run(now, 'user_history_hide', attemptId);
    writeTombstone(attemptId, row.clientAttemptId ?? null);
    return 1;
  });
}

export function deleteAttempt(attemptId: number): number {
  return hideAttemptTransaction()(attemptId);
}

function hideAllHistoryTransaction() {
  return db.transaction(() => {
    const rows = db.prepare('SELECT id, clientAttemptId FROM attempts WHERE deletedAt IS NULL').all() as Array<{ id: number; clientAttemptId: string | null }>;
    const now = new Date().toISOString();
    const update = db.prepare('UPDATE attempts SET deletedAt = ?, deletedReason = ? WHERE id = ?');
    for (const row of rows) {
      update.run(now, 'user_history_hide_all', row.id);
      writeTombstone(row.id, row.clientAttemptId);
    }
    bumpHistoryEpoch();
  });
}

export function deleteAllHistory() {
  hideAllHistoryTransaction()();
}
