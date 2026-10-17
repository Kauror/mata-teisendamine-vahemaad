// Frozen questions and their stored display order. A session copies each
// question (key, text, context, explanation) when it starts and decides the
// option/item order once with a seeded RNG; the order is stored explicitly, so
// a refresh or a later content edit changes nothing on screen (SPEC A4).

import { seededRng, shuffleWithRng, type RNG } from '@/lib/random';
import { hotspotRegionIds } from '@/lib/textbook/grading';
import type { AnswerSpec, Question } from '@/lib/textbook/types';

// Display order per answer type (all values are IDs):
//  single_choice / multiple_selection → options
//  matching → prompts + choices
//  grouping → groups (authored order) + items
//  ordering → items (never already in the correct order when avoidable)
//  diagram_hotspot → regions (the diagram's own order; markers are fixed)
export type PresentationOrder = {
  options?: string[];
  prompts?: string[];
  choices?: string[];
  groups?: string[];
  items?: string[];
  regions?: string[];
};

export type FrozenQuestion = {
  question: Question;
  order: PresentationOrder;
};

function ids(items: ReadonlyArray<{ id: string }>) {
  return items.map((item) => item.id);
}

export function buildPresentationOrder(answer: AnswerSpec, rng: RNG): PresentationOrder {
  switch (answer.type) {
    case 'single_choice':
    case 'multiple_selection':
      return { options: answer.keepOptionOrder ? ids(answer.options) : shuffleWithRng(rng, ids(answer.options)) };
    case 'matching':
      return { prompts: shuffleWithRng(rng, ids(answer.prompts)), choices: shuffleWithRng(rng, ids(answer.choices)) };
    case 'grouping':
      return { groups: ids(answer.groups), items: shuffleWithRng(rng, ids(answer.items)) };
    case 'ordering': {
      let items = shuffleWithRng(rng, ids(answer.items));
      // A shuffle that lands on the answer would make the question trivial:
      // rotate by one (deterministic) instead.
      if (items.length > 1 && items.every((id, index) => id === answer.correctOrder[index])) items = [...items.slice(1), items[0]];
      return { items };
    }
    case 'diagram_hotspot':
      return { regions: hotspotRegionIds(answer) };
  }
}

// A deep, independent copy (JSON-safe content only).
export function cloneQuestion(question: Question): Question {
  return JSON.parse(JSON.stringify(question)) as Question;
}

// The copy also pins a hotspot question's selectable regions, so a frozen
// question grades the same even if the diagram registry changes later.
export function freezeQuestion(question: Question, rng: RNG): FrozenQuestion {
  const copy = cloneQuestion(question);
  if (copy.answer.type === 'diagram_hotspot') copy.answer.regionIds = hotspotRegionIds(copy.answer);
  return { question: copy, order: buildPresentationOrder(copy.answer, rng) };
}

// Freeze with a per-question seed (used by practice, where order does not
// depend on the queue position).
export function freezeQuestionWithSeed(question: Question, seed: number): FrozenQuestion {
  return freezeQuestion(question, seededRng(seed >>> 0));
}
