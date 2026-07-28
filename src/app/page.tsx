'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  compactTopicLabel,
  exerciseWord,
  isKirsiAttempt,
  relativeDateTimeLabel,
  subjectLabel,
  todayStandings,
  todayStandingsSummary,
  type DailyStandingsRow
} from '@/lib/history';
import { formatStars } from '@/lib/formatStars';
import NoticeBoard from '@/app/components/NoticeBoard';
import MetricTooltip from '@/app/components/MetricTooltip';
import { fetchHistoryPage } from '@/lib/historyClient';
import { APP_VERSION } from '@/lib/shared/types';
import { starsTooltip, streakTooltip, trophiesTooltip } from '@/lib/metricTooltips';

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
        <MetricTooltip className='streak-badge' label={streakTooltip(streak)}><span aria-hidden>🔥</span><strong>{streak}</strong></MetricTooltip>
        <MetricTooltip className='stars-badge' label={starsTooltip(balance)}><span aria-hidden>⭐</span><strong>{formatStars(balance)}</strong></MetricTooltip>
        <MetricTooltip className='trophy-badge' label={trophiesTooltip(trophies)}><span aria-hidden>🏆</span><strong>{trophies}</strong></MetricTooltip>
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
  const [history, setHistory] = useState<H[]>([]);
  const [streaks, setStreaks] = useState({ kiur: 0, kirsi: 0 });
  const [balances, setBalances] = useState({ kiur: 0, kirsi: 0 });
  const [trophies, setTrophies] = useState({ kiur: 0, kirsi: 0 });
  const [today, setToday] = useState({ kiur: 0, kirsi: 0 });

  useEffect(() => {
    fetchHistoryPage<H>(new URLSearchParams({ limit: '50' }))
      .then((page) => setHistory(page.items))
      .catch(() => setHistory([]));
  }, []);

  // Today's standings come from the same stored row that decides the karikas
  // (daily_leaderboard), not from a re-count of the history page. Counting here
  // disagreed with the trophy: the history page carries no settlement or sprint
  // qualification, so an attempt withheld for parent review or a sprint that
  // missed its threshold still moved the number and could show the crown next
  // to the wrong child — and past 50 attempts the page ran out of rows anyway.
  useEffect(() => {
    fetch('/api/leaderboard')
      .then((response) => response.ok ? response.json() : null)
      .then((board: { days?: DailyStandingsRow[] } | null) => setToday(todayStandings(board?.days)))
      .catch(() => setToday({ kiur: 0, kirsi: 0 }));
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

  return (
    <main className='container dashboard'>
      <TodayLeaderboard kiurCount={today.kiur} kirsiCount={today.kirsi} />
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
