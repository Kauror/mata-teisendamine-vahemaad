'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { failureMessage, jsonInit, parentFetch } from '@/app/components/parent/parentApi';
import type { ParentReview } from '@/lib/server/unitTests/store';
import type { ClientUnitTest } from '@/lib/unitTests/clientView';
import { formatPoints, gradeFor, PASS_PERCENT } from '@/lib/unitTests/grading';
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
  const [onlyIssues, setOnlyIssues] = useState(false);

  const accept = useCallback((next: ParentReview) => {
    setReview(next);
    setMarks(Object.fromEntries(next.slots.map((slot) => [slot.key, slot.mark])));
    setComment(next.comment ?? '');
  }, []);

  useEffect(() => {
    void parentFetch(`/api/parent/english-unit-tests/${encodeURIComponent(attemptId)}`, { cache: 'no-store' })
      .then(async (response) => {
        if (response.ok) accept(await response.json() as ParentReview);
        else setError(await failureMessage(response, 'Testi ei saanud avada.'));
      })
      .catch(() => setError('Testi ei saanud avada. Kontrolli internetiühendust.'));
  }, [accept, attemptId]);

  const slotsByKey = useMemo(() => new Map((review?.slots ?? []).map((slot) => [slot.key, slot])), [review]);
  const live = useMemo(() => {
    let earned = 0;
    let total = 0;
    let unmarked = 0;
    for (const slot of review?.slots ?? []) {
      total += slot.points;
      const mark = marks[slot.key];
      if (mark === null || mark === undefined) unmarked += 1;
      else earned += mark * slot.points;
    }
    const percent = total ? earned / total : 0;
    return { earned, total, unmarked, percent, grade: gradeFor(percent), passed: Math.round(percent * 10000) >= Math.round(PASS_PERCENT * 10000) };
  }, [marks, review]);

  const decide = (decision: 'save' | 'approve' | 'return') => {
    if (!review) return;
    setBusy(true);
    setError('');
    setNotice('');
    void parentFetch(`/api/parent/english-unit-tests/${encodeURIComponent(review.id)}`, jsonInit('POST', { revision: review.revision, marks, comment, decision }))
      .then(async (response) => {
        if (response.ok) {
          accept(await response.json() as ParentReview);
          setNotice(decision === 'approve' ? 'Test on kinnitatud.' : decision === 'return' ? 'Test saadeti parandamiseks.' : 'Salvestatud.');
          return;
        }
        const body = await response.clone().json().catch(() => ({})) as { state?: ParentReview };
        if (response.status === 409 && body.state) accept(body.state);
        setError(await failureMessage(response, 'Toimingut ei saanud teha.'));
      })
      .catch(() => setError('Toimingut ei saanud teha. Kontrolli internetiühendust.'))
      .finally(() => setBusy(false));
  };

  if (!review) {
    return (
      <main className='parent-page ut-parent-page'>
        <Link className='pv-home' href={BACK}>← Vanema ala</Link>
        {error ? <p className='parent-toast parent-toast-error' role='alert'>{error}</p> : <p className='vocab-loading'>Laadin testi…</p>}
      </main>
    );
  }

  const open = review.status === 'submitted';
  const learner = review.learner === 'kiur' ? 'Kiur' : 'Kirsi';
  const statusText = review.status === 'submitted' ? 'Ootab sinu hinnangut' : review.status === 'returned' ? 'Saadetud parandamiseks' : review.status === 'approved' ? 'Kinnitatud' : 'Laps teeb testi';
  const wrongCount = review.slots.filter((slot) => marks[slot.key] !== 1).length;

  return (
    <main className='parent-page ut-parent-page' data-only-issues={onlyIssues && open ? 'true' : undefined}>
      <Link className='pv-home' href={BACK}>← Vanema ala</Link>
      <header className='ut-parent-head'>
        <h1>{learner} · Lisatest: {review.unitLabel}</h1>
        <p>Variant {review.variant} · „{review.title}” · {statusText}{review.submissions > 1 ? ` · ${review.submissions}. esitamine` : ''}</p>
      </header>

      {error ? <p className='parent-toast parent-toast-error' role='alert'>{error}</p> : null}
      {notice ? <p className='parent-toast' role='status'>{notice}</p> : null}

      <section className='ut-scorecard' aria-label='Tulemus'>
        <p><strong>{formatPoints(live.earned)} / {formatPoints(live.total)}</strong> punkti · {Math.round(live.percent * 100)}% · hinne <strong>{live.grade}</strong> · {live.passed ? 'sooritatud' : 'alla 75%'}</p>
        {live.unmarked > 0 ? <p className='ut-needs'>{live.unmarked === 1 ? '1 vastus vajab' : `${live.unmarked} vastust vajavad`} sinu hinnangut (?).</p> : null}
        {review.stars !== null ? <p>Tähti: {review.stars}</p> : null}
        {open ? <p className='ut-hint'>Äpp on juba hinnanud vastused, mida ta oskab kontrollida. Vaata eriti üle ✗ ja hindamata vastused: laps võis kirjutada õige vastuse teisiti, kui äpp ootas.</p> : null}
        {open ? (
          <button type='button' className='vocab-secondary-button' aria-pressed={onlyIssues} onClick={() => setOnlyIssues((current) => !current)}>
            {onlyIssues ? 'Näita kõiki vastuseid' : `Näita ainult ✗, ½ ja hindamata (${wrongCount})`}
          </button>
        ) : null}
      </section>

      <UnitTestSheet
        test={review.test}
        answers={review.answers}
        editable={NO_EDIT}
        marks={open ? null : marks}
        slotExtra={(key) => {
          const slot = slotsByKey.get(key);
          if (!slot) return null;
          return (
            <span className='ut-review-extra'>
              {open ? <MarkButtons value={marks[key] ?? null} auto={slot.autoMark} onChange={(mark) => setMarks((current) => ({ ...current, [key]: mark }))} /> : null}
              {slot.kind === 'crossword' ? <small className='ut-given'>Lapse vastus: {slot.answer.trim() || '—'}</small> : null}
              <AcceptedLine slot={slot} />
            </span>
          );
        }}
      />

      {open ? (
        <section className='ut-decision' aria-label='Otsus'>
          <label className='ut-comment-field'>
            <span>Kommentaar lapsele (valikuline)</span>
            <textarea value={comment} maxLength={1000} rows={3} onChange={(event) => setComment(event.target.value)} />
          </label>
          <div className='vocab-actions'>
            <button type='button' className='start-button' disabled={busy || live.unmarked > 0} onClick={() => decide('approve')}>
              Kinnita · hinne {live.grade}{live.passed ? ' ⭐' : ''}
            </button>
            <button type='button' className='vocab-secondary-button' disabled={busy || wrongCount === 0} onClick={() => decide('return')}>
              Saada parandamiseks ({wrongCount})
            </button>
            <button type='button' className='vocab-secondary-button' disabled={busy} onClick={() => decide('save')}>Salvesta hiljemaks</button>
          </div>
          <p className='ut-hint'>Kinnitamisel on test lõpetatud. 75% või rohkem: sooritatud ja tähed. Alla 75%: laps saab teha uue testi. Parandamiseks saates muudab laps ainult vastuseid, mis ei ole ✓.</p>
        </section>
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
        else setError(await failureMessage(response, 'Testi ei saanud avada.'));
      })
      .catch(() => setError('Testi ei saanud avada.'));
  }, [unit, variant]);
  const slots = useMemo(() => new Map((data?.slots ?? []).map((slot) => [slot.key, slot])), [data]);
  return (
    <main className='parent-page ut-parent-page'>
      <Link className='pv-home' href='/vanem/halda?tab=sisu'>← Vanema ala</Link>
      {error ? <p className='parent-toast parent-toast-error' role='alert'>{error}</p> : null}
      {data ? (
        <>
          <header className='ut-parent-head'>
            <h1>Lisatesti eelvaade: Unit {unit}{variant}</h1>
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
