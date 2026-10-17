'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { CourseOverviewResponse, TextbookScope, UnitSummary } from '@/lib/textbook/api';
import { createParentTextbookClient } from '@/app/components/textbook/textbookClient';
import { textbookPaths, type TextbookPaths } from '@/app/components/textbook/pages';
import { lockExplanation, pagesLabel, statusLabel, unitCardActions, unitProgressLine, UNIT_STATUS_ICONS } from '@/app/components/textbook/status';
import { TextbookLoading, TextbookProblem, TextbookShell } from '@/app/components/textbook/TextbookShell';
import { textbookRequest, useLearnerClient, useTextbookLoad } from '@/app/components/textbook/useTextbook';

function UnitCard({ unit, units, paths }: { unit: UnitSummary; units: UnitSummary[]; paths: TextbookPaths }) {
  const actions = unitCardActions(unit, paths);
  const progress = unitProgressLine(unit);
  const pages = pagesLabel(unit.pages);
  return (
    <article className='tb-unit-card' data-status={unit.status} data-unit-id={unit.unitId} aria-labelledby={`tb-unit-${unit.unitId}`}>
      <div className='tb-unit-head'>
        <h2 id={`tb-unit-${unit.unitId}`}><span className='tb-unit-number'>{unit.number}.</span> {unit.title}</h2>
        <span className='tb-status-chip' data-status={unit.status}><span aria-hidden>{UNIT_STATUS_ICONS[unit.status]}</span> {statusLabel(unit.status)}</span>
      </div>
      {pages || progress ? <p className='tb-unit-meta'>{[pages ? `Õpik ${pages}` : '', progress].filter(Boolean).join(' · ')}</p> : null}
      {unit.status === 'locked' ? <p className='tb-unit-lock'>{lockExplanation(units, unit.unitId)}</p> : null}
      {actions.length > 0 ? (
        <div className='tb-unit-actions'>
          {actions.map((action) => (
            <Link key={action.label} className={action.primary ? 'tb-button tb-button-primary' : 'tb-button'} href={action.href}>{action.label}</Link>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function PreviewResetButton({ courseId, onDone }: { courseId: string; onDone: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const reset = async () => {
    setBusy(true);
    const result = await createParentTextbookClient(textbookRequest('preview')).previewReset(courseId);
    setBusy(false);
    setConfirming(false);
    if (result.ok) {
      setMessage('Eelvaade on lähtestatud.');
      onDone();
    } else {
      setMessage(result.error.message);
    }
  };
  return (
    <div className='tb-preview-reset'>
      {confirming ? (
        <div className='tb-confirm' role='alertdialog' aria-labelledby='tb-preview-reset-q'>
          <p id='tb-preview-reset-q'>Kas kustutan eelvaate edenemise? Laste andmeid see ei puuduta.</p>
          <div className='tb-actions'>
            <button type='button' className='tb-button tb-button-danger' disabled={busy} onClick={() => void reset()}>Jah, lähtesta</button>
            <button type='button' className='tb-button' disabled={busy} onClick={() => setConfirming(false)}>Ei</button>
          </div>
        </div>
      ) : (
        <button type='button' className='tb-button' onClick={() => { setMessage(''); setConfirming(true); }}>Lähtesta eelvaade</button>
      )}
      {message ? <p className='tb-notice' role='status'>{message}</p> : null}
    </div>
  );
}

export default function TextbookCourse({ scope, courseId }: { scope: TextbookScope; courseId: string }) {
  const client = useLearnerClient(scope);
  const paths = textbookPaths(scope, courseId);
  // The preview opens through "start" (it prepares the isolated preview
  // learner); the child reads the overview.
  const { data, error, loading, reload } = useTextbookLoad<CourseOverviewResponse>(
    () => (scope === 'preview' ? createParentTextbookClient(textbookRequest('preview')).previewStart(courseId) : client.courseOverview(courseId)),
    [client, courseId, scope]
  );

  return (
    <TextbookShell
      scope={scope}
      eyebrow={scope === 'preview' ? 'Eelvaade' : 'Loodusõpetus'}
      title={data?.course.title ?? 'Õpiku õppetükid'}
      backHref={paths.home}
      backLabel={scope === 'preview' ? '← Vanema ala' : '← Loodusõpetus'}
    >
      {error ? (
        <TextbookProblem error={error} onRetry={() => void reload()} backHref={paths.home} backLabel='Tagasi' />
      ) : loading && !data ? (
        <TextbookLoading text='Laadin õppetükke…' />
      ) : data ? (
        <>
          {scope === 'preview' ? (
            <>
              <p className='tb-hint'>Ka eelvaates avanevad õppetükid järjest: järgmine avaneb, kui eelmise test on läbitud. Alustamiseks otsast peale lähtesta eelvaade.</p>
              <PreviewResetButton courseId={courseId} onDone={() => void reload()} />
            </>
          ) : null}
          {data.units.length === 0 ? (
            <p className='tb-empty'>Õppetükke veel ei ole. Need ilmuvad siia, kui vanem on need avaldanud.</p>
          ) : (
            <>
              {data.allUnitsPassed ? <p className='tb-empty tb-all-passed' role='status'>Kõik õppetükid on läbitud. Tubli! Uued õppetükid ilmuvad siia, kui vanem need avaldab.</p> : null}
              <div className='tb-unit-list'>
                {data.units.map((unit) => <UnitCard key={unit.unitId} unit={unit} units={data.units} paths={paths} />)}
              </div>
            </>
          )}
        </>
      ) : null}
    </TextbookShell>
  );
}
