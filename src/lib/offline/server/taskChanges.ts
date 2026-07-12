import db from '@/lib/db';
import type { CanonicalTaskState, Learner, TaskActionChange } from '@/lib/shared/types';

// Canonical task-change stream (RTM-005). When a task's server-side state changes
// after a child completed it offline — parent approval, parent rejection, or a
// first-completer lock — we append a change to server_change_log keyed by the
// original clientActionId. Offline devices replay these on their next pull and
// correct the queued action's status, so a rejected/returned/locked task never
// stays shown as completed on the device.

export const MAX_TASK_CHANGES_PER_SYNC = 300;

type AssignmentIdentity = { templateId: number; date: string; learner: Learner };

function assignmentIdentity(assignmentId: number): AssignmentIdentity | null {
  const row = db.prepare(`
    SELECT ti.templateId AS templateId, ti.date AS date, a.learner AS learner
    FROM task_instance_assignments a
    JOIN task_instances ti ON ti.id = a.taskInstanceId
    WHERE a.id = ?
  `).get(assignmentId) as { templateId: number; date: string; learner: string } | undefined;
  if (!row || (row.learner !== 'kiur' && row.learner !== 'kirsi')) return null;
  return { templateId: row.templateId, date: row.date, learner: row.learner };
}

// Emit a change for every offline task action that settled this assignment. Runs
// inside the caller's transaction so the change is atomic with the mutation.
export function emitTaskChangeForAssignment(
  assignmentId: number,
  state: CanonicalTaskState,
  options: { reasonCode?: string; serverState?: unknown } = {}
): void {
  const identity = assignmentIdentity(assignmentId);
  if (!identity) return;
  const actions = db.prepare(`
    SELECT clientActionId FROM offline_task_actions
    WHERE templateId = ? AND taskDate = ? AND learner = ? AND actionType = 'complete'
  `).all(identity.templateId, identity.date, identity.learner) as Array<{ clientActionId: string }>;
  if (actions.length === 0) return;

  const now = new Date().toISOString();
  const updateAction = db.prepare(`
    UPDATE offline_task_actions SET status = ?, reasonCode = ?, processedAt = ? WHERE clientActionId = ?
  `);
  const insertChange = db.prepare(`
    INSERT INTO server_change_log (stream, entityType, entityId, operation, payloadJson, createdAt)
    VALUES ('taskChanges', 'task_action', ?, ?, ?, ?)
  `);
  for (const action of actions) {
    // Keep the stored action status consistent so idempotent retries of the
    // original push observe the settled outcome, not the stale one.
    updateAction.run(state, options.reasonCode ?? null, now, action.clientActionId);
    const payload = {
      clientActionId: action.clientActionId,
      assignmentId,
      learner: identity.learner,
      state,
      reasonCode: options.reasonCode,
      serverState: options.serverState,
      changedAt: now
    };
    insertChange.run(action.clientActionId, state, JSON.stringify(payload), now);
  }
}

export function getTaskChangesAfter(cursorId: number, limit = MAX_TASK_CHANGES_PER_SYNC): TaskActionChange[] {
  const rows = db.prepare(`
    SELECT changeId, payloadJson FROM server_change_log
    WHERE stream = 'taskChanges' AND changeId > ?
    ORDER BY changeId ASC
    LIMIT ?
  `).all(cursorId, limit) as Array<{ changeId: number; payloadJson: string }>;
  return rows.map((row) => {
    const payload = JSON.parse(row.payloadJson) as Omit<TaskActionChange, 'changeId'>;
    return { ...payload, changeId: row.changeId };
  });
}
