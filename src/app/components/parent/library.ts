import type { LearningExerciseStatus, LearningExerciseSubject } from '@/lib/shared/types';
import { SUBJECT_ORDER } from './format';
import type { LearningExercise, Learner } from './types';

export type LibraryFilters = {
  subject: 'all' | LearningExerciseSubject;
  topic: string;
  status: 'all' | LearningExerciseStatus;
};

// The "Teema" filter offers every topic and category once, and the title of an
// exercise that has neither, alphabetically in Estonian.
export function libraryTopicOptions(exercises: LearningExercise[]) {
  const values = new Map<string, string>();
  for (const exercise of exercises) {
    if (exercise.topic) values.set(exercise.topic, exercise.topic);
    if (exercise.category) values.set(exercise.category, exercise.category);
    if (!exercise.topic && !exercise.category) values.set(exercise.title, exercise.title);
  }
  return Array.from(values, ([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label, 'et'));
}

// Each catalog entry belongs to a single child, so we group by learner (Kiur
// first, then Kirsi) instead of interleaving them, and show one compact row
// per exercise with that child's status.
export function libraryByLearner(exercises: LearningExercise[], filters: LibraryFilters) {
  const result: Record<Learner, LearningExercise[]> = { kiur: [], kirsi: [] };
  for (const learner of ['kiur', 'kirsi'] as Learner[]) {
    result[learner] = exercises
      .filter((exercise) => exercise.learnerScope.includes(learner))
      .filter((exercise) => {
        const subjectOk = filters.subject === 'all' || exercise.subject === filters.subject;
        const topicOk = filters.topic === 'all' || exercise.topic === filters.topic || exercise.category === filters.topic || exercise.title === filters.topic;
        const statusOk = filters.status === 'all' || exercise.childStatus[learner] === filters.status;
        return subjectOk && topicOk && statusOk;
      })
      .sort((a, b) => {
        const subjectDiff = SUBJECT_ORDER.indexOf(a.subject) - SUBJECT_ORDER.indexOf(b.subject);
        if (subjectDiff !== 0) return subjectDiff;
        if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
        return a.title.localeCompare(b.title, 'et');
      });
  }
  return result;
}

export function libraryStatusNotice(status: LearningExerciseStatus) {
  return status === 'permanent' ? 'Harjutus on nüüd püsiv.' : status === 'rotation' ? 'Harjutus on rotatsioonis.' : 'Harjutus peideti lapse vaatest.';
}

// A body that could not be read must not replace the list with `undefined` —
// that crashed the whole parent page.
export function exercisesFrom(body: unknown): LearningExercise[] | null {
  const exercises = (body as { exercises?: unknown } | null)?.exercises;
  return Array.isArray(exercises) ? exercises as LearningExercise[] : null;
}
