import db from '@/lib/db';
import { nowIso, type Learner } from '@/lib/tasks';
import { emitTaskChangeForAction } from '@/lib/offline/server/taskChanges';

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
  return db.transaction(() => {
    const review = listOfflineTaskReviews().find((item) => item.clientActionId === clientActionId);
    if (!review) throw new Error('Ülevaatust ootavat tegevust ei leitud.');
    const now = nowIso();
    const state = action === 'approve' ? 'applied' : 'rejected';
    const reasonCode = action === 'approve' ? 'parent_approved' : 'parent_rejected';
    const serverState = { parentDecision: action, pointsAwarded: action === 'approve' ? review.points : 0 };
    const updated = db.prepare(`UPDATE offline_task_actions SET status = ?, reasonCode = ?, serverResultJson = ?, processedAt = ? WHERE clientActionId = ? AND status = 'needs_review'`)
      .run(state, reasonCode, JSON.stringify(serverState), now, clientActionId);
    if (updated.changes !== 1) throw new Error('Ülevaatust ootavat tegevust ei leitud.');
    if (action === 'approve' && review.points > 0) {
      db.prepare(`INSERT INTO point_ledger (learner, amount, source, description, createdAt, metadataJson, effectiveDate, idempotencyKey) VALUES (?, ?, 'real_world_task', ?, ?, ?, ?, ?)`)
        .run(review.learner, review.points, `Offline tegevus: ${review.title}`, now, JSON.stringify({ clientActionId, taskDate: review.taskDate, offlineReview: true, approved: true }), review.taskDate, `offline-task-review:${clientActionId}`);
    }
    emitTaskChangeForAction({ clientActionId, learner: review.learner, state, reasonCode, serverState, changedAt: now });
    return serverState;
  })();
}
