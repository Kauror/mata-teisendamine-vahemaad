import rawDataset from '@/data/kiurLoodusopetusTasks.json';
import { seededRng, shuffleWithRng } from '@/lib/random';
import { isChoiceTask, type ScienceDataset, type ScienceTask } from './types';

const dataset = rawDataset as unknown as ScienceDataset;

export const LOODUSOPETUS_METADATA = dataset.metadata;
export const LOODUSOPETUS_TASKS: ScienceTask[] = dataset.tasks;

// Only these two session lengths are offered to the child.
export const SCIENCE_SESSION_SIZES = [10, 25] as const;
export type ScienceSessionSize = (typeof SCIENCE_SESSION_SIZES)[number];

export function isScienceSessionSize(value: number): value is ScienceSessionSize {
  return (SCIENCE_SESSION_SIZES as readonly number[]).includes(value);
}

// Picks `count` unique tasks from the pool, shuffled by a stable seed so a given
// seed always yields the same session (handy for retries and debugging).
export function pickScienceSession(count: number, seed: number): ScienceTask[] {
  const size = Math.max(1, Math.min(count, LOODUSOPETUS_TASKS.length));
  const rng = seededRng(seed || 1);
  const shuffled = shuffleWithRng(rng, [...LOODUSOPETUS_TASKS]);
  const session: ScienceTask[] = [];
  const usedIds = new Set<string>();
  for (const task of shuffled) {
    if (usedIds.has(task.id)) continue;
    usedIds.add(task.id);
    session.push(task);
    if (session.length >= size) break;
  }
  return session;
}

export type ScienceValidationResult = {
  ok: boolean;
  taskCount: number;
  errors: string[];
};

// Lightweight integrity check over the task pool. Mirrors the validation listed
// in the project brief; safe to call at dev time or from the validate script.
export function validateScienceTasks(tasks: ScienceTask[] = LOODUSOPETUS_TASKS): ScienceValidationResult {
  const errors: string[] = [];
  const seenIds = new Set<string>();

  if (tasks.length !== 140) errors.push(`Expected 140 tasks, found ${tasks.length}.`);

  for (const task of tasks) {
    const id = task.id || '(missing id)';
    if (seenIds.has(task.id)) errors.push(`Duplicate task id: ${id}`);
    seenIds.add(task.id);

    if (!task.explanation) errors.push(`${id}: missing explanation`);

    if (isChoiceTask(task)) {
      if (!task.choices?.length) errors.push(`${id}: no choices`);
      else {
        const match = task.choices.find((choice) => choice.id === task.correctAnswer);
        if (!match) errors.push(`${id}: correctAnswer "${task.correctAnswer}" not in choices`);
        else if (match.text !== task.correctAnswerText) errors.push(`${id}: correctAnswerText does not match the correct choice`);
      }
    }

    if (task.type === 'visual_choice') {
      if (!task.diagram) errors.push(`${id}: visual_choice missing diagram`);
      if (!task.diagramExplanation) errors.push(`${id}: visual_choice missing diagramExplanation`);
    }

    if (task.type === 'sort') {
      if (!task.groups?.length || !task.items?.length || !task.correctGroups) {
        errors.push(`${id}: sort missing groups/items/correctGroups`);
      } else {
        const assigned = Object.values(task.correctGroups).flat();
        const itemsSorted = [...task.items].sort();
        const assignedSorted = [...assigned].sort();
        if (JSON.stringify(itemsSorted) !== JSON.stringify(assignedSorted)) {
          errors.push(`${id}: sort items do not match correctGroups assignments exactly`);
        }
      }
    }

    if (task.type === 'match') {
      if (!task.terms?.length || !task.definitions?.length || !task.correctMatches) {
        errors.push(`${id}: match missing terms/definitions/correctMatches`);
      } else {
        for (const term of task.terms) {
          if (!task.correctMatches[term]) errors.push(`${id}: term "${term}" has no correct match`);
        }
      }
    }

    if (task.type === 'data_evidence' && !task.data) {
      errors.push(`${id}: data_evidence missing data`);
    }
  }

  return { ok: errors.length === 0, taskCount: tasks.length, errors };
}
