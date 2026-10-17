// Pure helpers between a map tap and a question: which answer id a tap means,
// and how the map is painted for the current question. Unit-tested.

import { NO_AREA_ANSWER, SEA_ANSWER, type ClientQuestion } from '@/lib/kaardimang/engine';
import type { MapPick, Paint } from './MapView';

// A map tap → the id the server grades. Continent and world-part questions
// answer with the land's continent or world part; land outside any of them,
// or open sea, is a neutral answer that never counts as wrong.
export function answerIdFor(question: Pick<ClientQuestion, 'targetType'>, pick: MapPick): string {
  switch (question.targetType) {
    case 'continent':
      if (pick.kind === 'land') return pick.ct ?? NO_AREA_ANSWER;
      return pick.kind === 'marker' ? pick.id : SEA_ANSWER;
    case 'worldPart':
      if (pick.kind === 'land') return pick.wp ?? NO_AREA_ANSWER;
      return SEA_ANSWER;
    case 'ocean':
      if (pick.kind === 'area') return pick.id;
      return pick.kind === 'land' || pick.kind === 'marker' ? pick.id : SEA_ANSWER;
    default:
      return pick.kind === 'land' || pick.kind === 'marker' ? pick.id : SEA_ANSWER;
  }
}

// Which property of a land feature a question's ids refer to.
function keyOf(question: Pick<ClientQuestion, 'targetType'>, feature: { id: string; wp?: string | null; ct?: string | null }): string | null {
  if (question.targetType === 'continent') return feature.ct ?? null;
  if (question.targetType === 'worldPart') return feature.wp ?? null;
  return feature.id;
}

export function playPaint(question: ClientQuestion, feature: { id: string; wp?: string | null; ct?: string | null }): Paint {
  const key = keyOf(question, feature);
  if (question.correctId && key === question.correctId) return 'correct';
  if (key && question.state.wrongIds.includes(key)) return 'wrong';
  if (question.highlightId && feature.id === question.highlightId) return 'highlight';
  if ((question.targetType === 'continent' || question.targetType === 'worldPart') && !key) return 'dim';
  return null;
}

export function playAreaPaint(question: ClientQuestion, id: string): Paint {
  if (question.targetType !== 'ocean') return null;
  if (question.correctId === id) return 'correct';
  if (question.state.wrongIds.includes(id)) return 'wrong';
  return null;
}

// "8 küsimusest 6 õiget": partitive after every number but 1.
export function scoreLine(correct: number, total: number): string {
  return `${total} küsimusest ${correct} ${correct === 1 ? 'õige' : 'õiget'}`;
}
