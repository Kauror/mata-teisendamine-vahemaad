import { todayDateString } from '@/lib/appDate';
import { formatStars } from '@/lib/formatStars';
import { exerciseWord, prizeWord, starWord, trophyWord } from '@/lib/history';
import { LEARNING_EXERCISE_SUBJECT_LABELS, type LearningExerciseStatus, type LearningExerciseSubject } from '@/lib/shared/types';
import type { AssignmentMode, Learner, ParentHistoryAttempt, PendingApproval, RecurrenceType, RewardLearnerScope, StoreStockType, StoreVisibility } from './types';

// Labels and small formatters shared by the parent panels. Pure, so the
// wording rules are unit-tested.

export const ASSIGNMENT_LABELS: Record<AssignmentMode, string> = {
  kiur: 'Kiur',
  kirsi: 'Kirsi',
  both_independent: 'Mõlemale eraldi',
  first_completer: 'Esimene tegija saab tähed'
};

export const RECURRENCE_LABELS: Record<RecurrenceType, string> = {
  once: 'Ühekordne',
  daily: 'Iga päev',
  weekdays: 'Tööpäeviti',
  weekends: 'Nädalavahetusel',
  selected_weekdays: 'Valitud päevadel'
};

export const VISIBILITY_LABELS: Record<StoreVisibility, string> = { kiur: 'Kiur', kirsi: 'Kirsi', both: 'Mõlemale' };
export const STOCK_LABELS: Record<StoreStockType, string> = {
  unlimited: 'Piiramatu',
  fixed_stock: 'Kindel kogus',
  daily_stock: 'Päevane kogus',
  one_time_global: 'Ühekordne'
};
export const REWARD_SCOPE_LABELS: Record<RewardLearnerScope, string> = { both: 'Mõlemale', kiur: 'Kiur', kirsi: 'Kirsi' };

export const SUBJECT_LABELS = LEARNING_EXERCISE_SUBJECT_LABELS;
// Derived from the label record, which the compiler forces to be exhaustive, so
// a new subject can never end up unordered (indexOf -1 would sort it first).
export const SUBJECT_ORDER = Object.keys(SUBJECT_LABELS) as LearningExerciseSubject[];
export const STATUS_OPTIONS: ReadonlyArray<{ value: LearningExerciseStatus; label: string }> = [
  { value: 'hidden', label: 'Peidus' },
  { value: 'rotation', label: 'Rotatsioon' },
  { value: 'permanent', label: 'Püsiv' }
];

export const WEEKDAYS = [
  { id: 1, label: 'E' },
  { id: 2, label: 'T' },
  { id: 3, label: 'K' },
  { id: 4, label: 'N' },
  { id: 5, label: 'R' },
  { id: 6, label: 'L' },
  { id: 7, label: 'P' }
];

export function today() {
  return todayDateString();
}

// The one learner label in the parent area. A history row may have no learner
// (legacy rows); those were always shown as Kiur's.
export function learnerLabel(learner: Learner | null | undefined) {
  return learner === 'kirsi' ? 'Kirsi' : 'Kiur';
}

// "Kiuri tähti vähendati" — the possessor takes the genitive.
export function learnerGenitive(learner: Learner) {
  return learner === 'kiur' ? 'Kiuri' : 'Kirsi';
}

export function learnerAccent(learner: Learner) {
  return learner === 'kiur' ? 'blue' : 'pink';
}

// "13.10" for an app date "2026-10-13"; approvals from earlier days carry it so
// the parent can tell yesterday's chore from today's.
export function shortDayLabel(date: string) {
  const [, month, day] = date.split('-');
  return month && day ? `${Number(day)}.${month}` : date;
}

export function clockLabel(value: string) {
  return new Date(value).toLocaleTimeString('et-EE', { hour: '2-digit', minute: '2-digit' });
}

export function timeLabel(value: string) {
  return new Date(value).toLocaleString('et-EE', { dateStyle: 'short', timeStyle: 'short' });
}

// "+3 ⭐ · 13.10 · 18:04": the day only when it is not today.
export function approvalMeta(item: Pick<PendingApproval, 'points' | 'date' | 'completedAt'>, todayDate: string = today()) {
  const day = item.date && item.date !== todayDate ? ` · ${shortDayLabel(item.date)}` : '';
  const clock = item.completedAt ? ` · ${clockLabel(item.completedAt)}` : '';
  return `+${item.points} ⭐${day}${clock}`;
}

export function parseWeekdays(raw: string | null) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as number[] : [];
  } catch {
    return [];
  }
}

// A positive whole amount for the ± steppers; anything unreadable is 1.
export function adjustMagnitude(raw: string) {
  return Math.max(1, Math.trunc(Math.abs(Number(raw) || 1)));
}

// Stars and trophies adjust the same way: +/- a positive magnitude for one
// child, via their own endpoint. Only the endpoint and wording differ. The
// count word agrees with the number ("+1 täht", "+3 tähte").
export const ADJUST_KINDS = {
  points: { url: '/api/parent/adjust-points', fail: 'Punkte ei saanud muuta.', noun: (n: number) => starWord(formatStars(n)), removeVerb: 'tähti vähendati' },
  trophies: { url: '/api/parent/adjust-trophies', fail: 'Karikaid ei saanud muuta.', noun: trophyWord, removeVerb: 'karikaid vähendati' }
} as const;
export type AdjustKind = keyof typeof ADJUST_KINDS;

export function adjustmentNotice(kind: AdjustKind, learner: Learner, direction: 1 | -1, magnitude: number) {
  const config = ADJUST_KINDS[kind];
  return direction > 0
    ? `${learnerLabel(learner)}: +${magnitude} ${config.noun(magnitude)}.`
    : `${learnerGenitive(learner)} ${config.removeVerb} ${magnitude} võrra.`;
}

// "Näita rohkem" appends a page; a row already on screen (the list moved while
// paging) is not shown twice. A first page replaces the list.
export function mergeHistoryPage(current: ParentHistoryAttempt[], items: ParentHistoryAttempt[], appended: boolean) {
  if (!appended) return items;
  const seen = new Set(current.map((item) => item.id));
  return [...current, ...items.filter((item) => !seen.has(item.id))];
}

export function rewardsSummary(count: number) {
  return count === 0 ? 'Pole seadistatud' : `${count} ${prizeWord(count)}`;
}

// The history section header: "Viimased 20 harjutust" while more pages exist.
export function historySummary(count: number, hasMore: boolean) {
  return hasMore ? `Viimased ${count} ${exerciseWord(count)}` : `${count} ${exerciseWord(count)}`;
}
