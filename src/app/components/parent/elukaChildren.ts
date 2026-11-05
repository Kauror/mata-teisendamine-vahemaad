// The two children in the Eluka demo, and how their pet page is titled.
export type ElukaChild = { id: 'kiur' | 'kirsi'; name: string; title: string };

export const ELUKA_CHILDREN: ElukaChild[] = [
  { id: 'kiur', name: 'Kiur', title: 'Kiuri muna' },
  { id: 'kirsi', name: 'Kirsi', title: 'Kirsi muna' }
];

export function elukaChild(id: string): ElukaChild | null {
  return ELUKA_CHILDREN.find((child) => child.id === id) ?? null;
}
