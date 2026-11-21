import type { APIRequestContext } from '@playwright/test';
import { expect, test } from './test';
import { authenticateFamily } from './auth';
import { E2E_SCHOOL_FEED_TOKEN } from './config';
import { navigateStable } from './navigation';

// Minu pushes school news; each child sees only their own coming tests and
// homework, the parent sees everything. The feed is cleared afterwards so no
// other spec (or visual baseline) sees the card.

const tallinnDate = (offsetDays: number) => {
  const d = new Date(Date.now() + offsetDays * 86_400_000);
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Tallinn' }).format(d);
};

function push(request: APIRequestContext, children: Record<string, unknown[]>, recent: unknown[] = []) {
  return request.post('/api/school-feed', {
    headers: { authorization: `Bearer ${E2E_SCHOOL_FEED_TOKEN}` },
    data: { version: 1, generatedAt: new Date().toISOString(), children, parent: { recent, events: [] } }
  });
}

test.afterEach(async ({ request }) => {
  await push(request, { kiur: [], kirsi: [] });
});

test('a coming test shows on the child page, only for that child, and in the parent area', async ({ page, request }) => {
  const res = await push(request, {
    kiur: [{ date: tallinnDate(1), subject: 'Eesti keel', type: 'Kontrolltöö', kind: 'test', text: 'Poolitamine ja lühendid' }],
    kirsi: []
  }, [{ child: 'kiur', date: tallinnDate(-1), kind: 'grade', subject: 'Matemaatika', value: '5', text: '' }]);
  expect(res.status()).toBe(200);

  await authenticateFamily(page);
  await navigateStable(page, '/kiur');
  const card = page.getByRole('region', { name: 'Koolis tulemas' });
  await expect(card).toContainText('Homme on eesti keele kontrolltöö.');
  await expect(card).toContainText('Teema: Poolitamine ja lühendid');

  await navigateStable(page, '/kirsi');
  await expect(page.getByRole('region', { name: 'Koolis tulemas' })).toHaveCount(0);

  await navigateStable(page, '/vanem');
  const password = page.getByLabel('Sisesta parool');
  await password.click();
  await password.pressSequentially('e2e-parent-password');
  await page.getByRole('button', { name: 'Sisene' }).click();
  await expect(page.getByRole('region', { name: 'Vajab sinu otsust' })).toBeVisible();
  const school = page.getByRole('button', { name: /^Kool Kontrolltööd/ });
  // The hub is server-rendered: a click before hydration does nothing, so
  // click until the section says it is open.
  await expect(async () => {
    if (await school.getAttribute('aria-expanded') !== 'true') await school.click();
    await expect(school).toHaveAttribute('aria-expanded', 'true', { timeout: 1_000 });
  }).toPass();
  await expect(page.getByText('Homme on eesti keele kontrolltöö.')).toBeVisible();
  await expect(page.getByText(/Kiur · Hinne: Matemaatika 5/)).toBeVisible();
});

test('the feed refuses a push without the token', async ({ request }) => {
  const res = await request.post('/api/school-feed', { data: { version: 1 } });
  expect(res.status()).toBe(401);
});
