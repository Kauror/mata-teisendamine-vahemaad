'use client';

import Link from 'next/link';
import { formatStars } from '@/lib/formatStars';
import { learnerLabel } from './format';
import { LEARNERS, type WeeklyDigest } from './types';
import { useParentResource } from './useParentApi';

export function WeeklyDigestPanel() {
  const { data: weeklyDigest } = useParentResource<WeeklyDigest>('weekly');
  return (
    <section className='parent-card weekly-digest-card'>
      {!weeklyDigest ? <p>Laadin...</p> : (
        <>
          <p className='weekly-digest-range'>{weeklyDigest.from} – {weeklyDigest.to}</p>
          <div className='weekly-digest-grid'>
            {LEARNERS.map((child) => {
              const digest = weeklyDigest.learners[child];
              return (
                <div key={child} className='weekly-digest-child'>
                  <h3>{learnerLabel(child)}</h3>
                  <ul className='weekly-digest-stats'>
                    <li><span>Harjutusi</span><strong>{digest.exercises}</strong></li>
                    <li><span>Täpsus</span><strong>{digest.accuracyPercent}%</strong></li>
                    <li><span>Tähti teenitud</span><strong>{formatStars(digest.starsEarned)} ⭐</strong></li>
                    <li><span>Karikaid</span><strong>{digest.trophies} 🏆</strong></li>
                    <li><span>Õpiseeria</span><strong>{digest.streak} 🔥</strong></li>
                  </ul>
                </div>
              );
            })}
          </div>
          <Link className='weekly-digest-link' href='/history'>📊 Vaata täielikku statistikat</Link>
        </>
      )}
    </section>
  );
}
