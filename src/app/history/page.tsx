'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { compactTopicLabel, dayLabel, entryWord, groupHistoryByMonth, HELD_REWARD_MESSAGE, isHeldReward, learnerLabel, subjectLabel } from '@/lib/history';
import { formatStars } from '@/lib/formatStars';
import { getMergedExerciseHistory } from '@/lib/offline/api';
import { mergeLocalHistoryRows } from '@/lib/offline/historyMerge';
import { useOffline } from '@/app/components/offline/OfflineProvider';
import HistoryStats from '@/app/components/HistoryStats';
import { fetchHistoryPage, fetchWholeTimeline } from '@/lib/historyClient';

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

// English and Loodusõpetus work that is not a passed test (/api/learning-activity):
// practice, reading and tests that did not count. Star-free and not a link.
type ActivityHistory = {
  kind: 'activity';
  id: number;
  createdAt: string;
  learner: 'kiur' | 'kirsi';
  subject: 'inglise-keel' | 'loodusopetus';
  title: string;
  detail: string;
};

type HistoryItem = ExerciseHistory | TaskHistory | PurchaseHistory | ActivityHistory;
type ChildFilter = 'all' | 'kiur' | 'kirsi';
type SubjectFilter = 'all' | 'harjutused' | 'matemaatika' | 'inglise-keel' | 'lugemine' | 'loodusopetus' | 'kordamine' | 'paevategevused' | 'pood';

function itemDate(item: HistoryItem) {
  return item.kind === 'store' ? item.purchasedAt : item.createdAt;
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

export default function HistoryPage() {
  const { online } = useOffline();
  const todayKey = dayLabel(new Date().toISOString());
  const [history, setHistory] = useState<ExerciseHistory[]>([]);
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([]);
  const [activityHistory, setActivityHistory] = useState<ActivityHistory[]>([]);
  const [storeHistory, setStoreHistory] = useState<PurchaseHistory[]>([]);
  const [childFilter, setChildFilter] = useState<ChildFilter>('all');
  // Opened from a child's own page (?child=): their history only, titled as theirs.
  const [ownChild, setOwnChild] = useState<'kiur' | 'kirsi' | null>(null);
  const [statsOpen, setStatsOpen] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>('all');
  const [openDays, setOpenDays] = useState<Set<string>>(() => new Set([todayKey]));
  const [nextHistoryCursor, setNextHistoryCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const requestedChild = new URLSearchParams(window.location.search).get('child');
    if (requestedChild === 'kiur' || requestedChild === 'kirsi') {
      setChildFilter(requestedChild);
      setOwnChild(requestedChild);
    }
  }, []);

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
    const loadExercises = fetchHistoryPage<Omit<ExerciseHistory, 'kind'>>(new URLSearchParams({ limit: '50' }))
      .then(async (page) => {
        if (!active) return;
        const serverRows = page.items.map((item) => ({ ...item, kind: 'exercise' as const }));
        setNextHistoryCursor(page.nextCursor);
        const localRows = await loadLocalExercises();
        if (!active) return;
        const serverClientIds = new Set(serverRows.map((row) => row.clientAttemptId).filter(Boolean));
        const pending = localRows.filter((row) => row.pending && (!row.clientAttemptId || !serverClientIds.has(row.clientAttemptId)));
        if (serverRows.length > 0) setHistory([...serverRows, ...pending]);
      })
      .catch(() => loadLocalExercises());
    const loadTasks = fetchWholeTimeline<Omit<TaskHistory, 'kind'>>('/api/task-history')
      .then((tasks) => setTaskHistory(tasks.map((item) => ({ ...item, kind: 'task' }))))
      .catch(() => setTaskHistory([]));
    const loadActivity = fetchWholeTimeline<Omit<ActivityHistory, 'kind'>>('/api/learning-activity')
      .then((rows) => setActivityHistory(rows.map((item) => ({ ...item, kind: 'activity' }))))
      .catch(() => setActivityHistory([]));
    const loadStore = fetchWholeTimeline<Omit<PurchaseHistory, 'kind'>>('/api/store/history')
      .then((purchases) => setStoreHistory(purchases.map((item) => ({ ...item, kind: 'store' }))))
      .catch(() => setStoreHistory([]));
    void Promise.allSettled([loadExercises, loadTasks, loadStore, loadActivity]);
    // Merge by id instead of replacing: the shown list also holds server pages
    // ("Laadi rohkem") that the local 200-row window does not contain.
    const onRevision = () => void getMergedExerciseHistory()
      .then((offline) => {
        if (!active || offline.length === 0) return;
        const fresh = offline.map((item) => ({ ...item, kind: 'exercise' as const }));
        setHistory((current) => mergeLocalHistoryRows(current, fresh));
      })
      .catch(() => {});
    window.addEventListener('offline-data-revision', onRevision);
    const channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('harjutaja-offline-data');
    if (channel) channel.onmessage = onRevision;
    return () => {
      active = false;
      window.removeEventListener('offline-data-revision', onRevision);
      channel?.close();
    };
  }, [loadLocalExercises]);

  const loadMoreExercises = async () => {
    if (!nextHistoryCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const parameters = new URLSearchParams({ limit: '50', cursor: nextHistoryCursor });
      const page = await fetchHistoryPage<Omit<ExerciseHistory, 'kind'>>(parameters);
      const incoming = page.items.map((item) => ({ ...item, kind: 'exercise' as const }));
      setHistory((current) => {
        const ids = new Set(current.filter((row) => !row.pending).map((row) => row.id));
        const clientIds = new Set(current.map((row) => row.clientAttemptId).filter(Boolean));
        return [...current, ...incoming.filter((row) => !ids.has(row.id) && (!row.clientAttemptId || !clientIds.has(row.clientAttemptId)))];
      });
      setNextHistoryCursor(page.nextCursor);
    } finally {
      setLoadingMore(false);
    }
  };

  const filtered = useMemo(() => {
    const allItems: HistoryItem[] = [...history, ...taskHistory, ...storeHistory, ...activityHistory].sort((a, b) => new Date(itemDate(b)).getTime() - new Date(itemDate(a)).getTime());
    return allItems.filter((item) => {
      const learner = item.kind === 'exercise' ? learnerLabel(item.category, item.learner).toLowerCase() : item.learner;
      const childOk = childFilter === 'all' || learner === childFilter;
      const subject = item.kind === 'task' ? 'paevategevused' : item.kind === 'store' ? 'pood' : item.kind === 'activity' ? item.subject : subjectKey(item);
      const subjectOk = subjectFilter === 'all' || (subjectFilter === 'harjutused' ? item.kind === 'exercise' || item.kind === 'activity' : subject === subjectFilter);
      return childOk && subjectOk;
    });
  }, [history, taskHistory, storeHistory, activityHistory, childFilter, subjectFilter]);

  // The current month day by day; each earlier month folded into one group
  // (closed until opened), so long histories stay short.
  const { recentDays, months } = useMemo(() => groupHistoryByMonth(filtered, itemDate), [filtered]);
  const [openMonths, setOpenMonths] = useState<Set<string>>(() => new Set());

  const toggle = (setter: typeof setOpenDays, key: string) => {
    setter((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };
  const toggleDay = (day: string) => toggle(setOpenDays, day);
  const toggleMonth = (month: string) => toggle(setOpenMonths, month);

  function renderRow(h: HistoryItem) {
      const isExercise = h.kind === 'exercise';
      const learner = isExercise ? learnerLabel(h.category, h.learner) : h.learner === 'kiur' ? 'Kiur' : 'Kirsi';
      const time = new Date(itemDate(h)).toLocaleTimeString('et-EE', { hour: '2-digit', minute: '2-digit' });
      const meta = h.kind === 'task' ? taskMeta(h.metadataJson) : {};
      const firstCompleter = h.kind === 'task' && (h.assignmentModeSnapshot === 'first_completer' || meta.assignmentMode === 'first_completer');
      const exercise = isExercise ? compactTopicLabel(h.topic, h.category) || h.category : '';
      const title = h.kind === 'activity' ? `${h.subject === 'loodusopetus' ? 'Loodusõpetus' : 'Inglise keel'} · ${h.title}` : h.kind === 'task' ? (h.source === 'manual_adjustment' ? 'Vanem muutis punkte' : h.description) : h.kind === 'store' ? `🛒 ${h.titleSnapshot}` : subjectKey(h) === 'kordamine' ? 'Kordamine' : `${subjectDisplay(h)} · ${exercise}`;
      const amount = h.kind === 'task'
        ? `${h.amount > 0 ? '+' : ''}${formatStars(h.amount)} ⭐`
        : h.kind === 'store'
          ? `−${h.priceSnapshot} ⭐`
          : h.kind === 'exercise' && typeof h.earnedStars === 'number' ? `+${formatStars(h.earnedStars)} ⭐` : '';
      const isPending = isExercise && (h as ExerciseHistory).pending === true;
      const isHeld = isExercise && isHeldReward((h as ExerciseHistory).rewardSettlementStatus);
      const localStatus = isExercise ? (h as ExerciseHistory).localStatus : undefined;
      const status = localStatus === 'rejected' ? 'Sünkroonimine lükati tagasi — vajab parandust või uuendust.' : localStatus === 'needs_review' ? 'Tulemus ootab vanema ülevaatust.' : isPending ? 'Ootab sünkroonimist' : isHeld ? HELD_REWARD_MESSAGE : h.kind === 'task' && h.source === 'manual_adjustment' && meta.reason ? `Põhjus: ${meta.reason}` : h.kind === 'task' && firstCompleter ? 'esimene tegija' : h.kind === 'store' ? 'pood' : '';
      const metaLine = [time, isExercise ? `${h.score}/${h.questionCount}` : '', h.kind === 'activity' ? h.detail : '', status].filter(Boolean).join(' · ');
      const body = (
        <>
          {!ownChild && <span className='history-who' data-accent={learner === 'Kiur' ? 'blue' : 'pink'}>{learner}</span>}
          <span className='history-what'><span className='history-title'>{title}</span><small>{metaLine}</small></span>
          <span className='history-amount' data-negative={amount.startsWith('−') || amount.startsWith('-')}>{amount}</span>
        </>
      );
      // An exercise row opens its result; tasks and purchases have nothing more to show.
      if (isExercise) {
        const href = isPending
          ? `/tulemus?clientId=${encodeURIComponent((h as ExerciseHistory).clientAttemptId ?? '')}`
          : `/history/offline?id=${h.id}`;
        return <Link key={`${h.kind}-${h.id}`} className='history-row' data-own={Boolean(ownChild)} href={href}>{body}</Link>;
      }
      return <div key={`${h.kind}-${h.id}`} className='history-row' data-own={Boolean(ownChild)}>{body}</div>;
  }

  const summary = (items: HistoryItem[]) => `${items.length} ${entryWord(items.length)} · ⭐ ${formatStars(earnedStars(items))}`;

  const renderDays = (days: Map<string, HistoryItem[]>) => Array.from(days.entries()).map(([day, items]) => {
    const isOpen = openDays.has(day);
    return (
      <div key={day} className='date-group'>
        <button type='button' className='date-group-toggle' aria-expanded={isOpen} onClick={() => toggleDay(day)}>
          <span>{day}</span>
          <strong>{summary(items)}</strong>
        </button>
        {isOpen && <div className='history-list-compact'>{items.map(renderRow)}</div>}
      </div>
    );
  });

  return (
    <main className='history-page'>
      <div className='history-shell'>
        <div className='history-top'>
          <Link className='subject-back-button' href={ownChild ? `/${ownChild}` : '/'}>{ownChild ? `← ${ownChild === 'kiur' ? 'Kiur' : 'Kirsi'}` : '← Esilehele'}</Link>
          <h1>{ownChild ? 'Minu ajalugu' : 'Ajalugu'}</h1>
          <button type='button' className='history-stats-toggle' aria-expanded={statsOpen} aria-label='Statistika' title='Statistika' onClick={() => setStatsOpen((open) => !open)}><span aria-hidden>📊</span></button>
        </div>

        {!online && <p className='offline-warning' role='status'>Võrguühenduseta kuvatakse seadmesse salvestatud ajalugu.</p>}

        {statsOpen && <HistoryStats />}

        {!ownChild && (
          <div className='history-seg' role='group' aria-label='Laps'>
            {([['all', 'Kõik'], ['kiur', 'Kiur'], ['kirsi', 'Kirsi']] as const).map(([value, label]) => (
              <button key={value} type='button' aria-pressed={childFilter === value} onClick={() => setChildFilter(value)}>{label}</button>
            ))}
          </div>
        )}
        <div className='history-seg' role='group' aria-label='Liik'>
          {([['all', 'Kõik'], ['harjutused', 'Harjutused'], ['paevategevused', 'Tegevused'], ['pood', 'Pood']] as const).map(([value, label]) => (
            <button key={value} type='button' aria-pressed={subjectFilter === value} onClick={() => setSubjectFilter(value)}>{label}</button>
          ))}
        </div>

        {history.length === 0 && taskHistory.length === 0 && storeHistory.length === 0 && activityHistory.length === 0 ? (
          <p>Ajalugu puudub.</p>
        ) : filtered.length === 0 ? (
          <p>Selle valikuga tulemusi ei ole.</p>
        ) : (
          <section className='history-groups'>
            {renderDays(recentDays)}
            {months.map((month) => {
              const isOpen = openMonths.has(month.key);
              return (
                <div key={month.key} className='date-group month-group'>
                  <button type='button' className='date-group-toggle month-group-toggle' aria-expanded={isOpen} onClick={() => toggleMonth(month.key)}>
                    <span>{month.label}</span>
                    <strong>{summary(month.items)}</strong>
                  </button>
                  {isOpen && <div className='month-group-days'>{renderDays(month.days)}</div>}
                </div>
              );
            })}
          </section>
        )}

        {nextHistoryCursor && (
          <button type='button' className='subject-button' disabled={loadingMore} onClick={() => void loadMoreExercises()}>
            {loadingMore ? 'Laadin…' : 'Laadi varasemad kirjed'}
          </button>
        )}

      </div>
    </main>
  );
}
