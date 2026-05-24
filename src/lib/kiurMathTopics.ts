import { CATEGORIES, DIFFICULTIES, QUESTION_COUNTS } from '@/lib/types';

export const KIUR_MATH_TOPICS = [
  {
    id: 'mootuhikud-pikkused',
    name: 'Mõõtühikud ja pikkused',
    emoji: '📏',
    accent: 'teal',
    description: 'mm, cm, dm, m, km, teisendamine, võrdlemine, ümbermõõt ja tekstülesanded',
    implemented: true,
    exerciseTypes: CATEGORIES,
    difficulties: DIFFICULTIES,
    questionCounts: QUESTION_COUNTS
  },
  {
    id: 'jagamine-kahekohaline-uhekohaline',
    name: 'Kahekohalise arvu jagamine',
    emoji: '➗',
    accent: 'blue',
    description: 'Jagamine, korrutamisega kontroll, tähe väärtus ja võrratused',
    implemented: true,
    exerciseTypes: ['Jagamine', 'Kontroll korrutamisega', 'Tähe väärtus', 'Võrratused', 'Segaharjutus'] as const,
    difficulties: DIFFICULTIES,
    questionCounts: QUESTION_COUNTS
  },
  {
    id: 'arvud-10000',
    name: 'Arvud 10k piires',
    emoji: '🔢',
    accent: 'purple',
    description: 'Arvkiir, järjestamine, võrdlemine ja arvu koostis',
    implemented: true,
    exerciseTypes: ['Arvkiir', 'Eelnev ja järgnev arv', 'Järjestamine', 'Võrdlemine', 'Arvu koostis', 'Nuputa', 'Segaharjutus'] as const,
    difficulties: DIFFICULTIES,
    questionCounts: QUESTION_COUNTS
  },
  {
    id: 'ring-ja-ringjoon',
    name: 'Ring',
    emoji: '⭕',
    accent: 'violet',
    description: 'Ring, ringjoon, keskpunkt, raadius ja diameeter',
    implemented: true,
    exerciseTypes: ['Mõisted', 'Raadius', 'Diameeter', 'Võrdlemine', 'Mustrid', 'Segaharjutus'] as const,
    difficulties: DIFFICULTIES,
    questionCounts: QUESTION_COUNTS
  }
] as const;

export type KiurMathTopicId = (typeof KIUR_MATH_TOPICS)[number]['id'];

export const KIUR_LENGTH_TOPIC_ID: KiurMathTopicId = 'mootuhikud-pikkused';
export const KIUR_LENGTH_TOPIC_ALIAS = 'pikkused';

export function normalizeKiurMathTopicId(topic?: string | null): string {
  if (!topic || topic === KIUR_LENGTH_TOPIC_ALIAS) return KIUR_LENGTH_TOPIC_ID;
  return topic;
}

export function isKiurLengthTopic(topic?: string | null): boolean {
  return normalizeKiurMathTopicId(topic) === KIUR_LENGTH_TOPIC_ID;
}
