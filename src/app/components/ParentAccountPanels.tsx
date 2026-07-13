'use client';

import { useEffect, useState, type FormEvent } from 'react';

type ParentRequest = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

type PanelProps = {
  request: ParentRequest;
  onError: (message: string) => void;
  onNotice: (message: string) => void;
};

export function ParentPasswordPanel({ request, onError, onNotice }: PanelProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [nextPassword, setNextPassword] = useState('');

  const changePassword = async (event: FormEvent) => {
    event.preventDefault();
    onError('');
    onNotice('');
    try {
      const response = await request('/api/parent/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, nextPassword })
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        onError(body.message || 'Parooli ei saanud muuta.');
        return;
      }
      setCurrentPassword('');
      setNextPassword('');
      onNotice('Parool muudetud.');
    } catch {
      onError('Parooli ei saanud muuta.');
    }
  };

  return (
    <section className='parent-card'>
      <form className='parent-form parent-task-form' onSubmit={changePassword}>
        <label><span>Praegune parool</span><input type='password' value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label>
        <label><span>Uus parool</span><input type='password' value={nextPassword} onChange={(event) => setNextPassword(event.target.value)} /></label>
        <button type='submit'>Muuda parool</button>
      </form>
    </section>
  );
}

export function ParentNoticePanel({ request, onError, onNotice }: PanelProps) {
  const [noticeText, setNoticeText] = useState('');

  useEffect(() => {
    let cancelled = false;
    void request('/api/notice')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((body) => {
        if (!cancelled) setNoticeText(typeof body?.text === 'string' ? body.text : '');
      })
      .catch(() => {
        if (!cancelled) onError('Teateid ja reegleid ei saanud laadida.');
      });
    return () => {
      cancelled = true;
    };
  }, [onError, request]);

  const saveNotice = async (event: FormEvent) => {
    event.preventDefault();
    onError('');
    onNotice('');
    try {
      const response = await request('/api/parent/notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: noticeText })
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        onError(body.message || 'Teksti ei saanud salvestada.');
        return;
      }
      setNoticeText(typeof body.text === 'string' ? body.text : '');
      onNotice('Teated ja reeglid salvestatud.');
    } catch {
      onError('Teksti ei saanud salvestada.');
    }
  };

  return (
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
  );
}
