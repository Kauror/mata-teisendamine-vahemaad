'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { ChildExerciseCard } from '@/lib/childExerciseCards';
import { questionWord } from '@/lib/history';
import type { Learner } from '@/lib/shared/types';
import { getTodaysExercisesOffline } from '@/lib/offline/api';

// Renders the child's exercise cards. Server-rendered props are the initial view;
// on the client it recomputes today's cards from the cached catalogue so a new
// Tallinn day (or an offline launch of a stale cached shell) still shows the
// correct deterministic rotation.
export default function ChildExerciseGrid({
  learner,
  initialExercises,
  remediationHref,
  remediationCount,
  completedExerciseIds
}: {
  learner: Learner;
  initialExercises: ChildExerciseCard[];
  remediationHref?: string;
  remediationCount?: number;
  completedExerciseIds?: string[];
}) {
  const [exercises, setExercises] = useState<ChildExerciseCard[]>(initialExercises);
  const done = new Set(completedExerciseIds ?? []);

  useEffect(() => {
    let cancelled = false;
    void getTodaysExercisesOffline(learner).then((result) => {
      if (cancelled || !result || result.cards.length === 0) return;
      setExercises(result.cards);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [learner]);

  return (
    <section className='child-exercise-section' aria-labelledby={`${learner}-exercise-title`}>
      <h2 id={`${learner}-exercise-title`}>Harjutused</h2>
      <div className='child-exercise-grid'>
        {exercises.map((exercise) => (
          <Link key={exercise.id} className='child-exercise-card' data-accent={exercise.accent} href={exercise.route}>
            {done.has(exercise.id) ? <span className='done-today-marker' aria-label='Täna tehtud'>✓</span> : null}
            <span className='child-exercise-icon' aria-hidden>{exercise.emoji}</span>
            <span className='child-exercise-copy'>
              <strong>{exercise.title}</strong>
              {exercise.description ? <small>{exercise.description}</small> : null}
            </span>
          </Link>
        ))}

        {remediationHref ? (
          <Link className='child-exercise-card' data-accent='green' href={remediationHref}>
            {/* The pool can hold more than one session's worth: a round is always
                REMEDIATION_QUESTION_COUNT questions, this counts everything waiting. */}
            {remediationCount ? <span className='exercise-count-marker' aria-label={`${remediationCount} ${questionWord(remediationCount)} ootab kordamist`}>{remediationCount}</span> : null}
            <span className='child-exercise-icon' aria-hidden>↻</span>
            <span className='child-exercise-copy'>
              <strong>Kordamine</strong>
              <small>Harjuta uuesti neid ülesandeid, mis vajavad veel tähelepanu.</small>
            </span>
          </Link>
        ) : null}
      </div>
      {exercises.length === 0 && !remediationHref ? <p className='recent-empty'>Harjutusi ei ole praegu aktiivne.</p> : null}
    </section>
  );
}
