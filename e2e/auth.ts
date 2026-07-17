import { expect, type Page } from './test';

export async function authenticateFamily(page: Page) {
  await page.goto('/access');
  const input = page.getByLabel('Sisesta pere parool');
  await input.click();
  await input.pressSequentially('e2e-family-passphrase');
  await expect(page.getByRole('button', { name: 'Sisene' })).toBeEnabled();
  await page.getByRole('button', { name: 'Sisene' }).click();
  await expect(page.getByRole('link', { name: 'Ava harjutused' }).first()).toBeVisible();
}
