import { expect, test, type Page } from './test';
import { authenticateFamily } from './auth';
import { navigateStable } from './navigation';

// Kaur 21.11: on a phone bound to Kiur, tapping Kirsi's card on the home page
// still opened Kirsi's page (an in-app tap is a background fetch, which was
// not redirected), and the parent could not see which phones were bound.

async function openDevicePanel(page: Page) {
  await navigateStable(page, '/vanem/seaded');
  const password = page.getByLabel('Sisesta parool');
  if (await password.isVisible().catch(() => false)) {
    await password.click();
    await password.pressSequentially('e2e-parent-password');
    await page.getByRole('button', { name: 'Sisene' }).click();
  }
  const section = page.getByRole('button', { name: /^See seade/ });
  // Server-rendered: a click before hydration does nothing.
  await expect(async () => {
    if (await section.getAttribute('aria-expanded') !== 'true') await section.click();
    await expect(section).toHaveAttribute('aria-expanded', 'true', { timeout: 1_000 });
  }).toPass();
}

test('a phone bound to Kiur stops at Kirsi, a parent can switch it, and the parent sees it in the list', async ({ page }) => {
  await authenticateFamily(page);
  await openDevicePanel(page);
  await page.getByRole('button', { name: 'Kiuri telefon' }).click();
  const list = page.locator('.device-binding-list');
  await expect(list).toContainText('Kiuri seade');
  await expect(list).toContainText('(see seade)');
  await expect(list).toContainText(/Kiur ✓ \d/);

  // A child's phone has no parent session: sign the parent out (the binding stays).
  await page.context().clearCookies({ name: 'parent_session' });
  await page.context().clearCookies({ name: 'harjutaja_peek' });
  await navigateStable(page, '/');
  await page.getByRole('link', { name: 'Kirsi', exact: true }).click();
  // Not straight into Kiur's page: a stop page says whose device this is.
  await expect(page).toHaveURL(/\/vale-seade\?laps=kirsi$/, { timeout: 20_000 });
  await expect(page.getByRole('heading', { name: 'See on Kiuri seade' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ma olen Kiur →' })).toHaveAttribute('href', '/kiur');

  // A wrong parent password changes nothing; the right one hands the device to Kirsi.
  await page.getByRole('button', { name: 'Vaheta seadet (vanema parool)' }).click();
  const password = page.getByLabel('Vanema parool');
  await password.fill('vale-parool');
  await page.getByRole('button', { name: 'Seo see seade lapsele Kirsi' }).click();
  await expect(page.getByText('Vale parool.')).toBeVisible();
  await password.fill('e2e-parent-password');
  await page.getByRole('button', { name: 'Seo see seade lapsele Kirsi' }).click();
  await expect(page).toHaveURL(/\/kirsi$/, { timeout: 20_000 });
  // and now Kiur's page is the one that stops.
  await page.goto('/kiur');
  await expect(page).toHaveURL(/\/vale-seade\?laps=kiur$/);
  await expect(page.getByRole('heading', { name: 'See on Kirsi seade' })).toBeVisible();

  // Removing it from the list ends the binding.
  await openDevicePanel(page);
  const thisRow = list.locator('li', { hasText: '(see seade)' });
  await thisRow.getByRole('button', { name: /^Eemalda/ }).click();
  await expect(list.locator('li', { hasText: '(see seade)' })).toHaveCount(0);
  await expect(page.locator('.device-binding-card')).toContainText('See seade praegu: Sidumata');
});
