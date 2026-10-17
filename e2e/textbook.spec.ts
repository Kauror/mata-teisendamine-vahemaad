import { expect, test, type Page } from './test';
import { authenticateFamily } from './auth';
import { navigateStable } from './navigation';
import type { ParentUnitDetailResponse, PracticeSessionView, TestSessionView, UnitDetailResponse } from '../src/lib/textbook/api';
import { correctResponseFor, hotspotRegionIds } from '../src/lib/textbook/grading';
import type { Question } from '../src/lib/textbook/types';

// The textbook framework end to end on a 375 px phone, through the parent
// preview and its demo course (the only place the demo exists): reading gate
// and pager, practice feedback and correction, the 20-question test with
// pause/resume, an 18/20 fail → targeted practice → 19/20 pass that opens the
// next demo unit, the parent panel, and the child course list never showing
// demo content.
//
// Both browser projects share one database, so every test starts by resetting
// the preview learner.

test.use({ viewport: { width: 375, height: 667 } });

const ORIGIN = 'http://localhost:3000';
const DEMO = 'textbook-demo';
const WATER = 'demo-vesi';
const PLANT = 'demo-taim';
const PREVIEW_API = '/api/parent/textbook/preview';
const previewCourse = `/vanem/oppetukid/eelvaade/${DEMO}`;
const previewUnit = (unitId: string) => `${previewCourse}/${unitId}`;

let actionCounter = 0;
function actionId() {
  actionCounter += 1;
  return `e2e${Date.now().toString(36)}${actionCounter}x${Math.random().toString(36).slice(2, 8)}`;
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

async function resetPreview(page: Page) {
  await apiPost(page, `${PREVIEW_API}/reset`, { actionId: actionId(), courseId: DEMO });
  await apiPost(page, `${PREVIEW_API}/start`, { actionId: actionId(), courseId: DEMO });
}

// The demo unit with its answer keys (parent only).
async function unitKeys(page: Page, unitId: string): Promise<ParentUnitDetailResponse> {
  const response = await page.request.get(`/api/parent/textbook/courses/${DEMO}/units/${unitId}`);
  expect(response.ok()).toBe(true);
  return await response.json() as ParentUnitDetailResponse;
}

async function readAllViaApi(page: Page, detail: ParentUnitDetailResponse) {
  for (const lesson of detail.lessons) {
    await apiPost(page, `${PREVIEW_API}/courses/${DEMO}/units/${detail.unit.unitId}/lessons/${lesson.id}/complete`, { actionId: actionId() });
  }
}

async function practiseViaApi(page: Page, detail: ParentUnitDetailResponse) {
  const byId = new Map(detail.questions.map((question) => [question.id, question]));
  let session = await apiPost<PracticeSessionView>(page, `${PREVIEW_API}/courses/${DEMO}/units/${detail.unit.unitId}/practice`, { actionId: actionId() });
  for (let guard = 0; session.status === 'active' && session.question && guard < 80; guard += 1) {
    const question = byId.get(session.question.id);
    if (!question) throw new Error(`unknown question ${session.question.id}`);
    const answered = await apiPost<{ session: PracticeSessionView }>(page, `${PREVIEW_API}/practice/${session.sessionId}/answer`, {
      actionId: actionId(), revision: session.revision, questionId: question.id, response: correctResponseFor(question.answer)
    });
    session = answered.session;
  }
  expect(session.status).toBe('completed');
}

// Answers the question on screen through its real controls, right or wrong.
// Practice and test pages add ?session=<id> once the run is known, which a
// plain navigateStable reads as a failed navigation (seen on a CI retry).
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
      // No move was needed: the shown order only counts once confirmed.
      const confirm = card.getByRole('button', { name: 'See järjekord sobib' });
      if (await confirm.count()) await confirm.click();
      return;
    }
    case 'diagram_hotspot': {
      const regions = hotspotRegionIds(answer);
      const id = correct ? answer.correctRegionId : regions.find((region) => region !== answer.correctRegionId)!;
      await card.locator(`[data-region-button="${id}"]`).click();
      return;
    }
  }
}

async function currentQuestionId(page: Page) {
  const card = page.locator('.tb-question').first();
  await expect(card).toBeVisible();
  return await card.getAttribute('data-question-id') ?? '';
}

// Runs the practice screen to the end, answering everything correctly.
async function finishPracticeInUi(page: Page, keys: Map<string, Question>, seen: string[] = []) {
  for (let guard = 0; guard < 80; guard += 1) {
    if (await page.locator('[data-result="practice-done"]').isVisible()) return seen;
    const next = page.getByRole('button', { name: /^(Edasi|Vaata tulemust)$/ });
    if (await next.isVisible()) {
      await next.click();
      continue;
    }
    const id = await currentQuestionId(page);
    seen.push(id);
    await answerInUi(page, keys.get(id)!, true);
    await page.getByRole('button', { name: 'Kontrolli' }).click();
    await expect(page.locator('.tb-feedback')).toBeVisible();
  }
  throw new Error('practice did not finish');
}

// Answers all 20 test questions on screen; `wrongAt` lists 0-based positions to get wrong.
async function answerTestInUi(page: Page, keys: Map<string, Question>, from: number, wrongAt: number[]) {
  for (let position = from; position < 20; position += 1) {
    await expect(page.locator('.tb-question-eyebrow')).toHaveText(`Küsimus ${position + 1}/20`);
    const id = await currentQuestionId(page);
    await answerInUi(page, keys.get(id)!, !wrongAt.includes(position));
    if (position === 18) {
      // 19 of 20 answered: the test cannot be submitted yet.
      await expect(page.getByRole('button', { name: 'Esita test' })).toBeDisabled();
    }
    if (position < 19) await page.getByRole('button', { name: 'Järgmine →' }).click();
  }
}

async function submitTest(page: Page) {
  await expect(page.getByRole('button', { name: 'Esita test' })).toBeEnabled();
  await page.getByRole('button', { name: 'Esita test' }).click();
  await page.getByRole('button', { name: 'Jah, esita' }).click();
}

test.beforeEach(async ({ page }) => {
  await authenticateFamily(page);
});

test('preview learning: reading gate, section pager and refresh', async ({ page }) => {
  test.setTimeout(90_000);
  await signInAsParent(page);
  await resetPreview(page);

  await navigateStable(page, previewCourse);
  await expect(page.getByText('Eelvaade — lapse andmeid ei muudeta.')).toBeVisible();
  const water = page.locator(`.tb-unit-card[data-unit-id="${WATER}"]`);
  const plant = page.locator(`.tb-unit-card[data-unit-id="${PLANT}"]`);
  await expect(water.locator('.tb-status-chip')).toContainText('Alusta õppimist');
  await expect(plant.locator('.tb-status-chip')).toContainText('Lukus');
  await expect(plant.locator('.tb-unit-lock')).toContainText('Vesi ja selle olekud');

  await water.getByRole('link', { name: 'Alusta õppimist' }).click();
  await expect(page.locator('.tb-step[data-state="current"]')).toContainText('Õpi');
  await expect(page.getByText('Avaneb, kui kõik kohustuslikud õppetükid on loetud.')).toBeVisible();

  await page.getByRole('link', { name: 'Alusta lugemist' }).click();
  await expect(page.locator('.tb-eyebrow')).toHaveText('Õpi · Osa 1/3');
  await expect(page.getByRole('button', { name: 'Lugesin läbi' })).toHaveCount(0);

  await page.getByRole('button', { name: 'Edasi →' }).click();
  await expect(page.locator('.tb-eyebrow')).toHaveText('Õpi · Osa 2/3');
  await expect(page).toHaveURL(/osa=2/);
  // A reload stays on the same section.
  await page.reload();
  await expect(page.locator('.tb-eyebrow')).toHaveText('Õpi · Osa 2/3');
  await expect(page.getByRole('heading', { name: 'Kuju ja temperatuur' })).toBeVisible();
  await expect(page.locator('[data-block-type="table"] table')).toBeVisible();

  await page.getByRole('button', { name: 'Edasi →' }).click();
  await expect(page.locator('.tb-eyebrow')).toHaveText('Õpi · Osa 3/3');
  const finish = page.getByRole('button', { name: 'Lugesin läbi' });
  await expect(finish).toBeVisible();
  await page.locator('.tb-end-sentinel').scrollIntoViewIfNeeded();
  await expect(page.locator('.tb-end-sentinel')).toHaveAttribute('data-seen', 'true');
  await expect(finish).toBeEnabled();
  await finish.click();
  await expect(page.getByRole('heading', { name: '✓ Õppetükk on loetud' })).toBeVisible();

  await page.getByRole('link', { name: 'Järgmine õppetükk →' }).click();
  await expect(page.locator('.tb-eyebrow')).toHaveText('Õpi · Osa 1/2');
  await expect(page.locator('svg[data-diagram-id="demo-water-cycle"] .tb-diagram-label').first()).toBeVisible();
  await page.getByRole('button', { name: 'Edasi →' }).click();
  const resource = page.locator('.tb-resource-link');
  await expect(resource).toHaveAttribute('href', /^https:\/\//);
  await expect(resource).toHaveAttribute('target', '_blank');
  await page.locator('.tb-end-sentinel').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Lugesin läbi' }).click();
  await expect(page.getByText('Kõik kohustuslikud õppetükid on loetud. Nüüd saad harjutada!')).toBeVisible();

  // Completion is recorded on the server: it survives a reload, and the lesson stays open to revisit.
  await page.reload();
  await expect(page.getByText('✓ Loetud. Võid siin rahulikult üle lugeda.')).toBeVisible();
  await navigateStable(page, previewUnit(WATER));
  await expect(page.locator('.tb-unit-status-line .tb-status-chip')).toContainText('Harjuta');
  await expect(page.locator('.tb-step[data-state="current"]')).toContainText('Harjuta');
});

test('preview practice: immediate feedback, correction and resume', async ({ page }) => {
  test.setTimeout(150_000);
  await signInAsParent(page);
  await resetPreview(page);
  const detail = await unitKeys(page, WATER);
  const keys = new Map(detail.questions.map((question) => [question.id, question]));
  await readAllViaApi(page, detail);

  await openSessionPage(page, `${previewUnit(WATER)}/harjuta`);
  // The headline counts questions, not topics.
  const counter = page.locator('.tb-progress-row');
  await expect(counter).toContainText(/^Küsimus 1 \/ \d+Tehtud 0 · jäänud \d+$/);
  const firstId = await currentQuestionId(page);
  const first = keys.get(firstId)!;
  await answerInUi(page, first, false);
  await page.getByRole('button', { name: 'Kontrolli' }).click();
  const feedback = page.locator('.tb-feedback');
  await expect(feedback).toHaveAttribute('data-correct', 'false');
  await expect(feedback).toContainText('Pole päris õige');
  await expect(feedback).toContainText('Õige vastus:');
  await expect(feedback).toContainText(first.explanation);
  await expect(feedback).toContainText('Selle teema juurde tuleb hiljem veel üks küsimus.');
  // The answered question keeps its number while its feedback is shown; total = done + remaining.
  const [, shown, total, done, left] = (await counter.innerText()).replace(/\s+/g, ' ').match(/Küsimus (\d+) \/ (\d+) ?Tehtud (\d+) · jäänud (\d+)/) ?? [];
  expect([Number(shown), Number(done)]).toEqual([1, 1]);
  expect(Number(total)).toBe(Number(done) + Number(left));

  // The feedback survives a reload, and the run resumes.
  await page.reload();
  await expect(page.locator('.tb-feedback')).toHaveAttribute('data-correct', 'false');
  await page.getByRole('button', { name: 'Edasi' }).click();

  const seen: string[] = [firstId];
  // Answer three, then reload: the same question comes back.
  for (let i = 0; i < 3; i += 1) {
    const id = await currentQuestionId(page);
    seen.push(id);
    await answerInUi(page, keys.get(id)!, true);
    await page.getByRole('button', { name: 'Kontrolli' }).click();
    await expect(page.locator('.tb-feedback')).toHaveAttribute('data-correct', 'true');
    await page.getByRole('button', { name: 'Edasi' }).click();
  }
  const before = await currentQuestionId(page);
  await page.reload();
  expect(await currentQuestionId(page)).toBe(before);

  await finishPracticeInUi(page, keys, seen);
  await expect(page.getByRole('heading', { name: 'Harjutus on tehtud!' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Tee test' })).toBeVisible();

  // The missed objective came back later with a different question.
  const later = seen.slice(1).filter((id) => keys.get(id)?.primaryObjectiveId === first.primaryObjectiveId);
  expect(later.length).toBeGreaterThan(0);
  expect(later.some((id) => id !== firstId)).toBe(true);
});

test('preview test: pause and resume, 18/20 fails, targeted practice, 19/20 passes and opens the next unit', async ({ page }) => {
  test.setTimeout(300_000);
  await signInAsParent(page);
  await resetPreview(page);
  const detail = await unitKeys(page, WATER);
  const keys = new Map(detail.questions.map((question) => [question.id, question]));
  await readAllViaApi(page, detail);
  await practiseViaApi(page, detail);

  await openSessionPage(page, `${previewUnit(WATER)}/test`);
  await expect(page.locator('.tb-question-eyebrow')).toHaveText('Küsimus 1/20');
  await expect(page.locator('.tb-test-grid-button')).toHaveCount(20);
  // The compact navigation fits the 375 px phone: no sideways scroll, ten chips a row.
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  const chipTops = await page.locator('.tb-test-grid-button').evaluateAll((nodes) => nodes.map((node) => Math.round(node.getBoundingClientRect().top)));
  expect(new Set(chipTops).size).toBe(2);
  await expect(page.getByText('Testis vastuseid kohe ei kontrollita.', { exact: false })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Esita test' })).toBeDisabled();
  // No feedback during the test.
  await expect(page.locator('.tb-feedback')).toHaveCount(0);

  for (let position = 0; position < 5; position += 1) {
    const id = await currentQuestionId(page);
    await answerInUi(page, keys.get(id)!, true);
    await page.getByRole('button', { name: 'Järgmine →' }).click();
  }
  await page.getByRole('button', { name: 'Peata test' }).click();
  await expect(page).toHaveURL(new RegExp(`${previewUnit(WATER)}$`));
  await expect(page.locator('.tb-unit-status-line .tb-status-chip')).toContainText('Test pooleli');
  await page.getByRole('link', { name: 'Jätka testi' }).first().click();
  await expect(page.locator('.tb-question-eyebrow')).toHaveText('Küsimus 6/20');
  await expect(page.locator('.tb-progress-row strong')).toHaveText('5/20');

  // Two wrong answers → 18/20.
  await answerTestInUi(page, keys, 5, [6, 9]);
  await submitTest(page);
  const failed = page.locator('[data-result="failed"]');
  await expect(failed).toBeVisible();
  await expect(failed.locator('.tb-result-score')).toContainText('18/20');
  await expect(failed).toContainText('Korda neid teemasid:');

  // The next full test needs the targeted practice first.
  await failed.getByRole('link', { name: 'Harjuta neid teemasid' }).click();
  await expect(page.locator('.tb-eyebrow')).toHaveText('Harjutus enne uut testi');
  await finishPracticeInUi(page, keys);
  await page.getByRole('link', { name: 'Tee test uuesti' }).click();

  await expect(page.locator('.tb-question-eyebrow')).toHaveText('Küsimus 1/20');
  await answerTestInUi(page, keys, 0, [3]);
  await submitTest(page);
  const passed = page.locator('[data-result="passed"]');
  await expect(passed).toBeVisible();
  await expect(passed.locator('.tb-result-score')).toContainText('19/20');
  await expect(passed).toContainText('Järgmine õppetükk „Taime osad“ on nüüd avatud!');
  await expect(passed).toContainText('Eelvaates tähti ei anta.');

  await navigateStable(page, previewCourse);
  await expect(page.locator(`.tb-unit-card[data-unit-id="${WATER}"] .tb-status-chip`)).toContainText('Läbitud');
  await expect(page.locator(`.tb-unit-card[data-unit-id="${PLANT}"] .tb-status-chip`)).toContainText('Alusta õppimist');
});

test('preview test: an ordering row can be dragged into a new place', async ({ page }) => {
  test.setTimeout(150_000);
  await signInAsParent(page);
  const detail = await unitKeys(page, WATER);
  // The test draws 20 of the unit's questions; start runs until one of them is an ordering question.
  let position = -1;
  for (let attempt = 0; attempt < 6 && position < 0; attempt += 1) {
    await resetPreview(page);
    await readAllViaApi(page, detail);
    await practiseViaApi(page, detail);
    const session = await apiPost<TestSessionView>(page, `${PREVIEW_API}/courses/${DEMO}/units/${WATER}/test`, { actionId: actionId() });
    position = session.questions.findIndex((question) => question.answer.type === 'ordering');
  }
  expect(position, 'a test with an ordering question').toBeGreaterThanOrEqual(0);

  await openSessionPage(page, `${previewUnit(WATER)}/test`);
  await page.locator('.tb-test-grid-button').nth(position).click();
  const card = page.locator('.tb-question[data-answer-type="ordering"]');
  await expect(card).toBeVisible();
  const rows = card.locator('.tb-ordering-item');
  const orderOf = () => rows.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-item-id') ?? ''));
  const before = await orderOf();
  await expect(card.getByRole('button', { name: 'See järjekord sobib' })).toBeVisible();

  // Drag the first row by its handle to below the second row.
  const handle = rows.first().locator('.tb-drag-handle');
  await handle.scrollIntoViewIfNeeded();
  const from = (await handle.boundingBox())!;
  const second = (await rows.nth(1).boundingBox())!;
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2 + 10, { steps: 3 });
  await expect(rows.first()).toHaveAttribute('data-lifted', 'true');
  await page.mouse.move(from.x + from.width / 2, second.y + second.height * 0.9, { steps: 6 });
  await expect(rows.nth(1)).toHaveAttribute('data-drop', 'after');
  await page.mouse.up();

  await expect.poll(orderOf).toEqual([before[1], before[0], ...before.slice(2)]);
  await expect(card.locator('[aria-live="polite"]')).toHaveText(/on nüüd kohal 2\.$/);
  // The drag counted as an answer: no confirm button, and the chip shows it answered.
  await expect(card.getByRole('button', { name: 'See järjekord sobib' })).toHaveCount(0);
  await expect(page.locator('.tb-test-grid-button').nth(position)).toHaveAttribute('data-answered', 'true');
});

test('parent panel: drafts cannot be published, questions with answers, preview reset', async ({ page }) => {
  test.setTimeout(90_000);
  await signInAsParent(page);
  await resetPreview(page);
  const water = await unitKeys(page, WATER);
  await apiPost(page, `${PREVIEW_API}/courses/${DEMO}/units/${WATER}/lessons/${water.lessons[0].id}/complete`, { actionId: actionId() });

  await page.getByRole('button', { name: /Loodusõpetuse õppetükid/ }).click();
  const draft = page.locator('.tb-admin-unit[data-unit-id="lo-opik-u10"]');
  await expect(draft).toContainText('Maa kuju');
  await expect(draft.locator('.tb-admin-chip').first()).toHaveText('Mustand');
  await draft.getByRole('button', { name: 'Avalda' }).click();
  await expect(draft.locator('.tb-admin-problems')).toContainText('Avaldada ei saa');
  await expect(draft.locator('.tb-admin-chip', { hasText: 'Avaldamata' })).toBeVisible();

  const demo = page.locator(`.tb-admin-course[data-course-id="${DEMO}"]`);
  await expect(demo).toContainText('Ainult eelvaade');
  await expect(demo.getByRole('button', { name: 'Avalda' })).toHaveCount(0);
  await expect(demo.getByRole('link', { name: 'Ava eelvaade' })).toHaveAttribute('href', previewCourse);
  const demoUnit = demo.locator(`.tb-admin-unit[data-unit-id="${WATER}"]`);
  await demoUnit.getByRole('button', { name: 'Vaata küsimusi' }).click();
  await expect(demoUnit.locator('.tb-admin-questions > li').first()).toContainText('Õige vastus:');

  // Reset clears only the preview learner's progress.
  await demo.getByRole('button', { name: 'Lähtesta eelvaade' }).click();
  await demo.getByRole('button', { name: 'Jah, lähtesta' }).click();
  await expect(page.getByText('Eelvaade on lähtestatud. Laste andmeid ei muudetud.')).toBeVisible();
  const after = await page.request.get(`${PREVIEW_API}/courses/${DEMO}/units/${WATER}`);
  expect(after.ok()).toBe(true);
  const unit = await after.json() as UnitDetailResponse;
  expect(unit.lessons.every((lesson) => !lesson.completed)).toBe(true);
});

test('the child course list never shows demo units', async ({ page }) => {
  await navigateStable(page, '/kiur/loodusopetus');
  await page.getByRole('link', { name: /Õpiku õppetükid/ }).click();
  await expect(page).toHaveURL(/\/kiur\/loodusopetus\/opik$/);
  await expect(page.locator('.tb-empty, .tb-unit-list').first()).toBeVisible();
  for (const text of ['Näidiskursus', 'Vesi ja selle olekud', 'Taime osad']) await expect(page.getByText(text)).toHaveCount(0);
  await expect(page.locator('[data-unit-id^="demo-"]')).toHaveCount(0);

  const course = await page.request.get('/api/textbook/courses/loodusopetus-opik');
  expect(course.ok()).toBe(true);
  const overview = await course.json() as { units: Array<{ unitId: string }> };
  expect(overview.units.some((unit) => unit.unitId.startsWith('demo-'))).toBe(false);
  expect((await page.request.get(`/api/textbook/courses/${DEMO}`)).ok()).toBe(false);
  expect((await page.request.get(`/api/textbook/courses/loodusopetus-opik/units/${WATER}`)).ok()).toBe(false);

  // The child unit route shows a refusal, not the demo lesson.
  await navigateStable(page, `/kiur/loodusopetus/opik/${WATER}`);
  await expect(page.locator('.tb-problem')).toBeVisible();
  await expect(page.getByText('Vesi ja selle olekud')).toHaveCount(0);
});
