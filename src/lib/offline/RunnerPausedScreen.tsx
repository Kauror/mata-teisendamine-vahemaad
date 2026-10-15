'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

type RunnerPausedScreenProps = {
  message: string;
  backHref: string;
} & (
  // The question-card runners (/test, science test).
  | { variant: 'test' }
  // The practice-shell runners (reading, sprints, first sound).
  | { variant: 'practice'; mainClassName: string; shellClassName: string; title?: string }
);

// Shown when a runner can no longer save safely to the device: the run is
// paused, nothing is lost, and the child can retry or go back.
export default function RunnerPausedScreen(props: RunnerPausedScreenProps) {
  const router = useRouter();
  const retry = () => window.location.reload();

  if (props.variant === 'test') {
    return (
      <main className='test-page'>
        <section className='test-shell'>
          <section className='question-card' role='alert'>
            <h2>Harjutus on peatatud</h2>
            <p>{props.message}</p>
            <button type='button' className='next-button' onClick={retry}>Proovi salvestust uuesti</button>
            <button type='button' className='stop-button' onClick={() => router.push(props.backHref)}>Tagasi</button>
          </section>
        </section>
      </main>
    );
  }

  return (
    <main className={props.mainClassName}>
      <section className={props.shellClassName} role='alert'>
        <h1>{props.title ?? 'Harjutus on peatatud'}</h1>
        <p>{props.message}</p>
        <button type='button' className='start-button' onClick={retry}>Proovi salvestust uuesti</button>
        <Link className='practice-back-button' href={props.backHref}>Tagasi harjutuste juurde</Link>
      </section>
    </main>
  );
}
