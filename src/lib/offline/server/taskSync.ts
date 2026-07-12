import { createHash } from 'node:crypto';
import db from '@/lib/db';
import {
  completeTaskAssignmentAt,
  ensureTaskInstancesForDate,
  findAssignmentId,
  getActiveTaskTemplates,
  getAssignmentStatusById,
  getTaskTemplateById,
  nowIso,
  todayDateString,
  type Learner,
  type TaskTemplateRow
} from '@/lib/tasks';
import type { SyncTaskTemplate, TaskAssignmentMode, TaskRecurrenceType } from '@/lib/shared/taskProjection';
import type { OfflineTaskActionPayload, TaskActionResult, TaskActionStatus } from '@/lib/shared/types';

// Content hash of the fields a child actually sees / that change the promised
// reward. The device stores this per template and echoes it back on completion,
// so the server can tell whether the template changed while the device was offline.
export function taskTemplateVersion(template: TaskTemplateRow): string {
  const canonical = JSON.stringify({
    title: template.title,
    points: template.points,
    assignmentMode: template.assignmentMode,
    recurrenceType: template.recurrenceType,
    selectedWeekdaysJson: template.selectedWeekdaysJson,
    startDate: template.startDate,
    onceDate: template.onceDate,
    requiresApproval: template.requiresApproval
  });
  return createHash('sha256').update(canonical).digest('hex').slice(0, 16);
}

export type SyncTaskAssignment = {
  assignmentId: number;
  learner: Learner;
  taskDate: string;
  templateId: number;
  state: string;
  updatedAt: string;
};

// Canonical dated task assignments for the given date, so an offline device can
// overlay authoritative status (completed/locked/pending_approval/missed) over
// its template projection and never re-show an already-settled task as active
// (RTM2-H04). Materialises the day's instances first, exactly like the parent
// and child read paths.
export function getSyncTaskAssignments(date = todayDateString()): SyncTaskAssignment[] {
  ensureTaskInstancesForDate(date);
  return db.prepare(`
    SELECT a.id AS assignmentId, a.learner AS learner, i.date AS taskDate,
           i.templateId AS templateId, a.status AS state,
           COALESCE(a.completedAt, i.createdAt) AS updatedAt
    FROM task_instance_assignments a
    JOIN task_instances i ON i.id = a.taskInstanceId
    WHERE i.date = ?
  `).all(date) as SyncTaskAssignment[];
}

export function getSyncTaskTemplates(): SyncTaskTemplate[] {
  return getActiveTaskTemplates().map((template) => ({
    id: template.id,
    title: template.title,
    points: template.points,
    assignmentMode: template.assignmentMode as TaskAssignmentMode,
    recurrenceType: template.recurrenceType as TaskRecurrenceType,
    selectedWeekdaysJson: template.selectedWeekdaysJson,
    startDate: template.startDate,
    onceDate: template.onceDate,
    requiresApproval: Boolean(template.requiresApproval),
    version: taskTemplateVersion(template)
  }));
}

function isDateString(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function persist(action: OfflineTaskActionPayload, status: TaskActionStatus, reasonCode: string | undefined, serverState: unknown) {
  db.prepare(`
    INSERT OR REPLACE INTO offline_task_actions
      (clientActionId, deviceId, learner, actionType, templateId, templateVersion, taskDate, snapshotJson, completedAt, status, reasonCode, serverResultJson, createdAt, processedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    action.clientActionId,
    action.deviceId ?? null,
    action.learner,
    action.actionType,
    action.templateId ?? null,
    action.templateVersion ?? null,
    action.taskDate,
    action.snapshot ? JSON.stringify(action.snapshot) : null,
    action.completedAt ?? null,
    status,
    reasonCode ?? null,
    serverState ? JSON.stringify(serverState) : null,
    nowIso(),
    nowIso()
  );
}

function process(action: OfflineTaskActionPayload, learner: Learner): { status: TaskActionStatus; reasonCode?: string; serverState?: unknown; message?: string } {
  const template = action.templateId != null ? getTaskTemplateById(action.templateId) : undefined;
  if (!template) return { status: 'needs_review', reasonCode: 'template_removed' };
  if (template.deletedAt) return { status: 'needs_review', reasonCode: 'template_deleted' };
  // The template must be the exact version the child completed against; otherwise
  // the promised reward may have changed → route to parent review, never silently
  // apply the new reward.
  if (taskTemplateVersion(template) !== action.templateVersion) return { status: 'needs_review', reasonCode: 'template_changed' };

  ensureTaskInstancesForDate(action.taskDate);
  const assignmentId = findAssignmentId(action.templateId!, action.taskDate, learner);
  if (!assignmentId) return { status: 'needs_review', reasonCode: 'no_assignment' };

  const status = getAssignmentStatusById(assignmentId);
  if (status === 'completed') return { status: 'duplicate' };
  if (status === 'locked') return { status: 'conflict', reasonCode: 'first_completer_taken' };
  if (status === 'pending_approval') return { status: 'pending_approval' };
  if (status !== 'active') return { status: 'conflict', reasonCode: 'not_active' };

  // Clamp an impossible future completion time to now, keeping the task date.
  const completedAt = action.completedAt && new Date(action.completedAt).getTime() <= Date.now() ? action.completedAt : nowIso();
  try {
    const result = completeTaskAssignmentAt(assignmentId, learner, completedAt, action.taskDate);
    return { status: result.pending ? 'pending_approval' : 'applied', serverState: result };
  } catch (error) {
    // The only expected throw is the first-completer race.
    return { status: 'conflict', reasonCode: 'first_completer_taken', message: error instanceof Error ? error.message : undefined };
  }
}

// Idempotent per clientActionId: a retry returns the original stored outcome.
export function applyOfflineTaskAction(action: OfflineTaskActionPayload): TaskActionResult {
  const existing = db.prepare('SELECT status, reasonCode, serverResultJson FROM offline_task_actions WHERE clientActionId = ?').get(action.clientActionId) as { status: TaskActionStatus; reasonCode: string | null; serverResultJson: string | null } | undefined;
  if (existing) {
    return { clientActionId: action.clientActionId, status: existing.status, reasonCode: existing.reasonCode ?? undefined, serverState: existing.serverResultJson ? JSON.parse(existing.serverResultJson) : undefined };
  }

  if (action.learner !== 'kiur' && action.learner !== 'kirsi') {
    persist(action, 'rejected', 'bad_learner', undefined);
    return { clientActionId: action.clientActionId, status: 'rejected', reasonCode: 'bad_learner' };
  }
  if (action.actionType !== 'complete' || !isDateString(action.taskDate) || action.templateId == null) {
    persist(action, 'rejected', 'bad_payload', undefined);
    return { clientActionId: action.clientActionId, status: 'rejected', reasonCode: 'bad_payload' };
  }

  const outcome = process(action, action.learner);
  persist(action, outcome.status, outcome.reasonCode, outcome.serverState);
  return { clientActionId: action.clientActionId, status: outcome.status, reasonCode: outcome.reasonCode, message: outcome.message, serverState: outcome.serverState };
}
