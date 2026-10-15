import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import db from '@/lib/db';
import {
  approveTaskAssignment,
  completeTaskAssignmentAt,
  createTaskTemplate,
  deleteTaskTemplate,
  ensureTaskInstancesForDate,
  findAssignmentId,
  getBalance,
  getChildDashboard,
  getPendingApprovals,
  invalidateTaskInstancePreparation,
  rejectTaskAssignment,
  updateTaskTemplate
} from '@/lib/tasks';

const OLD_DAY = '2026-10-10';
const TODAY = '2026-10-15';

function reset() {
  db.pragma('foreign_keys = OFF');
  db.exec('DELETE FROM point_ledger; DELETE FROM task_instance_assignments; DELETE FROM task_instances; DELETE FROM task_templates; DELETE FROM offline_task_actions; DELETE FROM daily_task_bonuses; DELETE FROM server_change_log;');
  db.pragma('foreign_keys = ON');
  // The tables were wiped behind the module's back; forget the prepared day.
  invalidateTaskInstancePreparation();
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

// SRV-10: a day that has been prepared is not prepared again on every read —
// but every write that changes what preparing would do must undo that.
describe('prepared-day memo for ensureTaskInstancesForDate (SRV-10)', () => {
  const template = { title: 'Koristus', points: 4, assignmentMode: 'both_independent' as const, recurrenceType: 'daily' as const, startDate: '2026-10-01' };
  // Template writes prepare the wall-clock today; pin it to TODAY so they
  // prepare the same day the assertions read.
  beforeAll(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(`${TODAY}T09:00:00.000Z`));
  });
  afterAll(() => {
    vi.useRealTimers();
  });

  function idOf(title: string) {
    return (db.prepare('SELECT id FROM task_templates WHERE title = ? AND deletedAt IS NULL').get(title) as { id: number }).id;
  }

  // Probe: re-open OLD_DAY's instances behind the module's back. A preparation
  // that really runs closes them as missed again; a skipped one leaves them.
  function reopenOldDay() {
    db.prepare("UPDATE task_instances SET status = 'active' WHERE date = ?").run(OLD_DAY);
  }
  function preparationRan() {
    const row = db.prepare("SELECT COUNT(*) AS n FROM task_instances WHERE date = ? AND status = 'active'").get(OLD_DAY) as { n: number };
    return row.n === 0;
  }
  function prepareBothDays() {
    createTaskTemplate(template);
    ensureTaskInstancesForDate(OLD_DAY);
    ensureTaskInstancesForDate(TODAY);
  }

  it('skips the writes on a repeat read of the same day', () => {
    prepareBothDays();
    reopenOldDay();
    ensureTaskInstancesForDate(TODAY);
    getChildDashboard('kiur', TODAY);
    getPendingApprovals(TODAY);
    expect(preparationRan()).toBe(false);
  });

  it('re-runs when the date changes, including back to a day prepared earlier', () => {
    prepareBothDays();
    ensureTaskInstancesForDate('2026-10-12');
    reopenOldDay();
    ensureTaskInstancesForDate(TODAY);
    expect(preparationRan()).toBe(true);
  });

  it('a new template shows up on an already prepared day', () => {
    createTaskTemplate(template);
    expect(getChildDashboard('kiur', TODAY).tasks.map((task) => task.title)).toEqual(['Koristus']);
    createTaskTemplate({ ...template, title: 'Prügi välja' });
    expect(getChildDashboard('kiur', TODAY).tasks.map((task) => task.title).sort()).toEqual(['Koristus', 'Prügi välja']);
  });

  it('an edited template re-materialises the untouched instance for today', () => {
    createTaskTemplate(template);
    expect(getChildDashboard('kiur', TODAY).tasks[0]).toMatchObject({ title: 'Koristus', points: 4 });
    updateTaskTemplate(idOf('Koristus'), { ...template, title: 'Koristus ja tolm', points: 6 });
    expect(getChildDashboard('kiur', TODAY).tasks[0]).toMatchObject({ title: 'Koristus ja tolm', points: 6 });
  });

  it('creating, editing or deleting a template forgets the prepared day', () => {
    prepareBothDays();
    for (const write of [
      () => createTaskTemplate({ ...template, title: 'Prügi välja' }),
      () => updateTaskTemplate(idOf('Prügi välja'), { ...template, title: 'Prügi välja', points: 2 }),
      () => deleteTaskTemplate(idOf('Prügi välja'))
    ]) {
      ensureTaskInstancesForDate(TODAY);
      reopenOldDay();
      write();
      ensureTaskInstancesForDate(TODAY);
      expect(preparationRan()).toBe(true);
    }
  });

  it('a rejected old-day completion is closed as missed by the next read, as before', () => {
    createTaskTemplate({ ...template, requiresApproval: true });
    const templateId = idOf('Koristus');
    ensureTaskInstancesForDate(OLD_DAY);
    const assignmentId = completeOnOldDay(templateId, 'kiur');
    ensureTaskInstancesForDate(TODAY);
    rejectTaskAssignment(assignmentId);
    expect(db.prepare('SELECT status FROM task_instance_assignments WHERE id = ?').get(assignmentId)).toEqual({ status: 'active' });

    getChildDashboard('kiur', TODAY);
    expect(db.prepare('SELECT status FROM task_instance_assignments WHERE id = ?').get(assignmentId)).toEqual({ status: 'missed' });
  });
});
