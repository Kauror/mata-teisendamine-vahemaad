import { expect, test } from './test';
import { authenticateFamily } from './auth';
import { navigateStable } from './navigation';

// Eluka demo: the pet room preview lives in Seaded until the pet goes live.
// Only the parent can open it; it draws two rooms and saves nothing.

test('the Eluka demo is parent-only and draws both rooms', async ({ page }) => {
  const errors: string[] = [];
  // Dev-server reload noise (hot-update, chunk loads) is not the demo's.
  page.on('pageerror', (error) => { if (!/_next|webpack|ChunkLoadError|__nextjs/.test(error.message)) errors.push(error.message); });
  await authenticateFamily(page);

  // Without a parent session the page only points to the parent area.
  await navigateStable(page, '/vanem/eluka-demo');
  await expect(page.getByRole('link', { name: 'Ava vanema ala' })).toBeVisible();
  await expect(page.locator('.eluka-demo')).toHaveCount(0);

  await navigateStable(page, '/vanem/seaded');
  const password = page.getByLabel('Sisesta parool');
  await password.click();
  await password.pressSequentially('e2e-parent-password');
  await page.getByRole('button', { name: 'Sisene' }).click();
  await expect(page.getByRole('heading', { name: 'Seaded' })).toBeVisible();

  // A click before hydration does nothing on a cold dev server: retry until it opens.
  const toggle = page.getByRole('button', { name: /^Eluka demo/ });
  await expect(async () => {
    if ((await toggle.getAttribute('aria-expanded')) !== 'true') await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true', { timeout: 1000 });
  }).toPass({ timeout: 20000 });
  await page.getByRole('link', { name: 'Ava Eluka demo' }).click();
  await expect(page.getByRole('heading', { name: 'Eluka demo' })).toBeVisible();

  // Two status bars + two rooms + two baby status bars.
  await expect(page.locator('.eluka-demo canvas')).toHaveCount(6);
  await expect(page.getByRole('button', { name: 'Möödub 8 tundi' })).toBeVisible();
  await page.getByRole('button', { name: 'Möödub 8 tundi' }).click();
  await expect(page.locator('.eluka-demo .pcard').first()).toContainText('Sind polnud 8 tundi');
  expect(errors).toEqual([]);
});
