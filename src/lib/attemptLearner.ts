import { isKirsiAttempt } from '@/lib/history';

// The fields an attempt row needs for deciding whose attempt it is. Both the
// server-side and the offline completion modules read the same shape.
export type LearnerAttributedAttempt = {
  category: string;
  learner?: string | null;
};

// Rows written before the learner column existed carry no learner, so the
// category decides for them.
export function attemptLearner(attempt: LearnerAttributedAttempt): 'kiur' | 'kirsi' {
  if (attempt.learner === 'kiur' || attempt.learner === 'kirsi') return attempt.learner;
  return isKirsiAttempt(attempt.category, attempt.learner) ? 'kirsi' : 'kiur';
}
