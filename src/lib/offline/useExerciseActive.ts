'use client';

import { useEffect, useRef, useState } from 'react';
import { isExercisePermittedOffline } from '@/lib/offline/api';
import type { Learner } from '@/lib/shared/types';

export type ActiveExercisesBody = {
  exerciseIds?: string[];
  exercises?: Array<{ id?: string; subject: string; topic: string; category: string }>;
};

export type ExerciseMatch = {
  exerciseId: string | null;
  subject: string;
  topic: string;
  category: string;
};

type ResolveDeps = {
  fetchImpl?: typeof fetch;
  permittedOffline?: (learner: Learner, match: ExerciseMatch) => Promise<boolean>;
};

export function exerciseIdIsActive(body: ActiveExercisesBody, exerciseId: string | null) {
  return Boolean(exerciseId && body.exerciseIds?.includes(exerciseId));
}

// Is this exercise switched on for the learner? Asks the live server first; if
// the network (or the server) fails, falls back to the newest cached catalogue
// so the exercise still opens offline. Only an explicit "no" from the server,
// or a catalogue that does not permit it, blocks the runner.
export async function resolveExerciseActive(
  learner: Learner,
  match: ExerciseMatch,
  isActive: (body: ActiveExercisesBody) => boolean = (body) => exerciseIdIsActive(body, match.exerciseId),
  { fetchImpl = fetch, permittedOffline = isExercisePermittedOffline }: ResolveDeps = {}
): Promise<boolean> {
  try {
    const response = await fetchImpl(`/api/learning-exercises/active?learner=${learner}`);
    if (!response.ok) throw new Error('active exercises unavailable');
    return isActive(await response.json() as ActiveExercisesBody);
  } catch {
    return permittedOffline(learner, match).catch(() => false);
  }
}

type UseExerciseActiveOptions = ExerciseMatch & {
  learner: Learner | null;
  // false (or no learner): the runner is not gated by the catalogue; it is
  // treated as active.
  enabled?: boolean;
  // How the server's answer decides it; defaults to "exerciseIds lists it".
  isActive?: (body: ActiveExercisesBody) => boolean;
};

// null while the answer is pending, then true/false.
export function useExerciseActive({ learner, exerciseId, subject, topic, category, enabled = true, isActive }: UseExerciseActiveOptions): boolean | null {
  const [active, setActive] = useState<boolean | null>(null);
  const isActiveRef = useRef(isActive);
  isActiveRef.current = isActive;

  useEffect(() => {
    if (!enabled || !learner) {
      setActive(true);
      return;
    }
    let cancelled = false;
    setActive(null);
    const match = { exerciseId, subject, topic, category };
    const predicate = isActiveRef.current;
    void resolveExerciseActive(learner, match, predicate ?? ((body) => exerciseIdIsActive(body, exerciseId)))
      .then((value) => {
        if (!cancelled) setActive(value);
      });
    return () => {
      cancelled = true;
    };
  }, [category, enabled, exerciseId, learner, subject, topic]);

  return active;
}
