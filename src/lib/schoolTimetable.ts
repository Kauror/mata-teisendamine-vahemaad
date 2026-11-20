import { addAppDays, APP_TIME_ZONE } from '@/lib/appDate';
import type { Learner } from '@/lib/shared/types';

// The children's school week: bells, classes, lessons, clubs and what to
// bring. It is private, so it is not in the (public) repository: the server
// reads it from SCHOOL_TIMETABLE_FILE (lib/server/schoolTimetableFile.ts), the
// page fetches it from /api/school-timetable and keeps a copy in localStorage
// so the timetable still works offline. A fictional example for tests and
// development lives in schoolTimetable.example.json. Everything below is pure;
// the client computes "now" itself in the family's timezone.

export type SubjectKey = 'mat' | 'est' | 'eng' | 'keh' | 'kun' | 'loo' | 'muu' | 'dig' | 'teh';

type Subject = { key: SubjectKey; short: string };

// `short` is what fits in one cell of the week grid on a phone.
const SUBJECTS: Record<string, Subject> = {
  'Matemaatika': { key: 'mat', short: 'Mate' },
  'Eesti keel': { key: 'est', short: 'Eesti' },
  'Inglise keel': { key: 'eng', short: 'Inglise' },
  'Kehaline kasvatus': { key: 'keh', short: 'Kehaline' },
  'Kunst / tööõpetus': { key: 'kun', short: 'Kunst' },
  'Loodusõpetus': { key: 'loo', short: 'Loodus' },
  'Muusika': { key: 'muu', short: 'Muusika' },
  'Digioskused': { key: 'dig', short: 'Digi' },
  'Tehnoloogiline avastusõpe': { key: 'teh', short: 'Tehno' }
};

export function isKnownSubject(name: string): boolean {
  return Object.hasOwn(SUBJECTS, name);
}

export function subjectOf(name: string): Subject {
  return SUBJECTS[name] ?? { key: 'mat', short: name };
}

export type Club = { name: string; start: number; end: number; icon?: string };

export type SchoolDay = {
  // Indexed by bell; null is a free period.
  lessons: ReadonlyArray<string | null>;
  clubs: ReadonlyArray<Club>;
  // What goes in the bag for this day.
  bring: ReadonlyArray<string>;
};

export type ChildTimetable = { className: string; days: ReadonlyArray<SchoolDay> };

export type SchoolTimetableData = {
  // The school bells, minutes after local midnight: [start, end] per lesson.
  bells: ReadonlyArray<readonly [number, number]>;
  children: Record<Learner, ChildTimetable>;
};

export const EMPTY_SCHOOL_TIMETABLE: SchoolTimetableData = {
  bells: [],
  children: { kiur: { className: '', days: [] }, kirsi: { className: '', days: [] } }
};

// --- The file format (school-timetable.json) -------------------------------
// { "version": 1,
//   "bells": [["08:00", "08:45"], ...],
//   "children": { "kiur": { "className": "…", "days": [ /* Monday..Friday */
//     { "lessons": [null, "Eesti keel", ...],
//       "clubs": [{ "name": "…", "start": "17:30", "end": "19:00", "icon": "…" }],
//       "bring": ["…"] } ] }, "kirsi": { … } } }

const TIME = /^([01]\d|2[0-3]):([0-5]\d)$/;

function minutesOf(value: unknown, where: string): number {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < 24 * 60) return value;
  const match = typeof value === 'string' ? TIME.exec(value) : null;
  if (!match) throw new Error(`${where}: expected a time like "08:15".`);
  return Number(match[1]) * 60 + Number(match[2]);
}

function shortText(value: unknown, where: string, max = 80): string {
  if (typeof value !== 'string' || value.trim().length === 0 || value.length > max) throw new Error(`${where}: expected text.`);
  return value;
}

function list(value: unknown, where: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`${where}: expected a list.`);
  return value;
}

function record(value: unknown, where: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error(`${where}: expected an object.`);
  return value as Record<string, unknown>;
}

// Validates a parsed school-timetable.json (or the API answer, which uses the
// same format) and turns its times into minutes. Throws with the place of the
// first problem.
export function parseSchoolTimetable(value: unknown): SchoolTimetableData {
  const root = record(value, 'timetable');
  if (root.version !== 1) throw new Error('timetable.version: expected 1.');
  const bells = list(root.bells, 'bells').map((bell, index) => {
    const pair = list(bell, `bells[${index}]`);
    if (pair.length !== 2) throw new Error(`bells[${index}]: expected [start, end].`);
    const start = minutesOf(pair[0], `bells[${index}][0]`);
    const end = minutesOf(pair[1], `bells[${index}][1]`);
    if (end <= start) throw new Error(`bells[${index}]: ends before it starts.`);
    return [start, end] as const;
  });
  if (bells.length > 12) throw new Error('bells: at most 12.');
  const childrenRecord = record(root.children, 'children');
  const child = (learner: Learner): ChildTimetable => {
    const where = `children.${learner}`;
    const raw = record(childrenRecord[learner], where);
    const className = typeof raw.className === 'string' && raw.className.length <= 20 ? raw.className : '';
    const days = list(raw.days, `${where}.days`).map((rawDay, dayIndex) => {
      const dayWhere = `${where}.days[${dayIndex}]`;
      const day = record(rawDay, dayWhere);
      const lessons = list(day.lessons, `${dayWhere}.lessons`).map((lesson, index) => {
        if (lesson === null) return null;
        const name = shortText(lesson, `${dayWhere}.lessons[${index}]`);
        if (!isKnownSubject(name)) throw new Error(`${dayWhere}.lessons[${index}]: unknown subject "${name}".`);
        return name;
      });
      if (lessons.length > bells.length) throw new Error(`${dayWhere}.lessons: more lessons than bells.`);
      const clubs = list(day.clubs ?? [], `${dayWhere}.clubs`).map((rawClub, index) => {
        const clubWhere = `${dayWhere}.clubs[${index}]`;
        const club = record(rawClub, clubWhere);
        const start = minutesOf(club.start, `${clubWhere}.start`);
        const end = minutesOf(club.end, `${clubWhere}.end`);
        if (end <= start) throw new Error(`${clubWhere}: ends before it starts.`);
        const icon = club.icon === undefined ? undefined : shortText(club.icon, `${clubWhere}.icon`, 8);
        return { name: shortText(club.name, `${clubWhere}.name`), start, end, ...(icon ? { icon } : {}) };
      });
      const bring = list(day.bring ?? [], `${dayWhere}.bring`).map((item, index) => shortText(item, `${dayWhere}.bring[${index}]`));
      return { lessons, clubs, bring };
    });
    if (days.length > 5) throw new Error(`${where}.days: Monday to Friday only.`);
    return { className, days };
  };
  return { bells, children: { kiur: child('kiur'), kirsi: child('kirsi') } };
}

// The inverse of parseSchoolTimetable, for the API answer and the offline copy.
export function serializeSchoolTimetable(data: SchoolTimetableData) {
  const time = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  const child = (timetable: ChildTimetable) => ({
    className: timetable.className,
    days: timetable.days.map((day) => ({
      lessons: [...day.lessons],
      clubs: day.clubs.map((club) => ({ name: club.name, start: time(club.start), end: time(club.end), ...(club.icon ? { icon: club.icon } : {}) })),
      bring: [...day.bring]
    }))
  });
  return {
    version: 1 as const,
    bells: data.bells.map(([start, end]) => [time(start), time(end)]),
    children: { kiur: child(data.children.kiur), kirsi: child(data.children.kirsi) }
  };
}

// --- The data in use ---------------------------------------------------------
// One timetable for the whole family. The server sets it from the file; the
// client from the API (and its offline copy). Components re-render through
// subscribeSchoolTimetable (see app/components/useAppClock.ts).

let current: SchoolTimetableData = EMPTY_SCHOOL_TIMETABLE;
let revision = 0;
const listeners = new Set<() => void>();

export function setSchoolTimetableData(data: SchoolTimetableData) {
  current = data;
  revision += 1;
  for (const listener of listeners) listener();
}

export function schoolTimetableData(): SchoolTimetableData {
  return current;
}

export function schoolTimetableRevision() {
  return revision;
}

export function subscribeSchoolTimetable(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function schoolBells(): ReadonlyArray<readonly [number, number]> {
  return current.bells;
}

export function childTimetable(learner: Learner): ChildTimetable {
  return current.children[learner];
}

// School holidays, inclusive (2026/27 school year).
export const SCHOOL_HOLIDAYS: ReadonlyArray<readonly [string, string]> = [
  ['2026-10-26', '2026-11-01'],
  ['2026-12-21', '2027-01-03'],
  ['2027-02-22', '2027-02-28'],
  ['2027-04-12', '2027-04-18'],
  ['2027-06-09', '2027-08-31']
];

// Estonian public holidays that fall on a day off school. Weekend dates are
// listed too, which costs nothing and keeps the list complete.
export const PUBLIC_HOLIDAYS: ReadonlySet<string> = new Set([
  '2026-12-24', '2026-12-25', '2026-12-26',
  '2027-01-01', '2027-02-24', '2027-03-26', '2027-03-28', '2027-05-01',
  '2027-05-16', '2027-06-23', '2027-06-24', '2027-08-20',
  '2027-12-24', '2027-12-25', '2027-12-26'
]);

export const WEEKDAY_NAMES = ['esmaspäev', 'teisipäev', 'kolmapäev', 'neljapäev', 'reede', 'laupäev', 'pühapäev'] as const;
export const WEEKDAY_LETTERS = ['E', 'T', 'K', 'N', 'R', 'L', 'P'] as const;
const WEEKDAY_SHORT = ['Esmasp.', 'Teisip.', 'Kolmap.', 'Neljap.', 'Reede', 'Laup.', 'Pühap.'] as const;

// "Now" as the family's clock sees it: the calendar date, the weekday with
// Monday as 0, and minutes since local midnight.
export type AppClock = { date: string; weekday: number; minutes: number };

const clockFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: APP_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23'
});

export function appClock(now: Date): AppClock {
  const parts = Object.fromEntries(clockFormat.formatToParts(now).map((part) => [part.type, part.value]));
  const date = `${parts.year}-${parts.month}-${parts.day}`;
  return { date, weekday: weekdayOf(date), minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

export function weekdayOf(date: string): number {
  return (new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7;
}

export function isSchoolDate(date: string): boolean {
  if (weekdayOf(date) > 4 || PUBLIC_HOLIDAYS.has(date)) return false;
  return !SCHOOL_HOLIDAYS.some(([start, end]) => date >= start && date <= end);
}

// The first school day after `date`. Looks a little beyond the summer holiday;
// null means the timetable has nothing to say that far ahead.
export function nextSchoolDate(date: string): string | null {
  for (let step = 1; step <= 100; step += 1) {
    const candidate = addAppDays(date, step);
    if (isSchoolDate(candidate)) return candidate;
  }
  return null;
}

export type ScheduleItem =
  | { kind: 'lesson'; name: string; start: number; end: number; number: number }
  | { kind: 'club'; name: string; start: number; end: number };

export function schoolDay(learner: Learner, weekday: number): SchoolDay | null {
  return current.children[learner].days[weekday] ?? null;
}

export function scheduleFor(learner: Learner, weekday: number): ScheduleItem[] {
  const day = schoolDay(learner, weekday);
  if (!day) return [];
  const items: ScheduleItem[] = [];
  day.lessons.forEach((name, index) => {
    const bell = current.bells[index];
    if (name && bell) items.push({ kind: 'lesson', name, start: bell[0], end: bell[1], number: index + 1 });
  });
  day.clubs.forEach((club) => items.push({ kind: 'club', name: club.name, start: club.start, end: club.end }));
  return items;
}

export function schoolEndsAt(learner: Learner, weekday: number): number | null {
  const lessons = scheduleFor(learner, weekday).filter((item) => item.kind === 'lesson');
  return lessons.length ? lessons[lessons.length - 1].end : null;
}

export function dayEndsAt(learner: Learner, weekday: number): number | null {
  const items = scheduleFor(learner, weekday);
  return items.length ? Math.max(...items.map((item) => item.end)) : null;
}

export type NowState =
  | { kind: 'lesson' | 'club'; item: ScheduleItem; minutesLeft: number }
  | { kind: 'break' }
  | { kind: 'home' };

// A gap this short between the end of school and a club is still spent at school.
const SHORT_GAP = 20;

// What the child is doing right now. Only ever about today.
export function nowState(learner: Learner, clock: AppClock): NowState {
  if (!isSchoolDate(clock.date)) return { kind: 'home' };
  const items = scheduleFor(learner, clock.weekday);
  const current = items.find((item) => clock.minutes >= item.start && clock.minutes < item.end);
  if (current) return { kind: current.kind, item: current, minutesLeft: current.end - clock.minutes };
  const next = items.find((item) => item.start > clock.minutes);
  const end = schoolEndsAt(learner, clock.weekday);
  const started = items.length > 0 && clock.minutes >= items[0].start;
  if (started && next && end !== null && (clock.minutes < end || next.start - clock.minutes <= SHORT_GAP)) return { kind: 'break' };
  return { kind: 'home' };
}

// Anything still to come today, including what is on right now.
export function hasMoreToday(learner: Learner, clock: AppClock): boolean {
  if (!isSchoolDate(clock.date)) return false;
  const end = dayEndsAt(learner, clock.weekday);
  return end !== null && clock.minutes < end;
}

// When the home card first appears the evening before school: on a day off
// (Sunday, the last day of a holiday) only from this time, so a whole weekend
// is not spent looking at Monday.
export const EVENING_BEFORE_SCHOOL = 18 * 60;

// The home card is shown on school days, and on the evening of a day off whose
// next day is a school day.
export function showSchoolCard(clock: AppClock): boolean {
  if (isSchoolDate(clock.date)) return true;
  return clock.minutes >= EVENING_BEFORE_SCHOOL && isSchoolDate(addAppDays(clock.date, 1));
}

export function firstLessonStart(learner: Learner, weekday: number): number | null {
  return scheduleFor(learner, weekday).find((item) => item.kind === 'lesson')?.start ?? null;
}

export type SchoolStartHint = { when: 'today' | 'tomorrow'; minutes: number };

// "Kool algab 8.15" before today's first lesson, or "Kool algab homme 9.05"
// once the child's day is over (last lesson or club) and tomorrow is a school
// day. Per child: their first lesson varies. Only while the child is home.
export function schoolStartHint(learner: Learner, clock: AppClock): SchoolStartHint | null {
  const tomorrowHint = (): SchoolStartHint | null => {
    const tomorrow = addAppDays(clock.date, 1);
    if (!isSchoolDate(tomorrow)) return null;
    const minutes = firstLessonStart(learner, weekdayOf(tomorrow));
    return minutes === null ? null : { when: 'tomorrow', minutes };
  };
  if (!isSchoolDate(clock.date)) return showSchoolCard(clock) ? tomorrowHint() : null;
  if (nowState(learner, clock).kind !== 'home') return null;
  const first = firstLessonStart(learner, clock.weekday);
  if (first !== null && clock.minutes < first) return { when: 'today', minutes: first };
  const end = dayEndsAt(learner, clock.weekday);
  return end !== null && clock.minutes >= end ? tomorrowHint() : null;
}

export type TimetableTab = 'today' | 'next' | 'week';

// Today until the last lesson ends; after that the next school day, so the bag
// can be packed before an evening club.
export function defaultTab(learner: Learner, clock: AppClock): TimetableTab {
  const end = schoolEndsAt(learner, clock.weekday);
  return isSchoolDate(clock.date) && end !== null && clock.minutes < end ? 'today' : 'next';
}

// Clubs today that have not finished yet, shown above tomorrow's list.
export function clubsLeftToday(learner: Learner, clock: AppClock): Club[] {
  if (!isSchoolDate(clock.date)) return [];
  return [...(schoolDay(learner, clock.weekday)?.clubs ?? [])].filter((club) => clock.minutes < club.end);
}

// The label on the second tab: "Homme" when the next school day is tomorrow,
// otherwise that day's short name.
export function nextTabLabel(today: string, next: string | null): string {
  if (!next) return 'Järgmine';
  return next === addAppDays(today, 1) ? 'Homme' : WEEKDAY_SHORT[weekdayOf(next)];
}

// The heading over the next school day's list: "Homme · neljapäev", or the
// weekday and date when it is further away (after a weekend or a holiday).
export function nextDayHeading(today: string, next: string): string {
  const name = WEEKDAY_NAMES[weekdayOf(next)];
  if (next === addAppDays(today, 1)) return `Homme · ${name}`;
  return `${name[0].toUpperCase()}${name.slice(1)} ${formatDayMonth(next)}`;
}

export function formatClock(minutes: number): string {
  return `${Math.floor(minutes / 60)}.${String(minutes % 60).padStart(2, '0')}`;
}

export function formatDayMonth(date: string): string {
  const [, month, day] = date.split('-').map(Number);
  return `${day}.${month}`;
}

// A club's chip appears this long before it starts: a gentle reminder, not a timetable.
export const CLUB_REMINDER_LEAD = 60;

export type HomeStatus = { kind: 'school' | 'club' | 'start'; icon: string; text: string };

// The one short line after a child's name on the home page. At school until the
// last bell; a club from an hour before it starts until it ends; and when school
// starts, in the morning before it or from the evening before (18.00). Nothing
// otherwise, so a weekend afternoon shows no chip at all.
export function homeStatus(learner: Learner, clock: AppClock): HomeStatus | null {
  if (isSchoolDate(clock.date)) {
    const state = nowState(learner, clock);
    const end = schoolEndsAt(learner, clock.weekday);
    if ((state.kind === 'lesson' || state.kind === 'break') && end !== null && clock.minutes < end) {
      return { kind: 'school', icon: '🏫', text: `koolis kuni ${formatClock(end)}` };
    }
    const club = (schoolDay(learner, clock.weekday)?.clubs ?? []).find((item) => clock.minutes < item.end && item.start - clock.minutes <= CLUB_REMINDER_LEAD);
    if (club) return { kind: 'club', icon: club.icon ?? '⏰', text: `${club.name} ${formatClock(club.start)}` };
  }
  const hint = schoolStartHint(learner, clock);
  if (!hint || (hint.when === 'tomorrow' && clock.minutes < EVENING_BEFORE_SCHOOL)) return null;
  return { kind: 'start', icon: '🎒', text: `kool algab ${formatClock(hint.minutes)}` };
}
