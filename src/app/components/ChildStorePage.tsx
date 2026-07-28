'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { formatStars } from '@/lib/formatStars';
import { starWord } from '@/lib/history';
import { useOffline } from '@/app/components/offline/OfflineProvider';

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

type StreakFreezeState = {
  held: number;
  maxHeld: number;
  price: number;
  canBuy: boolean;
  blockedReason: string | null;
};

type StoreData = {
  balance: number;
  items: StoreItem[];
  purchases: Purchase[];
  streakFreeze: StreakFreezeState;
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

export default function ChildStorePage({ learner }: { learner: Learner }) {
  const { online } = useOffline();
  const [data, setData] = useState<StoreData | null>(null);
  const [error, setError] = useState('');
  const [confirmItem, setConfirmItem] = useState<StoreItem | null>(null);
  const [success, setSuccess] = useState<{ title: string; price: number; balanceAfter: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const recipient: Learner = learner === 'kiur' ? 'kirsi' : 'kiur';
  const [giftAmount, setGiftAmount] = useState('1');
  const [confirmGift, setConfirmGift] = useState(false);
  const [giftSuccess, setGiftSuccess] = useState<{ amount: number; balanceAfter: number } | null>(null);
  const [giftBusy, setGiftBusy] = useState(false);
  const [freezeBusy, setFreezeBusy] = useState(false);

  const load = useCallback(() => {
    setError('');
    fetch(`/api/store/child?learner=${learner}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError('Pood on võrguühenduseta ainult vaatamiseks. Ostu või kingituse tegemiseks taasta internetiühendus.'));
  }, [learner]);

  useEffect(() => {
    load();
  }, [load]);

  const buy = async () => {
    if (!confirmItem) return;
    if (!online) {
      setConfirmItem(null);
      setError('Ostu ei saadetud. Ostu tegemiseks taasta internetiühendus.');
      return;
    }
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

  const buyFreeze = async () => {
    if (!online) {
      setError('Ostu ei saadetud. Ostu tegemiseks taasta internetiühendus.');
      return;
    }
    setFreezeBusy(true);
    setError('');
    try {
      const res = await fetch('/api/store/freeze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ learner })
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || 'Ostu ei saanud teha.');
      setSuccess({ title: 'Külmutus ❄️', price: freeze?.price ?? 0, balanceAfter: body.balance });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ostu ei saanud teha.');
    } finally {
      setFreezeBusy(false);
    }
  };

  const sendGift = async () => {
    if (!online) {
      setConfirmGift(false);
      setError('Kingitust ei saadetud. Kinkimiseks taasta internetiühendus.');
      return;
    }
    setGiftBusy(true);
    setError('');
    try {
      const res = await fetch('/api/store/gift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: learner, to: recipient, amount: giftValue })
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || 'Kinkimine ebaõnnestus.');
      setGiftSuccess({ amount: giftValue, balanceAfter: body.balance });
      setConfirmGift(false);
      setGiftAmount('1');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kinkimine ebaõnnestus.');
      setConfirmGift(false);
    } finally {
      setGiftBusy(false);
    }
  };

  const balance = data?.balance ?? 0;
  const freeze = data?.streakFreeze ?? null;
  const recipientName = childName(recipient);
  const giftValue = Math.floor(Number(giftAmount)) || 0;
  const canGift = giftValue >= 1 && giftValue <= balance;

  return (
    <main className='store-page'>
      <section className='store-shell' data-accent={learner === 'kiur' ? 'blue' : 'pink'}>
        <Link className='practice-back-button' href={dashboardHref(learner)}>← Tagasi</Link>
        <header className='store-header'>
          <div>
            <h1>Pood</h1>
            <p>{childName(learner)}</p>
          </div>
          <div className='store-balance'>⭐ {formatStars(balance)} {starWord(formatStars(balance))}</div>
        </header>

        <Link className='history-link' href='/history'>📄 Ajalugu</Link>
        {!online && <p className='offline-warning' role='status'>Poe andmed võivad olla viimase sünkroonimise seisuga. Ostmine ja kinkimine on võrguühenduseta keelatud.</p>}
        {error && <p className='error'>{error}</p>}

        {freeze && (
          <article className={freeze.canBuy ? 'freeze-card' : 'freeze-card disabled'}>
            <div className='freeze-card-text'>
              <h2><span aria-hidden>❄️</span> Külmutus</h2>
              <p>Hoiab su õpiseeria alles, kui üks päev jääb harjutamata. Osta enne, kui vaja läheb.</p>
              <div className='freeze-card-meta'>
                <span>Hind: {freeze.price} ⭐</span>
                <span>Sul on: {freeze.held}/{freeze.maxHeld}</span>
              </div>
            </div>
            <button type='button' disabled={!online || !freeze.canBuy || freezeBusy} onClick={buyFreeze}>
              {!online ? 'Vajab internetiühendust' : freeze.canBuy ? 'Osta külmutus' : freeze.blockedReason}
            </button>
          </article>
        )}

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
              <button type='button' disabled={!online || !item.canBuy} onClick={() => online && item.canBuy && setConfirmItem(item)}>
                {!online ? 'Vajab internetiühendust' : item.canBuy ? 'Osta' : item.stateLabel}
              </button>
            </article>
          ))}
          {data && data.items.length === 0 && <p>Poes ei ole praegu esemeid.</p>}
        </section>

        <details className='store-gift'>
          <summary className='store-gift-summary'>🎁 Kingi tähti {recipientName}le</summary>
          <div className='store-gift-body'>
            <p>Sinu tähed lähevad {recipientName}le. Sinul väheneb, {recipientName}l suureneb.</p>
            <div className='store-gift-row'>
              <input
                type='number'
                inputMode='numeric'
                min={1}
                max={balance > 0 ? balance : 1}
                value={giftAmount}
                onChange={(event) => {
                  const next = event.target.value;
                  if (next === '' || /^\d+$/.test(next)) setGiftAmount(next);
                }}
                onBlur={() => setGiftAmount(String(Math.max(1, giftValue)))}
                aria-label='Kingitavate tähtede arv'
              />
              <button type='button' disabled={!online || !canGift} onClick={() => setConfirmGift(true)}>Kingi {recipientName}le</button>
            </div>
            {giftValue > balance && <small className='store-gift-warning'>Sul ei ole nii palju tähti.</small>}
          </div>
        </details>

        <section className='store-recent'>
          <h2>Hiljuti ostetud</h2>
          {(data?.purchases ?? []).map((purchase) => (
            <p key={purchase.id}><strong>{purchase.titleSnapshot}</strong><span>-{purchase.priceSnapshot} ⭐ · {timeLabel(purchase.purchasedAt)}</span></p>
          ))}
          {data && data.purchases.length === 0 && <p>Oste veel ei ole.</p>}
        </section>
      </section>

      {confirmItem && (
        <div className='task-modal-backdrop' role='dialog' aria-modal='true' aria-labelledby='purchase-confirm-title'>
          <div className='task-modal'>
            <h2 id='purchase-confirm-title'>Kas ostad selle?</h2>
            <p>{confirmItem.title}</p>
            <span>Hind: {confirmItem.price} ⭐</span>
            <span>Sul on praegu: {formatStars(balance)} ⭐</span>
            <strong>Pärast ostu jääb: {formatStars(balance - confirmItem.price)} ⭐</strong>
            <div className='task-modal-actions'>
              <button type='button' className='filter-chip' autoFocus onClick={() => setConfirmItem(null)}>Ei</button>
              <button type='button' disabled={!online || busy} onClick={buy}>Jah, ostan</button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className='task-modal-backdrop' role='dialog' aria-modal='true' aria-labelledby='purchase-success-title'>
          <div className='task-modal'>
            <h2 id='purchase-success-title'>Ost tehtud!</h2>
            <p>Ostsid: {success.title}</p>
            <span>Kulutasid: {success.price} ⭐</span>
            <strong>Alles: {formatStars(success.balanceAfter)} ⭐</strong>
            <button type='button' autoFocus onClick={() => setSuccess(null)}>Selge</button>
          </div>
        </div>
      )}

      {confirmGift && (
        <div className='task-modal-backdrop' role='dialog' aria-modal='true' aria-labelledby='gift-confirm-title'>
          <div className='task-modal'>
            <h2 id='gift-confirm-title'>Kas kingid {recipientName}le?</h2>
            <span>Kingitus: {giftValue} ⭐</span>
            <span>Sul on praegu: {formatStars(balance)} ⭐</span>
            <strong>Pärast kinkimist jääb: {formatStars(balance - giftValue)} ⭐</strong>
            <div className='task-modal-actions'>
              <button type='button' className='filter-chip' autoFocus onClick={() => setConfirmGift(false)}>Ei</button>
              <button type='button' disabled={!online || giftBusy} onClick={sendGift}>Jah, kingin</button>
            </div>
          </div>
        </div>
      )}

      {giftSuccess && (
        <div className='task-modal-backdrop' role='dialog' aria-modal='true' aria-labelledby='gift-success-title'>
          <div className='task-modal'>
            <h2 id='gift-success-title'>Kingitud! 🎁</h2>
            <p>Kinkisid {recipientName}le {giftSuccess.amount} ⭐</p>
            <strong>Sul on alles: {formatStars(giftSuccess.balanceAfter)} ⭐</strong>
            <button type='button' autoFocus onClick={() => setGiftSuccess(null)}>Selge</button>
          </div>
        </div>
      )}
    </main>
  );
}
