import type { Learner } from '@/lib/shared/types';

// The parent's "Täna" card for one child: did they do today's exercises and
// tasks, and what is left. Pure, so the route and its tests share it.

export type ParentTodayRowState = 'done' | 'wait' | 'todo';
export type ParentTodayRow = { name: string; state: ParentTodayRowState; meta: string };
export type ParentTodayChild = {
  learner: Learner;
  balance: number;
  exercises: { done: number; total: number; rows: ParentTodayRow[] };
  tasks: { done: number; total: number; rows: ParentTodayRow[] };
  left: string[];
};
export type ParentToday = { date: string; children: Record<Learner, ParentTodayChild> };

export type ParentTodayTask = {
  title: string;
  points: number;
  status: string;
  completedBy: Learner | null;
};

const NAMES: Record<Learner, string> = { kiur: 'Kiur', kirsi: 'Kirsi' };

function exerciseRow(title: string, count: number): ParentTodayRow {
  if (count <= 0) return { name: title, state: 'todo', meta: '' };
  return { name: title, state: 'done', meta: count > 1 ? `${count}×` : '' };
}

function taskRow(task: ParentTodayTask): ParentTodayRow {
  if (task.status === 'completed') return { name: task.title, state: 'done', meta: `+${task.points}` };
  if (task.status === 'pending_approval') return { name: task.title, state: 'wait', meta: 'ootab sind' };
  // A "first one wins" task the sibling did: done for the day, not by this child.
  if (task.status === 'locked') return { name: task.title, state: 'done', meta: task.completedBy ? `tegi ${NAMES[task.completedBy]}` : 'tehtud' };
  return { name: task.title, state: 'todo', meta: '' };
}

export function parentTodayChild(
  learner: Learner,
  balance: number,
  exercises: Array<{ id: string; title: string }>,
  doneCounts: Record<string, number>,
  tasks: ParentTodayTask[]
): ParentTodayChild {
  const exerciseRows = exercises.map((exercise) => exerciseRow(exercise.title, doneCounts[exercise.id] ?? 0));
  const taskRows = tasks.map(taskRow);
  const done = (rows: ParentTodayRow[]) => rows.filter((row) => row.state === 'done').length;
  return {
    learner,
    balance,
    exercises: { done: done(exerciseRows), total: exerciseRows.length, rows: exerciseRows },
    tasks: { done: done(taskRows), total: taskRows.length, rows: taskRows },
    left: [...exerciseRows, ...taskRows].filter((row) => row.state === 'todo').map((row) => row.name)
  };
}
