import type { Page } from './test';

export async function navigateStable(page: Page, route: string) {
  const expected = new URL(route, 'http://localhost');
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await page.goto(route);
    } catch (error) {
      const isDevReloadRace = error instanceof Error && error.message.includes('is interrupted by another navigation');
      if (!isDevReloadRace) throw error;
    }
    const current = new URL(page.url());
    if (current.pathname === expected.pathname && current.search === expected.search) return;
  }
  throw new Error(`Could not navigate to ${route}; stopped at ${page.url()}`);
}
