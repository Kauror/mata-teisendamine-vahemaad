'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { isKirsiAttempt, scorePercent, isTodayIso, subjectLabel } from '@/lib/history';

type H = { id:number; createdAt:string; category:string; questionCount:number; score:number; learner?: string | null; subject?: string | null };

function LearnerOverview({ name, href, emoji, attempts }: { name: 'Kiur'|'Kirsi'; href:string; emoji:string; attempts:H[] }) {
  const latest = attempts.slice(0, 3);
  const today = attempts.filter((a) => isTodayIso(a.createdAt));
  const avg = today.length ? Math.round(today.reduce((sum,a)=>sum+scorePercent(a.score,a.questionCount),0)/today.length) : null;

  return (
    <section className='card'>
      <Link className='profile-card' href={href}>
        <span className='profile-avatar' aria-hidden>{emoji}</span>
        <strong>{name}</strong>
      </Link>
      <h3>Viimased harjutused</h3>
      {latest.length === 0 ? <p>Ajalugu puudub.</p> : (
        <div className='history-mini'>
          {latest.map((a) => (
            <p key={a.id}>{subjectLabel(a.subject)} · {new Date(a.createdAt).toLocaleTimeString('et-EE', { hour: '2-digit', minute: '2-digit' })} · {a.score}/{a.questionCount}</p>
          ))}
        </div>
      )}
      <p>Täna tehtud: {today.length} harjutust{avg === null ? '' : ` · Keskmine tulemus: ${avg}%`}</p>
    </section>
  );
}

export default function Home() {
  const [history, setHistory] = useState<H[]>([]);

  useEffect(() => {
    fetch('/api/history').then((r) => (r.ok ? r.json() : [])).then((rows: H[]) => setHistory(rows)).catch(() => setHistory([]));
  }, []);

  const { kiur, kirsi } = useMemo(() => {
    const kiur = history.filter((h) => !isKirsiAttempt(h.category, h.learner));
    const kirsi = history.filter((h) => isKirsiAttempt(h.category, h.learner));
    return { kiur, kirsi };
  }, [history]);

  return (
    <main className='container'>
      <LearnerOverview name='Kiur' href='/kiur' emoji='👦' attempts={kiur} />
      <LearnerOverview name='Kirsi' href='/kirsi' emoji='👧' attempts={kirsi} />
      <Link className='back-link' href='/history'>Vaata kogu ajalugu</Link>
    </main>
  );
}
