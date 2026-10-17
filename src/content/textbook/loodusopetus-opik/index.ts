// Kiur's textbook course "Loodusõpetus – Õpiku õppetükid". Units 10 and 12
// have their full authored content (./unit10.ts, ./unit12.ts). The others are METADATA-ONLY drafts:
// number, title and textbook pages. Their lessons, objectives and questions
// will be authored later from the corrected textbook text — never invent them
// here. A draft can never be published (the validator reports `unit_draft`).
// A 'ready' unit is still unpublished for the child until the parent switches
// it on in the parent area; the parent preview shows it right away.

import { DEFAULT_COURSE_SETTINGS, type Course, type Unit } from '@/lib/textbook/types';
import { unit10 } from '@/content/textbook/loodusopetus-opik/unit10';
import { unit12 } from '@/content/textbook/loodusopetus-opik/unit12';

export const LOODUSOPETUS_OPIK_COURSE_ID = 'loodusopetus-opik';

const DRAFTS: ReadonlyArray<{ number: number; title: string; from: number; to: number; note?: string }> = [
  { number: 11, title: 'Gloobus', from: 48, to: 49 },
  { number: 13, title: 'Kaardi mõõtkava', from: 54, to: 57 },
  { number: 14, title: 'Kaartide mitmekesisus', from: 58, to: 59 },
  { number: 15, title: 'Mandrid ja maailmajaod', from: 60, to: 63 },
  { number: 16, title: 'Maailmameri', from: 64, to: 65 },
  { number: 17, title: 'Eesti geograafiline asend', from: 66, to: 67 },
  { number: 18, title: 'Euroopa kaart', from: 68, to: 69 },
  { number: 19, title: 'Maakera siseehitus', from: 70, to: 73 },
  { number: 20, title: 'Vulkaanid', from: 74, to: 77 },
  { number: 21, title: 'Maavärinad', from: 78, to: 81 },
  { number: 22, title: 'Loodusõnnetused', from: 82, to: 83, note: 'Õpiku tekst võib olla puudulik.' }
];

const drafts: Unit[] = DRAFTS.map((draft) => ({
  id: `lo-opik-u${draft.number}`,
  courseId: LOODUSOPETUS_OPIK_COURSE_ID,
  number: draft.number,
  title: draft.title,
  pages: { from: draft.from, to: draft.to, ...(draft.note ? { note: draft.note } : {}) },
  status: 'draft',
  contentVersion: '0',
  objectives: [],
  lessons: [],
  questions: []
}));

const units: Unit[] = [unit10, unit12, ...drafts].sort((left, right) => left.number - right.number);

export const loodusopetusOpikCourse: Course = {
  id: LOODUSOPETUS_OPIK_COURSE_ID,
  title: 'Loodusõpetus – Õpiku õppetükid',
  subject: 'loodusopetus',
  learners: ['kiur'],
  previewOnly: false,
  // 20 questions, pass at 95 % (19/20), 8/7/5 levels, ~12 practice questions.
  settings: { ...DEFAULT_COURSE_SETTINGS },
  units
};
