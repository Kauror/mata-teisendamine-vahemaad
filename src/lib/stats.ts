import db from '@/lib/db';
import { addAppDays, appDateRange, isoToAppDate, todayDateString } from '@/lib/appDate';
import { isKirsiAttempt } from '@/lib/history';
import { getLeaderboardHistory } from '@/lib/leaderboard';
import { sprintAttemptQualifies } from '@/lib/sprintReward';
import { type Learner } from '@/lib/tasks';

export type DailyWinner = Learner | 'tie' | null;

export type StatsChildDay = {
  exercises: number;
  correct: number;
  questions: number;
};

export type StatsDay = {
  date: string;
  kiur: StatsChildDay;
  kirsi: StatsChildDay;
  winner: DailyWinner;
  kiurTrophiesToDate: number;
  kirsiTrophiesToDate: number;
};

export type StatsChildTotals = {
  exercises: number;
  accuracyPercent: number; // 0-100, 0 when no questions answered
  trophies: number;
};

export type StatsOverview = {
  from: string;
  to: string;
  days: StatsDay[];
  maxExercisesInADay: number;
  totals: Record<Learner, StatsChildTotals>;
};

type AttemptRow = {
  id: number;
  createdAt: string;
  category: string;
  learner: string | null;
  subject: string | null;
  topic: string | null;
  score: number;
  questionCount: number;
};

function emptyChildDay(): StatsChildDay {
  return { exercises: 0, correct: 0, questions: 0 };
}

function accuracy(correct: number, questions: number) {
  return questions > 0 ? Math.round((correct / questions) * 100) : 0;
}

function statsQueryBounds(from: string, to: string) {
  // Tallinn is UTC+2/+3. A four-hour lower buffer keeps the SQL range safely
  // outside both DST offsets; the exact app-day check below remains authoritative.
  const fromInclusive = new Date(`${from}T00:00:00.000Z`);
  fromInclusive.setUTCHours(fromInclusive.getUTCHours() - 4);
  return {
    fromInclusive: fromInclusive.toISOString(),
    toExclusive: `${addAppDays(to, 1)}T00:00:00.000Z`
  };
}

// The day's winner as the trophies record it: the stored daily_leaderboard row,
// the one source the dashboard trophies and the monthly prize are counted from.
// A day with no row, or a 0–0 row, had no competition.
function storedWinners(from: string, to: string) {
  const winners = new Map<string, DailyWinner>();
  for (const row of getLeaderboardHistory().days) {
    if (row.date < from || row.date > to) continue;
    winners.set(row.date, row.kiurCount === 0 && row.kirsiCount === 0 ? null : row.winner);
  }
  return winners;
}

// Parent trophy adjustments (± karikas) made on each day of the window. The
// monthly standing applies them to the month they were made in; a rolling
// window applies them on the day they were made, which for a window covering
// the month to date is the same total.
function trophyAdjustmentsByDay(from: string, to: string) {
  const bounds = statsQueryBounds(from, to);
  const rows = db
    .prepare('SELECT learner, amount, createdAt FROM trophy_adjustments WHERE createdAt >= ? AND createdAt < ?')
    .all(bounds.fromInclusive, bounds.toExclusive) as Array<{ learner: string; amount: number; createdAt: string }>;
  const byDay = new Map<string, Record<Learner, number>>();
  for (const row of rows) {
    if (row.learner !== 'kiur' && row.learner !== 'kirsi') continue;
    const day = isoToAppDate(row.createdAt);
    if (!day || day < from || day > to) continue;
    const entry = byDay.get(day) ?? { kiur: 0, kirsi: 0 };
    entry[row.learner] += row.amount;
    byDay.set(day, entry);
  }
  return byDay;
}

// Per-day exercise counts, accuracy and the running karikas race for the last
// `windowDays` calendar days (Tallinn time), ending today. A day with no
// activity still appears as an explicit zero.
//
// Counted exactly like the trophies (SRV-05): an attempt counts only when it is
// authoritative — a protocol-v2 attempt held for review or withheld does not —
// and only a sprint that clears Kiur's threshold. Each day's winner is the
// stored daily_leaderboard winner, a day's trophy is only final once the day is
// over (today's win is shown but not yet counted, as on the dashboard), and
// parent trophy adjustments are included. Over a window that covers the
// current month to date, the totals equal getMonthlyTrophies().
export function getStatsOverview(windowDays = 30, today = todayDateString()): StatsOverview {
  const from = addAppDays(today, -(windowDays - 1));
  const dates = appDateRange(from, today);
  const byDate = new Map<string, { kiur: StatsChildDay; kirsi: StatsChildDay }>();
  for (const date of dates) byDate.set(date, { kiur: emptyChildDay(), kirsi: emptyChildDay() });
  const queryBounds = statsQueryBounds(from, today);

  const attempts = db
    .prepare(`
      SELECT id, createdAt, category, learner, subject, topic, score, questionCount
      FROM attempts
      WHERE createdAt >= ? AND createdAt < ?
        AND (protocolVersion <> 2 OR rewardSettlementStatus = 'eligible')
    `)
    .all(queryBounds.fromInclusive, queryBounds.toExclusive) as AttemptRow[];

  for (const attempt of attempts) {
    // A sprint run that does not clear Kiur's threshold earns no trophy, so it
    // is not counted here either — this mirrors the daily leaderboard.
    if (!sprintAttemptQualifies({ id: attempt.id, subject: attempt.subject, topic: attempt.topic, score: attempt.score })) continue;
    const day = isoToAppDate(attempt.createdAt);
    if (!day) continue;
    const bucket = byDate.get(day);
    if (!bucket) continue;
    const child = isKirsiAttempt(attempt.category, attempt.learner) ? bucket.kirsi : bucket.kiur;
    child.exercises += 1;
    child.correct += attempt.score;
    child.questions += attempt.questionCount;
  }

  const winners = storedWinners(from, today);
  const adjustments = trophyAdjustmentsByDay(from, today);
  let kiurTrophies = 0;
  let kirsiTrophies = 0;
  let maxExercisesInADay = 0;
  const totals: Record<Learner, StatsChildTotals> = {
    kiur: { exercises: 0, accuracyPercent: 0, trophies: 0 },
    kirsi: { exercises: 0, accuracyPercent: 0, trophies: 0 }
  };
  const kiurCorrectQ = { correct: 0, questions: 0 };
  const kirsiCorrectQ = { correct: 0, questions: 0 };

  const days: StatsDay[] = dates.map((date) => {
    const bucket = byDate.get(date) ?? { kiur: emptyChildDay(), kirsi: emptyChildDay() };
    const winner = winners.get(date) ?? null;
    if (date !== today) {
      if (winner === 'kiur') kiurTrophies += 1;
      else if (winner === 'kirsi') kirsiTrophies += 1;
    }
    const adjustment = adjustments.get(date);
    if (adjustment) {
      kiurTrophies += adjustment.kiur;
      kirsiTrophies += adjustment.kirsi;
    }

    totals.kiur.exercises += bucket.kiur.exercises;
    totals.kirsi.exercises += bucket.kirsi.exercises;
    kiurCorrectQ.correct += bucket.kiur.correct;
    kiurCorrectQ.questions += bucket.kiur.questions;
    kirsiCorrectQ.correct += bucket.kirsi.correct;
    kirsiCorrectQ.questions += bucket.kirsi.questions;
    maxExercisesInADay = Math.max(maxExercisesInADay, bucket.kiur.exercises, bucket.kirsi.exercises);

    return {
      date,
      kiur: bucket.kiur,
      kirsi: bucket.kirsi,
      winner,
      // A removed trophy can take the running sum below zero for a while; like
      // the monthly standing, the count shown never does.
      kiurTrophiesToDate: Math.max(0, kiurTrophies),
      kirsiTrophiesToDate: Math.max(0, kirsiTrophies)
    };
  });

  totals.kiur.trophies = Math.max(0, kiurTrophies);
  totals.kirsi.trophies = Math.max(0, kirsiTrophies);
  totals.kiur.accuracyPercent = accuracy(kiurCorrectQ.correct, kiurCorrectQ.questions);
  totals.kirsi.accuracyPercent = accuracy(kirsiCorrectQ.correct, kirsiCorrectQ.questions);

  return { from, to: today, days, maxExercisesInADay, totals };
}
