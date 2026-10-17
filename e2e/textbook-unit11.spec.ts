import { expect, test, type Page } from './test';
import { authenticateFamily } from './auth';
import { navigateStable } from './navigation';
import type { ParentOverviewResponse, ParentUnitDetailResponse, PracticeSessionView, TestSessionView, TestSubmitResponse, UnitDetailResponse } from '../src/lib/textbook/api';
import { correctResponseFor, hotspotRegionIds } from '../src/lib/textbook/grading';
import type { Question } from '../src/lib/textbook/types';
import { unit11 } from '../src/content/textbook/loodusopetus-opik/unit11';

// Loodusõpetus õpik, Unit 11 "Gloobus" end to end through the authenticated
// parent preview: the unit is content-'ready' but NOT published, so it shows
// in the preview (locked until the preview learner passes Unit 10, exactly as
// for a child) and nowhere for Kiur. Unit 10 is passed through the API first;
// then all four lessons (11 sections, 5 diagram blocks, 3 optional links) are
// read on a 375 px phone, the diagrams re-checked at 360 px, and practice and
// the test run on a 360 px phone: a correction, an 18/20 fail → targeted
// practice → 19/20 pass, frozen test snapshots, and Unit 22 still a draft.
//
// Both browser projects share one database, so every test starts by resetting
// the preview learner for this course.

test.use({ viewport: { width: 375, height: 667 } });

const ORIGIN = 'http://localhost:3000';
const COURSE = 'loodusopetus-opik';
const U10 = 'lo-opik-u10';
const U11 = 'lo-opik-u11';
const DRAFT = 'lo-opik-u22';
const PREVIEW_API = '/api/parent/textbook/preview';
const previewCourse = `/vanem/oppetukid/eelvaade/${COURSE}`;
const previewUnit = `${previewCourse}/${U11}`;

let actionCounter = 0;
function actionId() {
  actionCounter += 1;
  return `e2eu11${Date.now().toString(36)}${actionCounter}x${Math.random().toString(36).slice(2, 8)}`;
}

async function signInAsParent(page: Page) {
  await navigateStable(page, '/vanem');
  const password = page.getByLabel('Sisesta parool');
  if (await password.count() > 0) {
    await password.click();
    await password.pressSequentially('e2e-parent-password');
    const dashboardLoaded = page.waitForResponse((response) => response.url().endsWith('/api/parent/dashboard') && response.ok());
    await page.getByRole('button', { name: 'Sisene' }).click();
    await dashboardLoaded;
  }
  await expect(page.getByRole('button', { name: /Loodusõpetuse õppetükid/ })).toBeVisible();
}

async function parentHeaders(page: Page) {
  const cookies = await page.context().cookies();
  const token = cookies.find((cookie) => cookie.name === 'parent_csrf')?.value ?? '';
  return { 'content-type': 'application/json', origin: ORIGIN, 'x-csrf-token': decodeURIComponent(token) };
}

async function apiPost<T>(page: Page, url: string, body: unknown): Promise<T> {
  const response = await page.request.post(url, { headers: await parentHeaders(page), data: body });
  expect(response.ok(), `${url} → ${response.status()} ${await response.text()}`).toBe(true);
  return await response.json() as T;
}

async function apiGet<T>(page: Page, url: string): Promise<T> {
  const response = await page.request.get(url);
  expect(response.ok(), `${url} → ${response.status()}`).toBe(true);
  return await response.json() as T;
}

async function resetPreview(page: Page) {
  await apiPost(page, `${PREVIEW_API}/reset`, { actionId: actionId(), courseId: COURSE });
  await apiPost(page, `${PREVIEW_API}/start`, { actionId: actionId(), courseId: COURSE });
}

// A unit's questions with their answer keys (parent only).
async function unitKeys(page: Page, unitId: string): Promise<Map<string, Question>> {
  const detail = await apiGet<ParentUnitDetailResponse>(page, `/api/parent/textbook/courses/${COURSE}/units/${unitId}`);
  return new Map(detail.questions.map((question) => [question.id, question]));
}

async function readAllViaApi(page: Page, unitId: string) {
  const detail = await apiGet<UnitDetailResponse>(page, `${PREVIEW_API}/courses/${COURSE}/units/${unitId}`);
  for (const lesson of detail.lessons) {
    await apiPost(page, `${PREVIEW_API}/courses/${COURSE}/units/${unitId}/lessons/${lesson.lessonId}/complete`, { actionId: actionId() });
  }
}

async function practiseViaApi(page: Page, unitId: string, keys: Map<string, Question>) {
  let session = await apiPost<PracticeSessionView>(page, `${PREVIEW_API}/courses/${COURSE}/units/${unitId}/practice`, { actionId: actionId() });
  for (let guard = 0; session.status === 'active' && session.question && guard < 80; guard += 1) {
    const question = keys.get(session.question.id)!;
    const answered = await apiPost<{ session: PracticeSessionView }>(page, `${PREVIEW_API}/practice/${session.sessionId}/answer`, {
      actionId: actionId(), revision: session.revision, questionId: question.id, response: correctResponseFor(question.answer)
    });
    session = answered.session;
  }
  expect(session.status).toBe('completed');
}

// Unit 11 opens only after Unit 10 is passed, for the preview learner as for a child.
async function passUnit10ViaApi(page: Page) {
  const keys = await unitKeys(page, U10);
  await readAllViaApi(page, U10);
  await practiseViaApi(page, U10, keys);
  let session = await apiPost<TestSessionView>(page, `${PREVIEW_API}/courses/${COURSE}/units/${U10}/test`, { actionId: actionId() });
  for (const question of session.questions) {
    session = (await apiPost<{ session: TestSessionView }>(page, `${PREVIEW_API}/test/${session.sessionId}/answer`, {
      actionId: actionId(), revision: session.revision, questionId: question.id, response: correctResponseFor(keys.get(question.id)!.answer)
    })).session;
  }
  const submitted = await apiPost<TestSubmitResponse>(page, `${PREVIEW_API}/test/${session.sessionId}/submit`, { actionId: actionId(), revision: session.revision });
  expect(submitted.result).toMatchObject({ correct: 20, passed: true, nextUnitOpened: true });
}

// Practice and test pages add ?session=<id> once the run is known.
async function openSessionPage(page: Page, path: string) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await page.goto(path);
    } catch (error) {
      if (!(error instanceof Error && error.message.includes('is interrupted by another navigation'))) throw error;
    }
    if (new URL(page.url()).pathname === path) return;
  }
  throw new Error(`Could not open ${path}; stopped at ${page.url()}`);
}

async function noSidewaysScroll(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth));
}

// The diagram stays inside the reading card and every label inside the picture.
async function diagramFits(page: Page, diagramId: string) {
  const svg = page.locator(`svg[data-diagram-id="${diagramId}"]`);
  await expect(svg).toBeVisible();
  const [svgBox, readerBox] = [(await svg.boundingBox())!, (await page.locator('.tb-reader').boundingBox())!];
  expect(svgBox.x).toBeGreaterThanOrEqual(readerBox.x);
  expect(svgBox.x + svgBox.width).toBeLessThanOrEqual(readerBox.x + readerBox.width + 0.5);
  for (const label of await svg.locator('.tb-diagram-label, .tb-diagram-note').all()) {
    const box = (await label.boundingBox())!;
    expect(box.x, `${diagramId} label left`).toBeGreaterThanOrEqual(svgBox.x - 0.5);
    expect(box.x + box.width, `${diagramId} label right`).toBeLessThanOrEqual(svgBox.x + svgBox.width + 0.5);
    expect(box.y + box.height, `${diagramId} label bottom`).toBeLessThanOrEqual(svgBox.y + svgBox.height + 2);
  }
}

// Answers the question on screen through its real controls, right or wrong.
async function answerInUi(page: Page, question: Question, correct: boolean) {
  const card = page.locator(`.tb-question[data-question-id="${question.id}"]`);
  await expect(card).toBeVisible();
  const answer = question.answer;
  switch (answer.type) {
    case 'single_choice': {
      const id = correct ? answer.correctOptionId : answer.options.find((option) => option.id !== answer.correctOptionId)!.id;
      await card.locator(`[data-option-id="${id}"]`).click();
      return;
    }
    case 'multiple_selection': {
      const ids = correct ? answer.correctOptionIds : [answer.options.find((option) => !answer.correctOptionIds.includes(option.id))!.id];
      for (const id of ids) await card.locator(`[data-option-id="${id}"]`).click();
      return;
    }
    case 'matching': {
      const target = { ...answer.correctPairs };
      if (!correct) {
        const [a, b] = answer.prompts.map((prompt) => prompt.id);
        [target[a], target[b]] = [target[b], target[a]];
      }
      for (const prompt of answer.prompts) {
        await card.locator(`[data-prompt-id="${prompt.id}"]`).click();
        await card.locator(`[data-choice-id="${target[prompt.id]}"]`).click();
      }
      return;
    }
    case 'grouping': {
      const target = { ...answer.correctGroupByItem };
      if (!correct) {
        const first = answer.items[0].id;
        target[first] = answer.groups.find((group) => group.id !== target[first])!.id;
      }
      for (const item of answer.items) await card.locator(`[data-item-id="${item.id}"][data-group-id="${target[item.id]}"]`).click();
      return;
    }
    case 'ordering': {
      const target = [...answer.correctOrder];
      if (!correct) [target[0], target[1]] = [target[1], target[0]];
      let current = await card.locator('.tb-ordering-item').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-item-id') ?? ''));
      for (let position = 0; position < target.length; position += 1) {
        let at = current.indexOf(target[position]);
        while (at > position) {
          await card.locator(`.tb-ordering-item[data-item-id="${target[position]}"] [data-move="up"]`).click();
          [current[at - 1], current[at]] = [current[at], current[at - 1]];
          at -= 1;
        }
      }
      current = await card.locator('.tb-ordering-item').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-item-id') ?? ''));
      expect(current).toEqual(target);
      const confirm = card.getByRole('button', { name: 'See järjekord sobib' });
      if (await confirm.count()) await confirm.click();
      return;
    }
    case 'diagram_hotspot': {
      // The picture shows letters only: no region label, no lesson note, no
      // answer word, and a neutral description.
      const svg = card.locator(`svg[data-diagram-id="${answer.diagramId}"]`);
      await expect(svg).toBeVisible();
      await expect(svg.locator('.tb-diagram-label')).toHaveCount(0);
      await expect(svg.locator('.tb-diagram-note')).toHaveCount(0);
      await expect(svg.locator('desc')).toHaveText(/^Joonisel on tähtedega märgitud kohad/);
      expect(await svg.locator('text').allTextContents()).toEqual(expect.arrayContaining([expect.stringMatching(/^[A-E]$/)]));
      for (const text of await svg.locator('text').allTextContents()) expect(text).toMatch(/^[A-E]$/);
      const regions = hotspotRegionIds(answer);
      await expect(svg.locator('.tb-region[role="button"]')).toHaveCount(regions.length);
      // Every tap area is at least 44 px on this phone and none overlaps another.
      const boxes = await Promise.all(regions.map(async (region) => (await svg.locator(`.tb-region[data-region-id="${region}"] .tb-region-hit`).boundingBox())!));
      for (const [index, box] of boxes.entries()) {
        expect(Math.min(box.width, box.height), `${regions[index]} tap area`).toBeGreaterThanOrEqual(44);
        for (const other of boxes.slice(index + 1)) {
          const overlap = box.x < other.x + other.width - 0.5 && other.x < box.x + box.width - 0.5 && box.y < other.y + other.height - 0.5 && other.y < box.y + box.height - 0.5;
          expect(overlap).toBe(false);
        }
      }
      const id = correct ? answer.correctRegionId : regions.find((region) => region !== answer.correctRegionId)!;
      // Tap the picture itself, in the middle of the region's tap area.
      await svg.locator(`.tb-region[data-region-id="${id}"] .tb-region-hit`).click();
      await expect(card.locator(`[data-region-button="${id}"]`)).toHaveAttribute('aria-pressed', 'true');
      return;
    }
  }
}

async function currentQuestionId(page: Page) {
  const card = page.locator('.tb-question').first();
  await expect(card).toBeVisible();
  return await card.getAttribute('data-question-id') ?? '';
}

// Runs the practice screen to the end; `wrongFirst` answers the first one wrong.
async function finishPracticeInUi(page: Page, keys: Map<string, Question>, wrongFirst = false) {
  const seen: string[] = [];
  for (let guard = 0; guard < 90; guard += 1) {
    if (await page.locator('[data-result="practice-done"]').isVisible()) return seen;
    const next = page.getByRole('button', { name: /^(Edasi|Vaata tulemust)$/ });
    if (await next.isVisible()) {
      await next.click();
      continue;
    }
    const id = await currentQuestionId(page);
    const wrong = wrongFirst && seen.length === 0;
    seen.push(id);
    await answerInUi(page, keys.get(id)!, !wrong);
    await page.getByRole('button', { name: 'Kontrolli' }).click();
    await expect(page.locator('.tb-feedback')).toHaveAttribute('data-correct', wrong ? 'false' : 'true');
    await noSidewaysScroll(page);
  }
  throw new Error('practice did not finish');
}

// Answers all 20 test questions on screen; `wrongAt` lists 0-based positions to get wrong.
async function answerTestInUi(page: Page, keys: Map<string, Question>, wrongAt: number[]) {
  const ids: string[] = [];
  for (let position = 0; position < 20; position += 1) {
    await expect(page.locator('.tb-question-eyebrow')).toHaveText(`Küsimus ${position + 1}/20`);
    const id = await currentQuestionId(page);
    ids.push(id);
    await answerInUi(page, keys.get(id)!, !wrongAt.includes(position));
    if (position < 19) await page.getByRole('button', { name: 'Järgmine →' }).click();
  }
  return ids;
}

async function submitTest(page: Page) {
  await expect(page.getByRole('button', { name: 'Esita test' })).toBeEnabled();
  await page.getByRole('button', { name: 'Esita test' }).click();
  await page.getByRole('button', { name: 'Jah, esita' }).click();
}

function sessionIdFromUrl(page: Page) {
  return new URL(page.url()).searchParams.get('session') ?? '';
}

// Where the content puts its diagrams: "lesson/section" (1-based) → diagram ID.
const DIAGRAMS_BY_SECTION = new Map<string, string>();
unit11.lessons.forEach((lesson, lessonIndex) => lesson.sections.forEach((section, sectionIndex) => {
  for (const block of section.blocks) if (block.type === 'diagram') DIAGRAMS_BY_SECTION.set(`${lessonIndex + 1}/${sectionIndex + 1}`, block.diagramId);
}));

test.beforeEach(async ({ page }) => {
  await authenticateFamily(page);
});

test('Unit 11 preview: locked until Unit 10 is passed, then all four lessons with the four diagrams at 375 and 360 px', async ({ page }) => {
  test.setTimeout(180_000);
  await signInAsParent(page);
  await resetPreview(page);

  // Ready but unpublished: listed in the preview, locked behind Unit 10 (the child's gate holds here too).
  await navigateStable(page, previewCourse);
  await expect(page.getByText('Eelvaade — lapse andmeid ei muudeta.')).toBeVisible();
  const card = page.locator(`.tb-unit-card[data-unit-id="${U11}"]`);
  await expect(card).toContainText('Gloobus');
  await expect(card).toHaveAttribute('data-status', 'locked');
  await expect(card.getByRole('link', { name: 'Alusta õppimist' })).toHaveCount(0);
  await expect(page.locator(`[data-unit-id="${DRAFT}"]`)).toHaveCount(0);
  expect((await page.request.get(`${PREVIEW_API}/courses/${COURSE}/units/${U11}`)).ok()).toBe(false);

  await passUnit10ViaApi(page);
  await navigateStable(page, previewCourse);
  await card.getByRole('link', { name: 'Alusta õppimist' }).click();
  await page.getByRole('link', { name: 'Alusta lugemist' }).click();

  expect(DIAGRAMS_BY_SECTION.size).toBe(5);
  let sections = 0;
  const diagramsSeen = new Set<string>();
  for (const [lessonIndex, lesson] of unit11.lessons.entries()) {
    await expect(page.locator('.tb-header h1')).toContainText(lesson.title);
    const total = lesson.sections.length;
    for (let section = 1; section <= total; section += 1) {
      await expect(page.locator('.tb-eyebrow')).toHaveText(`Õpi · Osa ${section}/${total}`);
      sections += 1;
      const diagramId = DIAGRAMS_BY_SECTION.get(`${lessonIndex + 1}/${section}`);
      if (diagramId) {
        diagramsSeen.add(diagramId);
        const svg = page.locator(`svg[data-diagram-id="${diagramId}"]`);
        await svg.scrollIntoViewIfNeeded();
        // Lesson mode names the parts; the description says it is a simplified schematic.
        await expect(svg.locator('.tb-diagram-label').first()).toBeVisible();
        await expect(svg.locator('desc')).toContainText('Lihtsustatud');
        await diagramFits(page, diagramId);
      }
      // Optional external links open safely in a new tab and never gate anything.
      for (const link of await page.locator('.tb-resource-link').all()) {
        await expect(link).toHaveAttribute('href', /^https:\/\//);
        await expect(link).toHaveAttribute('target', '_blank');
        await expect(link).toHaveAttribute('rel', /noopener/);
      }
      await noSidewaysScroll(page);
      if (section < total) await page.getByRole('button', { name: 'Edasi →' }).click();
    }
    await page.locator('.tb-end-sentinel').scrollIntoViewIfNeeded();
    await expect(page.locator('.tb-end-sentinel')).toHaveAttribute('data-seen', 'true');
    await page.getByRole('button', { name: 'Lugesin läbi' }).click();
    if (lessonIndex < unit11.lessons.length - 1) {
      await expect(page.getByRole('heading', { name: '✓ Õppetükk on loetud' })).toBeVisible();
      await page.getByRole('link', { name: 'Järgmine õppetükk →' }).click();
    }
  }
  expect(sections).toBe(11);
  expect([...diagramsSeen].sort()).toEqual(['u11-axis-poles', 'u11-equator-parallels', 'u11-globe-types', 'u11-meridians-estonia']);
  await expect(page.getByText('Kõik kohustuslikud õppetükid on loetud. Nüüd saad harjutada!')).toBeVisible();

  // Every diagram also fits the narrowest phone, labels included.
  await page.setViewportSize({ width: 360, height: 720 });
  for (const [where, diagramId] of DIAGRAMS_BY_SECTION) {
    const [lesson, section] = where.split('/').map(Number);
    await navigateStable(page, `${previewUnit}/lugemine/${unit11.lessons[lesson - 1].id}?osa=${section}`);
    await page.locator(`svg[data-diagram-id="${diagramId}"]`).scrollIntoViewIfNeeded();
    await diagramFits(page, diagramId);
    await noSidewaysScroll(page);
  }
});

test('Unit 11 preview: practice with a correction, 18/20 fails, targeted practice, 19/20 passes; unpublished and Kiur sees nothing', async ({ page }) => {
  test.setTimeout(480_000);
  await page.setViewportSize({ width: 360, height: 720 });
  await signInAsParent(page);
  await resetPreview(page);
  await passUnit10ViaApi(page);
  const keys = await unitKeys(page, U11);
  expect(keys.size).toBe(74);
  await readAllViaApi(page, U11);

  // Practice in the UI: the first answer is wrong, its objective comes back.
  await openSessionPage(page, `${previewUnit}/harjuta`);
  const seen = await finishPracticeInUi(page, keys, true);
  await expect(page.getByRole('heading', { name: 'Harjutus on tehtud!' })).toBeVisible();
  const missed = keys.get(seen[0])!.primaryObjectiveId;
  expect(seen.slice(1).some((id) => keys.get(id)!.primaryObjectiveId === missed)).toBe(true);
  // Every one of the seven objectives was answered in practice.
  expect(new Set(seen.map((id) => keys.get(id)!.primaryObjectiveId)).size).toBe(7);

  // First test: two wrong answers → 18/20 fails.
  await page.getByRole('link', { name: 'Tee test' }).click();
  await expect(page.locator('.tb-question-eyebrow')).toHaveText('Küsimus 1/20');
  await noSidewaysScroll(page);
  const firstSessionId = sessionIdFromUrl(page);
  // In the test the browser never gets an answer key.
  const active = await page.request.get(`${PREVIEW_API}/test/${firstSessionId}`);
  expect(active.ok()).toBe(true);
  expect(await active.text()).not.toMatch(/correctOptionId|correctOptionIds|correctPairs|correctGroupByItem|correctOrder|correctRegionId|"explanation"/);
  const firstIds = await answerTestInUi(page, keys, [3, 12]);
  await submitTest(page);
  const failed = page.locator('[data-result="failed"]');
  await expect(failed).toBeVisible();
  await expect(failed.locator('.tb-result-score')).toContainText('18/20');
  await expect(failed).toContainText('Korda neid teemasid:');

  // Targeted practice, then a fresh test: one wrong answer → 19/20 passes.
  await failed.getByRole('link', { name: 'Harjuta neid teemasid' }).click();
  await expect(page.locator('.tb-eyebrow')).toHaveText('Harjutus enne uut testi');
  await finishPracticeInUi(page, keys);
  await page.getByRole('link', { name: 'Tee test uuesti' }).click();
  await expect(page.locator('.tb-question-eyebrow')).toHaveText('Küsimus 1/20');
  const secondSessionId = sessionIdFromUrl(page);
  expect(secondSessionId).not.toBe(firstSessionId);
  const secondIds = await answerTestInUi(page, keys, [9]);
  await submitTest(page);
  const passed = page.locator('[data-result="passed"]');
  await expect(passed).toBeVisible();
  await expect(passed.locator('.tb-result-score')).toContainText('19/20');
  await expect(passed).toContainText('Eelvaates tähti ei anta.');

  // Each test: 20 distinct questions from 20 distinct variant groups, 8/7/5, all seven objectives.
  for (const ids of [firstIds, secondIds]) {
    expect(new Set(ids).size).toBe(20);
    expect(new Set(ids.map((id) => keys.get(id)!.variantGroupId)).size).toBe(20);
    const levels = { factual: 0, understanding: 0, application: 0 };
    for (const id of ids) levels[keys.get(id)!.cognitiveLevel] += 1;
    expect(levels).toEqual({ factual: 8, understanding: 7, application: 5 });
    expect(new Set(ids.map((id) => keys.get(id)!.primaryObjectiveId)).size).toBe(7);
  }
  // The historical snapshots keep exactly the questions that were shown.
  const first = await apiGet<TestSessionView>(page, `${PREVIEW_API}/test/${firstSessionId}`);
  const second = await apiGet<TestSessionView>(page, `${PREVIEW_API}/test/${secondSessionId}`);
  expect(first.questions.map((question) => question.id)).toEqual(firstIds);
  expect(second.questions.map((question) => question.id)).toEqual(secondIds);
  expect([first.result?.correct, second.result?.correct]).toEqual([18, 19]);
  const unit = await apiGet<UnitDetailResponse>(page, `${PREVIEW_API}/courses/${COURSE}/units/${U11}`);
  expect(unit.attempts.map((attempt) => [attempt.correct, attempt.total, attempt.passed])).toEqual([[18, 20, false], [19, 20, true]]);

  // Unit 11 is publishable but still unpublished; Unit 22 is still a draft that cannot be published.
  const overview = await apiGet<ParentOverviewResponse>(page, '/api/parent/textbook');
  const real = overview.courses.find((course) => course.courseId === COURSE)!;
  expect(real.units.find((item) => item.unitId === U11)).toMatchObject({ contentStatus: 'ready', published: false, validation: { publishable: true } });
  expect(real.units.find((item) => item.unitId === DRAFT)).toMatchObject({ contentStatus: 'draft', published: false, validation: { publishable: false } });
  await navigateStable(page, previewCourse);
  await expect(page.locator(`.tb-unit-card[data-unit-id="${U11}"] .tb-status-chip`)).toContainText('Läbitud');
  await expect(page.locator(`[data-unit-id="${DRAFT}"]`)).toHaveCount(0);

  // Kiur's course list is still empty: nothing was published by the preview.
  const child = await apiGet<{ units: unknown[] }>(page, `/api/textbook/courses/${COURSE}`);
  expect(child.units).toEqual([]);
  expect((await page.request.get(`/api/textbook/courses/${COURSE}/units/${U11}`)).ok()).toBe(false);
});
