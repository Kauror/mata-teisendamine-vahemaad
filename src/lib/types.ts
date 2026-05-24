export const CATEGORIES = [
  'Teisendamine',
  'Võrdlemine',
  'Järjestamine',
  'Arvutamine',
  'Puuduv arv',
  'Ümbermõõt',
  'Tekstülesanded',
  'Segaharjutus'
] as const;

export const DIFFICULTIES = ['Lihtne', 'Keskmine', 'Raske'] as const;
export const QUESTION_COUNTS = [10, 25] as const;

export type Category = (typeof CATEGORIES)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];
export type QuestionKind = 'numeric' | 'ordering' | 'choice';

export type OrderingCard = { id: string; label: string; valueMm: number };

export type QuestionVisual = 'circle-full' | 'circle-half' | 'circle-quarter';

export type GeneratedQuestion = {
  id: string;
  category: Category;
  difficulty: Difficulty;
  question: string;
  expectedUnit?: 'mm' | 'cm' | 'dm' | 'm' | 'km';
  correctAnswer: number;
  kind?: QuestionKind;
  orderingCards?: OrderingCard[];
  orderingDirection?: 'asc' | 'desc';
  visual?: QuestionVisual;
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
