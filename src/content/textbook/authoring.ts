// Small builders that keep course modules short and readable. They only fill
// in IDs and defaults — the result is plain data that the validator checks
// like any hand-written object.

import type {
  AnswerItem,
  DiagramHotspotAnswer,
  GroupingAnswer,
  MatchingAnswer,
  MultipleSelectionAnswer,
  OrderingAnswer,
  Question,
  SingleChoiceAnswer,
  SourceRef
} from '@/lib/textbook/types';

type QuestionInput = Omit<Question, 'unitId' | 'sources' | 'eligibility' | 'difficulty'>
  & Partial<Pick<Question, 'sources' | 'eligibility' | 'difficulty'>>;

// A question factory bound to one unit and its default source.
export function questionsFor(unitId: string, defaultSources: SourceRef[]) {
  return (input: QuestionInput): Question => ({
    difficulty: 1,
    eligibility: { practice: true, test: true },
    sources: defaultSources,
    ...input,
    unitId
  });
}

// Options as [id, text] pairs.
function items(pairs: ReadonlyArray<readonly [string, string]>): AnswerItem[] {
  return pairs.map(([id, text]) => ({ id, text }));
}

export function single(options: ReadonlyArray<readonly [string, string]>, correctOptionId: string, keepOptionOrder = false): SingleChoiceAnswer {
  return { type: 'single_choice', options: items(options), correctOptionId, ...(keepOptionOrder ? { keepOptionOrder } : {}) };
}

// "Õige või vale?" — a single choice with a fixed order.
export function trueFalse(isTrue: boolean): SingleChoiceAnswer {
  return single([['oige', 'Õige'], ['vale', 'Vale']], isTrue ? 'oige' : 'vale', true);
}

export function multi(options: ReadonlyArray<readonly [string, string]>, correctOptionIds: string[]): MultipleSelectionAnswer {
  return { type: 'multiple_selection', options: items(options), correctOptionIds };
}

// Pairs as [prompt, its correct choice]; `extraChoices` are distractors.
export function matching(pairs: ReadonlyArray<readonly [string, string]>, extraChoices: string[] = []): MatchingAnswer {
  const prompts = pairs.map(([text], index) => ({ id: `p${index + 1}`, text }));
  const choices = [...pairs.map(([, text], index) => ({ id: `c${index + 1}`, text })), ...extraChoices.map((text, index) => ({ id: `x${index + 1}`, text }))];
  return {
    type: 'matching',
    prompts,
    choices,
    correctPairs: Object.fromEntries(prompts.map((prompt, index) => [prompt.id, `c${index + 1}`]))
  };
}

// Groups as [id, text]; items as [text, groupId].
export function grouping(groups: ReadonlyArray<readonly [string, string]>, members: ReadonlyArray<readonly [string, string]>): GroupingAnswer {
  const itemList = members.map(([text], index) => ({ id: `i${index + 1}`, text }));
  return {
    type: 'grouping',
    groups: items(groups),
    items: itemList,
    correctGroupByItem: Object.fromEntries(members.map(([, groupId], index) => [`i${index + 1}`, groupId]))
  };
}

// Items listed in the CORRECT order.
export function ordering(correct: string[], firstLabel?: string, lastLabel?: string): OrderingAnswer {
  const list = correct.map((text, index) => ({ id: `s${index + 1}`, text }));
  return {
    type: 'ordering',
    items: list,
    correctOrder: list.map((item) => item.id),
    ...(firstLabel ? { firstLabel } : {}),
    ...(lastLabel ? { lastLabel } : {})
  };
}

export function hotspot(diagramId: string, correctRegionId: string): DiagramHotspotAnswer {
  return { type: 'diagram_hotspot', diagramId, correctRegionId };
}
