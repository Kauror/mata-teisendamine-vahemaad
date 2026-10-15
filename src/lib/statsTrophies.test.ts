import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import db from '@/lib/db';
import { recordDailyLeaderboard } from '@/lib/leaderboard';
import { adjustTrophies, getMonthlyTrophies } from '@/lib/monthlyCompetition';
import { getStatsOverview } from '@/lib/stats';
import { getWeeklyDigest } from '@/lib/weeklyDigest';

// SRV-05: Statistika and the weekly digest count karikad from the same source
// as the dashboard and the monthly prize — the stored daily_leaderboard winner,
// the same eligibility filter, final days only, plus parent adjustments.

const TODAY = '2026-07-07';

beforeAll(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(`${TODAY}T15:00:00.000Z`));
});
afterAll(() => {
  vi.useRealTimers();
});

beforeEach(() => {
  db.exec('DELETE FROM attempts; DELETE FROM daily_leaderboard; DELETE FROM trophy_adjustments;');
});

let seq = 0;
function attempt(learner: 'kiur' | 'kirsi', date: string, status: 'eligible' | 'needs_review' | 'v1' = 'eligible', score = 8) {
  seq += 1;
  const v2 = status !== 'v1';
  db.prepare(`
    INSERT INTO attempts (createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions, learner, subject, topic,
      protocolVersion, rewardSettlementStatus)
    VALUES (?, 'Korrutamine', 'Lihtne', 10, ?, 60, '[]', ?, 'matemaatika', 'korrutamine', ?, ?)
  `).run(`${date}T09:${String(seq % 60).padStart(2, '0')}:00.000Z`, score, learner, v2 ? 2 : 1, v2 ? status : 'eligible');
}

// The previous getStatsOverview, verbatim in its counting: every attempt, the
// winner recounted from the exercise counts, today's win included.
function legacyRecount(windowDays: number, today: string) {
  const days: Array<{ date: string; kiur: { exercises: number; correct: number; questions: number }; kirsi: { exercises: number; correct: number; questions: number }; winner: string | null }> = [];
  const totals = { kiur: { exercises: 0, correct: 0, questions: 0, trophies: 0, accuracyPercent: 0 }, kirsi: { exercises: 0, correct: 0, questions: 0, trophies: 0, accuracyPercent: 0 } };
  const rows = db.prepare('SELECT createdAt, learner, score, questionCount FROM attempts').all() as Array<{ createdAt: string; learner: 'kiur' | 'kirsi'; score: number; questionCount: number }>;
  let maxExercisesInADay = 0;
  for (let offset = windowDays - 1; offset >= 0; offset--) {
    const cursor = new Date(`${today}T12:00:00Z`);
    cursor.setUTCDate(cursor.getUTCDate() - offset);
    const date = cursor.toISOString().slice(0, 10);
    const day = { date, kiur: { exercises: 0, correct: 0, questions: 0 }, kirsi: { exercises: 0, correct: 0, questions: 0 }, winner: null as string | null };
    for (const row of rows) {
      if (new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Tallinn' }).format(new Date(row.createdAt)) !== date) continue;
      day[row.learner].exercises += 1;
      day[row.learner].correct += row.score;
      day[row.learner].questions += row.questionCount;
    }
    const { kiur, kirsi } = day;
    day.winner = kiur.exercises === 0 && kirsi.exercises === 0 ? null : kiur.exercises === kirsi.exercises ? 'tie' : kiur.exercises > kirsi.exercises ? 'kiur' : 'kirsi';
    if (day.winner === 'kiur' || day.winner === 'kirsi') totals[day.winner].trophies += 1;
    for (const learner of ['kiur', 'kirsi'] as const) {
      totals[learner].exercises += day[learner].exercises;
      totals[learner].correct += day[learner].correct;
      totals[learner].questions += day[learner].questions;
    }
    maxExercisesInADay = Math.max(maxExercisesInADay, kiur.exercises, kirsi.exercises);
    days.push(day);
  }
  for (const learner of ['kiur', 'kirsi'] as const) {
    const total = totals[learner];
    total.accuracyPercent = total.questions > 0 ? Math.round((total.correct / total.questions) * 100) : 0;
  }
  return { days, totals, maxExercisesInADay };
}

function seedMonth() {
  attempt('kiur', '2026-07-03');
  attempt('kiur', '2026-07-03', 'v1');
  attempt('kirsi', '2026-07-03');
  // A tie once the held attempt is left out, as the trophies leave it out.
  attempt('kiur', '2026-07-05');
  attempt('kirsi', '2026-07-05');
  attempt('kiur', '2026-07-05', 'needs_review', 2);
  attempt('kirsi', '2026-07-06');
  // Today: Kiur leads, but the day is not over.
  attempt('kiur', TODAY);
  for (const date of ['2026-07-03', '2026-07-05', '2026-07-06', TODAY]) recordDailyLeaderboard(date);
  adjustTrophies('kirsi', 1, 'Aitas');
  adjustTrophies('kiur', 2, 'Tubli');
}

describe('karikad in Statistika and the weekly digest', () => {
  it('equal the dashboard trophies for the same data, with a held attempt and an adjustment', () => {
    seedMonth();
    const monthly = { kiur: getMonthlyTrophies('kiur', TODAY), kirsi: getMonthlyTrophies('kirsi', TODAY) };
    expect(monthly).toEqual({ kiur: 3, kirsi: 2 });

    const stats = getStatsOverview(30, TODAY);
    expect({ kiur: stats.totals.kiur.trophies, kirsi: stats.totals.kirsi.trophies }).toEqual(monthly);

    const digest = getWeeklyDigest(TODAY);
    expect({ kiur: digest.learners.kiur.trophies, kirsi: digest.learners.kirsi.trophies }).toEqual(monthly);
  });

  it('takes each day from the stored leaderboard and leaves held attempts out of every count', () => {
    seedMonth();
    const stats = getStatsOverview(7, TODAY);
    const day = (date: string) => stats.days.find((entry) => entry.date === date)!;
    expect(day('2026-07-05')).toMatchObject({ winner: 'tie', kiur: { exercises: 1, correct: 8, questions: 10 } });
    expect(day('2026-07-03').winner).toBe('kiur');
    expect(day('2026-07-04').winner).toBeNull();
    // Today's winner is shown, but its trophy only counts once the day is over.
    expect(day(TODAY)).toMatchObject({ winner: 'kiur', kiurTrophiesToDate: 3, kirsiTrophiesToDate: 2 });
    expect(day('2026-07-06')).toMatchObject({ kiurTrophiesToDate: 1, kirsiTrophiesToDate: 1 });
    expect(stats.totals.kiur.exercises).toBe(4);
  });

  it('follows a stored winner even where a recount would differ', () => {
    attempt('kiur', '2026-07-03');
    recordDailyLeaderboard('2026-07-03');
    // A row the leaderboard has not been told about yet: the trophies do not
    // count it, so the statistics must not either.
    attempt('kirsi', '2026-07-03');
    attempt('kirsi', '2026-07-03');
    const stats = getStatsOverview(30, TODAY);
    expect(stats.days.find((entry) => entry.date === '2026-07-03')!.winner).toBe('kiur');
    expect(stats.totals.kiur.trophies).toBe(getMonthlyTrophies('kiur', TODAY));
    expect(stats.totals.kirsi.trophies).toBe(getMonthlyTrophies('kirsi', TODAY));
  });

  // Differential: with no held attempts and no adjustments, everything matches
  // the previous recount exactly, except that today's still-open win is no
  // longer counted as a trophy (the one intended change besides the two above).
  it('matches the previous recount everywhere else', () => {
    let state = 7;
    const random = () => (state = (state * 1103515245 + 12345) % 2147483648) / 2147483648;
    const dates: string[] = [];
    for (let offset = 0; offset < 30; offset++) {
      const date = new Date(Date.UTC(2026, 5, 10 + offset)).toISOString().slice(0, 10);
      dates.push(date);
      for (const learner of ['kiur', 'kirsi'] as const) {
        const count = Math.floor(random() * 4);
        for (let index = 0; index < count; index++) attempt(learner, date, random() < 0.3 ? 'v1' : 'eligible', Math.floor(random() * 11));
      }
    }
    for (const date of dates) recordDailyLeaderboard(date);

    const legacy = legacyRecount(30, TODAY);
    const current = getStatsOverview(30, TODAY);
    expect(current.days.map(({ date, kiur, kirsi, winner }) => ({ date, kiur, kirsi, winner })))
      .toEqual(legacy.days.map(({ date, kiur, kirsi, winner }) => ({ date, kiur, kirsi, winner })));
    expect(current.maxExercisesInADay).toBe(legacy.maxExercisesInADay);
    for (const learner of ['kiur', 'kirsi'] as const) {
      expect(current.totals[learner].exercises).toBe(legacy.totals[learner].exercises);
      expect(current.totals[learner].accuracyPercent).toBe(legacy.totals[learner].accuracyPercent);
      const todayWin = legacy.days.at(-1)!.winner === learner ? 1 : 0;
      expect(current.totals[learner].trophies).toBe(legacy.totals[learner].trophies - todayWin);
    }
  });

  it('never shows a negative count after a removed trophy', () => {
    attempt('kiur', '2026-07-03');
    recordDailyLeaderboard('2026-07-03');
    adjustTrophies('kirsi', -2, 'Viga');
    const stats = getStatsOverview(30, TODAY);
    expect(stats.totals.kirsi.trophies).toBe(0);
    expect(getMonthlyTrophies('kirsi', TODAY)).toBe(0);
    expect(stats.days.every((entry) => entry.kirsiTrophiesToDate >= 0)).toBe(true);
  });
});
