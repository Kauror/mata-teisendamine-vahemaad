'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { formatElapsed } from '@/lib/validation';
import { compactTopicLabel, dayLabel, groupAttemptsByDay, learnerLabel, scorePercent, subjectLabel } from '@/lib/history';

type H = {
  id: number;
  createdAt: string;
  category: string;
  difficulty: string;
  questionCount: number;
  score: number;
  elapsedSeconds: number | null;
  learner?: string | null;
  subject?: string | null;
  topic?: string | null;
};

type ChildFilter = 'all' | 'kiur' | 'kirsi';
type SubjectFilter = 'all' | 'matemaatika' | 'inglise-keel';

function avgPercent(items: H[]) {
  if (!items.length) return null;
  return Math.round(items.reduce((sum, a) => sum + scorePercent(a.score, a.questionCount), 0) / items.length);
}

function tone(avg: number | null) {
  if (avg === null) return 'average-neutral';
  if (avg >= 80) return 'average-good';
  if (avg >= 60) return 'average-medium';
  return 'average-low';
}

function subjectKey(a: H): SubjectFilter {
  const subj = (a.subject || '').toLowerCase();
  const topic = (a.topic || '').toLowerCase();
  const cat = (a.category || '').toLowerCase();
  if (subj.includes('inglise') || topic.includes('inglise') || cat.includes('inglise')) return 'inglise-keel';
  return 'matemaatika';
}

function subjectDisplay(a: H) {
  return subjectKey(a) === 'inglise-keel' ? '🔤 Inglise keel' : `🧮 ${subjectLabel(a.subject)}`;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<H[]>([]);
  const [loadError, setLoadError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [showHistoryTools, setShowHistoryTools] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [childFilter, setChildFilter] = useState<ChildFilter>('all');
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>('all');

  useEffect(() => {
    fetch('/api/history')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setHistory)
      .catch(() => setLoadError('Ajaloo laadimine ebaõnnestus.'));
  }, []);

  const filtered = useMemo(() => {
    return history.filter((a) => {
      const learner = learnerLabel(a.category, a.learner).toLowerCase();
      const childOk = childFilter === 'all' || learner === childFilter;
      const subj = subjectKey(a);
      const subjectOk = subjectFilter === 'all' || subj === subjectFilter;
      return childOk && subjectOk;
    });
  }, [history, childFilter, subjectFilter]);

  const todayItems = useMemo(() => filtered.filter((a) => dayLabel(a.createdAt) === 'Täna'), [filtered]);
  const todayAvg = avgPercent(todayItems);

  const groups = useMemo(() => groupAttemptsByDay(filtered), [filtered]);

  const onDelete = async (id: number) => {
    setDeleteError('');
    try {
      const res = await fetch(`/api/history/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('delete-failed');
      setHistory((prev) => prev.filter((x) => x.id !== id));
      setConfirmId(null);
    } catch {
      setDeleteError('Kustutamine ebaõnnestus.');
    }
  };

  const onDeleteAll = async () => {
    setDeleteError('');
    setIsDeletingAll(true);
    try {
      const res = await fetch('/api/history', { method: 'DELETE' });
      if (!res.ok) throw new Error('delete-all-failed');
      setHistory([]);
      setConfirmDeleteAll(false);
      setConfirmId(null);
    } catch {
      setDeleteError('Kogu ajaloo kustutamine ebaõnnestus.');
    } finally {
      setIsDeletingAll(false);
    }
  };

  return (
    <main className='history-page'>
      <div className='history-shell'>
        <Link className='subject-back-button' href='/'>← Rollivalik</Link>

        <header className='history-header'>
          <div>
            <h1>Ajalugu</h1>
            <p>Kõik tehtud harjutused</p>
          </div>
          <div className={`summary-pill ${tone(todayAvg)}`}>
            <p>Täna: {todayItems.length} harjutust · Keskmine {todayAvg === null ? '—' : `${todayAvg}%`}</p>
          </div>
        </header>

        <section className='filter-bar'>
          <button type='button' className={childFilter === 'all' ? 'filter-chip active' : 'filter-chip'} onClick={() => setChildFilter('all')}>Kõik</button>
          <button type='button' className={childFilter === 'kiur' ? 'filter-chip active' : 'filter-chip'} onClick={() => setChildFilter('kiur')}>Kiur</button>
          <button type='button' className={childFilter === 'kirsi' ? 'filter-chip active' : 'filter-chip'} onClick={() => setChildFilter('kirsi')}>Kirsi</button>
          <span className='filter-divider' aria-hidden />
          <button type='button' className={subjectFilter === 'all' ? 'filter-chip active' : 'filter-chip'} onClick={() => setSubjectFilter('all')}>Kõik ained</button>
          <button type='button' className={subjectFilter === 'matemaatika' ? 'filter-chip active' : 'filter-chip'} onClick={() => setSubjectFilter('matemaatika')}>Matemaatika</button>
          <button type='button' className={subjectFilter === 'inglise-keel' ? 'filter-chip active' : 'filter-chip'} onClick={() => setSubjectFilter('inglise-keel')}>Inglise keel</button>
        </section>

        {loadError && <p className='error'>{loadError}</p>}
        {deleteError && <p className='error'>{deleteError}</p>}

        {history.length === 0 ? (
          <p>Ajalugu puudub.</p>
        ) : filtered.length === 0 ? (
          <p>Selle valikuga tulemusi ei ole.</p>
        ) : (
          <section className='history-groups'>
            {Array.from(groups.entries()).map(([day, items]) => {
              const groupAvg = avgPercent(items);
              return (
                <div key={day} className='date-group'>
                  <h2>{day}: {items.length} harjutust · Keskmine {groupAvg === null ? '—' : `${groupAvg}%`}</h2>
                  <div className='history-list-compact'>
                    {items.map((h) => {
                      const learner = learnerLabel(h.category, h.learner);
                      const time = new Date(h.createdAt).toLocaleTimeString('et-EE', { hour: '2-digit', minute: '2-digit' });
                      const exercise = compactTopicLabel(h.topic, h.category) || h.category;
                      const percent = scorePercent(h.score, h.questionCount);
                      const elapsed = typeof h.elapsedSeconds === 'number' && Number.isFinite(h.elapsedSeconds) ? formatElapsed(h.elapsedSeconds) : 'aeg puudub';
                      return (
                        <div key={h.id} className='history-row'>
                          <div className='history-card-main'>
                            <div className='learner-cell'>{learner}</div>
                            <div className='exercise-cell'>
                              <span>{subjectDisplay(h).replace(/^🔤 |^🧮 /, '')} · {exercise}</span>
                            </div>
                            <div className='score-cell'>{h.score}/{h.questionCount} · {percent}% · {elapsed}</div>
                            <div className='meta-cell'>{time}</div>
                          </div>
                          <div className='row-actions'>
                            <Link className='view-button' href={`/history/${h.id}`}>Vaata</Link>
                            <button type='button' className='delete-text-button' onClick={() => setConfirmId(h.id)}>Kustuta</button>
                          </div>
                          {confirmId === h.id && (
                            <div className='confirm-panel'>
                              <strong>Kustuta tulemus?</strong>
                              <p>Seda tegevust ei saa tagasi võtta.</p>
                              <div className='confirm-actions'>
                                <button type='button' className='filter-chip' onClick={() => setConfirmId(null)}>Tühista</button>
                                <button type='button' className='delete-button' onClick={() => onDelete(h.id)}>Kustuta</button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {history.length > 0 && (
          <section className='history-danger-zone'>
            <button type='button' className='history-tools-toggle' onClick={() => setShowHistoryTools((open) => !open)}>Halda ajalugu</button>
            {showHistoryTools && <button type='button' className='history-delete-all-link' onClick={() => setConfirmDeleteAll(true)}>Kustuta kogu ajalugu</button>}
            {showHistoryTools && confirmDeleteAll && (
              <div className='confirm-panel confirm-panel-wide'>
                <strong>Kas oled kindel, et soovid terve ajaloo kustutada?</strong>
                <p>Kõik senised tulemused kustutatakse ja seda tegevust ei saa tagasi võtta.</p>
                <div className='confirm-actions'>
                  <button type='button' className='filter-chip' onClick={() => setConfirmDeleteAll(false)} disabled={isDeletingAll}>Tühista</button>
                  <button type='button' className='delete-button' onClick={onDeleteAll} disabled={isDeletingAll}>{isDeletingAll ? 'Kustutan...' : 'Jah, kustuta kõik'}</button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
