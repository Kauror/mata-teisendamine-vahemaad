'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

export default function ParentLogin({ passwordMissing }: { passwordMissing: boolean }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/parent/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Sisselogimine ebaõnnestus.');
      }
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sisselogimine ebaõnnestus.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className='parent-card parent-login-card'>
      <h1>Lapsevanema ala</h1>
      {passwordMissing ? (
        <p className='error'>Arendajale: PARENT_PASSWORD puudub. Lisa see keskkonnamuutujana, et lapsevanema ala sisse lülitada.</p>
      ) : (
        <form className='parent-form' onSubmit={login}>
          <label>
            <span>Sisesta parool</span>
            <input type='password' value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          {error && <p className='error'>{error}</p>}
          <button type='submit' disabled={busy}>{busy ? 'Kontrollin...' : 'Sisene'}</button>
        </form>
      )}
    </section>
  );
}
