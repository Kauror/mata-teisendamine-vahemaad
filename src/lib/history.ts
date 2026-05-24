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


export function scorePercent(score: number, questionCount: number) {
  if (!Number.isFinite(score) || !Number.isFinite(questionCount) || questionCount <= 0) return 0;
  return Math.round((score / questionCount) * 100);
}

export function isTodayIso(createdAt: string) {
  const d = new Date(createdAt);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

export function subjectLabel(subject?: string | null) {
  return subject || 'Matemaatika';
}


export type AttemptLike = { createdAt: string };

export function dayLabel(createdAt: string) {
  const d = new Date(createdAt);
  const now = new Date();
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  if (d.toDateString() == now.toDateString()) return 'Täna';
  if (d.toDateString() == y.toDateString()) return 'Eile';
  return d.toLocaleDateString('et-EE');
}

export function groupAttemptsByDay<T extends AttemptLike>(items: T[]) {
  const map = new Map<string, T[]>();
  items.forEach((item) => {
    const key = dayLabel(item.createdAt);
    if (!map.has(key)) map.set(key, []);
    map.get(key)?.push(item);
  });
  return map;
}
