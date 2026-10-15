import db from '@/lib/db';
import { isKirsiAttempt } from '@/lib/history';
import { addAppDays } from '@/lib/appDate';
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
  category: string;
  learner: string | null;
  createdAt: string;
  subject: string | null;
  topic: string | null;
  protocolVersion: number | null;
  rewardSettlementStatus: string;
  // The persisted Kiur sprint qualification (sprintQualification.ts), read in
  // the same query instead of one lookup per sprint row.
  sprintQualified: number | null;
};

const ATTEMPT_COUNT_COLUMNS = 'category, learner, createdAt, subject, topic, protocolVersion, rewardSettlementStatus, sprintQualified';

function winnerOf(kiurCount: number, kirsiCount: number): DailyWinner {
  if (kiurCount === kirsiCount) return 'tie';
  return kiurCount > kirsiCount ? 'kiur' : 'kirsi';
}

function allAttempts(): AttemptCountRow[] {
  return db.prepare(`SELECT ${ATTEMPT_COUNT_COLUMNS} FROM attempts`).all() as AttemptCountRow[];
}

// SRV-08: the attempts that can fall on one app date, without reading the whole
// table. createdAt is text, so the SQL range is on its leading 'YYYY-MM-DD'.
// A timestamp whose Tallinn date (UTC+2/+3) is `date` carries a written date
// between date-2 and date+1 for any UTC offset up to ±23:59 (RFC 3339, which
// protocol v2 enforces); a bare date or an offset-less local time lands inside
// too. This is wider than the four-hour bracket stats.ts uses because a client
// may send an offset other than Tallinn's. The exact isoToAppDate check in
// countsForDate stays authoritative; the window only bounds what is read.
//
// A legacy createdAt that does not start with a date would sort outside every
// date window, so such rows are read separately and go through the same exact
// date check. That read scans only the createdAt index (no row data) and is
// empty in practice: every current writer stores an RFC 3339 timestamp.
export const UNDATED_ATTEMPTS_SQL = `
  SELECT ${ATTEMPT_COUNT_COLUMNS} FROM attempts WHERE id IN (
    SELECT id FROM attempts WHERE createdAt NOT GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]*'
  )`;

function attemptsNearDate(date: string): AttemptCountRow[] {
  const inWindow = db
    .prepare(`SELECT ${ATTEMPT_COUNT_COLUMNS} FROM attempts WHERE createdAt >= ? AND createdAt < ?`)
    .all(addAppDays(date, -2), addAppDays(date, 2)) as AttemptCountRow[];
  const undated = db.prepare(UNDATED_ATTEMPTS_SQL).all() as AttemptCountRow[];
  return undated.length === 0 ? inWindow : [...inWindow, ...undated];
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
  // `deletedAt` is history visibility only; hiding must not silently revise a
  // historical competition result.
  if (row.protocolVersion === 2) return row.rewardSettlementStatus === 'eligible';
  return true;
}

// A sprint run that does not clear Kiur's half-of-record threshold earns no
// trophy, so it must not be counted towards the daily competition either. Same
// rule as sprintAttemptQualifies (sprintReward.ts): a non-sprint attempt always
// qualifies, a sprint only when its persisted sprintQualified is 1.
function sprintQualifies(row: AttemptCountRow) {
  if (row.subject !== 'inglise-keel' || row.topic !== 'sprint') return true;
  return row.sprintQualified === 1;
}

function countsTowardsLeaderboard(row: AttemptCountRow) {
  return isAuthoritativeAttempt(row) && sprintQualifies(row);
}

// Kiur/Kirsi counts per app date for the given rows, one date conversion each.
// `seenDates`, when given, collects the date of every parseable row, counting
// or not.
function countByDate(rows: AttemptCountRow[], seenDates?: Set<string>) {
  const byDate = new Map<string, { kiur: number; kirsi: number }>();
  for (const row of rows) {
    const date = isoToAppDate(row.createdAt);
    if (!date) continue;
    seenDates?.add(date);
    if (!countsTowardsLeaderboard(row)) continue;
    const entry = byDate.get(date) ?? { kiur: 0, kirsi: 0 };
    if (isKirsiAttempt(row.category, row.learner)) entry.kirsi++;
    else entry.kiur++;
    byDate.set(date, entry);
  }
  return byDate;
}

// Counts the exercises each child completed on the given local date, using the
// same Kiur/Kirsi split as the dashboard leaderboard.
function countsForDate(date: string) {
  let kiurCount = 0;
  let kirsiCount = 0;
  for (const row of attemptsNearDate(date)) {
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
    const byDate = countByDate(allAttempts());
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
  const rebuild = db.transaction(() => {
    // SRV-08: one pass over attempts grouped by app date, not one full scan per
    // date. Every date with any attempt (counting or not) is rewritten.
    const counts = countByDate(allAttempts(), dates);
    // Include any date that already has a stored row so a poisoned row with no
    // remaining qualifying attempts is corrected to zero rather than left stale.
    for (const row of db.prepare('SELECT date FROM daily_leaderboard').all() as Array<{ date: string }>) dates.add(row.date);
    for (const date of dates) {
      const entry = counts.get(date) ?? { kiur: 0, kirsi: 0 };
      upsertLeaderboard(date, entry.kiur, entry.kirsi, winnerOf(entry.kiur, entry.kirsi), now);
    }
  });
  rebuild();
  // Re-settle every already-awarded month against the corrected standings.
  const months = db.prepare('SELECT month FROM monthly_competition_awards ORDER BY month').all() as Array<{ month: string }>;
  for (const { month } of months) reconcileMonthlyPrize(month);
  return { rebuiltDates: dates.size, reconciledMonths: months.length };
}

// One day's stored standings, for the home page. Same backfill as the full
// history, so a fresh database still shows today's counts, but it reads only
// that day's row. No row yet (nothing recorded today) is 0–0, exactly what
// todayStandings() makes of the full board.
export function getDailyStandings(date = todayDateString()) {
  backfillFromAttempts();
  const row = db
    .prepare('SELECT kiurCount, kirsiCount FROM daily_leaderboard WHERE date = ?')
    .get(date) as { kiurCount: number; kirsiCount: number } | undefined;
  return { kiur: row?.kiurCount ?? 0, kirsi: row?.kirsiCount ?? 0 };
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
