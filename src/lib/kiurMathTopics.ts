// The maths topics Kiur can be shown, and how each one's card looks. Fields
// here are only what something actually reads: id, name, emoji, accent and
// description feed the exercise card, defaultCategory seeds the catalogue
// entry. An earlier version also carried per-topic difficulty, exercise-type
// and question-count options for a picker screen that no longer exists.
export const KIUR_MATH_TOPICS = [
  {
    id: 'mootuhikud-pikkused',
    name: 'Mõõtühikud',
    emoji: '📏',
    accent: 'teal',
    description: 'Pikkusühikud km, m, dm, cm ja mm ning nendega seotud ülesanded',
    defaultCategory: 'Segaharjutus' as const
  },
  {
    id: 'jagamine-kahekohaline-uhekohaline',
    name: 'Kahekohalise arvu jagamine',
    emoji: '➗',
    accent: 'blue',
    description: 'Kahekohalise arvu jagamine ühekohalise arvuga, jagamine osadeks ja kontrolltehted',
    defaultCategory: 'Segaharjutus' as const
  },
  {
    id: 'arvud-10000-piires',
    name: 'Arvud 10 000 piires',
    emoji: '🔢',
    accent: 'purple',
    description: 'Liitmine, lahutamine, järguväärtus, ümardamine ja hinnangud 10 000 piires',
    defaultCategory: 'Segaharjutus' as const
  },
  {
    id: 'ring-ja-ringjoon',
    name: 'Ring ja ringjoon',
    emoji: '⭕',
    accent: 'violet',
    description: 'Ringi ja ringjoone mõisted, raadius, läbimõõt, kraadid ja võrdlemine',
    defaultCategory: 'Segaharjutus' as const
  },
  {
    id: 'korrutamine',
    name: 'Korrutamine',
    emoji: '\u00d7',
    accent: 'orange',
    description: 'Korrutustabeli harjutamine teguritega 2 kuni 10',
    defaultCategory: 'Korrutamine' as const
  },
  {
    id: 'tekstulesanded',
    name: 'Tekstülesanded',
    emoji: 'Aa',
    accent: 'blue',
    description: 'Viie tekstülesande lahendamine rahulikus tempos',
    defaultCategory: 'Tekstülesanded' as const
  },
  {
    id: 'mustrid',
    name: 'Mustrid',
    emoji: '🧩',
    accent: 'purple',
    defaultCategory: 'Segaharjutus' as const
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
