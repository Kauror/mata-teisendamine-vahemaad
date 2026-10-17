'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TEXTBOOK_PAGES, type ParentCourseView, type ParentOverviewResponse, type ParentUnitDetailResponse, type ParentUnitProgress, type ParentUnitView } from '@/lib/textbook/api';
import type { ValidationIssue } from '@/lib/textbook/validator';
import { correctResponseFor } from '@/lib/textbook/grading';
import { createParentTextbookClient } from '@/app/components/textbook/textbookClient';
import { ANSWER_TYPE_LABELS, describeResponse, viewFromSpec } from '@/app/components/textbook/responses';
import { correctWord, pagesLabel, questionCountWord, timesWord } from '@/app/components/textbook/status';
import { useParentApi, useParentSaving } from '@/app/components/parent/useParentApi';

// "Loodusõpetuse õppetükid": every textbook unit incl. drafts and the
// preview-only demo, with validity, publication, manual unlock, the children's
// progress, the questions with their answers (parent only) and the preview.
// Self-loading like the other panels; every write goes through the shared
// parent wrapper (CSRF) and the one-write-at-a-time guard.

const LEVEL_LABELS = { factual: 'faktiteadmine', understanding: 'mõistmine', application: 'rakendamine' } as const;
const LEARNER_NAMES: Record<string, string> = { kiur: 'Kiur', kirsi: 'Kirsi' };

function formatDate(iso: string | null) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('et-EE', { day: 'numeric', month: 'numeric', year: 'numeric' });
  } catch {
    return iso.slice(0, 10);
  }
}

// The pass rule in integer arithmetic, as the server applies it.
function requiredCorrect(course: ParentCourseView) {
  return Math.ceil((course.settings.testLength * course.settings.passNumerator) / course.settings.passDenominator);
}

function IssueList({ issues }: { issues: ValidationIssue[] }) {
  if (issues.length === 0) return null;
  return (
    <ul className='tb-admin-issues'>
      {issues.map((issue, index) => <li key={`${issue.code}-${index}`} data-severity={issue.severity}>{issue.message}{issue.path ? <small> ({issue.path})</small> : null}</li>)}
    </ul>
  );
}

function validityChip(unit: ParentUnitView) {
  const errors = unit.validation.errors.length;
  const warnings = unit.validation.warnings.length;
  if (unit.contentStatus === 'draft') return { tone: 'muted', text: 'Mustand' };
  if (errors > 0) return { tone: 'warn', text: errors === 1 ? '1 viga' : `${errors} viga` };
  if (warnings > 0) return { tone: 'good', text: warnings === 1 ? 'Korras, 1 hoiatus' : `Korras, ${warnings} hoiatust` };
  return { tone: 'good', text: 'Korras' };
}

function ProgressBlock({ progress }: { progress: ParentUnitProgress }) {
  return (
    <div className='tb-admin-progress' data-learner={progress.learner}>
      <p className='tb-admin-progress-head'><strong>{LEARNER_NAMES[progress.learner] ?? progress.learner}</strong> · {progress.statusLabel}</p>
      <dl className='tb-admin-stats'>
        <div><dt>Lugemine</dt><dd>{progress.lessonsCompleted}/{progress.lessonsRequired}</dd></div>
        <div><dt>Harjutus</dt><dd>{progress.practiceCompleted ? 'tehtud' : 'tegemata'}{progress.practiceRuns > 0 ? ` (${progress.practiceRuns} ${timesWord(progress.practiceRuns)})` : ''}</dd></div>
        <div><dt>Test</dt><dd>{progress.passedAt ? `läbitud ${formatDate(progress.passedAt)}` : progress.attempts.length > 0 ? 'läbimata' : 'tegemata'}</dd></div>
      </dl>
      {progress.attempts.length > 0 ? (
        <ul className='tb-admin-attempts' aria-label='Testi katsed'>
          {progress.attempts.map((attempt) => (
            <li key={attempt.sessionId} data-passed={attempt.passed ? 'true' : 'false'}>
              {attempt.attemptNumber}. katse {formatDate(attempt.submittedAt)}: <strong>{attempt.correct}/{attempt.total}</strong> {correctWord(attempt.correct)} – {attempt.passed ? 'läbitud' : 'läbimata'}
            </li>
          ))}
        </ul>
      ) : null}
      {progress.weakObjectives.length > 0 ? (
        <div className='tb-admin-weak'>
          <p>Korduvalt eksitud teemad:</p>
          <ul>{progress.weakObjectives.map((objective) => <li key={objective.objectiveId}>{objective.description} – {objective.missCount} {timesWord(objective.missCount)}</li>)}</ul>
        </div>
      ) : null}
    </div>
  );
}

function UnitQuestions({ detail }: { detail: ParentUnitDetailResponse }) {
  const objectives = useMemo(() => new Map(detail.objectives.map((objective) => [objective.id, objective])), [detail.objectives]);
  return (
    <div className='tb-admin-detail'>
      {detail.objectives.length > 0 ? (
        <>
          <h4>Õpieesmärgid</h4>
          <ul className='tb-admin-objectives'>
            {detail.objectives.map((objective) => <li key={objective.id}>{objective.description}{objective.required ? '' : ' (valikuline)'}</li>)}
          </ul>
        </>
      ) : null}
      {detail.lessons.length > 0 ? (
        <>
          <h4>Õppetükid</h4>
          <ul className='tb-admin-objectives'>
            {detail.lessons.map((lesson) => <li key={lesson.id}>{lesson.order}. {lesson.title} – {lesson.sections.length} osa{lesson.required ? '' : ', valikuline'}</li>)}
          </ul>
        </>
      ) : null}
      <h4>Küsimused ({detail.questions.length})</h4>
      {detail.questions.length === 0 ? <p className='tb-muted'>Küsimusi veel ei ole.</p> : (
        <ol className='tb-admin-questions'>
          {detail.questions.map((question) => {
            const view = viewFromSpec(question.answer);
            const lines = describeResponse(view, correctResponseFor(question.answer));
            const uses = [question.eligibility.practice ? 'harjutus' : '', question.eligibility.test ? 'test' : ''].filter(Boolean).join(' + ');
            return (
              <li key={question.id} data-question-id={question.id}>
                <p className='tb-admin-question-stem'>{question.stem}</p>
                <p className='tb-admin-question-meta'>{ANSWER_TYPE_LABELS[question.answer.type]} · {LEVEL_LABELS[question.cognitiveLevel]} · {uses} · rühm {question.variantGroupId}</p>
                <p className='tb-admin-question-meta'>Eesmärk: {objectives.get(question.primaryObjectiveId)?.description ?? question.primaryObjectiveId}</p>
                <div className='tb-admin-answer'><strong>Õige vastus:</strong><ul>{lines.map((line, index) => <li key={index}>{line}</li>)}</ul></div>
                <p className='tb-admin-question-meta'>Selgitus: {question.explanation}</p>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function UnitRow({ course, unit, onChanged }: { course: ParentCourseView; unit: ParentUnitView; onChanged: (unit: ParentUnitView) => void }) {
  const api = useParentApi();
  const saving = useParentSaving();
  const client = useMemo(() => createParentTextbookClient((input, init) => api.request(input, init)), [api]);
  const [problems, setProblems] = useState<ValidationIssue[] | null>(null);
  const [detail, setDetail] = useState<ParentUnitDetailResponse | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const chip = validityChip(unit);
  const pages = pagesLabel(unit.pages);
  const issueCount = unit.validation.errors.length + unit.validation.warnings.length;

  const publish = (published: boolean) => api.guarded(async () => {
    setProblems(null);
    const result = await client.publish(course.courseId, unit.unitId, published);
    if (result.ok) {
      onChanged(result.data.unit);
      api.setNotice(published ? 'Õppetükk on avaldatud.' : 'Õppetükk on peidetud. Lapse edenemine jääb alles.');
      return;
    }
    setProblems(result.error.problems ?? []);
    api.setError(result.error.message);
  });

  const unlock = (unlocked: boolean) => api.guarded(async () => {
    const result = await client.unlock(course.courseId, unit.unitId, unlocked);
    if (result.ok) {
      onChanged(result.data.unit);
      api.setNotice(unlocked ? 'Õppetükk on käsitsi avatud.' : 'Käsitsi avamine on eemaldatud.');
    } else {
      api.setError(result.error.message);
    }
  });

  const toggleDetail = async () => {
    if (detailOpen) {
      setDetailOpen(false);
      return;
    }
    setDetailOpen(true);
    if (detail) return;
    const result = await client.unit(course.courseId, unit.unitId);
    if (result.ok) setDetail(result.data);
    else api.setError(result.error.message);
  };

  return (
    <article className='tb-admin-unit' data-unit-id={unit.unitId} data-content-status={unit.contentStatus} data-waiting={course.waitingForPublish?.unitId === unit.unitId ? 'true' : undefined}>
      <div className='tb-admin-unit-head'>
        <strong>{unit.number}. {unit.title}</strong>
        <span className='tb-admin-chips'>
          <span className='tb-admin-chip' data-tone={chip.tone}>{chip.text}</span>
          {!course.previewOnly ? <span className='tb-admin-chip' data-tone={unit.published ? 'good' : 'muted'}>{unit.published ? 'Avaldatud' : 'Avaldamata'}</span> : null}
          {unit.manualUnlock ? <span className='tb-admin-chip' data-tone='warn'>Käsitsi avatud</span> : null}
        </span>
      </div>
      <p className='tb-admin-meta'>
        {[pages ? `Õpik ${pages}` : '', unit.pages?.note ?? '', `sisu versioon ${unit.contentVersion}`, unit.publishedAt && unit.published ? `avaldatud ${formatDate(unit.publishedAt)}` : ''].filter(Boolean).join(' · ')}
      </p>
      {course.waitingForPublish?.unitId === unit.unitId ? <p className='tb-admin-waiting'>Laps on kõik avaldatud õppetükid läbinud ja ootab seda.</p> : null}

      <div className='tb-admin-actions'>
        {!course.previewOnly ? (
          unit.published
            ? <button type='button' className='filter-chip' disabled={saving} onClick={() => void publish(false)}>Peida lapse eest</button>
            : <button type='button' className='filter-chip' disabled={saving} onClick={() => void publish(true)}>Avalda</button>
        ) : null}
        {!course.previewOnly && unit.published ? (
          <button type='button' className='filter-chip' disabled={saving} onClick={() => void unlock(!unit.manualUnlock)}>{unit.manualUnlock ? 'Eemalda käsitsi avamine' : 'Ava käsitsi'}</button>
        ) : null}
        {unit.contentStatus === 'ready' ? <Link className='filter-chip tb-admin-link' href={TEXTBOOK_PAGES.previewUnit(course.courseId, unit.unitId)}>Eelvaade</Link> : null}
        <button type='button' className='filter-chip' aria-expanded={detailOpen} onClick={() => void toggleDetail()}>{detailOpen ? 'Peida küsimused' : 'Vaata küsimusi'}</button>
      </div>

      {problems !== null ? (
        <div className='tb-admin-problems' role='alert'>
          <p>Avaldada ei saa. Sisu kontroll leidis need probleemid:</p>
          {problems.length > 0 ? <IssueList issues={problems} /> : <IssueList issues={unit.validation.errors} />}
        </div>
      ) : null}

      {issueCount > 0 ? (
        <details className='tb-admin-validation'>
          <summary>Sisu kontroll: {unit.validation.errors.length} viga, {unit.validation.warnings.length} {unit.validation.warnings.length === 1 ? 'hoiatus' : 'hoiatust'}</summary>
          <IssueList issues={[...unit.validation.errors, ...unit.validation.warnings]} />
        </details>
      ) : null}

      {unit.progress.length > 0 ? unit.progress.map((progress) => <ProgressBlock key={progress.learner} progress={progress} />) : null}

      {detailOpen ? (detail ? <UnitQuestions detail={detail} /> : <p className='tb-muted'>Laadin…</p>) : null}
    </article>
  );
}

function PreviewTools({ course }: { course: ParentCourseView }) {
  const api = useParentApi();
  const saving = useParentSaving();
  const [confirming, setConfirming] = useState(false);
  const reset = () => api.guarded(async () => {
    const result = await createParentTextbookClient((input, init) => api.request(input, init)).previewReset(course.courseId);
    setConfirming(false);
    if (result.ok) api.setNotice('Eelvaade on lähtestatud. Laste andmeid ei muudetud.');
    else api.setError(result.error.message);
  });
  return (
    <div className='tb-admin-preview'>
      <Link className='filter-chip tb-admin-link' href={TEXTBOOK_PAGES.previewCourse(course.courseId)}>Ava eelvaade</Link>
      {confirming ? (
        <span className='tb-admin-confirm' role='alertdialog' aria-label='Kas lähtestan eelvaate?'>
          <span>Kas lähtestan eelvaate?</span>
          <button type='button' className='filter-chip' disabled={saving} onClick={() => void reset()}>Jah, lähtesta</button>
          <button type='button' className='filter-chip' disabled={saving} onClick={() => setConfirming(false)}>Ei</button>
        </span>
      ) : (
        <button type='button' className='filter-chip' disabled={saving} onClick={() => setConfirming(true)}>Lähtesta eelvaade</button>
      )}
    </div>
  );
}

export function TextbookPanel({ onSummary }: { onSummary?: (summary: string) => void }) {
  const api = useParentApi();
  const [overview, setOverview] = useState<ParentOverviewResponse | null>(null);
  const [failed, setFailed] = useState('');
  const client = useMemo(() => createParentTextbookClient((input, init) => api.request(input, init)), [api]);

  const load = useCallback(async () => {
    setFailed('');
    const result = await client.overview();
    if (result.ok) setOverview(result.data);
    else setFailed(result.error.message);
  }, [client]);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    if (!overview || !onSummary) return;
    const units = overview.courses.filter((course) => !course.previewOnly).flatMap((course) => course.units);
    const published = units.filter((unit) => unit.published).length;
    onSummary(`${published}/${units.length} avaldatud`);
  }, [onSummary, overview]);

  const replaceUnit = (courseId: string, next: ParentUnitView) => {
    setOverview((current) => current && {
      courses: current.courses.map((course) => course.courseId !== courseId ? course : { ...course, units: course.units.map((unit) => (unit.unitId === next.unitId ? next : unit)) })
    });
  };

  if (failed) {
    return (
      <div className='tb-admin' role='alert'>
        <p>{failed}</p>
        <button type='button' className='filter-chip' onClick={() => void load()}>Proovi uuesti</button>
      </div>
    );
  }
  if (!overview) return <p>Laadin...</p>;

  return (
    <div className='tb-admin'>
      <p className='tb-muted'>Mustandit ei saa avaldada. Enne avaldamist vaata õppetükk eelvaates läbi – eelvaade ei muuda laste andmeid.</p>
      {overview.courses.map((course) => (
        <section key={course.courseId} className='tb-admin-course' data-course-id={course.courseId} aria-labelledby={`tb-admin-${course.courseId}`}>
          <div className='tb-admin-unit-head'>
            <h3 id={`tb-admin-${course.courseId}`}>{course.title}</h3>
            {course.previewOnly ? <span className='tb-admin-chip' data-tone='muted'>Ainult eelvaade</span> : null}
          </div>
          <p className='tb-admin-meta'>
            {course.previewOnly ? 'Näidissisu: lapsed seda ei näe.' : `Õppija: ${course.learners.map((learner) => LEARNER_NAMES[learner] ?? learner).join(', ')}`}
            {' · '}test {course.settings.testLength} {questionCountWord(course.settings.testLength)}, läbimiseks {requiredCorrect(course)} {correctWord(requiredCorrect(course))}
          </p>
          <PreviewTools course={course} />
          <div className='tb-admin-units'>
            {course.units.map((unit) => <UnitRow key={unit.unitId} course={course} unit={unit} onChanged={(next) => replaceUnit(course.courseId, next)} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
