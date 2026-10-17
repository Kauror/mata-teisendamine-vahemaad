import { KIUR_MATH_TOPICS } from '@/lib/kiurMathTopics';
import { STUDY_PAGE_BY_EXERCISE_ID, studyPageRoute } from '@/lib/studyPages';
import type { CatalogueEntry as LearningExerciseRow, Learner, LearningExerciseStatus } from '@/lib/shared/types';

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
  // See FIXED_CHILD_EXERCISES: an archived exercise is offered to nobody.
  archived?: boolean;
};

// Fixed runners live beside the catalogue-backed registry so server rendering,
// offline hydration and readiness all see the same inventory.
//
// `archived: true` takes an exercise out of use without deleting anything: it is
// never a child card (server or offline), never in the daily rotation and not in
// the parent's "Harjutuste kogu" (getLearningExerciseCatalog omits it). Its
// runner route, data, offline capability entry and the child's history rows stay
// as they are, and the parent's last status for it is kept in the database.
// To un-archive, remove the flag. To give it to Kirsi instead, also move it under
// `kirsi` here (childId 'kirsi'), set learnerScope ['kirsi'] in
// STATIC_LEARNING_EXERCISES (learningExercises.ts) and learners ["kirsi"] in
// offline/capabilities.json, and give it content suitable for her.
export const FIXED_CHILD_EXERCISES: Readonly<Record<Learner, readonly ChildExerciseCard[]>> = {
  kiur: [
    {
      id: 'kiur.science.loodusopetus',
      childId: 'kiur',
      title: 'Loodusõpetus',
      description: 'Segaharjutus: pildid, lugemine, sobitamine, järjestamine ja andmed.',
      emoji: '🔬',
      accent: 'teal',
      route: '/kiur/loodusopetus',
      enabled: true,
      // Archived 2026-10-17: Kiur's Loodusõpetus is now the textbook course (the
      // always-shown card on /kiur). Kept to be reused for Kirsi later.
      archived: true,
      legacySubject: 'loodusopetus',
      legacyTopic: 'segaharjutus',
      legacyCategory: 'Loodusõpetus',
      completionKeys: [
        'kiur.science.loodusopetus',
        'kiur:loodusopetus:segaharjutus:Loodusõpetus',
        'kiur:loodusopetus:segaharjutus'
      ]
    }
  ],
  kirsi: []
};

export const ARCHIVED_EXERCISE_IDS: ReadonlySet<string> = new Set(
  Object.values(FIXED_CHILD_EXERCISES).flat().filter((exercise) => exercise.archived).map((exercise) => exercise.id)
);

export function isArchivedExercise(exerciseId: string): boolean {
  return ARCHIVED_EXERCISE_IDS.has(exerciseId);
}

// Only the id and this child's status matter here, so callers can pass whatever
// catalogue shape they hold (server rows or a cached offline catalogue).
type CatalogueStatus = { id: string; childStatus: Record<Learner, LearningExerciseStatus | null> };

// Fixed runners are reconciled after the daily rotation has picked today's
// cards. A permanent exercise is always added, a rotating exercise is kept only
// when the rotation selected it, and a hidden/unavailable exercise is removed.
// Without a catalogue (offline, before first hydration) the fixed card is kept,
// which is the case this fallback exists for.
export function mergeFixedChildExerciseCards(
  learner: Learner,
  cards: ChildExerciseCard[],
  catalogue: CatalogueStatus[] = []
): ChildExerciseCard[] {
  const merged = new Map(cards.map((card) => [card.id, card]));
  for (const fixed of FIXED_CHILD_EXERCISES[learner]) {
    if (fixed.archived) {
      merged.delete(fixed.id);
      continue;
    }
    const catalogueEntry = catalogue.find((entry) => entry.id === fixed.id);
    if (!catalogueEntry || catalogueEntry.childStatus[learner] === 'permanent') {
      merged.set(fixed.id, fixed);
    } else if (catalogueEntry.childStatus[learner] !== 'rotation') {
      merged.delete(fixed.id);
    }
  }
  return [...merged.values()];
}

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
  'kiur.english.vocabulary': { emoji: '📚', accent: 'blue', description: 'Õpi õpiku sõnad kaartidega ja tee test.', route: '/kiur/inglise-keel' },
  'kiur.reading.loe-ja-vasta': { emoji: '📖', accent: 'green', description: 'Loe tekst läbi ja vasta küsimusele.', route: '/kiur/lugemine' },
  'kirsi.reading.pilt-ja-sona': { emoji: '🖼️', accent: 'pink', description: 'Ühenda pilt õige sõnaga.', route: '/kirsi/lugemine/pilt-ja-sona' },
  'kirsi.reading.esimene-haalik': { emoji: '🔤', accent: 'violet', description: 'Leia sõna esimene häälik.', route: '/kirsi/lugemine/esimene-haalik' }
};

function testRoute(exercise: LearningExerciseRow, learner: Learner) {
  const count = learner === 'kiur' && exercise.topic === 'tekstulesanded' ? 5 : 15;
  return `/test?learner=${learner}&subject=${exercise.subject}&topic=${encodeURIComponent(exercise.topic)}&category=${encodeURIComponent(exercise.category)}&exerciseId=${encodeURIComponent(exercise.id)}&count=${count}&seed=${Date.now()}`;
}

// Exercises with a study page open it first (the child chooses to revise or
// start straight away). Applied after fixed/catalogue cards are merged so both
// card sources are covered from one place.
function applyStudyRoutes(cards: ChildExerciseCard[]): ChildExerciseCard[] {
  return cards.map((card) => {
    const studyKey = STUDY_PAGE_BY_EXERCISE_ID[card.id];
    if (!studyKey) return card;
    return {
      ...card,
      route: studyPageRoute(studyKey)
    };
  });
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

// `exercises` is what the child should see today (already rotated); `catalogue`
// is the full pool the rotation was drawn from, needed only so a hidden fixed
// exercise stays hidden. They are the same list when a caller passes the pool
// straight through.
export function childExerciseCards(
  learner: Learner,
  exercises: LearningExerciseRow[],
  catalogue: CatalogueStatus[] = exercises
): ChildExerciseCard[] {
  const catalogueCards = exercises
    // An older cached offline catalogue may still list an archived exercise.
    .filter((exercise) => exercise.childStatus[learner] !== 'hidden' && !isArchivedExercise(exercise.id))
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
  return applyStudyRoutes(mergeFixedChildExerciseCards(learner, catalogueCards, catalogue));
}
