'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { formatElapsed } from '@/lib/validation';
import { compactTopicLabel, dayLabel, HELD_REWARD_MESSAGE, isHeldReward, learnerLabel, scorePercent, subjectLabel } from '@/lib/history';
import { formatStars } from '@/lib/formatStars';
import { getMergedExerciseHistory } from '@/lib/offline/api';
import { useOffline } from '@/app/components/offline/OfflineProvider';
import HistoryStats from '@/app/components/HistoryStats';

type ExerciseHistory = {
  kind: 'exercise';
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
  earnedStars?: number | null;
  pending?: boolean;
  localStatus?: 'pending' | 'syncing' | 'rejected' | 'needs_review';
  reasonCode?: string;
  clientAttemptId?: string;
  rewardSettlementStatus?: 'eligible' | 'withheld' | 'needs_review' | null;
  reviewReasonCode?: string | null;
};

type TaskHistory = {
  kind: 'task';
  id: number;
  learner: 'kiur' | 'kirsi';
  amount: number;
  source: 'real_world_task' | 'manual_adjustment' | 'daily_task_bonus' | 'point_gift';
  sourceId: number | null;
  description: string;
  createdAt: string;
  metadataJson: string | null;
  assignmentModeSnapshot?: string | null;
};

type PurchaseHistory = {
  kind: 'store';
  id: number;
  learner: 'kiur' | 'kirsi';
  titleSnapshot: string;
  priceSnapshot: number;
  purchasedAt: string;
};

type HistoryItem = ExerciseHistory | TaskHistory | PurchaseHistory;
type ChildFilter = 'all' | 'kiur' | 'kirsi';
type SubjectFilter = 'all' | 'harjutused' | 'matemaatika' | 'inglise-keel' | 'lugemine' | 'loodusopetus' | 'kordamine' | 'paevategevused' | 'pood';

function itemDate(item: HistoryItem) {
  return item.kind === 'store' ? item.purchasedAt : item.createdAt;
}

function avgPercent(items: ExerciseHistory[]) {
  if (!items.length) return null;
  return Math.round(items.reduce((sum, a) => sum + scorePercent(a.score, a.questionCount), 0) / items.length);
}

// Net stars for that day: learning points from exercises plus task, bonus and
// parent-adjustment ledger amounts, minus store spending. Purchases count as
// negative so the day total (and the store-filtered view) can show a minus.
function earnedStars(items: HistoryItem[]) {
  return items.reduce((sum, item) => {
    if (item.kind === 'exercise') return sum + (item.earnedStars ?? 0);
    if (item.kind === 'task') return sum + item.amount;
    if (item.kind === 'store') return sum - item.priceSnapshot;
    return sum;
  }, 0);
}

function subjectKey(a: ExerciseHistory): SubjectFilter {
  const subj = (a.subject || '').toLowerCase();
  const topic = (a.topic || '').toLowerCase();
  const cat = (a.category || '').toLowerCase();
  if (subj.includes('kordamine') || topic.includes('kordamine') || cat.includes('kordamine')) return 'kordamine';
  if (subj.includes('inglise') || topic.includes('inglise') || cat.includes('inglise')) return 'inglise-keel';
  if (subj.includes('lugemine') || topic.includes('pilt-ja-sona') || topic.includes('loe-ja-vasta') || cat.includes('lugemine')) return 'lugemine';
  if (subj.includes('loodus') || cat.includes('loodus')) return 'loodusopetus';
  return 'matemaatika';
}

function subjectDisplay(a: ExerciseHistory) {
  if (subjectKey(a) === 'kordamine') return 'Kordamine';
  if (subjectKey(a) === 'lugemine') return 'Lugemine';
  if (subjectKey(a) === 'loodusopetus') return 'Loodusõpetus';
  return subjectKey(a) === 'inglise-keel' ? 'Inglise keel' : subjectLabel(a.subject);
}

function taskMeta(raw: string | null) {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed as { reason?: string; assignmentMode?: string } : {};
  } catch {
    return {};
  }
}

function groupHistoryByDay(items: HistoryItem[]) {
  const groups = new Map<string, HistoryItem[]>();
  for (const item of items) {
    const day = dayLabel(itemDate(item));
    groups.set(day, [...(groups.get(day) ?? []), item]);
  }
  return groups;
}

export default function HistoryPage() {
  const { online } = useOffline();
  const todayKey = dayLabel(new Date().toISOString());
  const [history, setHistory] = useState<ExerciseHistory[]>([]);
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([]);
  const [storeHistory, setStoreHistory] = useState<PurchaseHistory[]>([]);
  const [deleteError, setDeleteError] = useState('');
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [showHistoryTools, setShowHistoryTools] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [childFilter, setChildFilter] = useState<ChildFilter>('all');
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>('all');
  const [openDays, setOpenDays] = useState<Set<string>>(() => new Set([todayKey]));

  const loadLocalExercises = useCallback(async () => {
    const offline = await getMergedExerciseHistory().catch(() => []);
    const rows = offline.map((item) => ({ ...item, kind: 'exercise' as const }));
    // Never blank a populated view merely because IndexedDB temporarily failed.
    if (rows.length > 0) setHistory(rows);
    return rows;
  }, []);

  useEffect(() => {
    let active = true;
    // IndexedDB is the immediate source. Network refresh is merged afterwards,
    // preserving pending work and avoiding an empty-history flash on reconnect.
    void loadLocalExercises();
    const loadExercises = fetch('/api/history', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(async (attempts) => {
        if (!active) return;
        const serverRows = (attempts as Omit<ExerciseHistory, 'kind'>[]).map((item) => ({ ...item, kind: 'exercise' as const }));
        const localRows = await loadLocalExercises();
        if (!active) return;
        const serverClientIds = new Set(serverRows.map((row) => row.clientAttemptId).filter(Boolean));
        const pending = localRows.filter((row) => row.pending && (!row.clientAttemptId || !serverClientIds.has(row.clientAttemptId)));
        if (serverRows.length > 0) setHistory([...serverRows, ...pending]);
      })
      .catch(() => loadLocalExercises());
    const loadTasks = fetch('/api/task-history')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((tasks) => setTaskHistory((tasks as Omit<TaskHistory, 'kind'>[]).map((item) => ({ ...item, kind: 'task' }))))
      .catch(() => setTaskHistory([]));
    const loadStore = fetch('/api/store/history')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((purchases) => setStoreHistory((purchases as Omit<PurchaseHistory, 'kind'>[]).map((item) => ({ ...item, kind: 'store' }))))
      .catch(() => setStoreHistory([]));
    void Promise.allSettled([loadExercises, loadTasks, loadStore]);
    const onRevision = () => void loadLocalExercises();
    window.addEventListener('offline-data-revision', onRevision);
    const channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('harjutaja-offline-data');
    if (channel) channel.onmessage = onRevision;
    return () => {
      active = false;
      window.removeEventListener('offline-data-revision', onRevision);
      channel?.close();
    };
  }, [loadLocalExercises]);

  const filtered = useMemo(() => {
    const allItems: HistoryItem[] = [...history, ...taskHistory, ...storeHistory].sort((a, b) => new Date(itemDate(b)).getTime() - new Date(itemDate(a)).getTime());
    return allItems.filter((item) => {
      const learner = item.kind === 'exercise' ? learnerLabel(item.category, item.learner).toLowerCase() : item.learner;
      const childOk = childFilter === 'all' || learner === childFilter;
      const subject = item.kind === 'task' ? 'paevategevused' : item.kind === 'store' ? 'pood' : subjectKey(item);
      const subjectOk = subjectFilter === 'all' || (subjectFilter === 'harjutused' ? item.kind === 'exercise' : subject === subjectFilter);
      return childOk && subjectOk;
    });
  }, [history, taskHistory, storeHistory, childFilter, subjectFilter]);

  const groups = useMemo(() => groupHistoryByDay(filtered), [filtered]);

  const toggleDay = (day: string) => {
    setOpenDays((current) => {
      const next = new Set(current);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  const onDelete = async (id: number) => {
    setDeleteError('');
    if (!online) {
      setDeleteError('Ajaloo kustutamiseks taasta internetiühendus. Võrguühenduseta ajalugu on ainult lugemiseks.');
      return;
    }
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
    if (!online) {
      setDeleteError('Kogu ajaloo kustutamiseks taasta internetiühendus.');
      return;
    }
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
        <Link className='subject-back-button' href='/'>← Esilehele</Link>
        <header className='history-header'>
          <div>
            <h1>Ajalugu</h1>
            <p>Kõik harjutused, päevategevused ja poe ostud</p>
          </div>
        </header>

        {!online && <p className='offline-warning' role='status'>Võrguühenduseta kuvatakse seadmesse salvestatud ajalugu. Kustutamine on saadaval pärast ühenduse taastamist.</p>}

        <HistoryStats />

        <section className='filter-bar'>
          <button type='button' className={childFilter === 'all' ? 'filter-chip active' : 'filter-chip'} onClick={() => setChildFilter('all')}>Kõik</button>
          <button type='button' className={childFilter === 'kiur' ? 'filter-chip active' : 'filter-chip'} onClick={() => setChildFilter('kiur')}>Kiur</button>
          <button type='button' className={childFilter === 'kirsi' ? 'filter-chip active' : 'filter-chip'} onClick={() => setChildFilter('kirsi')}>Kirsi</button>
          <span className='filter-divider' aria-hidden />
          <button type='button' className={subjectFilter === 'all' ? 'filter-chip active' : 'filter-chip'} onClick={() => setSubjectFilter('all')}>Kõik ained</button>
          <button type='button' className={subjectFilter === 'harjutused' ? 'filter-chip active' : 'filter-chip'} onClick={() => setSubjectFilter('harjutused')}>Harjutused</button>
          <button type='button' className={subjectFilter === 'matemaatika' ? 'filter-chip active' : 'filter-chip'} onClick={() => setSubjectFilter('matemaatika')}>Matemaatika</button>
          <button type='button' className={subjectFilter === 'inglise-keel' ? 'filter-chip active' : 'filter-chip'} onClick={() => setSubjectFilter('inglise-keel')}>Inglise keel</button>
          <button type='button' className={subjectFilter === 'lugemine' ? 'filter-chip active' : 'filter-chip'} onClick={() => setSubjectFilter('lugemine')}>Lugemine</button>
          <button type='button' className={subjectFilter === 'loodusopetus' ? 'filter-chip active' : 'filter-chip'} onClick={() => setSubjectFilter('loodusopetus')}>🔬 Loodusõpetus</button>
          <button type='button' className={subjectFilter === 'kordamine' ? 'filter-chip active' : 'filter-chip'} onClick={() => setSubjectFilter('kordamine')}>Kordamine</button>
          <button type='button' className={subjectFilter === 'paevategevused' ? 'filter-chip active' : 'filter-chip'} onClick={() => setSubjectFilter('paevategevused')}>⭐ Päevategevused</button>
          <button type='button' className={subjectFilter === 'pood' ? 'filter-chip active' : 'filter-chip'} onClick={() => setSubjectFilter('pood')}>🛒 Pood</button>
        </section>

        {deleteError && <p className='error'>{deleteError}</p>}

        {history.length === 0 && taskHistory.length === 0 && storeHistory.length === 0 ? (
          <p>Ajalugu puudub.</p>
        ) : filtered.length === 0 ? (
          <p>Selle valikuga tulemusi ei ole.</p>
        ) : (
          <section className='history-groups'>
            {Array.from(groups.entries()).map(([day, items]) => {
              const groupAvg = avgPercent(items.filter((item): item is ExerciseHistory => item.kind === 'exercise'));
              const groupStars = earnedStars(items);
              const isOpen = openDays.has(day);
              return (
                <div key={day} className='date-group'>
                  <button type='button' className='date-group-toggle' aria-expanded={isOpen} onClick={() => toggleDay(day)}>
                    <span>{day}</span>
                    <strong>{items.length} kirjet · Keskmine {groupAvg === null ? '—' : `${groupAvg}%`} · ⭐ {formatStars(groupStars)}</strong>
                  </button>
                  {isOpen && <div className='history-list-compact'>
                    {items.map((h) => {
                      const isExercise = h.kind === 'exercise';
                      const learner = isExercise ? learnerLabel(h.category, h.learner) : h.learner === 'kiur' ? 'Kiur' : 'Kirsi';
                      const time = new Date(itemDate(h)).toLocaleTimeString('et-EE', { hour: '2-digit', minute: '2-digit' });
                      const meta = h.kind === 'task' ? taskMeta(h.metadataJson) : {};
                      const firstCompleter = h.kind === 'task' && (h.assignmentModeSnapshot === 'first_completer' || meta.assignmentMode === 'first_completer');
                      const exercise = isExercise ? compactTopicLabel(h.topic, h.category) || h.category : '';
                      const percent = isExercise ? scorePercent(h.score, h.questionCount) : null;
                      const elapsed = isExercise && typeof h.elapsedSeconds === 'number' && Number.isFinite(h.elapsedSeconds) ? formatElapsed(h.elapsedSeconds) : 'aeg puudub';
                      const title = h.kind === 'task' ? (h.source === 'manual_adjustment' ? 'Vanem muutis punkte' : h.description) : h.kind === 'store' ? h.titleSnapshot : subjectKey(h) === 'kordamine' ? 'Kordamine' : `${subjectDisplay(h)} · ${exercise}`;
                      const scoreText = h.kind === 'task' ? `${h.amount > 0 ? '+' : ''}${h.amount} ⭐` : h.kind === 'store' ? `-${h.priceSnapshot} ⭐` : `${h.score}/${h.questionCount} · ${percent}% · ${elapsed}`;
                      const isPending = isExercise && (h as ExerciseHistory).pending === true;
                      const isHeld = isExercise && isHeldReward((h as ExerciseHistory).rewardSettlementStatus);
                      const localStatus = isExercise ? (h as ExerciseHistory).localStatus : undefined;
                      const detailText = localStatus === 'rejected' ? 'Sünkroonimine lükati tagasi — vajab parandust või uuendust.' : localStatus === 'needs_review' ? 'Tulemus ootab vanema ülevaatust.' : isPending ? 'Ootab sünkroonimist' : isHeld ? HELD_REWARD_MESSAGE : h.kind === 'task' && h.source === 'manual_adjustment' && meta.reason ? `Põhjus: ${meta.reason}` : h.kind === 'task' && firstCompleter ? 'Esimene tegija' : h.kind === 'store' ? `Ostetud: ${time}` : isExercise && typeof h.earnedStars === 'number' ? `Teenitud: +${h.earnedStars.toLocaleString('et-EE', { maximumFractionDigits: 1 })} ⭐` : '';

                      return (
                        <div key={`${h.kind}-${h.id}`} className='history-row'>
                          <div className='history-card-main'>
                            <div className='learner-cell'>{learner}</div>
                            <div className='exercise-cell'>
                              <span>{title} · {time}</span>
                              {detailText && <span>{detailText}</span>}
                            </div>
                            <div className='meta-cell'>{scoreText}</div>
                          </div>
                          <div className='row-actions'>
                            {isExercise && (isPending
                              ? <Link className='view-button' href={`/tulemus?clientId=${encodeURIComponent((h as ExerciseHistory).clientAttemptId ?? '')}`}>Vaata</Link>
                              : <Link className='view-button' href={`/history/offline?id=${h.id}`}>Vaata</Link>)}
                            {isExercise && !isPending && <button type='button' className='delete-text-button' disabled={!online} onClick={() => setConfirmId(h.id)}>Kustuta</button>}
                          </div>
                          {isExercise && confirmId === h.id && (
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
                  </div>}
                </div>
              );
            })}
          </section>
        )}

        {history.length > 0 && (
          <section className='history-danger-zone'>
            <button type='button' className='history-tools-toggle' onClick={() => setShowHistoryTools((open) => !open)}>Halda ajalugu</button>
            {showHistoryTools && <button type='button' className='history-delete-all-link' disabled={!online} onClick={() => setConfirmDeleteAll(true)}>Kustuta kogu ajalugu</button>}
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
