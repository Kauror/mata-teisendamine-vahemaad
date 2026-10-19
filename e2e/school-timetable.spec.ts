import { expect, test, type Page } from './test';
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

// Tuesday 13 October 2026, 17:40 in Tallinn: Kiur's judo starts at 18.30.
const TUESDAY_1740 = new Date('2026-10-13T14:40:00Z');
// Saturday 17 October 2026, 11:00 in Tallinn.
const SATURDAY_1100 = new Date('2026-10-17T08:00:00Z');

const childCard = (page: Page, name: 'Kiur' | 'Kirsi') =>
  page.locator('.child-dashboard-card', { has: page.getByRole('link', { name, exact: true }) });

test('the home cards say how long each child is at school, and open the child page', async ({ page }) => {
  await page.clock.setFixedTime(WEDNESDAY_1020);
  await navigateStable(page, '/');

  await expect(childCard(page, 'Kiur').locator('.child-status')).toHaveText(/koolis kuni 12\.45/);
  await expect(childCard(page, 'Kirsi').locator('.child-status')).toHaveText(/koolis kuni 12\.45/);
  // The separate school card is gone: the line lives on each child's card.
  await expect(page.getByRole('region', { name: 'Lapsed koolis' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Kiur', exact: true })).toHaveAttribute('href', '/kiur');
  await expect(page.getByRole('link', { name: 'Kirsi', exact: true })).toHaveAttribute('href', '/kirsi');
});

test('a club shows on the home card an hour before it starts', async ({ page }) => {
  await page.clock.setFixedTime(TUESDAY_1740);
  await navigateStable(page, '/');
  await expect(childCard(page, 'Kiur').locator('.child-status')).toHaveText(/Judo 18\.30/);
  // Kirsi's day is over and it is not evening yet: no line at all.
  await expect(childCard(page, 'Kirsi').locator('.child-status')).toHaveCount(0);
});

test('the home cards say when school starts, from the evening before', async ({ page }) => {
  await page.clock.setFixedTime(WEDNESDAY_2100);
  await navigateStable(page, '/');
  await expect(childCard(page, 'Kiur').locator('.child-status')).toHaveText(/kool algab 8\.15/);
  await expect(childCard(page, 'Kirsi').locator('.child-status')).toHaveText(/kool algab 9\.05/);

  await page.clock.setFixedTime(SUNDAY_1830);
  await navigateStable(page, '/');
  await expect(childCard(page, 'Kiur').locator('.child-status')).toHaveText(/kool algab 9\.05/);
  await expect(childCard(page, 'Kirsi').locator('.child-status')).toHaveText(/kool algab 9\.05/);
});

test('the school line on a home card opens both timetables', async ({ page }) => {
  await page.clock.setFixedTime(WEDNESDAY_2100);
  await navigateStable(page, '/');
  // Checked by its link rather than a tap: the page can open with yesterday's
  // points recap over it.
  await expect(childCard(page, 'Kiur').getByRole('link', { name: /kool algab 8\.15/ })).toHaveAttribute('href', '/tunniplaan');
  await expect(childCard(page, 'Kirsi').getByRole('link', { name: /kool algab 9\.05/ })).toHaveAttribute('href', '/tunniplaan');

  await navigateStable(page, '/tunniplaan');
  const kiur = page.getByRole('region', { name: 'Kiur' });
  const kirsi = page.getByRole('region', { name: 'Kirsi' });
  // Both days are over, so each timetable has turned to Thursday.
  for (const child of [kiur, kirsi]) {
    await expect(child.getByRole('tab', { name: 'Homme' })).toHaveAttribute('aria-selected', 'true');
    await expect(child.getByRole('heading', { name: 'Homme · neljapäev' })).toBeVisible();
  }
  // Each child's tabs are their own.
  await kiur.getByRole('tab', { name: 'Nädal' }).click();
  await expect(kiur.getByRole('table', { name: 'Nädala tunniplaan' })).toBeVisible();
  await expect(kirsi.getByRole('tab', { name: 'Homme' })).toHaveAttribute('aria-selected', 'true');
});

test('the home cards fit an iPhone mini without sideways scrolling', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-12T09:10:00Z'));
  await page.setViewportSize({ width: 375, height: 667 });
  await navigateStable(page, '/');
  await expect(childCard(page, 'Kirsi').locator('.child-status')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('the home cards have no school line during a holiday', async ({ page }) => {
  await page.clock.setFixedTime(HOLIDAY_1100);
  await navigateStable(page, '/');
  await expect(page.locator('.child-dashboard-card').first()).toBeVisible();
  await expect(page.locator('.child-status')).toHaveCount(0);
});

test('the child page opens its timetable on a school day and folds it on a day off', async ({ page }) => {
  await page.clock.setFixedTime(WEDNESDAY_1020);
  await navigateStable(page, '/kiur');
  const section = page.getByRole('region', { name: 'Tunniplaan' });
  await expect(section.getByRole('button', { name: /Tunniplaan/ })).toHaveAttribute('aria-expanded', 'true');
  await expect(section.getByRole('tablist', { name: 'Tunniplaan' })).toBeVisible();
  await expect(section.locator('.timetable-day [aria-current="time"]')).toContainText('Matemaatika');

  await page.clock.setFixedTime(SATURDAY_1100);
  await navigateStable(page, '/kiur');
  const folded = page.getByRole('region', { name: 'Tunniplaan' });
  const head = folded.getByRole('button', { name: /Tunniplaan/ });
  await expect(head).toHaveAttribute('aria-expanded', 'false');
  // Kiur has no first lesson on Mondays.
  await expect(head).toContainText('esmaspäev 9.05');
  // Folded means the tabs are not rendered at all. (Not clicked open here: the
  // page can open with yesterday's points recap over it.)
  await expect(folded.getByRole('tablist', { name: 'Tunniplaan' })).toHaveCount(0);
});

test('the timetable page turns to tomorrow when lessons end and keeps today\'s club', async ({ page }) => {
  await page.clock.setFixedTime(WEDNESDAY_1300);
  // The page itself is still there for an old bookmark and the offline shell.
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
