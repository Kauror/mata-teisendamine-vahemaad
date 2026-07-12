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

function daysInMonth(month: string) {
  const [year, m] = month.split('-').map(Number);
  // Day 0 of the next month is the last day of this month.
  return new Date(Date.UTC(year, m, 0)).getUTCDate();
}

// Number of days in the month on which the child completed at least one
// exercise (daily_leaderboard holds one row per active day with that child's
// exercise count).
function activeDaysInMonth(month: string, learner: Learner) {
  const column = learner === 'kiur' ? 'kiurCount' : 'kirsiCount';
  const row = db
    .prepare(`SELECT COUNT(*) AS days FROM daily_leaderboard WHERE substr(date, 1, 7) = ? AND ${column} > 0`)
    .get(month) as { days: number } | undefined;
  return row?.days ?? 0;
}

// The monthly prize is only awarded if the winner was consistent: they must have
// practiced on more than half of the calendar days of that month.
function metPrizeAttendance(month: string, learner: Learner) {
  return activeDaysInMonth(month, learner) * 2 > daysInMonth(month);
}

function previousMonth(date: string) {
  const [year, month] = date.split('-').map(Number);
  const cursor = new Date(Date.UTC(year, month - 1, 1));
  cursor.setUTCMonth(cursor.getUTCMonth() - 1);
  return `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, '0')}`;
}

type DayRow = { date: string; kiurCount: number; kirsiCount: number; winner: string };

// Manual trophy add/remove a parent made within the given month. Trophies are
// otherwise derived from daily wins, so these adjustments are layered on top.
// Bucketed by the stored Kiev `month` so it lines up with the daily standings
// (createdAt is UTC and would skew rows near a month boundary).
function trophyAdjustmentsForMonth(month: string): Record<Learner, number> {
  const rows = db
    .prepare('SELECT learner, COALESCE(SUM(amount), 0) AS total FROM trophy_adjustments WHERE month = ? GROUP BY learner')
    .all(month) as Array<{ learner: string; total: number }>;
  const totals: Record<Learner, number> = { kiur: 0, kirsi: 0 };
  for (const row of rows) {
    if (row.learner === 'kiur' || row.learner === 'kirsi') totals[row.learner] = row.total;
  }
  return totals;
}

// `excludeDate` (usually today) is still an open day: its winner can change
// until midnight, so we show the live standing in the leaderboard but do not
// award its trophy yet. Passing no date settles every day of the month, which
// is what the previous-month prize does.
function standingForMonth(month: string, excludeDate?: string): MonthlyStanding {
  const rows = db
    .prepare('SELECT date, kiurCount, kirsiCount, winner FROM daily_leaderboard WHERE substr(date, 1, 7) = ?')
    .all(month) as DayRow[];
  let kiurTrophies = 0;
  let kirsiTrophies = 0;
  let kiurExercises = 0;
  let kirsiExercises = 0;
  for (const row of rows) {
    // A day's trophy is only final once the day is over.
    if (row.date !== excludeDate) {
      if (row.winner === 'kiur') kiurTrophies += 1;
      else if (row.winner === 'kirsi') kirsiTrophies += 1;
    }
    kiurExercises += row.kiurCount;
    kirsiExercises += row.kirsiCount;
  }
  const adjustments = trophyAdjustmentsForMonth(month);
  kiurTrophies = Math.max(0, kiurTrophies + adjustments.kiur);
  kirsiTrophies = Math.max(0, kirsiTrophies + adjustments.kirsi);
  const leader: Learner | 'tie' = kiurTrophies === kirsiTrophies ? 'tie' : kiurTrophies > kirsiTrophies ? 'kiur' : 'kirsi';
  return { month, kiurTrophies, kirsiTrophies, kiurExercises, kirsiExercises, leader };
}

// Parent-driven trophy change (add or subtract), mirroring manual star
// adjustments. Counts towards the current month's competition. Returns the
// updated standings.
export function adjustTrophies(learner: Learner, amount: number, reason: string): MonthlyStanding {
  const value = Math.trunc(Number(amount));
  if (!Number.isInteger(value) || value === 0) throw new Error('Karikate arv peab olema täisarv ja mitte null.');
  const clean = reason ? String(reason).slice(0, 200) : null;
  const today = todayDateString();
  db.prepare('INSERT INTO trophy_adjustments (learner, month, amount, reason, createdAt) VALUES (?, ?, ?, ?, ?)').run(learner, monthOf(today), value, clean, nowIso());
  return getMonthlyStanding(today);
}

export function getMonthlyStanding(today = todayDateString()): MonthlyStanding {
  return standingForMonth(monthOf(today), today);
}

// Trophies the child has earned so far in the current month, counting only days
// that are already over (today's win is still provisional until midnight).
export function getMonthlyTrophies(learner: Learner, today = todayDateString()) {
  const standing = standingForMonth(monthOf(today), today);
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
    if (standing.leader !== 'tie' && prizeStars > 0 && metPrizeAttendance(month, standing.leader)) {
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

function roundStars(value: number) {
  return Math.round(value * 100) / 100;
}

// Stars already credited to a learner for this month's prize (the sum of the
// original award plus every later compensating reconciliation entry).
function appliedMonthlyPrize(month: string): Record<Learner, number> {
  const rows = db.prepare(`
    SELECT learner, COALESCE(SUM(amount), 0) AS total
    FROM point_ledger
    WHERE source = 'monthly_trophy_prize' AND json_extract(metadataJson, '$.month') = ?
    GROUP BY learner
  `).all(month) as Array<{ learner: string; total: number }>;
  const applied: Record<Learner, number> = { kiur: 0, kirsi: 0 };
  for (const row of rows) {
    if (row.learner === 'kiur' || row.learner === 'kirsi') applied[row.learner] = row.total;
  }
  return applied;
}

export type MonthlyReconciliation = {
  month: string;
  changed: boolean;
  winner: Learner | 'tie';
  deltas: Record<Learner, number>;
};

// RTM4-C01: a settled month is not frozen. Offline attempts can legitimately
// arrive after the month has already been awarded (device offline across the
// month boundary), and a parent can approve an old held attempt; both change the
// affected month's daily standings and trophies. This recomputes an
// already-settled month and writes idempotent compensating ledger entries so the
// winner, the stored standing and the credited stars follow the corrected data.
//
// Deterministic and idempotent: it credits each learner the difference between
// the prize they *should* now hold and what they were already paid, so re-running
// with unchanged data is a no-op and a changed winner both revokes the old prize
// and grants the new one. No-op until the month has actually been settled
// (ensureMonthlyPrizeAwarded owns the first settlement).
export function reconcileMonthlyPrize(month: string): MonthlyReconciliation | null {
  const existing = db.prepare('SELECT winner, prizeStars FROM monthly_competition_awards WHERE month = ?').get(month) as
    | { winner: string; prizeStars: number }
    | undefined;
  if (!existing) return null;

  const standing = standingForMonth(month);
  const prizeStars = getMonthlyPrizeStars();
  const eligibleWinner: Learner | null =
    standing.leader !== 'tie' && prizeStars > 0 && metPrizeAttendance(month, standing.leader) ? standing.leader : null;
  const target: Record<Learner, number> = { kiur: 0, kirsi: 0 };
  if (eligibleWinner) target[eligibleWinner] = prizeStars;

  const now = nowIso();
  const deltas: Record<Learner, number> = { kiur: 0, kirsi: 0 };

  const settle = db.transaction((): boolean => {
    const applied = appliedMonthlyPrize(month);
    let changed = false;
    for (const learner of ['kiur', 'kirsi'] as Learner[]) {
      const delta = roundStars(target[learner] - applied[learner]);
      deltas[learner] = delta;
      if (delta === 0) continue;
      // A distinct revision per learner keeps the idempotency key unique across
      // successive reconciliations while still deduping an identical re-run.
      const revision = (db.prepare(
        "SELECT COUNT(*) AS count FROM point_ledger WHERE source = 'monthly_trophy_prize' AND learner = ? AND json_extract(metadataJson, '$.month') = ?"
      ).get(learner, month) as { count: number }).count;
      const idempotencyKey = `monthly:v2:${month}:${learner}:${revision}`;
      db.prepare(`
        INSERT OR IGNORE INTO point_ledger (learner, amount, source, sourceId, description, createdAt, metadataJson, effectiveDate, idempotencyKey)
        VALUES (?, ?, 'monthly_trophy_prize', NULL, ?, ?, ?, ?, ?)
      `).run(
        learner,
        delta,
        `Kuu võitja auhinna korrigeerimine: ${month}`,
        now,
        JSON.stringify({ month, reconciled: true, delta, revision }),
        `${month}-01`,
        idempotencyKey
      );
      changed = true;
    }

    // Reflect the corrected standings and winner on the stored award row.
    const awardedStars = eligibleWinner ? target[eligibleWinner] : 0;
    if (changed || existing.winner !== standing.leader || existing.prizeStars !== awardedStars) {
      db.prepare(`
        UPDATE monthly_competition_awards
        SET winner = ?, kiurTrophies = ?, kirsiTrophies = ?, kiurExercises = ?, kirsiExercises = ?, prizeStars = ?
        WHERE month = ?
      `).run(standing.leader, standing.kiurTrophies, standing.kirsiTrophies, standing.kiurExercises, standing.kirsiExercises, awardedStars, month);
      changed = true;
    }
    return changed;
  });

  const changed = settle();
  return { month, changed, winner: standing.leader, deltas };
}

// Reconcile the settled month that a given completion date falls in, if any. The
// current (open) month has no award row yet, so this is a cheap no-op there.
export function reconcileMonthForDate(date: string): MonthlyReconciliation | null {
  if (!date) return null;
  return reconcileMonthlyPrize(monthOf(date));
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
