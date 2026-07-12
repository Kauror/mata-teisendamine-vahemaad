import { sprintQualificationForAttempt } from '@/lib/sprintQualification';

type SprintAttemptLike = { id: number; subject?: string | null; topic?: string | null; score: number };

// Compatibility entry point for legacy callers. All new code should use the
// persisted deterministic qualification facts rather than arrival-order IDs.
export function sprintAttemptQualifies(attempt: SprintAttemptLike): boolean {
  if (attempt.subject !== 'inglise-keel' || attempt.topic !== 'sprint') return true;
  return sprintQualificationForAttempt(attempt.id)?.qualified ?? false;
}
