import { expect, type Page } from '../e2e/test';

export async function gotoStable(page: Page, route: string, waitUntil: 'load' | 'domcontentloaded' = 'domcontentloaded') {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await page.goto(route, { waitUntil });
    } catch (error) {
      lastError = error;
      const interrupted = error instanceof Error && error.message.includes('is interrupted by another navigation');
      if (!interrupted) throw error;
      await page.waitForTimeout(100);
    }
  }
  throw lastError;
}

export async function authenticateFamily(page: Page) {
  await page.goto('/access');
  const input = page.getByLabel('Sisesta pere parool');
  await input.fill('e2e-family-passphrase');
  await page.getByRole('button', { name: 'Sisene' }).click();
  await expect(page.getByRole('link', { name: 'Ava harjutused' }).first()).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
}

export async function waitForCatalogue(page: Page) {
  await expect.poll(() => page.evaluate(() => new Promise<boolean>((resolve) => {
    const open = indexedDB.open('harjutaja-offline');
    open.onerror = () => resolve(false);
    open.onsuccess = () => {
      if (!open.result.objectStoreNames.contains('catalogues')) return resolve(false);
      const transaction = open.result.transaction('catalogues');
      const kiur = transaction.objectStore('catalogues').get('kiur');
      const kirsi = transaction.objectStore('catalogues').get('kirsi');
      transaction.oncomplete = () => resolve(Boolean(kiur.result && kirsi.result));
      transaction.onerror = () => resolve(false);
    };
  })), { timeout: 20_000 }).toBe(true);
}

export async function authenticateFamilyWithCatalogue(page: Page) {
  await authenticateFamily(page);
  await waitForCatalogue(page);
}

export async function authenticateParent(page: Page) {
  await gotoStable(page, '/vanem');
  const password = page.getByLabel('Sisesta parool');
  if (await password.count()) {
    // WebKit can expose the server-rendered form just before React has attached
    // its submit handler. Use real keystrokes after a short hydration window.
    await page.waitForTimeout(1_000);
    await password.click();
    await password.pressSequentially('e2e-parent-password');
    const dashboardLoaded = page.waitForResponse(
      (response) => response.url().endsWith('/api/parent/dashboard') && response.ok()
    );
    await page.getByRole('button', { name: 'Sisene' }).click();
    await dashboardLoaded;
  }
  await expect(page.getByRole('heading', { name: 'Lapsevanema ala' })).toBeVisible();
}

export async function dismissPointsRecap(page: Page) {
  const recap = page.locator('.task-modal-backdrop[aria-labelledby="points-recap-title"]');
  await recap.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => {});
  if (await recap.count()) {
    await recap.locator('button.next-button').click();
    await expect(recap).toHaveCount(0);
  }
}

export function recordRuntimeProblems(page: Page) {
  const problems: string[] = [];
  page.on('console', (message) => {
    const text = message.text();
    const caughtWebKitFetchCancellation = /^Fetch API cannot load http:\/\/localhost:\d+\/\S+ due to access control checks\./.test(text);
    if (message.type() === 'error' && !caughtWebKitFetchCancellation) problems.push(`console: ${text}`);
  });
  page.on('requestfailed', (request) => {
    const reason = request.failure()?.errorText ?? 'unknown failure';
    if (reason !== 'net::ERR_ABORTED' && reason !== 'Load request cancelled') {
      problems.push(`request: ${request.method()} ${request.url()} — ${reason}`);
    }
  });
  page.on('response', (response) => {
    if (response.status() >= 500) problems.push(`response: ${response.status()} ${response.url()}`);
  });
  return problems;
}

export async function assertVisiblePageContract(page: Page) {
  await expect(page.locator('main')).toBeVisible();

  const visibleText = await page.locator('body').innerText();
  expect(visibleText).not.toMatch(/\uFFFD|Ã.|Â.|â€|ðŸ/);

  const structuralProblems = await page.evaluate(() => {
    const duplicateIds = [...document.querySelectorAll<HTMLElement>('[id]')]
      .map((element) => element.id)
      .filter((id, index, ids) => id && ids.indexOf(id) !== index);
    const brokenImages = [...document.images]
      .filter((image) => image.complete && image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src || image.alt);
    const namelessControls = [...document.querySelectorAll<HTMLElement>('a,button,input,select,textarea')]
      .filter((element) => {
        if (element instanceof HTMLInputElement && element.type === 'hidden') return false;
        const text = element.textContent?.trim() ?? '';
        const ariaLabel = element.getAttribute('aria-label')?.trim() ?? '';
        const labelledBy = element.getAttribute('aria-labelledby')?.trim() ?? '';
        const title = element.getAttribute('title')?.trim() ?? '';
        const labels = element instanceof HTMLInputElement
          || element instanceof HTMLSelectElement
          || element instanceof HTMLTextAreaElement
          ? element.labels?.length ?? 0
          : 0;
        const imageAlt = element.querySelector('img')?.alt.trim() ?? '';
        return !text && !ariaLabel && !labelledBy && !title && labels === 0 && !imageAlt;
      })
      .map((element) => `${element.tagName.toLowerCase()}.${element.className}`);
    const emptyStatuses = [...document.querySelectorAll<HTMLElement>('[role="status"]')]
      .filter((element) => !element.textContent?.trim())
      .map((element) => element.className || element.tagName.toLowerCase());

    return {
      duplicateIds: [...new Set(duplicateIds)],
      brokenImages,
      namelessControls,
      emptyStatuses
    };
  });

  expect(structuralProblems).toEqual({
    duplicateIds: [],
    brokenImages: [],
    namelessControls: [],
    emptyStatuses: []
  });
}

export async function assertResponsiveLayout(page: Page) {
  const problems = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const outsideControls = [...document.querySelectorAll<HTMLElement>('a,button,input,select,textarea')]
      .filter((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        if (style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || rect.height === 0) return false;
        return rect.left < -1 || rect.right > viewportWidth + 1;
      })
      .map((element) => element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80) || element.tagName);

    return {
      viewportWidth,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      outsideControls
    };
  });

  expect(problems.documentWidth).toBeLessThanOrEqual(problems.viewportWidth + 1);
  expect(problems.bodyWidth).toBeLessThanOrEqual(problems.viewportWidth + 1);
  expect(problems.outsideControls).toEqual([]);
}
