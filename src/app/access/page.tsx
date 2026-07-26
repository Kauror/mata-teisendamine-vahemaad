'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuthBlockedSyncState, syncNow } from '@/lib/offline/syncEngine';

export default function AccessPage() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);

    try {
      const response = await fetch('/api/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.message || 'PIN ei sobi.');
      await clearAuthBlockedSyncState();
      void syncNow('manual:family-login');
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PIN ei sobi.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className='access-page'>
      <section className='access-card'>
        <div className='access-icon' aria-hidden>🔒</div>
        {/* The lock, the box and the arrow say enough on their own. The heading
            stays for screen readers and for the page's document outline, but is
            not drawn — the input carries the same name visibly to assistive
            tech via aria-label. */}
        <h1 className='sr-only'>Sisesta pere parool</h1>
        <form className='access-form' onSubmit={submit}>
          <input
            aria-label='Sisesta pere parool'
            autoComplete='current-password'
            autoFocus
            maxLength={128}
            type='password'
            value={pin}
            onChange={(event) => setPin(event.target.value)}
          />
          {error ? <p className='error' role='alert' aria-live='assertive'>{error}</p> : null}
          <button type='submit' aria-label={busy ? 'Kontrollin...' : 'Sisene'} disabled={busy || pin.length === 0}>{busy ? '…' : '→'}</button>
        </form>
      </section>
    </main>
  );
}
