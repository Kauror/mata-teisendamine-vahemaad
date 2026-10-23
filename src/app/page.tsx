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
import MetricTooltip from '@/app/components/MetricTooltip';
import { useAppClock } from '@/app/components/useAppClock';
import { homeStatus, type AppClock } from '@/lib/schoolTimetable';
import { APP_VERSION } from '@/lib/shared/types';
import { starsTooltip, streakTooltip, trophiesTooltip } from '@/lib/metricTooltips';
import { MEDALS, PLAYER_NAMES, type StandingRow } from '@/lib/kaardimang/competition';

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

// The newest star-free English or Loodusõpetus work (practice, reading, a test
// that did not count), so "Viimati" is not stuck on an older exercise.
type Activity = { createdAt: string; subject: string; title: string };
type HomeChild = { streak?: number; balance?: number; trophies?: number; recent?: H[]; latestActivity?: Activity | null };
type KaardimangHome = { title: string; status: 'active' | 'ended'; endDate: string; daysLeftEt: string | null; standings: StandingRow[] };
type HomeSummary = { today?: { kiur?: number; kirsi?: number }; children?: { kiur?: HomeChild; kirsi?: HomeChild }; kaardimang?: KaardimangHome | null };

// The family's map-game competition: places 1–4 and points, nothing more.
function KaardimangStandings({ competition }: { competition: KaardimangHome }) {
  return (
    <section className='km-home' aria-label={`Kaardimängu võistlus ${competition.title}`}>
      <p className='km-home-title'>🗺️ Kaardimäng · „{competition.title}“ <span>{competition.status === 'active' ? competition.daysLeftEt : 'lõppes'}</span></p>
      <ol className='km-home-table'>
        {competition.standings.map((row) => (
          <li key={row.player}>
            <span aria-hidden>{row.rank <= 3 && row.points > 0 ? MEDALS[row.rank - 1] : `${row.rank}.`}</span>
            <strong>{PLAYER_NAMES[row.player]}</strong>
            <span>{row.points} p</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

// "Choose your character": the whole card opens the child's page. The name is
// the link and its ::after stretches over the card; the metric tooltips sit
// above that layer so a tap on a number still explains it.
function ChildDashboardCard({ name, href, avatar, accent, attempts, activity, streak, balance, trophies, clock }: { name: 'Kiur' | 'Kirsi'; href: '/kiur' | '/kirsi'; avatar: string; accent: 'blue' | 'pink'; attempts: H[]; activity: Activity | null; streak: number; balance: number; trophies: number; clock: AppClock | null }) {
  const learner = name === 'Kiur' ? 'kiur' : 'kirsi';
  const exercise = attempts[0];
  const status = clock ? homeStatus(learner, clock) : null;
  const activityIsNewer = Boolean(activity && (!exercise || Date.parse(activity.createdAt) > Date.parse(exercise.createdAt)));
  const latest = activityIsNewer ? activity : exercise;
  const latestWhat = activityIsNewer && activity
    ? subjectLabel(activity.subject)
    : exercise ? (compactTopicLabel(exercise.topic, exercise.category) || subjectLabel(exercise.subject)) : '';

  return (
    <section className='child-dashboard-card' data-accent={accent} aria-labelledby={`${learner}-dashboard-name`}>
      <div className='child-avatar' aria-hidden>{avatar}</div>
      <div className='child-card-body'>
        <div className='child-card-top'>
          <h2 className='child-name' id={`${learner}-dashboard-name`}><Link className='child-card-link' href={href}>{name}</Link></h2>
          {/* A quiet shortcut: the school line opens both children's timetables. */}
          {status && <Link className='child-status' data-kind={status.kind} href='/tunniplaan'><span aria-hidden>{status.icon}</span> {status.text}</Link>}
        </div>
        <div className='child-overview'>
          <MetricTooltip className='streak-badge' label={streakTooltip(streak)}><span aria-hidden>🔥</span><strong>{streak}</strong></MetricTooltip>
          <MetricTooltip className='stars-badge' label={starsTooltip(balance)}><span aria-hidden>⭐</span><strong>{formatStars(balance)}</strong></MetricTooltip>
          <MetricTooltip className='trophy-badge' label={trophiesTooltip(trophies)}><span aria-hidden>🏆</span><strong>{trophies}</strong></MetricTooltip>
        </div>
        <p className='child-last'>
          <span className='child-last-label'>Viimati</span>
          <span className='child-last-what'>{latest ? `${latestWhat} · ${relativeDateTimeLabel(latest.createdAt)}` : 'pole veel harjutanud'}</span>
        </p>
      </div>
      <span className='child-card-arrow' aria-hidden>→</span>
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
  const [activity, setActivity] = useState<{ kiur: Activity | null; kirsi: Activity | null }>({ kiur: null, kirsi: null });
  const [streaks, setStreaks] = useState({ kiur: 0, kirsi: 0 });
  const [balances, setBalances] = useState({ kiur: 0, kirsi: 0 });
  const [trophies, setTrophies] = useState({ kiur: 0, kirsi: 0 });
  const [today, setToday] = useState({ kiur: 0, kirsi: 0 });
  const [kaardimang, setKaardimang] = useState<KaardimangHome | null>(null);

  const clock = useAppClock();

  // One request for everything on this page (/api/home-summary). Each card
  // shows the newest of its own rows (the server's learner filter covers legacy
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
        setActivity({ kiur: child('kiur')?.latestActivity ?? null, kirsi: child('kirsi')?.latestActivity ?? null });
        setToday({ kiur: summary?.today?.kiur ?? 0, kirsi: summary?.today?.kirsi ?? 0 });
        setKaardimang(summary?.kaardimang ?? null);
        setStreaks({ kiur: child('kiur')?.streak ?? 0, kirsi: child('kirsi')?.streak ?? 0 });
        setBalances({ kiur: child('kiur')?.balance ?? 0, kirsi: child('kirsi')?.balance ?? 0 });
        setTrophies({ kiur: child('kiur')?.trophies ?? 0, kirsi: child('kirsi')?.trophies ?? 0 });
      });
  }, []);

  const { kiur, kirsi } = history;

  return (
    <main className='container dashboard'>
      <TodayLeaderboard kiurCount={today.kiur} kirsiCount={today.kirsi} />
      <div className='children-list'>
        <ChildDashboardCard name='Kiur' href='/kiur' avatar='👦' accent='blue' attempts={kiur} activity={activity.kiur} streak={streaks.kiur} balance={balances.kiur} trophies={trophies.kiur} clock={clock} />
        <ChildDashboardCard name='Kirsi' href='/kirsi' avatar='👧' accent='pink' attempts={kirsi} activity={activity.kirsi} streak={streaks.kirsi} balance={balances.kirsi} trophies={trophies.kirsi} clock={clock} />
      </div>
      {kaardimang ? <KaardimangStandings competition={kaardimang} /> : null}
      <NoticeBoard />
      <div className='dashboard-footer-links'>
        <Link href='/history' className='dashboard-history-link'>Ajalugu</Link>
        <Link href='/vanem' className='dashboard-history-link'>Lapsevanema ala</Link>
      </div>
      <p className='dashboard-version'>v{APP_VERSION}</p>
    </main>
  );
}
