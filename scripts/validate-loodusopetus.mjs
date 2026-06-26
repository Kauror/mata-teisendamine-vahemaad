// Validates the Loodusõpetus task pool. Run: npm run validate:science
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const dataPath = join(here, '..', 'src', 'data', 'kiurLoodusopetusTasks.json');
const dataset = JSON.parse(readFileSync(dataPath, 'utf-8'));
const tasks = Array.isArray(dataset.tasks) ? dataset.tasks : [];

const errors = [];
const ids = new Set();

if (tasks.length !== 140) errors.push(`Expected 140 tasks, found ${tasks.length}.`);

for (const task of tasks) {
  const id = task.id || '(missing id)';
  if (ids.has(task.id)) errors.push(`Duplicate task id: ${id}`);
  ids.add(task.id);

  if (!task.explanation) errors.push(`${id}: missing explanation`);

  const isChoice = task.type === 'visual_choice' || task.type === 'reading_choice' || task.type === 'data_evidence';
  if (isChoice) {
    if (!Array.isArray(task.choices) || task.choices.length === 0) {
      errors.push(`${id}: no choices`);
    } else {
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
    if (!task.groups || !task.items || !task.correctGroups) {
      errors.push(`${id}: sort missing groups/items/correctGroups`);
    } else {
      const assigned = Object.values(task.correctGroups).flat();
      const a = [...task.items].sort();
      const b = [...assigned].sort();
      if (JSON.stringify(a) !== JSON.stringify(b)) errors.push(`${id}: sort items do not match correctGroups exactly`);
    }
  }

  if (task.type === 'match') {
    if (!task.terms || !task.definitions || !task.correctMatches) {
      errors.push(`${id}: match missing terms/definitions/correctMatches`);
    } else {
      for (const term of task.terms) {
        if (!task.correctMatches[term]) errors.push(`${id}: term "${term}" has no correct match`);
      }
    }
  }

  if (task.type === 'data_evidence' && !task.data) errors.push(`${id}: data_evidence missing data`);
}

if (errors.length) {
  console.error(`Loodusõpetus validation FAILED (${errors.length} issue(s)):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`Loodusõpetus validation passed: ${tasks.length} tasks OK.`);
