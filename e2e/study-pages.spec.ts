import { expect, test } from './test';
import { authenticateFamily } from './auth';
import { navigateStable } from './navigation';

test.beforeEach(async ({ page }) => authenticateFamily(page));

test('direct clock study links keep Kirsi exercise context', async ({ page }) => {
  await navigateStable(page, '/opi/kellaaeg?learner=kiur&subject=loodusopetus&count=1');
  await expect(page.getByRole('heading', { name: 'Kellaaeg' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Tagasi harjutuste juurde/ })).toHaveAttribute('href', '/kirsi');

  await page.getByRole('button', { name: 'Alusta harjutust' }).click();
  await expect.poll(() => new URL(page.url()).pathname).toBe('/test');
  const target = new URL(page.url());
  expect(Object.fromEntries(target.searchParams)).toMatchObject({
    learner: 'kirsi',
    subject: 'matemaatika',
    topic: 'kellaaeg',
    category: 'Kellaaeg',
    exerciseId: 'kirsi.math.kellaaeg',
    count: '15'
  });
});

test('direct science study links use the science runner', async ({ page }) => {
  await navigateStable(page, '/opi/loodusopetus?learner=kirsi&subject=matemaatika&count=15');
  await expect(page.getByRole('heading', { name: 'Loodusõpetus' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Tagasi harjutuste juurde/ })).toHaveAttribute('href', '/kiur');

  await page.getByRole('button', { name: 'Alusta harjutust' }).click();
  await expect.poll(() => new URL(page.url()).pathname).toBe('/kiur/loodusopetus/test');
  const target = new URL(page.url());
  expect(target.searchParams.get('count')).toBe('10');
  expect(target.searchParams.has('learner')).toBe(false);
  expect(target.searchParams.has('subject')).toBe(false);
});

test('study diagram labels stay inside their canvases', async ({ page }) => {
  await navigateStable(page, '/opi/ring-ja-ringjoon');
  await page.getByRole('button', { name: 'Õpi enne' }).click();
  const ringSvg = page.locator("svg[aria-label^='Ringjoon:']");
  const ringLabel = ringSvg.getByText('ringjoon');
  const ringBounds = await ringSvg.boundingBox();
  const ringLabelBounds = await ringLabel.boundingBox();
  expect(ringBounds).not.toBeNull();
  expect(ringLabelBounds).not.toBeNull();
  expect(ringLabelBounds!.x + ringLabelBounds!.width).toBeLessThanOrEqual(ringBounds!.x + ringBounds!.width + 1);
  await expect(page.getByRole('button', { name: 'Vaata algusest uuesti' })).toHaveCount(0);

  await navigateStable(page, '/opi/kellaaeg');
  await page.getByRole('button', { name: 'Õpi enne' }).click();
  const clockSvg = page.locator('svg.study-svg-clock-annotated');
  const shortHandLabel = clockSvg.getByText('Lühike seier');
  const clockBounds = await clockSvg.boundingBox();
  const shortHandLabelBounds = await shortHandLabel.boundingBox();
  expect(clockBounds).not.toBeNull();
  expect(shortHandLabelBounds).not.toBeNull();
  expect(shortHandLabelBounds!.x + shortHandLabelBounds!.width).toBeLessThanOrEqual(clockBounds!.x + clockBounds!.width + 1);
  await expect(clockSvg.locator("[data-study-leader='short-hand']")).toHaveAttribute('points', /^146,118 182,142 202,142$/);
});
