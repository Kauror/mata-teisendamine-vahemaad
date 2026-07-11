'use client';

import type { FormEvent, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { formatStars } from '@/lib/formatStars';

type AssignmentMode = 'kiur' | 'kirsi' | 'both_independent' | 'first_completer';
type RecurrenceType = 'once' | 'daily' | 'weekdays' | 'weekends' | 'selected_weekdays';
type Learner = 'kiur' | 'kirsi';
type StoreVisibility = 'kiur' | 'kirsi' | 'both';
type StoreStockType = 'unlimited' | 'fixed_stock' | 'daily_stock' | 'one_time_global';

type Template = { id: number; title: string; points: number; assignmentMode: AssignmentMode; recurrenceType: RecurrenceType; selectedWeekdaysJson: string | null; startDate: string | null; onceDate: string | null; requiresApproval: number };
type PendingApproval = { assignmentId: number; learner: Learner; title: string; points: number; assignmentMode: AssignmentMode; completedAt: string | null };
type Dashboard = {
  balances: Record<Learner, number>;
  templates: Template[];
  activeTasks: Array<{ id: number; titleSnapshot: string; pointsSnapshot: number; status: string }>;
  completedTasks: Array<{ titleSnapshot: string; pointsSnapshot: number; learner: Learner; completedAt: string }>;
  pendingApprovals: PendingApproval[];
};

type StoreItem = {
  id: number;
  title: string;
  description: string | null;
  price: number;
  visibility: StoreVisibility;
  stockType: StoreStockType;
  fixedStockRemaining: number | null;
  dailyStockLimit: number | null;
  dailyRemaining: number | null;
  availableFrom: string | null;
  availableUntil: string | null;
  availableWeekdaysJson: string | null;
  isActive: number;
  hiddenToday: boolean;
  boughtOnce: boolean;
};

type StoreDashboard = {
  items: StoreItem[];
  purchases: Array<{ id: number; learner: Learner; titleSnapshot: string; priceSnapshot: number; purchasedAt: string }>;
};

type LearningExerciseStatus = 'hidden' | 'rotation' | 'permanent';
type LearningExerciseSubject = 'matemaatika' | 'inglise-keel' | 'lugemine';
type LearningExercise = {
  id: string;
  title: string;
  learnerScope: Learner[];
  subject: LearningExerciseSubject;
  topic: string;
  category: string;
  routePath: string;
  sortOrder: number;
  childStatus: Record<Learner, LearningExerciseStatus | null>;
};

type LearningExerciseDashboard = {
  exercises: LearningExercise[];
};

type LearningSettings = {
  baseValue: number;
  decayStep: number;
  minimumValue: number;
  dailyCap: number;
  streakIntervalDays: number;
  streakBonusAmount: number;
  learningPointsEnabled: boolean;
  streakBonusEnabled: boolean;
};

type RewardLearnerScope = 'both' | 'kiur' | 'kirsi';
type RewardRule = {
  id: number;
  type: 'learning_streak';
  thresholdDays: number;
  rewardStars: number;
  learnerScope: RewardLearnerScope;
  enabled: boolean;
};

type MonthlyStanding = {
  month: string;
  kiurTrophies: number;
  kirsiTrophies: number;
  kiurExercises: number;
  kirsiExercises: number;
  leader: Learner | 'tie';
};
type MonthlyPrize = { prizeStars: number; standing: MonthlyStanding };

type ParentSectionId = 'stars' | 'notice' | 'tasks' | 'store' | 'learning' | 'library' | 'password' | 'rewards';

function ParentAccordionSection({ title, summary, open, onToggle, children }: { title: string; summary: string; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <section className='parent-accordion-section'>
      <button type='button' className='parent-accordion-toggle' aria-expanded={open} onClick={onToggle}>
        <span>{title}</span>
        <strong>{summary}</strong>
      </button>
      {open && <div className='parent-accordion-content'>{children}</div>}
    </section>
  );
}

const ASSIGNMENT_LABELS: Record<AssignmentMode, string> = {
  kiur: 'Kiur',
  kirsi: 'Kirsi',
  both_independent: 'Mõlemale eraldi',
  first_completer: 'Esimene tegija saab tähed'
};

const RECURRENCE_LABELS: Record<RecurrenceType, string> = {
  once: 'Ühekordne',
  daily: 'Iga päev',
  weekdays: 'Tööpäeviti',
  weekends: 'Nädalavahetusel',
  selected_weekdays: 'Valitud päevadel'
};

const VISIBILITY_LABELS: Record<StoreVisibility, string> = { kiur: 'Kiur', kirsi: 'Kirsi', both: 'Mõlemale' };
const STOCK_LABELS: Record<StoreStockType, string> = {
  unlimited: 'Piiramatu',
  fixed_stock: 'Kindel kogus',
  daily_stock: 'Päevane kogus',
  one_time_global: 'Ühekordne'
};
const SUBJECT_LABELS: Record<LearningExerciseSubject, string> = {
  matemaatika: 'Matemaatika',
  'inglise-keel': 'Inglise keel',
  lugemine: 'Lugemine'
};
const SUBJECT_ORDER: LearningExerciseSubject[] = ['matemaatika', 'inglise-keel', 'lugemine'];
const STATUS_OPTIONS: ReadonlyArray<{ value: LearningExerciseStatus; label: string }> = [
  { value: 'hidden', label: 'Peidus' },
  { value: 'rotation', label: 'Rotatsioon' },
  { value: 'permanent', label: 'Püsiv' }
];

const WEEKDAYS = [
  { id: 1, label: 'E' },
  { id: 2, label: 'T' },
  { id: 3, label: 'K' },
  { id: 4, label: 'N' },
  { id: 5, label: 'R' },
  { id: 6, label: 'L' },
  { id: 7, label: 'P' }
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function learnerLabel(learner: Learner) {
  return learner === 'kiur' ? 'Kiur' : 'Kirsi';
}

function timeLabel(value: string) {
  return new Date(value).toLocaleString('et-EE', { dateStyle: 'short', timeStyle: 'short' });
}

function parseWeekdays(raw: string | null) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as number[] : [];
  } catch {
    return [];
  }
}

const emptyStoreForm = {
  title: '',
  description: '',
  price: 15,
  visibility: 'both' as StoreVisibility,
  stockType: 'unlimited' as StoreStockType,
  fixedStockRemaining: 1,
  dailyStockLimit: 1,
  availableFrom: '',
  availableUntil: '',
  availableWeekdays: [] as number[],
  isActive: true
};

const REWARD_SCOPE_LABELS: Record<RewardLearnerScope, string> = { both: 'Mõlemale', kiur: 'Kiur', kirsi: 'Kirsi' };

const emptyRewardForm = {
  thresholdDays: 5,
  rewardStars: 5,
  learnerScope: 'both' as RewardLearnerScope,
  enabled: true
};

const defaultLearningSettings: LearningSettings = {
  baseValue: 1,
  decayStep: 0.1,
  minimumValue: 0,
  dailyCap: 10,
  streakIntervalDays: 7,
  streakBonusAmount: 1,
  learningPointsEnabled: true,
  streakBonusEnabled: true
};

export default function ParentHub() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [store, setStore] = useState<StoreDashboard | null>(null);
  const [learningExercises, setLearningExercises] = useState<LearningExercise[]>([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState(1);
  const [assignmentMode, setAssignmentMode] = useState<AssignmentMode>('kiur');
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('daily');
  const [onceDate, setOnceDate] = useState(today());
  const [startDate, setStartDate] = useState(today());
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState('1');
  const [adjustReason, setAdjustReason] = useState('');
  const [storeForm, setStoreForm] = useState(emptyStoreForm);
  const [editingStoreId, setEditingStoreId] = useState<number | null>(null);
  const [learningSettings, setLearningSettings] = useState<LearningSettings>(defaultLearningSettings);
  const [rewardRules, setRewardRules] = useState<RewardRule[]>([]);
  const [rewardForm, setRewardForm] = useState(emptyRewardForm);
  const [editingRewardId, setEditingRewardId] = useState<number | null>(null);
  const [monthlyPrize, setMonthlyPrize] = useState<MonthlyPrize | null>(null);
  const [monthlyPrizeInput, setMonthlyPrizeInput] = useState(10);
  const [currentPassword, setCurrentPassword] = useState('');
  const [nextPassword, setNextPassword] = useState('');
  const [noticeText, setNoticeText] = useState('');
  const [openSections, setOpenSections] = useState<Set<ParentSectionId>>(() => new Set(['stars']));
  const [exerciseChildFilter, setExerciseChildFilter] = useState<'all' | Learner>('all');
  const [exerciseSubjectFilter, setExerciseSubjectFilter] = useState<'all' | LearningExerciseSubject>('all');
  const [exerciseTopicFilter, setExerciseTopicFilter] = useState('all');
  const [exerciseStatusFilter, setExerciseStatusFilter] = useState<'all' | LearningExerciseStatus>('all');

  const toggleSection = (section: ParentSectionId) => {
    setOpenSections((current) => {
      const next = new Set(current);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const load = () => {
    setError('');
    Promise.all([
      fetch('/api/parent/dashboard').then((res) => (res.ok ? res.json() : Promise.reject())),
      fetch('/api/parent/store').then((res) => (res.ok ? res.json() : Promise.reject())),
      fetch('/api/parent/learning-settings').then((res) => (res.ok ? res.json() : Promise.reject())),
      fetch('/api/parent/learning-exercises').then((res) => (res.ok ? res.json() : Promise.reject())),
      fetch('/api/parent/reward-rules').then((res) => (res.ok ? res.json() : Promise.reject())),
      fetch('/api/notice').then((res) => (res.ok ? res.json() : Promise.reject())),
      fetch('/api/parent/monthly-prize').then((res) => (res.ok ? res.json() : Promise.reject()))
    ])
      .then(([dashboard, storeDashboard, settings, exerciseDashboard, rewardData, noticeData, monthlyPrizeData]) => {
        setData(dashboard);
        setStore(storeDashboard);
        setLearningSettings(settings);
        setLearningExercises((exerciseDashboard as LearningExerciseDashboard).exercises);
        setRewardRules(Array.isArray(rewardData?.rules) ? rewardData.rules : []);
        setNoticeText(typeof noticeData?.text === 'string' ? noticeData.text : '');
        setMonthlyPrize(monthlyPrizeData as MonthlyPrize);
        setMonthlyPrizeInput((monthlyPrizeData as MonthlyPrize)?.prizeStars ?? 10);
      })
      .catch(() => setError('Andmeid ei saanud laadida.'));
  };

  useEffect(() => {
    load();
  }, []);

  // Auto-hide the success toast so it fades away after a brief moment.
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 2600);
    return () => clearTimeout(timer);
  }, [notice]);

  // Errors linger a little longer than confirmations, then fade away too.
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(''), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  const exerciseTopicOptions = useMemo(() => {
    const values = new Map<string, string>();
    for (const exercise of learningExercises) {
      if (exercise.topic) values.set(exercise.topic, exercise.topic);
      if (exercise.category) values.set(exercise.category, exercise.category);
      if (!exercise.topic && !exercise.category) values.set(exercise.title, exercise.title);
    }
    return Array.from(values, ([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label, 'et'));
  }, [learningExercises]);

  // Each catalog entry belongs to a single child, so we group by learner (Kiur
  // first, then Kirsi) instead of interleaving them, and show one compact row
  // per exercise with that child's status.
  const exercisesByLearner = useMemo(() => {
    const result: Record<Learner, LearningExercise[]> = { kiur: [], kirsi: [] };
    for (const learner of ['kiur', 'kirsi'] as Learner[]) {
      result[learner] = learningExercises
        .filter((exercise) => exercise.learnerScope.includes(learner))
        .filter((exercise) => {
          const subjectOk = exerciseSubjectFilter === 'all' || exercise.subject === exerciseSubjectFilter;
          const topicOk = exerciseTopicFilter === 'all' || exercise.topic === exerciseTopicFilter || exercise.category === exerciseTopicFilter || exercise.title === exerciseTopicFilter;
          const statusOk = exerciseStatusFilter === 'all' || exercise.childStatus[learner] === exerciseStatusFilter;
          return subjectOk && topicOk && statusOk;
        })
        .sort((a, b) => {
          const subjectDiff = SUBJECT_ORDER.indexOf(a.subject) - SUBJECT_ORDER.indexOf(b.subject);
          if (subjectDiff !== 0) return subjectDiff;
          if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
          return a.title.localeCompare(b.title, 'et');
        });
    }
    return result;
  }, [learningExercises, exerciseStatusFilter, exerciseSubjectFilter, exerciseTopicFilter]);

  const learnersToShow = (exerciseChildFilter === 'all' ? ['kiur', 'kirsi'] : [exerciseChildFilter]) as Learner[];
  const hasVisibleExercises = learnersToShow.some((learner) => exercisesByLearner[learner].length > 0);

  const changeLearningExerciseStatus = async (exerciseId: string, learner: Learner, status: LearningExerciseStatus) => {
    setError('');
    setNotice('');
    const res = await fetch('/api/parent/learning-exercises', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exerciseId, learner, status })
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.message || 'Harjutust ei saanud muuta.');
      return;
    }
    setLearningExercises((body as LearningExerciseDashboard).exercises);
    setNotice(status === 'permanent' ? 'Harjutus on nüüd püsiv.' : status === 'rotation' ? 'Harjutus on rotatsioonis.' : 'Harjutus peideti lapse vaatest.');
  };

  const resetTaskForm = () => {
    setEditingTaskId(null);
    setTitle('');
    setPoints(1);
    setAssignmentMode('kiur');
    setRecurrenceType('daily');
    setOnceDate(today());
    setStartDate(today());
    setSelectedWeekdays([1, 2, 3, 4, 5]);
    setRequiresApproval(false);
  };

  const editTask = (template: Template) => {
    setEditingTaskId(template.id);
    setTitle(template.title);
    setPoints(template.points);
    setAssignmentMode(template.assignmentMode);
    setRecurrenceType(template.recurrenceType);
    setOnceDate(template.onceDate || today());
    setStartDate(template.startDate || today());
    const weekdays = parseWeekdays(template.selectedWeekdaysJson);
    setSelectedWeekdays(weekdays.length > 0 ? weekdays : [1, 2, 3, 4, 5]);
    setRequiresApproval(Boolean(template.requiresApproval));
    setOpenSections((current) => new Set(current).add('tasks'));
    setNotice('');
    setError('');
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const createTask = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');
    const url = editingTaskId ? `/api/parent/tasks/${editingTaskId}` : '/api/parent/tasks';
    const res = await fetch(url, {
      method: editingTaskId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, points, assignmentMode, recurrenceType, onceDate, startDate, selectedWeekdays, requiresApproval })
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.message || 'Tegevust ei saanud salvestada.');
      return;
    }
    setNotice(editingTaskId ? 'Tegevus muudetud.' : 'Tegevus lisatud.');
    resetTaskForm();
    load();
  };

  const deleteTask = async (id: number) => {
    if (typeof window !== 'undefined' && !window.confirm('Kas kustutada see tegevus?')) return;
    await fetch(`/api/parent/tasks/${id}`, { method: 'DELETE' });
    if (editingTaskId === id) resetTaskForm();
    load();
  };

  const resolveApproval = async (assignmentId: number, action: 'approve' | 'reject') => {
    setError('');
    setNotice('');
    const res = await fetch('/api/parent/approvals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignmentId, action })
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.message || 'Toimingut ei saanud teha.');
      load();
      return;
    }
    setNotice(action === 'approve' ? 'Tähed kinnitatud.' : 'Tegevus saadeti uuesti tegemiseks.');
    load();
  };

  // Stars and trophies adjust the same way: +/- a positive magnitude for one
  // child, via their own endpoint. Only the endpoint and wording differ.
  const ADJUST_KINDS = {
    points: { url: '/api/parent/adjust-points', fail: 'Punkte ei saanud muuta.', addNoun: 'tähte', removeVerb: 'tähti vähendati' },
    trophies: { url: '/api/parent/adjust-trophies', fail: 'Karikaid ei saanud muuta.', addNoun: 'karikat', removeVerb: 'karikaid vähendati' }
  } as const;

  const submitAdjustment = async (kind: keyof typeof ADJUST_KINDS, learner: Learner, direction: 1 | -1) => {
    setError('');
    setNotice('');
    const magnitude = Math.max(1, Math.trunc(Math.abs(Number(adjustAmount) || 1)));
    const config = ADJUST_KINDS[kind];
    const res = await fetch(config.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ learner, amount: magnitude * direction, reason: adjustReason })
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.message || config.fail);
      return;
    }
    setAdjustReason('');
    setNotice(direction > 0
      ? `${learnerLabel(learner)} sai +${magnitude} ${config.addNoun}.`
      : `${learnerLabel(learner)} ${config.removeVerb} ${magnitude} võrra.`);
    load();
  };

  const saveStoreItem = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');
    const url = editingStoreId ? `/api/parent/store/${editingStoreId}` : '/api/parent/store';
    const res = await fetch(url, {
      method: editingStoreId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storeForm)
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.message || 'Poe eset ei saanud salvestada.');
      return;
    }
    setNotice(editingStoreId ? 'Poe ese muudetud.' : 'Poe ese lisatud.');
    setEditingStoreId(null);
    setStoreForm(emptyStoreForm);
    load();
  };

  const saveLearningSettings = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    const res = await fetch('/api/parent/learning-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(learningSettings)
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.message || 'Õppimise seadeid ei saanud salvestada.');
      return;
    }
    setLearningSettings(body);
    setNotice('Õppimise seaded salvestatud.');
  };

  const resetRewardForm = () => {
    setEditingRewardId(null);
    setRewardForm(emptyRewardForm);
  };

  const editRewardRule = (rule: RewardRule) => {
    setEditingRewardId(rule.id);
    setRewardForm({ thresholdDays: rule.thresholdDays, rewardStars: rule.rewardStars, learnerScope: rule.learnerScope, enabled: rule.enabled });
    setOpenSections((current) => new Set(current).add('rewards'));
    setNotice('');
    setError('');
  };

  const saveRewardRule = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');
    const url = editingRewardId ? `/api/parent/reward-rules/${editingRewardId}` : '/api/parent/reward-rules';
    const res = await fetch(url, {
      method: editingRewardId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...rewardForm, type: 'learning_streak' })
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.message || 'Auhinda ei saanud salvestada.');
      return;
    }
    if (Array.isArray(body.rules)) setRewardRules(body.rules);
    setNotice(editingRewardId ? 'Auhind muudetud.' : 'Auhind lisatud.');
    resetRewardForm();
  };

  const deleteRewardRule = async (id: number) => {
    if (typeof window !== 'undefined' && !window.confirm('Kas kustutada see auhind?')) return;
    const res = await fetch(`/api/parent/reward-rules/${id}`, { method: 'DELETE' });
    const body = await res.json().catch(() => ({}));
    if (Array.isArray(body.rules)) setRewardRules(body.rules);
    if (editingRewardId === id) resetRewardForm();
  };

  const toggleRewardEnabled = async (rule: RewardRule) => {
    setError('');
    setNotice('');
    const res = await fetch(`/api/parent/reward-rules/${rule.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thresholdDays: rule.thresholdDays, rewardStars: rule.rewardStars, learnerScope: rule.learnerScope, enabled: !rule.enabled, type: 'learning_streak' })
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.message || 'Auhinda ei saanud muuta.');
      return;
    }
    if (Array.isArray(body.rules)) setRewardRules(body.rules);
  };

  const editStoreItem = (item: StoreItem) => {
    setEditingStoreId(item.id);
    setStoreForm({
      title: item.title,
      description: item.description || '',
      price: item.price,
      visibility: item.visibility,
      stockType: item.stockType,
      fixedStockRemaining: item.fixedStockRemaining ?? 0,
      dailyStockLimit: item.dailyStockLimit ?? 1,
      availableFrom: item.availableFrom || '',
      availableUntil: item.availableUntil || '',
      availableWeekdays: parseWeekdays(item.availableWeekdaysJson),
      isActive: Boolean(item.isActive)
    });
    setOpenSections((current) => new Set(current).add('store'));
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const storePatch = async (id: number, action: string) => {
    setError('');
    setNotice('');
    setStore((current) => current ? {
      ...current,
      items: current.items.map((item) => item.id === id ? { ...item, hiddenToday: action === 'hide_today' } : item)
    } : current);
    const res = await fetch(`/api/parent/store/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }) });
    if (!res.ok) {
      setError('Poe nähtavust ei saanud muuta.');
      load();
      return;
    }
    setNotice(action === 'hide_today' ? 'Peidetud tänaseks.' : 'Näidatakse täna.');
    load();
  };

  const changePassword = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');
    const res = await fetch('/api/parent/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, nextPassword })
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.message || 'Parooli ei saanud muuta.');
      return;
    }
    setCurrentPassword('');
    setNextPassword('');
    setNotice('Parool muudetud.');
  };

  const saveNotice = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');
    const res = await fetch('/api/parent/notice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: noticeText })
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.message || 'Teksti ei saanud salvestada.');
      return;
    }
    setNoticeText(typeof body.text === 'string' ? body.text : '');
    setNotice('Teated ja reeglid salvestatud.');
  };

  const saveMonthlyPrize = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');
    const res = await fetch('/api/parent/monthly-prize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prizeStars: monthlyPrizeInput })
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.message || 'Auhinda ei saanud salvestada.');
      return;
    }
    setMonthlyPrize(body as MonthlyPrize);
    setMonthlyPrizeInput((body as MonthlyPrize)?.prizeStars ?? monthlyPrizeInput);
    setNotice('Kuu auhind salvestatud.');
  };

  const deleteStore = async (id: number) => {
    await fetch(`/api/parent/store/${id}`, { method: 'DELETE' });
    load();
  };

  const logout = async () => {
    await fetch('/api/parent/logout', { method: 'POST' });
    window.location.reload();
  };

  return (
    <section className='parent-hub'>
      <header className='parent-header'>
        <div>
          <h1>Lapsevanema ala</h1>
          <p>Tegevused, pood ja tähed</p>
        </div>
        <button type='button' className='filter-chip' onClick={logout}>Välju</button>
      </header>

      {(error || notice) && (
        <div className='parent-toast-stack'>
          {error && <div className='parent-toast parent-toast-error' role='alert' key={`e-${error}`}>{error}</div>}
          {notice && <div className='parent-toast' role='status' aria-live='polite' key={`n-${notice}`}>{notice}</div>}
        </div>
      )}

      {(data?.pendingApprovals?.length ?? 0) > 0 && (
        <section className='parent-approvals' aria-label='Vanema kinnitus'>
          <h2>✋ Vanema kinnitus ({data?.pendingApprovals.length})</h2>
          <p>Need tegevused ootavad sinu kinnitust, enne kui laps tähed saab.</p>
          <div className='parent-approval-list'>
            {(data?.pendingApprovals ?? []).map((item) => (
              <div key={item.assignmentId} className='parent-approval-row'>
                <div className='parent-approval-info'>
                  <strong>{learnerLabel(item.learner)} · {item.title}</strong>
                  <span>+{item.points} ⭐{item.completedAt ? ` · ${timeLabel(item.completedAt)}` : ''}</span>
                </div>
                <div className='parent-approval-actions'>
                  <button type='button' className='view-button' onClick={() => resolveApproval(item.assignmentId, 'approve')}>Kinnita</button>
                  <button type='button' className='filter-chip' onClick={() => resolveApproval(item.assignmentId, 'reject')}>Lükka tagasi</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <ParentAccordionSection title='Tähed ja karikad' summary='Saldod, punktide ja karikate muutmine' open={openSections.has('stars')} onToggle={() => toggleSection('stars')}>
      <section className='parent-card parent-adjust-card'>
        <div className='parent-form parent-adjust-controls'>
          <label className='parent-adjust-amount'><span>Kogus</span><input type='number' inputMode='numeric' min={1} step={1} value={adjustAmount} onChange={(event) => { const next = event.target.value; if (next === '' || /^\d+$/.test(next)) setAdjustAmount(next); }} onBlur={() => setAdjustAmount(String(Math.max(1, Math.trunc(Number(adjustAmount) || 1))))} /></label>
          <label className='parent-adjust-reason-field'><span>Põhjus (valikuline)</span><input value={adjustReason} onChange={(event) => setAdjustReason(event.target.value)} placeholder='boonus' /></label>
        </div>
        <div className='parent-adjust-grid'>
          <div className='parent-adjust-block'>
            <h3>⭐ Tähed</h3>
            {(['kiur', 'kirsi'] as Learner[]).map((child) => (
              <div key={child} className='parent-adjust-row'>
                <span className='parent-adjust-name'>{learnerLabel(child)}</span>
                <strong className='parent-adjust-value'>{formatStars(data?.balances[child] ?? 0)}</strong>
                <div className='parent-stepper'>
                  <button type='button' className='parent-step-minus' aria-label={`Eemalda ${learnerLabel(child)}lt tähti`} onClick={() => submitAdjustment('points', child, -1)}>−</button>
                  <button type='button' className='parent-step-plus' aria-label={`Lisa ${learnerLabel(child)}le tähti`} onClick={() => submitAdjustment('points', child, 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
          <div className='parent-adjust-block'>
            <h3>🏆 Karikad</h3>
            {(['kiur', 'kirsi'] as Learner[]).map((child) => (
              <div key={child} className='parent-adjust-row'>
                <span className='parent-adjust-name'>{learnerLabel(child)}</span>
                <strong className='parent-adjust-value'>{(child === 'kiur' ? monthlyPrize?.standing.kiurTrophies : monthlyPrize?.standing.kirsiTrophies) ?? 0}</strong>
                <div className='parent-stepper'>
                  <button type='button' className='parent-step-minus' aria-label={`Eemalda ${learnerLabel(child)}lt karikaid`} onClick={() => submitAdjustment('trophies', child, -1)}>−</button>
                  <button type='button' className='parent-step-plus' aria-label={`Lisa ${learnerLabel(child)}le karikaid`} onClick={() => submitAdjustment('trophies', child, 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </ParentAccordionSection>

      <ParentAccordionSection title='Harjutuste kogu' summary={`${learningExercises.length} harjutust`} open={openSections.has('library')} onToggle={() => toggleSection('library')}>
      <section className='parent-card'>
        <p>Lapsele näidatakse päevas kuni 4 harjutust: kõik <strong>püsivad</strong> ja juhuslik valik <strong>rotatsioonist</strong>. Valik vahetub iga päev. Kordamine lisandub 5.-na, kui vaja.</p>
        <div className='parent-form parent-library-filters'>
          <label><span>Laps</span><select value={exerciseChildFilter} onChange={(event) => setExerciseChildFilter(event.target.value as 'all' | Learner)}><option value='all'>Kõik</option><option value='kiur'>Kiur</option><option value='kirsi'>Kirsi</option></select></label>
          <label><span>Aine</span><select value={exerciseSubjectFilter} onChange={(event) => setExerciseSubjectFilter(event.target.value as 'all' | LearningExerciseSubject)}><option value='all'>Kõik ained</option>{Object.entries(SUBJECT_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label><span>Teema</span><select value={exerciseTopicFilter} onChange={(event) => setExerciseTopicFilter(event.target.value)}><option value='all'>Kõik teemad</option>{exerciseTopicOptions.map((topic) => <option key={topic.value} value={topic.value}>{topic.label}</option>)}</select></label>
          <label><span>Staatus</span><select value={exerciseStatusFilter} onChange={(event) => setExerciseStatusFilter(event.target.value as 'all' | LearningExerciseStatus)}><option value='all'>Kõik</option><option value='rotation'>Rotatsioonis</option><option value='permanent'>Püsiv</option><option value='hidden'>Peidetud</option></select></label>
        </div>
        <div className='learning-library'>
          {learningExercises.length === 0 && <p>Harjutuste kogu laaditakse.</p>}
          {learningExercises.length > 0 && !hasVisibleExercises && <p>Selle filtriga harjutusi ei ole.</p>}
          {learnersToShow.map((learner) => {
            const list = exercisesByLearner[learner];
            if (list.length === 0) return null;
            const permanentCount = list.filter((exercise) => exercise.childStatus[learner] === 'permanent').length;
            const rotationCount = list.filter((exercise) => exercise.childStatus[learner] === 'rotation').length;
            return (
              <div key={learner} className='learning-learner-group'>
                <div className='learning-learner-head'>
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
                                onClick={() => { if (status !== option.value) changeLearningExerciseStatus(exercise.id, learner, option.value); }}
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
      </ParentAccordionSection>

      <ParentAccordionSection title='Tegevused' summary={editingTaskId ? 'Muudad tegevust' : `${data?.templates?.length ?? 0} tegevust`} open={openSections.has('tasks')} onToggle={() => toggleSection('tasks')}>
      <section className='parent-card'>
        <form className='parent-form parent-task-form' onSubmit={createTask}>
          <label><span>Tegevuse nimi</span><input value={title} maxLength={80} onChange={(event) => setTitle(event.target.value)} placeholder='Pese hambad' /></label>
          <label><span>Punktid</span><input type='number' min={1} max={99} value={points} onChange={(event) => setPoints(Number(event.target.value))} /></label>
          <label><span>Kellele?</span><select value={assignmentMode} onChange={(event) => setAssignmentMode(event.target.value as AssignmentMode)}>{Object.entries(ASSIGNMENT_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label><span>Kordumine</span><select value={recurrenceType} onChange={(event) => setRecurrenceType(event.target.value as RecurrenceType)}>{Object.entries(RECURRENCE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          {recurrenceType === 'once' ? <label><span>Kuupäev</span><input type='date' value={onceDate} onChange={(event) => setOnceDate(event.target.value)} /></label> : <label><span>Alguskuupäev</span><input type='date' value={startDate} onChange={(event) => setStartDate(event.target.value)} /></label>}
          {recurrenceType === 'selected_weekdays' && <div className='weekday-picker'>{WEEKDAYS.map((day) => <button type='button' key={day.id} className={selectedWeekdays.includes(day.id) ? 'filter-chip active' : 'filter-chip'} onClick={() => setSelectedWeekdays((prev) => prev.includes(day.id) ? prev.filter((x) => x !== day.id) : [...prev, day.id])}>{day.label}</button>)}</div>}
          <label className='parent-checkbox parent-approval-toggle'><input type='checkbox' checked={requiresApproval} onChange={(event) => setRequiresApproval(event.target.checked)} /> Vajab vanema kinnitust</label>
          <div className='parent-action-row'>
            {editingTaskId && <button type='button' className='filter-chip' onClick={resetTaskForm}>Tühista</button>}
            <button type='submit'>{editingTaskId ? 'Muuda tegevust' : 'Salvesta'}</button>
          </div>
        </form>
      </section>
      <section className='parent-card'>
        <h3>Olemasolevad tegevused</h3>
        <div className='stock-list'>
          {(data?.templates ?? []).map((task) => (
            <div key={task.id} className={editingTaskId === task.id ? 'stock-row editing' : 'stock-row'}>
              <div className='stock-info'>
                <strong>{task.title}</strong>
                <span>{ASSIGNMENT_LABELS[task.assignmentMode]} · {RECURRENCE_LABELS[task.recurrenceType]} · +{task.points} ⭐{task.requiresApproval ? ' · ✋ kinnitus' : ''}</span>
              </div>
              <div className='stock-actions'>
                <button type='button' className='view-button' onClick={() => editTask(task)}>Muuda</button>
                <button type='button' className='delete-button' onClick={() => deleteTask(task.id)}>Kustuta</button>
              </div>
            </div>
          ))}
          {data && data.templates.length === 0 && <p>Tegevusi ei ole loodud.</p>}
        </div>
      </section>
      </ParentAccordionSection>

      <ParentAccordionSection title='Pood' summary={`${store?.items.length ?? 0} eset`} open={openSections.has('store')} onToggle={() => toggleSection('store')}>
      <section className='parent-card'>
        <form className='parent-form parent-task-form' onSubmit={saveStoreItem}>
          <label><span>Nimi</span><input value={storeForm.title} maxLength={80} onChange={(event) => setStoreForm({ ...storeForm, title: event.target.value })} placeholder='30 min ekraaniaega' /></label>
          <label><span>Kirjeldus</span><input value={storeForm.description} maxLength={300} onChange={(event) => setStoreForm({ ...storeForm, description: event.target.value })} placeholder='Lisa aeg mängimiseks või video vaatamiseks.' /></label>
          <label><span>Hind</span><input type='number' min={1} max={9999} value={storeForm.price} onChange={(event) => setStoreForm({ ...storeForm, price: Number(event.target.value) })} /></label>
          <label><span>Kellele?</span><select value={storeForm.visibility} onChange={(event) => setStoreForm({ ...storeForm, visibility: event.target.value as StoreVisibility })}>{Object.entries(VISIBILITY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label><span>Tüüp</span><select value={storeForm.stockType} onChange={(event) => setStoreForm({ ...storeForm, stockType: event.target.value as StoreStockType })}>{Object.entries(STOCK_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          {storeForm.stockType === 'fixed_stock' && <label><span>Kogus</span><input type='number' min={0} value={storeForm.fixedStockRemaining} onChange={(event) => setStoreForm({ ...storeForm, fixedStockRemaining: Number(event.target.value) })} /></label>}
          {storeForm.stockType === 'daily_stock' && <label><span>Päevas saadaval</span><input type='number' min={1} value={storeForm.dailyStockLimit} onChange={(event) => setStoreForm({ ...storeForm, dailyStockLimit: Number(event.target.value) })} /></label>}
          <label><span>Saadaval alates</span><input type='date' value={storeForm.availableFrom} onChange={(event) => setStoreForm({ ...storeForm, availableFrom: event.target.value })} /></label>
          <label><span>Saadaval kuni</span><input type='date' value={storeForm.availableUntil} onChange={(event) => setStoreForm({ ...storeForm, availableUntil: event.target.value })} /></label>
          <label className='parent-checkbox'><input type='checkbox' checked={storeForm.isActive} onChange={(event) => setStoreForm({ ...storeForm, isActive: event.target.checked })} /> Aktiivne</label>
          <div className='weekday-picker'>
            <span>Nädalapäevad</span>
            {WEEKDAYS.map((day) => <button type='button' key={day.id} className={storeForm.availableWeekdays.includes(day.id) ? 'filter-chip active' : 'filter-chip'} onClick={() => setStoreForm((prev) => ({ ...prev, availableWeekdays: prev.availableWeekdays.includes(day.id) ? prev.availableWeekdays.filter((x) => x !== day.id) : [...prev.availableWeekdays, day.id] }))}>{day.label}</button>)}
          </div>
          <div className='parent-action-row'>
            {editingStoreId && <button type='button' className='filter-chip' onClick={() => { setEditingStoreId(null); setStoreForm(emptyStoreForm); }}>Tühista</button>}
            <button type='submit'>{editingStoreId ? 'Muuda poe eset' : 'Lisa poe ese'}</button>
          </div>
        </form>
      </section>
      <section className='parent-card'>
        <h3>Laoseis</h3>
        <div className='stock-list'>
          {(store?.items ?? []).map((item) => (
            <div key={item.id} className='stock-row'>
              <div className='stock-info'>
                <strong>{item.title}</strong>
                <span>
                  {VISIBILITY_LABELS[item.visibility]} · {STOCK_LABELS[item.stockType]} · {item.price} ⭐
                  {item.stockType === 'fixed_stock' && ` · alles ${item.fixedStockRemaining ?? 0}`}
                  {item.stockType === 'daily_stock' && ` · täna ${item.dailyRemaining ?? 0}/${item.dailyStockLimit}`}
                  {item.stockType === 'one_time_global' && item.boughtOnce && ' · ostetud'}
                </span>
              </div>
              <div className='stock-actions'>
                <button type='button' className='view-button' onClick={() => editStoreItem(item)}>Muuda</button>
                <button type='button' className='filter-chip' onClick={() => storePatch(item.id, item.hiddenToday ? 'show_today' : 'hide_today')}>{item.hiddenToday ? 'Näita' : 'Peida'}</button>
                <button type='button' className='delete-button' onClick={() => deleteStore(item.id)}>Kustuta</button>
              </div>
            </div>
          ))}
          {store && store.items.length === 0 && <p>Poe esemeid ei ole loodud.</p>}
        </div>
      </section>
      <section className='parent-card'>
        <h3>Ostud</h3>
        <div className='stock-list'>
          {(store?.purchases ?? []).map((purchase) => (
            <div key={purchase.id} className='stock-row'>
              <div className='stock-info'>
                <strong>{learnerLabel(purchase.learner)} · {purchase.titleSnapshot}</strong>
                <span>-{purchase.priceSnapshot} ⭐ · {timeLabel(purchase.purchasedAt)}</span>
              </div>
            </div>
          ))}
          {store && store.purchases.length === 0 && <p>Oste veel ei ole.</p>}
        </div>
      </section>
      </ParentAccordionSection>

      <ParentAccordionSection title='Õppimise punktid' summary='Harjutuste tähtede reeglid' open={openSections.has('learning')} onToggle={() => toggleSection('learning')}>
      <section className='parent-card'>
        <p>Õppimise punktid annavad tähti harjutuste tegemise eest. Sama harjutuse kordamisel väheneb tänane väärtus, et vältida lihtsat punktide kogumist.</p>
        <form className='parent-form parent-task-form' onSubmit={saveLearningSettings}>
          <label><span>Algväärtus</span><input type='number' step='0.1' min={0} max={20} value={learningSettings.baseValue} onChange={(event) => setLearningSettings({ ...learningSettings, baseValue: Number(event.target.value) })} /></label>
          <label><span>Vähenemine</span><input type='number' step='0.1' min={0} max={20} value={learningSettings.decayStep} onChange={(event) => setLearningSettings({ ...learningSettings, decayStep: Number(event.target.value) })} /></label>
          <label><span>Miinimum</span><input type='number' step='0.1' min={0} max={20} value={learningSettings.minimumValue} onChange={(event) => setLearningSettings({ ...learningSettings, minimumValue: Number(event.target.value) })} /></label>
          <label><span>Päevane õppimise piir</span><input type='number' step='0.1' min={0} max={100} value={learningSettings.dailyCap} onChange={(event) => setLearningSettings({ ...learningSettings, dailyCap: Number(event.target.value) })} /></label>
          <label><span>Seeriaboonuse samm</span><input type='number' min={1} max={365} value={learningSettings.streakIntervalDays} onChange={(event) => setLearningSettings({ ...learningSettings, streakIntervalDays: Number(event.target.value) })} /></label>
          <label><span>Seeriaboonus</span><input type='number' step='0.1' min={0} max={100} value={learningSettings.streakBonusAmount} onChange={(event) => setLearningSettings({ ...learningSettings, streakBonusAmount: Number(event.target.value) })} /></label>
          <label className='parent-checkbox'><input type='checkbox' checked={learningSettings.learningPointsEnabled} onChange={(event) => setLearningSettings({ ...learningSettings, learningPointsEnabled: event.target.checked })} /> Õppimise punktid sees</label>
          <label className='parent-checkbox'><input type='checkbox' checked={learningSettings.streakBonusEnabled} onChange={(event) => setLearningSettings({ ...learningSettings, streakBonusEnabled: event.target.checked })} /> Seeriaboonus sees</label>
          <button type='submit'>Salvesta</button>
        </form>
      </section>
      </ParentAccordionSection>

      <ParentAccordionSection title='Parool' summary='Lapsevanema ala ligipääs' open={openSections.has('password')} onToggle={() => toggleSection('password')}>
      <section className='parent-card'>
        <form className='parent-form parent-task-form' onSubmit={changePassword}>
          <label><span>Praegune parool</span><input type='password' value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label>
          <label><span>Uus parool</span><input type='password' value={nextPassword} onChange={(event) => setNextPassword(event.target.value)} /></label>
          <button type='submit'>Muuda parool</button>
        </form>
      </section>
      </ParentAccordionSection>

      <ParentAccordionSection title='Teated ja reeglid' summary='Tekst laste avalehel' open={openSections.has('notice')} onToggle={() => toggleSection('notice')}>
      <section className='parent-card'>
        <p>See tekst kuvatakse pealehel ja laste avalehel. Jäta tühjaks, et seda peita.</p>
        <form className='parent-form' onSubmit={saveNotice}>
          <label><span>Tekst</span><textarea className='parent-notice-input' value={noticeText} maxLength={2000} rows={6} onChange={(event) => setNoticeText(event.target.value)} placeholder={'Näiteks:\n• Enne mängimist tee päevased tegevused\n• Ekraaniaeg kuni 1h'} /></label>
          <div className='parent-action-row'>
            {noticeText && <button type='button' className='filter-chip' onClick={() => setNoticeText('')}>Tühjenda</button>}
            <button type='submit'>Salvesta</button>
          </div>
        </form>
      </section>
      </ParentAccordionSection>

      <ParentAccordionSection title='Auhinnad' summary={rewardRules.length === 0 ? 'Pole seadistatud' : `${rewardRules.length} auhinda`} open={openSections.has('rewards')} onToggle={() => toggleSection('rewards')}>
      <section className='parent-card'>
        <h3>🏆 Kuu võistlus</h3>
        <p>Iga päev saab rohkem ülesandeid lahendanud laps ühe karika. Kuu lõpus võidab see, kellel on rohkem karikaid, ja saab auhinnaks tähed. Auhind makstakse välja automaatselt uue kuu esimesel päeval. Viigi korral auhinda ei anta.</p>
        <form className='parent-form parent-task-form' onSubmit={saveMonthlyPrize}>
          <label><span>Auhind võitjale (tähti)</span><input type='number' step='0.1' min={0} max={1000} value={monthlyPrizeInput} onChange={(event) => setMonthlyPrizeInput(Number(event.target.value))} /></label>
          <button type='submit'>Salvesta auhind</button>
        </form>
        {monthlyPrize && (
          <div className='monthly-standing'>
            <span>Jooksev kuu ({monthlyPrize.standing.month}):</span>
            <strong>Kiur {monthlyPrize.standing.kiurTrophies} 🏆 · Kirsi {monthlyPrize.standing.kirsiTrophies} 🏆</strong>
            <span>{monthlyPrize.standing.leader === 'tie' ? 'Hetkel viik' : `Juhib ${learnerLabel(monthlyPrize.standing.leader)}`}</span>
          </div>
        )}
      </section>
      <section className='parent-card'>
        <h3>Õpiseeria auhinnad</h3>
        <p>Auhinnad annavad lisatähti, kui laps jõuab harjutuste tegemisel teatud päevade seeriani. Näiteks 5 päeva järjest harjutamise eest antakse boonustähed. Seeria katkemisel ja uuesti samasse piirini jõudmisel antakse auhind uuesti.</p>
        <form className='parent-form parent-task-form' onSubmit={saveRewardRule}>
          <label><span>Päevade seeria</span><input type='number' min={1} max={365} value={rewardForm.thresholdDays} onChange={(event) => setRewardForm({ ...rewardForm, thresholdDays: Number(event.target.value) })} /></label>
          <label><span>Tähti auhinnaks</span><input type='number' step='0.1' min={0.1} max={1000} value={rewardForm.rewardStars} onChange={(event) => setRewardForm({ ...rewardForm, rewardStars: Number(event.target.value) })} /></label>
          <label><span>Kellele?</span><select value={rewardForm.learnerScope} onChange={(event) => setRewardForm({ ...rewardForm, learnerScope: event.target.value as RewardLearnerScope })}>{Object.entries(REWARD_SCOPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label className='parent-checkbox'><input type='checkbox' checked={rewardForm.enabled} onChange={(event) => setRewardForm({ ...rewardForm, enabled: event.target.checked })} /> Aktiivne</label>
          <div className='parent-action-row'>
            {editingRewardId && <button type='button' className='filter-chip' onClick={resetRewardForm}>Tühista</button>}
            <button type='submit'>{editingRewardId ? 'Muuda auhinda' : 'Lisa auhind'}</button>
          </div>
        </form>
      </section>
      <section className='parent-card'>
        <h3>Seadistatud auhinnad</h3>
        <div className='stock-list'>
          {rewardRules.map((rule) => (
            <div key={rule.id} className={editingRewardId === rule.id ? 'stock-row editing' : 'stock-row'}>
              <div className='stock-info'>
                <strong>{rule.thresholdDays} päeva seeria · +{formatStars(rule.rewardStars)} ⭐</strong>
                <span>{REWARD_SCOPE_LABELS[rule.learnerScope]}{rule.enabled ? '' : ' · ⏸ peatatud'}</span>
              </div>
              <div className='stock-actions'>
                <button type='button' className='view-button' onClick={() => editRewardRule(rule)}>Muuda</button>
                <button type='button' className='filter-chip' onClick={() => toggleRewardEnabled(rule)}>{rule.enabled ? 'Peata' : 'Aktiveeri'}</button>
                <button type='button' className='delete-button' onClick={() => deleteRewardRule(rule.id)}>Kustuta</button>
              </div>
            </div>
          ))}
          {rewardRules.length === 0 && <p>Auhindu ei ole veel lisatud.</p>}
        </div>
      </section>
      </ParentAccordionSection>
    </section>
  );
}
