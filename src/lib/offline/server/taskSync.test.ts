import { describe, it, expect, beforeEach } from 'vitest';
import db from '@/lib/db';
import { createTaskTemplate, getBalance, todayDateString, updateTaskTemplate } from '@/lib/tasks';
import { applyOfflineTaskAction, getSyncTaskTemplates } from '@/lib/offline/server/taskSync';
import { projectTasksForDate, type SyncTaskTemplate, type TaskAssignmentMode } from '@/lib/shared/taskProjection';
import type { OfflineTaskActionPayload } from '@/lib/shared/types';

function reset() {
  db.pragma('foreign_keys = OFF');
  db.exec('DELETE FROM point_ledger; DELETE FROM task_instance_assignments; DELETE FROM task_instances; DELETE FROM task_templates; DELETE FROM offline_task_actions; DELETE FROM daily_task_bonuses;');
  db.pragma('foreign_keys = ON');
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
