import { isKirsiAttempt } from '@/lib/history';

// Shared "what was the correct answer?" resolution for a saved question, so the
// three review surfaces — the server-rendered detail page (/history/[id]), the
// offline-cached detail page (/history/offline) and the local result screen
// (/tulemus) — all display the same correct answer for every exercise type.
//
// Historically only /history/[id] resolved numeric and choice answers, while the
// offline/local screens showed only `correctAnswerText`/`correctWord`. That left
// maths exercises (e.g. "Ring ja ringjoon", length conversions) with an empty
// "Õige vastus: —" everywhere except the one server page — which the history
// list never links to. This module is the single source of truth.

export type OrderingCard = { id: string; label: string; valueMm: number };

export type ReviewQuestion = {
  id?: string;
  question?: string;
  userAnswer?: string;
  expectedUnit?: string;
  correctAnswer?: number;
  correctAnswers?: number[];
  isCorrect?: boolean;
  kind?: 'numeric' | 'ordering' | 'choice' | 'text';
  orderingCards?: OrderingCard[];
  orderingDirection?: 'asc' | 'desc';
  choiceOptions?: string[];
  correctAnswerText?: string;
  correctWord?: string;
  selectedWord?: string;
  selectedAnswer?: string;
  estonian?: string;
  explanation?: string;
  image?: string;
  text?: string;
  type?: string;
  emoji?: string;
  objectLabel?: string;
  count?: number;
  clockHour?: number;
  clockMinutes?: 0 | 15 | 30 | 45;
};

export type ReviewContext = {
  isReading: boolean;
  isKirsiReading: boolean;
  isEnglish: boolean;
  isKirsi: boolean;
};

export const NEUTRAL_REVIEW_CONTEXT: ReviewContext = {
  isReading: false,
  isKirsiReading: false,
  isEnglish: false,
  isKirsi: false
};

// Derive the display context from the attempt's own metadata (learner/subject/
// category), mirroring the flags computed inline in /history/[id].
export function reviewContext(attempt: {
  learner?: string | null;
  subject?: string | null;
  category?: string | null;
}): ReviewContext {
  const subject = attempt.subject ?? null;
  return {
    isReading: subject === 'lugemine',
    isKirsiReading: attempt.learner === 'kirsi' && subject === 'lugemine',
    isEnglish: subject === 'inglise-keel',
    isKirsi: isKirsiAttempt(attempt.category ?? '', attempt.learner)
  };
}

// The correct answer for ordering questions: the cards sorted into the expected
// direction, joined with arrows.
export function resolveCorrectOrder(q: ReviewQuestion): string {
  return (q.orderingCards ?? [])
    .slice()
    .sort((a, b) => (q.orderingDirection === 'desc' ? b.valueMm - a.valueMm : a.valueMm - b.valueMm))
    .map((card) => card.label)
    .join(' → ');
}

// The correct answer to display for a non-ordering question. Handles reading
// (correctAnswerText), Kirsi reading (correctWord), multiple/single choice
// (choiceOptions indexed by correctAnswer(s)), comparison signs, English word
// pairs, and plain numeric answers.
export function resolveCorrectAnswer(q: ReviewQuestion, ctx: ReviewContext = NEUTRAL_REVIEW_CONTEXT): string {
  if (q.correctAnswerText) return q.correctAnswerText;
  if (ctx.isKirsiReading) return q.correctWord ?? '—';
  if (q.kind === 'choice' && q.choiceOptions?.length) {
    if (q.correctAnswers?.length) {
      return q.correctAnswers.map((index) => q.choiceOptions?.[index]).filter(Boolean).join(' / ');
    }
    return q.choiceOptions[q.correctAnswer ?? -1] ?? '—';
  }
  if (q.kind === 'choice' && !ctx.isEnglish) {
    return q.correctAnswer === -1 ? '<' : q.correctAnswer === 0 ? '=' : '>';
  }
  if (ctx.isEnglish) return 'Sõnapaar sobib';
  return q.correctAnswer != null ? String(q.correctAnswer) : '—';
}

// Whether the expected unit (e.g. "cm") should be appended after the answer.
// Choice answers, Kirsi's exercises and English word pairs carry no unit.
export function shouldAppendUnit(q: ReviewQuestion, ctx: ReviewContext = NEUTRAL_REVIEW_CONTEXT): boolean {
  return !(q.kind === 'choice' || ctx.isKirsi || ctx.isEnglish);
}

export function resolveUserAnswer(q: ReviewQuestion): string {
  return q.userAnswer || q.selectedWord || q.selectedAnswer || '';
}
