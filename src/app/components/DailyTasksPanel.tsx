'use client';

import Link from 'next/link';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { formatStars } from '@/lib/formatStars';
import { exerciseWord, trophyWord } from '@/lib/history';
import { freezeWord, streakFreezeNotice } from '@/lib/streakFreezeNotice';
import { completeTaskOffline, getDailyTasksOffline, getDashboardSnapshot } from '@/lib/offline/api';
import { useOffline } from '@/app/components/offline/OfflineProvider';
import MetricTooltip from '@/app/components/MetricTooltip';
import { usePeekMode } from '@/app/components/usePeekMode';
import { mayRecordSeenMarker } from '@/lib/peekMode';
import { decideMilestoneNotice } from '@/lib/milestoneNotice';
import { todayDateString } from '@/lib/appDate';
import { achievementLabel, starsTooltip, streakTooltip, trophiesTooltip } from '@/lib/metricTooltips';

// Display-only shortening. The stored title stays "Täiuslik nädal" — only the
// badge caption shrinks, because three captions have to share one row without
// wrapping. The full title is still what the accessible name and the tooltip
// say (see achievementLabel). Keyed by kind, not by the title text: a reworded
// title would otherwise silently stop being shortened and wrap the row again.
const SHORT_ACHIEVEMENT_TITLES: Partial<Record<Achievement['kind'], string>> = { weekly: 'Nädal' };

type Learner = 'kiur' | 'kirsi';

type ChildTask = {
  assignmentId: number;
  taskInstanceId: number;
  title: string;
  points: number;
  assignmentMode: string;
  status: 'active' | 'completed' | 'missed' | 'locked' | 'pending_approval';
  requiresApproval?: boolean;
  completedAt: string | null;
  completedBy: Learner | null;
  // Offline-projected tasks carry their template identity instead of a server
  // assignment id, so completion queues an offline action.
  offline?: boolean;
  templateId?: number;
  templateVersion?: string;
};

type MonthlyCelebration = {
  month: string;
  trophies: number;
  exercises: number;
  prizeStars: number;
};

type Achievement = {
  id: string;
  kind: 'exercise_milestone' | 'daily' | 'weekly';
  title: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  current: number;
  target: number;
  tooltipCount: number;
};

type StreakFreezeState = {
  held: number;
  maxHeld: number;
  price: number;
  canBuy: boolean;
  blockedReason: string | null;
  // Days a freeze is currently standing in for, newest first. Time-boxed by the
  // server, so simply viewing the page never uses the message up.
  recentlyCovered: string[];
};

type ChildDashboard = {
  learner: Learner;
  balance: number;
  streak: number;
  trophies: number;
  tasks: ChildTask[];
  monthlyCelebration: MonthlyCelebration | null;
  achievements: Achievement[];
  streakFreeze?: StreakFreezeState;
};

function learnerName(learner: Learner) {
  return learner === 'kiur' ? 'Kiuri' : 'Kirsi';
}

// `identity` is the child's avatar and name, handed in by the page rather than
// built here: the points, the shop/history buttons and the achievements all
// belong to one identity card, and the panel is the only component that holds
// the other three. Passing the slot in keeps the child's name and avatar owned
// by the page and out of this component's data model.
export default function DailyTasksPanel({ learner, identity }: { learner: Learner; identity: React.ReactNode }) {
  const { online } = useOffline();
  const peekMode = usePeekMode();
  const [data, setData] = useState<ChildDashboard | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmTask, setConfirmTask] = useState<ChildTask | null>(null);
  const [bonusOpen, setBonusOpen] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [milestoneNotice, setMilestoneNotice] = useState<Achievement | null>(null);
  // Done tasks live behind a collapsed bar. Collapsed is the default, and the
  // child's own choice is remembered per child — read after mount, because
  // localStorage on the server would desync the first render.
  const [doneOpen, setDoneOpen] = useState(false);
  // The row the child just ticked, kept rendered a moment longer so it can be
  // seen travelling into the bar rather than simply vanishing.
  const [leavingId, setLeavingId] = useState<number | null>(null);
  const leaveTimer = useRef<number | null>(null);
  const doneListId = useId();

  useEffect(() => () => {
    if (leaveTimer.current !== null) window.clearTimeout(leaveTimer.current);
  }, []);

  const load = useCallback(() => {
    setError('');
    fetch(`/api/child-dashboard?learner=${learner}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setData)
      .catch(async () => {
        // Offline: show the last confirmed balance/streak/trophies from the cached
        // snapshot, plus today's tasks projected from the cached templates with any
        // queued local completion overlaid.
        const [snapshot, offlineTasks] = await Promise.all([
          getDashboardSnapshot(learner).catch(() => undefined),
          getDailyTasksOffline(learner).catch(() => [])
        ]);
        const tasks: ChildTask[] = offlineTasks.map((task) => ({
          assignmentId: -task.templateId,
          taskInstanceId: -task.templateId,
          title: task.title,
          points: task.points,
          assignmentMode: task.assignmentMode,
          status: task.status,
          requiresApproval: task.requiresApproval,
          completedAt: null,
          completedBy: null,
          offline: true,
          templateId: task.templateId,
          templateVersion: task.templateVersion
        }));
        if (snapshot) {
          setData({ learner, balance: snapshot.balance, streak: snapshot.streak, trophies: snapshot.trophies, tasks, monthlyCelebration: null, achievements: [] });
        } else if (tasks.length > 0) {
          setData({ learner, balance: 0, streak: 0, trophies: 0, tasks, monthlyCelebration: null, achievements: [] });
        } else {
          setError('Päevategevusi ei saanud laadida.');
        }
      });
  }, [learner]);

  useEffect(() => {
    load();
  }, [load, online]);

  const completeTask = async () => {
    if (!confirmTask) return;
    if (!online && !confirmTask.offline) {
      setError('See tegevus ei ole veel võrguühenduseta lõpetamiseks ette valmistatud. Taasta internetiühendus või ava töölaud uuesti, et kasutada salvestatud päevategevusi.');
      setConfirmTask(null);
      return;
    }
    setBusyId(confirmTask.assignmentId);
    setError('');
    try {
      // Offline-projected task → queue an offline action (server settles on sync).
      if (confirmTask.offline && confirmTask.templateId != null && confirmTask.templateVersion) {
        const result = await completeTaskOffline({
          learner,
          templateId: confirmTask.templateId,
          templateVersion: confirmTask.templateVersion,
          taskDate: todayDateString(),
          snapshot: { title: confirmTask.title, points: confirmTask.points, assignmentMode: confirmTask.assignmentMode, requiresApproval: Boolean(confirmTask.requiresApproval) }
        });
        // RTM3-H04: only confirm a save when something was actually queued. If an
        // action already occupies this task's slot, nothing new was created, so the
        // "saved" confirmation would be misleading.
        if (result.queued) {
          setNotice(confirmTask.requiresApproval ? 'Saadetud vanemale kinnitamiseks.' : 'Salvestatud. Sünkroonitakse, kui internet naaseb.');
        } else {
          setNotice('See tegevus on juba salvestatud.');
        }
        setConfirmTask(null);
        load();
        return;
      }

      const res = await fetch('/api/tasks/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ learner, assignmentId: confirmTask.assignmentId })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Tegevust ei saanud märkida.');
      }
      const body = await res.json().catch(() => ({}));
      if (body.pending) setNotice('Saadetud vanemale kinnitamiseks.');
      else setNotice('');
      if (body.dailyBonus?.awarded) setBonusOpen(true);
      const completedId = confirmTask.assignmentId;
      setConfirmTask(null);
      // Let the row be seen travelling into the done bar before the refetch
      // removes it. Reduced motion skips straight to the new state.
      let reduced = true;
      try {
        reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      } catch {
        // matchMedia unavailable — treat as reduced and skip the animation.
      }
      if (reduced) {
        load();
      } else {
        setLeavingId(completedId);
        leaveTimer.current = window.setTimeout(() => {
          leaveTimer.current = null;
          setLeavingId(null);
          load();
        }, 240);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tegevust ei saanud märkida.');
    } finally {
      setBusyId(null);
    }
  };

  const balance = data?.balance ?? 0;
  const trophies = data?.trophies ?? 0;
  const celebration = data?.monthlyCelebration ?? null;
  const streakFreeze = data?.streakFreeze ?? null;
  const freezeNotice = streakFreeze
    ? streakFreezeNotice({ coveredDays: streakFreeze.recentlyCovered.length, held: streakFreeze.held })
    : null;
  const achievements = useMemo(() => data?.achievements ?? [], [data]);
  const tasks = data?.tasks ?? [];
  const isDone = (task: ChildTask) => task.status === 'completed' || task.status === 'locked';
  const activeTasks = tasks.filter((task) => !isDone(task));
  const doneTasks = tasks.filter(isDone);
  // A locked task was completed by the sibling, so its stars are theirs — the
  // bar only claims the points this child actually earned.
  const earnedPoints = doneTasks.reduce((sum, task) => (task.status === 'completed' ? sum + task.points : sum), 0);
  const storeHref = learner === 'kiur' ? '/kiur/pood' : '/kirsi/pood';

  const milestoneStorageKey = `exercise-milestone:${learner}`;
  const doneOpenStorageKey = `daily-done-open:${learner}`;

  useEffect(() => {
    try {
      setDoneOpen(window.localStorage.getItem(doneOpenStorageKey) === '1');
    } catch {
      // localStorage unavailable (private mode) — stay collapsed.
    }
  }, [doneOpenStorageKey]);

  const toggleDone = () => {
    setDoneOpen((open) => {
      const next = !open;
      try {
        window.localStorage.setItem(doneOpenStorageKey, next ? '1' : '0');
      } catch {
        // Ignore storage failures; the choice simply does not survive a reload.
      }
      return next;
    });
  };

  const recordMilestoneSeen = useCallback((milestoneId: string) => {
    // Peeking never spends the notice — that is the whole point of peek mode.
    if (!mayRecordSeenMarker(peekMode)) return;
    try {
      window.localStorage.setItem(milestoneStorageKey, milestoneId);
    } catch {
      // Ignore storage failures; the notice simply reappears next time.
    }
  }, [milestoneStorageKey, peekMode]);

  useEffect(() => {
    const milestone = achievements.find((achievement) => achievement.kind === 'exercise_milestone' && achievement.unlocked);
    if (!milestone) return;
    let seenMilestoneId: string | null = null;
    try {
      seenMilestoneId = window.localStorage.getItem(milestoneStorageKey);
    } catch {
      // localStorage unavailable (private mode) — treat it as a first visit.
    }
    const decision = decideMilestoneNotice({ seenMilestoneId, milestoneId: milestone.id, peekMode });
    if (decision.recordNow) recordMilestoneSeen(milestone.id);
    if (decision.show) setMilestoneNotice(milestone);
  }, [achievements, milestoneStorageKey, peekMode, recordMilestoneSeen]);

  const dismissMilestone = () => {
    if (milestoneNotice) recordMilestoneSeen(milestoneNotice.id);
    setMilestoneNotice(null);
  };

  const renderTask = (task: ChildTask) => {
    const completed = task.status === 'completed';
    const locked = task.status === 'locked';
    const pending = task.status === 'pending_approval';
    return (
      <button
        type='button'
        key={task.assignmentId}
        className={[
          'daily-task-row',
          completed ? 'completed' : locked ? 'locked' : pending ? 'pending' : '',
          leavingId === task.assignmentId ? 'leaving' : ''
        ].filter(Boolean).join(' ')}
        disabled={completed || locked || pending || busyId === task.assignmentId}
        onClick={() => setConfirmTask(task)}
      >
        <span className='daily-check' aria-hidden>{completed ? '✓' : pending ? '⏳' : locked ? '-' : ''}</span>
        <span className='daily-title'>{task.title}</span>
        <span className='daily-reward'>+{task.points} ⭐</span>
        {pending && <small>Ootab vanema kinnitust</small>}
        {locked && <small>Tehtud {task.completedBy ? learnerName(task.completedBy) : 'teise lapse'} poolt</small>}
      </button>
    );
  };

  return (
    <section className='daily-panel'>
      {celebration && (
        <div className='monthly-celebration' role='status'>
          <span className='monthly-celebration-trophy' aria-hidden>🏆</span>
          <div className='monthly-celebration-text'>
            <strong>Sa olid eelmise kuu parim!</strong>
            <span>Said {celebration.trophies} {trophyWord(celebration.trophies)}, lahendades {celebration.exercises} {exerciseWord(celebration.exercises)}.</span>
            {celebration.prizeStars > 0 && <span className='monthly-celebration-prize'>Auhind: +{formatStars(celebration.prizeStars)} ⭐</span>}
          </div>
        </div>
      )}
      {freezeNotice && (
        <div className='freeze-used-notice' role='status'>
          <span aria-hidden>❄️</span>
          <span className='freeze-used-text'>
            <strong>{freezeNotice.headline}</strong>
            <small>{freezeNotice.detail}</small>
          </span>
        </div>
      )}

      <div className='child-identity-card'>
        <div className='child-home-header'>
          {identity}
          {/* The captions are gone, so the label has to live on the control. */}
          <Link className='identity-action' href={storeHref} aria-label='Pood' title='Pood'><span aria-hidden>🛒</span></Link>
          <Link className='identity-action' href='/history' aria-label='Ajalugu' title='Ajalugu'><span aria-hidden>📜</span></Link>
        </div>

        <div className='daily-summary'>
          <MetricTooltip className='daily-summary-metric' label={starsTooltip(balance)}>⭐ <strong>{formatStars(balance)}</strong></MetricTooltip>
          <MetricTooltip className='daily-summary-metric' label={streakTooltip(data?.streak ?? 0)}>🔥 <strong>{data?.streak ?? 0}</strong></MetricTooltip>
          <MetricTooltip className='daily-summary-metric' label={trophiesTooltip(trophies)}>🏆 <strong>{trophies}</strong></MetricTooltip>
          {streakFreeze && streakFreeze.held > 0 && (
            <MetricTooltip
              className='daily-summary-metric'
              label={`Sul on ${streakFreeze.held} ${freezeWord(streakFreeze.held)}. Kui üks päev jääb harjutamata, kasutatakse see automaatselt ära ja õpiseeria jääb alles.`}
            >❄️ <strong>{streakFreeze.held}</strong></MetricTooltip>
          )}
        </div>

        {achievements.length > 0 && (
          <>
            <div className='identity-divider' aria-hidden />
            <div className='achievement-strip' aria-label='Saavutused'>
              {achievements.map((achievement) => (
                <MetricTooltip
                  key={achievement.id}
                  className={achievement.unlocked ? 'achievement-badge unlocked' : 'achievement-badge locked'}
                  label={achievementLabel(achievement)}
                >
                  {/* No padlock: grey is what says locked, and the accessible
                      name spells it out for anyone who cannot see the grey. */}
                  <span className='achievement-emoji' aria-hidden>{achievement.emoji}</span>
                  <span className='achievement-text'>
                    <strong>{SHORT_ACHIEVEMENT_TITLES[achievement.kind] ?? achievement.title}</strong>
                    <small>{achievement.unlocked ? 'Tehtud!' : `${achievement.current}/${achievement.target}`}</small>
                  </span>
                </MetricTooltip>
              ))}
            </div>
          </>
        )}
      </div>

      {milestoneNotice && (
        <div className='achievement-notice' role='status'>
          <span aria-hidden>🎉</span>
          <strong>Saavutus: {milestoneNotice.title}!</strong>
          <button type='button' aria-label='Sulge saavutuseteade' onClick={dismissMilestone}>×</button>
        </div>
      )}

      <div className='daily-task-card'>
        <div className='daily-task-head'>
          <h2>Päevased tegevused</h2>
          {tasks.length > 0 && (
            <span className='daily-progress-pill'>{doneTasks.length}/{tasks.length} ✓</span>
          )}
        </div>
        {error && <p className='error'>{error}</p>}
        {notice && <p className='ok'>{notice}</p>}
        {!data ? (
          <p>Laadin...</p>
        ) : tasks.length === 0 ? (
          <p>Tänaseid tegevusi ei ole.</p>
        ) : (
          <>
            {activeTasks.length > 0 && (
              <div className='daily-task-list'>
                {activeTasks.map(renderTask)}
              </div>
            )}
            {activeTasks.length === 0 && (
              <p className='daily-all-done'>Kõik tänased tegevused on tehtud! 🎉</p>
            )}
            {/* Done work leaves the list entirely and sits behind one bar at the
                foot of the card — with nothing done, there is no bar at all. */}
            {doneTasks.length > 0 && (
              <div className='daily-done'>
                <button
                  type='button'
                  className='daily-done-bar'
                  aria-expanded={doneOpen}
                  aria-controls={doneListId}
                  onClick={toggleDone}
                >
                  <span className='daily-done-check' aria-hidden>✓</span>
                  <span className='daily-done-label'>
                    Tehtud tegevused ({doneTasks.length}){earnedPoints > 0 && <> · +{earnedPoints} ⭐</>}
                  </span>
                  <span className='daily-done-caret' aria-hidden>▾</span>
                </button>
                <div id={doneListId} role='group' aria-label='Tehtud tegevused' className='daily-task-list daily-done-list' hidden={!doneOpen}>
                  {doneTasks.map(renderTask)}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {confirmTask && (
        <div className='task-modal-backdrop' role='dialog' aria-modal='true' aria-labelledby='complete-task-title'>
          <div className='task-modal'>
            <h2 id='complete-task-title'>Kas tegevus on tehtud?</h2>
            <p>{confirmTask.title}</p>
            <strong>+{confirmTask.points} ⭐</strong>
            {confirmTask.requiresApproval && <p className='daily-approval-hint'>✋ Vanem kinnitab tähed.</p>}
            <div className='task-modal-actions'>
              <button type='button' className='filter-chip' autoFocus onClick={() => setConfirmTask(null)}>Ei</button>
              <button type='button' onClick={completeTask} disabled={busyId === confirmTask.assignmentId}>Jah, tehtud</button>
            </div>
          </div>
        </div>
      )}

      {bonusOpen && (
        <div className='task-modal-backdrop' role='dialog' aria-modal='true' aria-labelledby='bonus-task-title'>
          <div className='task-modal'>
            <h2 id='bonus-task-title'>Boonuspunkt</h2>
            <p>Mõlemal on tänased ülesanded tehtud. Siit tuleb boonuspunkt.</p>
            <strong>Kiur +1 ⭐ ja Kirsi +1 ⭐</strong>
            <button type='button' autoFocus onClick={() => setBonusOpen(false)}>Selge</button>
          </div>
        </div>
      )}
    </section>
  );
}
