import db from '@/lib/db';
import { nowIso, type Learner } from '@/lib/tasks';

export type OfflineTaskReview = {
  clientActionId: string;
  learner: Learner;
  taskDate: string;
  title: string;
  points: number;
  completedAt: string | null;
  reasonCode: string | null;
};

function snapshot(value: string | null) {
  try { return JSON.parse(value ?? '{}') as { title?: string; points?: number }; } catch { return {}; }
}

export function listOfflineTaskReviews(): OfflineTaskReview[] {
  const rows = db.prepare(`SELECT clientActionId, learner, taskDate, snapshotJson, completedAt, reasonCode FROM offline_task_actions WHERE status = 'needs_review' ORDER BY createdAt ASC`).all() as Array<{ clientActionId: string; learner: string; taskDate: string; snapshotJson: string | null; completedAt: string | null; reasonCode: string | null }>;
  return rows.flatMap((row) => {
    if (row.learner !== 'kiur' && row.learner !== 'kirsi') return [];
    const value = snapshot(row.snapshotJson);
    return [{ clientActionId: row.clientActionId, learner: row.learner, taskDate: row.taskDate, title: value.title ?? 'Offline tegevus', points: Math.max(0, Math.trunc(Number(value.points) || 0)), completedAt: row.completedAt, reasonCode: row.reasonCode }];
  });
}

export function resolveOfflineTaskReview(clientActionId: string, action: 'approve' | 'reject') {
  const review = listOfflineTaskReviews().find((item) => item.clientActionId === clientActionId);
  if (!review) throw new Error('Ülevaatust ootavat tegevust ei leitud.');
  const now = nowIso();
  return db.transaction(() => {
    if (action === 'approve' && review.points > 0) {
      db.prepare(`INSERT OR IGNORE INTO point_ledger (learner, amount, source, description, createdAt, metadataJson, effectiveDate, idempotencyKey) VALUES (?, ?, 'offline_task_review', ?, ?, ?, ?, ?)`)
        .run(review.learner, review.points, `Vanem kinnitas offline tegevuse: ${review.title}`, now, JSON.stringify({ clientActionId, taskDate: review.taskDate, approved: true }), review.taskDate, `offline-task-review:${clientActionId}`);
    }
    const state = action === 'approve' ? 'applied' : 'rejected';
    const reasonCode = action === 'approve' ? 'parent_approved' : 'parent_rejected';
    const serverState = { parentDecision: action, pointsAwarded: action === 'approve' ? review.points : 0 };
    db.prepare(`UPDATE offline_task_actions SET status = ?, reasonCode = ?, serverResultJson = ?, processedAt = ? WHERE clientActionId = ? AND status = 'needs_review'`)
      .run(state, reasonCode, JSON.stringify(serverState), now, clientActionId);
    db.prepare(`INSERT INTO server_change_log (stream, entityType, entityId, operation, payloadJson, createdAt) VALUES ('taskChanges', 'task_action', ?, ?, ?, ?)`)
      .run(clientActionId, state, JSON.stringify({ clientActionId, assignmentId: null, learner: review.learner, state, reasonCode, serverState, changedAt: now }), now);
    return serverState;
  })();
}
