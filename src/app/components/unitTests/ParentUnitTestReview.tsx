'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { failureMessage, jsonInit, parentFetch } from '@/app/components/parent/parentApi';
import type { ParentReview } from '@/lib/server/unitTests/store';
import type { ClientUnitTest } from '@/lib/unitTests/clientView';
import { formatPoints, scoreMarks } from '@/lib/unitTests/grading';
import type { AnswerSlot, Mark } from '@/lib/unitTests/types';
import { UnitTestSheet } from './UnitTestSheet';

// The parent's review of a handed-in unit test. Every answer the app could
// check arrives already marked; the parent can change any mark, marks the
// open answers, adds a comment and then approves (grade and stars) or sends
// the test back so the child fixes what was not right.

const BACK = '/vanem';
const NO_EDIT = new Set<string>();

function MarkButtons({ value, auto, onChange }: { value: Mark | null; auto: Mark | null; onChange: (mark: Mark) => void }) {
  const options: Array<{ mark: Mark; label: string; text: string }> = [
    { mark: 1, label: 'Õige', text: '✓' },
    { mark: 0.5, label: 'Pooleldi õige', text: '½' },
    { mark: 0, label: 'Vale', text: '✗' }
  ];
  return (
    <span className='ut-markbar' role='group' aria-label='Hinnang'>
      {options.map((option) => (
        <button key={option.mark} type='button' className='ut-markbutton' data-mark={option.mark} aria-pressed={value === option.mark} aria-label={option.label} onClick={() => onChange(option.mark)}>{option.text}</button>
      ))}
      {auto !== null && value !== auto ? <small className='ut-overruled'>muudetud</small> : null}
    </span>
  );
}

function AcceptedLine({ slot }: { slot: AnswerSlot }) {
  if (slot.accepted.length === 0) return <small className='ut-accepted'>Vaba vastus, hinda ise.</small>;
  const label = slot.check === 'parent' ? 'Näidisvastus' : slot.kind === 'choice' || slot.kind === 'crossword' ? 'Õige' : 'Sobib';
  return <small className='ut-accepted'>{label}: {slot.accepted.slice(0, 6).join(' / ')}{slot.accepted.length > 6 ? ' …' : ''}</small>;
}

export function ParentUnitTestReview({ attemptId }: { attemptId: string }) {
  const [review, setReview] = useState<ParentReview | null>(null);
  const [marks, setMarks] = useState<Record<string, Mark | null>>({});
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'pending' | 'saving' | 'saved'>('idle');
  // The "only what to check" view is fixed when it is switched on: an answer
  // the parent then marks ✓ stays in view instead of jumping away.
  const [hiddenSlots, setHiddenSlots] = useState<Set<string> | null>(null);
  const [confirm, setConfirm] = useState<'approve' | 'cancel' | null>(null);
  const revision = useRef(0);
  const latest = useRef<{ marks: Record<string, Mark | null>; comment: string }>({ marks: {}, comment: '' });
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unsaved = useRef(false);

  const accept = useCallback((next: ParentReview) => {
    setReview(next);
    revision.current = next.revision;
    const nextMarks = Object.fromEntries(next.slots.map((slot) => [slot.key, slot.mark]));
    setMarks(nextMarks);
    setComment(next.comment ?? '');
    latest.current = { marks: nextMarks, comment: next.comment ?? '' };
    unsaved.current = false;
  }, []);

  useEffect(() => {
    void parentFetch(`/api/parent/english-unit-tests/${encodeURIComponent(attemptId)}`, { cache: 'no-store' })
      .then(async (response) => {
        if (response.ok) accept(await response.json() as ParentReview);
        else setError(await failureMessage(response, 'Kontrolltööd ei saanud avada.'));
      })
      .catch(() => setError('Kontrolltööd ei saanud avada. Kontrolli internetiühendust.'));
  }, [accept, attemptId]);

  // One request at a time. 'save' keeps the parent's work while they mark
  // (nothing is lost when the page is left); the decisions end the review.
  const send = useCallback((decision: 'save' | 'approve' | 'return') => {
    if (timer.current) clearTimeout(timer.current);
    const run = queue.current.then(async () => {
      const body = { revision: revision.current, marks: latest.current.marks, comment: latest.current.comment, decision };
      unsaved.current = false;
      if (decision === 'save') setSaveState('saving');
      const response = await parentFetch(`/api/parent/english-unit-tests/${encodeURIComponent(attemptId)}`, jsonInit('POST', body));
      if (response.ok) {
        const next = await response.json() as ParentReview;
        if (decision === 'save') {
          // Keep what the parent marked meanwhile; only the revision and the
          // server's score move on.
          revision.current = next.revision;
          setReview(next);
          setSaveState(unsaved.current ? 'pending' : 'saved');
        } else {
          accept(next);
          setNotice(decision === 'approve' ? 'Kontrolltöö on kinnitatud.' : 'Kontrolltöö saadeti parandamiseks.');
        }
        return true;
      }
      const failure = await response.clone().json().catch(() => ({})) as { state?: ParentReview };
      if (response.status === 409 && failure.state) accept(failure.state);
      unsaved.current = decision === 'save';
      setSaveState(decision === 'save' ? 'pending' : 'idle');
      setError(await failureMessage(response, decision === 'save' ? 'Hindeid ei saanud salvestada.' : 'Toimingut ei saanud teha.'));
      return false;
    }).catch(() => {
      setSaveState('pending');
      setError('Toimingut ei saanud teha. Kontrolli internetiühendust.');
      return false;
    });
    queue.current = run;
    return run;
  }, [accept, attemptId]);

  const scheduleSave = useCallback(() => {
    unsaved.current = true;
    setSaveState('pending');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void send('save'), 1500);
  }, [send]);

  useEffect(() => {
    const flush = () => { if (unsaved.current) void send('save'); };
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      if (timer.current) clearTimeout(timer.current);
      flush();
    };
  }, [send]);

  const setMark = (key: string, mark: Mark) => {
    setMarks((current) => {
      const next = { ...current, [key]: mark };
      latest.current = { ...latest.current, marks: next };
      return next;
    });
    scheduleSave();
  };

  const decide = (decision: 'approve' | 'return') => {
    setBusy(true);
    setError('');
    setNotice('');
    setConfirm(null);
    void send(decision).finally(() => setBusy(false));
  };

  const cancelTest = () => {
    setBusy(true);
    setConfirm(null);
    void parentFetch(`/api/parent/english-unit-tests/${encodeURIComponent(attemptId)}`, { method: 'DELETE' })
      .then(async (response) => {
        if (response.ok) window.location.assign(BACK);
        else setError(await failureMessage(response, 'Kontrolltööd ei saanud tühistada.'));
      })
      .catch(() => setError('Kontrolltööd ei saanud tühistada.'))
      .finally(() => setBusy(false));
  };

  const slotsByKey = useMemo(() => new Map((review?.slots ?? []).map((slot) => [slot.key, slot])), [review]);
  const live = useMemo(() => scoreMarks(review?.slots ?? [], marks), [marks, review]);

  if (!review) {
    return (
      <main className='parent-page ut-parent-page'>
        <Link className='pv-home' href={BACK}>← Vanema ala</Link>
        {error ? <p className='parent-toast parent-toast-error' role='alert'>{error}</p> : <p className='vocab-loading'>Laadin kontrolltööd…</p>}
      </main>
    );
  }

  const open = review.status === 'submitted';
  const learner = review.learner === 'kiur' ? 'Kiur' : 'Kirsi';
  const statusText = review.status === 'submitted' ? 'Ootab sinu hinnangut' : review.status === 'returned' ? 'Saadetud parandamiseks' : review.status === 'approved' ? 'Kinnitatud' : 'Laps teeb kontrolltööd';
  const wrongCount = review.slots.filter((slot) => marks[slot.key] !== 1).length;
  const saveText = saveState === 'saving' ? 'Salvestan…' : saveState === 'pending' ? 'Salvestamata' : saveState === 'saved' ? '✓ Hinded salvestatud' : '';

  return (
    <main className='parent-page ut-parent-page'>
      <Link className='pv-home' href={BACK}>← Vanema ala</Link>
      <header className='ut-parent-head'>
        <h1>{learner} · Kontrolltöö: {review.unitLabel}</h1>
        <p>Variant {review.variant} · „{review.title}” · {statusText}{review.submissions > 1 ? ` · ${review.submissions}. esitamine` : ''}</p>
      </header>

      {error ? <p className='parent-toast parent-toast-error' role='alert'>{error}</p> : null}
      {notice ? <p className='parent-toast' role='status'>{notice}</p> : null}

      <section className='ut-scorecard' aria-label='Tulemus'>
        <p><strong>{formatPoints(live.earned)} / {formatPoints(live.total)}</strong> punkti · {Math.round(live.percent * 100)}% · hinne <strong>{live.grade}</strong> · {live.passed ? 'sooritatud' : 'alla 75%'}</p>
        {live.unmarked > 0 ? <p className='ut-needs'>{live.unmarked} {live.unmarked === 1 ? 'vastus vajab' : 'vastust vajavad'} sinu hinnangut (?).</p> : null}
        {review.stars !== null ? <p>Tähti: {review.stars}</p> : null}
        {open ? <p className='ut-hint'>Äpp on juba hinnanud vastused, mida ta oskab kontrollida. Vaata eriti üle ✗ ja hindamata vastused: laps võis kirjutada õige vastuse teisiti, kui äpp ootas. Hinded salvestuvad kohe.</p> : null}
        {open ? (
          <button type='button' className='vocab-secondary-button' aria-pressed={hiddenSlots !== null} onClick={() => setHiddenSlots((current) => (current ? null : new Set(review.slots.filter((slot) => marks[slot.key] === 1).map((slot) => slot.key))))}>
            {hiddenSlots ? 'Näita kõiki vastuseid' : `Näita ainult ✗, ½ ja hindamata (${wrongCount})`}
          </button>
        ) : null}
        {review.status !== 'approved' ? (
          confirm === 'cancel' ? (
            <div className='ut-confirm-row'>
              <p>Tühistan selle kontrolltöö? Lapse vastused kustutatakse ja õppetüki kontrolltöö avaneb uuesti.</p>
              <button type='button' className='pv-btn' data-k='no' disabled={busy} onClick={cancelTest}>Jah, tühista</button>
              <button type='button' className='pv-btn' data-k='ok' onClick={() => setConfirm(null)}>Ära tühista</button>
            </div>
          ) : <button type='button' className='ut-link-button' onClick={() => setConfirm('cancel')}>Tühista kontrolltöö…</button>
        ) : null}
      </section>

      <UnitTestSheet
        test={review.test}
        answers={review.answers}
        editable={NO_EDIT}
        marks={open ? null : marks}
        hiddenSlots={open ? hiddenSlots : null}
        slotExtra={(key) => {
          const slot = slotsByKey.get(key);
          if (!slot) return null;
          return (
            <span className='ut-review-extra'>
              {open ? <MarkButtons value={marks[key] ?? null} auto={slot.autoMark} onChange={(mark) => setMark(key, mark)} /> : null}
              {slot.kind === 'crossword' ? <small className='ut-given'>Lapse vastus: {slot.answer.trim() || '—'}</small> : null}
              <AcceptedLine slot={slot} />
            </span>
          );
        }}
      />

      {open ? (
        <>
          <label className='ut-comment-field'>
            <span>Kommentaar lapsele (valikuline)</span>
            <textarea value={comment} maxLength={1000} rows={3} onChange={(event) => { setComment(event.target.value); latest.current = { ...latest.current, comment: event.target.value }; scheduleSave(); }} />
          </label>
          <p className='ut-hint'>Kinnitamisel on kontrolltöö lõpetatud ja seda ei saa tagasi võtta. 75% või rohkem: sooritatud ja tähed. Alla 75%: laps saab teha uue kontrolltöö. Parandamiseks saates muudab laps ainult vastuseid, mis ei ole ✓.</p>
          <section className='ut-decision-bar' aria-label='Otsus'>
            <span className='ut-progress'><strong>Hinne {live.grade}</strong> · {Math.round(live.percent * 100)}%<small>{saveText}</small></span>
            {confirm === 'approve' ? (
              <div className='ut-confirm-row'>
                <p>Kinnitan hinde {live.grade}{live.passed ? ' ja tähed' : ''}? Seda ei saa tagasi võtta.</p>
                <button type='button' className='start-button' disabled={busy} onClick={() => decide('approve')}>Jah, kinnita</button>
                <button type='button' className='vocab-secondary-button' onClick={() => setConfirm(null)}>Tagasi</button>
              </div>
            ) : (
              <div className='ut-decision-buttons'>
                <button type='button' className='start-button' disabled={busy || live.unmarked > 0} onClick={() => setConfirm('approve')}>
                  {live.unmarked > 0 ? `Hinda veel ${live.unmarked}` : `Kinnita · hinne ${live.grade}`}
                </button>
                <button type='button' className='vocab-secondary-button' disabled={busy || wrongCount === 0} onClick={() => decide('return')}>
                  Saada parandamiseks ({wrongCount})
                </button>
              </div>
            )}
          </section>
        </>
      ) : null}
    </main>
  );
}

// The parent's preview of an imported variant: the test with its answers,
// to check the transcription before the child gets it.
export function ParentUnitTestPreview({ unit, variant }: { unit: number; variant: 'A' | 'B' }) {
  const [data, setData] = useState<{ test: ClientUnitTest; slots: AnswerSlot[]; active: boolean } | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    void parentFetch(`/api/parent/english-unit-tests?unit=${unit}&variant=${variant}`, { cache: 'no-store' })
      .then(async (response) => {
        if (response.ok) setData(await response.json());
        else setError(await failureMessage(response, 'Kontrolltööd ei saanud avada.'));
      })
      .catch(() => setError('Kontrolltööd ei saanud avada.'));
  }, [unit, variant]);
  const slots = useMemo(() => new Map((data?.slots ?? []).map((slot) => [slot.key, slot])), [data]);
  return (
    <main className='parent-page ut-parent-page'>
      <Link className='pv-home' href='/vanem/halda?tab=sisu'>← Vanema ala</Link>
      {error ? <p className='parent-toast parent-toast-error' role='alert'>{error}</p> : null}
      {data ? (
        <>
          <header className='ut-parent-head'>
            <h1>Kontrolltöö eelvaade: Unit {unit}{variant}</h1>
            <p>„{data.test.title}” · {data.slots.length} hinnatavat vastust · {data.active ? 'lapsele avatud' : 'välja lülitatud'}</p>
          </header>
          <UnitTestSheet test={data.test} answers={{}} editable={NO_EDIT} slotExtra={(key) => {
            const slot = slots.get(key);
            return slot ? <span className='ut-review-extra'>{slot.check === 'parent' ? <small className='ut-given'>Hindab vanem</small> : null}<AcceptedLine slot={slot} /></span> : null;
          }} />
        </>
      ) : !error ? <p className='vocab-loading'>Laadin…</p> : null}
    </main>
  );
}
