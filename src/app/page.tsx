'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { compactTopicLabel, isKirsiAttempt, isTodayIso, relativeDateTimeLabel, subjectLabel, trophyWord } from '@/lib/history';
import { formatStars } from '@/lib/formatStars';
import NoticeBoard from '@/app/components/NoticeBoard';
import { fetchHistoryPage } from '@/lib/historyClient';

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

function ChildDashboardCard({ name, href, avatar, accent, attempts, streak, balance, trophies }: { name: 'Kiur' | 'Kirsi'; href: '/kiur' | '/kirsi'; avatar: string; accent: 'blue' | 'pink'; attempts: H[]; streak: number; balance: number; trophies: number }) {
  const latest = attempts.slice(0, 3);
  const learner = name === 'Kiur' ? 'kiur' : 'kirsi';

  return (
    <section className='child-dashboard-card' data-accent={accent} aria-labelledby={`${learner}-dashboard-name`}>
      <div className='child-profile'>
        <div className='child-avatar' aria-hidden>{avatar}</div>
        <h2 className='child-name' id={`${learner}-dashboard-name`}>{name}</h2>
      </div>

      <div className='child-overview'>
        <p className='streak-badge'><span aria-hidden>🔥</span><strong>{streak}</strong> õpiseeria</p>
        <p className='stars-badge'><span aria-hidden>⭐</span><strong>{formatStars(balance)}</strong> tähte</p>
        <p className='trophy-badge'><span aria-hidden>🏆</span><strong>{trophies}</strong> {trophyWord(trophies)}</p>
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
        <Link className='subject-button' href={href}>Ava harjutused</Link>
        <Link className='history-link' href={`/history?child=${learner}`}>Vaata {name} ajalugu</Link>
      </div>
    </section>
  );
}

function TodayLeaderboard({ kiurCount, kirsiCount }: { kiurCount: number; kirsiCount: number }) {
  const tie = kiurCount === kirsiCount;
  const leader: 'kiur' | 'kirsi' | null = tie ? null : kiurCount > kirsiCount ? 'kiur' : 'kirsi';

  const child = (name: 'Kiur' | 'Kirsi', count: number, isLeader: boolean) => (
    <div className='leaderboard-child' data-leader={isLeader}>
      <span className='leaderboard-trophy' aria-hidden>{isLeader ? '🏆' : ''}</span>
      <span className='leaderboard-name'>{name}</span>
      <span className='leaderboard-count'>{count} ülesannet</span>
    </div>
  );

  return (
    <section className='today-leaderboard' aria-label='Täna harjutatud'>
      {child('Kiur', kiurCount, leader === 'kiur')}
      <span className='leaderboard-vs' aria-hidden>ja</span>
      {child('Kirsi', kirsiCount, leader === 'kirsi')}
    </section>
  );
}

export default function Home() {
  const [history, setHistory] = useState<H[]>([]);
  const [streaks, setStreaks] = useState({ kiur: 0, kirsi: 0 });
  const [balances, setBalances] = useState({ kiur: 0, kirsi: 0 });
  const [trophies, setTrophies] = useState({ kiur: 0, kirsi: 0 });

  useEffect(() => {
    fetchHistoryPage<H>(new URLSearchParams({ limit: '50' }))
      .then((page) => setHistory(page.items))
      .catch(() => setHistory([]));
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/api/child-dashboard?learner=kiur').then((response) => response.ok ? response.json() : null),
      fetch('/api/child-dashboard?learner=kirsi').then((response) => response.ok ? response.json() : null)
    ]).then(([kiur, kirsi]) => {
      setStreaks({ kiur: kiur?.streak ?? 0, kirsi: kirsi?.streak ?? 0 });
      setBalances({ kiur: kiur?.balance ?? 0, kirsi: kirsi?.balance ?? 0 });
      setTrophies({ kiur: kiur?.trophies ?? 0, kirsi: kirsi?.trophies ?? 0 });
    }).catch(() => {
      setStreaks({ kiur: 0, kirsi: 0 });
      setBalances({ kiur: 0, kirsi: 0 });
      setTrophies({ kiur: 0, kirsi: 0 });
    });
  }, []);

  const { kiur, kirsi } = useMemo(() => {
    const kiur = history.filter((attempt) => !isKirsiAttempt(attempt.category, attempt.learner));
    const kirsi = history.filter((attempt) => isKirsiAttempt(attempt.category, attempt.learner));
    return { kiur, kirsi };
  }, [history]);

  const kiurToday = useMemo(() => kiur.filter((attempt) => isTodayIso(attempt.createdAt)).length, [kiur]);
  const kirsiToday = useMemo(() => kirsi.filter((attempt) => isTodayIso(attempt.createdAt)).length, [kirsi]);

  return (
    <main className='container dashboard'>
      <div className='children-list'>
        <ChildDashboardCard name='Kiur' href='/kiur' avatar='👦' accent='blue' attempts={kiur} streak={streaks.kiur} balance={balances.kiur} trophies={trophies.kiur} />
        <ChildDashboardCard name='Kirsi' href='/kirsi' avatar='👧' accent='pink' attempts={kirsi} streak={streaks.kirsi} balance={balances.kirsi} trophies={trophies.kirsi} />
      </div>
      <TodayLeaderboard kiurCount={kiurToday} kirsiCount={kirsiToday} />
      <NoticeBoard />
      <div className='dashboard-footer-links'>
        <Link href='/history' className='dashboard-history-link'>Ajalugu</Link>
        <Link href='/vanem' className='dashboard-history-link'>Lapsevanema ala</Link>
      </div>
    </main>
  );
}
