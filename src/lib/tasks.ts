import db from '@/lib/db';
import { learnersForMode as sharedLearnersForMode, taskAppliesOnDate as sharedTaskAppliesOnDate } from '@/lib/shared/taskProjection';
import { emitTaskChangeForAssignment } from '@/lib/offline/server/taskChanges';

export type Learner = 'kiur' | 'kirsi';
export type AssignmentMode = 'kiur' | 'kirsi' | 'both_independent' | 'first_completer';
export type RecurrenceType = 'once' | 'daily' | 'weekdays' | 'weekends' | 'selected_weekdays';
export type AssignmentStatus = 'active' | 'completed' | 'missed' | 'locked' | 'pending_approval';

export type ChildTask = {
  assignmentId: number;
  taskInstanceId: number;
  title: string;
  points: number;
  assignmentMode: AssignmentMode;
  status: AssignmentStatus;
  requiresApproval: boolean;
  completedAt: string | null;
  completedBy: Learner | null;
};

export type PendingApproval = {
  assignmentId: number;
  learner: Learner;
  title: string;
  points: number;
  assignmentMode: AssignmentMode;
  completedAt: string | null;
};

export type ParentTaskTemplate = {
  id: number;
  title: string;
  points: number;
  assignmentMode: AssignmentMode;
  recurrenceType: RecurrenceType;
  selectedWeekdaysJson: string | null;
  startDate: string | null;
  onceDate: string | null;
  requiresApproval: number;
  createdAt: string;
};

type DailyBonusResult = {
  awarded: boolean;
  amount: number;
};

export type TaskTemplateRow = ParentTaskTemplate & { deletedAt: string | null };

type TaskInstanceRow = {
  id: number;
  templateId: number;
  date: string;
  titleSnapshot: string;
  pointsSnapshot: number;
  assignmentModeSnapshot: AssignmentMode;
  requiresApprovalSnapshot: number;
  status: 'active' | 'completed' | 'missed';
  completedBy: Learner | null;
  completedAt: string | null;
  createdAt: string;
};


// The app's day-boundary helpers live in the client-safe appDate module; re-export
// them here so existing server-side imports from '@/lib/tasks' keep working.
import { isoToAppDate, todayDateString } from '@/lib/appDate';
export { isoToAppDate, todayDateString };

export function nowIso() {
  return new Date().toISOString();
}

export function learnerName(learner: Learner) {
  return learner === 'kiur' ? 'Kiur' : 'Kirsi';
}

export function getBalances(): Record<Learner, number> {
  const rows = db.prepare('SELECT learner, COALESCE(SUM(amount), 0) as balance FROM point_ledger GROUP BY learner').all() as Array<{ learner: Learner; balance: number }>;
  const balances: Record<Learner, number> = { kiur: 0, kirsi: 0 };
  for (const row of rows) {
    if (row.learner === 'kiur' || row.learner === 'kirsi') balances[row.learner] = Math.max(0, row.balance);
  }
  return balances;
}

export function getBalance(learner: Learner) {
  const row = db.prepare('SELECT COALESCE(SUM(amount), 0) as balance FROM point_ledger WHERE learner = ?').get(learner) as { balance: number } | undefined;
  return Math.max(0, row?.balance ?? 0);
}

// Delegates the recurrence rule to the shared, client-safe projection so the
// server and the offline client agree; adds the server-only deletedAt guard.
function taskAppliesOnDate(template: TaskTemplateRow, date: string) {
  if (template.deletedAt) return false;
  return sharedTaskAppliesOnDate(template, date);
}

function learnersForMode(mode: AssignmentMode): Learner[] {
  return sharedLearnersForMode(mode);
}

function createAssignments(taskInstanceId: number, mode: AssignmentMode) {
  const stmt = db.prepare('INSERT OR IGNORE INTO task_instance_assignments (taskInstanceId, learner, status) VALUES (?, ?, ?)');
  for (const learner of learnersForMode(mode)) {
    stmt.run(taskInstanceId, learner, 'active');
  }
}

function childDailyTasksDone(learner: Learner, date: string) {
  // A task still awaiting parent approval counts as not-yet-done, so the shared
  // daily bonus waits until every task is settled.
  const row = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN a.status IN ('active', 'pending_approval') THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN a.status = 'completed' THEN 1 ELSE 0 END) as completed
    FROM task_instance_assignments a
    JOIN task_instances i ON i.id = a.taskInstanceId
    WHERE a.learner = ? AND i.date = ? AND a.status IN ('active', 'pending_approval', 'completed', 'locked')
  `).get(learner, date) as { total: number; pending: number | null; completed: number | null } | undefined;
  return Boolean(row && row.total > 0 && (row.pending ?? 0) === 0 && (row.completed ?? 0) > 0);
}

function awardDailyTaskBonusIfReady(date: string, createdAt: string): DailyBonusResult {
  if (!childDailyTasksDone('kiur', date) || !childDailyTasksDone('kirsi', date)) return { awarded: false, amount: 0 };
  const existing = db.prepare('SELECT id FROM daily_task_bonuses WHERE date = ?').get(date);
  if (existing) return { awarded: false, amount: 0 };

  const description = 'Päevategevuste ühine boonus';
  const metadata = JSON.stringify({ date, reason: 'both_children_completed_daily_tasks' });
  const kiurLedger = db.prepare(`
    INSERT INTO point_ledger (learner, amount, source, description, createdAt, metadataJson)
    VALUES ('kiur', 1, 'daily_task_bonus', ?, ?, ?)
  `).run(description, createdAt, metadata);
  const kirsiLedger = db.prepare(`
    INSERT INTO point_ledger (learner, amount, source, description, createdAt, metadataJson)
    VALUES ('kirsi', 1, 'daily_task_bonus', ?, ?, ?)
  `).run(description, createdAt, metadata);
  db.prepare('INSERT INTO daily_task_bonuses (date, kiurLedgerEntryId, kirsiLedgerEntryId, createdAt) VALUES (?, ?, ?, ?)').run(date, kiurLedger.lastInsertRowid, kirsiLedger.lastInsertRowid, createdAt);
  return { awarded: true, amount: 1 };
}

export function ensureTaskInstancesForDate(date = todayDateString()) {
  const markMissed = db.transaction(() => {
    db.prepare("UPDATE task_instance_assignments SET status = 'missed' WHERE status = 'active' AND taskInstanceId IN (SELECT id FROM task_instances WHERE date < ?)").run(date);
    db.prepare("UPDATE task_instances SET status = 'missed' WHERE status = 'active' AND date < ?").run(date);
  });
  markMissed();

  const createForDate = db.transaction(() => {
    const templates = db.prepare('SELECT * FROM task_templates WHERE deletedAt IS NULL').all() as TaskTemplateRow[];
    const insertInstance = db.prepare(`
      INSERT OR IGNORE INTO task_instances (templateId, date, titleSnapshot, pointsSnapshot, assignmentModeSnapshot, requiresApprovalSnapshot, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, 'active', ?)
    `);
    const findInstance = db.prepare('SELECT * FROM task_instances WHERE templateId = ? AND date = ?');
    const createdAt = nowIso();

    for (const template of templates) {
      if (!taskAppliesOnDate(template, date)) continue;
      insertInstance.run(template.id, date, template.title, template.points, template.assignmentMode, template.requiresApproval ? 1 : 0, createdAt);
      const instance = findInstance.get(template.id, date) as TaskInstanceRow | undefined;
      if (instance) createAssignments(instance.id, instance.assignmentModeSnapshot);
    }
  });
  createForDate();
}

export function getChildDashboard(learner: Learner, date = todayDateString()) {
  ensureTaskInstancesForDate(date);
  const balance = getBalance(learner);
  const rows = db.prepare(`
    SELECT
      a.id as assignmentId,
      i.id as taskInstanceId,
      i.titleSnapshot as title,
      i.pointsSnapshot as points,
      i.assignmentModeSnapshot as assignmentMode,
      i.requiresApprovalSnapshot as requiresApproval,
      a.status,
      a.completedAt,
      i.completedBy
    FROM task_instance_assignments a
    JOIN task_instances i ON i.id = a.taskInstanceId
    WHERE a.learner = ? AND i.date = ? AND a.status IN ('active', 'pending_approval', 'completed', 'locked')
    ORDER BY a.status = 'completed', i.createdAt, i.id
  `).all(learner, date) as Array<Omit<ChildTask, 'requiresApproval'> & { requiresApproval: number }>;
  const tasks: ChildTask[] = rows.map((row) => ({ ...row, requiresApproval: Boolean(row.requiresApproval) }));

  return { learner, balance, streak: 0, tasks };
}

export type TaskTemplateInput = {
  title: string;
  points: number;
  assignmentMode: AssignmentMode;
  recurrenceType: RecurrenceType;
  selectedWeekdays?: number[];
  startDate?: string | null;
  onceDate?: string | null;
  requiresApproval?: boolean;
};

function normalizeTaskTemplateInput(input: TaskTemplateInput) {
  const title = input.title.trim();
  if (!title) throw new Error('Pealkiri on kohustuslik.');
  if (title.length > 80) throw new Error('Pealkiri võib olla kuni 80 märki.');
  if (!Number.isInteger(input.points) || input.points < 1 || input.points > 99) throw new Error('Punktid peavad olema vahemikus 1-99.');
  if (!['kiur', 'kirsi', 'both_independent', 'first_completer'].includes(input.assignmentMode)) throw new Error('Vale laps.');
  if (!['once', 'daily', 'weekdays', 'weekends', 'selected_weekdays'].includes(input.recurrenceType)) throw new Error('Vale kordumine.');
  if (input.recurrenceType === 'once' && !input.onceDate) throw new Error('Kuupäev on kohustuslik.');
  const selectedWeekdays = input.selectedWeekdays?.filter((day) => Number.isInteger(day) && day >= 1 && day <= 7) ?? [];
  if (input.recurrenceType === 'selected_weekdays' && selectedWeekdays.length === 0) throw new Error('Vali vähemalt üks nädalapäev.');

  return {
    title,
    points: input.points,
    assignmentMode: input.assignmentMode,
    recurrenceType: input.recurrenceType,
    selectedWeekdaysJson: input.recurrenceType === 'selected_weekdays' ? JSON.stringify(selectedWeekdays) : null,
    startDate: input.recurrenceType === 'once' ? null : (input.startDate || todayDateString()),
    onceDate: input.recurrenceType === 'once' ? input.onceDate : null,
    requiresApproval: input.requiresApproval ? 1 : 0
  };
}

export function createTaskTemplate(input: TaskTemplateInput) {
  const values = normalizeTaskTemplateInput(input);
  const result = db.prepare(`
    INSERT INTO task_templates (title, points, assignmentMode, recurrenceType, selectedWeekdaysJson, startDate, onceDate, requiresApproval, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    values.title,
    values.points,
    values.assignmentMode,
    values.recurrenceType,
    values.selectedWeekdaysJson,
    values.startDate,
    values.onceDate,
    values.requiresApproval,
    nowIso()
  );

  ensureTaskInstancesForDate();
  return result.lastInsertRowid;
}

// Removes today's instance for a template if it has not been started yet, so an
// edited template is re-materialised with fresh snapshots/assignments.
function resetUntouchedInstanceForToday(templateId: number, date: string) {
  const instance = db.prepare("SELECT id FROM task_instances WHERE templateId = ? AND date = ? AND status = 'active'").get(templateId, date) as { id: number } | undefined;
  if (!instance) return;
  const touched = db.prepare("SELECT id FROM task_instance_assignments WHERE taskInstanceId = ? AND status IN ('completed', 'locked', 'pending_approval')").get(instance.id);
  if (touched) return;
  db.prepare('DELETE FROM task_instance_assignments WHERE taskInstanceId = ?').run(instance.id);
  db.prepare('DELETE FROM task_instances WHERE id = ?').run(instance.id);
}

export function updateTaskTemplate(id: number, input: TaskTemplateInput) {
  const existing = db.prepare('SELECT id FROM task_templates WHERE id = ? AND deletedAt IS NULL').get(id);
  if (!existing) throw new Error('Tegevust ei leitud.');
  const values = normalizeTaskTemplateInput(input);

  const apply = db.transaction(() => {
    db.prepare(`
      UPDATE task_templates
      SET title = ?, points = ?, assignmentMode = ?, recurrenceType = ?, selectedWeekdaysJson = ?, startDate = ?, onceDate = ?, requiresApproval = ?
      WHERE id = ? AND deletedAt IS NULL
    `).run(
      values.title,
      values.points,
      values.assignmentMode,
      values.recurrenceType,
      values.selectedWeekdaysJson,
      values.startDate,
      values.onceDate,
      values.requiresApproval,
      id
    );
    resetUntouchedInstanceForToday(id, todayDateString());
  });
  apply();

  ensureTaskInstancesForDate();
}

export function deleteTaskTemplate(id: number) {
  db.prepare('UPDATE task_templates SET deletedAt = ? WHERE id = ? AND deletedAt IS NULL').run(nowIso(), id);
}

type AssignmentRow = {
  assignmentId: number;
  assignmentStatus: AssignmentStatus;
  learner: Learner;
  taskInstanceId: number;
  titleSnapshot: string;
  pointsSnapshot: number;
  assignmentModeSnapshot: AssignmentMode;
  requiresApprovalSnapshot: number;
  instanceStatus: string;
  completedAt: string | null;
};

function loadAssignmentRow(assignmentId: number): AssignmentRow | undefined {
  return db.prepare(`
    SELECT
      a.id as assignmentId,
      a.status as assignmentStatus,
      a.learner,
      a.completedAt,
      i.id as taskInstanceId,
      i.titleSnapshot,
      i.pointsSnapshot,
      i.assignmentModeSnapshot,
      i.requiresApprovalSnapshot,
      i.status as instanceStatus
    FROM task_instance_assignments a
    JOIN task_instances i ON i.id = a.taskInstanceId
    WHERE a.id = ?
  `).get(assignmentId) as AssignmentRow | undefined;
}

// Awards the tähed for an assignment and settles the instance (locking siblings
// for first_completer, marking the instance done, and granting the shared daily
// bonus when ready). Used both for instant completion and for parent approval.
function settleAssignment(row: AssignmentRow, completedAt: string, date: string) {
  const learner = row.learner;
  const ledger = db.prepare(`
    INSERT INTO point_ledger (learner, amount, source, sourceId, description, createdAt, metadataJson)
    VALUES (?, ?, 'real_world_task', ?, ?, ?, ?)
  `).run(
    learner,
    row.pointsSnapshot,
    row.taskInstanceId,
    row.titleSnapshot,
    completedAt,
    JSON.stringify({ assignmentId: row.assignmentId, assignmentMode: row.assignmentModeSnapshot })
  );

  db.prepare(`
    UPDATE task_instance_assignments
    SET status = 'completed', completedAt = ?, pointsAwarded = ?, ledgerEntryId = ?
    WHERE id = ? AND status IN ('active', 'pending_approval')
  `).run(completedAt, row.pointsSnapshot, ledger.lastInsertRowid, row.assignmentId);

  // Propagate this settlement to any offline device that queued a completion for
  // this assignment (e.g. it was pending parent approval). No-op when no offline
  // action exists — the very action being processed live is not persisted yet.
  emitTaskChangeForAssignment(row.assignmentId, 'applied');

  if (row.assignmentModeSnapshot === 'first_completer') {
    const lockedSiblings = db.prepare("SELECT id FROM task_instance_assignments WHERE taskInstanceId = ? AND id <> ? AND status IN ('active', 'pending_approval')").all(row.taskInstanceId, row.assignmentId) as Array<{ id: number }>;
    db.prepare("UPDATE task_instance_assignments SET status = 'locked' WHERE taskInstanceId = ? AND id <> ? AND status IN ('active', 'pending_approval')").run(row.taskInstanceId, row.assignmentId);
    db.prepare("UPDATE task_instances SET status = 'completed', completedBy = ?, completedAt = ? WHERE id = ?").run(learner, completedAt, row.taskInstanceId);
    // A sibling who completed the same first-completer task offline lost the race.
    for (const sibling of lockedSiblings) emitTaskChangeForAssignment(sibling.id, 'conflict', { reasonCode: 'first_completer_taken' });
  } else {
    const open = db.prepare("SELECT id FROM task_instance_assignments WHERE taskInstanceId = ? AND status IN ('active', 'pending_approval')").get(row.taskInstanceId);
    if (!open) db.prepare("UPDATE task_instances SET status = 'completed', completedBy = ?, completedAt = ? WHERE id = ?").run(learner, completedAt, row.taskInstanceId);
  }

  const bonus = awardDailyTaskBonusIfReady(date, completedAt);
  return { awarded: row.pointsSnapshot, balance: getBalance(learner), dailyBonus: bonus };
}

// Generalised completion: `completedAt`/`date` default to now/today for the live
// online path, but the offline sync path passes the action's effective completion
// time and task date so a late arrival settles against the right day.
export function completeTaskAssignmentAt(assignmentId: number, learner: Learner, completedAt: string, date: string) {
  const complete = db.transaction(() => {
    const row = loadAssignmentRow(assignmentId);

    if (!row || row.learner !== learner || row.assignmentStatus !== 'active' || row.instanceStatus !== 'active') {
      throw new Error('Tegevus ei ole enam saadaval.');
    }

    if (row.assignmentModeSnapshot === 'first_completer') {
      const taken = db.prepare("SELECT id FROM task_instance_assignments WHERE taskInstanceId = ? AND status IN ('completed', 'pending_approval')").get(row.taskInstanceId);
      if (taken) {
        db.prepare("UPDATE task_instance_assignments SET status = 'locked' WHERE id = ? AND status = 'active'").run(assignmentId);
        throw new Error('Keegi teine jõudis ette.');
      }
    }

    if (row.requiresApprovalSnapshot) {
      db.prepare("UPDATE task_instance_assignments SET status = 'pending_approval', completedAt = ? WHERE id = ? AND status = 'active'").run(completedAt, assignmentId);
      return { pending: true, awarded: 0, balance: getBalance(learner), dailyBonus: { awarded: false, amount: 0 } };
    }

    return { pending: false, ...settleAssignment(row, completedAt, date) };
  });

  return complete();
}

export function completeTaskAssignment(assignmentId: number, learner: Learner) {
  return completeTaskAssignmentAt(assignmentId, learner, nowIso(), todayDateString());
}

// The assignment id for (template, date, learner), if it has been materialised.
export function findAssignmentId(templateId: number, date: string, learner: Learner): number | null {
  const row = db.prepare(`
    SELECT a.id AS id
    FROM task_instance_assignments a
    JOIN task_instances i ON i.id = a.taskInstanceId
    WHERE i.templateId = ? AND i.date = ? AND a.learner = ?
  `).get(templateId, date, learner) as { id: number } | undefined;
  return row?.id ?? null;
}

export function getAssignmentStatusById(assignmentId: number): string | null {
  const row = db.prepare('SELECT status FROM task_instance_assignments WHERE id = ?').get(assignmentId) as { status: string } | undefined;
  return row?.status ?? null;
}

export function getActiveTaskTemplates() {
  return db.prepare('SELECT * FROM task_templates WHERE deletedAt IS NULL ORDER BY id ASC').all() as TaskTemplateRow[];
}

export function getTaskTemplateById(id: number) {
  return db.prepare('SELECT * FROM task_templates WHERE id = ?').get(id) as TaskTemplateRow | undefined;
}

export function approveTaskAssignment(assignmentId: number) {
  const approve = db.transaction(() => {
    const row = loadAssignmentRow(assignmentId);
    if (!row || row.assignmentStatus !== 'pending_approval') throw new Error('Kinnitamist ootavat tegevust ei leitud.');

    if (row.assignmentModeSnapshot === 'first_completer') {
      const taken = db.prepare("SELECT id FROM task_instance_assignments WHERE taskInstanceId = ? AND status = 'completed'").get(row.taskInstanceId);
      if (taken) {
        db.prepare("UPDATE task_instance_assignments SET status = 'locked' WHERE id = ? AND status = 'pending_approval'").run(assignmentId);
        throw new Error('Keegi teine jõudis ette.');
      }
    }

    const completedAt = row.completedAt || nowIso();
    const date = todayDateString();
    return settleAssignment(row, completedAt, date);
  });
  return approve();
}

export function rejectTaskAssignment(assignmentId: number) {
  const reject = db.transaction(() => {
    const result = db.prepare("UPDATE task_instance_assignments SET status = 'active', completedAt = NULL WHERE id = ? AND status = 'pending_approval'").run(assignmentId);
    if (result.changes === 0) throw new Error('Kinnitamist ootavat tegevust ei leitud.');
    // Tell any offline device that queued this completion that it was returned,
    // so the child no longer sees a rejected task as done (RTM-005).
    emitTaskChangeForAssignment(assignmentId, 'returned', { reasonCode: 'parent_rejected' });
    return { ok: true };
  });
  return reject();
}

export function getPendingApprovals(date = todayDateString()): PendingApproval[] {
  ensureTaskInstancesForDate(date);
  return db.prepare(`
    SELECT
      a.id as assignmentId,
      a.learner,
      a.completedAt,
      i.titleSnapshot as title,
      i.pointsSnapshot as points,
      i.assignmentModeSnapshot as assignmentMode
    FROM task_instance_assignments a
    JOIN task_instances i ON i.id = a.taskInstanceId
    WHERE a.status = 'pending_approval' AND i.date = ?
    ORDER BY a.completedAt ASC, a.id ASC
  `).all(date) as PendingApproval[];
}

export function manualPointAdjustment(learner: Learner, amount: number, reason: string) {
  if (!Number.isInteger(amount) || amount === 0) throw new Error('Punktide arv peab olema täisarv ja mitte null.');
  if (amount < 0 && getBalance(learner) + amount < 0) throw new Error('Tähed ei saa minna alla nulli.');
  const cleanReason = reason.trim().slice(0, 120);
  const description = cleanReason || 'Vanema muudatus';
  db.prepare(`
    INSERT INTO point_ledger (learner, amount, source, description, createdAt, metadataJson)
    VALUES (?, ?, 'manual_adjustment', ?, ?, ?)
  `).run(learner, amount, description, nowIso(), JSON.stringify({ reason: cleanReason }));
  return { balance: getBalance(learner) };
}

export function getParentDashboard(date = todayDateString()) {
  ensureTaskInstancesForDate(date);
  const templates = db.prepare('SELECT * FROM task_templates WHERE deletedAt IS NULL ORDER BY createdAt DESC').all() as ParentTaskTemplate[];
  const activeTasks = db.prepare(`
    SELECT i.*, GROUP_CONCAT(a.learner || ':' || a.status, ',') as assignmentSummary
    FROM task_instances i
    LEFT JOIN task_instance_assignments a ON a.taskInstanceId = i.id
    WHERE i.date = ? AND i.status = 'active'
    GROUP BY i.id
    ORDER BY i.status = 'completed', i.createdAt DESC
  `).all(date);
  const completedTasks = db.prepare(`
    SELECT i.titleSnapshot, i.pointsSnapshot, i.assignmentModeSnapshot, a.learner, a.completedAt
    FROM task_instance_assignments a
    JOIN task_instances i ON i.id = a.taskInstanceId
    WHERE i.date = ? AND a.status = 'completed'
    ORDER BY a.completedAt DESC
  `).all(date);

  return { date, balances: getBalances(), templates, activeTasks, completedTasks, pendingApprovals: getPendingApprovals(date) };
}

export function getTaskHistory() {
  return db.prepare(`
    SELECT
      l.id,
      l.learner,
      l.amount,
      l.source,
      l.sourceId,
      l.description,
      l.createdAt,
      l.metadataJson,
      i.titleSnapshot,
    i.assignmentModeSnapshot
    FROM point_ledger l
    LEFT JOIN task_instances i ON i.id = l.sourceId AND l.source = 'real_world_task'
    WHERE l.source IN ('real_world_task', 'manual_adjustment', 'daily_task_bonus', 'point_gift')
    ORDER BY l.createdAt DESC
  `).all();
}
