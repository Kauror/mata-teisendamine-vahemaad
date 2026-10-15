'use client';

import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { failureMessage, jsonInit } from './parentApi';
import type { LearningSettings } from './types';
import { useParentApi, useParentResource, useParentSaving } from './useParentApi';

const defaultLearningSettings: LearningSettings = {
  baseValue: 1,
  decayStep: 0.1,
  minimumValue: 0,
  dailyCap: 10,
  streakIntervalDays: 7,
  streakBonusAmount: 1,
  learningPointsEnabled: true,
  streakBonusEnabled: true
};

// "Õppimise punktid". A refresh must not wipe a half-edited draft: the form
// takes server values only while untouched, and becomes clean again on save.
export function LearningSettingsPanel() {
  const api = useParentApi();
  const saving = useParentSaving();
  const { data } = useParentResource<LearningSettings>('learning');
  const [learningSettings, setLearningSettings] = useState<LearningSettings>(defaultLearningSettings);
  const dirty = useRef(false);

  useEffect(() => {
    if (data && !dirty.current) setLearningSettings(data);
  }, [data]);

  const edit = (patch: Partial<LearningSettings>) => {
    dirty.current = true;
    setLearningSettings((current) => ({ ...current, ...patch }));
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    return api.guarded(async () => {
      api.setError('');
      const res = await api.request('/api/parent/learning-settings', jsonInit('POST', learningSettings));
      if (!res.ok) {
        api.setError(await failureMessage(res, 'Õppimise seadeid ei saanud salvestada.'));
        return;
      }
      const body = await res.json().catch(() => null) as LearningSettings | null;
      dirty.current = false;
      if (body) setLearningSettings(body);
      api.setNotice('Õppimise seaded salvestatud.');
    });
  };

  return (
    <section className='parent-card'>
      <p>Õppimise punktid annavad tähti harjutuste tegemise eest. Sama harjutuse kordamisel väheneb tänane väärtus, et vältida lihtsat punktide kogumist.</p>
      <form className='parent-form parent-task-form' onSubmit={save}>
        <fieldset className='parent-form-fieldset' disabled={saving}>
          <label><span>Algväärtus</span><input type='number' step='0.1' min={0} max={20} value={learningSettings.baseValue} onChange={(event) => edit({ baseValue: Number(event.target.value) })} /></label>
          <label><span>Vähenemine</span><input type='number' step='0.1' min={0} max={20} value={learningSettings.decayStep} onChange={(event) => edit({ decayStep: Number(event.target.value) })} /></label>
          <label><span>Miinimum</span><input type='number' step='0.1' min={0} max={20} value={learningSettings.minimumValue} onChange={(event) => edit({ minimumValue: Number(event.target.value) })} /></label>
          <label><span>Päevane õppimise piir</span><input type='number' step='0.1' min={0} max={100} value={learningSettings.dailyCap} onChange={(event) => edit({ dailyCap: Number(event.target.value) })} /></label>
          <label><span>Seeriaboonuse samm</span><input type='number' min={1} max={365} value={learningSettings.streakIntervalDays} onChange={(event) => edit({ streakIntervalDays: Number(event.target.value) })} /></label>
          <label><span>Seeriaboonus</span><input type='number' step='0.1' min={0} max={100} value={learningSettings.streakBonusAmount} onChange={(event) => edit({ streakBonusAmount: Number(event.target.value) })} /></label>
          <label className='parent-checkbox'><input type='checkbox' checked={learningSettings.learningPointsEnabled} onChange={(event) => edit({ learningPointsEnabled: event.target.checked })} /> Õppimise punktid sees</label>
          <label className='parent-checkbox'><input type='checkbox' checked={learningSettings.streakBonusEnabled} onChange={(event) => edit({ streakBonusEnabled: event.target.checked })} /> Seeriaboonus sees</label>
          <button type='submit'>Salvesta</button>
        </fieldset>
      </form>
    </section>
  );
}
