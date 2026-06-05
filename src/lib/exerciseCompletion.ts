import db from '@/lib/db';
import { ChildExerciseCard } from '@/lib/childExerciseCards';
import { isKirsiAttempt, isTodayIso } from '@/lib/history';
import { Learner } from '@/lib/tasks';

type CompletionAttempt = {
  id: number;
  createdAt: string;
  category: string;
  learner?: string | null;
  subject?: string | null;
  topic?: string | null;
  exerciseId?: string | null;
};

function attemptLearner(attempt: CompletionAttempt): Learner {
  if (attempt.learner === 'kirsi' || attempt.learner === 'kiur') return attempt.learner;
  return isKirsiAttempt(attempt.category, attempt.learner) ? 'kirsi' : 'kiur';
}

function attemptKeys(attempt: CompletionAttempt) {
  const learner = attemptLearner(attempt);
  const subject = attempt.subject || '';
  const topic = attempt.topic || '';
  const category = attempt.category || '';
  return [
    attempt.exerciseId || '',
    `${learner}:${subject}:${topic}:${category}`,
    `${learner}:${subject}:${topic}`
  ].filter(Boolean);
}

function matchesFallback(attempt: CompletionAttempt, exercise: ChildExerciseCard) {
  const learner = attemptLearner(attempt);
  if (learner !== exercise.childId) return false;
  if (attempt.subject && attempt.subject !== exercise.legacySubject) return false;

  if (exercise.legacySubject === 'matemaatika') {
    if (exercise.childId === 'kiur') return attempt.topic === exercise.legacyTopic;
    return attempt.topic === exercise.legacyTopic && attempt.category === exercise.legacyCategory;
  }

  return attempt.topic === exercise.legacyTopic || attempt.category === exercise.legacyCategory;
}

export function completedExerciseIdsFromAttempts(
  attempts: CompletionAttempt[],
  learner: Learner,
  exercises: ChildExerciseCard[]
) {
  const completed = new Set<string>();
  const relevantAttempts = attempts.filter((attempt) => attemptLearner(attempt) === learner && isTodayIso(attempt.createdAt));

  for (const exercise of exercises) {
    const keys = new Set(exercise.completionKeys);
    const done = relevantAttempts.some((attempt) => (
      attemptKeys(attempt).some((key) => keys.has(key)) || matchesFallback(attempt, exercise)
    ));
    if (done) completed.add(exercise.id);
  }

  return completed;
}

export function getCompletedExerciseIdsToday(learner: Learner, exercises: ChildExerciseCard[]) {
  const attempts = db.prepare(`
    SELECT id, createdAt, category, learner, subject, topic, exerciseId
    FROM attempts
    ORDER BY createdAt DESC
  `).all() as CompletionAttempt[];
  return completedExerciseIdsFromAttempts(attempts, learner, exercises);
}
