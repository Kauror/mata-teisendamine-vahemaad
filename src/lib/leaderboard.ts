import db from '@/lib/db';
import { isKirsiAttempt } from '@/lib/history';
import { sprintAttemptQualifies } from '@/lib/sprintReward';
import { isoToAppDate, nowIso, todayDateString } from '@/lib/tasks';
import { reconcileMonthForDate, reconcileMonthlyPrize } from '@/lib/monthlyCompetition';

// 'tie' = both children did the same number of exercises that day.
export type DailyWinner = 'kiur' | 'kirsi' | 'tie';

export type DailyLeaderboardRow = {
  date: string;
  kiurCount: number;
  kirsiCount: number;
  winner: DailyWinner;
};

type AttemptCountRow = {
  id: number;
  category: string;
  learner: string | null;
  createdAt: string;
  subject: string | null;
  topic: string | null;
  score: number;
  protocolVersion: number;
  rewardSettlementStatus: string;
  deletedAt: string | null;
};

function winnerOf(kiurCount: number, kirsiCount: number): DailyWinner {
  if (kiurCount === kirsiCount) return 'tie';
  return kiurCount > kirsiCount ? 'kiur' : 'kirsi';
}

function allAttempts(): AttemptCountRow[] {
  return db
    .prepare('SELECT id, category, learner, createdAt, subject, topic, score, protocolVersion, rewardSettlementStatus, deletedAt FROM attempts')
    .all() as AttemptCountRow[];
}

// An attempt only counts towards the daily competition when it is authoritative.
//
// RTM3-C01: a protocol-v2 attempt that was held for review or withheld (an
// unpermitted grant, clock drift, a failed catalogue check) must never affect
// the daily winner, trophy count, monthly attendance or the monthly star prize.
// The reward engine already filters these out (rewardSettlementStatus =
// 'eligible'); the leaderboard has to apply the exact same gate, otherwise a held
// attempt that is still sitting in `attempts` gets counted the moment a later
// valid attempt — or the backfill — recalculates that date. Legacy v1 attempts
// have no settlement lifecycle and continue to count under the legacy rules.
function isAuthoritativeAttempt(row: AttemptCountRow) {
  if (row.deletedAt) return false;
  if (row.protocolVersion === 2) return row.rewardSettlementStatus === 'eligible';
  return true;
}

// A sprint run that does not clear Kiur's half-of-record threshold earns no
// trophy, so it must not be counted towards the daily competition either.
function countsTowardsLeaderboard(row: AttemptCountRow) {
  return isAuthoritativeAttempt(row) && sprintAttemptQualifies(row);
}

// Counts the exercises each child completed on the given local date, using the
// same Kiur/Kirsi split as the dashboard leaderboard.
function countsForDate(date: string) {
  let kiurCount = 0;
  let kirsiCount = 0;
  for (const row of allAttempts()) {
    if (isoToAppDate(row.createdAt) !== date) continue;
    if (!countsTowardsLeaderboard(row)) continue;
    if (isKirsiAttempt(row.category, row.learner)) kirsiCount++;
    else kiurCount++;
  }
  return { kiurCount, kirsiCount };
}

function upsertLeaderboard(date: string, kiurCount: number, kirsiCount: number, winner: DailyWinner, updatedAt: string) {
  db.prepare(`
    INSERT INTO daily_leaderboard (date, kiurCount, kirsiCount, winner, updatedAt)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET
      kiurCount = excluded.kiurCount,
      kirsiCount = excluded.kirsiCount,
      winner = excluded.winner,
      updatedAt = excluded.updatedAt
  `).run(date, kiurCount, kirsiCount, winner, updatedAt);
}

let backfilled = false;

// One-time fill of past days from the existing attempt history, so the
// statistics board has data from before daily snapshots were introduced.
function backfillFromAttempts() {
  if (backfilled) return;
  const existing = db.prepare('SELECT COUNT(*) AS count FROM daily_leaderboard').get() as { count: number };
  if (existing.count === 0) {
    const byDate = new Map<string, { kiur: number; kirsi: number }>();
    for (const row of allAttempts()) {
      const date = isoToAppDate(row.createdAt);
      if (!date) continue;
      if (!countsTowardsLeaderboard(row)) continue;
      const entry = byDate.get(date) ?? { kiur: 0, kirsi: 0 };
      if (isKirsiAttempt(row.category, row.learner)) entry.kirsi++;
      else entry.kiur++;
      byDate.set(date, entry);
    }

    const now = nowIso();
    const fill = db.transaction(() => {
      for (const [date, entry] of byDate) {
        upsertLeaderboard(date, entry.kiur, entry.kirsi, winnerOf(entry.kiur, entry.kirsi), now);
      }
    });
    fill();
  }
  // Only mark done once the fill (or empty check) completed without throwing,
  // so a transient failure retries on the next call.
  backfilled = true;
}

// Snapshots the daily leaderboard standings for the given date (defaults to
// today). Called whenever an attempt is recorded so the winner stays accurate
// and is preserved for a future statistics board.
export function recordDailyLeaderboard(date = todayDateString()) {
  backfillFromAttempts();
  const { kiurCount, kirsiCount } = countsForDate(date);
  const winner = winnerOf(kiurCount, kirsiCount);
  upsertLeaderboard(date, kiurCount, kirsiCount, winner, nowIso());
  // If this date belongs to a month that was already settled (a late offline
  // attempt or a held-attempt approval landing after the month boundary), the
  // stored monthly winner and prize must be reconciled to the corrected daily
  // standings (RTM4-C01). No-op for the current, still-open month.
  reconcileMonthForDate(date);
  return { date, kiurCount, kirsiCount, winner };
}

// RTM4-H03: the eligibility filter only takes effect when a day is recalculated,
// and the one-time backfill runs only when daily_leaderboard is empty. A build
// deployed before RTM3 may have already written daily rows that counted a held
// attempt, poisoning historical standings, trophies and settled monthly awards.
// This deterministically rebuilds EVERY dated row from the attempts table using
// the corrected filter, then reconciles every settled month, so a poisoned
// history is repaired in place rather than only for future recalculations. Safe
// to run repeatedly (idempotent) as a post-deploy maintenance step.
export function rebuildDailyLeaderboard() {
  const now = nowIso();
  const dates = new Set<string>();
  for (const row of allAttempts()) {
    const date = isoToAppDate(row.createdAt);
    if (date) dates.add(date);
  }
  const rebuild = db.transaction(() => {
    // Include any date that already has a stored row so a poisoned row with no
    // remaining qualifying attempts is corrected to zero rather than left stale.
    for (const row of db.prepare('SELECT date FROM daily_leaderboard').all() as Array<{ date: string }>) dates.add(row.date);
    for (const date of dates) {
      const { kiurCount, kirsiCount } = countsForDate(date);
      upsertLeaderboard(date, kiurCount, kirsiCount, winnerOf(kiurCount, kirsiCount), now);
    }
  });
  rebuild();
  // Re-settle every already-awarded month against the corrected standings.
  const months = db.prepare('SELECT month FROM monthly_competition_awards ORDER BY month').all() as Array<{ month: string }>;
  for (const { month } of months) reconcileMonthlyPrize(month);
  return { rebuiltDates: dates.size, reconciledMonths: months.length };
}

// Full per-day history (most recent first) plus how many days each child has won.
export function getLeaderboardHistory() {
  backfillFromAttempts();
  const days = db
    .prepare('SELECT date, kiurCount, kirsiCount, winner FROM daily_leaderboard ORDER BY date DESC')
    .all() as DailyLeaderboardRow[];
  const totals = { kiur: 0, kirsi: 0, tie: 0 };
  for (const day of days) totals[day.winner] += 1;
  return { days, totals };
}
