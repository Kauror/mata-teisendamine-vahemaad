'use client';

import Link from 'next/link';
import type { TextbookScope, UnitDetailResponse } from '@/lib/textbook/api';
import { textbookPaths } from '@/app/components/textbook/pages';
import { correctWord, nextAction, pagesLabel, unitSteps } from '@/app/components/textbook/status';
import { TextbookLoading, TextbookProblem, TextbookShell } from '@/app/components/textbook/TextbookShell';
import { useLearnerClient, useTextbookLoad } from '@/app/components/textbook/useTextbook';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('et-EE', { day: 'numeric', month: 'long' });
  } catch {
    return iso.slice(0, 10);
  }
}

export function UnitStepper({ detail }: { detail: Pick<UnitDetailResponse, 'gates' | 'unit' | 'nextStep'> }) {
  const steps = unitSteps(detail);
  return (
    <ol className='tb-stepper' aria-label='Õppetüki sammud'>
      {steps.map((step, index) => (
        <li key={step.key} className='tb-step' data-state={step.state} aria-current={step.state === 'current' ? 'step' : undefined}>
          <span className='tb-step-dot' aria-hidden>{step.state === 'done' ? '✓' : index + 1}</span>
          <span className='tb-step-label'>{step.label}</span>
          <span className='sr-only'>{step.state === 'done' ? ' – tehtud' : step.state === 'current' ? ' – praegu' : ''}</span>
        </li>
      ))}
    </ol>
  );
}

export default function TextbookUnit({ scope, courseId, unitId }: { scope: TextbookScope; courseId: string; unitId: string }) {
  const client = useLearnerClient(scope);
  const paths = textbookPaths(scope, courseId);
  const { data, error, loading, reload } = useTextbookLoad<UnitDetailResponse>(() => client.unitDetail(courseId, unitId), [client, courseId, unitId]);

  if (error || (loading && !data) || !data) {
    return (
      <TextbookShell scope={scope} backHref={paths.course} backLabel='← Õppetükid' title='Õppetükk'>
        {error ? <TextbookProblem error={error} onRetry={() => void reload()} backHref={paths.course} backLabel='Tagasi õppetükkide juurde' /> : <TextbookLoading text='Laadin õppetükki…' />}
      </TextbookShell>
    );
  }

  const { unit, gates } = data;
  const action = nextAction(data, paths);
  const pages = pagesLabel(unit.pages);

  return (
    <TextbookShell scope={scope} title={`${unit.number}. ${unit.title}`} titleNote={pages ? `õpik ${pages}` : undefined} backHref={paths.course} backLabel='← Õppetükid'>
      {/* The steps say where the child is; a status chip on top only repeated it. */}
      <UnitStepper detail={data} />

      <section className='tb-next-card' data-next-step={data.nextStep} aria-labelledby='tb-next-title'>
        <h2 id='tb-next-title'>{data.nextStep === 'done' ? '✓ Läbitud' : `Järgmisena: ${action.title}`}</h2>
        <p>{action.text}</p>
        {data.nextStep === 'retake_practice' && data.missedObjectives.length > 0 ? (
          <ul className='tb-objective-list'>{data.missedObjectives.map((objective) => <li key={objective.objectiveId}>{objective.description}</li>)}</ul>
        ) : null}
        {action.href && action.label ? <Link className='tb-button tb-button-primary tb-button-wide' href={action.href}>{action.label}</Link> : null}
        {data.nextStep === 'done' && data.nextUnit ? (
          <Link className='tb-button tb-button-wide' href={paths.unit(data.nextUnit.unitId)}>Järgmine õppetükk: {data.nextUnit.title}</Link>
        ) : null}
      </section>

      <section className='tb-panel' aria-labelledby='tb-lessons-title'>
        <h2 id='tb-lessons-title'>📖 Õpi</h2>
        <ul className='tb-lesson-list'>
          {data.lessons.map((lesson) => (
            <li key={lesson.lessonId} className='tb-lesson-row' data-completed={lesson.completed ? 'true' : undefined}>
              <span className='tb-lesson-state' aria-hidden>{lesson.completed ? '✓' : '○'}</span>
              <span className='tb-lesson-copy'>
                <strong>{lesson.title}</strong>
                <small>{lesson.completed ? 'Loetud' : lesson.required ? 'Lugemata' : 'Valikuline'}{lesson.sectionCount > 1 ? ` · ${lesson.sectionCount} osa` : ''}</small>
              </span>
              <Link className='tb-button tb-button-small' href={paths.lesson(unit.unitId, lesson.lessonId)}>{lesson.completed ? 'Loe uuesti' : 'Loe'}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className='tb-panel' aria-labelledby='tb-practice-title'>
        <h2 id='tb-practice-title'>✏️ Harjuta</h2>
        {gates.practiceUnlocked && data.activeTestSessionId ? (
          <p className='tb-locked-note'>📝 Test on pooleli. Lõpeta enne harjutamist test.</p>
        ) : gates.practiceUnlocked ? (
          <>
            <p>{gates.retakePracticePending ? 'Enne uut testi harjuta teemasid, mis testis ei õnnestunud.' : unit.practiceCompleted ? 'Harjutus on tehtud. Võid alati uuesti harjutada.' : 'Iga vastuse järel näed kohe, kas see oli õige ja miks.'}</p>
            <Link className='tb-button' href={paths.practice(unit.unitId)}>{data.activePracticeSessionId ? 'Jätka harjutamist' : unit.practiceCompleted && !gates.retakePracticePending ? 'Harjuta uuesti' : 'Harjuta'}</Link>
          </>
        ) : (
          <p className='tb-locked-note'>🔒 Avaneb, kui kõik kohustuslikud õppetükid on loetud.</p>
        )}
      </section>

      <section className='tb-panel' aria-labelledby='tb-test-title'>
        <h2 id='tb-test-title'>📝 Test</h2>
        {gates.testUnlocked ? (
          <>
            <p>{unit.testPassed ? 'Test on läbitud. Võid testi soovi korral uuesti teha.' : 'Testis vastuseid kohe ei kontrollita. Tulemuse näed pärast esitamist.'}{data.activePracticeSessionId && !data.activeTestSessionId ? ' Kui alustad testi, lõpeb pooleli harjutus.' : ''}</p>
            <Link className='tb-button' href={paths.test(unit.unitId)}>{data.activeTestSessionId ? 'Jätka testi' : data.attempts.length > 0 ? 'Tee test uuesti' : 'Tee test'}</Link>
          </>
        ) : (
          <p className='tb-locked-note'>🔒 {gates.retakePracticePending ? 'Avaneb uuesti, kui oled korratavaid teemasid harjutanud.' : 'Avaneb, kui harjutus on tehtud.'}</p>
        )}
        {data.attempts.length > 0 ? (
          <ul className='tb-attempt-list' aria-label='Testi katsed'>
            {data.attempts.map((attempt) => (
              <li key={attempt.sessionId} data-passed={attempt.passed ? 'true' : 'false'}>
                <span>{attempt.attemptNumber}. katse · {formatDate(attempt.submittedAt)}</span>
                <strong>{attempt.correct}/{attempt.total} {correctWord(attempt.correct)} · {attempt.passed ? 'läbitud' : 'jäi läbimata'}</strong>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {data.objectives.length > 0 ? (
        <details className='tb-panel tb-objectives'>
          <summary>🎯 Mida sa õpid</summary>
          <ul className='tb-objective-list'>{data.objectives.map((objective) => <li key={objective.objectiveId}>{objective.description}</li>)}</ul>
        </details>
      ) : null}
    </TextbookShell>
  );
}
