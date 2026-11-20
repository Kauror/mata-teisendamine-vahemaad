import { generateKirsiSession } from '@/lib/exercises/kirsiMath';
import { generateKiurMathSession } from '@/lib/exercises/kiurMath';
import { MATH_GENERATOR_VERSION } from '@/lib/exercises/mathGeneratorVersion';
import { isKiurLengthTopic } from '@/lib/kiurMathTopics';
import { isDifficulty } from '@/lib/mathDifficulty';
import type { GeneratedQuestion } from '@/lib/types';

// Kordamine asks a mistake again with new numbers: a «sibling» from the same
// generator and the same template, so the child practises the skill instead of
// remembering one answer. Fixed-content items (text problems, reading, words)
// have no generator and are replayed as they were.

export type SiblingSource = {
  learner: 'kiur' | 'kirsi';
  topic: string;
  // The attempt's category: a Kiur topic's template, or Kirsi's mode.
  category: string;
  question: Pick<GeneratedQuestion, 'question' | 'kind'> & Partial<GeneratedQuestion>;
};

const KIUR_TEMPLATE_TOPICS = new Set(['jagamine-kahekohaline-uhekohaline', 'arvud-10000-piires', 'arvud-10000', 'ring-ja-ringjoon']);
const KIURS_OTHER_GENERATED = new Set(['mustrid', 'korrutamine']);
const KIRSI_MODES = new Set(['Loendamine', 'Arvutamine 10 piires', 'Arvutamine 20 piires', 'Suurem või väiksem kuni 100', 'Segaülesanded', 'Kellaaeg']);

export function hasSiblingGenerator(source: Pick<SiblingSource, 'learner' | 'topic' | 'category'>) {
  if (source.learner === 'kirsi') return KIRSI_MODES.has(source.category);
  return KIUR_TEMPLATE_TOPICS.has(source.topic) || KIURS_OTHER_GENERATED.has(source.topic) || isKiurLengthTopic(source.topic);
}

// What makes two questions the same question to a child.
export function questionContentKey(question: Partial<GeneratedQuestion>) {
  return JSON.stringify([question.question, question.visualLabels, question.visualKnownDegrees, question.count, question.emoji, question.clockHour, question.clockMinutes, question.orderingCards?.map((card) => card.label), question.choiceOptions?.slice().sort()]);
}

// The template, read off the visible question: numbers are the part that changes.
function shape(question: Partial<GeneratedQuestion>) {
  return `${question.kind ?? 'numeric'}|${question.type ?? ''}|${question.visual ?? ''}|${String(question.question ?? '').replace(/\d+/g, '#')}`;
}

// A new question of the same template, different from every key in `avoid`
// (the source itself is always avoided). `seed` makes it repeatable. Null when
// there is no generator or none of the tries gives a new question.
export function generateSiblingQuestion(source: SiblingSource, seed: number, avoid: ReadonlySet<string> = new Set()): GeneratedQuestion | null {
  if (!hasSiblingGenerator(source)) return null;
  const difficulty = isDifficulty(source.question.difficulty) ? source.question.difficulty : 'Lihtne';
  const sourceShape = shape(source.question);
  const used = new Set([...avoid, questionContentKey(source.question)]);
  const templateCategory = source.learner === 'kiur' && KIUR_TEMPLATE_TOPICS.has(source.topic) && typeof source.question.category === 'string'
    ? source.question.category
    : 'Segaharjutus';
  let sameCategory: GeneratedQuestion | null = null;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const sessionSeed = (seed * 7919 + attempt * 104729) >>> 0;
    const session = source.learner === 'kirsi'
      ? generateKirsiSession(source.category as Parameters<typeof generateKirsiSession>[0], 15, sessionSeed, MATH_GENERATOR_VERSION)
      : generateKiurMathSession(source.topic, templateCategory, difficulty, 15, sessionSeed, MATH_GENERATOR_VERSION);
    for (const candidate of session) {
      if (used.has(questionContentKey(candidate))) continue;
      if (shape(candidate) === sourceShape) return candidate;
      // Same template category (Kiur's division, numbers and circle topics name
      // the template there) when the wording itself varies, e.g. the noun.
      if (!sameCategory && templateCategory !== 'Segaharjutus' && candidate.category === source.question.category && candidate.kind === source.question.kind) sameCategory = candidate;
    }
    if (sameCategory && attempt >= 3) return sameCategory;
  }
  return sameCategory;
}
