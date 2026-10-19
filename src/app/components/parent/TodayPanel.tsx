'use client';

import { useState } from 'react';
import { formatStars } from '@/lib/formatStars';
import type { ParentToday, ParentTodayChild, ParentTodayRow } from '@/lib/parentToday';
import { learnerLabel } from './format';
import { LEARNERS, type MonthlyPrize } from './types';
import { useParentResource } from './useParentApi';

const AVATARS = { kiur: '👦', kirsi: '👧' } as const;

function percent(done: number, total: number) {
  return total > 0 ? `${Math.round((done / total) * 100)}%` : '0%';
}

function Rows({ title, rows }: { title: string; rows: ParentTodayRow[] }) {
  if (rows.length === 0) return null;
  return (
    <>
      <p className='pv-sub'>{title}</p>
      <ul className='pv-list'>
        {rows.map((row, index) => (
          <li key={`${row.name}-${index}`} className='pv-row' data-s={row.state}>
            <i aria-hidden />
            <span>{row.name}</span>
            <small>{row.meta}</small>
          </li>
        ))}
      </ul>
    </>
  );
}

function ChildToday({ child }: { child: ParentTodayChild }) {
  const [open, setOpen] = useState(false);
  const name = learnerLabel(child.learner);
  return (
    <section className='pv-card pv-kid' data-learner={child.learner} aria-label={`${name} täna`}>
      <div className='pv-kid-head'>
        <strong><span aria-hidden>{AVATARS[child.learner]}</span> {name}</strong>
        <span className='pv-stars'>⭐ {formatStars(child.balance)}</span>
      </div>
      <div className='pv-bars'>
        <div className='pv-bar'><span>Harjutused</span><i aria-hidden><b style={{ width: percent(child.exercises.done, child.exercises.total) }} /></i><span>{child.exercises.done}/{child.exercises.total}</span></div>
        <div className='pv-bar'><span>Tegevused</span><i aria-hidden><b style={{ width: percent(child.tasks.done, child.tasks.total) }} /></i><span>{child.tasks.done}/{child.tasks.total}</span></div>
      </div>
      {open ? (
        <>
          <Rows title='Harjutused' rows={child.exercises.rows} />
          <Rows title='Tegevused' rows={child.tasks.rows} />
        </>
      ) : child.left.length > 0 ? (
        <p className='pv-left'><b>Veel teha:</b> {child.left.join(', ')}</p>
      ) : (
        <p className='pv-done'>✓ Kõik tänane on tehtud</p>
      )}
      <button type='button' className='pv-more' aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Peida' : 'Näita kõike'}</button>
    </section>
  );
}

// One card per child: today's exercises and tasks as two bars, what is left,
// and the full list on demand.
export function TodayChildren() {
  const { data } = useParentResource<ParentToday>('today');
  if (!data) return <p className='pv-hint'>Laadin...</p>;
  return <>{LEARNERS.map((learner) => <ChildToday key={learner} child={data.children[learner]} />)}</>;
}

// This month's trophies as one line: who leads and by how much.
export function MonthlyRace() {
  const { data } = useParentResource<MonthlyPrize>('monthly');
  if (!data) return null;
  const { kiurTrophies: kiur, kirsiTrophies: kirsi } = data.standing;
  return (
    <div className='pv-race-block'>
      <div className='pv-race' role='img' aria-label={`Kuu karikad: Kiur ${kiur}, Kirsi ${kirsi}`}>
        <span data-learner='kiur'>Kiur {kiur}</span>
        <i aria-hidden><b style={{ flex: Math.max(kiur, kiur + kirsi === 0 ? 1 : 0) }} /><b style={{ flex: Math.max(kirsi, kiur + kirsi === 0 ? 1 : 0) }} /></i>
        <span data-learner='kirsi'>{kirsi} Kirsi</span>
      </div>
      <p className='pv-foot'>Kuu karikad</p>
    </div>
  );
}
