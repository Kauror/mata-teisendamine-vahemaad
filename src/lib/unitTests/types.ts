// English unit tests ("lisatestid"): the workbook test that follows a
// vocabulary unit's words test. The content is imported by the parent (the
// workbook is copyrighted and the repository is public), validated by
// validate.ts, and stored per variant. See docs/english-unit-tests.md.

export const UNIT_TEST_FORMAT = 'harjutaja-english-unit-test/1';

export type UnitTestVariantId = 'A' | 'B';

export type ChoiceItem = {
  id: string;
  prompt: string;
  options?: string[];
  answer: string;
  example?: boolean;
  points?: number;
};

export type TextItem = {
  id: string;
  prompt: string;
  fields?: string[];
  answers: string[][];
  check: 'auto' | 'parent';
  example?: boolean;
  points?: number;
};

export type OrderItem = {
  id: string;
  prompt?: string;
  tokens: string[];
  answers: string[];
  example?: boolean;
  points?: number;
};

export type CrosswordEntry = {
  number: number;
  clue: string;
  answer: string;
  row?: number;
  col?: number;
  dir?: 'across' | 'down';
  points?: number;
};

type ExerciseBase = {
  id: string;
  instruction: string;
  scene?: string;
  wordBank?: string[];
};

export type ChoiceExercise = ExerciseBase & { type: 'choice'; items: ChoiceItem[] };
export type TextExercise = ExerciseBase & { type: 'text'; items: TextItem[] };
export type OrderExercise = ExerciseBase & { type: 'order'; items: OrderItem[] };
export type CrosswordExercise = ExerciseBase & { type: 'crossword'; entries: CrosswordEntry[] };

export type UnitTestExercise = ChoiceExercise | TextExercise | OrderExercise | CrosswordExercise;

export type UnitTestContent = {
  format: typeof UNIT_TEST_FORMAT;
  unit: number;
  variant: UnitTestVariantId;
  title: string;
  exercises: UnitTestExercise[];
};

// One gradable answer slot. A text item with two fields is two slots; every
// crossword word is one slot. Keys are stable for a given content snapshot.
export type SlotKind = 'choice' | 'text' | 'order' | 'crossword';

export type AnswerSlot = {
  key: string;
  exerciseId: string;
  kind: SlotKind;
  points: number;
  // 'parent': an open answer only the parent can mark.
  check: 'auto' | 'parent';
  // Accepted answers (auto) or model answers (parent) — never sent to the child.
  accepted: string[];
  label: string;
};

// A mark is the share of the slot's points: 1, 0.5 or 0. null: not marked yet.
export type Mark = 0 | 0.5 | 1;
export type Marks = Record<string, Mark | null>;
export type Answers = Record<string, string>;
