// Deterministic grading for the six answer types. Strict exactness: a
// multiple-selection, matching, grouping or ordering answer is correct only if
// it is entirely correct — there is no partial credit anywhere.
//
// Grading reads ONLY `question.answer` (the key). The presentation context, the
// stem, the explanation and the display order of options are never consulted,
// and everything is compared by stable ID, never by displayed text.
//
// Responses arrive from the browser, so every function here accepts unknown
// input defensively: a malformed response is simply incorrect (and
// `parseResponse` lets the server reject it with a 400 before grading).

import type { AnswerResponse, AnswerSpec, Question } from '@/lib/textbook/types';
import { diagramRegionIds } from '@/lib/textbook/diagramRegistry';

export type GradeResult = {
  correct: boolean;
  // The full correct answer, in the same shape as a response.
  correctResponse: AnswerResponse;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return isRecord(value) && Object.values(value).every((item) => typeof item === 'string');
}

// The selectable region IDs of a hotspot question.
export function hotspotRegionIds(answer: Extract<AnswerSpec, { type: 'diagram_hotspot' }>): string[] {
  return answer.regionIds && answer.regionIds.length > 0 ? [...answer.regionIds] : diagramRegionIds(answer.diagramId);
}

// The key, expressed as a response.
export function correctResponseFor(answer: AnswerSpec): AnswerResponse {
  switch (answer.type) {
    case 'single_choice':
      return { type: 'single_choice', optionId: answer.correctOptionId };
    case 'multiple_selection': {
      const order = answer.options.map((option) => option.id);
      return { type: 'multiple_selection', optionIds: [...answer.correctOptionIds].sort((a, b) => order.indexOf(a) - order.indexOf(b)) };
    }
    case 'matching':
      return { type: 'matching', pairs: { ...answer.correctPairs } };
    case 'grouping':
      return { type: 'grouping', assignments: { ...answer.correctGroupByItem } };
    case 'ordering':
      return { type: 'ordering', order: [...answer.correctOrder] };
    case 'diagram_hotspot':
      return { type: 'diagram_hotspot', regionId: answer.correctRegionId };
  }
}

// Shape check against the question: right type, IDs that exist, no
// duplicates. Returns a clean copy, or null when the response is malformed.
// A shape-valid response may still be incomplete (see isResponseComplete).
export function parseResponse(answer: AnswerSpec, raw: unknown): AnswerResponse | null {
  if (!isRecord(raw) || raw.type !== answer.type) return null;
  switch (answer.type) {
    case 'single_choice': {
      const ids = new Set(answer.options.map((option) => option.id));
      return typeof raw.optionId === 'string' && ids.has(raw.optionId) ? { type: 'single_choice', optionId: raw.optionId } : null;
    }
    case 'multiple_selection': {
      const ids = new Set(answer.options.map((option) => option.id));
      if (!isStringArray(raw.optionIds)) return null;
      if (new Set(raw.optionIds).size !== raw.optionIds.length || !raw.optionIds.every((id) => ids.has(id))) return null;
      return { type: 'multiple_selection', optionIds: [...raw.optionIds] };
    }
    case 'matching': {
      const prompts = new Set(answer.prompts.map((item) => item.id));
      const choices = new Set(answer.choices.map((item) => item.id));
      if (!isStringRecord(raw.pairs)) return null;
      const entries = Object.entries(raw.pairs);
      if (!entries.every(([prompt, choice]) => prompts.has(prompt) && choices.has(choice))) return null;
      // A choice can be used only once.
      if (new Set(entries.map(([, choice]) => choice)).size !== entries.length) return null;
      return { type: 'matching', pairs: Object.fromEntries(entries) };
    }
    case 'grouping': {
      const items = new Set(answer.items.map((item) => item.id));
      const groups = new Set(answer.groups.map((group) => group.id));
      if (!isStringRecord(raw.assignments)) return null;
      const entries = Object.entries(raw.assignments);
      if (!entries.every(([item, group]) => items.has(item) && groups.has(group))) return null;
      return { type: 'grouping', assignments: Object.fromEntries(entries) };
    }
    case 'ordering': {
      const items = new Set(answer.items.map((item) => item.id));
      if (!isStringArray(raw.order)) return null;
      if (new Set(raw.order).size !== raw.order.length || !raw.order.every((id) => items.has(id))) return null;
      return { type: 'ordering', order: [...raw.order] };
    }
    case 'diagram_hotspot': {
      const regions = new Set(hotspotRegionIds(answer));
      return typeof raw.regionId === 'string' && regions.has(raw.regionId) ? { type: 'diagram_hotspot', regionId: raw.regionId } : null;
    }
  }
}

// Whether the learner has answered every part (the test requires complete
// answers; the UI enables "Vasta" only then). Malformed → false.
export function isResponseComplete(answer: AnswerSpec, raw: unknown): boolean {
  const response = parseResponse(answer, raw);
  if (!response) return false;
  switch (response.type) {
    case 'single_choice':
    case 'diagram_hotspot':
      return true;
    case 'multiple_selection':
      return response.optionIds.length > 0;
    case 'matching':
      return answer.type === 'matching' && answer.prompts.every((prompt) => prompt.id in response.pairs);
    case 'grouping':
      return answer.type === 'grouping' && answer.items.every((item) => item.id in response.assignments);
    case 'ordering':
      return answer.type === 'ordering' && response.order.length === answer.items.length;
  }
}

function sameSet(left: readonly string[], right: readonly string[]) {
  if (left.length !== right.length) return false;
  const set = new Set(left);
  return set.size === left.length && right.every((item) => set.has(item));
}

function sameRecord(left: Record<string, string>, right: Record<string, string>) {
  const leftKeys = Object.keys(left);
  return leftKeys.length === Object.keys(right).length && leftKeys.every((key) => right[key] === left[key]);
}

function isCorrect(answer: AnswerSpec, response: AnswerResponse): boolean {
  switch (answer.type) {
    case 'single_choice':
      return response.type === 'single_choice' && response.optionId === answer.correctOptionId;
    case 'multiple_selection':
      return response.type === 'multiple_selection' && sameSet(response.optionIds, answer.correctOptionIds);
    case 'matching':
      return response.type === 'matching' && sameRecord(response.pairs, answer.correctPairs);
    case 'grouping':
      return response.type === 'grouping' && sameRecord(response.assignments, answer.correctGroupByItem);
    case 'ordering':
      return response.type === 'ordering'
        && response.order.length === answer.correctOrder.length
        && response.order.every((id, index) => id === answer.correctOrder[index]);
    case 'diagram_hotspot':
      return response.type === 'diagram_hotspot' && response.regionId === answer.correctRegionId;
  }
}

// Grade one response. Only `question.answer` is read.
export function gradeAnswer(question: Pick<Question, 'answer'>, response: unknown): GradeResult {
  const parsed = parseResponse(question.answer, response);
  return {
    correct: parsed !== null && isCorrect(question.answer, parsed),
    correctResponse: correctResponseFor(question.answer)
  };
}
