// The parent area's three views and Halda's lists. Kept apart from the hub so
// the server pages can read a tab from the URL without importing client code.

export type ParentView = 'tana' | 'halda' | 'seaded';
export type ParentHaldaTab = 'tegevused' | 'pood' | 'sisu' | 'harjutused';

export const PARENT_HALDA_TABS: ReadonlyArray<{ id: ParentHaldaTab; label: string }> = [
  { id: 'tegevused', label: 'Tegevused' },
  { id: 'pood', label: 'Pood' },
  { id: 'sisu', label: 'Õppesisu' },
  { id: 'harjutused', label: 'Harjutused' }
];

export function parseHaldaTab(value: unknown): ParentHaldaTab | undefined {
  return PARENT_HALDA_TABS.some((tab) => tab.id === value) ? value as ParentHaldaTab : undefined;
}
