import rawDataset from '@/data/kiurLoodusopetusTasks.json';
import { isChoiceTask, type ScienceDataset, type ScienceTask } from './types';
import { pickScienceSessionFrom } from './session';

export { SCIENCE_SESSION_SIZES, cleanScienceAnswer, isScienceSessionSize, type ScienceSessionSize } from './session';

const dataset = rawDataset as unknown as ScienceDataset;

export const LOODUSOPETUS_METADATA = dataset.metadata;
export const LOODUSOPETUS_TASKS: ScienceTask[] = dataset.tasks;

const TASKS_BY_ID = new Map(LOODUSOPETUS_TASKS.map((task) => [task.id, task]));

// The answer key a match task carried before its terms were rewritten
// (2026-11-20: «taim» and «tootja» had interchangeable definitions). A phone
// can still upload a run made with the old wording; the score verifier accepts
// the key that run was shown, so a right answer then never turns wrong now.
export const FORMER_SCIENCE_MATCHES: Readonly<Record<string, ReadonlyArray<Readonly<Record<string, string>>>>> = {
  'SCI-MATCH-011': [{
    taim: 'Organism, mis saab valguse abil endale toitu valmistada.',
    loom: 'Organism, kes saab energiat teisi organisme või nende osi süües.',
    lagundaja: 'Organism, mis lagundab surnud jäänuseid.',
    tootja: 'Organism, kes valmistab ise toitu; toiduahelas sageli taim.'
  }]
};

// The dataset is the contract for a science task: anything replaying a saved
// answer (score verification, Kordamine) looks the task up by id here rather
// than trusting a copy of the question that travelled with the answer.
export function getScienceTaskById(id: string): ScienceTask | undefined {
  return TASKS_BY_ID.get(id);
}

// Picks `count` unique tasks from the full pool; the runner picks the same
// tasks (by id, in the same order) from its lighter copy in ./runnerTasks.
export function pickScienceSession(count: number, seed: number): ScienceTask[] {
  return pickScienceSessionFrom(LOODUSOPETUS_TASKS, count, seed);
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
