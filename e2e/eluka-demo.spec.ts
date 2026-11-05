import { expect, test, type Page } from './test';
import { authenticateFamily } from './auth';
import { navigateStable } from './navigation';

// Eluka demo: the pet page as each child will see it, in Seaded until the pet
// goes live. Only the parent can open it; it saves the pet in this browser and
// only reads the child's exercise history.

// A phone, as the children use it.
test.use({ viewport: { width: 390, height: 844 } });

async function signInAsParent(page: Page) {
  await navigateStable(page, '/vanem/seaded');
  const password = page.getByLabel('Sisesta parool');
  await password.click();
  await password.pressSequentially('e2e-parent-password');
  await page.getByRole('button', { name: 'Sisene' }).click();
  await expect(page.getByRole('heading', { name: 'Seaded' })).toBeVisible();
}

test('the Eluka demo opens each child pet page for the parent only', async ({ page }) => {
  const errors: string[] = [];
  // Dev-server reload noise (hot-update, chunk loads) is not the demo's.
  page.on('pageerror', (error) => { if (!/_next|webpack|ChunkLoadError|__nextjs/.test(error.message)) errors.push(error.message); });
  await authenticateFamily(page);

  // Without a parent session the pages only point to the parent area.
  for (const path of ['/vanem/eluka-demo', '/vanem/eluka-demo/kiur']) {
    await navigateStable(page, path);
    await expect(page.getByRole('link', { name: 'Ava vanema ala' })).toBeVisible();
    await expect(page.locator('.eluka-demo')).toHaveCount(0);
  }

  // The child's history: one old exercise, then a new good one appears.
  let attempts = [{ id: 7, score: 4, questionCount: 10 }];
  const historyReads: string[] = [];
  await page.route('**/api/parent/history?*', async (route) => {
    historyReads.push(route.request().method());
    await route.fulfill({ json: { items: attempts.map((a) => ({ ...a, createdAt: '2026-11-05T08:00:00.000Z', learner: 'kiur' })), nextCursor: null } });
  });

  await signInAsParent(page);
  // A click before hydration does nothing on a cold dev server: retry until it opens.
  const toggle = page.getByRole('button', { name: /^Eluka demo/ });
  await expect(async () => {
    if ((await toggle.getAttribute('aria-expanded')) !== 'true') await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true', { timeout: 1000 });
  }).toPass({ timeout: 20000 });
  await page.getByRole('link', { name: 'Ava Eluka demo' }).click();
  await expect(page.getByRole('heading', { name: 'Eluka demo' })).toBeVisible();

  await page.getByRole('link', { name: 'Kiur', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Kiuri muna' })).toBeVisible();
  // One child: the status bar and the room.
  await expect(page.locator('.eluka-demo canvas')).toHaveCount(2);
  // The status bar and the room fill the screen like the child's own page: as wide as each other,
  // filling a phone screen edge to edge.
  const screen = page.viewportSize()!;
  const hudCanvas = page.getByLabel('Näidikud');
  const roomCanvas = page.getByLabel('Kiuri tuba');
  const [hud, room] = await Promise.all([hudCanvas.boundingBox(), roomCanvas.boundingBox()]).then((b) => b.map((x) => x!));
  expect(Math.abs(hud.width - room.width)).toBeLessThan(1);
  expect(room.width).toBeLessThanOrEqual(screen.width + 1);
  expect(hud.height + room.height).toBeLessThanOrEqual(screen.height + 1);
  expect(room.width).toBeGreaterThan(screen.width - 1);
  expect(hud.height + room.height).toBeGreaterThan(screen.height - 1);
  // The status bar is at the bottom, clear of the phone's top edge.
  expect(hud.y).toBeGreaterThan(room.y + room.height - 1);
  // The room is drawn at 75 %: a wider view than the old 36 cells and extra floor below the 80 rows.
  const [cols, rows] = await roomCanvas.evaluate((c) => [(c as HTMLCanvasElement).width / 4, (c as HTMLCanvasElement).height / 4]);
  expect(cols).toBeGreaterThanOrEqual(48);
  expect(rows).toBeGreaterThan(80);
  // The way out of the game sits just above the status bar.
  const exit = page.locator('.eluka-demo .pexit');
  await expect(exit).toHaveText('← Tagasi');
  await expect(exit).toHaveAttribute('href', '/vanem/eluka-demo');
  // Only plain numbers: the pet state also holds canvases and page elements.
  const day = () => page.evaluate(() => {
    const st = (window as unknown as { __pet: { state: Record<string, { hours: number; tarkus: number; seenId: number | null }> } }).__pet.state.kiur;
    return { hours: st.hours, tarkus: st.tarkus, seenId: st.seenId };
  });
  await expect.poll(async () => (await day()).seenId).toBe(7);

  // A new good exercise raises Tarkus and says so.
  const before = (await day()).tarkus;
  attempts = [{ id: 8, score: 9, questionCount: 10 }, ...attempts];
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await expect(page.locator('.eluka-demo .ptoast')).toContainText('Kiur tegi 1 harjutuse');
  expect((await day()).tarkus).toBeGreaterThan(before + 15);

  // The parent's test buttons: skip 8 hours shows the away card.
  await page.getByText('Testimise nupud (ainult demos)').click();
  await page.getByRole('button', { name: 'Keri 8 tundi edasi' }).click();
  await expect(page.locator('.eluka-demo .pcard')).toContainText('Sind polnud 8 tundi');
  const hours = (await day()).hours;

  // The pet is kept in this browser: a reload brings the same egg back.
  await page.reload();
  await expect(page.locator('.eluka-demo canvas')).toHaveCount(2);
  await expect.poll(async () => (await day()).hours).toBeGreaterThanOrEqual(hours);
  expect((await day()).seenId).toBe(8);
  expect(historyReads.every((method) => method === 'GET')).toBe(true);

  await navigateStable(page, '/vanem/eluka-demo/kirsi');
  await expect(page.getByRole('heading', { name: 'Kirsi muna' })).toBeVisible();
  await expect(page.locator('.eluka-demo canvas')).toHaveCount(2);
  await page.locator('.eluka-demo .pexit').click();
  await expect(page.getByRole('heading', { name: 'Eluka demo' })).toBeVisible();
  expect(errors).toEqual([]);
});
