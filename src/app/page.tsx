'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { compactTopicLabel, isKirsiAttempt, isTodayIso, relativeDateTimeLabel, subjectLabel } from '@/lib/history';

type H = {
  id: number;
  createdAt: string;
  category: string;
  questionCount: number;
  score: number;
  learner?: string | null;
  subject?: string | null;
  topic?: string | null;
};

function ChildDashboardCard({ name, href, avatar, accent, attempts, streak }: { name: 'Kiur' | 'Kirsi'; href: '/kiur' | '/kirsi'; avatar: string; accent: 'blue' | 'pink'; attempts: H[]; streak: number }) {
  const router = useRouter();
  const latest = attempts.slice(0, 3);
  const today = attempts.filter((a) => isTodayIso(a.createdAt));
  const last = attempts[0];
  const lastText = last ? `Viimati harjutas ${relativeDateTimeLabel(last.createdAt)}` : 'Harjutusi pole veel tehtud';

  return (
    <section className='child-dashboard-card' data-accent={accent} role='button' tabIndex={0} onClick={() => router.push(href)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); router.push(href); } }}>
      <div className='child-profile'>
        <div className='child-avatar' aria-hidden>{avatar}</div>
        <div>
          <h2 className='child-name'>{name}</h2>
          <p className='last-practiced'>{lastText}</p>
          <p className='today-practiced'>Täna tehtud: {today.length} harjutust</p>
        </div>
      </div>

      <div className='child-overview'>
        <p className='streak-badge'><span aria-hidden>🔥</span><strong>{streak}</strong> päeva õpiseeria</p>
      </div>

      <div className='recent-panel'>
        <h3 className='recent-title'>Viimased harjutused</h3>
        {latest.length === 0 ? (
          <p className='recent-empty'>Ajalugu puudub.</p>
        ) : (
          <div className='exercise-list'>
            {latest.map((attempt) => (
              <p key={attempt.id} className='exercise-row'>
                {subjectLabel(attempt.subject)}
                {compactTopicLabel(attempt.topic, attempt.category) ? ` · ${compactTopicLabel(attempt.topic, attempt.category)}` : ''} · {' '}
                {relativeDateTimeLabel(attempt.createdAt)} · {' '}
                {attempt.score}/{attempt.questionCount}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className='card-actions'>
        <button type='button' className='subject-button' onClick={(event) => { event.stopPropagation(); router.push(href); }}>Ava harjutused</button>
      </div>
    </section>
  );
}

export default function Home() {
  const [history, setHistory] = useState<H[]>([]);
  const [streaks, setStreaks] = useState({ kiur: 0, kirsi: 0 });

  useEffect(() => {
    fetch('/api/history')
      .then((response) => (response.ok ? response.json() : []))
      .then((rows: H[]) => setHistory(rows))
      .catch(() => setHistory([]));
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/api/child-dashboard?learner=kiur').then((response) => response.ok ? response.json() : null),
      fetch('/api/child-dashboard?learner=kirsi').then((response) => response.ok ? response.json() : null)
    ]).then(([kiur, kirsi]) => setStreaks({ kiur: kiur?.streak ?? 0, kirsi: kirsi?.streak ?? 0 })).catch(() => setStreaks({ kiur: 0, kirsi: 0 }));
  }, []);

  const { kiur, kirsi } = useMemo(() => {
    const kiur = history.filter((attempt) => !isKirsiAttempt(attempt.category, attempt.learner));
    const kirsi = history.filter((attempt) => isKirsiAttempt(attempt.category, attempt.learner));
    return { kiur, kirsi };
  }, [history]);

  return (
    <main className='container dashboard'>
      <div className='children-list'>
        <ChildDashboardCard name='Kiur' href='/kiur' avatar='👦' accent='blue' attempts={kiur} streak={streaks.kiur} />
        <ChildDashboardCard name='Kirsi' href='/kirsi' avatar='👧' accent='pink' attempts={kirsi} streak={streaks.kirsi} />
      </div>
      <div className='dashboard-footer-links'>
        <Link href='/history' className='dashboard-history-link'>Ajalugu</Link>
        <Link href='/vanem' className='dashboard-history-link'>Lapsevanema ala</Link>
      </div>
    </main>
  );
}
