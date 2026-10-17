// Status codes → what the child sees: the label and icon of each unit status,
// the main action of a unit card, the Õpi → Harjuta → Test → Läbitud stepper
// and the next-step call to action on the unit page. Codes come from the
// server; this file only decides wording and links. Counts always go through
// the agreement helpers below ("1 küsimus", "2 küsimust").

import type { UnitDetailResponse, UnitNextStep, UnitSummary } from '@/lib/textbook/api';
import { UNIT_STATUS_LABELS, type UnitStatusCode } from '@/lib/textbook/progression';
import type { PageRange } from '@/lib/textbook/types';
import type { TextbookPaths } from '@/app/components/textbook/pages';

export const UNIT_STATUS_ICONS: Record<UnitStatusCode, string> = {
  locked: '🔒',
  start_learning: '📖',
  learning_in_progress: '📖',
  practice: '✏️',
  test_ready: '📝',
  test_in_progress: '📝',
  passed: '✓',
  review: '↻'
};

export function statusLabel(status: UnitStatusCode) {
  return UNIT_STATUS_LABELS[status];
}

/* --------------------------------------------------------- agreement */

export function questionCountWord(count: number) {
  return count === 1 ? 'küsimus' : 'küsimust';
}

export function lessonCountWord(count: number) {
  return count === 1 ? 'õppetükk' : 'õppetükki';
}

export function timesWord(count: number) {
  return count === 1 ? 'kord' : 'korda';
}

export function correctWord(count: number) {
  return count === 1 ? 'õige' : 'õiget';
}

// "lk 44–47", "lk 48"
export function pagesLabel(pages: PageRange | null | undefined) {
  if (!pages) return '';
  return pages.from === pages.to ? `lk ${pages.from}` : `lk ${pages.from}–${pages.to}`;
}

export function unitHeading(unit: { number: number; title: string }) {
  return `${unit.number}. ${unit.title}`;
}

/* ------------------------------------------------------------ course */

export type UnitAction = { label: string; href: string; primary?: boolean };

// The actions on a unit card. A locked unit has none (its card explains why);
// every other unit always links to its page, and the main action goes straight
// to the step that is due.
export function unitCardActions(unit: UnitSummary, paths: TextbookPaths): UnitAction[] {
  const page = paths.unit(unit.unitId);
  switch (unit.status) {
    case 'locked':
      return [];
    case 'start_learning':
      return [{ label: 'Alusta õppimist', href: page, primary: true }];
    case 'learning_in_progress':
      return [{ label: 'Jätka õppimist', href: page, primary: true }];
    case 'practice':
      return [{ label: 'Harjuta', href: paths.practice(unit.unitId), primary: true }, { label: 'Ava õppetükk', href: page }];
    case 'test_ready':
      return [{ label: 'Tee test', href: paths.test(unit.unitId), primary: true }, { label: 'Ava õppetükk', href: page }];
    case 'test_in_progress':
      return [{ label: 'Jätka testi', href: paths.test(unit.unitId), primary: true }, { label: 'Ava õppetükk', href: page }];
    case 'review':
      return [{ label: 'Korda ja harjuta', href: paths.practice(unit.unitId), primary: true }, { label: 'Ava õppetükk', href: page }];
    case 'passed':
      return [{ label: 'Vaata üle', href: page }];
  }
}

// Why a locked unit is locked: units open one after another.
export function lockExplanation(units: readonly UnitSummary[], unitId: string) {
  const index = units.findIndex((unit) => unit.unitId === unitId);
  const previous = index > 0 ? units[index - 1] : null;
  if (previous) return `Avaneb, kui õppetüki „${previous.title}“ test on läbitud.`;
  return 'See õppetükk avaneb hiljem.';
}

export function unitProgressLine(unit: UnitSummary) {
  const parts: string[] = [];
  if (unit.lessonsRequired > 0) parts.push(`Loetud ${unit.lessonsCompleted}/${unit.lessonsRequired}`);
  if (unit.practiceCompleted) parts.push('Harjutus tehtud');
  if (unit.bestScore) parts.push(`Parim tulemus ${unit.bestScore.correct}/${unit.bestScore.total}`);
  return parts.join(' · ');
}

/* -------------------------------------------------------------- unit */

export type StepKey = 'learn' | 'practice' | 'test' | 'done';
export type StepState = 'done' | 'current' | 'todo';
export type Step = { key: StepKey; label: string; state: StepState; note: string };

// The four steps and where the child is. "Done" means the server has it on
// record; the current step is the one the next action belongs to.
export function unitSteps(detail: Pick<UnitDetailResponse, 'gates' | 'unit' | 'nextStep'>): Step[] {
  const passed = detail.unit.testPassed;
  const reading = detail.gates.readingComplete || passed;
  const practice = detail.unit.practiceCompleted || passed;
  const current: StepKey = passed ? 'done' : stepOf(detail.nextStep);
  const state = (key: StepKey, done: boolean): StepState => (key === current && !passed ? 'current' : done ? 'done' : 'todo');
  const practiceNote = detail.nextStep === 'retake_practice' ? 'Korda teemasid' : practice ? 'Tehtud' : 'Harjuta';
  return [
    { key: 'learn', label: 'Õpi', state: state('learn', reading), note: reading ? 'Loetud' : 'Loe õppetükid' },
    { key: 'practice', label: 'Harjuta', state: state('practice', practice), note: practiceNote },
    { key: 'test', label: 'Test', state: state('test', passed), note: passed ? 'Läbitud' : 'Tee test' },
    { key: 'done', label: 'Läbitud', state: passed ? 'done' : 'todo', note: passed ? 'Tubli!' : '' }
  ];
}

function stepOf(next: UnitNextStep): StepKey {
  switch (next) {
    case 'read':
      return 'learn';
    case 'practice':
    case 'resume_practice':
    case 'retake_practice':
      return 'practice';
    case 'test':
    case 'resume_test':
      return 'test';
    case 'done':
      return 'done';
  }
}

export type NextAction = { title: string; text: string; label: string | null; href: string | null };

export function nextAction(detail: UnitDetailResponse, paths: TextbookPaths): NextAction {
  const unitId = detail.unit.unitId;
  switch (detail.nextStep) {
    case 'read': {
      const started = detail.lessons.some((lesson) => lesson.completed);
      const lessonId = detail.nextLessonId ?? detail.lessons[0]?.lessonId ?? null;
      return {
        title: 'Õpi',
        text: 'Loe õppetükid läbi. Siis saad harjutama hakata.',
        label: started ? 'Jätka lugemist' : 'Alusta lugemist',
        href: lessonId ? paths.lesson(unitId, lessonId) : null
      };
    }
    case 'practice':
      return { title: 'Harjuta', text: 'Kõik on loetud. Nüüd harjuta – iga vastuse järel näed, kas see oli õige.', label: 'Alusta harjutamist', href: paths.practice(unitId) };
    case 'resume_practice':
      return { title: 'Harjuta', text: 'Harjutus on pooleli. Jätka sealt, kus pooleli jäi.', label: 'Jätka harjutamist', href: paths.practice(unitId) };
    case 'retake_practice':
      return { title: 'Korda', text: 'Enne uut testi harjuta teemasid, mis testis veel ei õnnestunud.', label: 'Harjuta neid teemasid', href: paths.practice(unitId) };
    case 'test':
      return { title: 'Test', text: 'Harjutus on tehtud. Nüüd tee test. Testis vastuseid kohe ei kontrollita.', label: detail.attempts.length > 0 ? 'Tee test uuesti' : 'Tee test', href: paths.test(unitId) };
    case 'resume_test':
      return { title: 'Test', text: 'Test on pooleli. Sinu vastused on salvestatud.', label: 'Jätka testi', href: paths.test(unitId) };
    case 'done':
      return { title: 'Läbitud', text: 'See õppetükk on läbitud. Võid alati uuesti lugeda ja harjutada.', label: null, href: null };
  }
}
