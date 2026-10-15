import db from '@/lib/db';

// Same rows the sprint page used to page through /api/history for: every
// visible attempt (a parent-hidden one carries deletedAt) with subject
// "inglise-keel" and topic "sprint", for any learner. A missing score counts
// as 0 and the result is never below 0 — exactly the old client-side reduce.
export function bestEnglishSprintScore(): number {
  const row = db.prepare(`
    SELECT MAX(score) AS best
    FROM attempts
    WHERE deletedAt IS NULL AND subject = 'inglise-keel' AND topic = 'sprint'
  `).get() as { best: number | null } | undefined;
  return Math.max(0, typeof row?.best === 'number' ? row.best : 0);
}
