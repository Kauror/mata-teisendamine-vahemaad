import { expect, test, type Page } from './test';
import { authenticateFamily } from './auth';
import { navigateStable } from './navigation';
import { CATALOG, quizCapital } from '../src/content/kaardimang/catalog';
import { CONTINENTS, OCEANS, WORLD_PARTS } from '../src/content/kaardimang/regions';
import type { OverviewResponse, ParentKaardimangResponse } from '../src/lib/kaardimang/api';

// Kaardimäng end to end on a 375 px phone. While the game is in parent testing
// (KAARDIMANG_CHILD_ENABLED = false) Kiur cannot reach it, so everything is
// played in the parent preview: every world part opens a real map, Uuri names
// Egypt and Cairo, a whole round is played on a map element that never
// re-mounts, the Pacific is accepted on both edges of the world map, and the
// preview leaves Kiur's data alone. Each right answer comes from the catalog,
// never from the server.

test.use({ viewport: { width: 375, height: 667 } });

const PAGE = '/vanem/kaardimang';
const byName = new Map(CATALOG.countries.map((country) => [country.nameEt, country]));
const byGenitive = new Map(CATALOG.countries.map((country) => [country.nameGenEt, country]));
const byCapital = new Map(CATALOG.countries.flatMap((country) => {
  const capital = quizCapital(country);
  return capital ? [[capital.nameEt, country] as const] : [];
}));

async function pick(page: Page, selector: string, which: 'first' | 'last' = 'first') {
  const target = page.locator(`.km-map ${selector}`);
  await expect(target.first()).toBeAttached();
  // A real tap lands wherever the shape's box centre is; dispatching on the
  // element itself tests the same handler without depending on the outline.
  await (which === 'first' ? target.first() : target.last()).dispatchEvent('click');
}

async function answerCurrent(page: Page, options: { pacificFromRight?: boolean } = {}) {
  const prompt = (await page.locator('.km-prompt').textContent())!.trim();
  if (prompt === 'Mis riik on kaardil esile tõstetud?') {
    const id = await page.locator('.km-map [data-paint="highlight"]').first().getAttribute('data-id');
    const name = CATALOG.countries.find((country) => country.id === id)!.nameEt;
    await page.locator('.km-option', { hasText: new RegExp(`^${name}$`) }).click();
    return;
  }
  let match = /^Mis on (.+) pealinn\?$/.exec(prompt);
  if (match) {
    await page.locator('.km-option', { hasText: new RegExp(`^${quizCapital(byGenitive.get(match[1])!)!.nameEt}$`) }).click();
    return;
  }
  match = /^Leia kaardilt (.+)\.$/.exec(prompt);
  if (match) return pick(page, `[data-id="${byName.get(match[1])!.id}"]`);
  match = /^Millise riigi pealinn on (.+)\? Puuduta/.exec(prompt);
  if (match) return pick(page, `[data-id="${byCapital.get(match[1])!.id}"]`);
  match = /^Leia (.+) manner\.$/.exec(prompt);
  if (match) return pick(page, `.km-feature[data-ct="${CONTINENTS.find((item) => item.genEt === match![1])!.id}"]`);
  match = /^Leia (.+) maailmajagu\.$/.exec(prompt);
  if (match) return pick(page, `.km-feature[data-wp="${WORLD_PARTS.find((item) => item.nameEt === match![1])!.id}"]`);
  match = /^Leia (.+)\.$/.exec(prompt);
  if (match?.[1] === 'lõunapoolus') return pick(page, '[data-id="south-pole"]');
  const ocean = OCEANS.find((item) => item.nameEt === match?.[1]);
  if (ocean) return pick(page, `.km-area[data-id="${ocean.id}"]`, ocean.id === 'pacific' && options.pacificFromRight ? 'last' : 'first');
  throw new Error(`Unknown prompt: ${prompt}`);
}

async function playRound(page: Page, options: { pacificFromRight?: boolean } = {}) {
  for (let guard = 0; guard < 12; guard++) {
    if (await page.getByRole('heading', { name: 'Voor läbi!' }).isVisible()) return;
    await answerCurrent(page, options);
    await expect(page.locator('.km-feedback')).toContainText('Õige!');
    await page.getByRole('button', { name: /^(Järgmine|Vaata tulemust)$/ }).click();
  }
  await expect(page.getByRole('heading', { name: 'Voor läbi!' })).toBeVisible();
}

async function openPart(page: Page, part: string) {
  await page.getByRole('button', { name: new RegExp(`^${part} `) }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: new RegExp(part) })).toBeVisible();
}

async function signInAsParent(page: Page) {
  await navigateStable(page, '/vanem');
  const password = page.getByLabel('Sisesta parool');
  if (await password.count() > 0) {
    await password.click();
    await password.pressSequentially('e2e-parent-password');
    await page.getByRole('button', { name: 'Sisene' }).click();
  }
  await expect(page.getByRole('button', { name: /^Kaardimäng/ })).toBeVisible({ timeout: 30_000 });
}

async function openParentSection(page: Page) {
  const section = page.getByRole('button', { name: /^Kaardimäng/ });
  await expect(async () => {
    if (await section.getAttribute('aria-expanded') !== 'true') await section.click();
    await expect(section).toHaveAttribute('aria-expanded', 'true', { timeout: 1000 });
  }).toPass({ timeout: 30_000 });
  await expect(page.locator('.km-parent strong', { hasText: '194 riiki' })).toBeVisible({ timeout: 30_000 });
}

async function noSideScroll(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
}

test.beforeEach(async ({ page }) => {
  await authenticateFamily(page);
  await signInAsParent(page);
});

test('Kiur cannot open Kaardimäng yet: no entry card, a notice, and a closed API', async ({ page }) => {
  await navigateStable(page, '/kiur/loodusopetus');
  await expect(page.getByRole('link', { name: /Õpiku õppetükid/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Kaardimäng/ })).toHaveCount(0);
  await navigateStable(page, '/kiur/loodusopetus/kaardimang');
  await expect(page.getByText('Kaardimäng on veel testimisel.', { exact: false })).toBeVisible();
  await expect(page.locator('.km-place')).toHaveCount(0);
  expect((await page.request.get('/api/kaardimang')).status()).toBe(403);
});

test('the parent opens Kaardimäng from the parent area and every world part has a real map', async ({ page }) => {
  test.setTimeout(90_000);
  await openParentSection(page);
  await page.getByRole('link', { name: 'Ava eelvaade' }).click();
  await expect(page.getByRole('heading', { name: '🗺️ Kaardimäng' })).toBeVisible();
  await expect(page.locator('.km-preview-note')).toBeVisible();
  await expect(page.locator('.km-place')).toHaveCount(7);
  await noSideScroll(page);

  for (const part of ['Maailm', 'Euroopa', 'Aasia', 'Aafrika', 'Ameerika', 'Austraalia ja Okeaania', 'Antarktika']) {
    await openPart(page, part);
    await page.getByRole('button', { name: /Uuri kaarti/ }).click();
    await expect(page.locator('.km-map .km-feature').first()).toBeAttached();
    if (part !== 'Maailm' && part !== 'Antarktika') expect(await page.locator('.km-map .km-feature[data-role="t"]').count(), part).toBeGreaterThan(10);
    await noSideScroll(page);
    await page.locator('.km-bar .practice-back-button').click();
    await page.getByRole('button', { name: /Kõik maailmajaod/ }).click();
  }
});

test('Uuri names Egypt and Cairo in North Africa', async ({ page }) => {
  await navigateStable(page, PAGE);
  await openPart(page, 'Aafrika');
  await page.getByRole('button', { name: /^Põhja-Aafrika/ }).click();
  await page.getByRole('button', { name: /Uuri kaarti/ }).click();
  await pick(page, '.km-feature[data-id="EGY"]');
  await expect(page.locator('.km-info h2')).toContainText('Egiptus');
  await expect(page.locator('.km-info')).toContainText('Kairo');
  await expect(page.locator('.km-label', { hasText: 'Kairo' })).toHaveCount(1);
  await page.getByRole('button', { name: 'Pealinnad' }).click();
  await expect(page.locator('.km-pin')).toHaveCount(await page.locator('.km-pin').count());
  expect(await page.locator('.km-pin').count()).toBeGreaterThanOrEqual(6);
});

test('a whole round: retry after a miss, the same map throughout, a neutral summary', async ({ page }) => {
  await navigateStable(page, PAGE);
  await openPart(page, 'Euroopa');
  await page.getByRole('button', { name: /^Baltikum/ }).click();
  await page.getByRole('button', { name: 'Rändur' }).click();
  await page.getByRole('button', { name: /Mängi/ }).click();
  await expect(page.locator('.km-prompt')).toBeVisible();
  await page.locator('.km-map svg').evaluate((svg) => { (svg as SVGElement & { kmMark?: boolean }).kmMark = true; });

  // A tap in the sea is never wrong; then one deliberate miss.
  if (await page.locator('.km-options').count() === 0) {
    await page.locator('.km-map .km-sea').dispatchEvent('click');
    await expect(page.locator('.km-feedback')).toContainText(/meri|ookeani/);
    const prompt = (await page.locator('.km-prompt').textContent())!;
    const wrong = ['Eesti', 'Läti', 'Leedu'].find((name) => !prompt.includes(name) && !prompt.includes(quizCapital(byName.get(name)!)!.nameEt))!;
    await pick(page, `[data-id="${byName.get(wrong)!.id}"]`);
  } else {
    const prompt = (await page.locator('.km-prompt').textContent())!;
    const buttons = page.locator('.km-option');
    const labels = await buttons.allTextContents();
    const highlighted = await page.locator('.km-map [data-paint="highlight"]').first().getAttribute('data-id');
    const right = prompt.startsWith('Mis riik') ? CATALOG.countries.find((country) => country.id === highlighted)!.nameEt : quizCapital(byGenitive.get(/^Mis on (.+) pealinn/.exec(prompt)![1])!)!.nameEt;
    await buttons.filter({ hasText: labels.find((label) => label !== right)! }).click();
  }
  await expect(page.locator('.km-feedback')).toContainText('Proovi veel');
  await expect(page.locator('.km-feedback')).toContainText('Vihje');

  await playRound(page);
  await expect(page.locator('.km-summary-score')).toContainText('küsimusest');
  await expect(page.locator('.km-summary')).toContainText('Järgmine kord võiksid üle vaadata');
  expect(await page.locator('.km-map svg').evaluate((svg) => (svg as SVGElement & { kmMark?: boolean }).kmMark)).toBe(true);
  await noSideScroll(page);
});

test('the world oceans: the Pacific counts on the right edge too', async ({ page }) => {
  await navigateStable(page, PAGE);
  await openPart(page, 'Maailm');
  await page.getByRole('button', { name: 'Ookeanid' }).click();
  await page.getByRole('button', { name: /Mängi/ }).click();
  await expect(page.locator('.km-progress')).toContainText('/ 5');
  await playRound(page, { pacificFromRight: true });
});

test('the parent preview plays without touching Kiur and can be reset', async ({ page }) => {
  test.setTimeout(90_000);
  const kiurBefore = await (await page.request.get('/api/parent/kaardimang')).json() as ParentKaardimangResponse;
  await navigateStable(page, PAGE);
  await openPart(page, 'Euroopa');
  await page.getByRole('button', { name: /^Baltikum/ }).click();
  await page.getByRole('button', { name: /Mängi/ }).click();
  await playRound(page);

  const kiurAfter = await (await page.request.get('/api/parent/kaardimang')).json() as ParentKaardimangResponse;
  expect(kiurAfter.kiur).toEqual(kiurBefore.kiur);
  const preview = await (await page.request.get('/api/parent/kaardimang/preview')).json() as OverviewResponse;
  expect(preview.practiced['europe-baltics'][0]).toBeGreaterThan(0);

  await navigateStable(page, '/vanem');
  await openParentSection(page);
  await page.getByRole('button', { name: 'Lähtesta eelvaade' }).click();
  await page.getByRole('button', { name: 'Jah, lähtesta' }).click();
  await expect(page.getByText(/Eelvaate mängud on kustutatud/)).toBeVisible();
  const cleared = await (await page.request.get('/api/parent/kaardimang/preview')).json() as OverviewResponse;
  expect(cleared.practiced['europe-baltics'][0]).toBe(0);
});
