import { expect, type Page } from './test';

// Signing in is not enough to start a runner that produces a countable attempt.
// Until the device has pulled its catalogue grant, the server has no grant to
// match an uploaded attempt against, so it accepts it but withholds it with
// reasonCode 'unknown_catalogue_grant' — it earns nothing and, by design, does
// not feed the mistake pool. Any test that cares what happens to an attempt
// after it syncs has to wait for the grant first.
export async function authenticateFamilyWithCatalogue(page: Page) {
  await authenticateFamily(page);
  await expect.poll(() => page.evaluate(() => new Promise<boolean>((resolve) => {
    const open = indexedDB.open('harjutaja-offline');
    open.onerror = () => resolve(false);
    open.onsuccess = () => {
      if (!open.result.objectStoreNames.contains('catalogues') || !open.result.objectStoreNames.contains('catalogueGrants')) return resolve(false);
      const transaction = open.result.transaction(['catalogues', 'catalogueGrants']);
      const catalogue = transaction.objectStore('catalogues').get('kiur');
      const grant = transaction.objectStore('catalogueGrants').get('kiur');
      transaction.oncomplete = () => resolve(Boolean(catalogue.result && grant.result));
      transaction.onerror = () => resolve(false);
    };
  })), { timeout: 20_000 }).toBe(true);
}

export async function authenticateFamily(page: Page) {
  await page.goto('/access');
  const input = page.getByLabel('Sisesta pere parool');
  await input.click();
  await input.pressSequentially('e2e-family-passphrase');
  await expect(page.getByRole('button', { name: 'Sisene' })).toBeEnabled();
  await page.getByRole('button', { name: 'Sisene' }).click();
  await expect(page.getByRole('link', { name: 'Ava harjutused' }).first()).toBeVisible();
}
