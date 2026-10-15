import db from '@/lib/db';
import { addAppDays, isoToAppDate } from '@/lib/appDate';
import type { Learner } from '@/lib/tasks';

// One definition of "rows whose stored timestamp falls on these app (Tallinn)
// days", for every query that buckets by a stored ISO timestamp.
//
// The SQL range is only a coarse bracket so an index can be used; the exact
// app-day check in JS stays authoritative. Timestamps may carry any UTC offset
// (protocol v2 accepts e.g. "-05:00"), and the text of such a timestamp starts
// with the date in *its* offset, which for an instant on Tallinn day D is at
// most one day either side of D (offsets span -12..+14 h). Comparing the text
// against the bare dates D-2 (inclusive) and D+2 (exclusive) therefore keeps
// every candidate whatever its offset, and the JS check discards the extras.
// Text that does not start with a YYYY-MM-DD date is not ordered by date at all,
// so it is fetched by a second query (NOT_DATE_PREFIXED) and checked the same way.
export function appDayTextBracket(from: string, to: string) {
  return {
    fromInclusive: addAppDays(from, -2),
    toExclusive: addAppDays(to, 2)
  };
}

// SQL predicate (for a column name) matching timestamp text that does not
// start with a YYYY-MM-DD date and so falls outside any date-text bracket.
export function notDatePrefixed(column: string) {
  return `${column} NOT GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]*'`;
}

export type LedgerWindowRow = {
  id: number;
  amount: number;
  source: string;
  createdAt: string;
  appDate: string;
};

// Every point_ledger row of a learner whose createdAt falls on an app day in
// [from, to] (inclusive), in createdAt order (the order the learner index
// returned them in before, so float sums add up in the same order). Buckets by
// createdAt — the moment the row was written. Protocol-v2 reward rows also
// carry the attempt's effectiveDate; a caller that means "stars for the day the
// work was done" must use that column instead (see dailyPointsSummary).
export function ledgerRowsForAppDays(learner: Learner, from: string, to: string): LedgerWindowRow[] {
  const bracket = appDayTextBracket(from, to);
  const rows = db.prepare(`
    SELECT id, amount, source, createdAt FROM point_ledger
    WHERE learner = ? AND ((createdAt >= ? AND createdAt < ?) OR ${notDatePrefixed('createdAt')})
    ORDER BY createdAt, id
  `).all(learner, bracket.fromInclusive, bracket.toExclusive) as Array<Omit<LedgerWindowRow, 'appDate'>>;
  const result: LedgerWindowRow[] = [];
  for (const row of rows) {
    const appDate = isoToAppDate(row.createdAt);
    if (appDate && appDate >= from && appDate <= to) result.push({ ...row, appDate });
  }
  return result;
}
