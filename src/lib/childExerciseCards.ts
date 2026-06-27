import { KIUR_MATH_TOPICS } from '@/lib/kiurMathTopics';
import { LearningExerciseRow } from '@/lib/learningExercises';
import { Learner } from '@/lib/tasks';

export type ChildExerciseAccent = 'blue' | 'pink' | 'green' | 'amber' | 'orange' | 'purple' | 'teal' | 'violet';

export type ChildExerciseCard = {
  id: string;
  childId: Learner;
  title: string;
  description?: string;
  emoji: string;
  accent: ChildExerciseAccent;
  route: string;
  enabled: boolean;
  legacySubject: string;
  legacyTopic: string;
  legacyCategory: string;
  completionKeys: string[];
};

const KIRSI_EXERCISE_META: Record<string, Pick<ChildExerciseCard, 'emoji' | 'accent' | 'description'>> = {
  Loendamine: { emoji: '🔢', accent: 'teal', description: 'Loenda pilte ja vali õige arv.' },
  'Arvutamine 10 piires': { emoji: '🍎', accent: 'pink', description: 'Liida ja lahuta kümne piires.' },
  'Arvutamine 20 piires': { emoji: '🧩', accent: 'purple', description: 'Harjuta arvutamist kahekümne piires.' },
  'Suurem või väiksem kuni 100': { emoji: '⚖️', accent: 'amber', description: 'Võrdle arve saja piires.' },
  Segaülesanded: { emoji: '🎲', accent: 'green', description: 'Erinevad Kirsi matemaatikaülesanded.' },
  Kellaaeg: { emoji: '🕒', accent: 'teal', description: 'Vaata seieritega kella ja vali õige aeg.' }
};

const STATIC_EXERCISE_META: Record<string, Pick<ChildExerciseCard, 'emoji' | 'accent' | 'description'> & { route?: string }> = {
  'kiur.english.sprint': { emoji: '🔤', accent: 'pink', description: 'Harjuta inglise keele sõnu.', route: '/kiur/inglise-keel/sprint' },
  'kiur.reading.loe-ja-vasta': { emoji: '📖', accent: 'green', description: 'Loe tekst läbi ja vasta küsimusele.', route: '/kiur/lugemine' },
  'kirsi.reading.pilt-ja-sona': { emoji: '🖼️', accent: 'pink', description: 'Ühenda pilt õige sõnaga.', route: '/kirsi/lugemine/pilt-ja-sona' },
  'kirsi.reading.esimene-haalik': { emoji: '🔤', accent: 'violet', description: 'Leia sõna esimene häälik.', route: '/kirsi/lugemine/esimene-haalik' }
};

function testRoute(exercise: LearningExerciseRow, learner: Learner) {
  const count = learner === 'kiur' && exercise.topic === 'tekstulesanded' ? 5 : 15;
  return `/test?learner=${learner}&subject=${exercise.subject}&topic=${encodeURIComponent(exercise.topic)}&category=${encodeURIComponent(exercise.category)}&count=${count}&seed=${Date.now()}`;
}

function metadataFor(exercise: LearningExerciseRow) {
  const kiurTopic = KIUR_MATH_TOPICS.find((topic) => exercise.id === `kiur.math.${topic.id}`);
  if (kiurTopic) {
    return {
      emoji: kiurTopic.emoji,
      accent: kiurTopic.accent as ChildExerciseAccent,
      description: 'description' in kiurTopic ? kiurTopic.description : undefined
    };
  }

  if (exercise.subject === 'matemaatika') {
    return KIRSI_EXERCISE_META[exercise.category] ?? { emoji: '🧮', accent: 'blue' as const, description: undefined };
  }

  return STATIC_EXERCISE_META[exercise.id] ?? { emoji: '✨', accent: 'blue' as const, description: undefined };
}

function routeFor(exercise: LearningExerciseRow, learner: Learner) {
  const staticRoute = STATIC_EXERCISE_META[exercise.id]?.route;
  if (staticRoute) return staticRoute;
  if (exercise.subject === 'matemaatika') return testRoute(exercise, learner);
  return exercise.routePath;
}

export function childExerciseCards(learner: Learner, exercises: LearningExerciseRow[]): ChildExerciseCard[] {
  return exercises
    .filter((exercise) => exercise.childStatus[learner] !== 'hidden')
    .map((exercise) => {
      const meta = metadataFor(exercise);
      return {
        id: exercise.id,
        childId: learner,
        title: exercise.title,
        description: meta.description,
        emoji: meta.emoji,
        accent: meta.accent,
        route: routeFor(exercise, learner),
        enabled: true,
        legacySubject: exercise.subject,
        legacyTopic: exercise.topic,
        legacyCategory: exercise.category,
        completionKeys: [
          exercise.id,
          `${learner}:${exercise.subject}:${exercise.topic}:${exercise.category}`,
          `${learner}:${exercise.subject}:${exercise.topic}`
        ]
      };
    });
}
