import { expect, test, type Page } from './test';
import { authenticateFamily } from './auth';
import { navigateStable } from './navigation';
import { COURSE, PREVIEW_API, previewCourse, signInAsParent, apiGet, resetPreview, unitKeys, readAllViaApi, passEarlierReadyUnits } from './textbookHelpers';
import type { ParentOverviewResponse, TestSessionView, UnitDetailResponse } from '../src/lib/textbook/api';
import { hotspotRegionIds } from '../src/lib/textbook/grading';
import type { Question } from '../src/lib/textbook/types';

// Unit 12 "Kaart" (Loodusõpetus õpik pp. 50–53) end to end on a 375 px phone,
// through the authenticated parent preview. The unit is content-'ready' but
// NOT published: it shows in the preview and nowhere for Kiur. The preview
// keeps the child's order, so Unit 12 opens only after Units 10 and 11 are
// passed; both are passed through the preview API first.
// Then: all four lessons (15 sections, 7 diagram blocks of 4 diagrams),
// practice with a correction, 18/20 fail → targeted practice → 19/20 pass,
// frozen test snapshots across a reload, and the hotspot pictures never
// giving the answer away (no labels, no legend words).
//
// Both browser projects share one database, so every test starts by resetting
// the preview learner for this course.

test.use({ viewport: { width: 375, height: 667 } });

const U12 = 'lo-opik-u12';
const previewUnit = `${previewCourse}/${U12}`;
const SECTIONS_PER_LESSON = [3, 4, 4, 4];
const DIAGRAM_BY_LESSON_SECTION: Record<string, string> = {
  '1/1': 'u12-globe-flatmap',
  '1/2': 'u12-orange-peel',
  '2/3': 'u12-aerial-vs-map',
  '3/1': 'u12-aerial-vs-map',
  '3/2': 'u12-legend-town',
  '3/4': 'u12-legend-town',
  '4/3': 'u12-legend-town'
};
// Words that would answer a hotspot question if the picture or the region list showed them.
const ANSWER_WORDS = /gloobus|kaart\b|apelsin|koor|aerofoto|jõgi|park|hoone|sild|muuseum|legend/i;

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
      // legend word, a neutral description, and nothing else written in it.
      const svg = card.locator(`svg[data-diagram-id="${answer.diagramId}"]`);
      await expect(svg).toBeVisible();
      await expect(svg.locator('.tb-diagram-label')).toHaveCount(0);
      await expect(svg.locator('.tb-diagram-note')).toHaveCount(0);
      await expect(svg.locator('.tb-u12-legend-word')).toHaveCount(0);
      await expect(svg.locator('desc')).toHaveText(/^Joonisel on tähtedega märgitud kohad/);
      const regions = hotspotRegionIds(answer);
      const written = await svg.locator('text').allTextContents();
      expect(written.sort()).toEqual(regions.map((_, index) => String.fromCharCode(65 + index)).sort());
      expect(await svg.locator('title').textContent()).not.toMatch(ANSWER_WORDS);
      await expect(svg.locator('.tb-region[role="button"]')).toHaveCount(regions.length);
      // The accessible region list is neutral too, and keyboard reachable.
      for (const region of regions) {
        const button = card.locator(`[data-region-button="${region}"]`);
        await expect(button).toBeVisible();
        expect(await button.textContent()).not.toMatch(ANSWER_WORDS);
      }
      const id = correct ? answer.correctRegionId : regions.find((region) => region !== answer.correctRegionId)!;
      // Tap the picture itself; its tap area is at least 44 px.
      const region = svg.locator(`.tb-region[data-region-id="${id}"]`);
      const box = (await region.locator('.tb-region-hit').boundingBox())!;
      expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);
      await region.click();
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
  for (let guard = 0; guard < 120; guard += 1) {
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

test.beforeEach(async ({ page }) => {
  await authenticateFamily(page);
});

test('Unit 12 preview: locked until the earlier ready units are passed, then all four lessons with the diagrams, at 375 and 360 px', async ({ page }) => {
  test.setTimeout(180_000);
  await signInAsParent(page);
  await resetPreview(page);

  // Unit 12 is in the preview but locked behind the earlier ready units; Unit 22 (a draft) is not listed.
  await navigateStable(page, previewCourse);
  await expect(page.getByText('Eelvaade — lapse andmeid ei muudeta.')).toBeVisible();
  const card = page.locator(`.tb-unit-card[data-unit-id="${U12}"]`);
  await expect(card).toContainText('Kaart');
  await expect(card.locator('.tb-status-chip')).toContainText('Lukus');
  await expect(page.locator('[data-unit-id="lo-opik-u22"]')).toHaveCount(0);

  await passEarlierReadyUnits(page, U12);
  await navigateStable(page, previewCourse);
  await card.getByRole('link', { name: 'Alusta õppimist' }).click();
  await page.getByRole('link', { name: 'Alusta lugemist' }).click();

  const titles = ['Gloobusest kaardini', 'Kuidas kaart valmib?', 'Leppemärgid, legend ja värvid', 'Loeme Tartu kesklinna kaarti'];
  let sections = 0;
  let diagrams = 0;
  for (let lesson = 1; lesson <= 4; lesson += 1) {
    const count = SECTIONS_PER_LESSON[lesson - 1];
    await expect(page.locator('.tb-header h1')).toContainText(titles[lesson - 1]);
    for (let section = 1; section <= count; section += 1) {
      await expect(page.locator('.tb-eyebrow')).toHaveText(`Õpi · Osa ${section}/${count}`);
      sections += 1;
      const diagramId = DIAGRAM_BY_LESSON_SECTION[`${lesson}/${section}`];
      if (diagramId) {
        diagrams += 1;
        const svg = page.locator(`svg[data-diagram-id="${diagramId}"]`);
        await svg.scrollIntoViewIfNeeded();
        await expect(svg).toBeVisible();
        // Lesson mode: real labels, no buttons, a full description.
        await expect(svg.locator('.tb-diagram-label').first()).toBeVisible();
        await expect(svg.locator('[role="button"]')).toHaveCount(0);
        await expect(svg.locator('desc')).not.toHaveText(/^Joonisel on tähtedega/);
        if (diagramId === 'u12-legend-town') {
          await expect(svg.locator('.tb-u12-legend-word')).toHaveText(['muuseum', 'sild', 'jõgi', 'park', 'hoone']);
          await expect(svg.locator('.tb-u12-legend-blank')).toHaveCount(0);
        }
        if (diagramId === 'u12-aerial-vs-map') await expect(svg.locator('.tb-diagram-note')).toHaveText('joonistus, mitte foto');
        // The picture stays inside the reading card.
        const [svgBox, readerBox] = [await svg.boundingBox(), await page.locator('.tb-reader').boundingBox()];
        expect(svgBox!.x).toBeGreaterThanOrEqual(readerBox!.x);
        expect(svgBox!.x + svgBox!.width).toBeLessThanOrEqual(readerBox!.x + readerBox!.width + 0.5);
      }
      await noSidewaysScroll(page);
      if (section < count) await page.getByRole('button', { name: 'Edasi →' }).click();
    }
    await page.locator('.tb-end-sentinel').scrollIntoViewIfNeeded();
    await expect(page.locator('.tb-end-sentinel')).toHaveAttribute('data-seen', 'true');
    await page.getByRole('button', { name: 'Lugesin läbi' }).click();
    if (lesson < 4) {
      await expect(page.getByRole('heading', { name: '✓ Õppetükk on loetud' })).toBeVisible();
      await page.getByRole('link', { name: 'Järgmine õppetükk →' }).click();
    }
  }
  expect(sections).toBe(15);
  expect(diagrams).toBe(7);
  await expect(page.getByText('Kõik kohustuslikud õppetükid on loetud. Nüüd saad harjutada!')).toBeVisible();

  // The widest diagram (the practice town with its legend) fits a 360 px phone.
  await page.setViewportSize({ width: 360, height: 720 });
  await navigateStable(page, `${previewUnit}/lugemine/lo-opik-u12-l4?osa=3`);
  const town = page.locator('svg[data-diagram-id="u12-legend-town"]');
  await expect(town).toBeVisible();
  expect((await town.boundingBox())!.width).toBeLessThanOrEqual(360);
  await noSidewaysScroll(page);
});

test('Unit 12 preview: practice with a correction, 18/20 fails, targeted practice, 19/20 passes across a reload; Kiur sees nothing', async ({ page }) => {
  test.setTimeout(600_000);
  await signInAsParent(page);
  await resetPreview(page);
  await passEarlierReadyUnits(page, U12);
  const keys = await unitKeys(page, U12);
  expect(keys.size).toBe(94);
  await readAllViaApi(page, U12);

  // Practice in the UI: the first answer is wrong, its objective comes back.
  await openSessionPage(page, `${previewUnit}/harjuta`);
  const seen = await finishPracticeInUi(page, keys, true);
  await expect(page.getByRole('heading', { name: 'Harjutus on tehtud!' })).toBeVisible();
  const missed = keys.get(seen[0])!.primaryObjectiveId;
  expect(seen.slice(1).some((id) => keys.get(id)!.primaryObjectiveId === missed)).toBe(true);
  // Every one of the eight objectives was answered in practice.
  expect(new Set(seen.map((id) => keys.get(id)!.primaryObjectiveId)).size).toBe(8);

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
  const secondIds = await answerTestInUi(page, keys, [6]);
  // A browser reload before submitting keeps the same frozen questions and saved answers.
  await expect.poll(async () => (await apiGet<TestSessionView>(page, `${PREVIEW_API}/test/${secondSessionId}`)).answeredCount).toBe(20);
  const beforeReload = await apiGet<TestSessionView>(page, `${PREVIEW_API}/test/${secondSessionId}`);
  await page.reload();
  await expect(page.locator('.tb-question-eyebrow')).toBeVisible();
  const afterReload = await apiGet<TestSessionView>(page, `${PREVIEW_API}/test/${secondSessionId}`);
  expect(afterReload.questions.map((question) => question.id)).toEqual(secondIds);
  expect(afterReload.answers).toEqual(beforeReload.answers);
  expect(afterReload.answeredCount).toBe(20);
  await submitTest(page);
  const passed = page.locator('[data-result="passed"]');
  await expect(passed).toBeVisible();
  await expect(passed.locator('.tb-result-score')).toContainText('19/20');
  await expect(passed).toContainText('Eelvaates tähti ei anta.');

  // Each test: 20 distinct questions from 20 distinct variant groups, 8/7/5, all eight objectives.
  for (const ids of [firstIds, secondIds]) {
    expect(new Set(ids).size).toBe(20);
    expect(new Set(ids.map((id) => keys.get(id)!.variantGroupId)).size).toBe(20);
    const levels = { factual: 0, understanding: 0, application: 0 };
    for (const id of ids) levels[keys.get(id)!.cognitiveLevel] += 1;
    expect(levels).toEqual({ factual: 8, understanding: 7, application: 5 });
    expect(new Set(ids.map((id) => keys.get(id)!.primaryObjectiveId)).size).toBe(8);
  }
  // The historical snapshots keep exactly the questions that were shown.
  const first = await apiGet<TestSessionView>(page, `${PREVIEW_API}/test/${firstSessionId}`);
  const second = await apiGet<TestSessionView>(page, `${PREVIEW_API}/test/${secondSessionId}`);
  expect(first.questions.map((question) => question.id)).toEqual(firstIds);
  expect(second.questions.map((question) => question.id)).toEqual(secondIds);
  expect([first.result?.correct, second.result?.correct]).toEqual([18, 19]);
  const unit = await apiGet<UnitDetailResponse>(page, `${PREVIEW_API}/courses/${COURSE}/units/${U12}`);
  expect(unit.attempts.map((attempt) => [attempt.correct, attempt.total, attempt.passed])).toEqual([[18, 20, false], [19, 20, true]]);

  // Unit 12 itself stays unpublished; Unit 22 is a draft.
  const overview = await apiGet<ParentOverviewResponse>(page, '/api/parent/textbook');
  const real = overview.courses.find((course) => course.courseId === COURSE)!;
  expect(real.units.find((item) => item.unitId === U12)).toMatchObject({ contentStatus: 'ready', published: false, validation: { publishable: true } });
  expect(real.units.find((item) => item.unitId === 'lo-opik-u22')).toMatchObject({ contentStatus: 'draft', published: false });
  await navigateStable(page, previewCourse);
  await expect(page.locator(`.tb-unit-card[data-unit-id="${U12}"] .tb-status-chip`)).toContainText('Läbitud');

  // Kiur's course list is still empty: nothing was published by the preview.
  const child = await apiGet<{ units: unknown[] }>(page, `/api/textbook/courses/${COURSE}`);
  expect(child.units).toEqual([]);
  expect((await page.request.get(`/api/textbook/courses/${COURSE}/units/${U12}`)).ok()).toBe(false);
});
