import db from '@/lib/db';
import { isKirsiAttempt } from '@/lib/history';
import { getLearningDaysThisWeek } from '@/lib/learningPoints';
import { type Learner } from '@/lib/tasks';

export type Achievement = {
  id: string;
  kind: 'exercise_milestone' | 'weekly';
  title: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  current: number;
  target: number;
};

type AttemptRow = { category: string; learner: string | null };

// Total exercise sessions the child has completed. Each attempt row is one
// finished exercise, so this is simply how many they belong to.
function totalExercises(learner: Learner) {
  const rows = db.prepare('SELECT category, learner FROM attempts').all() as AttemptRow[];
  return rows.filter((row) => (isKirsiAttempt(row.category, row.learner) ? 'kirsi' : 'kiur') === learner).length;
}

const PERFECT_WEEK_DAYS = 7;
export const EXERCISE_MILESTONES = [...Array.from({ length: 19 }, (_, index) => (index + 1) * 50), 999] as const;

export function latestExerciseMilestone(exercises: number) {
  return EXERCISE_MILESTONES.filter((milestone) => exercises >= milestone).at(-1) ?? null;
}

// Milestones are derived from history on each read rather than stored. Exercise
// milestones are cumulative, while the weekly achievement is current-week only.
export function getAchievements(learner: Learner): Achievement[] {
  const exercises = totalExercises(learner);
  const exerciseMilestone = latestExerciseMilestone(exercises);
  const nextExerciseMilestone = EXERCISE_MILESTONES.find((milestone) => milestone > exercises) ?? 999;
  const weeklyDays = getLearningDaysThisWeek(learner);

  return [
    {
      id: `exercises-${exerciseMilestone ?? nextExerciseMilestone}`,
      kind: 'exercise_milestone',
      title: `${exerciseMilestone ?? nextExerciseMilestone} harjutust`,
      emoji: '🎯',
      description: `Lahenda kokku ${nextExerciseMilestone} harjutust`,
      unlocked: exerciseMilestone !== null,
      current: exerciseMilestone ?? exercises,
      target: exerciseMilestone ?? nextExerciseMilestone
    },
    {
      id: 'perfect-week',
      kind: 'weekly',
      title: 'Täiuslik nädal',
      emoji: '🗓️',
      description: 'Harjuta sel nädalal 7 päeval',
      unlocked: weeklyDays >= PERFECT_WEEK_DAYS,
      current: weeklyDays,
      target: PERFECT_WEEK_DAYS
    }
  ];
}
