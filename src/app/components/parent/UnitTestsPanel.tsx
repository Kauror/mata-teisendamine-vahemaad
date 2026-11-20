'use client';

import Link from 'next/link';
import { useRef, useState, type ChangeEvent } from 'react';
import type { ParentVariantSummary } from '@/lib/server/unitTests/store';
import { failureMessage, jsonInit } from './parentApi';
import { useParentApi, useParentResource } from './useParentApi';

type Recent = { id: string; learner: 'kiur' | 'kirsi'; unitLabel: string; variant: string; approvedAt: string | null; grade: number | null; passed: boolean };
type Data = { variants: ParentVariantSummary[]; recent: Recent[] };

const dataFrom = (body: unknown): Data => {
  const record = (body ?? {}) as Partial<Data>;
  return { variants: Array.isArray(record.variants) ? record.variants : [], recent: Array.isArray(record.recent) ? record.recent : [] };
};

const MAX_FILE_BYTES = 512 * 1024;

// Halda → Õppesisu → Inglise keele lisatestid: import the workbook tests
// (one JSON file per unit and variant), switch a variant off, preview it with
// its answers, and see the latest graded tests.
export function UnitTestsPanel() {
  const api = useParentApi();
  const { data } = useParentResource('unitTests', dataFrom);
  const [report, setReport] = useState<string[]>([]);
  const input = useRef<HTMLInputElement>(null);
  const variants = data?.variants ?? [];
  const recent = data?.recent ?? [];

  const importFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = [...(event.target.files ?? [])];
    event.target.value = '';
    if (files.length === 0) return;
    void api.guarded(async () => {
      api.setError('');
      setReport([]);
      const parsed: Array<{ name: string; data: unknown }> = [];
      for (const file of files) {
        if (file.size > MAX_FILE_BYTES) {
          api.setError(`${file.name} on liiga suur.`);
          return;
        }
        try {
          parsed.push({ name: file.name, data: JSON.parse(await file.text()) });
        } catch {
          api.setError(`${file.name} ei ole korrektne JSON-fail.`);
          return;
        }
      }
      const res = await api.request('/api/parent/english-unit-tests', jsonInit('POST', { files: parsed }));
      if (!res.ok) {
        api.setError(await failureMessage(res, 'Importimine ebaõnnestus.'));
        return;
      }
      const body = await res.json() as { results: Array<{ unit: number; variant: string; title: string; status: string; points: number }> };
      const label: Record<string, string> = { added: 'lisatud', updated: 'uuendatud', unchanged: 'muutmata' };
      setReport(body.results.map((item) => `Unit ${item.unit}${item.variant} „${item.title}” — ${label[item.status] ?? item.status}, ${item.points} punkti`));
      api.setNotice('Lisatestid imporditud.');
      api.bus.after('unitTests');
    });
  };

  const toggle = (item: ParentVariantSummary) => api.guarded(async () => {
    const res = await api.request('/api/parent/english-unit-tests', jsonInit('PATCH', { unitNumber: item.unitNumber, variant: item.variant, active: !item.active }));
    if (!res.ok) api.setError(await failureMessage(res, 'Muutmine ebaõnnestus.'));
    api.bus.after('unitTests');
  });

  const remove = (item: ParentVariantSummary) => api.guarded(async () => {
    if (!window.confirm(`Kas kustutan lisatesti Unit ${item.unitNumber}${item.variant}? Alustatud testid jäävad alles.`)) return;
    const res = await api.request(`/api/parent/english-unit-tests?unit=${item.unitNumber}&variant=${item.variant}`, { method: 'DELETE' });
    if (!res.ok) api.setError(await failureMessage(res, 'Kustutamine ebaõnnestus.'));
    api.bus.after('unitTests');
  });

  return (
    <div className='ut-panel'>
      <p className='pv-hint'>
        Õpiku testid, mis avanevad Kiurile pärast õppetüki sõnade testi. Iga õppetüki jaoks juhuslikult variant A või B.
        Faile ei ole koodis (õpik on autoriõigusega kaitstud), need imporditakse siit.
      </p>
      <div className='ut-import'>
        <input ref={input} className='sr-only' type='file' accept='.json,application/json' multiple onChange={importFiles} aria-label='Vali lisatestide failid' />
        <button type='button' className='pv-btn' data-k='ok' onClick={() => input.current?.click()}>Impordi lisatestid (JSON)</button>
      </div>
      {report.length > 0 ? <ul className='ut-report'>{report.map((line) => <li key={line}>{line}</li>)}</ul> : null}

      {variants.length === 0 ? <p className='pv-done'>Lisateste veel ei ole.</p> : (
        <ul className='ut-variant-list'>
          {variants.map((item) => (
            <li key={`${item.unitNumber}${item.variant}`} className='ut-variant' data-active={item.active}>
              <span className='ut-variant-name'>
                <strong>Unit {item.unitNumber}{item.variant}</strong> {item.title}
                <small>
                  {item.points} punkti · {item.exerciseCount} harjutust
                  {item.parentChecked > 0 ? ` · ${item.parentChecked} hindad sina` : ''}
                  {item.attempts > 0 ? ` · tehtud ${item.attempts}×` : ''}
                  {item.vocabUnitLabel ? '' : ' · sõnavara õppetükk puudub'}
                </small>
              </span>
              <span className='ut-variant-actions'>
                <Link className='pv-btn' data-k='no' href={`/vanem/lisatest/eelvaade?unit=${item.unitNumber}&variant=${item.variant}`}>Eelvaade</Link>
                <button type='button' className='pv-btn' data-k='no' aria-pressed={item.active} onClick={() => toggle(item)}>{item.active ? 'Sees' : 'Väljas'}</button>
                <button type='button' className='pv-btn' data-k='no' onClick={() => remove(item)}>Kustuta</button>
              </span>
            </li>
          ))}
        </ul>
      )}

      {recent.length > 0 ? (
        <>
          <h3 className='ut-subhead'>Viimati hinnatud</h3>
          <ul className='ut-variant-list'>
            {recent.map((item) => (
              <li key={item.id} className='ut-variant'>
                <span className='ut-variant-name'>
                  <strong>{item.unitLabel} ({item.variant})</strong>
                  <small>{item.learner === 'kiur' ? 'Kiur' : 'Kirsi'} · hinne {item.grade ?? '–'} · {item.passed ? 'sooritatud' : 'alla 75%'} · {item.approvedAt?.slice(0, 10)}</small>
                </span>
                <span className='ut-variant-actions'>
                  <Link className='pv-btn' data-k='no' href={`/vanem/lisatest/${item.id}`}>Vaata</Link>
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
