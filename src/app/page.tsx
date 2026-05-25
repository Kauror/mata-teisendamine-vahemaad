'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { compactTopicLabel, isKirsiAttempt, isTodayIso, scorePercent, subjectLabel } from '@/lib/history';

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

function getAverageTone(average: number | null) {
  if (average === null) return 'average-neutral';
  if (average >= 80) return 'average-good';
  if (average >= 60) return 'average-medium';
  return 'average-low';
}

function ChildDashboardCard({
  name,
  href,
  avatar,
  accent,
  attempts
}: {
  name: 'Kiur' | 'Kirsi';
  href: '/kiur' | '/kirsi';
  avatar: string;
  accent: 'blue' | 'pink';
  attempts: H[];
}) {
  const router = useRouter();
  const latest = attempts.slice(0, 3);
  const today = attempts.filter((a) => isTodayIso(a.createdAt));
  const average = today.length
    ? Math.round(today.reduce((sum, a) => sum + scorePercent(a.score, a.questionCount), 0) / today.length)
    : null;

  const last = attempts[0];
  const lastText = last
    ? `Viimati harjutas ${new Date(last.createdAt).toLocaleTimeString('et-EE', { hour: '2-digit', minute: '2-digit' })}`
    : 'Harjutusi pole veel tehtud';

  return (
    <section
      className='child-dashboard-card'
      data-accent={accent}
      role='button'
      tabIndex={0}
      onClick={() => router.push(href)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          router.push(href);
        }
      }}
    >
      <div className='child-profile'>
        <div className='child-avatar' aria-hidden>{avatar}</div>
        <div>
          <h2 className='child-name'>{name}</h2>
          <p className='last-practiced'>{lastText}</p>
        </div>
      </div>

      <div className='stats'>
        <div className='stat-tile'>
          <span>Täna tehtud</span>
          <strong>{today.length}</strong>
          <small>harjutust</small>
        </div>
        <div className={`stat-tile ${getAverageTone(average)}`}>
          <span>Keskmine tulemus</span>
          <strong>{average === null ? '—' : `${average}%`}</strong>
        </div>
      </div>

      <div className='recent-panel'>
        <h3 className='recent-title'>Viimased harjutused</h3>
        {latest.length === 0 ? (
          <p>Ajalugu puudub.</p>
        ) : (
          <div className='exercise-list'>
            {latest.map((attempt) => (
              <p key={attempt.id} className='exercise-row'>
                {subjectLabel(attempt.subject)}
                {compactTopicLabel(attempt.topic, attempt.category) ? ` · ${compactTopicLabel(attempt.topic, attempt.category)}` : ''} · {' '}
                {new Date(attempt.createdAt).toLocaleTimeString('et-EE', { hour: '2-digit', minute: '2-digit' })} · {' '}
                {attempt.score}/{attempt.questionCount}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className='card-actions'>
        <button
          type='button'
          className='subject-button'
          onClick={(event) => {
            event.stopPropagation();
            router.push(href);
          }}
        >
          Vali aine
        </button>

        <Link
          href='/history'
          className='history-link'
          onClick={(event) => event.stopPropagation()}
        >
          Vaata kogu ajalugu →
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  const [history, setHistory] = useState<H[]>([]);

  useEffect(() => {
    fetch('/api/history')
      .then((response) => (response.ok ? response.json() : []))
      .then((rows: H[]) => setHistory(rows))
      .catch(() => setHistory([]));
  }, []);

  const { kiur, kirsi } = useMemo(() => {
    const kiur = history.filter((attempt) => !isKirsiAttempt(attempt.category, attempt.learner));
    const kirsi = history.filter((attempt) => isKirsiAttempt(attempt.category, attempt.learner));
    return { kiur, kirsi };
  }, [history]);

  return (
    <main className='container dashboard'>
      <div className='children-list'>
        <ChildDashboardCard name='Kiur' href='/kiur' avatar='👦' accent='blue' attempts={kiur} />
        <ChildDashboardCard name='Kirsi' href='/kirsi' avatar='👧' accent='pink' attempts={kirsi} />
      </div>
    </main>
  );
}
