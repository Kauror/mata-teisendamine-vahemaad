// Pure helpers behind the six answer components: the empty draft per answer
// type, "is this draft a complete answer", the small edits each control makes
// (toggle, pair, assign, move) and a readable Estonian description of an
// answer for the feedback and review screens. Everything works on IDs; text is
// only looked up for display.

import type { ClientAnswerView } from '@/lib/textbook/api';
import { getDiagram, type DiagramLookup } from '@/lib/textbook/diagramRegistry';
import type { AnswerItem, AnswerResponse, AnswerSpec } from '@/lib/textbook/types';

export type AnswerDraft = AnswerResponse | null;

// The starting draft: nothing answered yet. Ordering too — the displayed order
// only becomes an answer once the child moves a row or confirms the order, so
// a question merely shown never counts as answered.
export function emptyDraft(view: ClientAnswerView): AnswerDraft {
  switch (view.type) {
    case 'single_choice':
    case 'diagram_hotspot':
    case 'ordering':
      return null;
    case 'multiple_selection':
      return { type: 'multiple_selection', optionIds: [] };
    case 'matching':
      return { type: 'matching', pairs: {} };
    case 'grouping':
      return { type: 'grouping', assignments: {} };
  }
}

// A saved answer of the right type, or the empty draft.
export function draftFrom(view: ClientAnswerView, saved: AnswerResponse | null | undefined): AnswerDraft {
  if (saved && saved.type === view.type) return saved;
  return emptyDraft(view);
}

export function isDraftComplete(view: ClientAnswerView, draft: AnswerDraft): draft is AnswerResponse {
  if (!draft || draft.type !== view.type) return false;
  switch (draft.type) {
    case 'single_choice':
      return view.type === 'single_choice' && view.options.some((option) => option.id === draft.optionId);
    case 'multiple_selection':
      return draft.optionIds.length > 0;
    case 'matching':
      return view.type === 'matching' && view.prompts.every((prompt) => Boolean(draft.pairs[prompt.id]));
    case 'grouping':
      return view.type === 'grouping' && view.items.every((item) => Boolean(draft.assignments[item.id]));
    case 'ordering':
      return view.type === 'ordering' && draft.order.length === view.items.length;
    case 'diagram_hotspot':
      return view.type === 'diagram_hotspot' && view.regions.some((region) => region.id === draft.regionId);
  }
}

// Same answer, compared by value (key order and selection order do not matter
// where the answer type does not care about them).
export function sameResponse(a: AnswerDraft, b: AnswerDraft): boolean {
  if (!a || !b) return a === b;
  if (a.type !== b.type) return false;
  switch (a.type) {
    case 'single_choice':
      return a.optionId === (b as typeof a).optionId;
    case 'diagram_hotspot':
      return a.regionId === (b as typeof a).regionId;
    case 'multiple_selection': {
      const other = new Set((b as typeof a).optionIds);
      return a.optionIds.length === other.size && a.optionIds.every((id) => other.has(id));
    }
    case 'matching':
      return sameRecord(a.pairs, (b as typeof a).pairs);
    case 'grouping':
      return sameRecord(a.assignments, (b as typeof a).assignments);
    case 'ordering': {
      const order = (b as typeof a).order;
      return a.order.length === order.length && a.order.every((id, index) => id === order[index]);
    }
  }
}

function sameRecord(a: Record<string, string>, b: Record<string, string>) {
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every((key) => a[key] === b[key]);
}

/* ------------------------------------------------------------- edits */

export function toggleOption(draft: AnswerDraft, optionId: string): AnswerResponse {
  const current = draft?.type === 'multiple_selection' ? draft.optionIds : [];
  const optionIds = current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId];
  return { type: 'multiple_selection', optionIds };
}

// Pair a prompt with a choice. A choice is used at most once, so taking it
// for this prompt frees it from any other; pairing the same two again unpairs.
export function pairPrompt(draft: AnswerDraft, promptId: string, choiceId: string): AnswerResponse {
  const pairs = { ...(draft?.type === 'matching' ? draft.pairs : {}) };
  if (pairs[promptId] === choiceId) {
    delete pairs[promptId];
    return { type: 'matching', pairs };
  }
  for (const [key, value] of Object.entries(pairs)) {
    if (value === choiceId) delete pairs[key];
  }
  pairs[promptId] = choiceId;
  return { type: 'matching', pairs };
}

export function assignGroup(draft: AnswerDraft, itemId: string, groupId: string): AnswerResponse {
  const assignments = { ...(draft?.type === 'grouping' ? draft.assignments : {}) };
  assignments[itemId] = groupId;
  return { type: 'grouping', assignments };
}

// Move one item up (delta −1) or down (+1); out-of-range moves change nothing.
export function moveItem(order: readonly string[], itemId: string, delta: -1 | 1): string[] {
  const index = order.indexOf(itemId);
  const target = index + delta;
  if (index < 0 || target < 0 || target >= order.length) return [...order];
  const next = [...order];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

// The first prompt still waiting for a choice (the matching control moves
// on to it after each pairing).
export function nextOpenPrompt(view: Extract<ClientAnswerView, { type: 'matching' }>, draft: AnswerDraft, after?: string): string | null {
  const pairs = draft?.type === 'matching' ? draft.pairs : {};
  const prompts = view.prompts.map((prompt) => prompt.id);
  const start = after ? prompts.indexOf(after) + 1 : 0;
  const rotated = [...prompts.slice(start), ...prompts.slice(0, start)];
  return rotated.find((id) => !pairs[id]) ?? null;
}

/* ------------------------------------------------------- descriptions */

function textOf(items: readonly AnswerItem[], id: string | undefined) {
  if (!id) return '—';
  return items.find((item) => item.id === id)?.text ?? '—';
}

export function regionLabel(diagramId: string, regionId: string, diagrams: DiagramLookup = getDiagram) {
  const region = diagrams(diagramId)?.regions.find((item) => item.id === regionId);
  return region ? `${region.marker} – ${region.label}` : regionId;
}

// Lines that spell out an answer, e.g. for "Õige vastus:". Hotspot answers
// name the region with its real label: this is only ever shown after the
// question has been answered (or to the parent).
export function describeResponse(view: ClientAnswerView, response: AnswerResponse | null | undefined, diagrams: DiagramLookup = getDiagram): string[] {
  if (!response || response.type !== view.type) return ['—'];
  switch (response.type) {
    case 'single_choice':
      return [textOf((view as Extract<ClientAnswerView, { type: 'single_choice' }>).options, response.optionId)];
    case 'multiple_selection': {
      const options = (view as Extract<ClientAnswerView, { type: 'multiple_selection' }>).options;
      const chosen = options.filter((option) => response.optionIds.includes(option.id)).map((option) => option.text);
      return chosen.length > 0 ? [chosen.join(', ')] : ['—'];
    }
    case 'matching': {
      const matching = view as Extract<ClientAnswerView, { type: 'matching' }>;
      return matching.prompts.map((prompt) => `${prompt.text} → ${textOf(matching.choices, response.pairs[prompt.id])}`);
    }
    case 'grouping': {
      const grouping = view as Extract<ClientAnswerView, { type: 'grouping' }>;
      return grouping.groups.map((group) => {
        const members = grouping.items.filter((item) => response.assignments[item.id] === group.id).map((item) => item.text);
        return `${group.text}: ${members.length > 0 ? members.join(', ') : '—'}`;
      });
    }
    case 'ordering': {
      const items = (view as Extract<ClientAnswerView, { type: 'ordering' }>).items;
      return response.order.map((id, index) => `${index + 1}. ${textOf(items, id)}`);
    }
    case 'diagram_hotspot':
      return [regionLabel((view as Extract<ClientAnswerView, { type: 'diagram_hotspot' }>).diagramId, response.regionId, diagrams)];
  }
}

// The authored (unshuffled) view of a full question's answer, for the parent.
export function viewFromSpec(spec: AnswerSpec, diagrams: DiagramLookup = getDiagram): ClientAnswerView {
  switch (spec.type) {
    case 'single_choice':
    case 'multiple_selection':
      return { type: spec.type, options: spec.options };
    case 'matching':
      return { type: 'matching', prompts: spec.prompts, choices: spec.choices };
    case 'grouping':
      return { type: 'grouping', groups: spec.groups, items: spec.items };
    case 'ordering':
      return { type: 'ordering', items: spec.items, ...(spec.firstLabel ? { firstLabel: spec.firstLabel } : {}), ...(spec.lastLabel ? { lastLabel: spec.lastLabel } : {}) };
    case 'diagram_hotspot': {
      const diagram = diagrams(spec.diagramId);
      const ids = spec.regionIds ?? diagram?.regions.map((region) => region.id) ?? [];
      return {
        type: 'diagram_hotspot',
        diagramId: spec.diagramId,
        regions: ids.map((id) => {
          const region = diagram?.regions.find((item) => item.id === id);
          return { id, marker: region?.marker ?? '?', position: region?.position ?? '' };
        })
      };
    }
  }
}

export const ANSWER_TYPE_LABELS: Record<AnswerSpec['type'], string> = {
  single_choice: 'Üks õige vastus',
  multiple_selection: 'Mitu õiget vastust',
  matching: 'Paaride ühendamine',
  grouping: 'Rühmitamine',
  ordering: 'Järjestamine',
  diagram_hotspot: 'Joonisel näitamine'
};

// The instruction under the stem.
export const ANSWER_HINTS: Record<AnswerSpec['type'], string> = {
  single_choice: 'Vali üks vastus.',
  multiple_selection: 'Vali kõik sobivad vastused.',
  matching: 'Vali rida ja siis sellele sobiv vaste.',
  grouping: 'Vali iga sõna juurest, kuhu rühma see kuulub.',
  ordering: 'Tõsta ridu nuppudega üles või alla.',
  diagram_hotspot: 'Puuduta joonisel õiget kohta või vali täht nimekirjast.'
};
