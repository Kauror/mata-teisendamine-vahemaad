import db from '@/lib/db';
import { childExerciseCards } from '@/lib/childExerciseCards';
import { getCompletedExerciseIdsToday } from '@/lib/exerciseCompletion';
import { DAILY_EXERCISE_LIMIT, getActiveLearningExercises, getLearningExerciseCatalog } from '@/lib/learningExercises';
import { getLearningDaysThisWeek } from '@/lib/learningPoints';
import { historyLearnerClause } from '@/lib/server/historyLearnerFilter';
import { isoToAppDate, startOfAppWeek } from '@/lib/appDate';
import { todayDateString, type Learner } from '@/lib/tasks';

export type Achievement = {
  id: string;
  kind: 'exercise_milestone' | 'daily' | 'weekly';
  title: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  current: number;
  target: number;
  tooltipCount: number;
};

type AttemptRow = { createdAt: string };

// Total exercise sessions the child has completed. Each attempt row is one
// finished exercise, so this is simply how many they belong to. The learner
// filter runs in SQL — historyLearnerClause is the SQL twin of isKirsiAttempt,
// so legacy rows without a learner are still assigned by category — instead of
// loading both children's whole history on every dashboard read.
function learnerAttempts(learner: Learner) {
  const filter = historyLearnerClause(learner, 'a');
  return db.prepare(`SELECT a.createdAt FROM attempts a WHERE ${filter.sql}`).all(...filter.params) as AttemptRow[];
}

const PERFECT_WEEK_DAYS = 7;
export const EXERCISE_MILESTONES = [...Array.from({ length: 19 }, (_, index) => (index + 1) * 50), 999] as const;

export function latestExerciseMilestone(exercises: number) {
  return EXERCISE_MILESTONES.filter((milestone) => exercises >= milestone).at(-1) ?? null;
}

function completedExercisesToday(learner: Learner) {
  const exercises = childExerciseCards(learner, getActiveLearningExercises(learner), getLearningExerciseCatalog());
  return Math.min(getCompletedExerciseIdsToday(learner, exercises).size, DAILY_EXERCISE_LIMIT);
}

// Milestones are derived from history on each read rather than stored. Exercise
// milestones are cumulative, while the weekly achievement is current-week only.
//
// `studyDates` lets a caller that already read the child's study days (the
// dashboard route reads them for the streak too) hand them in instead of
// querying them again; the result is the same either way.
export function getAchievements(
  learner: Learner,
  today = todayDateString(),
  studyDates?: Set<string>
): Achievement[] {
  const attempts = learnerAttempts(learner);
  const exercises = attempts.length;
  const weekStart = startOfAppWeek(today);
  const exercisesToday = attempts.filter((attempt) => isoToAppDate(attempt.createdAt) === today).length;
  const exercisesThisWeek = attempts.filter((attempt) => {
    const date = isoToAppDate(attempt.createdAt);
    return date !== null && date >= weekStart && date <= today;
  }).length;
  const exerciseMilestone = latestExerciseMilestone(exercises);
  const nextExerciseMilestone = EXERCISE_MILESTONES.find((milestone) => milestone > exercises) ?? 999;
  const dailyExercises = completedExercisesToday(learner);
  const weeklyDays = getLearningDaysThisWeek(learner, today, studyDates);

  return [
    {
      id: `exercises-${exerciseMilestone ?? nextExerciseMilestone}`,
      kind: 'exercise_milestone',
      title: `${exerciseMilestone ?? nextExerciseMilestone} harjutust`,
      emoji: '🎯',
      description: `Lahenda kokku ${nextExerciseMilestone} harjutust`,
      unlocked: exerciseMilestone !== null,
      current: exerciseMilestone ?? exercises,
      target: exerciseMilestone ?? nextExerciseMilestone,
      tooltipCount: exercises
    },
    {
      id: 'daily-exercises',
      kind: 'daily',
      title: 'Täna',
      emoji: '✅',
      description: `Lahenda täna ${DAILY_EXERCISE_LIMIT} erinevat harjutust`,
      unlocked: dailyExercises >= DAILY_EXERCISE_LIMIT,
      current: dailyExercises,
      target: DAILY_EXERCISE_LIMIT,
      tooltipCount: exercisesToday
    },
    {
      id: 'perfect-week',
      kind: 'weekly',
      title: 'Täiuslik nädal',
      emoji: '🗓️',
      description: 'Harjuta sel nädalal 7 päeval',
      unlocked: weeklyDays >= PERFECT_WEEK_DAYS,
      current: weeklyDays,
      target: PERFECT_WEEK_DAYS,
      tooltipCount: exercisesThisWeek
    }
  ];
}
