'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { OverviewResponse } from '@/lib/kaardimang/api';
import { MEDALS } from '@/lib/kaardimang/competition';
import { createKaardimangClient } from './kaardimangClient';

// The child's Kaardimäng entry on their own page: the open competition (place,
// days left, rounds left today) and the medals won so far. Nothing while the
// game is closed or offline: then it is simply a link.
export default function KaardimangTile({ learner, href }: { learner: 'kiur' | 'kirsi'; href: string }) {
  const [overview, setOverview] = useState<OverviewResponse | null>(null);

  useEffect(() => {
    void createKaardimangClient('child', learner).overview().then((result) => {
      if (result.ok) setOverview(result.data);
    });
  }, [learner]);

  const competition = overview?.competition ?? null;
  const me = competition?.standings.find((row) => row.player === learner);
  const medals = overview?.medals ?? [];
  const earned = (overview?.achievements ?? []).filter((item) => item.unlocked);

  return (
    <Link className='km-tile' href={href}>
      <span className='km-tile-icon' aria-hidden>🗺️</span>
      <span className='km-tile-body'>
        <strong>Kaardimäng</strong>
        {competition && me ? (
          <small>🏆 „{competition.title}“: {me.rank}. koht, {me.points} p · {competition.daysLeftEt}{competition.countedLeftToday ? ` · täna veel ${competition.countedLeftToday}` : ''}</small>
        ) : <small>Eesti, Euroopa ja kogu maailm</small>}
        {earned.length ? (
          <span className='km-tile-badges' aria-label={`Saavutused: ${earned.map((item) => item.title).join(', ')}`}>
            {earned.map((item) => <span key={item.id} title={item.title}>{item.emoji}</span>)}
          </span>
        ) : null}
        {medals.length ? (
          <span className='km-tile-medals' aria-label={`Medalid: ${medals.map((medal) => `${medal.place}. koht „${medal.title}“`).join(', ')}`}>
            {medals.map((medal) => <span key={medal.competitionId} title={`${medal.place}. koht – ${medal.title}`}>{MEDALS[medal.place - 1]}</span>)}
          </span>
        ) : null}
      </span>
      <span className='km-tile-arrow' aria-hidden>→</span>
    </Link>
  );
}
