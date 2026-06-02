'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

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
        <h1>Sisesta PIN</h1>
        <form className='access-form' onSubmit={submit}>
          <label>
            <span>PIN</span>
            <input
              autoComplete='off'
              autoFocus
              inputMode='numeric'
              maxLength={4}
              pattern='[0-9]*'
              type='password'
              value={pin}
              onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))}
            />
          </label>
          {error ? <p className='error'>{error}</p> : null}
          <button type='submit' disabled={busy || pin.length !== 4}>{busy ? 'Kontrollin...' : 'Sisene'}</button>
        </form>
      </section>
    </main>
  );
}
