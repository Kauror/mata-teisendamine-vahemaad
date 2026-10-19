'use client';

import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { taskWord } from '@/lib/history';
import { ASSIGNMENT_LABELS, parseWeekdays, RECURRENCE_LABELS, today, WEEKDAYS } from './format';
import { failureMessage, jsonInit } from './parentApi';
import type { AssignmentMode, Dashboard, RecurrenceType, Template } from './types';
import { useParentApi, useParentResource, useParentSaving } from './useParentApi';

// "Tegevused": the chore templates. Their list lives in the dashboard, so a
// change here refreshes the dashboard topic (balances and approvals with it).
// The form shows while adding (Halda's "+ Lisa") or editing a task.
export function TasksPanel({ onSummary, adding = false, onAddDone }: { onSummary: (summary: string) => void; adding?: boolean; onAddDone?: () => void }) {
  const api = useParentApi();
  const saving = useParentSaving();
  const { data } = useParentResource<Dashboard>('dashboard');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState(1);
  const [assignmentMode, setAssignmentMode] = useState<AssignmentMode>('kiur');
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('daily');
  const [onceDate, setOnceDate] = useState(today());
  const [startDate, setStartDate] = useState(today());
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [requiresApproval, setRequiresApproval] = useState(false);

  const templateCount = data?.templates?.length ?? null;
  useEffect(() => {
    if (editingTaskId) onSummary('Muudad tegevust');
    else if (templateCount !== null) onSummary(`${templateCount} ${taskWord(templateCount)}`);
  }, [editingTaskId, onSummary, templateCount]);

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
    api.setNotice('');
    api.setError('');
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveTask = (event: FormEvent) => {
    event.preventDefault();
    return api.guarded(async () => {
      api.setError('');
      api.setNotice('');
      const url = editingTaskId ? `/api/parent/tasks/${editingTaskId}` : '/api/parent/tasks';
      const res = await api.request(url, jsonInit(editingTaskId ? 'PUT' : 'POST', { title, points, assignmentMode, recurrenceType, onceDate, startDate, selectedWeekdays, requiresApproval }));
      if (!res.ok) {
        api.setError(await failureMessage(res, 'Tegevust ei saanud salvestada.'));
        return;
      }
      api.setNotice(editingTaskId ? 'Tegevus muudetud.' : 'Tegevus lisatud.');
      resetTaskForm();
      onAddDone?.();
      api.bus.after('taskTemplate');
    });
  };

  const deleteTask = async (id: number) => {
    if (typeof window !== 'undefined' && !window.confirm('Kas kustutada see tegevus?')) return;
    await api.guarded(async () => {
      api.setError('');
      api.setNotice('');
      const res = await api.request(`/api/parent/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        api.setError(await failureMessage(res, 'Tegevust ei saanud kustutada.'));
        api.bus.after('taskTemplate');
        return;
      }
      if (editingTaskId === id) resetTaskForm();
      api.setNotice('Tegevus kustutatud.');
      api.bus.after('taskTemplate');
    });
  };

  const cancelForm = () => {
    resetTaskForm();
    onAddDone?.();
  };

  return (
    <>
      {(adding || editingTaskId) && <section className='parent-card pv-card' aria-label={editingTaskId ? 'Muuda tegevust' : 'Uus tegevus'}>
        <form className='parent-form parent-task-form' onSubmit={saveTask}>
          <fieldset className='parent-form-fieldset' disabled={saving}>
            <label><span>Tegevuse nimi</span><input value={title} maxLength={80} onChange={(event) => setTitle(event.target.value)} placeholder='Pese hambad' /></label>
            <label><span>Punktid</span><input type='number' min={1} max={99} value={points} onChange={(event) => setPoints(Number(event.target.value))} /></label>
            <label><span>Kellele?</span><select value={assignmentMode} onChange={(event) => setAssignmentMode(event.target.value as AssignmentMode)}>{Object.entries(ASSIGNMENT_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label><span>Kordumine</span><select value={recurrenceType} onChange={(event) => setRecurrenceType(event.target.value as RecurrenceType)}>{Object.entries(RECURRENCE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            {recurrenceType === 'once' ? <label><span>Kuupäev</span><input type='date' value={onceDate} onChange={(event) => setOnceDate(event.target.value)} /></label> : <label><span>Alguskuupäev</span><input type='date' value={startDate} onChange={(event) => setStartDate(event.target.value)} /></label>}
            {recurrenceType === 'selected_weekdays' && <div className='weekday-picker'>{WEEKDAYS.map((day) => <button type='button' key={day.id} className={selectedWeekdays.includes(day.id) ? 'filter-chip active' : 'filter-chip'} onClick={() => setSelectedWeekdays((prev) => prev.includes(day.id) ? prev.filter((x) => x !== day.id) : [...prev, day.id])}>{day.label}</button>)}</div>}
            <label className='parent-checkbox parent-approval-toggle'><input type='checkbox' checked={requiresApproval} onChange={(event) => setRequiresApproval(event.target.checked)} /> Vajab vanema kinnitust</label>
            <div className='parent-action-row'>
              <button type='button' className='filter-chip' onClick={cancelForm}>Loobu</button>
              <button type='submit'>{editingTaskId ? 'Muuda tegevust' : 'Salvesta'}</button>
            </div>
          </fieldset>
        </form>
      </section>}
      <section className='parent-card pv-card' aria-label='Tegevused'>
        <div className='stock-list'>
          {(data?.templates ?? []).map((task) => (
            <div key={task.id} className={editingTaskId === task.id ? 'stock-row editing' : 'stock-row'}>
              <div className='stock-info'>
                <strong>{task.title}</strong>
                <span>{ASSIGNMENT_LABELS[task.assignmentMode]} · {RECURRENCE_LABELS[task.recurrenceType]} · +{task.points} ⭐{task.requiresApproval ? ' · ✋ kinnitus' : ''}</span>
              </div>
              <div className='stock-actions'>
                <button type='button' className='view-button' onClick={() => editTask(task)}>Muuda</button>
                <button type='button' className='delete-button' onClick={() => void deleteTask(task.id)}>Kustuta</button>
              </div>
            </div>
          ))}
          {!data && <p className='pv-hint'>Laadin...</p>}
          {data && data.templates.length === 0 && <p className='pv-hint'>Tegevusi ei ole loodud. Lisa esimene nupuga „+ Lisa“.</p>}
        </div>
      </section>
    </>
  );
}
