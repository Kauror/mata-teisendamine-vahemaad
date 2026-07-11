import type { Learner } from '@/lib/shared/types';

// Client-safe task recurrence projection. The device projects which tasks apply
// on each offline date from the synced templates (instead of pre-materialising
// server instances that would go stale). The server uses the same predicate, so
// projection agrees on both sides. The version is a server-computed content hash
// the device only stores and echoes back.

export type TaskAssignmentMode = 'kiur' | 'kirsi' | 'both_independent' | 'first_completer';
export type TaskRecurrenceType = 'once' | 'daily' | 'weekdays' | 'weekends' | 'selected_weekdays';

export type SyncTaskTemplate = {
  id: number;
  title: string;
  points: number;
  assignmentMode: TaskAssignmentMode;
  recurrenceType: TaskRecurrenceType;
  selectedWeekdaysJson: string | null;
  startDate: string | null;
  onceDate: string | null;
  requiresApproval: boolean;
  version: string;
};

export type ProjectedTask = {
  templateId: number;
  templateVersion: string;
  date: string;
  title: string;
  points: number;
  assignmentMode: TaskAssignmentMode;
  requiresApproval: boolean;
};

// ISO weekday for a 'YYYY-MM-DD' date, 1 = Monday … 7 = Sunday. Noon UTC keeps it
// clear of DST edges (a date string is a calendar day, not an instant).
export function weekdayForDate(date: string): number {
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  return day === 0 ? 7 : day;
}

export function parseSelectedWeekdays(raw: string | null): number[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed.filter((day) => Number.isInteger(day) && day >= 1 && day <= 7) as number[]) : [];
  } catch {
    return [];
  }
}

export function learnersForMode(mode: TaskAssignmentMode): Learner[] {
  if (mode === 'kiur') return ['kiur'];
  if (mode === 'kirsi') return ['kirsi'];
  return ['kiur', 'kirsi'];
}

// Does a template produce a task on `date`? Identical rule to the server.
export function taskAppliesOnDate(template: { recurrenceType: TaskRecurrenceType; onceDate: string | null; startDate: string | null; selectedWeekdaysJson: string | null }, date: string): boolean {
  if (template.recurrenceType === 'once') return template.onceDate === date;
  if (template.startDate && template.startDate > date) return false;
  const weekday = weekdayForDate(date);
  if (template.recurrenceType === 'daily') return true;
  if (template.recurrenceType === 'weekdays') return weekday >= 1 && weekday <= 5;
  if (template.recurrenceType === 'weekends') return weekday === 6 || weekday === 7;
  if (template.recurrenceType === 'selected_weekdays') return parseSelectedWeekdays(template.selectedWeekdaysJson).includes(weekday);
  return false;
}

// The tasks a child should see on a given date, projected from the templates.
export function projectTasksForDate(templates: SyncTaskTemplate[], learner: Learner, date: string): ProjectedTask[] {
  return templates
    .filter((template) => taskAppliesOnDate(template, date) && learnersForMode(template.assignmentMode).includes(learner))
    .map((template) => ({
      templateId: template.id,
      templateVersion: template.version,
      date,
      title: template.title,
      points: template.points,
      assignmentMode: template.assignmentMode,
      requiresApproval: template.requiresApproval
    }));
}
