'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParentApi } from './useParentApi';

// "See seade": whose device is this? (src/lib/auth/deviceBinding.ts)
// A phone bound to one child can act only for that child; a parent device
// may act for both. Unbound devices keep working until "nõua sidumist" is on.

type Binding = 'kiur' | 'kirsi' | 'both';
type State = { binding: Binding | null; required: boolean };

const OPTIONS: Array<{ value: Binding; label: string }> = [
  { value: 'kiur', label: 'Kiuri telefon' },
  { value: 'kirsi', label: 'Kirsi telefon' },
  { value: 'both', label: 'Vanema seade' }
];

export function bindingLabel(binding: Binding | null) {
  if (binding === 'kiur') return 'Kiuri seade';
  if (binding === 'kirsi') return 'Kirsi seade';
  if (binding === 'both') return 'Vanema seade (mõlemad lapsed)';
  return 'Sidumata';
}

function useDeviceBinding() {
  const api = useParentApi();
  const [state, setState] = useState<State | null>(null);
  useEffect(() => {
    let cancelled = false;
    void api.getJson<State>('/api/parent/device-binding')
      .then((value) => { if (!cancelled) setState(value); })
      .catch(() => { if (!cancelled) setState(null); });
    return () => { cancelled = true; };
  }, [api]);
  return { api, state, setState };
}

// Shown on Täna while this device is unbound: binding is recommended.
export function DeviceBindingNotice() {
  const { state } = useDeviceBinding();
  if (!state || state.binding !== null) return null;
  return (
    <p className='pv-card device-binding-notice' role='status'>
      See seade pole lapsega seotud. Soovitame iga telefoni siduda: Seaded → „See seade“. Siis saab Kiuri telefon teha
      tegevusi ainult Kiuri eest ja Kirsi telefon ainult Kirsi eest.
    </p>
  );
}

export function DeviceBindingPanel() {
  const { api, state, setState } = useDeviceBinding();

  const save = useCallback((body: Partial<{ binding: Binding | null; required: boolean }>, done: string) => api.guarded(async () => {
    const response = await api.request('/api/parent/device-binding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const payload = await response.json().catch(() => ({})) as Partial<State> & { message?: string };
    if (!response.ok) {
      api.setError(payload.message || 'Seadet ei saanud salvestada.');
      return;
    }
    setState({ binding: payload.binding ?? null, required: Boolean(payload.required) });
    api.setNotice(done);
  }), [api, setState]);

  if (!state) return <section className='parent-card'><p>Laadin...</p></section>;

  return (
    <section className='parent-card device-binding-card'>
      <p className='pv-hint'>See seade praegu: <strong>{bindingLabel(state.binding)}</strong></p>
      <div className='pv-chips' role='group' aria-label='Kelle seade see on'>
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type='button'
            className='pv-chip'
            aria-pressed={state.binding === option.value}
            onClick={() => void save({ binding: option.value }, `Seade on nüüd: ${bindingLabel(option.value)}.`)}
          >{option.label}</button>
        ))}
      </div>
      <p className='pv-hint'>
        Seo see seade, kui oled lapse telefonis Vanema lehel sisse logitud. Lapse telefon saab siis tähti kulutada, kinkida
        ja harjutada ainult selle lapse eest. Teise lapse lehed avanevad selle lapse lehena.
      </p>
      {state.binding !== null && (
        <button type='button' className='pv-btn' data-k='no' onClick={() => void save({ binding: null }, 'Seade on sidumata.')}>Eemalda sidumine</button>
      )}
      <label className='parent-checkbox'>
        <input
          type='checkbox'
          checked={state.required}
          onChange={(event) => void save({ required: event.target.checked }, event.target.checked ? 'Sidumata seadmed ei saa enam laste eest midagi muuta.' : 'Sidumata seadmed töötavad nagu varem.')}
        />
        <span>Nõua sidumist: sidumata seade ei saa laste eest midagi muuta (lülita sisse, kui kõik telefonid on seotud)</span>
      </label>
    </section>
  );
}
