export const KIRSI_CATEGORIES = new Set([
  'Arvutamine 10 piires',
  'Arvutamine 20 piires',
  'Suurem või väiksem kuni 100',
  'Segaülesanded',
  'Lugemine - pilt ja sõna',
  'Lugemine - esimene häälik'
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

export function relativeDateTimeLabel(createdAt: string) {
  const d = new Date(createdAt);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const time = d.toLocaleTimeString('et-EE', { hour: '2-digit', minute: '2-digit' });

  if (d.toDateString() === now.toDateString()) return `täna ${time}`;
  if (d.toDateString() === yesterday.toDateString()) return `eile ${time}`;
  return `${d.toLocaleDateString('et-EE', { day: '2-digit', month: '2-digit' })} ${time}`;
}

export function subjectLabel(subject?: string | null) {
  if (subject === 'kordamine') return 'Kordamine';
  if (!subject || subject === 'matemaatika') return 'Matemaatika';
  if (subject === 'inglise-keel') return 'Inglise keel';
  if (subject === 'lugemine') return 'Lugemine';
  if (subject === 'loodusopetus') return 'Loodusõpetus';
  return subject;
}

export function compactTopicLabel(topic?: string | null, category?: string | null) {
  if (topic === 'kordamine' || category === 'Kordamine') return 'Kordamine';
  if (topic === 'harjutamine') return 'Harjutamine';
  if (topic === 'sprint') return 'Sprint';
  if (topic === 'loe-ja-vasta') return 'Loe ja vasta';
  if (topic === 'pilt-ja-sona') return 'Pilt ja sõna';
  if (topic === 'esimene-haalik') return 'Esimene häälik';
  if (topic === 'mootuhikud-pikkused' || topic === 'pikkused') return 'Mõõtühikud';
  if (topic === 'jagamine-kahekohaline-uhekohaline') return 'Kahekohalise arvu jagamine';
  if (topic === 'arvud-10000' || topic === 'arvud-10000-piires') return 'Arvud 10k piires';
  if (topic === 'ring-ja-ringjoon') return 'Ring ja ringjoon';
  if (topic === 'korrutamine') return 'Korrutamine';
  if (topic === 'tekstulesanded') return 'Tekstülesanded';
  if (topic === 'arvutamine') return 'Arvutamine';
  if (topic === 'loendamine') return 'Loendamine';
  if (topic === 'mustrid') return 'Mustrid';
  if (topic === 'segaharjutus') return 'Segaharjutus';
  return category || '';
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
