import { expect, test, type Page } from './test';
import { authenticateFamily } from './auth';
import { navigateStable } from './navigation';

// PAR-10: the parent area used to send 11 requests on open and all 11 again
// after every change. Each panel now loads its own data when its section is
// first shown, so opening Täna asks only for what is on screen: the
// approvals (dashboard, held rewards, task reviews), the children's day
// (today) and the month's trophy line (monthly prize).

const ON_OPEN = [
  '/api/parent/dashboard',
  '/api/parent/held-rewards',
  '/api/parent/monthly-prize',
  '/api/parent/task-reviews',
  '/api/parent/today'
];

function recordParentReads(page: Page) {
  const paths: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (request.method() === 'GET' && url.pathname.startsWith('/api/parent/')) paths.push(url.pathname);
  });
  return paths;
}

test('opening the parent area loads only the visible panels', async ({ page }) => {
  await authenticateFamily(page);
  await navigateStable(page, '/vanem');
  const reads = recordParentReads(page);
  const password = page.getByLabel('Sisesta parool');
  await password.click();
  await password.pressSequentially('e2e-parent-password');
  const loaded = Promise.all(ON_OPEN.map((path) => page.waitForResponse((response) => response.url().endsWith(path) && response.ok())));
  await page.getByRole('button', { name: 'Sisene' }).click();
  await loaded;
  await expect(page.getByRole('region', { name: 'Vajab sinu otsust' })).toBeVisible();
  await page.waitForTimeout(500);

  expect([...new Set(reads)].sort()).toEqual(ON_OPEN);
  expect(reads.filter((path) => path === '/api/parent/dashboard')).toHaveLength(1);

  // A closed section loads when opened: "Tähed ja karikad" reads the freezes.
  const freezeLoaded = page.waitForResponse((response) => response.url().endsWith('/api/parent/streak-freeze') && response.ok());
  await page.getByRole('button', { name: /^Tähed ja karikad/ }).click();
  await freezeLoaded;

  // Halda → Pood loads the shop only once its tab is picked.
  await page.getByRole('link', { name: 'Halda' }).click();
  await expect(page.getByRole('heading', { name: 'Halda' })).toBeVisible();
  const shopLoaded = page.waitForResponse((response) => response.url().endsWith('/api/parent/store') && response.ok());
  await page.getByRole('button', { name: 'Pood', exact: true }).click();
  await shopLoaded;
  await expect(page.getByRole('region', { name: 'Poe esemed' })).toBeVisible();
});
