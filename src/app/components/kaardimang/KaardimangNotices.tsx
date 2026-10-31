'use client';

import { useEffect, useMemo, useState } from 'react';
import Celebration from '@/app/components/Celebration';
import { readPeekMode } from '@/app/components/usePeekMode';
import { formatStars } from '@/lib/formatStars';
import { starWord } from '@/lib/history';
import type { KaardimangNotice, KaardimangScope } from '@/lib/kaardimang/api';
import { MEDALS, PLAYER_NAMES, type KaardimangPlayer, type StandingRow } from '@/lib/kaardimang/competition';
import type { createKaardimangClient } from './kaardimangClient';

// The one-shot notices of the family competition (Kaur, 31.10), one at a
// time over the page: the results splash once a competition has ended (the
// podium, every player's points, the viewer's own place and stars, with a
// celebration), and "Viimased päevad mängida!" once it is in its last days.
// Closing one tells the server, so it never comes back on any device; a
// peeking parent closes it for this visit only, as with the other one-shot
// notices (lib/peekMode.ts). It waits while another dialog (yesterday's
// recap) is open, so the two never stack and the celebration is seen.

type Client = ReturnType<typeof createKaardimangClient>;

const key = (notice: KaardimangNotice) => `${notice.kind}:${notice.competitionId}`;

function dateEt(date: string) {
  return date.split('-').reverse().join('.');
}

function useOtherDialogOpen() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const check = () => setOpen([...document.querySelectorAll('[role="dialog"]')].some((element) => !element.classList.contains('km-notice-backdrop')));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return open;
}

// The podium order: 2nd on the left, 1st in the middle, 3rd on the right.
function podiumOf(standings: StandingRow[]) {
  const sorted = [...standings].sort((left, right) => left.rank - right.rank);
  return { podium: [sorted[1], sorted[0], sorted[2]].filter(Boolean), rest: sorted.slice(3) };
}

function medalOf(row: StandingRow) {
  return row.rank <= 3 && row.points > 0 ? MEDALS[row.rank - 1] : `${row.rank}.`;
}

export default function KaardimangNotices({ notices, player, scope, client }: { notices: KaardimangNotice[]; player: KaardimangPlayer; scope: KaardimangScope; client: Client }) {
  const [closed, setClosed] = useState<string[]>([]);
  const otherOpen = useOtherDialogOpen();
  const current = useMemo(() => notices.find((notice) => !closed.includes(key(notice))) ?? null, [notices, closed]);

  if (!current || otherOpen) return null;

  const dismiss = () => {
    setClosed((list) => [...list, key(current)]);
    // A peeking parent leaves the notice for the child; everyone else spends it.
    if (scope === 'child' && readPeekMode()) return;
    void client.dismissNotice({ competitionId: current.competitionId, kind: current.kind });
  };

  if (current.kind === 'last_days') {
    return (
      <div className='task-modal-backdrop km-notice-backdrop' role='dialog' aria-modal='true' aria-labelledby='km-lastdays-title'>
        <div className='task-modal km-notice km-lastdays'>
          <span className='km-notice-emoji' aria-hidden>⏳</span>
          <h2 id='km-lastdays-title'>Viimased päevad mängida!</h2>
          <p className='km-notice-sub'>Võistlus „{current.title}“ lõpeb {dateEt(current.endDate)}: {current.daysLeftEt}.</p>
          <p className='km-notice-me'>Sinu seis: {current.me.rank}. koht · {current.me.points} p</p>
          <button type='button' className='next-button' onClick={dismiss}>Selge, lähen mängima!</button>
        </div>
      </div>
    );
  }

  const { podium, rest } = podiumOf(current.standings);
  const won = current.me.rank === 1 && current.me.points > 0;
  const stars = formatStars(current.me.stars);
  return (
    <div className='task-modal-backdrop km-notice-backdrop' role='dialog' aria-modal='true' aria-labelledby='km-finale-title'>
      <Celebration />
      <div className='task-modal km-notice km-finale' data-won={won ? 'true' : undefined}>
        <span className='km-notice-emoji km-finale-emoji' aria-hidden>{won ? '👑' : '🏁'}</span>
        <h2 id='km-finale-title'>{won ? `Sa võitsid, ${PLAYER_NAMES[player]}!` : 'Võistlus on läbi!'}</h2>
        <p className='km-notice-sub'>„{current.title}“ · lõppes {dateEt(current.endDate)}</p>
        <ol className='km-podium' aria-label='Esikolmik'>
          {podium.map((row, index) => (
            <li key={row.player} data-place={row.rank} data-me={row.player === player ? 'true' : undefined} style={{ '--km-podium-order': index } as React.CSSProperties}>
              <span className='km-podium-medal' aria-hidden>{medalOf(row)}</span>
              <strong>{PLAYER_NAMES[row.player]}</strong>
              <span className='km-podium-points'>{row.points} p</span>
              <span className='km-podium-block' aria-hidden>{row.points > 0 ? row.rank : ''}</span>
            </li>
          ))}
        </ol>
        {rest.length ? (
          <ul className='km-finale-rest'>
            {rest.map((row) => <li key={row.player} data-me={row.player === player ? 'true' : undefined}>{row.rank}. {PLAYER_NAMES[row.player]} · {row.points} p</li>)}
          </ul>
        ) : null}
        <p className='km-notice-me'>
          Sina: {current.me.rank}. koht · {current.me.points} p
          {current.me.stars > 0 ? <strong className='km-finale-stars'> · +{stars} {starWord(stars)} ⭐</strong> : null}
        </p>
        <button type='button' className='next-button' onClick={dismiss}>{won ? 'Jess!' : 'Selge!'}</button>
      </div>
    </div>
  );
}
