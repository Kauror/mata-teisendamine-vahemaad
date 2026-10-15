'use client';

import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { formatStars } from '@/lib/formatStars';
import { dayWord } from '@/lib/history';
import { learnerLabel, REWARD_SCOPE_LABELS, rewardsSummary } from './format';
import { failureMessage, jsonInit } from './parentApi';
import type { MonthlyPrize, RewardLearnerScope, RewardRule } from './types';
import { useParentApi, useParentResource, useParentSaving } from './useParentApi';

const emptyRewardForm = {
  thresholdDays: 5,
  rewardStars: 5,
  learnerScope: 'both' as RewardLearnerScope,
  enabled: true
};

const rulesFrom = (body: unknown) => {
  const rules = (body as { rules?: unknown } | null)?.rules;
  return Array.isArray(rules) ? rules as RewardRule[] : [];
};

// "Auhinnad": the monthly competition prize and the streak reward rules.
export function RewardsPanel({ onSummary }: { onSummary: (summary: string) => void }) {
  const api = useParentApi();
  const saving = useParentSaving();
  const { data: monthlyPrize, setData: setMonthlyPrize } = useParentResource<MonthlyPrize>('monthly');
  const { data: rules, setData: setRewardRules } = useParentResource('rewards', rulesFrom);
  const rewardRules = rules ?? [];
  const [rewardForm, setRewardForm] = useState(emptyRewardForm);
  const [editingRewardId, setEditingRewardId] = useState<number | null>(null);
  const [monthlyPrizeInput, setMonthlyPrizeInput] = useState(10);
  // A refresh (a trophy changed elsewhere) must not overwrite a prize the
  // parent is typing: the field takes the server value only while untouched.
  const monthlyPrizeDirty = useRef(false);

  useEffect(() => {
    if (monthlyPrize && !monthlyPrizeDirty.current) setMonthlyPrizeInput(monthlyPrize.prizeStars ?? 10);
  }, [monthlyPrize]);

  const ruleCount = rules?.length ?? null;
  useEffect(() => {
    if (ruleCount !== null) onSummary(rewardsSummary(ruleCount));
  }, [onSummary, ruleCount]);

  const resetRewardForm = () => {
    setEditingRewardId(null);
    setRewardForm(emptyRewardForm);
  };

  const editRewardRule = (rule: RewardRule) => {
    setEditingRewardId(rule.id);
    setRewardForm({ thresholdDays: rule.thresholdDays, rewardStars: rule.rewardStars, learnerScope: rule.learnerScope, enabled: rule.enabled });
    api.setNotice('');
    api.setError('');
  };

  const saveRewardRule = (event: FormEvent) => {
    event.preventDefault();
    return api.guarded(async () => {
      api.setError('');
      api.setNotice('');
      const url = editingRewardId ? `/api/parent/reward-rules/${editingRewardId}` : '/api/parent/reward-rules';
      const res = await api.request(url, jsonInit(editingRewardId ? 'PUT' : 'POST', { ...rewardForm, type: 'learning_streak' }));
      if (!res.ok) {
        api.setError(await failureMessage(res, 'Auhinda ei saanud salvestada.'));
        return;
      }
      const body = await res.json().catch(() => ({})) as { rules?: unknown };
      if (Array.isArray(body.rules)) setRewardRules(body.rules as RewardRule[]);
      api.setNotice(editingRewardId ? 'Auhind muudetud.' : 'Auhind lisatud.');
      resetRewardForm();
    });
  };

  const deleteRewardRule = async (id: number) => {
    if (typeof window !== 'undefined' && !window.confirm('Kas kustutada see auhind?')) return;
    await api.guarded(async () => {
      api.setError('');
      api.setNotice('');
      const res = await api.request(`/api/parent/reward-rules/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        api.setError(await failureMessage(res, 'Auhinda ei saanud kustutada.'));
        return;
      }
      const body = await res.json().catch(() => ({})) as { rules?: unknown };
      if (Array.isArray(body.rules)) setRewardRules(body.rules as RewardRule[]);
      if (editingRewardId === id) resetRewardForm();
      api.setNotice('Auhind kustutatud.');
    });
  };

  const toggleRewardEnabled = (rule: RewardRule) => api.guarded(async () => {
    api.setError('');
    api.setNotice('');
    const res = await api.request(`/api/parent/reward-rules/${rule.id}`, jsonInit('PUT', { thresholdDays: rule.thresholdDays, rewardStars: rule.rewardStars, learnerScope: rule.learnerScope, enabled: !rule.enabled, type: 'learning_streak' }));
    if (!res.ok) {
      api.setError(await failureMessage(res, 'Auhinda ei saanud muuta.'));
      return;
    }
    const body = await res.json().catch(() => ({})) as { rules?: unknown };
    if (Array.isArray(body.rules)) setRewardRules(body.rules as RewardRule[]);
  });

  const saveMonthlyPrize = (event: FormEvent) => {
    event.preventDefault();
    return api.guarded(async () => {
      api.setError('');
      api.setNotice('');
      const res = await api.request('/api/parent/monthly-prize', jsonInit('POST', { prizeStars: monthlyPrizeInput }));
      if (!res.ok) {
        api.setError(await failureMessage(res, 'Auhinda ei saanud salvestada.'));
        return;
      }
      const body = await res.json().catch(() => null) as MonthlyPrize | null;
      monthlyPrizeDirty.current = false;
      if (body) setMonthlyPrize(body);
      setMonthlyPrizeInput(body?.prizeStars ?? monthlyPrizeInput);
      api.setNotice('Kuu auhind salvestatud.');
    });
  };

  return (
    <>
      <section className='parent-card'>
        <h3>🏆 Kuu võistlus</h3>
        <p>Iga päev saab rohkem ülesandeid lahendanud laps ühe karika. Kuu lõpus võidab see, kellel on rohkem karikaid, ja saab auhinnaks tähed. Auhind makstakse välja automaatselt uue kuu esimesel päeval. Viigi korral auhinda ei anta.</p>
        <form className='parent-form parent-task-form' onSubmit={saveMonthlyPrize}>
          <fieldset className='parent-form-fieldset' disabled={saving}>
            <label><span>Auhind võitjale (tähti)</span><input type='number' step='0.1' min={0} max={1000} value={monthlyPrizeInput} onChange={(event) => { monthlyPrizeDirty.current = true; setMonthlyPrizeInput(Number(event.target.value)); }} /></label>
            <button type='submit'>Salvesta auhind</button>
          </fieldset>
        </form>
        {monthlyPrize && (
          <div className='monthly-standing'>
            <span>Jooksev kuu ({monthlyPrize.standing.month}):</span>
            <strong>Kiur {monthlyPrize.standing.kiurTrophies} 🏆 · Kirsi {monthlyPrize.standing.kirsiTrophies} 🏆</strong>
            <span>{monthlyPrize.standing.leader === 'tie' ? 'Hetkel viik' : `Juhib ${learnerLabel(monthlyPrize.standing.leader)}`}</span>
          </div>
        )}
      </section>
      <section className='parent-card'>
        <h3>Õpiseeria auhinnad</h3>
        <p>Auhinnad annavad lisatähti, kui laps jõuab harjutuste tegemisel teatud päevade seeriani. Näiteks 5 päeva järjest harjutamise eest antakse boonustähed. Seeria katkemisel ja uuesti samasse piirini jõudmisel antakse auhind uuesti.</p>
        <form className='parent-form parent-task-form' onSubmit={saveRewardRule}>
          <fieldset className='parent-form-fieldset' disabled={saving}>
            <label><span>Päevade seeria</span><input type='number' min={1} max={365} value={rewardForm.thresholdDays} onChange={(event) => setRewardForm({ ...rewardForm, thresholdDays: Number(event.target.value) })} /></label>
            <label><span>Tähti auhinnaks</span><input type='number' step='0.1' min={0.1} max={1000} value={rewardForm.rewardStars} onChange={(event) => setRewardForm({ ...rewardForm, rewardStars: Number(event.target.value) })} /></label>
            <label><span>Kellele?</span><select value={rewardForm.learnerScope} onChange={(event) => setRewardForm({ ...rewardForm, learnerScope: event.target.value as RewardLearnerScope })}>{Object.entries(REWARD_SCOPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label className='parent-checkbox'><input type='checkbox' checked={rewardForm.enabled} onChange={(event) => setRewardForm({ ...rewardForm, enabled: event.target.checked })} /> Aktiivne</label>
            <div className='parent-action-row'>
              {editingRewardId && <button type='button' className='filter-chip' onClick={resetRewardForm}>Tühista</button>}
              <button type='submit'>{editingRewardId ? 'Muuda auhinda' : 'Lisa auhind'}</button>
            </div>
          </fieldset>
        </form>
      </section>
      <section className='parent-card'>
        <h3>Seadistatud auhinnad</h3>
        <div className='stock-list'>
          {rewardRules.map((rule) => (
            <div key={rule.id} className={editingRewardId === rule.id ? 'stock-row editing' : 'stock-row'}>
              <div className='stock-info'>
                <strong>{rule.thresholdDays} {dayWord(rule.thresholdDays)} seeria · +{formatStars(rule.rewardStars)} ⭐</strong>
                <span>{REWARD_SCOPE_LABELS[rule.learnerScope]}{rule.enabled ? '' : ' · ⏸ peatatud'}</span>
              </div>
              <div className='stock-actions'>
                <button type='button' className='view-button' onClick={() => editRewardRule(rule)}>Muuda</button>
                <button type='button' className='filter-chip' onClick={() => toggleRewardEnabled(rule)}>{rule.enabled ? 'Peata' : 'Aktiveeri'}</button>
                <button type='button' className='delete-button' onClick={() => void deleteRewardRule(rule.id)}>Kustuta</button>
              </div>
            </div>
          ))}
          {rewardRules.length === 0 && <p>Auhindu ei ole veel lisatud.</p>}
        </div>
      </section>
    </>
  );
}
