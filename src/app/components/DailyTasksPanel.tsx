'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatStars } from '@/lib/formatStars';
import { exerciseWord, trophyWord } from '@/lib/history';
import { completeTaskOffline, getDailyTasksOffline, getDashboardSnapshot } from '@/lib/offline/api';
import { useOffline } from '@/app/components/offline/OfflineProvider';
import MetricTooltip from '@/app/components/MetricTooltip';
import { usePeekMode } from '@/app/components/usePeekMode';
import { mayRecordSeenMarker } from '@/lib/peekMode';
import { decideMilestoneNotice } from '@/lib/milestoneNotice';
import { todayDateString } from '@/lib/appDate';
import { achievementTooltip, starsTooltip, streakTooltip, trophiesTooltip } from '@/lib/metricTooltips';

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

type ChildDashboard = {
  learner: Learner;
  balance: number;
  streak: number;
  trophies: number;
  tasks: ChildTask[];
  monthlyCelebration: MonthlyCelebration | null;
  achievements: Achievement[];
};

function learnerName(learner: Learner) {
  return learner === 'kiur' ? 'Kiuri' : 'Kirsi';
}

export default function DailyTasksPanel({ learner }: { learner: Learner }) {
  const { online } = useOffline();
  const peekMode = usePeekMode();
  const [data, setData] = useState<ChildDashboard | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmTask, setConfirmTask] = useState<ChildTask | null>(null);
  const [bonusOpen, setBonusOpen] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [milestoneNotice, setMilestoneNotice] = useState<Achievement | null>(null);

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
      setConfirmTask(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tegevust ei saanud märkida.');
    } finally {
      setBusyId(null);
    }
  };

  const balance = data?.balance ?? 0;
  const trophies = data?.trophies ?? 0;
  const celebration = data?.monthlyCelebration ?? null;
  const achievements = useMemo(() => data?.achievements ?? [], [data]);
  const tasks = data?.tasks ?? [];
  const isDone = (task: ChildTask) => task.status === 'completed' || task.status === 'locked';
  const activeTasks = tasks.filter((task) => !isDone(task));
  const doneTasks = tasks.filter(isDone);
  const storeHref = learner === 'kiur' ? '/kiur/pood' : '/kirsi/pood';

  const milestoneStorageKey = `exercise-milestone:${learner}`;

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
        className={completed ? 'daily-task-row completed' : locked ? 'daily-task-row locked' : pending ? 'daily-task-row pending' : 'daily-task-row'}
        disabled={completed || locked || pending || busyId === task.assignmentId}
        onClick={() => setConfirmTask(task)}
      >
        <span className='daily-check'>{completed ? '✓' : pending ? '⏳' : locked ? '-' : ''}</span>
        <span className='daily-title'>{task.title}</span>
        <strong>+{task.points} ⭐</strong>
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
      <div className='daily-summary'>
        <MetricTooltip className='daily-summary-metric' label={starsTooltip(balance)}>⭐ {formatStars(balance)}</MetricTooltip>
        <MetricTooltip className='daily-summary-metric' label={streakTooltip(data?.streak ?? 0)}>🔥 {data?.streak ?? 0}</MetricTooltip>
        <MetricTooltip className='daily-summary-metric' label={trophiesTooltip(trophies)}>🏆 {trophies}</MetricTooltip>
        <Link href={storeHref}>🛒 Pood</Link>
        <Link href='/history'>📄 Ajalugu</Link>
      </div>

      {milestoneNotice && (
        <div className='achievement-notice' role='status'>
          <span aria-hidden>🎉</span>
          <strong>Saavutus: {milestoneNotice.title}!</strong>
          <button type='button' aria-label='Sulge saavutuseteade' onClick={dismissMilestone}>×</button>
        </div>
      )}

      {achievements.length > 0 && (
        <div className='achievement-strip' aria-label='Saavutused'>
          {achievements.map((achievement) => (
            <MetricTooltip
              key={achievement.id}
              className={achievement.unlocked ? 'achievement-badge unlocked' : 'achievement-badge locked'}
              label={achievementTooltip(achievement.kind, achievement.tooltipCount)}
            >
              <span className='achievement-emoji' aria-hidden>{achievement.unlocked ? achievement.emoji : '🔒'}</span>
              <span className='achievement-text'>
                <strong>{achievement.title}</strong>
                <small>{achievement.unlocked ? 'Tehtud!' : `${achievement.current}/${achievement.target}`}</small>
              </span>
            </MetricTooltip>
          ))}
        </div>
      )}

      <div className='daily-task-card'>
        <h2>Päevased tegevused</h2>
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
            {doneTasks.length > 0 && (
              <details className='daily-done-accordion'>
                <summary>Tehtud tegevused ({doneTasks.length})</summary>
                <div className='daily-task-list'>
                  {doneTasks.map(renderTask)}
                </div>
              </details>
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
