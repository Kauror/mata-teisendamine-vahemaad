import db from '@/lib/db';
import { isoToAppDate } from '@/lib/appDate';
import type { Learner } from '@/lib/tasks';

// The set of calendar days a child actually studied on. Shared by the streak
// counter and by streak freezes, which need the same answer to spot a gap —
// keeping one definition stops the two drifting apart.
export function studyDates(learner: Learner): Set<string> {
  const rows = db
    .prepare('SELECT createdAt FROM study_attempt_rewards WHERE learner = ?')
    .all(learner) as Array<{ createdAt: string }>;
  return new Set(rows.map((row) => isoToAppDate(row.createdAt)).filter((day): day is string => day !== null));
}
