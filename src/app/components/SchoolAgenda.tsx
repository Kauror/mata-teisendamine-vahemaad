'use client';

import { useEffect, useState } from 'react';
import { todayDateString } from '@/lib/appDate';
import { schoolTasksUrl } from '@/lib/childPageData';
import { taskHeadline, type SchoolTaskLine } from '@/lib/schoolText';

// "Koolis tulemas": the child's own coming tests and homework, read from
// eKool by the parent's Minu dashboard. Nothing shows when there is none (or
// offline — it is not part of the offline snapshot).
export default function SchoolAgenda({ learner }: { learner: 'kiur' | 'kirsi' }) {
  const [tasks, setTasks] = useState<SchoolTaskLine[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(schoolTasksUrl(learner))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (!cancelled) setTasks(Array.isArray(data?.tasks) ? data.tasks : []); })
      .catch(() => { if (!cancelled) setTasks([]); });
    return () => { cancelled = true; };
  }, [learner]);

  if (tasks.length === 0) return null;
  const today = todayDateString();
  const tests = tasks.filter((t) => t.kind === 'test').length;

  return (
    <section className='school-agenda' aria-label='Koolis tulemas'>
      <details open={tests > 0}>
        <summary className='school-agenda-title'>
          🏫 Koolis tulemas{tests > 0 ? ` · ${tests === 1 ? '1 kontrolltöö' : `${tests} kontrolltööd`}` : ''}
        </summary>
        <ul className='school-agenda-list'>
          {tasks.map((task, index) => (
            <li key={`${task.date}-${task.subject}-${index}`} className={task.kind === 'test' ? 'is-test' : undefined}>
              <span aria-hidden='true'>{task.kind === 'test' ? '📝' : '📚'}</span>
              <div>
                <strong>{taskHeadline(task, today)}</strong>
                {task.text && <p>{task.kind === 'test' ? `Teema: ${task.text}` : task.text}</p>}
              </div>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
