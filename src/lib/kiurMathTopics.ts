import { QUESTION_COUNTS } from '@/lib/types';

export const KIUR_MATH_TOPICS = [
  {
    id: 'mootuhikud-pikkused',
    name: 'Mõõtühikud',
    emoji: '📏',
    accent: 'teal',
    description: 'Pikkusühikud km, m, dm, cm ja mm ning nendega seotud ülesanded',
    implemented: true,
    hideExerciseTypeSelector: true,
    defaultCategory: 'Segaharjutus' as const,
    hideDifficultySelector: true,
    defaultDifficulty: 'Lihtne' as const,
    exerciseTypes: ['Segaharjutus'] as const,
    difficulties: ['Lihtne'] as const,
    questionCounts: QUESTION_COUNTS
  },
  {
    id: 'jagamine-kahekohaline-uhekohaline',
    name: 'Kahekohalise arvu jagamine',
    emoji: '➗',
    accent: 'blue',
    description: 'Kahekohalise arvu jagamine ühekohalise arvuga, jagamine osadeks ja kontrolltehted',
    implemented: true,
    hideExerciseTypeSelector: true,
    defaultCategory: 'Segaharjutus' as const,
    hideDifficultySelector: true,
    defaultDifficulty: 'Lihtne' as const,
    exerciseTypes: ['Segaharjutus'] as const,
    difficulties: ['Lihtne'] as const,
    questionCounts: QUESTION_COUNTS
  },
  {
    id: 'arvud-10000-piires',
    name: 'Arvud 10 000 piires',
    emoji: '🔢',
    accent: 'purple',
    description: 'Liitmine, lahutamine, järguväärtus, ümardamine ja hinnangud 10 000 piires',
    implemented: true,
    hideExerciseTypeSelector: true,
    defaultCategory: 'Segaharjutus' as const,
    hideDifficultySelector: true,
    defaultDifficulty: 'Lihtne' as const,
    exerciseTypes: ['Segaharjutus'] as const,
    difficulties: ['Lihtne'] as const,
    questionCounts: QUESTION_COUNTS
  },
  {
    id: 'ring-ja-ringjoon',
    name: 'Ring ja ringjoon',
    emoji: '⭕',
    accent: 'violet',
    description: 'Ringi ja ringjoone mõisted, raadius, läbimõõt, kraadid ja võrdlemine',
    implemented: true,
    hideExerciseTypeSelector: true,
    defaultCategory: 'Segaharjutus' as const,
    hideDifficultySelector: true,
    defaultDifficulty: 'Lihtne' as const,
    exerciseTypes: ['Ring või ringjoon', 'Leia raadius', 'Leia läbimõõt', 'Läbimõõt raadiusest', 'Raadius läbimõõdust', 'Punkti asukoht', 'Sama keskpunkt', 'Võrdle raadiuseid', 'Ringi kraadid', 'Puuduv kraad', 'Segaharjutus'] as const,
    difficulties: ['Lihtne'] as const,
    questionCounts: QUESTION_COUNTS
  },
  {
    id: 'mustrid',
    name: 'Mustrid',
    emoji: '🧩',
    accent: 'purple',
    implemented: true,
    hideExerciseTypeSelector: true,
    defaultCategory: 'Segaharjutus' as const,
    hideDifficultySelector: true,
    defaultDifficulty: 'Lihtne' as const,
    exerciseTypes: ['Segaharjutus'] as const,
    difficulties: ['Lihtne'] as const,
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
