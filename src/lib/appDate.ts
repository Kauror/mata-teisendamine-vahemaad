// The whole app reckons "which day is it" in a single local timezone so that
// day boundaries (streaks, daily caps, the leaderboard, the store) line up no
// matter where the server runs. The family is in Tallinn, Estonia (EET/EEST),
// and Intl handles the summer/winter DST switch automatically.
export const APP_TIME_ZONE = 'Europe/Tallinn';

// en-CA renders as 'YYYY-MM-DD', which sorts and compares as plain strings.
const appDateFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: APP_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

// Today's local calendar date, 'YYYY-MM-DD'.
export function todayDateString() {
  return appDateFormat.format(new Date());
}

// Local calendar date 'YYYY-MM-DD' for an ISO timestamp, or null when the
// timestamp cannot be parsed.
export function isoToAppDate(iso: string): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return appDateFormat.format(date);
}

// Calendar arithmetic on 'YYYY-MM-DD' strings. Noon UTC keeps the shift clear of
// any DST edge, and the result is read back as a calendar date.
export function addAppDays(date: string, delta: number): string {
  const cursor = new Date(`${date}T12:00:00Z`);
  cursor.setUTCDate(cursor.getUTCDate() + delta);
  return cursor.toISOString().slice(0, 10);
}

export function previousAppDate(date: string): string {
  return addAppDays(date, -1);
}

// Inclusive list of 'YYYY-MM-DD' strings from `start` to `end` (both calendar
// dates). Returns [] if start is after end.
export function appDateRange(start: string, end: string): string[] {
  const days: string[] = [];
  let cursor = start;
  while (cursor <= end) {
    days.push(cursor);
    cursor = addAppDays(cursor, 1);
  }
  return days;
}
