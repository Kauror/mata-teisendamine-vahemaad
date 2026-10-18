// Kiur's textbook course "Loodusõpetus – Õpiku õppetükid". Units 10–14 and 21 have
// their full authored content (./unit10.ts … ./unit14.ts, ./unit21.ts). Units 15–20 and 22 are METADATA-ONLY drafts:
// number, title and textbook pages. Their lessons, objectives and questions
// will be authored later from the corrected textbook text — never invent them
// here. A draft can never be published (the validator reports `unit_draft`).
// A 'ready' unit is still unpublished for the child until the parent switches
// it on in the parent area; the parent preview shows it right away.

import { DEFAULT_COURSE_SETTINGS, type Course, type Unit } from '@/lib/textbook/types';
import { unit10 } from '@/content/textbook/loodusopetus-opik/unit10';
import { unit11 } from '@/content/textbook/loodusopetus-opik/unit11';
import { unit12 } from '@/content/textbook/loodusopetus-opik/unit12';
import { unit13 } from '@/content/textbook/loodusopetus-opik/unit13';
import { unit14 } from '@/content/textbook/loodusopetus-opik/unit14';
import { unit21 } from '@/content/textbook/loodusopetus-opik/unit21';

export const LOODUSOPETUS_OPIK_COURSE_ID = 'loodusopetus-opik';

const DRAFTS: ReadonlyArray<{ number: number; title: string; from: number; to: number; note?: string }> = [
  { number: 15, title: 'Mandrid ja maailmajaod', from: 60, to: 63 },
  { number: 16, title: 'Maailmameri', from: 64, to: 65 },
  { number: 17, title: 'Eesti geograafiline asend', from: 66, to: 67 },
  { number: 18, title: 'Euroopa kaart', from: 68, to: 69 },
  { number: 19, title: 'Maakera siseehitus', from: 70, to: 73 },
  { number: 20, title: 'Vulkaanid', from: 74, to: 77 },
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

const units: Unit[] = [unit10, unit11, unit12, unit13, unit14, unit21, ...drafts].sort((left, right) => left.number - right.number);

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
