import db from '@/lib/db';
import { KIUR_MATH_TOPICS } from '@/lib/kiurMathTopics';
import { nowIso, todayDateString, type Learner } from '@/lib/tasks';
import { seededRng, shuffleWithRng } from '@/lib/random';

// 'rotation' = in the daily rotation pool; 'permanent' = always shown; 'hidden'
// = not shown. Legacy rows stored as 'active' are read as 'rotation'.
export type LearningExerciseStatus = 'hidden' | 'rotation' | 'permanent';

export const DAILY_EXERCISE_LIMIT = 4;
export type LearningExerciseSubject = 'matemaatika' | 'inglise-keel' | 'lugemine';

export type LearningExerciseCatalogEntry = {
  id: string;
  title: string;
  learnerScope: Learner[];
  subject: LearningExerciseSubject;
  topic: string;
  category: string;
  routePath: string;
  sortOrder: number;
};

export type LearningExerciseRow = LearningExerciseCatalogEntry & {
  childStatus: Record<Learner, LearningExerciseStatus | null>;
};

type LearningExerciseDbRow = {
  id: string;
  title: string;
  learnerScopeJson: string;
  subject: LearningExerciseSubject;
  topic: string | null;
  category: string | null;
  routePath: string;
  sortOrder: number;
  kiurStatus: LearningExerciseStatus | null;
  kirsiStatus: LearningExerciseStatus | null;
};

let catalogSynced = false;

const KIRSI_MATH_MODES = [
  'Arvutamine 10 piires',
  'Arvutamine 20 piires',
  'Suurem või väiksem kuni 100',
  'Segaülesanded'
] as const;

const STATIC_LEARNING_EXERCISES: LearningExerciseCatalogEntry[] = [
  ...KIUR_MATH_TOPICS.map((topic, index) => ({
    id: `kiur.math.${topic.id}`,
    title: topic.name,
    learnerScope: ['kiur'] as Learner[],
    subject: 'matemaatika' as const,
    topic: topic.id,
    category: topic.defaultCategory,
    routePath: '/kiur/matemaatika',
    sortOrder: 100 + index
  })),
  ...KIRSI_MATH_MODES.map((mode, index) => ({
    id: `kirsi.math.arvutamine.${index + 1}`,
    title: mode,
    learnerScope: ['kirsi'] as Learner[],
    subject: 'matemaatika' as const,
    topic: 'arvutamine',
    category: mode,
    routePath: '/kirsi/matemaatika',
    sortOrder: 300 + index
  })),
  {
    id: 'kirsi.math.counting-20',
    title: 'Loendamine',
    learnerScope: ['kirsi'],
    subject: 'matemaatika',
    topic: 'loendamine',
    category: 'Loendamine',
    routePath: '/kirsi/matemaatika',
    sortOrder: 299
  },
  {
    id: 'kirsi.math.kellaaeg',
    title: 'Kellaaeg',
    learnerScope: ['kirsi'],
    subject: 'matemaatika',
    topic: 'kellaaeg',
    category: 'Kellaaeg',
    routePath: '/kirsi/matemaatika',
    sortOrder: 305
  },
  {
    id: 'kiur.english.sprint',
    title: 'Sprint',
    learnerScope: ['kiur'],
    subject: 'inglise-keel',
    topic: 'sprint',
    category: 'Inglise keel - sprint',
    routePath: '/kiur/inglise-keel',
    sortOrder: 500
  },
  {
    id: 'kiur.reading.loe-ja-vasta',
    title: 'Loe ja vasta',
    learnerScope: ['kiur'],
    subject: 'lugemine',
    topic: 'loe-ja-vasta',
    category: 'Lugemine - loe ja vasta',
    routePath: '/kiur/lugemine',
    sortOrder: 600
  },
  {
    id: 'kirsi.reading.pilt-ja-sona',
    title: 'Pilt ja sõna',
    learnerScope: ['kirsi'],
    subject: 'lugemine',
    topic: 'pilt-ja-sona',
    category: 'Lugemine - pilt ja sõna',
    routePath: '/kirsi/lugemine',
    sortOrder: 700
  },
  {
    id: 'kirsi.reading.esimene-haalik',
    title: 'Esimene häälik',
    learnerScope: ['kirsi'],
    subject: 'lugemine',
    topic: 'esimene-haalik',
    category: 'Lugemine - esimene häälik',
    routePath: '/kirsi/lugemine',
    sortOrder: 701
  }
];

function parseLearnerScope(value: string): Learner[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((learner): learner is Learner => learner === 'kiur' || learner === 'kirsi') : [];
  } catch {
    return [];
  }
}

function normalizeStatus(value: unknown): LearningExerciseStatus | null {
  if (value === 'active' || value === 'rotation') return 'rotation';
  if (value === 'permanent') return 'permanent';
  if (value === 'hidden') return 'hidden';
  return null;
}

function toRow(row: LearningExerciseDbRow): LearningExerciseRow {
  return {
    id: row.id,
    title: row.title,
    learnerScope: parseLearnerScope(row.learnerScopeJson),
    subject: row.subject,
    topic: row.topic || '',
    category: row.category || '',
    routePath: row.routePath,
    sortOrder: row.sortOrder,
    childStatus: {
      kiur: normalizeStatus(row.kiurStatus),
      kirsi: normalizeStatus(row.kirsiStatus)
    }
  };
}

export function syncLearningExerciseCatalog() {
  if (catalogSynced) return;

  const updatedAt = nowIso();
  const tx = db.transaction(() => {
    for (const exercise of STATIC_LEARNING_EXERCISES) {
      db.prepare(`
        INSERT INTO learning_exercises (id, title, learnerScopeJson, subject, topic, category, routePath, sortOrder, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          learnerScopeJson = excluded.learnerScopeJson,
          subject = excluded.subject,
          topic = excluded.topic,
          category = excluded.category,
          routePath = excluded.routePath,
          sortOrder = excluded.sortOrder,
          updatedAt = excluded.updatedAt
      `).run(exercise.id, exercise.title, JSON.stringify(exercise.learnerScope), exercise.subject, exercise.topic, exercise.category, exercise.routePath, exercise.sortOrder, updatedAt);

      for (const learner of exercise.learnerScope) {
        db.prepare(`
          INSERT INTO child_learning_exercise_settings (exerciseId, learner, status, updatedAt)
          VALUES (?, ?, 'rotation', ?)
          ON CONFLICT(exerciseId, learner) DO NOTHING
        `).run(exercise.id, learner, updatedAt);
      }
    }
  });
  tx();
  catalogSynced = true;
}

export function getLearningExerciseCatalog() {
  syncLearningExerciseCatalog();
  const rows = db.prepare(`
    SELECT
      e.*,
      kiur.status as kiurStatus,
      kirsi.status as kirsiStatus
    FROM learning_exercises e
    LEFT JOIN child_learning_exercise_settings kiur ON kiur.exerciseId = e.id AND kiur.learner = 'kiur'
    LEFT JOIN child_learning_exercise_settings kirsi ON kirsi.exerciseId = e.id AND kirsi.learner = 'kirsi'
    ORDER BY e.sortOrder ASC, e.title ASC
  `).all() as LearningExerciseDbRow[];
  return rows.map(toRow);
}

// Exercises the parent has enabled for this child (rotation pool + permanent).
// These are all reachable/allowed; the dashboard separately limits how many are
// shown on a given day via selectTodaysLearningExercises.
export function getActiveLearningExercises(learner: Learner) {
  return getLearningExerciseCatalog().filter((exercise) => {
    const status = exercise.childStatus[learner];
    return status === 'rotation' || status === 'permanent';
  });
}

// Picks the exercises shown to a child today: every permanent one, plus a
// daily-random sample from the rotation pool, capped at DAILY_EXERCISE_LIMIT in
// total. The random sample is seeded by (learner + date) so it is stable for the
// whole day and reshuffles each new day.
export function selectTodaysLearningExercises<T extends { id: string; sortOrder: number; childStatus: Record<Learner, LearningExerciseStatus | null> }>(
  exercises: T[],
  learner: Learner,
  date = todayDateString(),
  limit = DAILY_EXERCISE_LIMIT
): T[] {
  const available = exercises.filter((exercise) => {
    const status = exercise.childStatus[learner];
    return status === 'rotation' || status === 'permanent';
  });
  const permanents = available.filter((exercise) => exercise.childStatus[learner] === 'permanent');
  const rotation = available.filter((exercise) => exercise.childStatus[learner] === 'rotation');

  const remaining = Math.max(0, limit - permanents.length);
  let seed = 0;
  const seedSource = `${learner}:${date}`;
  for (let i = 0; i < seedSource.length; i++) seed = (Math.imul(seed, 31) + seedSource.charCodeAt(i)) >>> 0;
  const rotated = shuffleWithRng(seededRng(seed), rotation).slice(0, remaining);

  const chosen = new Set([...permanents, ...rotated].map((exercise) => exercise.id));
  return available.filter((exercise) => chosen.has(exercise.id)).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getActiveLearningExerciseIds(learner: Learner) {
  return new Set(getActiveLearningExercises(learner).map((exercise) => exercise.id));
}

export function hasActiveLearningExercise(learner: Learner, exerciseId: string) {
  return getActiveLearningExerciseIds(learner).has(exerciseId);
}

export function subjectHasActiveLearningExercises(learner: Learner, subject: LearningExerciseSubject) {
  return getActiveLearningExercises(learner).some((exercise) => exercise.subject === subject);
}

export function isLearningExerciseSubject(value: unknown): value is LearningExerciseSubject {
  return value === 'matemaatika' || value === 'inglise-keel' || value === 'lugemine';
}

export function findLearningExerciseForAttempt(input: {
  learner: Learner;
  subject: LearningExerciseSubject;
  topic: string;
  category: string;
}) {
  return getLearningExerciseCatalog().find((exercise) => {
    if (!exercise.learnerScope.includes(input.learner)) return false;
    if (exercise.subject !== input.subject) return false;

    if (input.subject === 'matemaatika') {
      if (input.learner === 'kirsi') return exercise.topic === input.topic && exercise.category === input.category;
      return exercise.topic === input.topic;
    }

    return exercise.topic === input.topic || exercise.category === input.category;
  }) ?? null;
}

export function isLearningExerciseActiveForAttempt(input: {
  learner: Learner;
  subject: LearningExerciseSubject;
  topic: string;
  category: string;
}) {
  const exercise = findLearningExerciseForAttempt(input);
  if (!exercise) return false;
  const status = exercise.childStatus[input.learner];
  return status === 'rotation' || status === 'permanent';
}

export function updateChildLearningExerciseStatus(exerciseId: string, learner: Learner, status: LearningExerciseStatus) {
  syncLearningExerciseCatalog();
  const exercise = getLearningExerciseCatalog().find((item) => item.id === exerciseId);
  if (!exercise) throw new Error('Harjutust ei leitud.');
  if (!exercise.learnerScope.includes(learner)) throw new Error('See harjutus ei ole sellele lapsele saadaval.');

  db.prepare(`
    INSERT INTO child_learning_exercise_settings (exerciseId, learner, status, updatedAt)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(exerciseId, learner) DO UPDATE SET
      status = excluded.status,
      updatedAt = excluded.updatedAt
  `).run(exerciseId, learner, status, nowIso());
}

export function isLearner(value: unknown): value is Learner {
  return value === 'kiur' || value === 'kirsi';
}

export function isLearningExerciseStatus(value: unknown): value is LearningExerciseStatus {
  return value === 'hidden' || value === 'rotation' || value === 'permanent';
}
