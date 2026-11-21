'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

type Child = 'kiur' | 'kirsi';
const NAME: Record<Child, string> = { kiur: 'Kiur', kirsi: 'Kirsi' };
const OWNER: Record<Child, string> = { kiur: 'Kiuri', kirsi: 'Kirsi' };

function runsAsApp() {
  return window.matchMedia?.('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

// "See on Kirsi seade": the other child cannot open their pages here. They use
// their own device; a parent can switch a shared device with the password.
export default function WrongDevice({ owner, wanted }: { owner: Child | null; wanted: Child | null }) {
  const [switching, setSwitching] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const switchTo = async (event: FormEvent, binding: Child | 'both') => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const response = await fetch('/api/device/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, binding, app: runsAsApp() })
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.message || 'Seadet ei saanud vahetada.');
      // A full load, so every page reads the new binding.
      window.location.assign(binding === 'both' ? `/${wanted ?? ''}` : `/${binding}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Seadet ei saanud vahetada.');
      setBusy(false);
    }
  };

  return (
    <main className='container wrong-device-page'>
      <section className='wrong-device-card' role='alert' aria-labelledby='wrong-device-title'>
        <p className='wrong-device-icon' aria-hidden='true'>🔒</p>
        <h1 id='wrong-device-title'>{owner ? `See on ${OWNER[owner]} seade` : 'See pole sinu seade'}</h1>
        <p>
          {wanted ? `${NAME[wanted]} ei saa siin oma asju avada. Kasuta oma telefoni.` : 'Teise lapse asju siin avada ei saa. Kasuta oma telefoni.'}
        </p>
        <div className='wrong-device-actions'>
          {owner && <Link className='wrong-device-primary' href={`/${owner}`}>Ma olen {NAME[owner]} →</Link>}
          <Link className='wrong-device-secondary' href='/'>Avalehele</Link>
        </div>

        {!switching ? (
          <button type='button' className='wrong-device-switch' onClick={() => setSwitching(true)}>Vaheta seadet (vanema parool)</button>
        ) : (
          <form className='wrong-device-form' onSubmit={(event) => switchTo(event, wanted ?? 'both')}>
            <label htmlFor='wrong-device-password'>Vanema parool</label>
            <input id='wrong-device-password' type='password' autoComplete='current-password' value={password}
              onChange={(event) => setPassword(event.target.value)} autoFocus />
            {error && <p className='wrong-device-error' role='alert'>{error}</p>}
            <button type='submit' className='wrong-device-primary' disabled={busy || !password}>
              {wanted ? `Seo see seade lapsele ${NAME[wanted]}` : 'Seo mõlemale lapsele'}
            </button>
            {wanted && (
              <button type='button' className='wrong-device-secondary' disabled={busy || !password} onClick={(event) => switchTo(event, 'both')}>
                Jagatud seade (mõlemad lapsed)
              </button>
            )}
          </form>
        )}
      </section>
    </main>
  );
}
