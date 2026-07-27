import { expect, test } from '../e2e/test';
import {
  assertResponsiveLayout,
  assertVisiblePageContract,
  authenticateFamily,
  authenticateParent,
  dismissPointsRecap,
  gotoStable,
  recordRuntimeProblems
} from './helpers';

test('the PIN submit control follows its enabled and error contracts', async ({ page }) => {
  await page.goto('/access');
  const submit = page.getByRole('button', { name: 'Sisene' });
  await expect(submit).toBeDisabled();

  await page.getByLabel('Sisesta pere parool').fill('wrong-pin');
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(page.locator('.error')).toBeVisible();
  await expect(page).toHaveURL(/\/access$/);
});

test('the child recap action dismisses its modal and leaves the dashboard usable', async ({ page }) => {
  await authenticateFamily(page);
  await gotoStable(page, '/kiur', 'load');
  const recap = page.locator('.task-modal-backdrop[aria-labelledby="points-recap-title"]');
  await recap.waitFor({ state: 'visible', timeout: 5_000 });
  await expect(recap.getByRole('button', { name: 'Lähme harjutama' })).toBeVisible();
  await dismissPointsRecap(page);
  await expect(page.getByRole('heading', { name: 'Harjutused' })).toBeVisible();
});

test('every parent section opens and closes through its public control', async ({ page }) => {
  await authenticateFamily(page);
  await authenticateParent(page);

  const expectedSections = [
    'Tähed ja karikad',
    'Nädala kokkuvõte',
    'Võrguühenduseta kasutus',
    'Harjutuste kogu',
    'Tegevused',
    'Pood',
    'Õppimise punktid',
    'Parool',
    'Teated ja reeglid',
    'Auhinnad',
    'Ajaloo haldamine'
  ];
  const toggles = page.locator('.parent-accordion-toggle');
  await expect(toggles).toHaveCount(expectedSections.length);

  for (const title of expectedSections) {
    await test.step(title, async () => {
      const toggle = toggles.filter({ hasText: title });
      await expect(toggle).toHaveCount(1);
      if (await toggle.getAttribute('aria-expanded') === 'true') await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(toggle.locator('xpath=following-sibling::*[1]')).toBeVisible();
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });
  }
});

for (const viewport of [
  { name: 'phone', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 }
]) {
  test(`core screens stay within the ${viewport.name} viewport`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await authenticateFamily(page);
    const runtimeProblems = recordRuntimeProblems(page);

    for (const route of ['/', '/kiur', '/kirsi', '/history?child=kiur']) {
      await test.step(route, async () => {
        await gotoStable(page, route);
        await assertVisiblePageContract(page);
        await assertResponsiveLayout(page);
      });
    }

    await authenticateParent(page);
    await assertVisiblePageContract(page);
    await assertResponsiveLayout(page);
    expect(runtimeProblems).toEqual([]);
  });
}
