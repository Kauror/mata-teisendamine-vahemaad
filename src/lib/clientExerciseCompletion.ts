import { isKirsiAttempt, isTodayIso } from '@/lib/history';

export type ClientCompletionAttempt = {
  createdAt: string;
  category: string;
  learner?: string | null;
  subject?: string | null;
  topic?: string | null;
  exerciseId?: string | null;
};

function learnerForAttempt(attempt: ClientCompletionAttempt) {
  if (attempt.learner === 'kiur' || attempt.learner === 'kirsi') return attempt.learner;
  return isKirsiAttempt(attempt.category, attempt.learner) ? 'kirsi' : 'kiur';
}

export function completedTodayFromHistory(
  attempts: ClientCompletionAttempt[],
  learner: 'kiur' | 'kirsi',
  exerciseId: string,
  fallback: { subject: string; topic: string; category?: string }
) {
  return attempts.some((attempt) => {
    if (!isTodayIso(attempt.createdAt) || learnerForAttempt(attempt) !== learner) return false;
    if (attempt.exerciseId === exerciseId) return true;
    if (attempt.subject && attempt.subject !== fallback.subject) return false;
    if (attempt.topic === fallback.topic) return true;
    return Boolean(fallback.category && attempt.category === fallback.category);
  });
}
