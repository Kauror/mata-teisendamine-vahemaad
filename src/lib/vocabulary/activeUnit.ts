// Which English unit is "the one Kiur is on" — its card opens with every
// action showing; the others keep theirs under "⋯" (Kaur 21.11).
//   1. something already started: a words test or study session, or a
//      kontrolltöö in progress or returned for fixing;
//   2. otherwise the next words step: a new unit, a finished study waiting for
//      its test, or new words added to a unit;
//   3. otherwise the first kontrolltöö waiting to be done (or redone).
// Pure (no server imports), so the client list and its test share it.

type UnitLike = {
  id: string;
  status: 'locked' | 'new' | 'studying' | 'study_done' | 'new_words' | 'testing' | 'passed';
  unitTest?: { state: string } | null;
};

export function activeUnitId(units: readonly UnitLike[]): string | null {
  const started = units.find((u) => u.status === 'testing' || u.status === 'studying'
    || u.unitTest?.state === 'in_progress' || u.unitTest?.state === 'returned');
  if (started) return started.id;
  const next = units.find((u) => u.status === 'new' || u.status === 'study_done' || u.status === 'new_words');
  if (next) return next.id;
  return units.find((u) => u.unitTest?.state === 'available' || u.unitTest?.state === 'retake')?.id ?? null;
}
