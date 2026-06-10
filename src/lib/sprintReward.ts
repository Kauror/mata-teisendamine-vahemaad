import db from '@/lib/db';

// Kiur's English sprint is special: a run only earns stars (tähed) and a daily
// trophy (karikas) when he reaches more than half of his standing record — the
// best sprint score he has achieved before this run. The threshold is half the
// record, rounded up: record 20 → need 10, record 40 → need 20, record 21 →
// need 11. Until he has a record, any non-empty run (score ≥ 1) qualifies.

type SprintAttemptLike = {
  id: number;
  subject?: string | null;
  topic?: string | null;
  score: number;
};

export function isSprintAttempt(attempt: { subject?: string | null; topic?: string | null }): boolean {
  return attempt.subject === 'inglise-keel' && attempt.topic === 'sprint';
}

// Best sprint score recorded strictly before this attempt (its standing
// record). Returns 0 when there is no earlier sprint.
export function bestSprintScoreBefore(attemptId: number): number {
  const row = db
    .prepare("SELECT COALESCE(MAX(score), 0) AS best FROM attempts WHERE subject = 'inglise-keel' AND topic = 'sprint' AND id < ?")
    .get(attemptId) as { best: number } | undefined;
  return row?.best ?? 0;
}

// Words he must reach for a sprint run to count, given his standing record.
export function sprintRewardThreshold(record: number): number {
  return Math.max(1, Math.ceil(Math.max(0, record) / 2));
}

// Whether an attempt is allowed to earn stars / a daily trophy. Non-sprint
// attempts always qualify here; only Kiur's sprint is constrained.
export function sprintAttemptQualifies(attempt: SprintAttemptLike): boolean {
  if (!isSprintAttempt(attempt)) return true;
  return attempt.score >= sprintRewardThreshold(bestSprintScoreBefore(attempt.id));
}
