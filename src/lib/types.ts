export const CATEGORIES = [
  'Teisendamine',
  'Võrdlemine',
  'Järjestamine',
  'Arvutamine',
  'Korrutamine',
  'Puuduv arv',
  'Ümbermõõt',
  'Tekstülesanded',
  'Segaharjutus',
  'Kellaaeg'
] as const;

export const DIFFICULTIES = ['Lihtne', 'Keskmine', 'Raske'] as const;
export const QUESTION_COUNTS = [15] as const;

export type Category = (typeof CATEGORIES)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];
export type QuestionKind = 'numeric' | 'ordering' | 'choice' | 'text';

export type OrderingCard = { id: string; label: string; valueMm: number };

export const QUESTION_VISUALS = [
  'circle-full', 'circle-half', 'circle-quarter', 'ring-outline', 'ring-filled', 'radius-demo',
  'diameter-demo', 'point-position', 'concentric-circles', 'sector-missing', 'place-value-blocks', 'division-groups'
] as const;

export type QuestionVisual = (typeof QUESTION_VISUALS)[number];

// Questions like "Milline sirglõik on raadius?" mean nothing without their
// drawing, so anything replaying a saved question has to be able to tell a
// visual it can draw from one it cannot, rather than dropping it silently.
export function isQuestionVisual(value: unknown): value is QuestionVisual {
  return typeof value === 'string' && (QUESTION_VISUALS as readonly string[]).includes(value);
}

export type GeneratedQuestion = {
  id: string;
  type?: string;
  category: Category;
  difficulty: Difficulty;
  question: string;
  prompt?: string;
  emoji?: string;
  objectLabel?: string;
  count?: number;
  choices?: number[];
  left?: number;
  right?: number;
  operator?: string;
  displayExpression?: string;
  exerciseKey?: string;
  expectedUnit?: 'mm' | 'cm' | 'dm' | 'm' | 'km';
  correctAnswer: number;
  correctAnswerText?: string;
  acceptedAnswers?: string[];
  correctAnswers?: number[];
  choiceOptions?: string[];
  explanation?: string;
  subtopic?: string;
  kind?: QuestionKind;
  orderingCards?: OrderingCard[];
  orderingDirection?: 'asc' | 'desc';
  visual?: QuestionVisual;
  visualKnownDegrees?: number;
  clockHour?: number;
  clockMinutes?: 0 | 15 | 30 | 45;
  clockType?: 'full-hour' | 'half-hour' | 'quarter-hour';
};

export type QuestionResult = GeneratedQuestion & {
  userAnswer: string;
  isCorrect: boolean;
};

export type TestAttempt = {
  id: number;
  createdAt: string;
  category: Category;
  difficulty: Difficulty;
  questionCount: number;
  score: number;
  elapsedSeconds: number;
  questions: QuestionResult[];
};
