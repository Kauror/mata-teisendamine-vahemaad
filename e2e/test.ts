import { expect, test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page, browserName }, use) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      const message = error.stack ?? error.message;
      // WebKit surfaces caught same-origin fetch cancellations (including
      // navigation and Next dev hot-update aborts) as page errors.
      const caughtWebKitFetchCancellation = browserName === 'webkit'
        && /^Fetch API cannot load http:\/\/localhost:\d+\/\S+ due to access control checks\./.test(message);
      if (!caughtWebKitFetchCancellation) errors.push(message);
    });
    await use(page);
    expect(errors, 'Uncaught browser page errors').toEqual([]);
  }
});

export { expect, type Page } from '@playwright/test';
