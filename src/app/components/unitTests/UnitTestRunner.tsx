'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { VocabularyShell } from '@/app/components/vocabulary/VocabularyShell';
import { formatStars } from '@/lib/formatStars';
import type { ChildAttemptView } from '@/lib/server/unitTests/store';
import { formatPoints } from '@/lib/unitTests/grading';
import type { Answers, Mark } from '@/lib/unitTests/types';
import { VOCAB_HOME_ROUTE } from '@/lib/vocabulary/constants';
import { sheetAnswerKeys, UnitTestSheet } from './UnitTestSheet';

// The child's side of an English unit test (lisatest): answer, save as you
// go, hand in; then wait for the parent, fix what was sent back, and see the
// grade. The server owns every rule; this page only shows and sends.

type Problem = { message: string; retry?: () => void };

const SAVE_DELAY_MS = 1200;

async function readJson(response: Response) {
  return response.json().catch(() => ({})) as Promise<Record<string, unknown>>;
}

function gradeText(grade: number) {
  return ['', 'nõrk', 'puudulik', 'rahuldav', 'hea', 'väga hea'][grade] ?? '';
}

export default function UnitTestRunner({ unitId, attemptId }: { unitId: string; attemptId: string | null }) {
  const [view, setView] = useState<ChildAttemptView | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [problem, setProblem] = useState<Problem | null>(null);
  const [saving, setSaving] = useState<'idle' | 'pending' | 'saving' | 'saved'>('idle');
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const dirty = useRef<Answers>({});
  const revision = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const accept = useCallback((next: ChildAttemptView) => {
    setView(next);
    setAnswers(next.answers);
    revision.current = next.revision;
    dirty.current = {};
  }, []);

  const handleFailure = useCallback(async (response: Response, retry: () => void) => {
    const body = await readJson(response);
    if (response.status === 409 && body.state) {
      accept(body.state as ChildAttemptView);
      setProblem({ message: typeof body.message === 'string' ? body.message : 'Test on vahepeal muutunud.' });
      return;
    }
    setProblem({ message: typeof body.message === 'string' ? body.message : 'Midagi läks valesti. Proovi uuesti.', retry: response.status >= 500 ? retry : undefined });
  }, [accept]);

  const load = useCallback(() => {
    setProblem(null);
    const request = attemptId
      ? fetch(`/api/english/unit-tests/${encodeURIComponent(attemptId)}`, { cache: 'no-store' })
      : fetch('/api/english/unit-tests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ unitId }) });
    void request
      .then(async (response) => {
        if (response.ok) accept(await response.json() as ChildAttemptView);
        else await handleFailure(response, load);
      })
      .catch(() => setProblem({ message: 'Lisatest vajab internetiühendust. Kontrolli ühendust ja proovi uuesti.', retry: load }));
  }, [accept, attemptId, handleFailure, unitId]);

  useEffect(load, [load]);

  const send = useCallback(async (submit: boolean) => {
    if (!view) return false;
    if (timer.current) clearTimeout(timer.current);
    const changes = dirty.current;
    dirty.current = {};
    setSaving('saving');
    try {
      const response = await fetch(`/api/english/unit-tests/${encodeURIComponent(view.id)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revision: revision.current, answers: changes, submit })
      });
      if (!response.ok) {
        dirty.current = { ...changes, ...dirty.current };
        setSaving('pending');
        await handleFailure(response, () => void send(submit));
        return false;
      }
      const next = await response.json() as ChildAttemptView;
      revision.current = next.revision;
      if (submit || next.status !== view.status) accept(next);
      setSaving(Object.keys(dirty.current).length > 0 ? 'pending' : 'saved');
      return true;
    } catch {
      dirty.current = { ...changes, ...dirty.current };
      setSaving('pending');
      setProblem({ message: 'Vastuseid ei saanud salvestada. Kontrolli internetiühendust.', retry: () => void send(submit) });
      return false;
    }
  }, [accept, handleFailure, view]);

  const change = useCallback((key: string, value: string) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    dirty.current = { ...dirty.current, [key]: value };
    setSaving('pending');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void send(false), SAVE_DELAY_MS);
  }, [send]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const editable = useMemo(() => (view?.editable === 'all' ? 'all' as const : new Set(view?.editable ?? [])), [view]);
  const marks = useMemo(() => (view?.results ? Object.fromEntries(view.results.map((item) => [item.key, item.mark])) as Record<string, Mark | null> : null), [view]);
  const keys = useMemo(() => (view ? sheetAnswerKeys(view.test) : []), [view]);

  const retake = () => {
    setBusy(true);
    void fetch('/api/english/unit-tests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ unitId }) })
      .then(async (response) => {
        if (response.ok) {
          const next = await response.json() as ChildAttemptView;
          accept(next);
          window.history.replaceState(null, '', `${VOCAB_HOME_ROUTE}/${unitId}/lisatest`);
        } else await handleFailure(response, retake);
      })
      .catch(() => setProblem({ message: 'Lisatest vajab internetiühendust.' }))
      .finally(() => setBusy(false));
  };

  if (!view) {
    return (
      <VocabularyShell title='Lisatest'>
        {problem ? (
          <div className='vocab-problem' role='alert'>
            <p>{problem.message}</p>
            {problem.retry ? <button type='button' className='start-button' onClick={problem.retry}>Proovi uuesti</button> : null}
            <Link className='vocab-secondary-button' href={VOCAB_HOME_ROUTE}>Tagasi õppetükkide juurde</Link>
          </div>
        ) : <p className='vocab-loading'>Laadin lisatesti…</p>}
      </VocabularyShell>
    );
  }

  const answering = view.status === 'in_progress' || view.status === 'returned';
  const editableKeys = editable === 'all' ? keys : keys.filter((key) => editable.has(key));
  const empty = editableKeys.filter((key) => !(answers[key] ?? '').trim()).length;

  return (
    <VocabularyShell eyebrow={view.unitLabel} title={`Lisatest: ${view.test.title}`}>
      {problem ? (
        <div className='vocab-problem' role='alert'>
          <p>{problem.message}</p>
          {problem.retry ? <button type='button' className='start-button' onClick={() => { setProblem(null); problem.retry?.(); }}>Proovi uuesti</button> : null}
        </div>
      ) : null}

      {view.status === 'submitted' ? (
        <div className='ut-banner' data-kind='wait' role='status'>
          <strong>Test on ära antud.</strong>
          <p>Ootab vanema kinnitust. Vanem vaatab vastused üle ja annab hinde.</p>
        </div>
      ) : null}

      {view.status === 'returned' ? (
        <div className='ut-banner' data-kind='fix' role='status'>
          <strong>Vanem saatis testi parandamiseks.</strong>
          <p>Paranda vastused, mis ei ole õiged (✗ või ½). Õigeid vastuseid muuta ei saa.</p>
          {view.comment ? <p className='ut-comment'>„{view.comment}”</p> : null}
        </div>
      ) : null}

      {view.status === 'approved' && view.score ? (
        <div className='ut-banner' data-kind={view.score.passed ? 'pass' : 'fail'} role='status'>
          <p className='ut-grade'><span>Hinne</span><strong>{view.score.grade}</strong><small>{gradeText(view.score.grade)}</small></p>
          <p>{formatPoints(view.score.earned)} / {formatPoints(view.score.total)} punkti · {Math.round((view.score.earned / view.score.total) * 100)}%</p>
          <p>{view.score.passed ? 'Lisatest on sooritatud!' : 'Seekord jäi alla 75%. Tee uus test — see võib olla teine variant.'}</p>
          {view.stars !== null && view.stars > 0 ? <p>Teenitud: <strong>+{formatStars(view.stars)} ⭐</strong></p> : null}
          {view.comment ? <p className='ut-comment'>„{view.comment}”</p> : null}
          {!view.score.passed ? <button type='button' className='start-button' disabled={busy} onClick={retake}>Tee uus test</button> : null}
        </div>
      ) : null}

      <UnitTestSheet test={view.test} answers={answers} onChange={answering ? change : undefined} editable={answering ? editable : new Set()} marks={view.status === 'returned' || view.status === 'approved' ? marks : null} />

      {answering ? (
        <div className='ut-submit-bar'>
          <span className='ut-save-state' aria-live='polite'>
            {saving === 'saving' ? 'Salvestan…' : saving === 'pending' ? 'Salvestamata muudatused' : saving === 'saved' ? '✓ Salvestatud' : ''}
          </span>
          {confirming ? (
            <div className='ut-confirm' role='alertdialog' aria-label='Kas annad testi ära?'>
              <p>{empty > 0 ? `${empty === 1 ? '1 vastus on' : `${empty} vastust on`} veel tühi. Kas annad testi ikkagi ära?` : 'Kas annad testi ära? Pärast seda vaatab vanem selle üle.'}</p>
              <div className='vocab-actions'>
                <button type='button' className='start-button' disabled={busy} onClick={() => { setBusy(true); void send(true).finally(() => { setBusy(false); setConfirming(false); }); }}>Jah, annan ära</button>
                <button type='button' className='vocab-secondary-button' onClick={() => setConfirming(false)}>Tagasi testi juurde</button>
              </div>
            </div>
          ) : (
            <button type='button' className='start-button' onClick={() => setConfirming(true)}>{view.status === 'returned' ? 'Saada parandused' : 'Anna test ära'}</button>
          )}
        </div>
      ) : (
        <Link className='vocab-secondary-button' href={VOCAB_HOME_ROUTE}>Tagasi õppetükkide juurde</Link>
      )}
    </VocabularyShell>
  );
}
