import { expect, test } from '../e2e/test';
import {
  assertVisiblePageContract,
  authenticateFamilyWithCatalogue,
  gotoStable,
  recordRuntimeProblems
} from './helpers';

const ROUTES = [
  { name: 'home', path: '/', visible: /Ava harjutused/ },
  { name: 'Kiur dashboard', path: '/kiur', visible: /Harjutused/ },
  { name: 'Kirsi dashboard', path: '/kirsi', visible: /Harjutused/ },
  { name: 'history', path: '/history?child=kiur', visible: /Ajalugu/ },
  { name: 'offline fallback', path: '/offline', visible: /Võrguühendus puudub/ },
  { name: 'Kiur shop', path: '/kiur/pood', visible: /Pood/ },
  { name: 'Kirsi shop', path: '/kirsi/pood', visible: /Pood/ },
  { name: 'Kiur reading runner', path: '/kiur/lugemine', visible: /Lugemine|Harjutus/ },
  { name: 'Kirsi picture-word runner', path: '/kirsi/lugemine/pilt-ja-sona', visible: /Pilt ja sõna|Harjutus/ },
  { name: 'Kirsi first-sound runner', path: '/kirsi/lugemine/esimene-haalik', visible: /Esimene häälik|Harjutus/ },
  { name: 'Kiur English sprint', path: '/kiur/inglise-keel/sprint', visible: /Sprint/ },
  { name: 'Kiur science entry', path: '/kiur/loodusopetus', visible: /Loodusõpetus/ }
] as const;

for (const route of ROUTES) {
  test(`${route.name} satisfies the visible route contract`, async ({ page }) => {
    await authenticateFamilyWithCatalogue(page);
    const runtimeProblems = recordRuntimeProblems(page);
    const response = await gotoStable(page, route.path);

    expect(response?.status() ?? 200).toBeLessThan(400);
    await expect(page.getByText(route.visible).first()).toBeVisible();
    await assertVisiblePageContract(page);
    expect(runtimeProblems).toEqual([]);
  });
}

for (const redirect of [
  { from: '/stats', to: /\/history$/ },
  { from: '/kiur/inglise-keel', to: /\/kiur$/ },
  { from: '/kirsi/lugemine', to: /\/kirsi$/ }
]) {
  test(`${redirect.from} redirects to its supported screen`, async ({ page }) => {
    await authenticateFamilyWithCatalogue(page);
    await gotoStable(page, redirect.from, 'load');
    await expect(page).toHaveURL(redirect.to);
    await assertVisiblePageContract(page);
  });
}
