'use client';

import { useId, useState } from 'react';
import { useAppClock } from '@/app/components/useAppClock';
import type { Learner } from '@/lib/shared/types';
import {
  clubsLeftToday,
  defaultTab,
  formatClock,
  isSchoolDate,
  nextDayHeading,
  nextSchoolDate,
  nextTabLabel,
  SCHOOL_BELLS,
  SCHOOL_TIMETABLE,
  schoolDay,
  schoolEndsAt,
  subjectOf,
  WEEKDAY_LETTERS,
  WEEKDAY_NAMES,
  weekdayOf,
  type AppClock,
  type TimetableTab
} from '@/lib/schoolTimetable';

function BringList({ items }: { items: ReadonlyArray<string> }) {
  return (
    <div className='timetable-bring'>
      <h3>Võta kaasa</h3>
      {items.length === 0 ? (
        <p>Midagi erilist pole vaja</p>
      ) : (
        <ul>{items.map((item) => <li key={item}><span aria-hidden>🎒</span> {item}</li>)}</ul>
      )}
    </div>
  );
}

// One day as a list. `clock` is passed only when the day is today, which is
// what lights up the current lesson.
function DayList({ learner, weekday, clock }: { learner: Learner; weekday: number; clock: AppClock | null }) {
  const day = schoolDay(learner, weekday);
  const end = schoolEndsAt(learner, weekday);
  if (!day || end === null) return null;
  const when = (start: number, finish: number) => !clock ? 'later' : clock.minutes >= finish ? 'past' : clock.minutes >= start ? 'now' : 'later';

  return (
    <>
      <ol className='timetable-day'>
        {day.lessons.map((name, index) => {
          if (!name) return null;
          const [start, finish] = SCHOOL_BELLS[index];
          const state = when(start, finish);
          return (
            <li key={index} data-subject={subjectOf(name).key} data-when={state} aria-current={state === 'now' ? 'time' : undefined}>
              <span className='timetable-time'>{formatClock(start)}</span>
              <span className='timetable-subject'><span className='timetable-dot' aria-hidden />{name}</span>
            </li>
          );
        })}
      </ol>
      <p className='timetable-end'>Kool lõpeb {formatClock(end)}</p>
      {day.clubs.length > 0 && (
        <ol className='timetable-day'>
          {day.clubs.map((club) => {
            const state = when(club.start, club.end);
            return (
              <li key={club.name} data-kind='club' data-when={state} aria-current={state === 'now' ? 'time' : undefined}>
                <span className='timetable-time'>{formatClock(club.start)}</span>
                <span className='timetable-subject'><span aria-hidden>🎨</span> {club.name} · {formatClock(club.start)}–{formatClock(club.end)}</span>
              </li>
            );
          })}
        </ol>
      )}
      <BringList items={day.bring} />
    </>
  );
}

function WeekGrid({ learner, clock }: { learner: Learner; clock: AppClock }) {
  const [picked, setPicked] = useState<number | null>(null);
  const { days } = SCHOOL_TIMETABLE[learner];
  const today = isSchoolDate(clock.date) ? clock.weekday : -1;
  const rows = SCHOOL_BELLS.map((bell, index) => ({ bell, index })).filter(({ index }) => days.some((day) => day.lessons[index]));

  return (
    <>
      <div className='timetable-week' role='table' aria-label='Nädala tunniplaan'>
        <div role='row' className='timetable-week-row'>
          <span role='columnheader' className='timetable-week-corner' />
          {days.map((_, weekday) => (
            <span role='columnheader' key={weekday}>
              <button
                type='button'
                className='timetable-week-day'
                data-today={weekday === today}
                aria-pressed={picked === weekday}
                aria-label={WEEKDAY_NAMES[weekday]}
                onClick={() => setPicked((value) => value === weekday ? null : weekday)}
              >{WEEKDAY_LETTERS[weekday]}</button>
            </span>
          ))}
        </div>
        {rows.map(({ bell, index }) => (
          <div role='row' className='timetable-week-row' key={index}>
            <span role='rowheader' className='timetable-week-time'>{formatClock(bell[0])}</span>
            {days.map((day, weekday) => {
              const name = day.lessons[index];
              const now = weekday === today && clock.minutes >= bell[0] && clock.minutes < bell[1];
              return (
                <span role='cell' key={weekday} className='timetable-week-cell' data-subject={name ? subjectOf(name).key : undefined} data-now={now} title={name ?? undefined}>
                  {name ? subjectOf(name).short : ''}
                </span>
              );
            })}
          </div>
        ))}
        <div role='row' className='timetable-week-row'>
          <span role='rowheader' className='timetable-week-time'>läbi</span>
          {days.map((_, weekday) => <span role='cell' key={weekday} className='timetable-week-end'>{formatClock(schoolEndsAt(learner, weekday) ?? 0)}</span>)}
        </div>
        <div role='row' className='timetable-week-row'>
          <span role='rowheader' className='timetable-week-time' />
          {days.map((day, weekday) => (
            <span role='cell' key={weekday} className='timetable-week-clubs'>
              {day.clubs.map((club) => <span key={club.name}>{club.name}<br />{formatClock(club.start)}</span>)}
            </span>
          ))}
        </div>
      </div>
      {picked === null ? (
        <p className='timetable-hint'>Vajuta päevale, et näha, mida kaasa võtta</p>
      ) : (
        <>
          <h2 className='timetable-dayname'>{WEEKDAY_NAMES[picked]}</h2>
          <BringList items={days[picked].bring} />
        </>
      )}
    </>
  );
}

export default function SchoolTimetable({ learner }: { learner: Learner }) {
  const clock = useAppClock();
  const [chosen, setChosen] = useState<TimetableTab | null>(null);
  const baseId = useId();

  if (!clock) return <div className='timetable-loading' aria-hidden />;

  const tab = chosen ?? defaultTab(learner, clock);
  const next = nextSchoolDate(clock.date);
  const tabs: Array<[TimetableTab, string]> = [['today', 'Täna'], ['next', nextTabLabel(clock.date, next)], ['week', 'Nädal']];
  const clubsLeft = clubsLeftToday(learner, clock);

  return (
    <div className='timetable'>
      <div className='timetable-tabs' role='tablist' aria-label='Tunniplaan'>
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type='button'
            role='tab'
            id={`${baseId}-${id}`}
            aria-selected={tab === id}
            aria-controls={`${baseId}-panel`}
            onClick={() => setChosen(id)}
          >{label}</button>
        ))}
      </div>

      <div className='timetable-panel' role='tabpanel' id={`${baseId}-panel`} aria-labelledby={`${baseId}-${tab}`}>
        {tab === 'today' && (
          isSchoolDate(clock.date)
            ? <DayList learner={learner} weekday={clock.weekday} clock={clock} />
            : <p className='timetable-empty'>Täna kooli ei ole</p>
        )}
        {tab === 'next' && (
          <>
            {clubsLeft.map((club) => {
              const now = clock.minutes >= club.start;
              return (
                <p key={club.name} className='timetable-today-club' data-now={now}>
                  <span className='timetable-today-club-label'>Täna veel</span>
                  <span><span aria-hidden>🎨</span> {club.name} · {formatClock(club.start)}–{formatClock(club.end)}</span>
                </p>
              );
            })}
            {next ? (
              <>
                <h2 className='timetable-dayname'>{nextDayHeading(clock.date, next)}</h2>
                <DayList learner={learner} weekday={weekdayOf(next)} clock={null} />
              </>
            ) : (
              <p className='timetable-empty'>Järgmist koolipäeva veel ei ole</p>
            )}
          </>
        )}
        {tab === 'week' && <WeekGrid learner={learner} clock={clock} />}
      </div>
    </div>
  );
}
