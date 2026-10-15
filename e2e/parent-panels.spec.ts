import { expect, test, type Page } from './test';
import { authenticateFamily } from './auth';
import { navigateStable } from './navigation';

// PAR-10: the parent area used to send 11 requests on open and all 11 again
// after every change. Each panel now loads its own data when its section is
// first opened, so opening the page asks only for what is on screen: the
// approvals (dashboard, held rewards, task reviews) and the open "Tähed ja
// karikad" section (dashboard, monthly prize, streak freezes).

const ON_OPEN = [
  '/api/parent/dashboard',
  '/api/parent/held-rewards',
  '/api/parent/monthly-prize',
  '/api/parent/streak-freeze',
  '/api/parent/task-reviews'
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
  await expect(page.getByRole('button', { name: /Harjutuste kogu/ })).toBeVisible();
  await page.waitForTimeout(500);

  expect([...new Set(reads)].sort()).toEqual(ON_OPEN);
  // The two panels that read the dashboard share one request.
  expect(reads.filter((path) => path === '/api/parent/dashboard')).toHaveLength(1);

  // A closed section loads when opened, and keeps its count in the header.
  const shopLoaded = page.waitForResponse((response) => response.url().endsWith('/api/parent/store') && response.ok());
  const shop = page.getByRole('button', { name: /^Pood/ });
  await shop.click();
  await shopLoaded;
  await expect(shop).toHaveText(/\d+ (ese|eset)$/);
});
