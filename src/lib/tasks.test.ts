import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import {
  approveTaskAssignment,
  completeTaskAssignmentAt,
  createTaskTemplate,
  ensureTaskInstancesForDate,
  findAssignmentId,
  getBalance,
  getPendingApprovals
} from '@/lib/tasks';

const OLD_DAY = '2026-10-10';
const TODAY = '2026-10-15';

function reset() {
  db.pragma('foreign_keys = OFF');
  db.exec('DELETE FROM point_ledger; DELETE FROM task_instance_assignments; DELETE FROM task_instances; DELETE FROM task_templates; DELETE FROM offline_task_actions; DELETE FROM daily_task_bonuses; DELETE FROM server_change_log;');
  db.pragma('foreign_keys = ON');
}
beforeEach(reset);

function completeOnOldDay(templateId: number, learner: 'kiur' | 'kirsi') {
  const assignmentId = findAssignmentId(templateId, OLD_DAY, learner)!;
  completeTaskAssignmentAt(assignmentId, learner, `${OLD_DAY}T15:00:00.000Z`, OLD_DAY);
  return assignmentId;
}

describe('pending parent approvals (SRV-02)', () => {
  it('lists approvals from earlier days with their own date, oldest first', () => {
    createTaskTemplate({ title: 'Koristus', points: 4, assignmentMode: 'both_independent', recurrenceType: 'daily', startDate: '2026-10-01', requiresApproval: true });
    const templateId = (db.prepare('SELECT id FROM task_templates').get() as { id: number }).id;
    ensureTaskInstancesForDate(OLD_DAY);
    const oldKiur = completeOnOldDay(templateId, 'kiur');
    ensureTaskInstancesForDate(TODAY);
    const todayKirsi = findAssignmentId(templateId, TODAY, 'kirsi')!;
    completeTaskAssignmentAt(todayKirsi, 'kirsi', `${TODAY}T08:00:00.000Z`, TODAY);

    const pending = getPendingApprovals(TODAY);
    expect(pending.map((item) => ({ id: item.assignmentId, date: item.date }))).toEqual([
      { id: oldKiur, date: OLD_DAY },
      { id: todayKirsi, date: TODAY }
    ]);
  });

  it('approving an old-day item awards its points and settles that day\'s joint bonus', () => {
    createTaskTemplate({ title: 'Koristus', points: 4, assignmentMode: 'both_independent', recurrenceType: 'daily', startDate: '2026-10-01', requiresApproval: true });
    const templateId = (db.prepare('SELECT id FROM task_templates').get() as { id: number }).id;
    ensureTaskInstancesForDate(OLD_DAY);
    const kiur = completeOnOldDay(templateId, 'kiur');
    const kirsi = completeOnOldDay(templateId, 'kirsi');
    // Days pass; the parent only now opens the hub.
    ensureTaskInstancesForDate(TODAY);
    expect(getPendingApprovals(TODAY)).toHaveLength(2);

    approveTaskAssignment(kiur);
    expect(db.prepare('SELECT date FROM daily_task_bonuses').all()).toEqual([]);
    const result = approveTaskAssignment(kirsi);

    expect(result.dailyBonus).toEqual({ awarded: true, amount: 1 });
    expect(db.prepare('SELECT date FROM daily_task_bonuses').all()).toEqual([{ date: OLD_DAY }]);
    expect(getBalance('kiur')).toBe(5);
    expect(getBalance('kirsi')).toBe(5);
    expect(getPendingApprovals(TODAY)).toEqual([]);
  });
});
