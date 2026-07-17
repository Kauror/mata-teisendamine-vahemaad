// Registry + URL helpers for the optional "Õpi ja korda" study pages that sit in
// front of certain exercises. A study page is a visual revision screen; it never
// records attempts or awards stars. From it the child starts the real exercise
// with the original parameters and a fresh seed.

export type StudyKey = 'ring-ja-ringjoon' | 'kellaaeg' | 'mootuhikud-pikkused' | 'loodusopetus';

export type StudyExerciseParams = {
  learner: 'kiur' | 'kirsi';
  subject: string;
  topic: string;
  category: string;
  exerciseId: string;
  count: number;
};

// Each study page owns its exercise context. Keeping this server-defined means
// a copied or directly opened /opi URL cannot silently launch another learner's
// exercise (or the wrong runner) through missing or edited query parameters.
export const STUDY_EXERCISE_BY_KEY: Readonly<Record<StudyKey, StudyExerciseParams>> = {
  'ring-ja-ringjoon': {
    learner: 'kiur', subject: 'matemaatika', topic: 'ring-ja-ringjoon', category: 'Segaharjutus', exerciseId: 'kiur.math.ring-ja-ringjoon', count: 15
  },
  kellaaeg: {
    learner: 'kirsi', subject: 'matemaatika', topic: 'kellaaeg', category: 'Kellaaeg', exerciseId: 'kirsi.math.kellaaeg', count: 15
  },
  'mootuhikud-pikkused': {
    learner: 'kiur', subject: 'matemaatika', topic: 'mootuhikud-pikkused', category: 'Segaharjutus', exerciseId: 'kiur.math.mootuhikud-pikkused', count: 15
  },
  loodusopetus: {
    learner: 'kiur', subject: 'loodusopetus', topic: 'segaharjutus', category: 'Loodusõpetus', exerciseId: 'kiur.science.loodusopetus', count: 10
  }
};

// Exercise catalogue id → study page it should open before running.
export const STUDY_PAGE_BY_EXERCISE_ID: Readonly<Record<string, StudyKey>> = Object.fromEntries(
  Object.entries(STUDY_EXERCISE_BY_KEY).map(([studyKey, params]) => [params.exerciseId, studyKey])
) as Readonly<Record<string, StudyKey>>;

export function isStudyKey(value: string | null | undefined): value is StudyKey {
  return value === 'ring-ja-ringjoon' || value === 'kellaaeg' || value === 'mootuhikud-pikkused' || value === 'loodusopetus';
}

export function studyExerciseParams(studyKey: StudyKey): StudyExerciseParams {
  return STUDY_EXERCISE_BY_KEY[studyKey];
}

function encode(params: Record<string, string | number | null | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === '') continue;
    search.set(key, String(value));
  }
  return search.toString();
}

// Route to the study page (card → study page). Exercise context is resolved
// from the key, and a seed is minted only when the child starts the exercise.
export function studyPageRoute(studyKey: StudyKey): string {
  return `/opi/${studyKey}`;
}

// Route that starts the exercise itself, with a fresh seed each time so the
// child gets new questions. Loodusõpetus has its own runner route; every other
// study exercise runs through the shared /test runner.
export function exerciseStartRoute(studyKey: StudyKey, seed: number = Date.now()): string {
  const params = studyExerciseParams(studyKey);
  if (params.subject === 'loodusopetus') {
    return `/kiur/loodusopetus/test?${encode({ count: params.count, seed })}`;
  }
  return `/test?${encode({
    learner: params.learner,
    subject: params.subject,
    topic: params.topic,
    category: params.category,
    exerciseId: params.exerciseId,
    count: params.count,
    seed
  })}`;
}

// The back link on the study screens returns to the child's exercise list.
export function studyBackRoute(studyKey: StudyKey): string {
  return studyExerciseParams(studyKey).learner === 'kirsi' ? '/kirsi' : '/kiur';
}
