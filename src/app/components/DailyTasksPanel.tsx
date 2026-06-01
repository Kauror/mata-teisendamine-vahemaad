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
  status: 'active' | 'completed' | 'missed' | 'locked';
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

export default function DailyTasksPanel({ learner }: { learner: Learner }) {
  const [data, setData] = useState<ChildDashboard | null>(null);
  const [error, setError] = useState('');
  const [confirmTask, setConfirmTask] = useState<ChildTask | null>(null);
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
  const storeHref = learner === 'kiur' ? '/kiur/pood' : '/kirsi/pood';

  return (
    <section className='daily-panel'>
      <div className='daily-summary'>
        <strong>⭐ {stars(balance)} tähte</strong>
        <span>🔥 Õpiseeria: {data?.streak ?? 0} päeva</span>
        <Link href={storeHref}>🛒 Pood</Link>
        <Link href='/history'>📄 Vaata ajalugu</Link>
      </div>

      <div className='daily-task-card'>
        <h2>Päevategevused</h2>
        {error && <p className='error'>{error}</p>}
        {!data ? (
          <p>Laadin...</p>
        ) : tasks.length === 0 ? (
          <p>Tänaseid tegevusi ei ole.</p>
        ) : (
          <div className='daily-task-list'>
            {tasks.map((task) => {
              const completed = task.status === 'completed';
              const locked = task.status === 'locked';
              return (
                <button
                  type='button'
                  key={task.assignmentId}
                  className={completed ? 'daily-task-row completed' : locked ? 'daily-task-row locked' : 'daily-task-row'}
                  disabled={completed || locked || busyId === task.assignmentId}
                  onClick={() => setConfirmTask(task)}
                >
                  <span className='daily-check'>{completed ? '✓' : locked ? '–' : ''}</span>
                  <span className='daily-title'>{task.title}</span>
                  <strong>+{task.points} ⭐</strong>
                  {completed && <small>Tehtud</small>}
                  {locked && <small>Tehtud teise lapse poolt</small>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {confirmTask && (
        <div className='task-modal-backdrop' role='dialog' aria-modal='true'>
          <div className='task-modal'>
            <h2>Kas tegevus on tehtud?</h2>
            <p>{confirmTask.title}</p>
            <strong>+{confirmTask.points} ⭐</strong>
            <div className='task-modal-actions'>
              <button type='button' className='filter-chip' onClick={() => setConfirmTask(null)}>Ei</button>
              <button type='button' onClick={completeTask} disabled={busyId === confirmTask.assignmentId}>Jah, tehtud</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
