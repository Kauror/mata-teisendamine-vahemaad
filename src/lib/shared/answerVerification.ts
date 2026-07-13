import type { GeneratedQuestion } from '@/lib/types';
import { isAnswerCorrect } from '@/lib/validation';

const UNIT_ALIASES: ReadonlyArray<readonly [RegExp, string]> = [
  [/\bmillimeet(?:er|rit)\b/gu, 'mm'],
  [/\bsentimeet(?:er|rit)\b/gu, 'cm'],
  [/\bdetsimeet(?:er|rit)\b/gu, 'dm'],
  [/\bkilomeet(?:er|rit)\b/gu, 'km'],
  [/\bmeet(?:er|rit)\b/gu, 'm'],
  [/\bkilogramm(?:i)?\b/gu, 'kg'],
  [/\bgramm(?:i)?\b/gu, 'g']
];

export function normalizeMathAnswer(value: unknown) {
  let normalized = String(value ?? '')
    .normalize('NFKC')
    .toLocaleLowerCase('et')
    .trim()
    .replace(/(\d),(\d)/g, '$1.$2')
    .replace(/[−–—]/g, '-')
    .replace(/\s+/g, ' ');
  for (const [pattern, replacement] of UNIT_ALIASES) normalized = normalized.replace(pattern, replacement);
  return normalized
    .replace(/\s+ja\s+/g, ' ')
    .replace(/([+-]?\d+(?:\.\d+)?)\s+(?=(?:mm|cm|dm|km|m|kg|g)\b)/g, '$1')
    .replace(/(mm|cm|dm|km|kg|m|g)(?=[+-]?\d)/g, '$1 ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function acceptedMathTextAnswers(question: GeneratedQuestion) {
  return [question.correctAnswerText, ...(question.acceptedAnswers ?? [])]
    .filter((answer): answer is string => Boolean(answer));
}

export function verifyMathTextAnswer(question: GeneratedQuestion, answer: unknown) {
  const submitted = normalizeMathAnswer(answer);
  return acceptedMathTextAnswers(question).some((accepted) => normalizeMathAnswer(accepted) === submitted);
}

export function mathChoiceAnswerLabels(question: GeneratedQuestion) {
  const options = question.choiceOptions;
  if (!options?.length) return [question.correctAnswer === -1 ? '<' : question.correctAnswer === 0 ? '=' : '>'];
  const indexes = question.correctAnswers?.length ? question.correctAnswers : [question.correctAnswer];
  return indexes.map((index) => options[index]).filter((answer): answer is string => Boolean(answer));
}

export function verifyGeneratedMathAnswer(question: GeneratedQuestion, answer: unknown) {
  if (question.kind === 'ordering') {
    const expected = [...(question.orderingCards ?? [])]
      .sort((a, b) => question.orderingDirection === 'desc' ? b.valueMm - a.valueMm : a.valueMm - b.valueMm)
      .map((card) => normalizeMathAnswer(card.label));
    const submitted = String(answer ?? '').split(/\s*(?:→|->|\|)\s*/).map(normalizeMathAnswer).filter(Boolean);
    return JSON.stringify(submitted) === JSON.stringify(expected);
  }
  if (question.kind === 'choice') {
    const normalized = normalizeMathAnswer(answer);
    const correctIndexes = question.correctAnswers?.length ? question.correctAnswers : [question.correctAnswer];
    return mathChoiceAnswerLabels(question).some((label) => normalizeMathAnswer(label) === normalized)
      || correctIndexes.some((index) => String(index) === normalized);
  }
  if (question.kind === 'text' || question.correctAnswerText) return verifyMathTextAnswer(question, answer);
  return isAnswerCorrect(String(answer ?? ''), question.correctAnswer);
}
