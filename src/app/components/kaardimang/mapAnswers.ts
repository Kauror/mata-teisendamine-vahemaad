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
      // The South Pole dot lies on Antarctica: tapping the middle of the
      // continent hits it, and that is the continent, not a wrong place.
      if (pick.kind === 'marker') return pick.id === 'south-pole' ? 'antarctica' : NO_AREA_ANSWER;
      return SEA_ANSWER;
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

// The tap circle of each small-country marker, in map units, for a map shown
// at `units` map units per CSS pixel: at least 10 px where there is room, but
// never past half the gap to the nearest marker. The build keeps the circles
// apart in map units (hr); a phone-sized minimum alone would make them overlap
// again, and a tap between two dots would then go to whichever is drawn last.
export const MARKER_MIN_HIT_PX = 10;
export function markerHitRadii(markers: Array<{ id: string; x: number; y: number; hr: number }>, units: number): Map<string, number> {
  return new Map(markers.map((marker) => {
    let halfGap = Infinity;
    for (const other of markers) if (other !== marker) halfGap = Math.min(halfGap, Math.hypot(other.x - marker.x, other.y - marker.y) / 2);
    return [marker.id, Math.min(Math.max(marker.hr, MARKER_MIN_HIT_PX * units), halfGap)];
  }));
}

// Uuri's line under a map area that is not a country. Only "Gröönimaa (Taani)"
// style names have the owner in brackets; "Lääne-Sahara (staatus vaidlustatud)"
// and "Prantsuse Polüneesia" do not, and must not be told so.
export function contextNoteEt(name: string, countryNames: ReadonlySet<string>): string {
  const bracket = /\(([^)]+)\)$/u.exec(name)?.[1];
  if (bracket && /vaidlustatud/u.test(bracket)) return 'Selle ala staatus on vaidlustatud.';
  if (bracket && (countryNames.has(bracket) || bracket === 'USA')) return 'See ala ei ole iseseisev riik. Sulgudes on riik, kellele see kuulub.';
  return 'See ala ei ole iseseisev riik.';
}

// "8 küsimusest 6 õiget": partitive after every number but 1.
export function scoreLine(correct: number, total: number): string {
  return `${total} küsimusest ${correct} ${correct === 1 ? 'õige' : 'õiget'}`;
}
