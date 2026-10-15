'use client';

import { useEffect, useMemo, useState } from 'react';
import { exerciseWord } from '@/lib/history';
import type { LearningExerciseStatus, LearningExerciseSubject } from '@/lib/shared/types';
import { learnerAccent, learnerLabel, STATUS_OPTIONS, SUBJECT_LABELS } from './format';
import { exercisesFrom, libraryByLearner, libraryStatusNotice, libraryTopicOptions } from './library';
import { failureMessage, jsonInit } from './parentApi';
import type { LearningExercise, Learner } from './types';
import { useParentApi, useParentResource } from './useParentApi';

// "Harjutuste kogu": which exercises each child sees, with its filters.
export function LibraryPanel({ onSummary }: { onSummary: (summary: string) => void }) {
  const api = useParentApi();
  const { data, setData } = useParentResource<LearningExercise[]>('library', exercisesFrom);
  const learningExercises = useMemo(() => data ?? [], [data]);
  const [childFilter, setChildFilter] = useState<'all' | Learner>('all');
  const [subjectFilter, setSubjectFilter] = useState<'all' | LearningExerciseSubject>('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | LearningExerciseStatus>('all');

  useEffect(() => {
    if (data) onSummary(`${data.length} ${exerciseWord(data.length)}`);
  }, [data, onSummary]);

  const topicOptions = useMemo(() => libraryTopicOptions(learningExercises), [learningExercises]);
  const byLearner = useMemo(
    () => libraryByLearner(learningExercises, { subject: subjectFilter, topic: topicFilter, status: statusFilter }),
    [learningExercises, statusFilter, subjectFilter, topicFilter]
  );
  const learnersToShow = (childFilter === 'all' ? ['kiur', 'kirsi'] : [childFilter]) as Learner[];
  const hasVisibleExercises = learnersToShow.some((learner) => byLearner[learner].length > 0);

  const changeStatus = async (exerciseId: string, learner: Learner, status: LearningExerciseStatus) => {
    api.setError('');
    api.setNotice('');
    const res = await api.request('/api/parent/learning-exercises', jsonInit('PATCH', { exerciseId, learner, status }));
    if (!res.ok) {
      api.setError(await failureMessage(res, 'Harjutust ei saanud muuta.'));
      return;
    }
    // The change is saved even if its response body was cut off; keep the
    // list on screen and refresh it rather than crashing on `undefined`.
    const exercises = exercisesFrom(await res.json().catch(() => ({})));
    if (exercises) setData(exercises);
    else api.bus.after('library');
    api.setNotice(libraryStatusNotice(status));
  };

  return (
    <section className='parent-card'>
      <p>Lapsele näidatakse päevas kuni 4 harjutust: kõik <strong>püsivad</strong> ja juhuslik valik <strong>rotatsioonist</strong>. Valik vahetub iga päev. Kordamine lisandub 5.-na, kui vaja.</p>
      <div className='parent-form parent-library-filters'>
        <label><span>Laps</span><select value={childFilter} onChange={(event) => setChildFilter(event.target.value as 'all' | Learner)}><option value='all'>Kõik</option><option value='kiur'>Kiur</option><option value='kirsi'>Kirsi</option></select></label>
        <label><span>Aine</span><select value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value as 'all' | LearningExerciseSubject)}><option value='all'>Kõik ained</option>{Object.entries(SUBJECT_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label><span>Teema</span><select value={topicFilter} onChange={(event) => setTopicFilter(event.target.value)}><option value='all'>Kõik teemad</option>{topicOptions.map((topic) => <option key={topic.value} value={topic.value}>{topic.label}</option>)}</select></label>
        <label><span>Staatus</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | LearningExerciseStatus)}><option value='all'>Kõik</option><option value='rotation'>Rotatsioonis</option><option value='permanent'>Püsiv</option><option value='hidden'>Peidetud</option></select></label>
      </div>
      <div className='learning-library'>
        {learningExercises.length === 0 && <p>Harjutuste kogu laaditakse.</p>}
        {learningExercises.length > 0 && !hasVisibleExercises && <p>Selle filtriga harjutusi ei ole.</p>}
        {learnersToShow.map((learner) => {
          const list = byLearner[learner];
          if (list.length === 0) return null;
          const permanentCount = list.filter((exercise) => exercise.childStatus[learner] === 'permanent').length;
          const rotationCount = list.filter((exercise) => exercise.childStatus[learner] === 'rotation').length;
          return (
            <div key={learner} className='learning-learner-group'>
              <div className='learning-learner-head' data-accent={learnerAccent(learner)}>
                <strong>{learnerLabel(learner)}</strong>
                <span>{permanentCount} püsiv · {rotationCount} rotatsioonis</span>
              </div>
              <div className='learning-compact-list'>
                {list.map((exercise) => {
                  const status = exercise.childStatus[learner] ?? 'hidden';
                  return (
                    <div key={exercise.id} className='learning-compact-row' data-status={status}>
                      <div className='learning-compact-info'>
                        <strong>{exercise.title}</strong>
                        <span>{SUBJECT_LABELS[exercise.subject]}{exercise.topic || exercise.category ? ` · ${exercise.topic || exercise.category}` : ''}</span>
                      </div>
                      <div className='learning-compact-actions'>
                        <div className='learning-status-toggle' role='group' aria-label='Staatus'>
                          {STATUS_OPTIONS.map((option) => (
                            <button
                              key={option.value}
                              type='button'
                              className='learning-status-option'
                              data-value={option.value}
                              data-active={status === option.value}
                              aria-pressed={status === option.value}
                              onClick={() => { if (status !== option.value) void changeStatus(exercise.id, learner, option.value); }}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
