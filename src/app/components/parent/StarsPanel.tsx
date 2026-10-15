'use client';

import { useState } from 'react';
import { formatStars } from '@/lib/formatStars';
import { ADJUST_KINDS, adjustMagnitude, adjustmentNotice, learnerAccent, learnerLabel, type AdjustKind } from './format';
import { failureMessage, jsonInit } from './parentApi';
import { LEARNERS, type Dashboard, type Learner, type MonthlyPrize, type StreakFreezes } from './types';
import { useParentApi, useParentResource } from './useParentApi';

// "Tähed ja karikad": balances, this month's trophies and streak freezes, each
// with its ± controls. A star change refreshes the balances (shared with the
// approvals panel) and the weekly digest; a trophy change the monthly standing.
export function StarsPanel() {
  const api = useParentApi();
  const { data: dashboard } = useParentResource<Dashboard>('dashboard');
  const { data: monthlyPrize } = useParentResource<MonthlyPrize>('monthly');
  const { data: streakFreezes } = useParentResource<StreakFreezes>('freeze');
  const [adjustAmount, setAdjustAmount] = useState('1');
  const [adjustReason, setAdjustReason] = useState('');

  const submitAdjustment = (kind: AdjustKind, learner: Learner, direction: 1 | -1) => api.guarded(async () => {
    api.setError('');
    api.setNotice('');
    const magnitude = adjustMagnitude(adjustAmount);
    const config = ADJUST_KINDS[kind];
    const res = await api.request(config.url, jsonInit('POST', { learner, amount: magnitude * direction, reason: adjustReason }));
    if (!res.ok) {
      api.setError(await failureMessage(res, config.fail));
      return;
    }
    setAdjustReason('');
    api.setNotice(adjustmentNotice(kind, learner, direction, magnitude));
    api.bus.after(kind === 'points' ? 'starAdjust' : 'trophyAdjust');
  });

  // Hands a child a freeze for a day that genuinely was not their fault -
  // illness, travel. Free to the child, and still capped by the hold limit.
  const grantStreakFreeze = (learner: Learner) => api.guarded(async () => {
    api.setError('');
    api.setNotice('');
    const res = await api.request('/api/parent/streak-freeze', jsonInit('POST', { learner }));
    if (!res.ok) {
      api.setError(await failureMessage(res, 'Külmutust ei saanud anda.'));
      return;
    }
    api.setNotice(`${learnerLabel(learner)} sai ühe külmutuse.`);
    api.bus.after('freezeGrant');
  });

  return (
    <section className='parent-card parent-adjust-card'>
      <div className='parent-form parent-adjust-controls'>
        <label className='parent-adjust-amount'><span>Kogus</span><input type='number' inputMode='numeric' min={1} step={1} value={adjustAmount} onChange={(event) => { const next = event.target.value; if (next === '' || /^\d+$/.test(next)) setAdjustAmount(next); }} onBlur={() => setAdjustAmount(String(adjustMagnitude(adjustAmount)))} /></label>
        <label className='parent-adjust-reason-field'><span>Põhjus (valikuline)</span><input value={adjustReason} onChange={(event) => setAdjustReason(event.target.value)} placeholder='boonus' /></label>
      </div>
      <div className='parent-adjust-grid'>
        <div className='parent-adjust-block'>
          <h3>⭐ Tähed</h3>
          {LEARNERS.map((child) => (
            <div key={child} className='parent-adjust-row' data-accent={learnerAccent(child)}>
              <span className='parent-adjust-name'>{learnerLabel(child)}</span>
              <strong className='parent-adjust-value'>{formatStars(dashboard?.balances[child] ?? 0)}</strong>
              <div className='parent-stepper'>
                <button type='button' className='parent-step-minus' aria-label={`Eemalda ${learnerLabel(child)}lt tähti`} onClick={() => submitAdjustment('points', child, -1)}>−</button>
                <button type='button' className='parent-step-plus' aria-label={`Lisa ${learnerLabel(child)}le tähti`} onClick={() => submitAdjustment('points', child, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
        <div className='parent-adjust-block'>
          <h3>🏆 Karikad</h3>
          {LEARNERS.map((child) => (
            <div key={child} className='parent-adjust-row' data-accent={learnerAccent(child)}>
              <span className='parent-adjust-name'>{learnerLabel(child)}</span>
              <strong className='parent-adjust-value'>{(child === 'kiur' ? monthlyPrize?.standing.kiurTrophies : monthlyPrize?.standing.kirsiTrophies) ?? 0}</strong>
              <div className='parent-stepper'>
                <button type='button' className='parent-step-minus' aria-label={`Eemalda ${learnerLabel(child)}lt karikaid`} onClick={() => submitAdjustment('trophies', child, -1)}>−</button>
                <button type='button' className='parent-step-plus' aria-label={`Lisa ${learnerLabel(child)}le karikaid`} onClick={() => submitAdjustment('trophies', child, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
        <div className='parent-adjust-block'>
          <h3>❄️ Külmutused</h3>
          <p className='parent-adjust-hint'>Üks vahele jäänud päev ei katkesta õpiseeriat. Laps ostab ise {streakFreezes?.kiur.price ?? 10} tähe eest — anna tasuta siis, kui päev jäi ära haiguse või reisi tõttu.</p>
          {LEARNERS.map((child) => {
            const state = streakFreezes?.[child];
            return (
              <div key={child} className='parent-adjust-row' data-accent={learnerAccent(child)}>
                <span className='parent-adjust-name'>{learnerLabel(child)}</span>
                <strong className='parent-adjust-value'>{state ? `${state.held}/${state.maxHeld}` : '–'}</strong>
                <div className='parent-stepper'>
                  <button
                    type='button'
                    className='parent-step-plus'
                    disabled={!state || state.held >= state.maxHeld}
                    aria-label={`Anna ${learnerLabel(child)}le tasuta külmutus`}
                    onClick={() => grantStreakFreeze(child)}
                  >+</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
