'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

type Learner = 'kiur' | 'kirsi';

type StoreItem = {
  id: number;
  title: string;
  description: string | null;
  price: number;
  stockType: string;
  fixedStockRemaining: number | null;
  dailyStockLimit: number | null;
  dailyRemaining: number | null;
  stateLabel: string;
  canBuy: boolean;
  missingStars: number;
};

type Purchase = {
  id: number;
  titleSnapshot: string;
  priceSnapshot: number;
  purchasedAt: string;
  balanceAfterPurchase: number;
};

type StoreData = {
  balance: number;
  items: StoreItem[];
  purchases: Purchase[];
};

function childName(learner: Learner) {
  return learner === 'kiur' ? 'Kiur' : 'Kirsi';
}

function dashboardHref(learner: Learner) {
  return learner === 'kiur' ? '/kiur' : '/kirsi';
}

function timeLabel(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString('et-EE') + ' ' + date.toLocaleTimeString('et-EE', { hour: '2-digit', minute: '2-digit' });
}

function stars(value: number) {
  return Number.isInteger(value) ? String(value) : value.toLocaleString('et-EE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export default function ChildStorePage({ learner }: { learner: Learner }) {
  const [data, setData] = useState<StoreData | null>(null);
  const [error, setError] = useState('');
  const [confirmItem, setConfirmItem] = useState<StoreItem | null>(null);
  const [success, setSuccess] = useState<{ title: string; price: number; balanceAfter: number } | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setError('');
    fetch(`/api/store/child?learner=${learner}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError('Poodi ei saanud laadida.'));
  }, [learner]);

  useEffect(() => {
    load();
  }, [load]);

  const buy = async () => {
    if (!confirmItem) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/store/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ learner, itemId: confirmItem.id })
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || 'Ostu ei saanud teha.');
      setSuccess({ title: body.title, price: body.price, balanceAfter: body.balanceAfter });
      setConfirmItem(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ostu ei saanud teha.');
    } finally {
      setBusy(false);
    }
  };

  const balance = data?.balance ?? 0;

  return (
    <main className='store-page'>
      <section className='store-shell'>
        <Link className='practice-back-button' href={dashboardHref(learner)}>← Tagasi</Link>
        <header className='store-header'>
          <div>
            <h1>Pood</h1>
            <p>{childName(learner)}</p>
          </div>
          <div className='store-balance'>⭐ {stars(balance)} tähte</div>
        </header>

        <Link className='history-link' href='/history'>📄 Vaata ajalugu</Link>
        {error && <p className='error'>{error}</p>}

        <section className='store-grid'>
          {(data?.items ?? []).map((item) => (
            <article key={item.id} className={item.canBuy ? 'store-item-card' : 'store-item-card disabled'}>
              <h2>{item.title}</h2>
              {item.description && <p>{item.description}</p>}
              <div className='store-item-meta'>
                <span>Hind: {item.price} ⭐</span>
                {item.stockType === 'fixed_stock' && <span>Alles: {item.fixedStockRemaining ?? 0}</span>}
                {item.stockType === 'daily_stock' && <span>Täna alles: {item.dailyRemaining ?? 0}</span>}
              </div>
              <button type='button' disabled={!item.canBuy} onClick={() => item.canBuy && setConfirmItem(item)}>
                {item.canBuy ? 'Osta' : item.stateLabel}
              </button>
            </article>
          ))}
          {data && data.items.length === 0 && <p>Poes ei ole praegu esemeid.</p>}
        </section>

        <section className='store-recent'>
          <h2>Hiljuti ostetud</h2>
          {(data?.purchases ?? []).map((purchase) => (
            <p key={purchase.id}><strong>{purchase.titleSnapshot}</strong><span>-{purchase.priceSnapshot} ⭐ · {timeLabel(purchase.purchasedAt)}</span></p>
          ))}
          {data && data.purchases.length === 0 && <p>Oste veel ei ole.</p>}
        </section>
      </section>

      {confirmItem && (
        <div className='task-modal-backdrop' role='dialog' aria-modal='true'>
          <div className='task-modal'>
            <h2>Kas ostad selle?</h2>
            <p>{confirmItem.title}</p>
            <span>Hind: {confirmItem.price} ⭐</span>
            <span>Sul on praegu: {stars(balance)} ⭐</span>
            <strong>Pärast ostu jääb: {stars(balance - confirmItem.price)} ⭐</strong>
            <div className='task-modal-actions'>
              <button type='button' className='filter-chip' onClick={() => setConfirmItem(null)}>Ei</button>
              <button type='button' disabled={busy} onClick={buy}>Jah, ostan</button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className='task-modal-backdrop' role='dialog' aria-modal='true'>
          <div className='task-modal'>
            <h2>Ost tehtud!</h2>
            <p>Ostsid: {success.title}</p>
            <span>Kulutasid: {success.price} ⭐</span>
            <strong>Alles: {stars(success.balanceAfter)} ⭐</strong>
            <button type='button' onClick={() => setSuccess(null)}>Selge</button>
          </div>
        </div>
      )}
    </main>
  );
}
