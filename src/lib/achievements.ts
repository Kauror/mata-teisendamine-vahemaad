import db from '@/lib/db';
import { isKirsiAttempt } from '@/lib/history';
import { getLongestLearningStreak } from '@/lib/learningPoints';
import { type Learner } from '@/lib/tasks';

export type Achievement = {
  id: string;
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

const EXERCISES_TARGET = 50;
const PERFECT_WEEK_DAYS = 7;

// Milestones a child unlocks by practising. They are derived from history on each
// read (rather than stored), and because both use monotonic measures — a
// cumulative count and an all-time-longest streak — they never re-lock once earned.
export function getAchievements(learner: Learner): Achievement[] {
  const exercises = totalExercises(learner);
  const longestStreak = getLongestLearningStreak(learner);

  return [
    {
      id: 'exercises-50',
      title: '50 harjutust',
      emoji: '🎯',
      description: 'Lahenda kokku 50 harjutust',
      unlocked: exercises >= EXERCISES_TARGET,
      current: Math.min(exercises, EXERCISES_TARGET),
      target: EXERCISES_TARGET
    },
    {
      id: 'perfect-week',
      title: 'Täiuslik nädal',
      emoji: '🗓️',
      description: 'Harjuta 7 päeva järjest',
      unlocked: longestStreak >= PERFECT_WEEK_DAYS,
      current: Math.min(longestStreak, PERFECT_WEEK_DAYS),
      target: PERFECT_WEEK_DAYS
    }
  ];
}
