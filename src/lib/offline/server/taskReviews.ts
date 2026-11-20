import db from '@/lib/db';
import { completeTaskAssignmentAt, findAssignmentId, getAssignmentStatusById, nowIso, type Learner } from '@/lib/tasks';
import { emitTaskChangeForAction } from '@/lib/offline/server/taskChanges';
import { reopenMissedAssignment } from '@/lib/offline/server/taskSync';

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
    return [{ clientActionId: row.clientActionId, learner: row.learner, taskDate: row.taskDate, title: value.title ?? 'Tegevus', points: Math.max(0, Math.trunc(Number(value.points) || 0)), completedAt: row.completedAt, reasonCode: row.reasonCode }];
  });
}

// A late completion (an earlier task day, reason 'late_completion') is settled
// through its own dated assignment once the parent approves it, exactly as an
// on-time completion would have been: first-completer locking and the joint
// daily bonus apply, and a sibling who lost a first-completer task leaves the
// queue. Returns null when there is no assignment to settle.
function settleLateCompletion(clientActionId: string, review: OfflineTaskReview) {
  const row = db.prepare('SELECT templateId, completedAt FROM offline_task_actions WHERE clientActionId = ?').get(clientActionId) as { templateId: number | null; completedAt: string | null } | undefined;
  if (!row || row.templateId == null) return null;
  const assignmentId = findAssignmentId(row.templateId, review.taskDate, review.learner);
  if (!assignmentId) return null;
  const status = getAssignmentStatusById(assignmentId);
  if (status !== 'missed' && status !== 'active') throw new Error('Selle tegevuse on keegi teine juba lõpetanud. Lükka see tagasi.');
  reopenMissedAssignment(assignmentId);
  let result: ReturnType<typeof completeTaskAssignmentAt>;
  try {
    result = completeTaskAssignmentAt(assignmentId, review.learner, row.completedAt ?? nowIso(), review.taskDate);
  } catch {
    throw new Error('Selle tegevuse on keegi teine juba lõpetanud. Lükka see tagasi.');
  }
  // A sibling's late completion of the same first-completer task lost the race:
  // it leaves the review queue as a conflict instead of waiting for a decision.
  const siblings = db.prepare(`SELECT clientActionId, learner FROM offline_task_actions WHERE status = 'needs_review' AND reasonCode = 'late_completion' AND templateId = ? AND taskDate = ? AND clientActionId <> ?`)
    .all(row.templateId, review.taskDate, clientActionId) as Array<{ clientActionId: string; learner: Learner }>;
  for (const sibling of siblings) {
    const siblingAssignment = findAssignmentId(row.templateId, review.taskDate, sibling.learner);
    if (!siblingAssignment || getAssignmentStatusById(siblingAssignment) !== 'locked') continue;
    const changedAt = nowIso();
    db.prepare(`UPDATE offline_task_actions SET status = 'conflict', reasonCode = 'first_completer_taken', processedAt = ? WHERE clientActionId = ?`).run(changedAt, sibling.clientActionId);
    emitTaskChangeForAction({ clientActionId: sibling.clientActionId, assignmentId: siblingAssignment, learner: sibling.learner, state: 'conflict', reasonCode: 'first_completer_taken', changedAt });
  }
  return result;
}

export function resolveOfflineTaskReview(clientActionId: string, action: 'approve' | 'reject') {
  return db.transaction(() => {
    const review = listOfflineTaskReviews().find((item) => item.clientActionId === clientActionId);
    if (!review) throw new Error('Ülevaatust ootavat tegevust ei leitud.');
    const now = nowIso();
    const state = action === 'approve' ? 'applied' : 'rejected';
    const reasonCode = action === 'approve' ? 'parent_approved' : 'parent_rejected';
    let serverState: { parentDecision: 'approve' | 'reject'; pointsAwarded: number } = { parentDecision: action, pointsAwarded: action === 'approve' ? review.points : 0 };
    const updated = db.prepare(`UPDATE offline_task_actions SET status = ?, reasonCode = ?, serverResultJson = ?, processedAt = ? WHERE clientActionId = ? AND status = 'needs_review'`)
      .run(state, reasonCode, JSON.stringify(serverState), now, clientActionId);
    if (updated.changes !== 1) throw new Error('Ülevaatust ootavat tegevust ei leitud.');
    const settled = action === 'approve' && review.reasonCode === 'late_completion' ? settleLateCompletion(clientActionId, review) : null;
    if (settled) {
      // Settling emitted its own 'applied' change and cleared the stored reason;
      // record the parent's decision and the stars actually paid.
      serverState = { parentDecision: action, pointsAwarded: settled.awarded };
      db.prepare('UPDATE offline_task_actions SET status = ?, reasonCode = ?, serverResultJson = ? WHERE clientActionId = ?')
        .run(state, reasonCode, JSON.stringify(serverState), clientActionId);
    } else if (action === 'approve' && review.points > 0) {
      db.prepare(`INSERT INTO point_ledger (learner, amount, source, description, createdAt, metadataJson, effectiveDate, idempotencyKey) VALUES (?, ?, 'real_world_task', ?, ?, ?, ?, ?)`)
        .run(review.learner, review.points, `Võrguühenduseta tegevus: ${review.title}`, now, JSON.stringify({ clientActionId, taskDate: review.taskDate, offlineReview: true, approved: true }), review.taskDate, `offline-task-review:${clientActionId}`);
    }
    emitTaskChangeForAction({ clientActionId, learner: review.learner, state, reasonCode, serverState, changedAt: now });
    return serverState;
  })();
}
