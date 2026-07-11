import db from '@/lib/db';
import { addAppDays, appDateRange, isoToAppDate, todayDateString } from '@/lib/appDate';
import { isKirsiAttempt } from '@/lib/history';
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

function winnerOf(kiur: number, kirsi: number): DailyWinner {
  if (kiur === 0 && kirsi === 0) return null;
  if (kiur === kirsi) return 'tie';
  return kiur > kirsi ? 'kiur' : 'kirsi';
}

function accuracy(correct: number, questions: number) {
  return questions > 0 ? Math.round((correct / questions) * 100) : 0;
}

// Per-day exercise counts, accuracy and the running karikas race for the last
// `windowDays` calendar days (Tallinn time), ending today. Everything is derived
// from the attempts table so exercises and accuracy come from one consistent
// pass; a day with no activity still appears as an explicit zero.
export function getStatsOverview(windowDays = 30, today = todayDateString()): StatsOverview {
  const from = addAppDays(today, -(windowDays - 1));
  const dates = appDateRange(from, today);
  const byDate = new Map<string, { kiur: StatsChildDay; kirsi: StatsChildDay }>();
  for (const date of dates) byDate.set(date, { kiur: emptyChildDay(), kirsi: emptyChildDay() });

  const attempts = db
    .prepare('SELECT id, createdAt, category, learner, subject, topic, score, questionCount FROM attempts')
    .all() as AttemptRow[];

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
    const winner = winnerOf(bucket.kiur.exercises, bucket.kirsi.exercises);
    if (winner === 'kiur') kiurTrophies += 1;
    else if (winner === 'kirsi') kirsiTrophies += 1;

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
      kiurTrophiesToDate: kiurTrophies,
      kirsiTrophiesToDate: kirsiTrophies
    };
  });

  totals.kiur.trophies = kiurTrophies;
  totals.kirsi.trophies = kirsiTrophies;
  totals.kiur.accuracyPercent = accuracy(kiurCorrectQ.correct, kiurCorrectQ.questions);
  totals.kirsi.accuracyPercent = accuracy(kirsiCorrectQ.correct, kirsiCorrectQ.questions);

  return { from, to: today, days, maxExercisesInADay, totals };
}
