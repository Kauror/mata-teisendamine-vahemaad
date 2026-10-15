'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  compactTopicLabel,
  exerciseWord,
  relativeDateTimeLabel,
  subjectLabel,
  todayStandingsSummary
} from '@/lib/history';
import { formatStars } from '@/lib/formatStars';
import NoticeBoard from '@/app/components/NoticeBoard';
import SchoolNowCard from '@/app/components/SchoolNowCard';
import MetricTooltip from '@/app/components/MetricTooltip';
import { APP_VERSION } from '@/lib/shared/types';
import { starsTooltip, streakTooltip, trophiesTooltip } from '@/lib/metricTooltips';

const RECENT_PER_CHILD = 3;

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

type HomeChild = { streak?: number; balance?: number; trophies?: number; recent?: H[] };
type HomeSummary = { today?: { kiur?: number; kirsi?: number }; children?: { kiur?: HomeChild; kirsi?: HomeChild } };

function ChildDashboardCard({ name, href, avatar, accent, attempts, streak, balance, trophies }: { name: 'Kiur' | 'Kirsi'; href: '/kiur' | '/kirsi'; avatar: string; accent: 'blue' | 'pink'; attempts: H[]; streak: number; balance: number; trophies: number }) {
  const latest = attempts.slice(0, RECENT_PER_CHILD);
  const learner = name === 'Kiur' ? 'kiur' : 'kirsi';

  return (
    <section className='child-dashboard-card' data-accent={accent} aria-labelledby={`${learner}-dashboard-name`}>
      {/* The badges sit beside the name rather than on a row of their own,
          which keeps both cards short enough to see together. */}
      <div className='child-profile'>
        <div className='child-avatar' aria-hidden>{avatar}</div>
        <h2 className='child-name' id={`${learner}-dashboard-name`}>{name}</h2>
        <div className='child-overview'>
          <MetricTooltip className='streak-badge' label={streakTooltip(streak)}><span aria-hidden>🔥</span><strong>{streak}</strong></MetricTooltip>
          <MetricTooltip className='stars-badge' label={starsTooltip(balance)}><span aria-hidden>⭐</span><strong>{formatStars(balance)}</strong></MetricTooltip>
          <MetricTooltip className='trophy-badge' label={trophiesTooltip(trophies)}><span aria-hidden>🏆</span><strong>{trophies}</strong></MetricTooltip>
        </div>
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
        <Link className='subject-button' href={href}>Harjutused</Link>
        <Link className='timetable-button' href={`${href}/tunniplaan`}><span aria-hidden>📅</span> Tunniplaan</Link>
      </div>
    </section>
  );
}

// A tug-of-war bar: one shared strip split by today's counts. It replaces two
// side-by-side cards and has to live in the same vertical space, so the numbers
// sit on one line above a 10px strip.
function TodayLeaderboard({ kiurCount, kirsiCount }: { kiurCount: number; kirsiCount: number }) {
  const nobodyYet = kiurCount === 0 && kirsiCount === 0;
  const tie = kiurCount === kirsiCount;
  const leader: 'kiur' | 'kirsi' | null = nobodyYet || tie ? null : kiurCount > kirsiCount ? 'kiur' : 'kirsi';
  // A count of 0 would collapse its side entirely; the epsilon keeps the strip
  // whole while still reading as "almost nothing". Before anyone has started,
  // the two halves are even and grey rather than a 50/50 contest nobody entered.
  const share = (count: number) => (nobodyYet ? 1 : Math.max(count, 0.001));
  // The trophy is dimmed for whoever is behind. A draw leaves both bright; with
  // nothing done yet there is nothing to celebrate, so both dim.
  const dimmed = (side: 'kiur' | 'kirsi') => (nobodyYet ? true : leader !== null && leader !== side);

  const count = (value: number) => (
    // The number is what you see; the noun is still there for screen readers,
    // which is also what keeps the wording guard in the audit spec honest.
    <span className='leaderboard-count'>{value}<span className='sr-only'> {exerciseWord(value)}</span></span>
  );

  return (
    <MetricTooltip className='today-leaderboard' label={todayStandingsSummary(kiurCount, kirsiCount)}>
      <span className='leaderboard-head'>
        <span className='leaderboard-side' data-accent='blue'>
          <span className='leaderboard-name'>Kiur</span>
          {/* Trophy and number are one unit, held away from the name so it is
              obvious which score the cup belongs to. */}
          <span className='leaderboard-score'>
            <span className='leaderboard-trophy' data-dim={dimmed('kiur')} aria-hidden>🏆</span>
            {count(kiurCount)}
          </span>
        </span>
        <span className='leaderboard-side leaderboard-side-end' data-accent='pink'>
          <span className='leaderboard-score'>
            <span className='leaderboard-trophy' data-dim={dimmed('kirsi')} aria-hidden>🏆</span>
            {count(kirsiCount)}
          </span>
          <span className='leaderboard-name'>Kirsi</span>
        </span>
      </span>
      <span className='leaderboard-bar' data-empty={nobodyYet} aria-hidden>
        <span className='leaderboard-bar-kiur' style={{ flex: share(kiurCount) }} />
        <span className='leaderboard-bar-gap' />
        <span className='leaderboard-bar-kirsi' style={{ flex: share(kirsiCount) }} />
      </span>
    </MetricTooltip>
  );
}

export default function Home() {
  const [history, setHistory] = useState<{ kiur: H[]; kirsi: H[] }>({ kiur: [], kirsi: [] });
  const [streaks, setStreaks] = useState({ kiur: 0, kirsi: 0 });
  const [balances, setBalances] = useState({ kiur: 0, kirsi: 0 });
  const [trophies, setTrophies] = useState({ kiur: 0, kirsi: 0 });
  const [today, setToday] = useState({ kiur: 0, kirsi: 0 });

  // One request for everything on this page (/api/home-summary). Each card
  // gets its own three newest rows (the server's learner filter covers legacy
  // rows without a learner, using the same category rule as isKirsiAttempt).
  // Today's standings are the stored daily_leaderboard row that decides the
  // karikas, not a re-count of history: an attempt held for parent review or a
  // sprint that missed its threshold must not move the number. On failure the
  // page shows zeros and empty lists, as before.
  useEffect(() => {
    fetch('/api/home-summary', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() as Promise<HomeSummary> : null)
      .catch(() => null)
      .then((summary) => {
        const child = (learner: 'kiur' | 'kirsi') => summary?.children?.[learner];
        setHistory({ kiur: child('kiur')?.recent ?? [], kirsi: child('kirsi')?.recent ?? [] });
        setToday({ kiur: summary?.today?.kiur ?? 0, kirsi: summary?.today?.kirsi ?? 0 });
        setStreaks({ kiur: child('kiur')?.streak ?? 0, kirsi: child('kirsi')?.streak ?? 0 });
        setBalances({ kiur: child('kiur')?.balance ?? 0, kirsi: child('kirsi')?.balance ?? 0 });
        setTrophies({ kiur: child('kiur')?.trophies ?? 0, kirsi: child('kirsi')?.trophies ?? 0 });
      });
  }, []);

  const { kiur, kirsi } = history;

  return (
    <main className='container dashboard'>
      <TodayLeaderboard kiurCount={today.kiur} kirsiCount={today.kirsi} />
      <SchoolNowCard />
      <div className='children-list'>
        <ChildDashboardCard name='Kiur' href='/kiur' avatar='👦' accent='blue' attempts={kiur} streak={streaks.kiur} balance={balances.kiur} trophies={trophies.kiur} />
        <ChildDashboardCard name='Kirsi' href='/kirsi' avatar='👧' accent='pink' attempts={kirsi} streak={streaks.kirsi} balance={balances.kirsi} trophies={trophies.kirsi} />
      </div>
      <NoticeBoard />
      <div className='dashboard-footer-links'>
        <Link href='/history' className='dashboard-history-link'>Ajalugu</Link>
        <Link href='/vanem' className='dashboard-history-link'>Lapsevanema ala</Link>
      </div>
      <p className='dashboard-version'>v{APP_VERSION}</p>
    </main>
  );
}
