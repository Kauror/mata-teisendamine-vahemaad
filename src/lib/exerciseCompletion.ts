import db from '@/lib/db';
import { previousAppDate, todayDateString } from '@/lib/appDate';
import { attemptLearner } from '@/lib/attemptLearner';
import { ChildExerciseCard } from '@/lib/childExerciseCards';
import { isTodayIso } from '@/lib/history';
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

// Ordered most specific first. `learner:subject:topic` is deliberately last:
// it does NOT identify an exercise on its own, because Kirsi's four calculation
// cards are one topic ('arvutamine') split by category. Attribution walks these
// in order and stops at the first tier that matches anything.
function attemptKeyTiers(attempt: CompletionAttempt) {
  const learner = attemptLearner(attempt);
  const subject = attempt.subject || '';
  const topic = attempt.topic || '';
  const category = attempt.category || '';
  return [
    attempt.exerciseId || '',
    subject && topic && category ? `${learner}:${subject}:${topic}:${category}` : '',
    subject && topic ? `${learner}:${subject}:${topic}` : ''
  ];
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

// Which card did this attempt finish? Each tier is tried in turn and the first
// one that matches any card decides the answer — a coarser tier never gets to
// add more cards on top of a precise match.
function cardsFinishedBy(attempt: CompletionAttempt, exercises: ChildExerciseCard[]) {
  for (const key of attemptKeyTiers(attempt)) {
    if (!key) continue;
    const matches = exercises.filter((exercise) => exercise.completionKeys.includes(key));
    if (matches.length > 0) return matches;
  }
  return exercises.filter((exercise) => matchesFallback(attempt, exercise));
}

// How many times the child finished each card today. Repeats are counted, not
// collapsed — doing the same exercise three times is three attempts, and the
// card says so.
export function completedExerciseCountsFromAttempts(
  attempts: CompletionAttempt[],
  learner: Learner,
  exercises: ChildExerciseCard[]
): Record<string, number> {
  const counts: Record<string, number> = {};
  const relevantAttempts = attempts.filter((attempt) => attemptLearner(attempt) === learner && isTodayIso(attempt.createdAt));

  for (const attempt of relevantAttempts) {
    const finished = cardsFinishedBy(attempt, exercises);
    // One attempt is one finished exercise, so it may only ever credit one card.
    // When it cannot be pinned to a single card the honest answer is none:
    // crediting every candidate gives the child exercises they never did and
    // hands them the daily achievement after a single run.
    if (finished.length === 1) counts[finished[0].id] = (counts[finished[0].id] ?? 0) + 1;
  }

  return counts;
}

export function completedExerciseIdsFromAttempts(
  attempts: CompletionAttempt[],
  learner: Learner,
  exercises: ChildExerciseCard[]
) {
  return new Set(Object.keys(completedExerciseCountsFromAttempts(attempts, learner, exercises)));
}

function todaysAttempts() {
  // isTodayIso does the exact "is this today in Tallinn" filtering; the SQL
  // cutoff only keeps the scan from covering the whole table. Starting at
  // yesterday's UTC midnight over-fetches a few hours of rows regardless of
  // DST, which the JS filter then discards.
  const cutoff = `${previousAppDate(todayDateString())}T00:00:00`;
  return db.prepare(`
    SELECT id, createdAt, category, learner, subject, topic, exerciseId
    FROM attempts
    WHERE createdAt >= ?
    ORDER BY createdAt DESC
  `).all(cutoff) as CompletionAttempt[];
}

export function getCompletedExerciseIdsToday(learner: Learner, exercises: ChildExerciseCard[]) {
  return completedExerciseIdsFromAttempts(todaysAttempts(), learner, exercises);
}

export function getCompletedExerciseCountsToday(learner: Learner, exercises: ChildExerciseCard[]) {
  return completedExerciseCountsFromAttempts(todaysAttempts(), learner, exercises);
}
