// Registry + URL helpers for the optional "Õpi ja korda" study pages that sit in
// front of certain exercises. A study page is a visual revision screen; it never
// records attempts or awards stars. From it the child starts the real exercise
// with the original parameters and a fresh seed.

export type StudyKey = 'ring-ja-ringjoon' | 'kellaaeg' | 'mootuhikud-pikkused' | 'loodusopetus';

export const STUDY_KEYS: readonly StudyKey[] = ['ring-ja-ringjoon', 'kellaaeg', 'mootuhikud-pikkused', 'loodusopetus'];

// Exercise catalogue id → study page it should open before running.
export const STUDY_PAGE_BY_EXERCISE_ID: Readonly<Record<string, StudyKey>> = {
  'kiur.math.ring-ja-ringjoon': 'ring-ja-ringjoon',
  'kirsi.math.kellaaeg': 'kellaaeg',
  'kiur.math.mootuhikud-pikkused': 'mootuhikud-pikkused',
  'kiur.science.loodusopetus': 'loodusopetus'
};

export function isStudyKey(value: string | null | undefined): value is StudyKey {
  return value === 'ring-ja-ringjoon' || value === 'kellaaeg' || value === 'mootuhikud-pikkused' || value === 'loodusopetus';
}

// The exercise parameters carried through the study page so it can launch the
// exact same exercise the card would have started.
export type StudyExerciseParams = {
  learner: string;
  subject: string;
  topic: string;
  category: string;
  exerciseId?: string | null;
  count: number;
};

function encode(params: Record<string, string | number | null | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === '') continue;
    search.set(key, String(value));
  }
  return search.toString();
}

// Route to the study page (card → study page). Seed is intentionally omitted:
// it is minted only when the child actually starts the exercise.
export function studyPageRoute(studyKey: StudyKey, params: StudyExerciseParams): string {
  return `/opi/${studyKey}?${encode({
    learner: params.learner,
    subject: params.subject,
    topic: params.topic,
    category: params.category,
    exerciseId: params.exerciseId ?? undefined,
    count: params.count
  })}`;
}

// Route that starts the exercise itself, with a fresh seed each time so the
// child gets new questions. Loodusõpetus has its own runner route; every other
// study exercise runs through the shared /test runner.
export function exerciseStartRoute(params: StudyExerciseParams, seed: number = Date.now()): string {
  if (params.subject === 'loodusopetus') {
    return `/kiur/loodusopetus/test?${encode({ count: params.count, seed })}`;
  }
  return `/test?${encode({
    learner: params.learner,
    subject: params.subject,
    topic: params.topic,
    category: params.category,
    exerciseId: params.exerciseId ?? undefined,
    count: params.count,
    seed
  })}`;
}

// The back link on the study screens returns to the child's exercise list.
export function studyBackRoute(learner: string): string {
  return learner === 'kirsi' ? '/kirsi' : learner === 'kiur' ? '/kiur' : '/';
}
