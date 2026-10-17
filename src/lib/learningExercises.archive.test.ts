import { describe, expect, it } from 'vitest';
import {
  findLearningExerciseForAttempt,
  getActiveLearningExercises,
  getLearningExerciseCatalog,
  selectTodaysLearningExercises,
  updateChildLearningExerciseStatus
} from '@/lib/learningExercises';

const SCIENCE_ID = 'kiur.science.loodusopetus';

describe('the archived mixed Loodusõpetus exercise', () => {
  it('is left out of the catalogue, the active pool and the daily rotation', () => {
    expect(getLearningExerciseCatalog().map((exercise) => exercise.id)).not.toContain(SCIENCE_ID);
    expect(getActiveLearningExercises('kiur').map((exercise) => exercise.id)).not.toContain(SCIENCE_ID);
    const today = selectTodaysLearningExercises(getActiveLearningExercises('kiur'), 'kiur', '2026-10-17');
    expect(today.map((exercise) => exercise.id)).not.toContain(SCIENCE_ID);
  });

  it('cannot be re-enabled from the parent library', () => {
    expect(() => updateChildLearningExerciseStatus(SCIENCE_ID, 'kiur', 'permanent')).toThrow('Harjutust ei leitud.');
  });

  it('still resolves attempts recorded for it, so their history keeps its identity', () => {
    const exercise = findLearningExerciseForAttempt({ learner: 'kiur', subject: 'loodusopetus', topic: 'segaharjutus', category: 'Loodusõpetus' });
    expect(exercise?.id).toBe(SCIENCE_ID);
  });
});
