'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { VocabularyShell } from '@/app/components/vocabulary/VocabularyShell';
import { formatStars } from '@/lib/formatStars';
import type { ChildAttemptView } from '@/lib/server/unitTests/store';
import { formatPoints } from '@/lib/unitTests/grading';
import type { Answers, Mark } from '@/lib/unitTests/types';
import { VOCAB_HOME_ROUTE } from '@/lib/vocabulary/constants';
import { sheetSlots, UnitTestSheet } from './UnitTestSheet';

// The child's side of an English unit test (kontrolltöö): answer, save as you
// go, hand in; then wait for the parent, fix what was sent back, and see the
// grade with the right answers. The server owns every rule; this page only
// shows and sends.
//
// Saving: changes are collected and sent one request at a time (never two in
// flight), so a slow answer can never make the next save look stale. If the
// server still answers "stale" (another tab), the page takes the server's
// revision and sends its own unsaved changes again instead of throwing them
// away. Leaving the page (back, closing, switching apps) sends what is left.

type Problem = { message: string; retry?: () => void };

const SAVE_DELAY_MS = 1200;
const REQUEST_TIMEOUT_MS = 15_000;

async function readJson(response: Response) {
  return response.json().catch(() => ({})) as Promise<Record<string, unknown>>;
}

function gradeText(grade: number) {
  return ['', 'nõrk', 'puudulik', 'rahuldav', 'hea', 'väga hea'][grade] ?? '';
}

function answerWord(count: number) {
  return count === 1 ? 'vastus' : 'vastust';
}

async function post(url: string, body: unknown, keepalive = false) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: controller.signal, keepalive });
  } finally {
    clearTimeout(timer);
  }
}

export default function UnitTestRunner({ unitId, attemptId }: { unitId: string; attemptId: string | null }) {
  const [view, setView] = useState<ChildAttemptView | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [problem, setProblem] = useState<Problem | null>(null);
  const [saving, setSaving] = useState<'idle' | 'pending' | 'saving' | 'saved' | 'failed'>('idle');
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const dirty = useRef<Answers>({});
  const revision = useRef(0);
  const viewRef = useRef<ChildAttemptView | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queue = useRef<Promise<boolean>>(Promise.resolve(true));
  const topRef = useRef<HTMLDivElement>(null);
  const shownStatus = useRef<string | null>(null);
  const fixCursor = useRef(-1);

  const accept = useCallback((next: ChildAttemptView, keepLocal = false) => {
    viewRef.current = next;
    setView(next);
    revision.current = next.revision;
    // While answering, edits the server has not seen yet stay on screen.
    setAnswers(keepLocal ? { ...next.answers, ...dirty.current } : next.answers);
    if (!keepLocal) dirty.current = {};
  }, []);

  const load = useCallback(() => {
    setProblem(null);
    const request = attemptId
      ? fetch(`/api/english/unit-tests/${encodeURIComponent(attemptId)}`, { cache: 'no-store' })
      : post('/api/english/unit-tests', { unitId });
    void request
      .then(async (response) => {
        const body = await readJson(response);
        if (response.ok) accept(body as unknown as ChildAttemptView);
        else setProblem({ message: typeof body.message === 'string' ? body.message : 'Midagi läks valesti. Proovi uuesti.', retry: response.status >= 500 ? load : undefined });
      })
      .catch(() => setProblem({ message: 'Kontrolltöö vajab internetiühendust. Kontrolli ühendust ja proovi uuesti.', retry: load }));
  }, [accept, attemptId, unitId]);

  useEffect(load, [load]);

  // One request: the collected changes (and, with submit, handing in).
  const sendNow = useCallback(async (submit: boolean, attempt = 0): Promise<boolean> => {
    const current = viewRef.current;
    if (!current) return false;
    const changes = dirty.current;
    if (!submit && Object.keys(changes).length === 0) return true;
    dirty.current = {};
    setSaving('saving');
    try {
      const response = await post(`/api/english/unit-tests/${encodeURIComponent(current.id)}`, { revision: revision.current, answers: changes, submit });
      const body = await readJson(response);
      if (response.ok) {
        const next = body as unknown as ChildAttemptView;
        revision.current = next.revision;
        if (submit || next.status !== current.status) accept(next);
        else viewRef.current = next;
        setSaving(Object.keys(dirty.current).length > 0 ? 'pending' : 'saved');
        setProblem(null);
        return true;
      }
      dirty.current = { ...changes, ...dirty.current };
      const state = body.state as ChildAttemptView | undefined;
      if (response.status === 409 && state && state.status === current.status && attempt < 2) {
        // Another tab saved in between: take its revision and send ours again.
        revision.current = state.revision;
        viewRef.current = state;
        return sendNow(submit, attempt + 1);
      }
      if (response.status === 409 && state) {
        accept(state);
        setSaving('idle');
        setProblem({ message: typeof body.message === 'string' ? body.message : 'Kontrolltöö on vahepeal muutunud.' });
        return false;
      }
      setSaving('failed');
      setProblem({ message: typeof body.message === 'string' ? body.message : 'Vastuseid ei saanud salvestada. Proovi uuesti.', retry: () => void enqueue(submit) });
      return false;
    } catch {
      dirty.current = { ...changes, ...dirty.current };
      setSaving('failed');
      setProblem({ message: 'Vastuseid ei saanud salvestada. Kontrolli internetiühendust — vastused on alles ja salvestuvad, kui ühendus tuleb tagasi.', retry: () => void enqueue(submit) });
      return false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accept]);

  // Requests go out one after another, never in parallel.
  const enqueue = useCallback((submit: boolean) => {
    if (timer.current) clearTimeout(timer.current);
    const run = queue.current.then(() => sendNow(submit), () => sendNow(submit));
    queue.current = run;
    return run;
  }, [sendNow]);

  const change = useCallback((key: string, value: string) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    dirty.current = { ...dirty.current, [key]: value };
    setSaving('pending');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void enqueue(false), SAVE_DELAY_MS);
  }, [enqueue]);

  // Leaving the page, hiding it or losing the connection must not lose the
  // last answers: send them right away (keepalive survives the page closing).
  useEffect(() => {
    const flush = () => {
      const current = viewRef.current;
      if (!current || Object.keys(dirty.current).length === 0) return;
      if (timer.current) clearTimeout(timer.current);
      const changes = dirty.current;
      void post(`/api/english/unit-tests/${encodeURIComponent(current.id)}`, { revision: revision.current, answers: changes, submit: false }, true)
        .then(async (response) => {
          if (!response.ok) return;
          const next = await readJson(response) as unknown as ChildAttemptView;
          revision.current = next.revision;
          for (const [key, value] of Object.entries(changes)) if (dirty.current[key] === value) delete dirty.current[key];
          setSaving(Object.keys(dirty.current).length > 0 ? 'pending' : 'saved');
        })
        .catch(() => undefined);
    };
    const onVisibility = () => { if (document.visibilityState === 'hidden') flush(); };
    const onOnline = () => { if (Object.keys(dirty.current).length > 0) void enqueue(false); };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('online', onOnline);
    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('online', onOnline);
      flush();
      if (timer.current) clearTimeout(timer.current);
    };
  }, [enqueue]);

  // A new state (handed in, sent back, graded) is announced at the top of the
  // page, where the child cannot see it from the bottom of a long test.
  useEffect(() => {
    if (!view) return;
    if (shownStatus.current !== null && shownStatus.current !== view.status) {
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    shownStatus.current = view.status;
  }, [view]);

  const editable = useMemo(() => (view?.editable === 'all' ? 'all' as const : new Set(view?.editable ?? [])), [view]);
  const marks = useMemo(() => (view?.results ? Object.fromEntries(view.results.map((item) => [item.key, item.mark])) as Record<string, Mark | null> : null), [view]);
  const corrections = useMemo(() => (view?.results ? Object.fromEntries(view.results.flatMap((item) => (item.correct ? [[item.key, item.correct]] : []))) : null), [view]);
  const slots = useMemo(() => (view ? sheetSlots(view.test) : []), [view]);

  const retake = () => {
    setBusy(true);
    void post('/api/english/unit-tests', { unitId })
      .then(async (response) => {
        const body = await readJson(response);
        if (response.ok) {
          accept(body as unknown as ChildAttemptView);
          window.history.replaceState(null, '', `${VOCAB_HOME_ROUTE}/${unitId}/lisatest`);
          window.scrollTo({ top: 0 });
        } else setProblem({ message: typeof body.message === 'string' ? body.message : 'Uut kontrolltööd ei saanud alustada.' });
      })
      .catch(() => setProblem({ message: 'Kontrolltöö vajab internetiühendust.' }))
      .finally(() => setBusy(false));
  };

  if (!view) {
    return (
      <VocabularyShell title='Kontrolltöö'>
        {problem ? (
          <div className='vocab-problem' role='alert'>
            <p>{problem.message}</p>
            {problem.retry ? <button type='button' className='start-button' onClick={problem.retry}>Proovi uuesti</button> : null}
            <Link className='vocab-secondary-button' href={VOCAB_HOME_ROUTE}>Tagasi õppetükkide juurde</Link>
          </div>
        ) : <p className='vocab-loading'>Laadin kontrolltööd…</p>}
      </VocabularyShell>
    );
  }

  const answering = view.status === 'in_progress' || view.status === 'returned';
  // Progress counts answers, not crossword letters: a crossword word counts
  // once, when all its letters are in.
  const openSlots = slots.filter((slot) => editable === 'all' || slot.answerKeys.some((key) => editable.has(key)));
  const isDone = (slot: (typeof slots)[number]) => slot.answerKeys.every((key) => (answers[key] ?? '').trim());
  const doneCount = openSlots.filter(isDone).length;
  const empty = openSlots.length - doneCount;
  const toFix = view.status === 'returned' ? openSlots.length : 0;

  // Answering: the next empty answer. Fixing: the next answer that was sent
  // back, in turn (they are all filled in already).
  const goToNext = () => {
    let target = openSlots.find((slot) => !isDone(slot));
    if (view.status === 'returned' && openSlots.length > 0) {
      fixCursor.current = (fixCursor.current + 1) % openSlots.length;
      target = openSlots[fixCursor.current];
    }
    if (!target) return;
    const node = document.querySelector<HTMLElement>(`[data-slot="${CSS.escape(target.key)}"]`);
    node?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    node?.querySelector<HTMLElement>('input:not([readonly]), button:not([disabled])')?.focus({ preventScroll: true });
  };

  const saveText = saving === 'saving' ? 'Salvestan…' : saving === 'pending' ? 'Salvestamata' : saving === 'saved' ? '✓ Salvestatud' : saving === 'failed' ? '⚠ Salvestamata — proovin uuesti' : '';

  return (
    <VocabularyShell eyebrow={view.unitLabel} title={`Kontrolltöö: ${view.test.title}`}>
      <div ref={topRef} className='ut-top-anchor' />

      {view.status === 'submitted' ? (
        <div className='ut-banner' data-kind='wait' role='status'>
          <strong>Kontrolltöö on ära antud.</strong>
          <p>Ootab vanema kinnitust. Vanem vaatab vastused üle ja annab hinde.</p>
        </div>
      ) : null}

      {view.status === 'returned' ? (
        <div className='ut-banner' data-kind='fix' role='status'>
          <strong>Vanem saatis kontrolltöö parandamiseks.</strong>
          <p>Paranda {toFix} {answerWord(toFix)}, mis on märgitud ✗ või ½. Õigeid vastuseid muuta ei saa.</p>
          {view.comment ? <p className='ut-comment'>„{view.comment}”</p> : null}
        </div>
      ) : null}

      {view.status === 'approved' && view.score ? (
        <div className='ut-banner' data-kind={view.score.passed ? 'pass' : 'fail'} role='status'>
          <p className='ut-grade'><span>Hinne</span><strong>{view.score.grade}</strong><small>{gradeText(view.score.grade)}</small></p>
          <p>{formatPoints(view.score.earned)} / {formatPoints(view.score.total)} punkti · {Math.round((view.score.earned / view.score.total) * 100)}%</p>
          <p>{view.score.passed ? 'Kontrolltöö on sooritatud!' : 'Seekord jäi alla 75%. Vaata allpool õigeid vastuseid ja tee siis uus kontrolltöö.'}</p>
          {view.stars !== null && view.stars > 0 ? <p>Teenitud: <strong>+{formatStars(view.stars)} ⭐</strong></p> : null}
          {view.comment ? <p className='ut-comment'>„{view.comment}”</p> : null}
          {!view.score.passed ? <button type='button' className='start-button' disabled={busy} onClick={retake}>Tee uus kontrolltöö</button> : null}
        </div>
      ) : null}

      <UnitTestSheet
        test={view.test}
        answers={answers}
        onChange={answering ? change : undefined}
        editable={answering ? editable : new Set()}
        marks={view.status === 'returned' || view.status === 'approved' ? marks : null}
        corrections={view.status === 'approved' ? corrections : null}
      />

      {answering ? (
        <div className='ut-submit-bar'>
          {problem ? (
            <div className='ut-bar-problem' role='alert'>
              <p>{problem.message}</p>
              {problem.retry ? <button type='button' className='vocab-secondary-button' onClick={() => { setProblem(null); problem.retry?.(); }}>Proovi uuesti</button> : null}
            </div>
          ) : null}
          <div className='ut-bar-row'>
            <span className='ut-progress' aria-live='polite'>
              <strong>{doneCount} / {openSlots.length}</strong> vastatud
              <small>{saveText}</small>
            </span>
            {empty > 0 || (view.status === 'returned' && openSlots.length > 0) ? <button type='button' className='vocab-secondary-button ut-next-button' onClick={goToNext}>{view.status === 'returned' ? 'Järgmine parandada' : 'Järgmine tühi'}</button> : null}
          </div>
          {confirming ? (
            <div className='ut-confirm' role='alertdialog' aria-label='Kas annad kontrolltöö ära?'>
              <p>{empty > 0 ? `${empty} ${answerWord(empty)} on veel tühi. Kas annad kontrolltöö ikkagi ära?` : 'Kas annad kontrolltöö ära? Pärast seda vaatab vanem selle üle.'}</p>
              <div className='vocab-actions'>
                <button type='button' className='start-button' disabled={busy} onClick={() => { setBusy(true); void enqueue(true).finally(() => { setBusy(false); setConfirming(false); }); }}>{busy ? 'Annan ära…' : 'Jah, annan ära'}</button>
                <button type='button' className='vocab-secondary-button' disabled={busy} onClick={() => setConfirming(false)}>Tagasi kontrolltöö juurde</button>
              </div>
            </div>
          ) : (
            <button type='button' className='start-button' onClick={() => setConfirming(true)}>{view.status === 'returned' ? 'Saada parandused' : 'Anna kontrolltöö ära'}</button>
          )}
        </div>
      ) : (
        <>
          {problem ? <div className='vocab-problem' role='alert'><p>{problem.message}</p></div> : null}
          <Link className='vocab-secondary-button' href={VOCAB_HOME_ROUTE}>Tagasi õppetükkide juurde</Link>
        </>
      )}
    </VocabularyShell>
  );
}
