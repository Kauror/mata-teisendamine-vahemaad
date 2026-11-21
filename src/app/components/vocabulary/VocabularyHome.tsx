'use client';

import Link from 'next/link';
import { useCallback, useEffect, useId, useState } from 'react';
import type { ChildUnitCard, ChildVocabularyHome } from '@/lib/server/vocabulary/overview';
import { VOCAB_ALL_PASSED_MESSAGE, VOCAB_HOME_ROUTE } from '@/lib/vocabulary/constants';

type HomeData = ChildVocabularyHome & { sprintActive: boolean };

const STATUS_LABEL: Record<ChildUnitCard['status'], string> = {
  locked: '🔒 Lukus',
  new: 'Uus',
  studying: '📖 Õppimine pooleli',
  study_done: '✏️ Test ootab',
  new_words: '📖 Uued sõnad',
  testing: '✏️ Test pooleli',
  passed: '✓ Läbitud'
};

// While the unit's kontrolltöö is the next thing to do, the card says so
// instead of "Läbitud" (the words test is passed, the unit is not done yet).
function unitTestStatus(card: ChildUnitCard) {
  const state = card.unitTest?.state;
  if (state === 'available' || state === 'retake') return '📝 Kontrolltöö ootab';
  if (state === 'in_progress') return '📝 Kontrolltöö pooleli';
  if (state === 'returned') return '✏️ Paranda kontrolltöö';
  if (state === 'submitted') return '⏳ Vanem vaatab üle';
  if (state === 'passed' && card.unitTest?.grade) return `✓ Hinne ${card.unitTest.grade}`;
  return null;
}

function lockExplanation(card: ChildUnitCard) {
  if (card.previousUnitLabel) return `Avaneb, kui eelmise õppetüki (${card.previousUnitLabel}) test on läbitud.`;
  return 'See õppetükk avaneb hiljem.';
}

// Every unit is two lines (Kaur 21.11: rows of three or four buttons per unit
// still wasted the phone screen): title and status, then the word count, the
// one next step and a "⋯" button that opens the other actions. A passed unit
// with nothing to do shows only "⋯"; its grade is in the status chip.
// Only the first locked unit says why it is locked.
function firstLockedId(units: ChildUnitCard[]) {
  return units.find((card) => card.status === 'locked')?.id ?? null;
}

function UnitCard({ card, explainLock }: { card: ChildUnitCard; explainLock: boolean }) {
  const [open, setOpen] = useState(false);
  const moreId = useId();
  const base = `${VOCAB_HOME_ROUTE}/${card.id}`;
  const actions: Array<{ href: string; label: string; primary?: boolean }> = [];
  if (card.status === 'new') actions.push({ href: `${base}/opi`, label: 'Alusta õppimist', primary: true });
  if (card.status === 'studying') actions.push({ href: `${base}/opi`, label: 'Jätka õppimist', primary: true });
  if (card.status === 'study_done') actions.push({ href: `${base}/test`, label: 'Tee test', primary: true }, { href: `${base}/opi`, label: card.activeStudySessionId ? 'Jätka õppimist' : 'Õpi uuesti' });
  if (card.status === 'new_words') actions.push({ href: `${base}/opi`, label: card.activeStudySessionId ? 'Jätka õppimist' : 'Õpi uued sõnad', primary: true });
  if (card.status === 'testing') actions.push({ href: `${base}/test`, label: 'Jätka testi', primary: true }, { href: `${base}/opi`, label: card.activeStudySessionId ? 'Jätka õppimist' : 'Õpi uuesti' });
  if (card.status === 'passed') {
    actions.push(
      { href: `${base}/opi`, label: card.activeStudySessionId ? 'Jätka õppimist' : 'Õpi uuesti' },
      { href: `${base}/test`, label: card.activeTestSessionId ? 'Jätka testi' : 'Tee test uuesti' }
    );
  }
  // The workbook test (lisatest) opens once the words test is passed.
  const unitTest = card.unitTest;
  if (unitTest) {
    const lisatest = `${base}/lisatest`;
    const view = unitTest.attemptId ? `${lisatest}?katse=${encodeURIComponent(unitTest.attemptId)}` : lisatest;
    if (unitTest.state === 'available') actions.unshift({ href: lisatest, label: 'Tee kontrolltöö', primary: true });
    if (unitTest.state === 'in_progress') actions.unshift({ href: lisatest, label: 'Jätka kontrolltööd', primary: true });
    if (unitTest.state === 'returned') actions.unshift({ href: lisatest, label: 'Paranda kontrolltöö', primary: true });
    if (unitTest.state === 'retake') {
      actions.unshift({ href: lisatest, label: 'Tee kontrolltöö uuesti', primary: true });
      // The failed try stays open to look at: its grade, marks and right answers.
      if (unitTest.attemptId) actions.push({ href: view, label: `Eelmine kontrolltöö: hinne ${unitTest.grade ?? ''}`.trim() });
    }
    if (unitTest.state === 'submitted') actions.push({ href: view, label: 'Kontrolltöö ootab vanemat' });
    if (unitTest.state === 'passed') actions.push({ href: view, label: 'Vaata kontrolltööd' });
  }
  if (card.weakCount > 0 && card.status !== 'locked') {
    actions.push({ href: `${VOCAB_HOME_ROUTE}/korda?unit=${encodeURIComponent(card.id)}`, label: 'Korda eksitud sõnu' });
  }

  const primary = actions.find((action) => action.primary) ?? null;
  const more = actions.filter((action) => action !== primary);

  return (
    <article className='vocab-unit-card' data-status={card.status} data-compact='true' aria-labelledby={`unit-${card.id}`}>
      <div className='vocab-unit-head'>
        <h2 id={`unit-${card.id}`}>{card.label}</h2>
        <span className='vocab-unit-status'>{unitTestStatus(card) ?? STATUS_LABEL[card.status]}</span>
      </div>
      <div className='vocab-unit-row'>
        <p className='vocab-unit-meta'>
          {card.wordCount} sõna
          {card.weakCount > 0 ? <> · {card.weakCount} vajab kordamist</> : null}
        </p>
        {primary ? <Link className='vocab-action vocab-action-primary' href={primary.href}>{primary.label}</Link> : null}
        {more.length > 0 ? (
          <button type='button' className='vocab-more' aria-expanded={open} aria-controls={moreId} aria-label={`Veel: ${card.label}`} onClick={() => setOpen(!open)}>⋯</button>
        ) : null}
      </div>
      {card.status === 'locked' && explainLock ? <p className='vocab-unit-lock'>{lockExplanation(card)}</p> : null}
      {card.status === 'new_words' ? <p className='vocab-unit-lock'>{card.newWordsCount === 1 ? 'Õppetükki on lisandunud 1 uus sõna. Õpi see enne testi kaartidega läbi.' : `Õppetükki on lisandunud ${card.newWordsCount} uut sõna. Õpi need enne testi kaartidega läbi.`}</p> : null}
      {more.length > 0 ? (
        <div className='vocab-unit-actions' id={moreId} hidden={!open}>
          {more.map((action) => (
            <Link key={action.label} className='vocab-action' href={action.href}>{action.label}</Link>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export default function VocabularyHome() {
  const [data, setData] = useState<HomeData | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(() => {
    setFailed(false);
    void fetch('/api/english/units', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() as Promise<HomeData> : Promise.reject(new Error()))
      .then(setData)
      .catch(() => setFailed(true));
  }, []);

  useEffect(load, [load]);

  return (
    <main className='english-page vocab-page'>
      <section className='practice-shell english-shell vocab-shell'>
        <div className='practice-top-row vocab-home-top'>
          <Link className='practice-back-button' href='/kiur'>← Kiur</Link>
          <h1 className='vocab-home-title'>English</h1>
        </div>

        {failed ? (
          <div className='vocab-problem' role='alert'>
            <p>English vajab internetiühendust. Kontrolli ühendust ja proovi uuesti.</p>
            <button type='button' className='start-button' onClick={load}>Proovi uuesti</button>
          </div>
        ) : !data ? (
          <p className='vocab-loading'>Laadin õppetükke…</p>
        ) : (
          <>
            {!data.enabled ? (
              <p className='vocab-empty'>English ei ole praegu avatud.</p>
            ) : data.units.length === 0 ? (
              <p className='vocab-empty'>Õppetükke veel ei ole. Need ilmuvad siia, kui vanem on need lisanud.</p>
            ) : (
              <>
                {data.weakTotal > 0 ? (
                  <Link className='vocab-weak-banner' href={`${VOCAB_HOME_ROUTE}/korda`}>
                    <span className='vocab-weak-icon' aria-hidden>↻</span>
                    <strong>Korda eksitud sõnu</strong>
                    <small>{data.weakTotal} sõna</small>
                  </Link>
                ) : null}
                {data.units.every((card) => card.status === 'passed') ? (
                  <p className='vocab-empty vocab-all-passed' role='status'>{VOCAB_ALL_PASSED_MESSAGE}</p>
                ) : null}
                <div className='vocab-unit-list'>
                  {data.units.map((card) => <UnitCard key={card.id} card={card} explainLock={card.id === firstLockedId(data.units)} />)}
                </div>
              </>
            )}
            {data.sprintActive ? (
              <Link className='vocab-sprint-link child-exercise-card' data-accent='pink' href='/kiur/inglise-keel/sprint'>
                <span className='child-exercise-icon' aria-hidden>⚡</span>
                <span className='child-exercise-copy'>
                  <strong>Sprint</strong>
                  <small>Ühenda sõnapaare nii kiiresti, kui jõuad.</small>
                </span>
              </Link>
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}
