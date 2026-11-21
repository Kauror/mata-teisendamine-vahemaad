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

test('a phone bound to Kiur opens Kiur when Kirsi is tapped, and the parent sees it in the list', async ({ page }) => {
  await authenticateFamily(page);
  await openDevicePanel(page);
  await page.getByRole('button', { name: 'Kiuri telefon' }).click();
  const list = page.locator('.device-binding-list');
  await expect(list).toContainText('Kiuri seade');
  await expect(list).toContainText('(see seade)');
  await expect(list).toContainText(/Kiur ✓ \d/);
  await expect(list).toContainText('Kirsi: pole seotud');

  // A child's phone has no parent session: sign the parent out (the binding stays).
  await page.context().clearCookies({ name: 'parent_session' });
  await page.context().clearCookies({ name: 'harjutaja_peek' });
  await navigateStable(page, '/');
  await page.getByRole('link', { name: 'Kirsi', exact: true }).click();
  await expect(page).toHaveURL(/\/kiur$/, { timeout: 20_000 });

  // Removing it from the list ends the binding.
  await openDevicePanel(page);
  const thisRow = list.locator('li', { hasText: '(see seade)' });
  await thisRow.getByRole('button', { name: /^Eemalda/ }).click();
  await expect(list.locator('li', { hasText: '(see seade)' })).toHaveCount(0);
  await expect(page.locator('.device-binding-card')).toContainText('See seade praegu: Sidumata');
});
