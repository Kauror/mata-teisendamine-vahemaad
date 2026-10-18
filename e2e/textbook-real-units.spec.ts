import { expect, test, type Page } from './test';
import { authenticateFamily } from './auth';
import { navigateStable } from './navigation';
import { ANSWER_KEY_FIELDS, COURSE, PREVIEW_API, apiGet, apiPost, actionId, passTestViaApi, practiseViaApi, previewCourse, readAllViaApi, resetPreview, signInAsParent } from './textbookHelpers';
import type { ParentOverviewResponse, ParentUnitDetailResponse, TestSessionView } from '../src/lib/textbook/api';
import { getDiagram } from '../src/lib/textbook/diagramRegistry';
import type { Question } from '../src/lib/textbook/types';

// A fast, data-driven browser SMOKE test of every 'ready' unit of the real
// course (Loodusõpetus õpik), through the authenticated parent preview. A unit
// that becomes ready is covered without a new spec.
//
// For each ready unit, in the course order: every lesson page renders every
// block of every section, each picture is drawn with its region IDs, photos
// load, and nothing scrolls sideways at 375 px (and at 360 px on the sections
// with a picture or a table); then one test page renders its 20 questions with
// no answer key anywhere in the page or its network payload, and every hotspot
// picture in it shows letters only. The unit is then passed through the
// preview API, which opens the next one — so each unit is passed exactly once,
// never replayed per spec.
//
// The full browser walkthrough (reading gate, practice with a correction,
// 18/20 → targeted practice → 19/20, reloads) is proved once, on the demo
// course, in e2e/textbook.spec.ts. The real units' pass/fail logic (18/20
// fails, 19/20 passes, 8/7/5, every objective) is proved per unit on the
// server in src/lib/server/textbook/textbook.test.ts, and their hotspot
// pictures' answer secrecy in src/app/components/textbook/diagrams/*.test.ts.
//
// Tagged @real-units: CI runs it on a runner of its own (.github/workflows/ci.yml),
// apart from the shards that carry the demo walkthrough.
//
// Both browser projects share one database, so the test starts by resetting
// the preview learner for this course.

const PHONE = { width: 375, height: 667 };
const NARROW = { width: 360, height: 720 };
// In CI this spec has a runner of its own, so it meets every route cold.
const FIRST_RENDER = 45_000;
// Pictures whose region labels are the legend data the learner reads off them.
const LABELS_ARE_LEGEND_DATA = new Set(['u14-population-map']);

test.use({ viewport: PHONE });

async function noSidewaysScroll(page: Page, where: string) {
  const [scroll, inner] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  expect(scroll, `${where}: no sideways scroll at ${inner} px`).toBeLessThanOrEqual(inner);
}

// Every region of the drawing has a tap area of at least 44 × 44 px.
async function tapAreasAtLeast44(page: Page, diagramId: string) {
  const sizes = await page.locator(`svg[data-diagram-id="${diagramId}"] .tb-region-hit`).evaluateAll((nodes) => nodes.map((node) => {
    const box = node.getBoundingClientRect();
    return Math.min(box.width, box.height);
  }));
  // Every region has a tap area; a region drawn twice (the `twin` prop) has two.
  await expect(page.locator(`svg[data-diagram-id="${diagramId}"] .tb-region:has(.tb-region-hit)`), diagramId).toHaveCount(getDiagram(diagramId)!.regions.length);
  for (const size of sizes) expect(size, `${diagramId} tap area`).toBeGreaterThanOrEqual(44);
}

// A lesson-mode picture: drawn, inside the reading card, every region named.
async function checkLessonDiagram(page: Page, diagramId: string) {
  const definition = getDiagram(diagramId);
  expect(definition, `${diagramId} is registered`).toBeTruthy();
  const svg = page.locator(`.tb-reader svg[data-diagram-id="${diagramId}"]`);
  await svg.scrollIntoViewIfNeeded();
  await expect(svg).toBeVisible();
  const regionIds = await svg.locator('.tb-region').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-region-id')));
  expect(regionIds.sort(), `${diagramId} regions`).toEqual(definition!.regions.map((region) => region.id).sort());
  // Every region carries its label. A region drawn twice (Unit 16's Pacific at
  // both map edges, the `twin` prop) carries it twice, so count regions, not labels.
  await expect(svg.locator('.tb-region:has(.tb-diagram-label)')).toHaveCount(definition!.regions.length);
  await expect(svg.locator('.tb-diagram-label:not(.tb-region .tb-diagram-label)')).toHaveCount(0);
  await expect(svg.locator('desc')).not.toHaveText(/^Joonisel on tähtedega/);
  const [svgBox, readerBox] = [(await svg.boundingBox())!, (await page.locator('.tb-reader').boundingBox())!];
  expect(svgBox.x).toBeGreaterThanOrEqual(readerBox.x);
  expect(svgBox.x + svgBox.width, `${diagramId} inside the reading card`).toBeLessThanOrEqual(readerBox.x + readerBox.width + 0.5);
}

async function checkPhoto(page: Page, src: string) {
  const photo = page.locator(`.tb-reader img.tb-photo-img[src="${src}"]`);
  await photo.scrollIntoViewIfNeeded();
  await expect(photo).toBeVisible();
  await expect.poll(() => photo.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth), { message: `${src} loads` }).toBeGreaterThan(0);
}

// Reads every lesson of the unit on screen (the lessons are already marked
// read through the API, so the pages can be opened directly).
async function checkLessons(page: Page, detail: ParentUnitDetailResponse) {
  const unitPath = `${previewCourse}/${detail.unit.unitId}`;
  for (const lesson of detail.lessons) {
    await navigateStable(page, `${unitPath}/lugemine/${lesson.id}`);
    // Generous only for the first visit, when the dev server compiles the route.
    await expect(page.locator('.tb-header h1')).toContainText(lesson.title, { timeout: FIRST_RENDER });
    for (const [index, section] of lesson.sections.entries()) {
      const where = `${lesson.id} osa ${index + 1}`;
      await expect(page.locator('.tb-eyebrow')).toHaveText(`Õpi · Osa ${index + 1}/${lesson.sections.length}`);
      // Every block of the section, in order (nothing dropped or unknown).
      await expect.poll(() => page.locator('.tb-reader [data-block-id]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-block-id'))), { message: `${where} blocks` })
        .toEqual(section.blocks.map((block) => block.id));
      await expect(page.locator('.tb-reader .tb-diagram-missing')).toHaveCount(0);
      const diagrams = section.blocks.flatMap((block) => (block.type === 'diagram' ? [block.diagramId] : []));
      const photos = section.blocks.flatMap((block) => (block.type === 'image' ? [block.src] : []));
      for (const diagramId of diagrams) await checkLessonDiagram(page, diagramId);
      for (const src of photos) await checkPhoto(page, src);
      await noSidewaysScroll(page, where);
      // The narrowest phone, once per lesson and on every section with something wide in it.
      if (index === 0 || diagrams.length > 0 || photos.length > 0 || section.blocks.some((block) => block.type === 'table' || block.type === 'comparison')) {
        // (Tap areas matter only where the picture is tappable: in hotspot questions, checked on the test page.)
        await page.setViewportSize(NARROW);
        await noSidewaysScroll(page, where);
        await page.setViewportSize(PHONE);
      }
      if (index < lesson.sections.length - 1) await page.getByRole('button', { name: 'Edasi →' }).click();
    }
  }
}

// A hotspot question on the test page: letters only, nothing that names a region.
async function checkHotspotNeutral(page: Page, question: Question) {
  if (question.answer.type !== 'diagram_hotspot') return;
  const { diagramId } = question.answer;
  const definition = getDiagram(diagramId)!;
  const card = page.locator(`.tb-question[data-question-id="${question.id}"]`);
  const svg = card.locator(`svg[data-diagram-id="${diagramId}"]`);
  await expect(svg).toBeVisible();
  await expect(svg.locator('.tb-diagram-label')).toHaveCount(0);
  await expect(svg.locator('.tb-diagram-note')).toHaveCount(0);
  await expect(svg.locator('desc')).toHaveText(/^Joonisel on tähtedega märgitud kohad/);
  await expect(svg.locator('.tb-region[role="button"]')).toHaveCount(definition.regions.length);
  const drawn = (await svg.locator('text').allTextContents()).map((text) => text.trim().toLowerCase()).filter(Boolean);
  const buttons = (await card.locator('[data-region-button]').allTextContents()).map((text) => text.toLowerCase());
  for (const region of definition.regions) {
    const label = region.label.toLowerCase();
    for (const text of buttons) expect(text, `${question.id}: region button names "${region.label}"`).not.toContain(label);
    if (LABELS_ARE_LEGEND_DATA.has(diagramId)) continue;
    for (const text of drawn) expect(text, `${question.id}: picture shows "${region.label}"`).not.toContain(label);
  }
  await tapAreasAtLeast44(page, diagramId);
}

// Opens the test page once: 20 questions, no key in the page or its payload,
// and every hotspot question's picture neutral. Returns how many hotspot questions it checked.
async function checkTestPage(page: Page, unitId: string, keys: Map<string, Question>) {
  const session = await apiPost<TestSessionView>(page, `${PREVIEW_API}/courses/${COURSE}/units/${unitId}/test`, { actionId: actionId() });
  expect(session.questions).toHaveLength(20);
  const payloads: Promise<string>[] = [];
  const collect = (response: { url(): string; text(): Promise<string> }) => {
    if (new URL(response.url()).pathname.startsWith('/api/')) payloads.push(response.text().catch(() => ''));
  };
  page.on('response', collect);
  await navigateStable(page, `${previewCourse}/${unitId}/test?session=${session.sessionId}`);
  await expect(page.locator('.tb-question-eyebrow')).toHaveText('Küsimus 1/20', { timeout: FIRST_RENDER });
  await expect(page.locator('.tb-test-grid-button')).toHaveCount(20);
  await noSidewaysScroll(page, `${unitId} test`);
  await page.setViewportSize(NARROW);
  await noSidewaysScroll(page, `${unitId} test`);
  await page.setViewportSize(PHONE);

  let hotspots = 0;
  for (const [position, view] of session.questions.entries()) {
    const question = keys.get(view.id)!;
    if (question.answer.type !== 'diagram_hotspot') continue;
    hotspots += 1;
    await page.locator('.tb-test-grid-button').nth(position).click();
    await expect(page.locator('.tb-question-eyebrow')).toHaveText(`Küsimus ${position + 1}/20`);
    await checkHotspotNeutral(page, question);
  }
  page.off('response', collect);
  const bodies = await Promise.all(payloads);
  expect(bodies.length, 'the test page fetched its session').toBeGreaterThan(0);
  for (const body of bodies) expect(body).not.toMatch(ANSWER_KEY_FIELDS);
  expect(await page.content()).not.toMatch(ANSWER_KEY_FIELDS);
  const fetched = await page.request.get(`${PREVIEW_API}/test/${session.sessionId}`);
  expect(fetched.ok()).toBe(true);
  expect(await fetched.text()).not.toMatch(ANSWER_KEY_FIELDS);
  return hotspots;
}

test.beforeEach(async ({ page }) => {
  await authenticateFamily(page);
});

test('every ready unit of the real course renders in the preview: lessons, pictures, photos, a 20-question test without keys, neutral hotspots', { tag: '@real-units' }, async ({ page }) => {
  // On its own CI runner the first page compiles cold; the budget grows with the units below.
  test.setTimeout(120_000);
  await signInAsParent(page);
  const overview = await apiGet<ParentOverviewResponse>(page, '/api/parent/textbook');
  const real = overview.courses.find((course) => course.courseId === COURSE)!;
  const ready = real.units.filter((unit) => unit.contentStatus === 'ready').sort((left, right) => left.number - right.number);
  const drafts = real.units.filter((unit) => unit.contentStatus !== 'ready');
  expect(ready.map((unit) => unit.unitId)).toEqual(expect.arrayContaining(['lo-opik-u10', 'lo-opik-u11', 'lo-opik-u12', 'lo-opik-u13', 'lo-opik-u14']));
  test.setTimeout(120_000 + ready.length * 60_000);
  await resetPreview(page);

  // The preview lists the ready units only, in order: the first open, the rest locked.
  await navigateStable(page, previewCourse);
  await expect(page.getByText('Eelvaade — lapse andmeid ei muudeta.')).toBeVisible({ timeout: FIRST_RENDER });
  await expect(page.locator('.tb-unit-card')).toHaveCount(ready.length);
  expect(await page.locator('.tb-unit-card').evaluateAll((nodes) => nodes.map((node) => [node.getAttribute('data-unit-id'), node.getAttribute('data-status')])))
    .toEqual(ready.map((unit, index) => [unit.unitId, index === 0 ? 'start_learning' : 'locked']));
  for (const unit of drafts) await expect(page.locator(`[data-unit-id="${unit.unitId}"]`)).toHaveCount(0);
  await noSidewaysScroll(page, 'course');

  const hotspotsChecked: Record<string, number> = {};
  for (const [index, unit] of ready.entries()) {
    await test.step(`${unit.unitId} ${unit.title}`, async () => {
      let mark = Date.now();
      const phases: string[] = [];
      const lap = (name: string) => {
        phases.push(`${name} ${((Date.now() - mark) / 1000).toFixed(1)}s`);
        mark = Date.now();
      };
      const detail = await apiGet<ParentUnitDetailResponse>(page, `/api/parent/textbook/courses/${COURSE}/units/${unit.unitId}`);
      const keys = new Map(detail.questions.map((question) => [question.id, question]));
      await readAllViaApi(page, unit.unitId);
      lap('read (API)');
      await checkLessons(page, detail);
      lap('lessons');
      await practiseViaApi(page, unit.unitId, keys);
      lap('practice (API)');
      hotspotsChecked[unit.unitId] = await checkTestPage(page, unit.unitId, keys);
      lap('test page');
      // Leave the test page before answering it through the API, then pass: that opens the next unit.
      await page.goto('about:blank');
      const result = await passTestViaApi(page, unit.unitId, keys);
      lap('pass (API)');
      console.log(`${unit.unitId}: ${phases.join(', ')}`);
      const next = ready[index + 1];
      expect(result).toMatchObject(next ? { nextUnitOpened: true, nextUnit: { unitId: next.unitId } } : { nextUnitOpened: false });
    });
  }
  test.info().annotations.push({ type: 'hotspot questions checked', description: JSON.stringify(hotspotsChecked) });

  // Kiur sees none of it: nothing was published by the preview.
  const child = await apiGet<{ units: unknown[] }>(page, `/api/textbook/courses/${COURSE}`);
  expect(child.units).toEqual([]);
  expect((await page.request.get(`/api/textbook/courses/${COURSE}/units/${ready[0].unitId}`)).ok()).toBe(false);
});
