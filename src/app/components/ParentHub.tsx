'use client';

import type { FormEvent, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

type AssignmentMode = 'kiur' | 'kirsi' | 'both_independent' | 'first_completer';
type RecurrenceType = 'once' | 'daily' | 'weekdays' | 'weekends' | 'selected_weekdays';
type Learner = 'kiur' | 'kirsi';
type StoreVisibility = 'kiur' | 'kirsi' | 'both';
type StoreStockType = 'unlimited' | 'fixed_stock' | 'daily_stock' | 'one_time_global';

type Template = { id: number; title: string; points: number; assignmentMode: AssignmentMode; recurrenceType: RecurrenceType };
type Dashboard = {
  balances: Record<Learner, number>;
  templates: Template[];
  activeTasks: Array<{ id: number; titleSnapshot: string; pointsSnapshot: number; status: string }>;
  completedTasks: Array<{ titleSnapshot: string; pointsSnapshot: number; learner: Learner; completedAt: string }>;
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

type LearningExerciseStatus = 'active' | 'hidden';
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

type ParentSectionId = 'stars' | 'today' | 'tasks' | 'store' | 'stock' | 'lists' | 'learning' | 'library' | 'password';

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
const STATUS_LABELS: Record<LearningExerciseStatus, string> = {
  active: 'Aktiivne',
  hidden: 'Peidetud'
};

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

function stars(value: number) {
  return Number.isInteger(value) ? String(value) : value.toLocaleString('et-EE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
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
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState(1);
  const [assignmentMode, setAssignmentMode] = useState<AssignmentMode>('kiur');
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('daily');
  const [onceDate, setOnceDate] = useState(today());
  const [startDate, setStartDate] = useState(today());
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [adjustLearner, setAdjustLearner] = useState<Learner>('kiur');
  const [adjustAmount, setAdjustAmount] = useState(1);
  const [adjustReason, setAdjustReason] = useState('');
  const [storeForm, setStoreForm] = useState(emptyStoreForm);
  const [editingStoreId, setEditingStoreId] = useState<number | null>(null);
  const [learningSettings, setLearningSettings] = useState<LearningSettings>(defaultLearningSettings);
  const [currentPassword, setCurrentPassword] = useState('');
  const [nextPassword, setNextPassword] = useState('');
  const [openSections, setOpenSections] = useState<Set<ParentSectionId>>(() => new Set(['stars', 'today']));
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
      fetch('/api/parent/learning-exercises').then((res) => (res.ok ? res.json() : Promise.reject()))
    ])
      .then(([dashboard, storeDashboard, settings, exerciseDashboard]) => {
        setData(dashboard);
        setStore(storeDashboard);
        setLearningSettings(settings);
        setLearningExercises((exerciseDashboard as LearningExerciseDashboard).exercises);
      })
      .catch(() => setError('Andmeid ei saanud laadida.'));
  };

  useEffect(() => {
    load();
  }, []);

  const exerciseTopicOptions = useMemo(() => {
    const values = new Map<string, string>();
    for (const exercise of learningExercises) {
      if (exercise.topic) values.set(exercise.topic, exercise.topic);
      if (exercise.category) values.set(exercise.category, exercise.category);
      if (!exercise.topic && !exercise.category) values.set(exercise.title, exercise.title);
    }
    return Array.from(values, ([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label, 'et'));
  }, [learningExercises]);

  const filteredLearningExercises = useMemo(() => learningExercises.filter((exercise) => {
    const childOk = exerciseChildFilter === 'all' || exercise.learnerScope.includes(exerciseChildFilter);
    const subjectOk = exerciseSubjectFilter === 'all' || exercise.subject === exerciseSubjectFilter;
    const topicOk = exerciseTopicFilter === 'all' || exercise.topic === exerciseTopicFilter || exercise.category === exerciseTopicFilter || exercise.title === exerciseTopicFilter;
    const statusOk = exerciseStatusFilter === 'all'
      || (exerciseChildFilter === 'all'
        ? (exercise.childStatus.kiur === exerciseStatusFilter || exercise.childStatus.kirsi === exerciseStatusFilter)
        : exercise.childStatus[exerciseChildFilter] === exerciseStatusFilter);
    return childOk && subjectOk && topicOk && statusOk;
  }), [exerciseChildFilter, exerciseStatusFilter, exerciseSubjectFilter, exerciseTopicFilter, learningExercises]);

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
    setNotice(status === 'active' ? 'Harjutus lisati tagasi.' : 'Harjutus peideti lapse vaatest.');
  };

  const createTask = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');
    const res = await fetch('/api/parent/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, points, assignmentMode, recurrenceType, onceDate, startDate, selectedWeekdays })
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.message || 'Tegevust ei saanud salvestada.');
      return;
    }
    setTitle('');
    setPoints(1);
    setNotice('Tegevus lisatud.');
    load();
  };

  const deleteTask = async (id: number) => {
    await fetch(`/api/parent/tasks/${id}`, { method: 'DELETE' });
    load();
  };

  const adjustPoints = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');
    const res = await fetch('/api/parent/adjust-points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ learner: adjustLearner, amount: adjustAmount, reason: adjustReason })
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.message || 'Punkte ei saanud muuta.');
      return;
    }
    setAdjustAmount(1);
    setAdjustReason('');
    setNotice(adjustAmount > 0 ? `${learnerLabel(adjustLearner)} sai +${adjustAmount} tähte.` : `${learnerLabel(adjustLearner)} tähti vähendati ${Math.abs(adjustAmount)} võrra.`);
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

      {error && <p className='error'>{error}</p>}
      {notice && <p className='ok'>{notice}</p>}

      <ParentAccordionSection title='Tähed' summary='Saldod ja punktide muutmine' open={openSections.has('stars')} onToggle={() => toggleSection('stars')}>
      <section className='parent-grid'>
        <article className='parent-card'>
          <h2>Tähed</h2>
          <div className='parent-balance-grid'>
            <strong>Kiur: ⭐ {stars(data?.balances.kiur ?? 0)}</strong>
            <strong>Kirsi: ⭐ {stars(data?.balances.kirsi ?? 0)}</strong>
          </div>
        </article>

        <article className='parent-card'>
          <h2>Punktide muutmine</h2>
          <form className='parent-form' onSubmit={adjustPoints}>
            <label><span>Laps</span><select value={adjustLearner} onChange={(event) => setAdjustLearner(event.target.value as Learner)}><option value='kiur'>Kiur</option><option value='kirsi'>Kirsi</option></select></label>
            <label><span>Punktid</span><input type='number' value={adjustAmount} onChange={(event) => setAdjustAmount(Number(event.target.value))} /></label>
            <label><span>Põhjus</span><input value={adjustReason} onChange={(event) => setAdjustReason(event.target.value)} placeholder='boonus' /></label>
            <div className='parent-action-row'>
              <button type='button' className='filter-chip' onClick={() => setAdjustAmount(-Math.abs(adjustAmount || 1))}>Lahuta</button>
              <button type='button' className='filter-chip' onClick={() => setAdjustAmount(Math.abs(adjustAmount || 1))}>Lisa</button>
              <button type='submit'>Salvesta</button>
            </div>
          </form>
        </article>
      </section>
      </ParentAccordionSection>

      <ParentAccordionSection title='Parool' summary='Lapsevanema ala ligipääs' open={openSections.has('password')} onToggle={() => toggleSection('password')}>
      <section className='parent-card'>
        <h2>Muuda parooli</h2>
        <form className='parent-form parent-task-form' onSubmit={changePassword}>
          <label><span>Praegune parool</span><input type='password' value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label>
          <label><span>Uus parool</span><input type='password' value={nextPassword} onChange={(event) => setNextPassword(event.target.value)} /></label>
          <button type='submit'>Muuda parool</button>
        </form>
      </section>
      </ParentAccordionSection>

      <ParentAccordionSection title='Lisa tegevus' summary='Uus päevategevus' open={openSections.has('tasks')} onToggle={() => toggleSection('tasks')}>
      <section className='parent-card'>
        <h2>Lisa tegevus</h2>
        <form className='parent-form parent-task-form' onSubmit={createTask}>
          <label><span>Tegevuse nimi</span><input value={title} maxLength={80} onChange={(event) => setTitle(event.target.value)} placeholder='Pese hambad' /></label>
          <label><span>Punktid</span><input type='number' min={1} max={99} value={points} onChange={(event) => setPoints(Number(event.target.value))} /></label>
          <label><span>Kellele?</span><select value={assignmentMode} onChange={(event) => setAssignmentMode(event.target.value as AssignmentMode)}>{Object.entries(ASSIGNMENT_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label><span>Kordumine</span><select value={recurrenceType} onChange={(event) => setRecurrenceType(event.target.value as RecurrenceType)}>{Object.entries(RECURRENCE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          {recurrenceType === 'once' ? <label><span>Kuupäev</span><input type='date' value={onceDate} onChange={(event) => setOnceDate(event.target.value)} /></label> : <label><span>Alguskuupäev</span><input type='date' value={startDate} onChange={(event) => setStartDate(event.target.value)} /></label>}
          {recurrenceType === 'selected_weekdays' && <div className='weekday-picker'>{WEEKDAYS.map((day) => <button type='button' key={day.id} className={selectedWeekdays.includes(day.id) ? 'filter-chip active' : 'filter-chip'} onClick={() => setSelectedWeekdays((prev) => prev.includes(day.id) ? prev.filter((x) => x !== day.id) : [...prev, day.id])}>{day.label}</button>)}</div>}
          <button type='submit'>Salvesta</button>
        </form>
      </section>
      </ParentAccordionSection>

      <ParentAccordionSection title='Pood' summary='Lisa või muuda poe esemeid' open={openSections.has('store')} onToggle={() => toggleSection('store')}>
      <section className='parent-card'>
        <h2>Pood</h2>
        <form className='parent-form parent-task-form' onSubmit={saveStoreItem}>
          <label><span>Nimi</span><input value={storeForm.title} maxLength={80} onChange={(event) => setStoreForm({ ...storeForm, title: event.target.value })} placeholder='30 min ekraaniaega' /></label>
          <label><span>Kirjeldus</span><input value={storeForm.description} maxLength={300} onChange={(event) => setStoreForm({ ...storeForm, description: event.target.value })} placeholder='Lisa aeg mängimiseks või video vaatamiseks.' /></label>
          <label><span>Hind</span><input type='number' min={1} max={999} value={storeForm.price} onChange={(event) => setStoreForm({ ...storeForm, price: Number(event.target.value) })} /></label>
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
      </ParentAccordionSection>

      <ParentAccordionSection title='Õppimise punktid' summary='Harjutuste tähtede reeglid' open={openSections.has('learning')} onToggle={() => toggleSection('learning')}>
      <section className='parent-card'>
        <h2>Õppimise punktid</h2>
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

      <ParentAccordionSection title='Harjutuste kogu' summary={`${learningExercises.length} harjutust`} open={openSections.has('library')} onToggle={() => toggleSection('library')}>
      <section className='parent-card'>
        <h2>Harjutuste kogu</h2>
        <div className='parent-form parent-library-filters'>
          <label><span>Laps</span><select value={exerciseChildFilter} onChange={(event) => setExerciseChildFilter(event.target.value as 'all' | Learner)}><option value='all'>Kõik</option><option value='kiur'>Kiur</option><option value='kirsi'>Kirsi</option></select></label>
          <label><span>Aine</span><select value={exerciseSubjectFilter} onChange={(event) => setExerciseSubjectFilter(event.target.value as 'all' | LearningExerciseSubject)}><option value='all'>Kõik ained</option>{Object.entries(SUBJECT_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label><span>Teema</span><select value={exerciseTopicFilter} onChange={(event) => setExerciseTopicFilter(event.target.value)}><option value='all'>Kõik teemad</option>{exerciseTopicOptions.map((topic) => <option key={topic.value} value={topic.value}>{topic.label}</option>)}</select></label>
          <label><span>Staatus</span><select value={exerciseStatusFilter} onChange={(event) => setExerciseStatusFilter(event.target.value as 'all' | LearningExerciseStatus)}><option value='all'>Kõik</option><option value='active'>Aktiivne</option><option value='hidden'>Peidetud</option></select></label>
        </div>
        <div className='parent-template-list'>
          {filteredLearningExercises.map((exercise) => (
            <div key={exercise.id} className='parent-template-row parent-learning-exercise-row'>
              <div>
                <strong>{exercise.title}</strong>
                <span>{SUBJECT_LABELS[exercise.subject]} · {exercise.topic || exercise.category}</span>
              </div>
              <div className='learning-status-grid'>
                {(['kiur', 'kirsi'] as Learner[]).map((learner) => {
                  const supported = exercise.learnerScope.includes(learner);
                  const status = exercise.childStatus[learner];
                  const childName = learnerLabel(learner);
                  return (
                    <div key={learner} className='learning-status-cell'>
                      <strong>{childName}</strong>
                      <span>{supported && status ? STATUS_LABELS[status] : 'Ei kuulu'}</span>
                      {supported && status === 'active' ? <button type='button' className='filter-chip' onClick={() => changeLearningExerciseStatus(exercise.id, learner, 'hidden')}>Peida lapse vaatest</button> : null}
                      {supported && status === 'hidden' ? <button type='button' className='view-button' onClick={() => changeLearningExerciseStatus(exercise.id, learner, 'active')}>{learner === 'kiur' ? 'Näita Kiurile' : 'Näita Kirsile'}</button> : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {learningExercises.length > 0 && filteredLearningExercises.length === 0 && <p>Selle filtriga harjutusi ei ole.</p>}
          {learningExercises.length === 0 && <p>Harjutuste kogu laaditakse.</p>}
        </div>
      </section>
      </ParentAccordionSection>

      <ParentAccordionSection title='Täna' summary='Aktiivsed ja tehtud tegevused' open={openSections.has('today')} onToggle={() => toggleSection('today')}>
      <section className='parent-grid'>
        <article className='parent-card'>
          <h2>Tänased tegevused</h2>
          <div className='parent-list'>
            {(data?.activeTasks ?? []).map((task) => <p key={task.id}><strong>{task.titleSnapshot}</strong> +{task.pointsSnapshot} ⭐ <span>{task.status}</span></p>)}
            {data && data.activeTasks.length === 0 && <p>Tänaseid tegevusi ei ole.</p>}
          </div>
        </article>
        <article className='parent-card'>
          <h2>Täna tehtud</h2>
          <div className='parent-list'>
            {(data?.completedTasks ?? []).map((task, index) => <p key={`${task.completedAt}-${index}`}><strong>{learnerLabel(task.learner)}</strong> {task.titleSnapshot} +{task.pointsSnapshot} ⭐</p>)}
            {data && data.completedTasks.length === 0 && <p>Veel ei ole tehtud.</p>}
          </div>
        </article>
      </section>
      </ParentAccordionSection>

      <ParentAccordionSection title='Laoseis' summary={`${store?.items.length ?? 0} poe eset`} open={openSections.has('stock')} onToggle={() => toggleSection('stock')}>
      <section className='parent-card'>
        <h2>Laoseis</h2>
        <div className='parent-template-list'>
          {(store?.items ?? []).map((item) => (
            <div key={item.id} className='parent-template-row'>
              <div>
                <strong>{item.title}</strong>
                <span>{VISIBILITY_LABELS[item.visibility]} · {STOCK_LABELS[item.stockType]} · Hind {item.price} ⭐</span>
                {item.stockType === 'fixed_stock' && <span>Alles: {item.fixedStockRemaining ?? 0}</span>}
                {item.stockType === 'daily_stock' && <span>Täna alles: {item.dailyRemaining ?? 0} / {item.dailyStockLimit}</span>}
                {item.stockType === 'one_time_global' && item.boughtOnce && <span>Ostetud</span>}
              </div>
              <div className='parent-action-row'>
                <button type='button' className='view-button' onClick={() => editStoreItem(item)}>Muuda</button>
                <button type='button' className='filter-chip' onClick={() => storePatch(item.id, item.hiddenToday ? 'show_today' : 'hide_today')}>{item.hiddenToday ? 'Näita täna' : 'Peida täna'}</button>
                <button type='button' className='delete-button' onClick={() => deleteStore(item.id)}>Kustuta</button>
              </div>
            </div>
          ))}
          {store && store.items.length === 0 && <p>Poe esemeid ei ole loodud.</p>}
        </div>
      </section>
      </ParentAccordionSection>

      <ParentAccordionSection title='Nimekirjad' summary='Tegevused ja ostud' open={openSections.has('lists')} onToggle={() => toggleSection('lists')}>
      <section className='parent-grid'>
        <article className='parent-card'>
          <h2>Tegevused</h2>
          <div className='parent-template-list'>
            {(data?.templates ?? []).map((task) => (
              <div key={task.id} className='parent-template-row'>
                <div>
                  <strong>{task.title}</strong>
                  <span>{ASSIGNMENT_LABELS[task.assignmentMode]} · {RECURRENCE_LABELS[task.recurrenceType]} · +{task.points} ⭐</span>
                </div>
                <button type='button' className='delete-button' onClick={() => deleteTask(task.id)}>Kustuta</button>
              </div>
            ))}
            {data && data.templates.length === 0 && <p>Tegevusi ei ole loodud.</p>}
          </div>
        </article>

        <article className='parent-card'>
          <h2>Ostud</h2>
          <div className='parent-list'>
            {(store?.purchases ?? []).map((purchase) => <p key={purchase.id}><strong>{learnerLabel(purchase.learner)} ostis: {purchase.titleSnapshot}</strong><span>-{purchase.priceSnapshot} ⭐ · {timeLabel(purchase.purchasedAt)}</span></p>)}
            {store && store.purchases.length === 0 && <p>Oste veel ei ole.</p>}
          </div>
        </article>
      </section>
      </ParentAccordionSection>
    </section>
  );
}
