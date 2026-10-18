'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { formatStars } from '@/lib/formatStars';
import { starWord } from '@/lib/history';
import { useOffline } from '@/app/components/offline/OfflineProvider';
import { readPeekMode } from '@/app/components/usePeekMode';
import { PEEK_READ_ONLY_ACTION_MESSAGE } from '@/lib/peekMode';

// Buying, freezes and gifts spend the child's stars, so a peeking parent is
// stopped before the request (the server refuses it as well).
function refusedWhilePeeking(setError: (message: string) => void) {
  if (!readPeekMode()) return false;
  setError(PEEK_READ_ONLY_ACTION_MESSAGE);
  return true;
}

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
    if (refusedWhilePeeking(setError)) {
      setConfirmItem(null);
      return;
    }
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
    if (refusedWhilePeeking(setError)) return;
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
    if (refusedWhilePeeking(setError)) {
      setConfirmGift(false);
      return;
    }
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
  const latestPurchase = data?.purchases?.[0] ?? null;

  return (
    <main className='store-page'>
      <section className='store-shell' data-accent={learner === 'kiur' ? 'blue' : 'pink'}>
        {/* One row: back to the child, the title, the balance. */}
        <div className='store-top'>
          <Link className='practice-back-button store-back' href={dashboardHref(learner)}>← {childName(learner)}</Link>
          <h1>Pood</h1>
          <span className='store-balance' aria-label={`Sul on ${formatStars(balance)} ${starWord(formatStars(balance))}`}>⭐ {formatStars(balance)}</span>
        </div>

        {!online && <p className='offline-warning' role='status'>Poe andmed võivad olla viimase sünkroonimise seisuga. Ostmine ja kinkimine on võrguühenduseta keelatud.</p>}
        {error && <p className='error'>{error}</p>}

        {freeze && (
          <section className={freeze.canBuy ? 'freeze-card' : 'freeze-card disabled'} aria-label='Külmutus'>
            <span className='freeze-card-icon' aria-hidden>❄️</span>
            <div className='freeze-card-text'>
              <h2>Külmutus · sul on {freeze.held}/{freeze.maxHeld}</h2>
              <p>{freeze.canBuy || !freeze.blockedReason ? `Hoiab seeria alles, kui üks päev jääb vahele · ${freeze.price} ⭐` : freeze.blockedReason}</p>
            </div>
            <button type='button' className='store-buy' disabled={!online || !freeze.canBuy || freezeBusy} onClick={buyFreeze}>Osta</button>
          </section>
        )}

        {/* A plain list, dearest first: the price is what the children compare. */}
        <ul className='store-list' aria-label='Poe esemed'>
          {[...(data?.items ?? [])].sort((first, second) => second.price - first.price).map((item) => (
            <li key={item.id} className='store-row' data-can={item.canBuy}>
              <span className='store-row-main'>
                <strong>{item.title}</strong>
                {item.description && <small>{item.description}</small>}
                {item.stockType === 'fixed_stock' && <small>Alles: {item.fixedStockRemaining ?? 0}</small>}
                {item.stockType === 'daily_stock' && <small>Täna alles: {item.dailyRemaining ?? 0}</small>}
                {online && !item.canBuy && item.stateLabel && <small>{item.stateLabel}</small>}
              </span>
              <span className='store-price'>{item.price} ⭐</span>
              <button type='button' className='store-buy' disabled={!online || !item.canBuy} aria-label={`Osta ${item.title}`} onClick={() => online && item.canBuy && setConfirmItem(item)}>Osta</button>
            </li>
          ))}
          {data && data.items.length === 0 && <li className='store-empty'>Poes ei ole praegu esemeid.</li>}
        </ul>

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

        {/* The latest purchase on one line; the rest is in the child's history. */}
        <Link className='store-recent' href={`/history?child=${learner}`}>
          <span>{latestPurchase ? <>Hiljuti ostetud · {latestPurchase.titleSnapshot} · −{latestPurchase.priceSnapshot} ⭐</> : 'Oste veel ei ole'}</span>
          <span aria-hidden>›</span>
        </Link>
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
