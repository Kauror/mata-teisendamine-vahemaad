export const KIRSI_CATEGORIES = new Set([
  'Arvutamine 10 piires',
  'Arvutamine 20 piires',
  'Suurem või väiksem kuni 100',
  'Segaülesanded'
]);

export function isKirsiAttempt(category: string, learner?: string | null) {
  if (learner === 'kirsi') return true;
  if (learner === 'kiur') return false;
  return KIRSI_CATEGORIES.has(category);
}

export function learnerLabel(category: string, learner?: string | null) {
  return isKirsiAttempt(category, learner) ? 'Kirsi' : 'Kiur';
}
