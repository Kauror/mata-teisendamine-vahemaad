import db from '@/lib/db';

export type Learner = 'kiur' | 'kirsi';
export type AssignmentMode = 'kiur' | 'kirsi' | 'both_independent' | 'first_completer';
export type RecurrenceType = 'once' | 'daily' | 'weekdays' | 'weekends' | 'selected_weekdays';
export type AssignmentStatus = 'active' | 'completed' | 'missed' | 'locked';

export type ChildTask = {
  assignmentId: number;
  taskInstanceId: number;
  title: string;
  points: number;
  assignmentMode: AssignmentMode;
  status: AssignmentStatus;
  completedAt: string | null;
  completedBy: Learner | null;
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
  createdAt: string;
};

type DailyBonusResult = {
  awarded: boolean;
  amount: number;
};

type TaskTemplateRow = ParentTaskTemplate & { deletedAt: string | null };

type TaskInstanceRow = {
  id: number;
  templateId: number;
  date: string;
  titleSnapshot: string;
  pointsSnapshot: number;
  assignmentModeSnapshot: AssignmentMode;
  status: 'active' | 'completed' | 'missed';
  completedBy: Learner | null;
  completedAt: string | null;
  createdAt: string;
};

const LEARNERS: Learner[] = ['kiur', 'kirsi'];

export function todayDateString() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Kiev',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((part) => part.type === type)?.value || '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

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
    if (row.learner === 'kiur' || row.learner === 'kirsi') balances[row.learner] = row.balance;
  }
  return balances;
}

export function getBalance(learner: Learner) {
  const row = db.prepare('SELECT COALESCE(SUM(amount), 0) as balance FROM point_ledger WHERE learner = ?').get(learner) as { balance: number } | undefined;
  return row?.balance ?? 0;
}

function weekdayForDate(date: string) {
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  return day === 0 ? 7 : day;
}

function parseSelectedWeekdays(raw: string | null) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((day) => Number.isInteger(day) && day >= 1 && day <= 7) as number[] : [];
  } catch {
    return [];
  }
}

function taskAppliesOnDate(template: TaskTemplateRow, date: string) {
  if (template.deletedAt) return false;
  if (template.recurrenceType === 'once') return template.onceDate === date;
  if (template.startDate && template.startDate > date) return false;

  const weekday = weekdayForDate(date);
  if (template.recurrenceType === 'daily') return true;
  if (template.recurrenceType === 'weekdays') return weekday >= 1 && weekday <= 5;
  if (template.recurrenceType === 'weekends') return weekday === 6 || weekday === 7;
  if (template.recurrenceType === 'selected_weekdays') return parseSelectedWeekdays(template.selectedWeekdaysJson).includes(weekday);
  return false;
}

function learnersForMode(mode: AssignmentMode): Learner[] {
  if (mode === 'kiur') return ['kiur'];
  if (mode === 'kirsi') return ['kirsi'];
  return LEARNERS;
}

function createAssignments(taskInstanceId: number, mode: AssignmentMode) {
  const stmt = db.prepare('INSERT OR IGNORE INTO task_instance_assignments (taskInstanceId, learner, status) VALUES (?, ?, ?)');
  for (const learner of learnersForMode(mode)) {
    stmt.run(taskInstanceId, learner, 'active');
  }
}

function childDailyTasksDone(learner: Learner, date: string) {
  const row = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN a.status = 'active' THEN 1 ELSE 0 END) as active,
      SUM(CASE WHEN a.status = 'completed' THEN 1 ELSE 0 END) as completed
    FROM task_instance_assignments a
    JOIN task_instances i ON i.id = a.taskInstanceId
    WHERE a.learner = ? AND i.date = ? AND a.status IN ('active', 'completed', 'locked')
  `).get(learner, date) as { total: number; active: number | null; completed: number | null } | undefined;
  return Boolean(row && row.total > 0 && (row.active ?? 0) === 0 && (row.completed ?? 0) > 0);
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
      INSERT OR IGNORE INTO task_instances (templateId, date, titleSnapshot, pointsSnapshot, assignmentModeSnapshot, status, createdAt)
      VALUES (?, ?, ?, ?, ?, 'active', ?)
    `);
    const findInstance = db.prepare('SELECT * FROM task_instances WHERE templateId = ? AND date = ?');
    const createdAt = nowIso();

    for (const template of templates) {
      if (!taskAppliesOnDate(template, date)) continue;
      insertInstance.run(template.id, date, template.title, template.points, template.assignmentMode, createdAt);
      const instance = findInstance.get(template.id, date) as TaskInstanceRow | undefined;
      if (instance) createAssignments(instance.id, instance.assignmentModeSnapshot);
    }
  });
  createForDate();
}

export function getChildDashboard(learner: Learner, date = todayDateString()) {
  ensureTaskInstancesForDate(date);
  const balance = getBalance(learner);
  const tasks = db.prepare(`
    SELECT
      a.id as assignmentId,
      i.id as taskInstanceId,
      i.titleSnapshot as title,
      i.pointsSnapshot as points,
      i.assignmentModeSnapshot as assignmentMode,
      a.status,
      a.completedAt,
      i.completedBy
    FROM task_instance_assignments a
    JOIN task_instances i ON i.id = a.taskInstanceId
    WHERE a.learner = ? AND i.date = ? AND a.status IN ('active', 'completed', 'locked')
    ORDER BY a.status = 'completed', i.createdAt, i.id
  `).all(learner, date) as ChildTask[];

  return { learner, balance, streak: 0, tasks };
}

export function createTaskTemplate(input: {
  title: string;
  points: number;
  assignmentMode: AssignmentMode;
  recurrenceType: RecurrenceType;
  selectedWeekdays?: number[];
  startDate?: string | null;
  onceDate?: string | null;
}) {
  const title = input.title.trim();
  if (!title) throw new Error('Pealkiri on kohustuslik.');
  if (title.length > 80) throw new Error('Pealkiri võib olla kuni 80 märki.');
  if (!Number.isInteger(input.points) || input.points < 1 || input.points > 99) throw new Error('Punktid peavad olema vahemikus 1-99.');
  if (!['kiur', 'kirsi', 'both_independent', 'first_completer'].includes(input.assignmentMode)) throw new Error('Vale laps.');
  if (!['once', 'daily', 'weekdays', 'weekends', 'selected_weekdays'].includes(input.recurrenceType)) throw new Error('Vale kordumine.');
  if (input.recurrenceType === 'once' && !input.onceDate) throw new Error('Kuupäev on kohustuslik.');
  const selectedWeekdays = input.selectedWeekdays?.filter((day) => Number.isInteger(day) && day >= 1 && day <= 7) ?? [];
  if (input.recurrenceType === 'selected_weekdays' && selectedWeekdays.length === 0) throw new Error('Vali vähemalt üks nädalapäev.');

  const result = db.prepare(`
    INSERT INTO task_templates (title, points, assignmentMode, recurrenceType, selectedWeekdaysJson, startDate, onceDate, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    title,
    input.points,
    input.assignmentMode,
    input.recurrenceType,
    input.recurrenceType === 'selected_weekdays' ? JSON.stringify(selectedWeekdays) : null,
    input.recurrenceType === 'once' ? null : (input.startDate || todayDateString()),
    input.recurrenceType === 'once' ? input.onceDate : null,
    nowIso()
  );

  ensureTaskInstancesForDate();
  return result.lastInsertRowid;
}

export function deleteTaskTemplate(id: number) {
  db.prepare('UPDATE task_templates SET deletedAt = ? WHERE id = ? AND deletedAt IS NULL').run(nowIso(), id);
}

export function completeTaskAssignment(assignmentId: number, learner: Learner) {
  const complete = db.transaction(() => {
    const row = db.prepare(`
      SELECT
        a.id as assignmentId,
        a.status as assignmentStatus,
        a.learner,
        i.id as taskInstanceId,
        i.titleSnapshot,
        i.pointsSnapshot,
        i.assignmentModeSnapshot,
        i.status as instanceStatus
      FROM task_instance_assignments a
      JOIN task_instances i ON i.id = a.taskInstanceId
      WHERE a.id = ?
    `).get(assignmentId) as {
      assignmentId: number;
      assignmentStatus: AssignmentStatus;
      learner: Learner;
      taskInstanceId: number;
      titleSnapshot: string;
      pointsSnapshot: number;
      assignmentModeSnapshot: AssignmentMode;
      instanceStatus: string;
    } | undefined;

    if (!row || row.learner !== learner || row.assignmentStatus !== 'active' || row.instanceStatus !== 'active') {
      throw new Error('Tegevus ei ole enam saadaval.');
    }

    if (row.assignmentModeSnapshot === 'first_completer') {
      const completed = db.prepare("SELECT id FROM task_instance_assignments WHERE taskInstanceId = ? AND status = 'completed'").get(row.taskInstanceId);
      if (completed) {
        db.prepare("UPDATE task_instance_assignments SET status = 'locked' WHERE id = ? AND status = 'active'").run(assignmentId);
        throw new Error('Keegi teine jõudis ette.');
      }
    }

    const completedAt = nowIso();
    const date = todayDateString();
    const ledger = db.prepare(`
      INSERT INTO point_ledger (learner, amount, source, sourceId, description, createdAt, metadataJson)
      VALUES (?, ?, 'real_world_task', ?, ?, ?, ?)
    `).run(
      learner,
      row.pointsSnapshot,
      row.taskInstanceId,
      row.titleSnapshot,
      completedAt,
      JSON.stringify({ assignmentId, assignmentMode: row.assignmentModeSnapshot })
    );

    db.prepare(`
      UPDATE task_instance_assignments
      SET status = 'completed', completedAt = ?, pointsAwarded = ?, ledgerEntryId = ?
      WHERE id = ? AND status = 'active'
    `).run(completedAt, row.pointsSnapshot, ledger.lastInsertRowid, assignmentId);

    if (row.assignmentModeSnapshot === 'first_completer') {
      db.prepare("UPDATE task_instance_assignments SET status = 'locked' WHERE taskInstanceId = ? AND id <> ? AND status = 'active'").run(row.taskInstanceId, assignmentId);
      db.prepare("UPDATE task_instances SET status = 'completed', completedBy = ?, completedAt = ? WHERE id = ?").run(learner, completedAt, row.taskInstanceId);
    } else {
      const open = db.prepare("SELECT id FROM task_instance_assignments WHERE taskInstanceId = ? AND status = 'active'").get(row.taskInstanceId);
      if (!open) db.prepare("UPDATE task_instances SET status = 'completed', completedBy = ?, completedAt = ? WHERE id = ?").run(learner, completedAt, row.taskInstanceId);
    }

    const bonus = awardDailyTaskBonusIfReady(date, completedAt);
    return { awarded: row.pointsSnapshot, balance: getBalance(learner), dailyBonus: bonus };
  });

  return complete();
}

export function manualPointAdjustment(learner: Learner, amount: number, reason: string) {
  if (!Number.isInteger(amount) || amount === 0) throw new Error('Punktide arv peab olema täisarv ja mitte null.');
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

  return { date, balances: getBalances(), templates, activeTasks, completedTasks };
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
    WHERE l.source IN ('real_world_task', 'manual_adjustment', 'daily_task_bonus')
    ORDER BY l.createdAt DESC
  `).all();
}
