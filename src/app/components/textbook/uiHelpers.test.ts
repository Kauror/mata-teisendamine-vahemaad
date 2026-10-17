import { describe, expect, it } from 'vitest';
import type { TestSessionView, UnitDetailResponse, UnitSummary } from '@/lib/textbook/api';
import { clampSection, finishState, pagerView, sectionParam } from '@/app/components/textbook/pager';
import { textbookPaths } from '@/app/components/textbook/pages';
import {
  correctWord,
  lessonCountWord,
  lockExplanation,
  nextAction,
  pagesLabel,
  questionCountWord,
  statusLabel,
  timesWord,
  unitCardActions,
  unitProgressLine,
  unitSteps
} from '@/app/components/textbook/status';
import { errorFrom, newActionId, TEXTBOOK_OFFLINE_MESSAGE, getJson, postJson } from '@/app/components/textbook/textbookClient';
import { firstOpenQuestion, testAnsweredCount } from '@/app/components/textbook/testState';
import { ACTION_ID_PATTERN } from '@/lib/textbook/api';
import { UNIT_STATUS_LABELS, type UnitStatusCode } from '@/lib/textbook/progression';

const child = textbookPaths('child', 'loodusopetus-opik');
const preview = textbookPaths('preview', 'textbook-demo');

function unit(status: UnitStatusCode, overrides: Partial<UnitSummary> = {}): UnitSummary {
  return {
    unitId: 'u1', number: 10, title: 'Maa kuju', pages: { from: 44, to: 47 }, status, statusLabel: UNIT_STATUS_LABELS[status],
    lessonsCompleted: 0, lessonsRequired: 2, practiceCompleted: false, testPassed: false, bestScore: null, ...overrides
  };
}

function detail(overrides: Partial<UnitDetailResponse>): UnitDetailResponse {
  return {
    scope: 'child',
    course: { courseId: 'loodusopetus-opik', title: 'Kursus', previewOnly: false },
    unit: { ...unit('start_learning'), contentVersion: '1' },
    lessons: [{ lessonId: 'l1', title: 'Esimene', order: 1, required: true, completed: false, sectionCount: 2 }],
    objectives: [],
    gates: { readingComplete: false, practiceUnlocked: false, testUnlocked: false, retakePracticePending: false },
    activePracticeSessionId: null,
    activeTestSessionId: null,
    attempts: [],
    missedObjectives: [],
    nextStep: 'read',
    nextLessonId: 'l1',
    nextUnit: null,
    ...overrides
  };
}

describe('pager', () => {
  it('clamps a section number from the URL', () => {
    expect(clampSection('2', 3)).toBe(1);
    expect(clampSection('99', 3)).toBe(2);
    expect(clampSection('0', 3)).toBe(0);
    expect(clampSection('abc', 3)).toBe(0);
    expect(clampSection(null, 3)).toBe(0);
    expect(sectionParam(1)).toBe('2');
  });

  it('labels the section and knows the ends', () => {
    expect(pagerView(0, 3)).toMatchObject({ isFirst: true, isLast: false, label: 'Osa 1/3' });
    expect(pagerView(2, 3)).toMatchObject({ isFirst: false, isLast: true, label: 'Osa 3/3' });
    // A one-section lesson is first and last at once.
    expect(pagerView(0, 1)).toMatchObject({ isFirst: true, isLast: true });
  });

  it('enables "Lugesin läbi" only on the last section once its end was seen', () => {
    expect(finishState({ isLast: false, endSeen: true, completed: false })).toBe('hidden');
    expect(finishState({ isLast: true, endSeen: false, completed: false })).toBe('waiting');
    expect(finishState({ isLast: true, endSeen: true, completed: false })).toBe('ready');
    expect(finishState({ isLast: false, endSeen: false, completed: true })).toBe('done');
  });
});

describe('page paths', () => {
  it('serves the child course under /kiur and the preview under /vanem', () => {
    expect(child.course).toBe('/kiur/loodusopetus/opik');
    expect(child.lesson('u1', 'l1')).toBe('/kiur/loodusopetus/opik/u1/lugemine/l1');
    expect(child.practice('u1')).toBe('/kiur/loodusopetus/opik/u1/harjuta');
    expect(preview.course).toBe('/vanem/oppetukid/eelvaade/textbook-demo');
    expect(preview.test('demo-vesi')).toBe('/vanem/oppetukid/eelvaade/textbook-demo/demo-vesi/test');
  });
});

describe('unit status wording', () => {
  it('has a label for all eight statuses', () => {
    const codes: UnitStatusCode[] = ['locked', 'start_learning', 'learning_in_progress', 'practice', 'test_ready', 'test_in_progress', 'passed', 'review'];
    expect(codes.map(statusLabel)).toEqual(['Lukus', 'Alusta õppimist', 'Õppimine pooleli', 'Harjuta', 'Test ootab', 'Test pooleli', 'Läbitud', 'Korda']);
  });

  it('gives each card the action that is due, and none to a locked unit', () => {
    expect(unitCardActions(unit('locked'), child)).toEqual([]);
    expect(unitCardActions(unit('start_learning'), child)[0]).toMatchObject({ label: 'Alusta õppimist', href: '/kiur/loodusopetus/opik/u1', primary: true });
    expect(unitCardActions(unit('practice'), child)[0].href).toBe('/kiur/loodusopetus/opik/u1/harjuta');
    expect(unitCardActions(unit('test_in_progress'), child)[0]).toMatchObject({ label: 'Jätka testi', href: '/kiur/loodusopetus/opik/u1/test' });
    expect(unitCardActions(unit('review'), child)[0].href).toBe('/kiur/loodusopetus/opik/u1/harjuta');
    // A passed unit stays open for revision.
    expect(unitCardActions(unit('passed'), child)).toEqual([{ label: 'Vaata üle', href: '/kiur/loodusopetus/opik/u1' }]);
  });

  it('explains a lock by the previous unit', () => {
    const units = [unit('passed', { unitId: 'a', title: 'Maa kuju' }), unit('locked', { unitId: 'b', title: 'Gloobus' })];
    expect(lockExplanation(units, 'b')).toBe('Avaneb, kui õppetüki „Maa kuju“ test on läbitud.');
    expect(lockExplanation(units, 'a')).toBe('See õppetükk avaneb hiljem.');
  });

  it('summarises progress', () => {
    expect(unitProgressLine(unit('test_ready', { lessonsCompleted: 2, practiceCompleted: true, bestScore: { correct: 18, total: 20 } }))).toBe('Loetud 2/2 · Harjutus tehtud · Parim tulemus 18/20');
    expect(pagesLabel({ from: 44, to: 47 })).toBe('lk 44–47');
    expect(pagesLabel({ from: 48, to: 48 })).toBe('lk 48');
    expect(pagesLabel(null)).toBe('');
  });

  it('uses Estonian number agreement', () => {
    expect(questionCountWord(1)).toBe('küsimus');
    expect(questionCountWord(20)).toBe('küsimust');
    expect(lessonCountWord(1)).toBe('õppetükk');
    expect(lessonCountWord(3)).toBe('õppetükki');
    expect(timesWord(1)).toBe('kord');
    expect(timesWord(2)).toBe('korda');
    expect(correctWord(1)).toBe('õige');
    expect(correctWord(19)).toBe('õiget');
  });
});

describe('unit steps and next step', () => {
  it('marks the current step and what is done', () => {
    const reading = unitSteps(detail({}));
    expect(reading.map((step) => step.state)).toEqual(['current', 'todo', 'todo', 'todo']);
    const testing = unitSteps(detail({ nextStep: 'test', gates: { readingComplete: true, practiceUnlocked: true, testUnlocked: true, retakePracticePending: false }, unit: { ...unit('test_ready', { practiceCompleted: true }), contentVersion: '1' } }));
    expect(testing.map((step) => step.state)).toEqual(['done', 'done', 'current', 'todo']);
    const retake = unitSteps(detail({ nextStep: 'retake_practice', gates: { readingComplete: true, practiceUnlocked: true, testUnlocked: false, retakePracticePending: true }, unit: { ...unit('review', { practiceCompleted: true }), contentVersion: '1' } }));
    expect(retake[1]).toMatchObject({ state: 'current', note: 'Korda teemasid' });
    const passed = unitSteps(detail({ nextStep: 'done', unit: { ...unit('passed', { testPassed: true }), contentVersion: '1' } }));
    expect(passed.every((step) => step.state === 'done')).toBe(true);
  });

  it('links the next step', () => {
    expect(nextAction(detail({}), child)).toMatchObject({ label: 'Alusta lugemist', href: '/kiur/loodusopetus/opik/u1/lugemine/l1' });
    expect(nextAction(detail({ nextStep: 'retake_practice' }), child)).toMatchObject({ label: 'Harjuta neid teemasid', href: '/kiur/loodusopetus/opik/u1/harjuta' });
    expect(nextAction(detail({ nextStep: 'resume_test' }), preview).href).toBe('/vanem/oppetukid/eelvaade/textbook-demo/u1/test');
    expect(nextAction(detail({ nextStep: 'done' }), child)).toMatchObject({ label: null, href: null });
  });
});

describe('test runner state', () => {
  const view = {
    questions: [
      { id: 'q1', stem: 'a', answer: { type: 'single_choice', options: [{ id: 'x', text: 'x' }] } },
      { id: 'q2', stem: 'b', answer: { type: 'single_choice', options: [{ id: 'x', text: 'x' }] } }
    ],
    answers: { q1: { type: 'single_choice', optionId: 'x' } }
  } as unknown as TestSessionView;

  it('resumes on the first unanswered question', () => {
    expect(firstOpenQuestion(view)).toBe(1);
    expect(firstOpenQuestion({ ...view, answers: { ...view.answers, q2: { type: 'single_choice', optionId: 'x' } } })).toBe(0);
  });

  it('counts saved and complete on-screen answers', () => {
    expect(testAnsweredCount(view, (id) => view.answers[id] ?? null)).toBe(1);
    expect(testAnsweredCount(view, () => ({ type: 'single_choice', optionId: 'x' }))).toBe(2);
  });
});

describe('textbook client', () => {
  it('mints action ids the server accepts', () => {
    for (let i = 0; i < 20; i += 1) expect(newActionId()).toMatch(ACTION_ID_PATTERN);
  });

  it('turns server errors into Estonian messages and keeps the session of a 409', () => {
    expect(errorFrom(403, { code: 'gate_reading', message: 'Loe enne läbi.' })).toMatchObject({ code: 'gate_reading', message: 'Loe enne läbi.', retryable: false });
    expect(errorFrom(403, { code: 'gate_practice' }).message).toBe('Tee enne testi harjutus lõpuni.');
    expect(errorFrom(500, null)).toMatchObject({ code: 'unknown', retryable: true });
    const stale = errorFrom(409, { code: 'stale', message: 'x', session: { sessionId: 's1' } });
    expect(stale.session).toEqual({ sessionId: 's1' });
    expect(errorFrom(422, { code: 'validation_failed', message: 'Ei saa', problems: [{ severity: 'error', code: 'unit_draft', message: 'Mustand' }] }).problems).toHaveLength(1);
  });

  it('reports offline honestly and never pretends success', async () => {
    const failing = async () => { throw new TypeError('Failed to fetch'); };
    const result = await getJson(failing, '/api/textbook/courses/x');
    expect(result).toEqual({ ok: false, error: { code: 'offline', status: 0, message: TEXTBOOK_OFFLINE_MESSAGE, retryable: true } });
  });

  it('retries a lost mutation with the same body (same actionId)', async () => {
    const bodies: string[] = [];
    let calls = 0;
    const flaky = async (_url: string, init?: RequestInit) => {
      bodies.push(String(init?.body));
      calls += 1;
      if (calls === 1) throw new TypeError('Failed to fetch');
      return new Response(JSON.stringify({ ok: 1 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    };
    const result = await postJson(flaky, '/api/textbook/practice/s1/answer', { actionId: 'abcdefgh12', revision: 3 });
    expect(result).toEqual({ ok: true, data: { ok: 1 } });
    expect(bodies).toHaveLength(2);
    expect(bodies[0]).toBe(bodies[1]);
  });
});
