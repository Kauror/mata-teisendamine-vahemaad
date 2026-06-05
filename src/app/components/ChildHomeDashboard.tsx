import Link from 'next/link';
import DailyTasksPanel from '@/app/components/DailyTasksPanel';
import { ChildExerciseCard } from '@/lib/childExerciseCards';
import { Learner } from '@/lib/tasks';

type ChildProfile = {
  learner: Learner;
  name: string;
  avatar: string;
};

export default function ChildHomeDashboard({
  child,
  exercises,
  remediationHref,
  completedExerciseIds
}: {
  child: ChildProfile;
  exercises: ChildExerciseCard[];
  remediationHref?: string;
  completedExerciseIds?: Set<string>;
}) {
  return (
    <main className='container child-home-page'>
      <section className='child-home-shell'>
        <Link className='child-home-back' href='/'>← Rollivalik</Link>

        <header className='child-home-header'>
          <span className='child-home-avatar' aria-hidden>{child.avatar}</span>
          <div>
            <h1>{child.name}</h1>
            <p>Vali harjutus</p>
          </div>
        </header>

        <DailyTasksPanel learner={child.learner} />

        <section className='child-exercise-section' aria-labelledby={`${child.learner}-exercise-title`}>
          <h2 id={`${child.learner}-exercise-title`}>Harjutused</h2>
          <div className='child-exercise-grid'>
            {remediationHref ? (
              <Link className='child-exercise-card' data-accent='green' href={remediationHref}>
                <span className='child-exercise-icon' aria-hidden>↻</span>
                <span className='child-exercise-copy'>
                  <strong>Kordamine</strong>
                  <small>Harjuta uuesti neid ülesandeid, mis vajavad veel tähelepanu.</small>
                </span>
              </Link>
            ) : null}

            {exercises.map((exercise) => (
              <Link key={exercise.id} className='child-exercise-card' data-accent={exercise.accent} href={exercise.route}>
                {completedExerciseIds?.has(exercise.id) ? <span className='done-today-marker' aria-label='Täna tehtud'>✓</span> : null}
                <span className='child-exercise-icon' aria-hidden>{exercise.emoji}</span>
                <span className='child-exercise-copy'>
                  <strong>{exercise.title}</strong>
                  {exercise.description ? <small>{exercise.description}</small> : null}
                </span>
              </Link>
            ))}
          </div>
          {exercises.length === 0 && !remediationHref ? <p className='recent-empty'>Harjutusi ei ole praegu aktiivne.</p> : null}
        </section>
      </section>
    </main>
  );
}
