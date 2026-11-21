'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParentApi } from './useParentApi';

// "See seade": whose device is this? (src/lib/auth/deviceBinding.ts)
// A phone bound to one child can act only for that child; a parent device
// may act for both. Unbound devices keep working until "nõua sidumist" is on.
// The server keeps a list of bound devices (src/lib/server/deviceRegistry.ts)
// so the parent can see which phones are bound and remove one.

type Binding = 'kiur' | 'kirsi' | 'both';
type Device = { id: string; binding: Binding; device: string; app: 'app' | 'browser' | 'unknown'; boundAt: string; lastSeenAt: string };
type State = { binding: Binding | null; required: boolean; devices: Device[]; thisDevice: string | null };

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

const APP_LABEL: Record<Device['app'], string> = { app: 'avaekraani äpp', browser: 'brauser', unknown: '' };

function when(iso: string) {
  return new Date(iso).toLocaleString('et-EE', { timeZone: 'Europe/Tallinn', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function runsAsApp() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

// On iPhone/iPad the home-screen app and Safari keep separate cookies: a phone
// bound in Safari is still unbound in the app the child actually uses.
function iosBrowserTab() {
  if (typeof navigator === 'undefined') return false;
  return /iPhone|iPad/.test(navigator.userAgent) && !runsAsApp();
}

function normalise(value: Partial<State> | null): State | null {
  if (!value) return null;
  return { binding: value.binding ?? null, required: Boolean(value.required), devices: Array.isArray(value.devices) ? value.devices : [], thisDevice: value.thisDevice ?? null };
}

function useDeviceBinding() {
  const api = useParentApi();
  const [state, setState] = useState<State | null>(null);
  useEffect(() => {
    let cancelled = false;
    void api.getJson<State>('/api/parent/device-binding')
      .then((value) => { if (!cancelled) setState(normalise(value)); })
      .catch(() => { if (!cancelled) setState(null); });
    return () => { cancelled = true; };
  }, [api]);
  return { api, state, setState };
}

function childStatus(devices: Device[], child: 'kiur' | 'kirsi') {
  const n = devices.filter((d) => d.binding === child).length;
  const name = child === 'kiur' ? 'Kiur' : 'Kirsi';
  return n > 0 ? `${name} ✓ ${n === 1 ? '1 seade' : `${n} seadet`}` : `${name}: pole seotud`;
}

// Täna: whether the children's phones are bound, until everything is in place.
export function DeviceBindingNotice() {
  const { state } = useDeviceBinding();
  if (!state) return null;
  const bothBound = (['kiur', 'kirsi'] as const).every((c) => state.devices.some((d) => d.binding === c));
  if (bothBound && state.required && state.binding !== null) return null;
  return (
    <div className='pv-card device-binding-notice' role='status'>
      <p><strong>Telefonid:</strong> {childStatus(state.devices, 'kiur')} · {childStatus(state.devices, 'kirsi')} · nõua sidumist {state.required ? 'sees' : 'väljas'}</p>
      {state.binding === null && <p>See seade pole seotud.</p>}
      <p className='pv-hint'>
        {bothBound
          ? 'Kõik lapsed on seotud. Lülita Seaded → „See seade“ all sisse „Nõua sidumist“, siis ei saa sidumata seade laste eest midagi muuta.'
          : 'Seo iga lapse telefon: ava lapse telefonis Harjutaja (iPhone’is avaekraani äpp, mitte Safari), Vanem → Seaded → „See seade“.'}
      </p>
    </div>
  );
}

export function DeviceBindingPanel() {
  const { api, state, setState } = useDeviceBinding();
  const [iosTab, setIosTab] = useState(false);
  useEffect(() => { setIosTab(iosBrowserTab()); }, []);

  const save = useCallback((body: Record<string, unknown>, done: string) => api.guarded(async () => {
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
    setState(normalise(payload));
    api.setNotice(done);
  }), [api, setState]);

  if (!state) return <section className='parent-card'><p>Laadin...</p></section>;

  return (
    <section className='parent-card device-binding-card'>
      <p className='pv-hint'>See seade praegu: <strong>{bindingLabel(state.binding)}</strong></p>
      {iosTab && (
        <p className='offline-warning' role='alert'>
          Oled Safaris. iPhone’is hoiab avaekraani Harjutaja äpp oma sidumist eraldi — seo telefon avaekraani äpis, mida laps kasutab.
        </p>
      )}
      <div className='pv-chips' role='group' aria-label='Kelle seade see on'>
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type='button'
            className='pv-chip'
            aria-pressed={state.binding === option.value}
            onClick={() => void save({ binding: option.value, app: runsAsApp() }, `Seade on nüüd: ${bindingLabel(option.value)}.`)}
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

      <div className='device-binding-list'>
        <h3>Seotud seadmed</h3>
        <p className='pv-hint'>{childStatus(state.devices, 'kiur')} · {childStatus(state.devices, 'kirsi')}</p>
        {state.devices.length === 0 ? <p className='pv-hint'>Ühtegi seadet pole veel seotud (või seoti enne seda nimekirja — seo need uuesti).</p> : (
          <ul>
            {state.devices.map((device) => (
              <li key={device.id}>
                <div>
                  <strong>{bindingLabel(device.binding)}</strong>
                  {device.id === state.thisDevice && <span className='device-binding-this'> (see seade)</span>}
                  <small>{[device.device, APP_LABEL[device.app]].filter(Boolean).join(', ')} · seotud {when(device.boundAt)} · viimati {when(device.lastSeenAt)}</small>
                </div>
                <button type='button' className='pv-btn' data-k='no' aria-label={`Eemalda ${bindingLabel(device.binding)} (${device.device})`}
                  onClick={() => void save({ remove: device.id }, 'Seade on nimekirjast eemaldatud; selle sidumine enam ei kehti.')}>Eemalda</button>
              </li>
            ))}
          </ul>
        )}
      </div>

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
