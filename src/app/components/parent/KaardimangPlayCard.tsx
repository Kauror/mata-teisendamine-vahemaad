'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { KAARDIMANG_PAGES, KAARDIMANG_PARENT_API, type ParentCompetitionResponse } from '@/lib/kaardimang/api';
import { PLAYER_NAMES } from '@/lib/kaardimang/competition';

// Kairi and Kaur play the family map game from here, on the parent area's
// front page (Kaur, 31.10: the play links used to sit only inside Halda →
// Õppesisu → Kaardimäng, where nobody found them). While a competition runs
// the card names it and shows each parent's points and place.
// Plain fetch on purpose: kaardimangClient pulls in the map catalogue, which
// this page does not need.

const PARENTS = ['kairi', 'kaur'] as const;
const AS: Record<(typeof PARENTS)[number], string> = { kairi: 'Kairina', kaur: 'Kaurina' };

export function KaardimangPlayCard() {
  const [active, setActive] = useState<ParentCompetitionResponse['active']>(null);

  useEffect(() => {
    let live = true;
    void fetch(KAARDIMANG_PARENT_API.competition, { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() as Promise<ParentCompetitionResponse> : null))
      .then((data) => { if (live && data) setActive(data.active); }, () => undefined);
    return () => { live = false; };
  }, []);

  return (
    <section className='pv-card pv-km' aria-labelledby='pv-km-title'>
      <h2 className='pv-h' id='pv-km-title'>
        <span>🗺️ Kaardimäng</span>
        {active ? <span className='pv-km-comp'>🏆 „{active.title}“ · {active.daysLeftEt}</span> : null}
      </h2>
      <div className='pv-btns'>
        {PARENTS.map((player) => {
          const row = active?.standings.find((item) => item.player === player);
          return (
            <Link key={player} className='pv-km-play' href={KAARDIMANG_PAGES.parent(player)}>
              <strong>▶ Mängi {AS[player]}</strong>
              {row ? <small>{PLAYER_NAMES[player]}: {row.points} p · {row.rank}. koht</small> : null}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
