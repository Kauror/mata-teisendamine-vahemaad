import { cellKey, entryCells, entryKey, layoutCrossword } from './crossword';
import type { AnswerSlot, Answers, Mark, Marks, UnitTestContent } from './types';

// Grading for the English unit tests. Closed answers are marked here; open
// answers (check: 'parent') are left for the parent, who may also overrule
// any automatic mark. The comparison is deliberately forgiving only about
// things that are not English: letter case, spacing, the apostrophe variant
// a phone keyboard types, commas and a closing full stop/question mark.

const APOSTROPHES = /[‘’‛ʼʹ´`′]/g;
const INVISIBLE = new RegExp(`[${[0x00ad, 0x200b, 0x200c, 0x200d, 0x2060, 0xfeff].map((code) => String.fromCharCode(code)).join('')}]`, 'gu');

export const MAX_SLOT_ANSWER_LENGTH = 300;

export function normalizeSlotAnswer(value: string): string {
  return value
    .normalize('NFC')
    .replace(INVISIBLE, '')
    .replace(APOSTROPHES, "'")
    .replace(/[“”„]/g, '"')
    .replace(/,/g, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
    .replace(/[.!?…]+$/u, '')
    .trim()
    .toLocaleLowerCase('en');
}

// The words of a sentence, for comparing word order: punctuation and case are
// not part of the order.
export function sentenceWords(value: string): string[] {
  return normalizeSlotAnswer(value)
    .replace(/[.!?;:"]/g, ' ')
    .split(' ')
    .filter(Boolean);
}

export const crosswordCellAnswerKey = (exerciseId: string, row: number, col: number) => `${exerciseId}#${cellKey(row, col)}`;

export function buildSlots(content: UnitTestContent): AnswerSlot[] {
  const slots: AnswerSlot[] = [];
  for (const exercise of content.exercises) {
    if (exercise.type === 'crossword') {
      for (const entry of layoutCrossword(exercise.entries).entries) {
        slots.push({
          key: `${exercise.id}.${entryKey(entry)}`,
          exerciseId: exercise.id,
          kind: 'crossword',
          points: entry.points,
          check: 'auto',
          accepted: [entry.answer],
          label: `${entry.number} ${entry.dir === 'across' ? '→' : '↓'} ${entry.clue}`
        });
      }
      continue;
    }
    if (exercise.type === 'choice') {
      for (const item of exercise.items) {
        if (item.example) continue;
        slots.push({ key: `${exercise.id}.${item.id}`, exerciseId: exercise.id, kind: 'choice', points: item.points ?? 1, check: 'auto', accepted: [item.answer], label: item.prompt });
      }
      continue;
    }
    if (exercise.type === 'order') {
      for (const item of exercise.items) {
        if (item.example) continue;
        slots.push({ key: `${exercise.id}.${item.id}`, exerciseId: exercise.id, kind: 'order', points: item.points ?? 1, check: 'auto', accepted: item.answers, label: item.prompt || item.tokens.join(' / ') });
      }
      continue;
    }
    for (const item of exercise.items) {
      if (item.example) continue;
      const fields = item.fields ?? [''];
      fields.forEach((field, index) => {
        slots.push({
          key: `${exercise.id}.${item.id}.${index}`,
          exerciseId: exercise.id,
          kind: 'text',
          points: item.points ?? 1,
          check: item.check,
          accepted: item.answers[index] ?? [],
          label: field ? `${item.prompt} (${field})` : item.prompt
        });
      });
    }
  }
  return slots;
}

// What the child answered in one slot, as text. A crossword word is read from
// its letter cells, so a letter shared by two words counts for both.
export function slotAnswer(content: UnitTestContent, answers: Answers, slot: AnswerSlot): string {
  if (slot.kind !== 'crossword') return answers[slot.key] ?? '';
  const exercise = content.exercises.find((item) => item.id === slot.exerciseId);
  if (!exercise || exercise.type !== 'crossword') return '';
  const entry = layoutCrossword(exercise.entries).entries.find((item) => `${exercise.id}.${entryKey(item)}` === slot.key);
  if (!entry) return '';
  return entryCells(entry).map((cell) => (answers[crosswordCellAnswerKey(exercise.id, cell.row, cell.col)] ?? ' ').slice(0, 1) || ' ').join('').toUpperCase();
}

export function autoMark(slot: AnswerSlot, given: string): Mark | null {
  const answer = given.trim();
  if (!answer) return 0;
  if (slot.kind === 'crossword') return answer.replace(/\s/g, '') === slot.accepted[0] && answer.length === slot.accepted[0].length ? 1 : 0;
  if (slot.kind === 'choice') return slot.accepted.includes(answer) ? 1 : 0;
  if (slot.kind === 'order') {
    const words = sentenceWords(answer).join(' ');
    return slot.accepted.some((candidate) => sentenceWords(candidate).join(' ') === words) ? 1 : 0;
  }
  const normalized = normalizeSlotAnswer(answer);
  if (slot.accepted.some((candidate) => normalizeSlotAnswer(candidate) === normalized)) return 1;
  // An open answer that matches no model answer is the parent's call.
  return slot.check === 'parent' ? null : 0;
}

export function autoMarks(content: UnitTestContent, answers: Answers, slots = buildSlots(content)): Marks {
  return Object.fromEntries(slots.map((slot) => [slot.key, autoMark(slot, slotAnswer(content, answers, slot))]));
}

export type Score = {
  earned: number;
  total: number;
  percent: number;
  unmarked: number;
  grade: 1 | 2 | 3 | 4 | 5;
  passed: boolean;
};

// Kaur's rule (2026-11-20): 75 % or more passes (grade 4 or 5).
export const PASS_PERCENT = 0.75;

export function gradeFor(percent: number): Score['grade'] {
  if (percent >= 0.9) return 5;
  if (percent >= 0.75) return 4;
  if (percent >= 0.5) return 3;
  if (percent >= 0.2) return 2;
  return 1;
}

export function scoreMarks(slots: AnswerSlot[], marks: Marks): Score {
  let earned = 0;
  let total = 0;
  let unmarked = 0;
  for (const slot of slots) {
    total += slot.points;
    const mark = marks[slot.key];
    if (mark === null || mark === undefined) unmarked += 1;
    else earned += slot.points * mark;
  }
  const percent = total > 0 ? earned / total : 0;
  // Compare in whole hundredths so 0.75 is not lost to floating point.
  const passed = Math.round(percent * 10000) >= Math.round(PASS_PERCENT * 10000);
  return { earned, total, percent, unmarked, grade: gradeFor(percent), passed };
}

export function isMark(value: unknown): value is Mark {
  return value === 0 || value === 0.5 || value === 1;
}

// Points in Estonian notation: 17 or 17,5.
export function formatPoints(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace('.', ',');
}
