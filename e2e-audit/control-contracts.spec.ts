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

  // Täna, Halda → Õppesisu and Seaded each list their own sections; Halda's
  // other lists (tasks, shop, exercises) are tabs, not sections.
  const views = [
    { path: '/vanem', sections: ['Tähed ja karikad', 'Nädala kokkuvõte'] },
    { path: '/vanem/halda?tab=sisu', sections: ['Loodusõpetuse õppetükid', 'Inglise keele sõnavara', 'Kaardimäng'] },
    { path: '/vanem/seaded', sections: ['Tähed harjutuste eest', 'Auhinnad', 'Teade laste avalehel', 'Võrguühenduseta kasutus', 'Ajaloo haldamine', 'Minu parool'] }
  ];

  for (const view of views) {
    await gotoStable(page, view.path);
    const toggles = page.locator('.parent-accordion-toggle');
    await expect(toggles).toHaveCount(view.sections.length);
    for (const title of view.sections) {
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
  }
  // The children's PIN is not changed from here.
  await expect(page.getByText(/PIN/)).toHaveCount(0);

  // Halda's four lists switch in place.
  await gotoStable(page, '/vanem/halda');
  for (const tab of ['Pood', 'Õppesisu', 'Harjutused', 'Tegevused']) {
    const chip = page.getByRole('button', { name: tab, exact: true });
    // A tap before hydration does nothing; retry until the tab is picked.
    await expect(async () => {
      await chip.click();
      await expect(chip).toHaveAttribute('aria-pressed', 'true', { timeout: 1000 });
    }).toPass({ timeout: 30_000 });
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
