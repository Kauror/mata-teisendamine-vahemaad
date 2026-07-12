import { APP_TIME_ZONE, isoToAppDate, previousAppDate, todayDateString } from '@/lib/appDate';

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

// Estonian uses the partitive ("karikat") after a number, except the bare
// nominative "karikas" after exactly 1.
export function trophyWord(count: number) {
  return count === 1 ? 'karikas' : 'karikat';
}

// A protocol-v2 attempt whose stars are held pending parent review (RTM3-H02).
// The child sees a completed result with no stars; without this the row is
// indistinguishable from an ordinary confirmed attempt that simply earned zero.
export function isHeldReward(status?: string | null): boolean {
  return status === 'withheld' || status === 'needs_review';
}

// Shown to the child in the history list, the local result and the server result
// detail whenever an attempt is held for parent approval (RTM3-H02).
export const HELD_REWARD_MESSAGE = 'Tulemus on salvestatud. Tähed ootavad vanema kinnitust.';


export function scorePercent(score: number, questionCount: number) {
  if (!Number.isFinite(score) || !Number.isFinite(questionCount) || questionCount <= 0) return 0;
  return Math.round((score / questionCount) * 100);
}

export function isTodayIso(createdAt: string) {
  return isoToAppDate(createdAt) === todayDateString();
}

export function relativeDateTimeLabel(createdAt: string) {
  const day = isoToAppDate(createdAt);
  const today = todayDateString();
  const time = new Date(createdAt).toLocaleTimeString('et-EE', { hour: '2-digit', minute: '2-digit', timeZone: APP_TIME_ZONE });

  if (day === today) return `täna ${time}`;
  if (day === previousAppDate(today)) return `eile ${time}`;
  const date = new Date(createdAt).toLocaleDateString('et-EE', { day: '2-digit', month: '2-digit', timeZone: APP_TIME_ZONE });
  return `${date} ${time}`;
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
  const day = isoToAppDate(createdAt);
  const today = todayDateString();
  if (day === today) return 'Täna';
  if (day === previousAppDate(today)) return 'Eile';
  return new Date(createdAt).toLocaleDateString('et-EE', { timeZone: APP_TIME_ZONE });
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
