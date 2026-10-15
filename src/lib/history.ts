import { APP_TIME_ZONE, isoToAppDate, previousAppDate, todayDateString } from '@/lib/appDate';
import { LEARNING_EXERCISE_SUBJECT_LABELS, type LearningExerciseSubject } from '@/lib/shared/types';

export const KIRSI_CATEGORIES = new Set([
  'Arvutamine 10 piires',
  'Arvutamine 20 piires',
  'Suurem või väiksem kuni 100',
  'Segaülesanded',
  'Lugemine - pilt ja sõna',
  'Lugemine - esimene häälik'
]);

export function isKirsiAttempt(category: string, learner?: string | null) {
  if (learner === 'kirsi') return true;
  if (learner === 'kiur') return false;
  return KIRSI_CATEGORIES.has(category);
}

export function learnerLabel(category: string, learner?: string | null) {
  return isKirsiAttempt(category, learner) ? 'Kirsi' : 'Kiur';
}

// Estonian takes the partitive after a number ("5 karikat") and the bare
// nominative after exactly 1 ("1 karikas"). Zero takes the partitive too. Every
// counted noun the child sees goes through one of these, so a live number can
// never produce "1 karikat".
export function trophyWord(count: number) {
  return count === 1 ? 'karikas' : 'karikat';
}

export function dayWord(count: number) {
  return count === 1 ? 'päev' : 'päeva';
}

// Stars can be fractional, so the word follows the number as it is written, not
// the raw value: formatStars(1.04) prints "1" and must read "täht", while 1,5
// prints "1,5" and stays partitive. Takes the formatted string for that reason.
export function starWord(formattedStars: string) {
  return formattedStars === '1' ? 'täht' : 'tähte';
}

// Counts of finished exercise sessions ("attempts"), not of individual
// questions. Everything that shows one of these numbers — the home leaderboard,
// the monthly celebration, the parent library — counts attempt rows, so the
// noun has to be "harjutus", not "ülesanne".
export function exerciseWord(count: number) {
  return count === 1 ? 'harjutus' : 'harjutust';
}

// Parent-screen counts: chores ("tegevus"), shop items ("ese"), streak prizes
// ("auhind") and history rows ("kirje"). Same rule as above — nominative after
// exactly 1, partitive otherwise.
export function taskWord(count: number) {
  return count === 1 ? 'tegevus' : 'tegevust';
}

export function itemWord(count: number) {
  return count === 1 ? 'ese' : 'eset';
}

export function prizeWord(count: number) {
  return count === 1 ? 'auhind' : 'auhinda';
}

export function entryWord(count: number) {
  return count === 1 ? 'kirje' : 'kirjet';
}

// What the tug-of-war bar says out loud. The bar itself only shows two numbers,
// so this sentence is the whole story for anyone using a screen reader — it is
// both the tooltip and the accessible name.
export function todayStandingsSummary(kiur: number, kirsi: number) {
  if (kiur === 0 && kirsi === 0) return 'Täna pole veel keegi harjutanud.';
  const lead = kiur === kirsi ? 'Seis on viigis.' : kiur > kirsi ? 'Kiur juhib.' : 'Kirsi juhib.';
  return `Täna on Kiur teinud ${kiur} ${exerciseWord(kiur)}, Kirsi ${kirsi} ${exerciseWord(kirsi)}. ${lead}`;
}

// Counts of individual questions, e.g. how many mistakes are waiting in the
// remediation pool. One mistake_pool row is one question, not one session.
export function questionWord(count: number) {
  return count === 1 ? 'ülesanne' : 'ülesannet';
}

// A protocol-v2 attempt whose stars are held pending parent review (RTM3-H02).
// The child sees a completed result with no stars; without this the row is
// indistinguishable from an ordinary confirmed attempt that simply earned zero.
export function isHeldReward(status?: string | null): boolean {
  return status === 'withheld' || status === 'needs_review';
}

// Shown to the child in the history list, the local result and the server result
// detail whenever an attempt is held for parent approval (RTM3-H02).
export const HELD_REWARD_MESSAGE = 'Tulemus on salvestatud. Tähed ootavad vanema kinnitust.';


// Today's row out of the stored daily standings (/api/leaderboard). Kept pure
// and separate from the fetch so the "which row is today, and what if there
// isn't one" decision is testable: there is no row until the first attempt of
// the day is recorded, and the board is ordered newest-first but the newest row
// is not necessarily today's.
export type DailyStandingsRow = { date: string; kiurCount: number; kirsiCount: number };

export function todayStandings(days: DailyStandingsRow[] | undefined | null, today = todayDateString()) {
  const row = days?.find((day) => day.date === today);
  return { kiur: row?.kiurCount ?? 0, kirsi: row?.kirsiCount ?? 0 };
}

export function scorePercent(score: number, questionCount: number) {
  if (!Number.isFinite(score) || !Number.isFinite(questionCount) || questionCount <= 0) return 0;
  return Math.round((score / questionCount) * 100);
}

export function isTodayIso(createdAt: string) {
  return isoToAppDate(createdAt) === todayDateString();
}

export function relativeDateTimeLabel(createdAt: string) {
  const day = isoToAppDate(createdAt);
  const today = todayDateString();
  const time = new Date(createdAt).toLocaleTimeString('et-EE', { hour: '2-digit', minute: '2-digit', timeZone: APP_TIME_ZONE });

  if (day === today) return `täna ${time}`;
  if (day === previousAppDate(today)) return `eile ${time}`;
  const date = new Date(createdAt).toLocaleDateString('et-EE', { day: '2-digit', month: '2-digit', timeZone: APP_TIME_ZONE });
  return `${date} ${time}`;
}

// Attempt subjects are a superset of the catalogue subjects: 'kordamine' is a
// synthetic subject that no catalogue entry has, and an unrecognised value is
// shown as-is rather than guessed at.
export function subjectLabel(subject?: string | null) {
  if (subject === 'kordamine') return 'Kordamine';
  if (!subject) return 'Matemaatika';
  return LEARNING_EXERCISE_SUBJECT_LABELS[subject as LearningExerciseSubject] ?? subject;
}

export function compactTopicLabel(topic?: string | null, category?: string | null) {
  if (topic === 'kordamine' || category === 'Kordamine') return 'Kordamine';
  if (topic === 'harjutamine') return 'Harjutamine';
  if (topic === 'sprint') return 'Sprint';
  if (topic === 'sonavara') return 'Sõnavara';
  if (topic === 'loe-ja-vasta') return 'Loe ja vasta';
  if (topic === 'pilt-ja-sona') return 'Pilt ja sõna';
  if (topic === 'esimene-haalik') return 'Esimene häälik';
  if (topic === 'mootuhikud-pikkused' || topic === 'pikkused') return 'Mõõtühikud';
  if (topic === 'jagamine-kahekohaline-uhekohaline') return 'Kahekohalise arvu jagamine';
  if (topic === 'arvud-10000' || topic === 'arvud-10000-piires') return 'Arvud 10k piires';
  if (topic === 'ring-ja-ringjoon') return 'Ring ja ringjoon';
  if (topic === 'korrutamine') return 'Korrutamine';
  if (topic === 'tekstulesanded') return 'Tekstülesanded';
  if (topic === 'arvutamine') return 'Arvutamine';
  if (topic === 'loendamine') return 'Loendamine';
  if (topic === 'mustrid') return 'Mustrid';
  if (topic === 'segaharjutus') return 'Segaharjutus';
  return category || '';
}


export type AttemptLike = { createdAt: string };

export function dayLabel(createdAt: string) {
  const day = isoToAppDate(createdAt);
  const today = todayDateString();
  if (day === today) return 'Täna';
  if (day === previousAppDate(today)) return 'Eile';
  return new Date(createdAt).toLocaleDateString('et-EE', { timeZone: APP_TIME_ZONE });
}

// "September 2026" for an app-date month key "2026-09".
export function monthLabel(monthKey: string) {
  const [year, month] = monthKey.split('-').map(Number);
  const label = new Date(Date.UTC(year, month - 1, 15)).toLocaleDateString('et-EE', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export type HistoryMonthGroup<T> = { key: string; label: string; items: T[]; days: Map<string, T[]> };

// The history page shows the current month day by day; each earlier month is
// one group of its own (collapsed on the page) holding its days. "Täna" and
// "Eile" always stay at the top level, even on the first day of a month.
// Items must already be sorted newest first.
export function groupHistoryByMonth<T>(items: T[], dateOf: (item: T) => string, today = todayDateString()) {
  const currentMonth = today.slice(0, 7);
  const recentDays = new Map<string, T[]>();
  const months = new Map<string, HistoryMonthGroup<T>>();
  for (const item of items) {
    const iso = dateOf(item);
    const day = dayLabel(iso);
    const month = (isoToAppDate(iso) ?? iso.slice(0, 10)).slice(0, 7);
    if (month === currentMonth || day === 'Täna' || day === 'Eile') {
      recentDays.set(day, [...(recentDays.get(day) ?? []), item]);
      continue;
    }
    const group = months.get(month) ?? { key: month, label: monthLabel(month), items: [], days: new Map<string, T[]>() };
    group.items.push(item);
    group.days.set(day, [...(group.days.get(day) ?? []), item]);
    months.set(month, group);
  }
  return { recentDays, months: [...months.values()] };
}
