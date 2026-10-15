'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
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

function lockExplanation(card: ChildUnitCard) {
  if (card.previousUnitLabel) return `Avaneb, kui eelmise õppetüki (${card.previousUnitLabel}) test on läbitud.`;
  return 'See õppetükk avaneb hiljem.';
}

function UnitCard({ card }: { card: ChildUnitCard }) {
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
  if (card.weakCount > 0 && card.status !== 'locked') {
    actions.push({ href: `${VOCAB_HOME_ROUTE}/korda?unit=${encodeURIComponent(card.id)}`, label: 'Korda eksitud sõnu' });
  }

  return (
    <article className='vocab-unit-card' data-status={card.status} aria-labelledby={`unit-${card.id}`}>
      <div className='vocab-unit-head'>
        <h2 id={`unit-${card.id}`}>{card.label}</h2>
        <span className='vocab-unit-status'>{STATUS_LABEL[card.status]}</span>
      </div>
      <p className='vocab-unit-meta'>
        {card.wordCount} sõna
        {card.weakCount > 0 ? <> · {card.weakCount} sõna vajab kordamist</> : null}
      </p>
      {card.status === 'locked' ? <p className='vocab-unit-lock'>{lockExplanation(card)}</p> : null}
      {card.status === 'new_words' ? <p className='vocab-unit-lock'>{card.newWordsCount === 1 ? 'Õppetükki on lisandunud 1 uus sõna. Õpi see enne testi kaartidega läbi.' : `Õppetükki on lisandunud ${card.newWordsCount} uut sõna. Õpi need enne testi kaartidega läbi.`}</p> : null}
      {actions.length > 0 ? (
        <div className='vocab-unit-actions'>
          {actions.map((action) => (
            <Link key={action.label} className={action.primary ? 'vocab-action vocab-action-primary' : 'vocab-action'} href={action.href}>{action.label}</Link>
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
        <Link className='practice-back-button' href='/kiur'>← Harjutused</Link>
        <header className='subject-header vocab-home-header'>
          <div className='subject-emoji' aria-hidden>🔤</div>
          <h1>Inglise keel</h1>
        </header>

        {failed ? (
          <div className='vocab-problem' role='alert'>
            <p>Sõnavara vajab internetiühendust. Kontrolli ühendust ja proovi uuesti.</p>
            <button type='button' className='start-button' onClick={load}>Proovi uuesti</button>
          </div>
        ) : !data ? (
          <p className='vocab-loading'>Laadin õppetükke…</p>
        ) : (
          <>
            {!data.enabled ? (
              <p className='vocab-empty'>Sõnavara ei ole praegu avatud.</p>
            ) : data.units.length === 0 ? (
              <p className='vocab-empty'>Õppetükke veel ei ole. Need ilmuvad siia, kui vanem on need lisanud.</p>
            ) : (
              <>
                {data.weakTotal > 0 ? (
                  <Link className='vocab-weak-banner' href={`${VOCAB_HOME_ROUTE}/korda`}>
                    <span className='vocab-weak-icon' aria-hidden>↻</span>
                    <span>
                      <strong>Korda eksitud sõnu</strong>
                      <small>{data.weakTotal} sõna vajab veel kordamist</small>
                    </span>
                  </Link>
                ) : null}
                {data.units.every((card) => card.status === 'passed') ? (
                  <p className='vocab-empty vocab-all-passed' role='status'>{VOCAB_ALL_PASSED_MESSAGE}</p>
                ) : null}
                <div className='vocab-unit-list'>
                  {data.units.map((card) => <UnitCard key={card.id} card={card} />)}
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
