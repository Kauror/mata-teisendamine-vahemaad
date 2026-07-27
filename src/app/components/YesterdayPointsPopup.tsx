'use client';

import { useEffect, useState } from 'react';
import PointsConfetti from '@/app/components/PointsConfetti';
import { usePeekMode } from '@/app/components/usePeekMode';
import { formatStars } from '@/lib/formatStars';
import { mayRecordSeenMarker } from '@/lib/peekMode';
import type { Learner } from '@/lib/tasks';
import type { YesterdayPointsSummary } from '@/lib/dailyPointsSummary';

// Shows a friendly recap of yesterday's earned stars the first time the child
// opens their page on a given day. The "seen" marker is keyed by the recap date,
// so it appears once per day and naturally resets the next day.
export default function YesterdayPointsPopup({
  learner,
  childName,
  summary
}: {
  learner: Learner;
  childName: string;
  summary: YesterdayPointsSummary;
}) {
  const [open, setOpen] = useState(false);
  const peekMode = usePeekMode();

  const storageKey = `harjutaja:points-recap:${learner}`;

  useEffect(() => {
    try {
      if (window.localStorage.getItem(storageKey) === summary.date) return;
    } catch {
      // localStorage unavailable (private mode) — just show the recap.
    }
    setOpen(true);
  }, [storageKey, summary.date]);

  const close = () => {
    // A peeking parent closes the recap without spending it, so the child still
    // gets it the next time they open their page.
    if (mayRecordSeenMarker(peekMode)) {
      try {
        window.localStorage.setItem(storageKey, summary.date);
      } catch {
        // Ignore storage failures; closing still works for this visit.
      }
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className='task-modal-backdrop' role='dialog' aria-modal='true' aria-labelledby='points-recap-title'>
      {/* Only celebrate an actual haul — the "no stars" and "did not practise"
          branches below stay quiet. */}
      {summary.hasEarnings ? <PointsConfetti /> : null}
      <div className='task-modal points-recap'>
        {summary.hasEarnings ? (
          <>
            <span className='points-recap-emoji' aria-hidden>🎉</span>
            <h2 id='points-recap-title'>Eile</h2>
            <strong className='points-recap-total'>+{formatStars(summary.total)} ⭐</strong>
            <ul className='points-recap-list'>
              {summary.breakdown.map((item) => (
                <li key={item.key} className='points-recap-row'>
                  <span className='points-recap-label'><span aria-hidden>{item.emoji}</span> {item.label}</span>
                  <span className='points-recap-amount'>+{formatStars(item.amount)} ⭐</span>
                </li>
              ))}
            </ul>
            <button type='button' className='next-button' onClick={close}>Tubli, {childName}!</button>
          </>
        ) : summary.practicedYesterday ? (
          <>
            <span className='points-recap-emoji' aria-hidden>😐</span>
            <h2 id='points-recap-title'>Eile tähti ei tulnud</h2>
            <button type='button' className='next-button' onClick={close}>Lähme harjutama</button>
          </>
        ) : (
          <>
            <span className='points-recap-emoji' aria-hidden>😔</span>
            <h2 id='points-recap-title'>Eile jäi harjutamata</h2>
            <button type='button' className='next-button' onClick={close}>Lähme harjutama</button>
          </>
        )}
      </div>
    </div>
  );
}
