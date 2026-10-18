import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import db from '@/lib/db';
import { approveTaskAssignment, createTaskTemplate, ensureTaskInstancesForDate, findAssignmentId, getAssignmentStatusById, getBalance, invalidateTaskInstancePreparation, rejectTaskAssignment, todayDateString, updateTaskTemplate } from '@/lib/tasks';
import { applyOfflineTaskAction, getSyncTaskAssignments, getSyncTaskTemplates } from '@/lib/offline/server/taskSync';
import { getTaskChangesAfter } from '@/lib/offline/server/taskChanges';
import { listOfflineTaskReviews, resolveOfflineTaskReview } from '@/lib/offline/server/taskReviews';
import { projectTasksForDate, type SyncTaskTemplate, type TaskAssignmentMode } from '@/lib/shared/taskProjection';
import type { OfflineTaskActionPayload } from '@/lib/shared/types';

function reset() {
  db.pragma('foreign_keys = OFF');
  db.exec('DELETE FROM point_ledger; DELETE FROM task_instance_assignments; DELETE FROM task_instances; DELETE FROM task_templates; DELETE FROM offline_task_actions; DELETE FROM daily_task_bonuses; DELETE FROM server_change_log;');
  db.pragma('foreign_keys = ON');
  // The tables were wiped behind the module's back; forget the prepared day.
  invalidateTaskInstancePreparation();
}
beforeEach(reset);

function makeTemplate(mode: TaskAssignmentMode, requiresApproval = false) {
  createTaskTemplate({ title: 'Koru tuba', points: 5, assignmentMode: mode, recurrenceType: 'daily', requiresApproval });
  const template = getSyncTaskTemplates()[0];
  return template;
}

function action(overrides: Partial<OfflineTaskActionPayload> & { templateId: number; templateVersion: string; learner: 'kiur' | 'kirsi'; clientActionId: string }): OfflineTaskActionPayload {
  return {
    deviceId: 'device-1',
    actionType: 'complete',
    taskDate: todayDateString(),
    snapshot: { title: 'Koru tuba', points: 5, assignmentMode: 'both_independent', requiresApproval: false },
    completedAt: new Date().toISOString(),
    ...overrides
  };
}

describe('projectTasksForDate', () => {
  const daily: SyncTaskTemplate = { id: 1, title: 'Iga päev', points: 5, assignmentMode: 'both_independent', recurrenceType: 'daily', selectedWeekdaysJson: null, startDate: null, onceDate: null, requiresApproval: false, version: 'v1' };
  const weekend: SyncTaskTemplate = { id: 2, title: 'Nädalavahetus', points: 5, assignmentMode: 'kiur', recurrenceType: 'weekends', selectedWeekdaysJson: null, startDate: null, onceDate: null, requiresApproval: false, version: 'v2' };

  it('projects a daily task on any date for both children', () => {
    expect(projectTasksForDate([daily], 'kiur', '2026-07-13').map((t) => t.templateId)).toEqual([1]);
    expect(projectTasksForDate([daily], 'kirsi', '2026-07-14').map((t) => t.templateId)).toEqual([1]);
  });

  it('projects a weekend task only on weekends and only for its learner', () => {
    expect(projectTasksForDate([weekend], 'kiur', '2026-07-13')).toHaveLength(0); // Monday
    expect(projectTasksForDate([weekend], 'kiur', '2026-07-11')).toHaveLength(1); // Saturday
    expect(projectTasksForDate([weekend], 'kirsi', '2026-07-11')).toHaveLength(0); // not kirsi's
  });
});

describe('applyOfflineTaskAction', () => {
  it('applies once and is idempotent on retry (no double award)', () => {
    const template = makeTemplate('both_independent');
    const payload = action({ templateId: template.id, templateVersion: template.version, learner: 'kiur', clientActionId: 'act-1' });

    const first = applyOfflineTaskAction(payload);
    expect(first.status).toBe('applied');
    const balanceAfter = getBalance('kiur');
    expect(balanceAfter).toBe(5);

    // Retrying the same clientActionId returns the original outcome (idempotent)
    // and must not award again.
    const retry = applyOfflineTaskAction(payload);
    expect(retry.status).toBe('applied');
    expect(getBalance('kiur')).toBe(balanceAfter);
  });

  it('gives a first_completer to only one child; the second gets a conflict', () => {
    const template = makeTemplate('first_completer');
    const kiur = applyOfflineTaskAction(action({ templateId: template.id, templateVersion: template.version, learner: 'kiur', clientActionId: 'fc-kiur' }));
    const kirsi = applyOfflineTaskAction(action({ templateId: template.id, templateVersion: template.version, learner: 'kirsi', clientActionId: 'fc-kirsi' }));
    expect(kiur.status).toBe('applied');
    expect(kirsi.status).toBe('conflict');
    expect(kirsi.reasonCode).toBe('first_completer_taken');
    expect(getBalance('kiur')).toBe(5);
    expect(getBalance('kirsi')).toBe(0);
  });

  it('routes a completion for a changed template to review without awarding', () => {
    const template = makeTemplate('both_independent');
    const staleVersion = template.version;
    // Parent edits the template (points change) → new version.
    updateTaskTemplate(template.id, { title: 'Koru tuba', points: 9, assignmentMode: 'both_independent', recurrenceType: 'daily', requiresApproval: false });

    const result = applyOfflineTaskAction(action({ templateId: template.id, templateVersion: staleVersion, learner: 'kiur', clientActionId: 'stale-1' }));
    expect(result.status).toBe('needs_review');
    expect(result.reasonCode).toBe('template_changed');
    expect(getBalance('kiur')).toBe(0);
  });

  it('holds an approval-required task as pending_approval without awarding', () => {
    const template = makeTemplate('kiur', true);
    const result = applyOfflineTaskAction(action({ templateId: template.id, templateVersion: template.version, learner: 'kiur', clientActionId: 'appr-1' }));
    expect(result.status).toBe('pending_approval');
    expect(getBalance('kiur')).toBe(0);
  });
});

// RTM-005: server-side task changes must propagate parent decisions back to the
// device's queued action via the canonical change stream (keyed by clientActionId).
describe('task-change stream', () => {
  function queuePendingApproval(clientActionId: string) {
    const template = makeTemplate('kiur', true);
    const result = applyOfflineTaskAction(action({ templateId: template.id, templateVersion: template.version, learner: 'kiur', clientActionId }));
    expect(result.status).toBe('pending_approval');
    const assignmentId = findAssignmentId(template.id, todayDateString(), 'kiur');
    expect(assignmentId).not.toBeNull();
    return assignmentId as number;
  }

  it('emits an "applied" change when a parent approves an offline completion', () => {
    const assignmentId = queuePendingApproval('appr-stream');
    approveTaskAssignment(assignmentId);

    const changes = getTaskChangesAfter(0);
    expect(changes).toHaveLength(1);
    expect(changes[0]).toMatchObject({ clientActionId: 'appr-stream', state: 'applied' });
    expect(getBalance('kiur')).toBe(5);
  });

  it('emits a "returned" change when a parent rejects an offline completion', () => {
    const assignmentId = queuePendingApproval('reject-stream');
    rejectTaskAssignment(assignmentId);

    const changes = getTaskChangesAfter(0);
    expect(changes).toHaveLength(1);
    expect(changes[0]).toMatchObject({ clientActionId: 'reject-stream', state: 'returned', reasonCode: 'parent_rejected' });
    expect(getBalance('kiur')).toBe(0);
    // The stored action status is corrected too, so it no longer reads as done.
    const stored = db.prepare("SELECT status FROM offline_task_actions WHERE clientActionId = 'reject-stream'").get() as { status: string };
    expect(stored.status).toBe('returned');
  });

  it('paginates by change id so a device only sees new changes', () => {
    const assignmentId = queuePendingApproval('cursor-stream');
    approveTaskAssignment(assignmentId);
    const [change] = getTaskChangesAfter(0);
    expect(getTaskChangesAfter(change.changeId)).toEqual([]);
  });
});

describe('offline task review resolution', () => {
  function queueChangedTask(clientActionId: string) {
    const template = makeTemplate('both_independent');
    const staleVersion = template.version;
    updateTaskTemplate(template.id, { title: 'Koru tuba', points: 9, assignmentMode: 'both_independent', recurrenceType: 'daily', requiresApproval: false });
    const result = applyOfflineTaskAction(action({ templateId: template.id, templateVersion: staleVersion, learner: 'kiur', clientActionId }));
    expect(result.status).toBe('needs_review');
  }

  it('approves the original snapshot once and publishes the decision', () => {
    queueChangedTask('review-approve');
    expect(listOfflineTaskReviews()).toMatchObject([{ clientActionId: 'review-approve', points: 5 }]);

    expect(resolveOfflineTaskReview('review-approve', 'approve')).toEqual({ parentDecision: 'approve', pointsAwarded: 5 });
    expect(getBalance('kiur')).toBe(5);
    expect(getTaskChangesAfter(0)).toMatchObject([{ clientActionId: 'review-approve', state: 'applied', reasonCode: 'parent_approved' }]);
    const ledger = db.prepare("SELECT source, amount FROM point_ledger WHERE idempotencyKey = 'offline-task-review:review-approve'").get() as { source: string; amount: number };
    expect(ledger).toEqual({ source: 'real_world_task', amount: 5 });
    expect(() => resolveOfflineTaskReview('review-approve', 'approve')).toThrow('Ülevaatust ootavat tegevust ei leitud.');
    expect(getBalance('kiur')).toBe(5);
    expect(getTaskChangesAfter(0)).toHaveLength(1);
  });

  it('rejects without awarding and publishes the decision', () => {
    queueChangedTask('review-reject');
    expect(resolveOfflineTaskReview('review-reject', 'reject')).toEqual({ parentDecision: 'reject', pointsAwarded: 0 });
    expect(getBalance('kiur')).toBe(0);
    expect(getTaskChangesAfter(0)).toMatchObject([{ clientActionId: 'review-reject', state: 'rejected', reasonCode: 'parent_rejected' }]);
  });
});

// RTM2-H04: the pull must expose canonical dated assignment status so an offline
// device does not re-show an already-settled task as active.
describe('getSyncTaskAssignments', () => {
  it('returns the canonical status of today\'s assignments', () => {
    const template = makeTemplate('both_independent');
    // Complete kiur's assignment online; kirsi's stays active.
    const result = applyOfflineTaskAction(action({ templateId: template.id, templateVersion: template.version, learner: 'kiur', clientActionId: 'assign-1' }));
    expect(result.status).toBe('applied');

    const assignments = getSyncTaskAssignments(todayDateString());
    const kiur = assignments.find((a) => a.learner === 'kiur' && a.templateId === template.id);
    const kirsi = assignments.find((a) => a.learner === 'kirsi' && a.templateId === template.id);
    expect(kiur?.state).toBe('completed');
    expect(kirsi?.state).toBe('active');
  });
});

// A task ticked offline in the evening reaches the server the next morning,
// after the new day's first read has closed the old day as 'missed'.
describe('late offline task completions', () => {
  const EVENING = '2026-10-16T18:30:00.000Z'; // 21:30 in Tallinn, 16 October
  const NEXT_MORNING = '2026-10-17T05:00:00.000Z'; // 08:00 in Tallinn, 17 October

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(EVENING));
  });
  afterEach(() => vi.useRealTimers());

  function dailyTemplate(mode: TaskAssignmentMode, requiresApproval = false) {
    createTaskTemplate({ title: 'Koru tuba', points: 5, assignmentMode: mode, recurrenceType: 'daily', startDate: '2026-10-01', requiresApproval });
    return getSyncTaskTemplates()[0];
  }

  function lateAction(template: SyncTaskTemplate, learner: 'kiur' | 'kirsi', clientActionId: string, completedAt = EVENING) {
    return action({ templateId: template.id, templateVersion: template.version, learner, clientActionId, taskDate: '2026-10-16', completedAt });
  }

  function rollOverToNextMorning() {
    vi.setSystemTime(new Date(NEXT_MORNING));
    ensureTaskInstancesForDate(todayDateString());
  }

  it('settles yesterday\'s completion against yesterday instead of refusing it', () => {
    const template = dailyTemplate('kiur');
    ensureTaskInstancesForDate('2026-10-16');
    rollOverToNextMorning();

    const result = applyOfflineTaskAction(lateAction(template, 'kiur', 'late-1'));
    expect(result.status).toBe('applied');
    expect(getBalance('kiur')).toBe(5);
    expect(getAssignmentStatusById(findAssignmentId(template.id, '2026-10-16', 'kiur')!)).toBe('completed');
    // A retry is still idempotent.
    expect(applyOfflineTaskAction(lateAction(template, 'kiur', 'late-1')).status).toBe('applied');
    expect(getBalance('kiur')).toBe(5);
  });

  it('settles both children of a shared task when both arrive late', () => {
    const template = dailyTemplate('both_independent');
    ensureTaskInstancesForDate('2026-10-16');
    rollOverToNextMorning();

    expect(applyOfflineTaskAction(lateAction(template, 'kiur', 'late-kiur')).status).toBe('applied');
    expect(applyOfflineTaskAction(lateAction(template, 'kirsi', 'late-kirsi')).status).toBe('applied');
    // 5 each, plus that day's joint bonus now that both finished everything.
    expect(getBalance('kiur')).toBe(6);
    expect(getBalance('kirsi')).toBe(6);
    expect(db.prepare('SELECT date FROM daily_task_bonuses').all()).toEqual([{ date: '2026-10-16' }]);
  });

  it('keeps a first-completer task for the child who settled it first', () => {
    const template = dailyTemplate('first_completer');
    ensureTaskInstancesForDate('2026-10-16');
    rollOverToNextMorning();

    expect(applyOfflineTaskAction(lateAction(template, 'kiur', 'fc-kiur')).status).toBe('applied');
    const second = applyOfflineTaskAction(lateAction(template, 'kirsi', 'fc-kirsi'));
    expect(second.status).toBe('conflict');
    expect(getBalance('kirsi')).toBe(0);
    expect(getAssignmentStatusById(findAssignmentId(template.id, '2026-10-16', 'kirsi')!)).toBe('missed');
  });

  it('still refuses a past-day completion that was not made on that day', () => {
    const template = dailyTemplate('kiur');
    ensureTaskInstancesForDate('2026-10-16');
    rollOverToNextMorning();

    const result = applyOfflineTaskAction(lateAction(template, 'kiur', 'late-wrong-day', NEXT_MORNING));
    expect(result).toMatchObject({ status: 'conflict', reasonCode: 'not_active' });
    expect(getBalance('kiur')).toBe(0);
  });

  it('holds a late approval-required completion for the parent', () => {
    const template = dailyTemplate('kiur', true);
    ensureTaskInstancesForDate('2026-10-16');
    rollOverToNextMorning();

    expect(applyOfflineTaskAction(lateAction(template, 'kiur', 'late-approval')).status).toBe('pending_approval');
    expect(getBalance('kiur')).toBe(0);
    approveTaskAssignment(findAssignmentId(template.id, '2026-10-16', 'kiur')!);
    expect(getBalance('kiur')).toBe(5);
  });
});
