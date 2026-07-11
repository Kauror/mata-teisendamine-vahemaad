'use client';

import { useCallback, useEffect, useState } from 'react';
import { checkOfflineReadiness, type OfflineReadinessReport } from '@/lib/offline/readiness';
import { getCatalogueVersion } from '@/lib/offline/api';
import { useOffline } from '@/app/components/offline/OfflineProvider';

// Parent-facing offline diagnostics. Kept out of the child dashboard; surfaces the
// readiness state and a manual sync so a parent can confirm the device is prepared.
export function OfflineReadiness() {
  const { sync, syncing, pendingCount, lastSyncAt } = useOffline();
  const [report, setReport] = useState<OfflineReadinessReport | null>(null);
  const [versions, setVersions] = useState<{ kiur: string | null; kirsi: string | null }>({ kiur: null, kirsi: null });

  const refresh = useCallback(async () => {
    setReport(await checkOfflineReadiness().catch(() => null));
    const [kiur, kirsi] = await Promise.all([getCatalogueVersion('kiur').catch(() => null), getCatalogueVersion('kirsi').catch(() => null)]);
    setVersions({ kiur, kirsi });
  }, []);

  useEffect(() => { void refresh(); }, [refresh, pendingCount, syncing]);

  const ready = report?.ready ?? false;
  const row = (label: string, ok: boolean, extra?: string) => (
    <div className='offline-diag-row'>
      <span>{label}</span>
      <strong>{ok ? '✓' : '—'}{extra ? ` ${extra}` : ''}</strong>
    </div>
  );

  return (
    <section className='parent-card offline-diag-card'>
      <div className={ready ? 'offline-diag-banner ready' : 'offline-diag-banner'}>
        {ready ? 'Võrguühenduseta kasutus on valmis.' : 'Võrguühenduseta kasutus ei ole veel valmis. Ava äpp internetiühendusega.'}
      </div>
      {report && (
        <div className='offline-diag-grid'>
          {row('Rakendus salvestatud', report.appShellCached)}
          {row('Harjutuste nimekiri', report.cataloguesPresent)}
          {row('Kohalik andmebaas', report.indexedDbWritable)}
          {row('Püsiv salvestus', report.storagePersisted)}
          {row('Ootel tulemusi', report.pendingAttempts === 0, String(report.pendingAttempts))}
        </div>
      )}
      <div className='offline-diag-meta'>
        <span>Viimane sünkroonimine: {lastSyncAt ? new Date(lastSyncAt).toLocaleString('et-EE') : 'pole veel'}</span>
        <span>Kataloogi versioonid: Kiur {versions.kiur?.slice(0, 8) ?? '—'} · Kirsi {versions.kirsi?.slice(0, 8) ?? '—'}</span>
      </div>
      <button type='button' className='offline-diag-sync' disabled={syncing} onClick={() => { void sync('manual').then(refresh); }}>
        {syncing ? 'Sünkroonin…' : 'Sünkrooni nüüd'}
      </button>
    </section>
  );
}
