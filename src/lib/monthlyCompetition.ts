import db from '@/lib/db';
import { nowIso, todayDateString, type Learner } from '@/lib/tasks';

// The monthly competition is derived from the daily leaderboard: each day one
// child can win (more exercises that day = one trophy). Over a calendar month
// the child with the most trophies wins a parent-configured star prize, which
// is auto-awarded once the month is over. Ties award nothing.

const PRIZE_KEY = 'monthly_trophy_prize_stars';
const DEFAULT_PRIZE_STARS = 10;
const MAX_PRIZE_STARS = 1000;

export type MonthlyStanding = {
  month: string; // 'YYYY-MM'
  kiurTrophies: number;
  kirsiTrophies: number;
  kiurExercises: number;
  kirsiExercises: number;
  leader: Learner | 'tie';
};

export type MonthlyCelebration = {
  month: string;
  trophies: number;
  exercises: number;
  prizeStars: number;
};

function monthOf(date: string) {
  return date.slice(0, 7);
}

function previousMonth(date: string) {
  const [year, month] = date.split('-').map(Number);
  const cursor = new Date(Date.UTC(year, month - 1, 1));
  cursor.setUTCMonth(cursor.getUTCMonth() - 1);
  return `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, '0')}`;
}

type DayRow = { kiurCount: number; kirsiCount: number; winner: string };

function standingForMonth(month: string): MonthlyStanding {
  const rows = db
    .prepare('SELECT kiurCount, kirsiCount, winner FROM daily_leaderboard WHERE substr(date, 1, 7) = ?')
    .all(month) as DayRow[];
  let kiurTrophies = 0;
  let kirsiTrophies = 0;
  let kiurExercises = 0;
  let kirsiExercises = 0;
  for (const row of rows) {
    if (row.winner === 'kiur') kiurTrophies += 1;
    else if (row.winner === 'kirsi') kirsiTrophies += 1;
    kiurExercises += row.kiurCount;
    kirsiExercises += row.kirsiCount;
  }
  const leader: Learner | 'tie' = kiurTrophies === kirsiTrophies ? 'tie' : kiurTrophies > kirsiTrophies ? 'kiur' : 'kirsi';
  return { month, kiurTrophies, kirsiTrophies, kiurExercises, kirsiExercises, leader };
}

export function getMonthlyStanding(today = todayDateString()): MonthlyStanding {
  return standingForMonth(monthOf(today));
}

// Trophies the child has earned so far in the current month.
export function getMonthlyTrophies(learner: Learner, today = todayDateString()) {
  const standing = standingForMonth(monthOf(today));
  return learner === 'kiur' ? standing.kiurTrophies : standing.kirsiTrophies;
}

export function getMonthlyPrizeStars(): number {
  const row = db.prepare('SELECT value FROM parent_settings WHERE key = ?').get(PRIZE_KEY) as { value: string } | undefined;
  if (!row) return DEFAULT_PRIZE_STARS;
  const value = Number(row.value);
  return Number.isFinite(value) ? value : DEFAULT_PRIZE_STARS;
}

export function setMonthlyPrizeStars(value: number): number {
  const clean = Math.round(Number(value) * 10) / 10;
  if (!Number.isFinite(clean) || clean < 0 || clean > MAX_PRIZE_STARS) {
    throw new Error(`Auhind peab olema 0-${MAX_PRIZE_STARS} tähte.`);
  }
  db.prepare(`
    INSERT INTO parent_settings (key, value, updatedAt)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt
  `).run(PRIZE_KEY, String(clean), nowIso());
  return clean;
}

type AwardRow = {
  winner: string;
  kiurTrophies: number;
  kirsiTrophies: number;
  kiurExercises: number;
  kirsiExercises: number;
  prizeStars: number;
};

// Settles the previous calendar month exactly once: records the standings and,
// if there is a clear winner and a prize is set, credits the winner's stars.
// Idempotent via the month primary key, so it is safe to call on every load.
export function ensureMonthlyPrizeAwarded(today = todayDateString()) {
  const month = previousMonth(today);
  const existing = db.prepare('SELECT month FROM monthly_competition_awards WHERE month = ?').get(month);
  if (existing) return;

  const standing = standingForMonth(month);
  // No activity at all in that month → nothing to settle, leave it open so a
  // late backfill could still record real standings later.
  if (standing.kiurTrophies === 0 && standing.kirsiTrophies === 0) return;

  const prizeStars = getMonthlyPrizeStars();
  const createdAt = nowIso();

  const settle = db.transaction(() => {
    if (db.prepare('SELECT month FROM monthly_competition_awards WHERE month = ?').get(month)) return;

    let ledgerEntryId: number | null = null;
    let awardedStars = 0;
    if (standing.leader !== 'tie' && prizeStars > 0) {
      const trophies = standing.leader === 'kiur' ? standing.kiurTrophies : standing.kirsiTrophies;
      const exercises = standing.leader === 'kiur' ? standing.kiurExercises : standing.kirsiExercises;
      const ledger = db.prepare(`
        INSERT INTO point_ledger (learner, amount, source, sourceId, description, createdAt, metadataJson)
        VALUES (?, ?, 'monthly_trophy_prize', NULL, ?, ?, ?)
      `).run(standing.leader, prizeStars, `Kuu võitja auhind: ${month}`, createdAt, JSON.stringify({ month, trophies, exercises }));
      ledgerEntryId = Number(ledger.lastInsertRowid);
      awardedStars = prizeStars;
    }

    db.prepare(`
      INSERT INTO monthly_competition_awards (month, winner, kiurTrophies, kirsiTrophies, kiurExercises, kirsiExercises, prizeStars, ledgerEntryId, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(month, standing.leader, standing.kiurTrophies, standing.kirsiTrophies, standing.kiurExercises, standing.kirsiExercises, awardedStars, ledgerEntryId, createdAt);
  });
  settle();
}

// On the first day of the month, the previous month's winner sees a celebratory
// recap. Returns null on any other day, or for the child who did not win.
export function getMonthlyCelebration(learner: Learner, today = todayDateString()): MonthlyCelebration | null {
  if (!today.endsWith('-01')) return null;
  const month = previousMonth(today);
  const award = db
    .prepare('SELECT winner, kiurTrophies, kirsiTrophies, kiurExercises, kirsiExercises, prizeStars FROM monthly_competition_awards WHERE month = ?')
    .get(month) as AwardRow | undefined;
  if (!award || award.winner !== learner) return null;
  return {
    month,
    trophies: learner === 'kiur' ? award.kiurTrophies : award.kirsiTrophies,
    exercises: learner === 'kiur' ? award.kiurExercises : award.kirsiExercises,
    prizeStars: award.prizeStars
  };
}
