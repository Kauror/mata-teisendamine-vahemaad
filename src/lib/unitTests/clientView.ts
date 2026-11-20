import { layoutCrossword } from './crossword';
import type { UnitTestContent } from './types';

// What the child's browser receives: the test without any answer. Worked
// examples keep theirs, because the book prints them filled in.

export type ClientItem = {
  id: string;
  prompt: string;
  fields?: string[];
  options?: string[];
  tokens?: string[];
  example?: string[];
  parentChecked?: boolean;
};

export type ClientCrossword = {
  rows: number;
  cols: number;
  cells: Array<{ row: number; col: number; number: number | null }>;
  entries: Array<{ number: number; dir: 'across' | 'down'; row: number; col: number; length: number; clue: string }>;
};

export type ClientExercise = {
  id: string;
  type: 'choice' | 'text' | 'order' | 'crossword';
  instruction: string;
  scene?: string;
  wordBank?: string[];
  items: ClientItem[];
  crossword?: ClientCrossword;
};

export type ClientUnitTest = {
  unit: number;
  variant: 'A' | 'B';
  title: string;
  exercises: ClientExercise[];
};

export function toClientUnitTest(content: UnitTestContent): ClientUnitTest {
  return {
    unit: content.unit,
    variant: content.variant,
    title: content.title,
    exercises: content.exercises.map((exercise): ClientExercise => {
      const base = {
        id: exercise.id,
        type: exercise.type,
        instruction: exercise.instruction,
        ...(exercise.scene ? { scene: exercise.scene } : {}),
        ...(exercise.wordBank ? { wordBank: exercise.wordBank } : {})
      };
      if (exercise.type === 'crossword') {
        const layout = layoutCrossword(exercise.entries);
        return {
          ...base,
          items: [],
          crossword: {
            rows: layout.rows,
            cols: layout.cols,
            cells: layout.cells,
            entries: layout.entries.map(({ number, dir, row, col, length, clue }) => ({ number, dir, row, col, length, clue }))
          }
        };
      }
      if (exercise.type === 'choice') {
        return {
          ...base,
          items: exercise.items.map((item) => ({
            id: item.id,
            prompt: item.prompt,
            options: item.options ?? exercise.wordBank ?? [],
            ...(item.example ? { example: [item.answer] } : {})
          }))
        };
      }
      if (exercise.type === 'order') {
        return {
          ...base,
          items: exercise.items.map((item) => ({
            id: item.id,
            prompt: item.prompt ?? '',
            tokens: item.tokens,
            ...(item.example ? { example: [item.answers[0]] } : {})
          }))
        };
      }
      return {
        ...base,
        items: exercise.items.map((item) => ({
          id: item.id,
          prompt: item.prompt,
          ...(item.fields ? { fields: item.fields } : {}),
          ...(item.example ? { example: item.answers.map((list) => list[0] ?? '') } : {}),
          ...((Array.isArray(item.check) ? item.check.includes('parent') : item.check === 'parent') ? { parentChecked: true } : {})
        }))
      };
    })
  };
}
