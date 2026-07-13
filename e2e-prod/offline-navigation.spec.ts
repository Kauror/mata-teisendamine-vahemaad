import { test, expect, type Page } from '../e2e/test';

async function waitForController(page: Page) {
  await expect.poll(() => page.evaluate(async () => Boolean((await navigator.serviceWorker.getRegistration())?.active)), { timeout: 20_000 }).toBe(true);
  // A newly activated worker controls subsequent navigations, not necessarily
  // the page that registered it.
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)), { timeout: 20_000 }).toBe(true);
}

test('cached history-detail shell reloads while offline', async ({ page }) => {
  await page.goto('/history/offline');
  await waitForController(page);
  await page.context().setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Tulemust ei leitud' })).toBeVisible();
});

test('child dashboard shell reloads while offline after activation', async ({ page }) => {
  await page.goto('/kiur');
  await waitForController(page);
  await page.context().setOffline(true);
  await page.reload();
  await expect(page.locator('body')).toBeVisible();
  await expect(page).not.toHaveURL(/\/offline$/);
});
