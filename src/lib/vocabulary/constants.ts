// Identity of the vocabulary module inside the existing exercise ecosystem.
// The catalogue entry, the canonical attempt and the reward projection all key
// on these, so they must stay stable once attempts exist.
export const VOCAB_LEARNER = 'kiur' as const;
export const VOCAB_EXERCISE_ID = 'kiur.english.vocabulary';
export const VOCAB_SUBJECT = 'inglise-keel' as const;
export const VOCAB_TOPIC = 'sonavara';
export const VOCAB_CATEGORY = 'Inglise keel - sõnavara';
export const VOCAB_RUNNER_ID = 'kiur-english-vocabulary';
export const VOCAB_RUNNER_VERSION = 'english-vocabulary-v1';
export const VOCAB_GENERATOR_VERSION = 'english-vocabulary-2026-10';
export const VOCAB_HOME_ROUTE = '/kiur/inglise-keel';

// Shown when every unit the child can see is passed. It must not hint at
// units the parent has not published yet — those do not exist for the child.
export const VOCAB_ALL_PASSED_MESSAGE = 'Kõik õppetükid on läbitud! Järgmine ilmub siia, kui see avatakse.';

export function vocabUnitLabel(unit: { unitNumber: number; title: string }) {
  const title = unit.title.trim();
  return title && title !== `Unit ${unit.unitNumber}` ? `Unit ${unit.unitNumber} — ${title}` : `Unit ${unit.unitNumber}`;
}
