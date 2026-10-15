import { expect, test } from './test';
import { authenticateFamily } from './auth';
import { navigateStable } from './navigation';

test.beforeEach(async ({ page }) => authenticateFamily(page));

// Wednesday 14 October 2026 is a school day; Tallinn is UTC+3 that week.
const WEDNESDAY_1020 = new Date('2026-10-14T07:20:00Z');
const WEDNESDAY_1300 = new Date('2026-10-14T10:00:00Z');
// Wednesday 14 October 2026, 21:00 in Tallinn: both days are over, Thursday is a school day.
const WEDNESDAY_2100 = new Date('2026-10-14T18:00:00Z');
// Sunday 18 October 2026, 18:30 in Tallinn: the evening before a school week.
const SUNDAY_1830 = new Date('2026-10-18T15:30:00Z');
// Tuesday 27 October 2026 falls in the autumn holiday.
const HOLIDAY_1100 = new Date('2026-10-27T09:00:00Z');

test('the home page shows the lesson each child is in', async ({ page }) => {
  await page.clock.setFixedTime(WEDNESDAY_1020);
  await navigateStable(page, '/');

  const card = page.getByRole('region', { name: 'Lapsed koolis' });
  const kiur = card.getByRole('group', { name: 'Kiur' });
  const kirsi = card.getByRole('group', { name: 'Kirsi' });
  await expect(kiur).toContainText('3. tund');
  await expect(kiur).toContainText('Matemaatika');
  await expect(kiur).toContainText('10.00–10.45 · veel 25 min');
  await expect(kirsi).toContainText('Eesti keel');
  // The compact card has no progress bar.
  await expect(card.locator('.school-bar')).toHaveCount(0);

  const toggle = kiur.getByRole('button', { name: /tunniplaan/ });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  const today = kiur.getByRole('list', { name: 'Kiur täna' });
  await expect(today.getByRole('listitem')).toHaveCount(6);
  await expect(today.locator('[aria-current="time"]')).toContainText('Matemaatika');
  await kiur.getByRole('button', { name: /Peida/ }).click();
  await expect(today).toHaveCount(0);

  // The two buttons on each child's card.
  await expect(page.getByRole('link', { name: 'Harjutused', exact: true }).first()).toHaveAttribute('href', '/kiur');
  await expect(page.getByRole('link', { name: 'Tunniplaan' }).first()).toHaveAttribute('href', '/kiur/tunniplaan');
});

test('the home page says when school starts tomorrow once the day is over', async ({ page }) => {
  await page.clock.setFixedTime(WEDNESDAY_2100);
  await navigateStable(page, '/');

  const card = page.getByRole('region', { name: 'Lapsed koolis' });
  const kiur = card.getByRole('group', { name: 'Kiur' });
  const kirsi = card.getByRole('group', { name: 'Kirsi' });
  await expect(kiur).toContainText('Kodus');
  await expect(kiur).toContainText('Kool algab homme 8.15');
  await expect(kirsi).toContainText('Kool algab homme 9.05');
  // Nothing left today, so no list to open.
  await expect(card.getByRole('button', { name: /tunniplaan/ })).toHaveCount(0);
});

test('the home page shows the school card on Sunday evening', async ({ page }) => {
  await page.clock.setFixedTime(SUNDAY_1830);
  await navigateStable(page, '/');

  const card = page.getByRole('region', { name: 'Lapsed koolis' });
  await expect(card.getByRole('group', { name: 'Kiur' })).toContainText('Kool algab homme 9.05');
  await expect(card.getByRole('group', { name: 'Kirsi' })).toContainText('Kool algab homme 9.05');
});

test('the school card fits an iPhone mini without sideways scrolling', async ({ page }) => {
  // Monday 12 October, 12:10 in Tallinn: Kirsi is in the longest-named lesson.
  await page.clock.setFixedTime(new Date('2026-10-12T09:10:00Z'));
  await page.setViewportSize({ width: 375, height: 667 });
  await navigateStable(page, '/');

  const card = page.getByRole('region', { name: 'Lapsed koolis' });
  const kirsi = card.getByRole('group', { name: 'Kirsi' });
  await expect(kirsi).toContainText('Tehnoloogiline avastusõpe');
  await expect(kirsi).toContainText('12.00–12.45 · veel 35 min');
  await kirsi.getByRole('button', { name: /tunniplaan/ }).click();
  await expect(card.getByRole('list', { name: 'Kirsi täna' })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  const cardBox = await card.boundingBox();
  const nameBox = await kirsi.locator('.school-now-what').boundingBox();
  expect((nameBox?.x ?? 0) + (nameBox?.width ?? 0)).toBeLessThanOrEqual((cardBox?.x ?? 0) + (cardBox?.width ?? 0));
});

test('the home page has no school card during a holiday', async ({ page }) => {
  await page.clock.setFixedTime(HOLIDAY_1100);
  await navigateStable(page, '/');
  await expect(page.locator('.child-dashboard-card').first()).toBeVisible();
  await expect(page.getByRole('region', { name: 'Lapsed koolis' })).toHaveCount(0);
});

test('the timetable page turns to tomorrow when lessons end and keeps today\'s club', async ({ page }) => {
  await page.clock.setFixedTime(WEDNESDAY_1300);
  // The exercise page can open with the "yesterday" popup over it, so the
  // calendar button is checked by its target rather than clicked through.
  await navigateStable(page, '/kiur');
  await expect(page.getByRole('link', { name: 'Tunniplaan' })).toHaveAttribute('href', '/kiur/tunniplaan');
  await navigateStable(page, '/kiur/tunniplaan');

  const tabs = page.getByRole('tablist', { name: 'Tunniplaan' });
  await expect(tabs.getByRole('tab', { name: 'Homme' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText('Täna veel')).toBeVisible();
  await expect(page.locator('.timetable-today-club')).toContainText('Robootika');
  await expect(page.getByRole('heading', { name: 'Homme · neljapäev' })).toBeVisible();
  // Kiur needs nothing extra on Thursday, and the page says so.
  await expect(page.getByText('Midagi erilist pole vaja')).toBeVisible();

  await tabs.getByRole('tab', { name: 'Täna' }).click();
  await expect(page.locator('.timetable-day [aria-current="time"]')).toContainText('Robootika');

  await tabs.getByRole('tab', { name: 'Nädal' }).click();
  await expect(page.getByText('Vajuta päevale, et näha, mida kaasa võtta')).toBeVisible();
  await page.getByRole('button', { name: 'reede' }).click();
  await expect(page.locator('.timetable-bring li')).toHaveText([/Spordiriided/, /Kunstitarbed/, /Judoriided/]);
});

test('the week grid fits a small phone without sideways scrolling', async ({ page }) => {
  await page.clock.setFixedTime(WEDNESDAY_1020);
  await page.setViewportSize({ width: 360, height: 800 });
  await navigateStable(page, '/kirsi/tunniplaan');
  await page.getByRole('tab', { name: 'Nädal' }).click();
  await expect(page.locator('.timetable-week-cell[data-now="true"]')).toHaveText('Eesti');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
