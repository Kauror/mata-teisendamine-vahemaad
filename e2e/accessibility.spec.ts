import { expect, test, type Page } from './test';

test.describe.configure({ mode: 'serial' });

async function authenticate(page: Page) {
  await page.goto('/access');
  const input = page.locator('form input');
  await input.click();
  await input.pressSequentially('e2e-family-passphrase');
  await expect(page.getByRole('button', { name: 'Sisene' })).toBeEnabled();
  await page.getByRole('button', { name: 'Sisene' }).click();
  await expect.poll(() => new URL(page.url()).pathname).toBe('/');
}

test.beforeEach(async ({ page }) => authenticate(page));

test('dashboard has semantic independent links with keyboard focus and mobile touch targets', async ({ page }) => {
  await expect(page.locator('.child-dashboard-card [role="button"]')).toHaveCount(0);
  await expect(page.locator('a button, button a, a a, button button')).toHaveCount(0);

  const primary = page.getByRole('link', { name: 'Ava harjutused' }).first();
  await primary.focus();
  await expect(primary).toBeFocused();
  expect(await primary.evaluate((node) => getComputedStyle(node).outlineStyle)).not.toBe('none');
  await primary.press('Enter');
  await expect(page).toHaveURL(/\/kiur$/);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const primaryBox = await page.getByRole('link', { name: 'Ava harjutused' }).first().boundingBox();
  const historyBox = await page.getByRole('link', { name: 'Vaata Kiur ajalugu' }).boundingBox();
  expect(primaryBox?.height).toBeGreaterThanOrEqual(52);
  expect(historyBox?.height).toBeGreaterThanOrEqual(44);
});

test('child-specific history selects the child and contains no destructive controls', async ({ page }) => {
  await page.getByRole('link', { name: 'Vaata Kiur ajalugu' }).click();
  await expect(page).toHaveURL(/\/history\?child=kiur$/);
  await expect(page.getByRole('button', { name: 'Kiur', exact: true })).toHaveClass(/active/);
  await expect(page.locator('.delete-button,.delete-text-button,.history-delete-all-link')).toHaveCount(0);
});

test('parent controls are keyboard-accessible after parent login', async ({ page }) => {
  await page.getByRole('link', { name: 'Lapsevanema ala' }).click();
  const password = page.getByLabel('Sisesta parool');
  await password.click();
  await password.pressSequentially('e2e-parent-password');
  await expect(password).toHaveValue('e2e-parent-password');
  const dashboardLoaded = page.waitForResponse((response) => response.url().endsWith('/api/parent/dashboard') && response.ok());
  await page.getByRole('button', { name: 'Sisene' }).click();
  await dashboardLoaded;
  const controls = page.getByRole('button', { name: /Tähed ja karikad/ });
  await expect(controls).toBeVisible();
  const initiallyExpanded = await controls.getAttribute('aria-expanded');
  await controls.focus();
  await controls.press('Enter');
  await expect(controls).toHaveAttribute('aria-expanded', initiallyExpanded === 'true' ? 'false' : 'true');
  await controls.press('Enter');
  await expect(controls).toHaveAttribute('aria-expanded', initiallyExpanded ?? 'false');
});
