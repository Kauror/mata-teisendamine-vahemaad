import { test, expect } from '@playwright/test';

// The family PIN gate is the entry point for every child/parent surface. These
// checks prove the server boots, middleware redirects unauthenticated traffic,
// and the access API round-trip works in a real browser.

test('an unauthenticated visit is redirected to the PIN gate', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/access$/);
  await expect(page.getByRole('heading', { name: 'Sisesta PIN' })).toBeVisible();
});

test('a protected child route also redirects to the PIN gate', async ({ page }) => {
  await page.goto('/kiur');
  await expect(page).toHaveURL(/\/access$/);
});

test('a wrong PIN shows an error and stays on the gate', async ({ page }) => {
  await page.goto('/access');
  // WebKit occasionally reports fill() complete before React has processed the
  // controlled input's input events. Real keystrokes exercise the same path a
  // child uses and make the enabled-state assertion cross-browser reliable.
  const pin = page.locator('form input');
  await pin.click();
  await pin.pressSequentially('0000');
  await expect(page.getByRole('button', { name: 'Sisene' })).toBeEnabled();
  await page.getByRole('button', { name: 'Sisene' }).click();
  await expect(page.locator('.error')).toBeVisible();
  await expect(page).toHaveURL(/\/access$/);
});
