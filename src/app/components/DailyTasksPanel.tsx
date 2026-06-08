'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

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
};

type ChildDashboard = {
  learner: Learner;
  balance: number;
  streak: number;
  tasks: ChildTask[];
};

function stars(value: number) {
  return Number.isInteger(value) ? String(value) : value.toLocaleString('et-EE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function learnerName(learner: Learner) {
  return learner === 'kiur' ? 'Kiuri' : 'Kirsi';
}

export default function DailyTasksPanel({ learner }: { learner: Learner }) {
  const [data, setData] = useState<ChildDashboard | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmTask, setConfirmTask] = useState<ChildTask | null>(null);
  const [bonusOpen, setBonusOpen] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(() => {
    setError('');
    fetch(`/api/child-dashboard?learner=${learner}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError('Päevategevusi ei saanud laadida.'));
  }, [learner]);

  useEffect(() => {
    load();
  }, [load]);

  const completeTask = async () => {
    if (!confirmTask) return;
    setBusyId(confirmTask.assignmentId);
    setError('');
    try {
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
  const tasks = data?.tasks ?? [];
  const isDone = (task: ChildTask) => task.status === 'completed' || task.status === 'locked';
  const activeTasks = tasks.filter((task) => !isDone(task));
  const doneTasks = tasks.filter(isDone);
  const storeHref = learner === 'kiur' ? '/kiur/pood' : '/kirsi/pood';

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
      <div className='daily-summary'>
        <strong>⭐ {stars(balance)} tähte</strong>
        <span>🔥 Õpiseeria: {data?.streak ?? 0} päeva</span>
        <Link href={storeHref}>🛒 Pood</Link>
        <Link href='/history'>📄 Ajalugu</Link>
      </div>

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
        <div className='task-modal-backdrop' role='dialog' aria-modal='true'>
          <div className='task-modal'>
            <h2>Kas tegevus on tehtud?</h2>
            <p>{confirmTask.title}</p>
            <strong>+{confirmTask.points} ⭐</strong>
            {confirmTask.requiresApproval && <p className='daily-approval-hint'>✋ Vanem kinnitab tähed.</p>}
            <div className='task-modal-actions'>
              <button type='button' className='filter-chip' onClick={() => setConfirmTask(null)}>Ei</button>
              <button type='button' onClick={completeTask} disabled={busyId === confirmTask.assignmentId}>Jah, tehtud</button>
            </div>
          </div>
        </div>
      )}

      {bonusOpen && (
        <div className='task-modal-backdrop' role='dialog' aria-modal='true'>
          <div className='task-modal'>
            <h2>Boonuspunkt</h2>
            <p>Mõlemal on tänased ülesanded tehtud. Siit tuleb boonuspunkt.</p>
            <strong>Kiur +1 ⭐ ja Kirsi +1 ⭐</strong>
            <button type='button' onClick={() => setBonusOpen(false)}>Selge</button>
          </div>
        </div>
      )}
    </section>
  );
}
