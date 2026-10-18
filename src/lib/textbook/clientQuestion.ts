// The browser's view of a frozen question: items in the stored display order,
// no key. Kept out of ./api.ts because it needs the diagram registry (hotspot
// markers), and ./api.ts is imported by client pages for its route constants:
// importing the registry there shipped every unit's diagram data to pages that
// never draw one (the course list, Kaardimäng).

import type { ClientAnswerView, ClientQuestion } from '@/lib/textbook/api';
import { getDiagram, type DiagramLookup } from '@/lib/textbook/diagramRegistry';
import type { FrozenQuestion } from '@/lib/textbook/presentation';
import type { AnswerItem, QuestionContext } from '@/lib/textbook/types';

function inOrder(items: readonly AnswerItem[], order: readonly string[] | undefined): AnswerItem[] {
  const copy = items.map((item) => ({ id: item.id, text: item.text }));
  if (!order) return copy;
  const byId = new Map(copy.map((item) => [item.id, item]));
  const ordered = order.map((id) => byId.get(id)).filter((item): item is AnswerItem => Boolean(item));
  // Anything the order missed (never expected) goes last, so nothing vanishes.
  return [...ordered, ...copy.filter((item) => !order.includes(item.id))];
}

export function toClientQuestion(frozen: FrozenQuestion, diagrams: DiagramLookup = getDiagram): ClientQuestion {
  const { question, order } = frozen;
  const answer = question.answer;
  let view: ClientAnswerView;
  switch (answer.type) {
    case 'single_choice':
    case 'multiple_selection':
      view = { type: answer.type, options: inOrder(answer.options, order.options) };
      break;
    case 'matching':
      view = { type: 'matching', prompts: inOrder(answer.prompts, order.prompts), choices: inOrder(answer.choices, order.choices) };
      break;
    case 'grouping':
      view = { type: 'grouping', groups: inOrder(answer.groups, order.groups), items: inOrder(answer.items, order.items) };
      break;
    case 'ordering':
      view = {
        type: 'ordering',
        items: inOrder(answer.items, order.items),
        ...(answer.firstLabel ? { firstLabel: answer.firstLabel } : {}),
        ...(answer.lastLabel ? { lastLabel: answer.lastLabel } : {})
      };
      break;
    case 'diagram_hotspot': {
      const diagram = diagrams(answer.diagramId);
      const ids = order.regions ?? answer.regionIds ?? diagram?.regions.map((region) => region.id) ?? [];
      view = {
        type: 'diagram_hotspot',
        diagramId: answer.diagramId,
        regions: ids.map((id) => {
          const region = diagram?.regions.find((item) => item.id === id);
          return { id, marker: region?.marker ?? '?', position: region?.position ?? '' };
        })
      };
      break;
    }
  }
  return {
    id: question.id,
    stem: question.stem,
    ...(question.context ? { context: JSON.parse(JSON.stringify(question.context)) as QuestionContext } : {}),
    answer: view
  };
}
