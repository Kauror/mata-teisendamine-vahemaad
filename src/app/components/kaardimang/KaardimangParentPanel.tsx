'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { KAARDIMANG_CHILD_ENABLED, KAARDIMANG_PAGES, type ParentKaardimangResponse } from '@/lib/kaardimang/api';
import KaardimangCompetitionPanel from './KaardimangCompetitionPanel';
import { parentKaardimangClient } from './kaardimangClient';

// The parent's Kaardimäng section: the family competition (levels, playing as
// Kairi or Kaur, opening and ending competitions), what the data covers (and
// deliberately leaves out of scored questions), Kiur's progress, and the
// isolated preview.
export default function KaardimangParentPanel() {
  const [data, setData] = useState<ParentKaardimangResponse | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    void parentKaardimangClient.overview().then((result) => {
      if (result.ok) setData(result.data);
      else setMessage(result.error.message);
    });
  }, []);

  const reset = async () => {
    const result = await parentKaardimangClient.resetPreview();
    setConfirming(false);
    setMessage(result.ok ? 'Eelvaate mängud on kustutatud. Kiuri andmeid see ei muutnud.' : result.error.message);
  };

  return (
    <div className='km-parent'>
      <KaardimangCompetitionPanel />
      <h3>Andmed ja eelvaade</h3>
      {message ? <p role='status'>{message}</p> : null}
      {data ? (
        <>
          <p>
            <strong>{data.countries} riiki</strong> kõigist maailmajagudest (ÜRO 193 liiget ja Vatikan). Nimed ja pealinnad: EKI „Maailma maade nimed“, seis {data.ekiAsOf}.
            Tähti annab ainult võistluse lõpp: lastele esikolmikus, vanematele medal.
          </p>
          {KAARDIMANG_CHILD_ENABLED ? null : <p><strong>Lastele veel nähtav ei ole</strong> – mängi seda siin eelvaates.</p>}
          <p>
            Kiur: {data.kiur.rounds} lõpetatud vooru, harjutatud {data.kiur.practiced} / {data.kiur.practicedOf} riiki.
            {data.kiur.toReview.length ? ` Tasub üle vaadata: ${data.kiur.toReview.join(', ')}.` : ''}
          </p>
          <details>
            <summary>Ainult avastamiseks ja pealinnaküsimusteta ({data.exploreOnly.length + data.noCapitalQuestion.length})</summary>
            <p>Uuri-režiimis selgitatud, aga mitte hinnatud: {data.exploreOnly.join(', ')}.</p>
            <ul>
              {data.noCapitalQuestion.map((item) => <li key={item.nameEt}><strong>{item.nameEt}</strong>: {item.reasonEt}</li>)}
            </ul>
          </details>
        </>
      ) : <p>Laadin...</p>}
      <div className='tb-actions'>
        <Link className='filter-chip tb-admin-link' href={KAARDIMANG_PAGES.preview}>Ava eelvaade</Link>
        {confirming ? (
          <>
            <button type='button' className='filter-chip' onClick={() => void reset()}>Jah, lähtesta</button>
            <button type='button' className='filter-chip' onClick={() => setConfirming(false)}>Loobu</button>
          </>
        ) : <button type='button' className='filter-chip' onClick={() => setConfirming(true)}>Lähtesta eelvaade</button>}
      </div>
    </div>
  );
}
