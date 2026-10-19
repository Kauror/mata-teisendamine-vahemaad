'use client';

import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { itemWord } from '@/lib/history';
import { learnerLabel, parseWeekdays, STOCK_LABELS, timeLabel, VISIBILITY_LABELS, WEEKDAYS } from './format';
import { failureMessage, jsonInit } from './parentApi';
import type { StoreDashboard, StoreItem, StoreStockType, StoreVisibility } from './types';
import { useParentApi, useParentResource, useParentSaving } from './useParentApi';

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

function storeFormFor(item: StoreItem): typeof emptyStoreForm {
  return {
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
  };
}

// "Pood": shop items, today's visibility and the purchase log. The form shows
// while adding (Halda's "+ Lisa") or editing an item.
export function StorePanel({ onSummary, adding = false, onAddDone }: { onSummary: (summary: string) => void; adding?: boolean; onAddDone?: () => void }) {
  const api = useParentApi();
  const saving = useParentSaving();
  const { data: store, setData: setStore } = useParentResource<StoreDashboard>('store');
  const [storeForm, setStoreForm] = useState(emptyStoreForm);
  const [editingStoreId, setEditingStoreId] = useState<number | null>(null);

  const itemCount = store?.items.length ?? null;
  useEffect(() => {
    if (itemCount !== null) onSummary(`${itemCount} ${itemWord(itemCount)}`);
  }, [itemCount, onSummary]);

  const resetStoreForm = () => {
    setEditingStoreId(null);
    setStoreForm(emptyStoreForm);
  };

  const saveStoreItem = (event: FormEvent) => {
    event.preventDefault();
    return api.guarded(async () => {
      api.setError('');
      api.setNotice('');
      const url = editingStoreId ? `/api/parent/store/${editingStoreId}` : '/api/parent/store';
      const res = await api.request(url, jsonInit(editingStoreId ? 'PUT' : 'POST', storeForm));
      if (!res.ok) {
        api.setError(await failureMessage(res, 'Poe eset ei saanud salvestada.'));
        return;
      }
      api.setNotice(editingStoreId ? 'Poe ese muudetud.' : 'Poe ese lisatud.');
      resetStoreForm();
      onAddDone?.();
      api.bus.after('storeItem');
    });
  };

  const editStoreItem = (item: StoreItem) => {
    setEditingStoreId(item.id);
    setStoreForm(storeFormFor(item));
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const storePatch = (id: number, action: string) => api.guarded(async () => {
    api.setError('');
    api.setNotice('');
    setStore((current) => current ? {
      ...current,
      items: current.items.map((item) => item.id === id ? { ...item, hiddenToday: action === 'hide_today' } : item)
    } : current);
    const res = await api.request(`/api/parent/store/${id}`, jsonInit('PATCH', { action }));
    if (!res.ok) {
      api.setError('Poe nähtavust ei saanud muuta.');
      api.bus.after('storeItem');
      return;
    }
    api.setNotice(action === 'hide_today' ? 'Peidetud tänaseks.' : 'Näidatakse täna.');
    api.bus.after('storeItem');
  });

  const deleteStore = async (id: number) => {
    if (typeof window !== 'undefined' && !window.confirm('Kas kustutada see poe ese?')) return;
    await api.guarded(async () => {
      api.setError('');
      api.setNotice('');
      const res = await api.request(`/api/parent/store/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        api.setError(await failureMessage(res, 'Poe eset ei saanud kustutada.'));
        api.bus.after('storeItem');
        return;
      }
      if (editingStoreId === id) resetStoreForm();
      api.setNotice('Poe ese kustutatud.');
      api.bus.after('storeItem');
    });
  };

  const cancelForm = () => {
    resetStoreForm();
    onAddDone?.();
  };

  return (
    <>
      {(adding || editingStoreId) && <section className='parent-card pv-card' aria-label={editingStoreId ? 'Muuda poe eset' : 'Uus poe ese'}>
        <form className='parent-form parent-task-form' onSubmit={saveStoreItem}>
          <fieldset className='parent-form-fieldset' disabled={saving}>
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
              <button type='button' className='filter-chip' onClick={cancelForm}>Loobu</button>
              <button type='submit'>{editingStoreId ? 'Muuda poe eset' : 'Lisa poe ese'}</button>
            </div>
          </fieldset>
        </form>
      </section>}
      <section className='parent-card pv-card' aria-label='Poe esemed'>
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
                <button type='button' className='delete-button' onClick={() => void deleteStore(item.id)}>Kustuta</button>
              </div>
            </div>
          ))}
          {!store && <p className='pv-hint'>Laadin...</p>}
          {store && store.items.length === 0 && <p className='pv-hint'>Poe esemeid ei ole loodud. Lisa esimene nupuga „+ Lisa“.</p>}
        </div>
      </section>
      <section className='parent-card pv-card' aria-label='Ostud'>
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
    </>
  );
}
