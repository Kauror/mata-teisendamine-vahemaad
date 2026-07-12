'use client';

import { useOffline } from '@/app/components/offline/OfflineProvider';

// Compact, non-alarming status shown to children. Renders nothing when everything
// is online and synced; never shows codes, exceptions or technical terms.
export function OfflineStatusBar() {
  const { online, syncing, pendingCount, syncState } = useOffline();

  if (online && !syncing && pendingCount === 0 && syncState === 'healthy') return null;

  let label = '';
  let tone: 'ok' | 'warn' | 'muted' = 'muted';
  if (syncState === 'auth_blocked') {
    label = 'Palun sisesta PIN uuesti, et tulemused saaks sünkroonida';
    tone = 'warn';
  } else if (syncState === 'upgrade_required') {
    label = 'Rakendus vajab uuendamist enne sünkroonimist';
    tone = 'warn';
  } else if (syncState === 'storage_error') {
    label = 'Seadme salvestus vajab tähelepanu';
    tone = 'warn';
  } else if (syncState === 'retry_wait' || syncState === 'timeout') {
    label = 'Sünkroonimist proovitakse varsti uuesti';
    tone = 'muted';
  } else if (!online) {
    label = 'Võrguühendus puudub · harjutamist saab jätkata';
    tone = 'warn';
  } else if (syncing) {
    label = 'Sünkroonin…';
    tone = 'muted';
  } else if (pendingCount > 0) {
    label = `${pendingCount} tulemust ootab sünkroonimist`;
    tone = 'ok';
  }

  return (
    <div className={`offline-status offline-status-${tone}`} role="status" aria-live="polite">
      <span aria-hidden>{!online ? '📴' : syncing ? '🔄' : '☁️'}</span>
      <span>{label}</span>
    </div>
  );
}

export function UpdateAvailableNotice() {
  const { updateAvailable, updateBlocked, applyUpdate } = useOffline();
  if (!updateAvailable) return null;
  return (
    <div className="offline-update-notice" role="status">
      <span>{updateBlocked ? 'Uuendus ootab harjutuse lõpetamist.' : 'Uus versioon on saadaval.'}</span>
      <button type="button" disabled={updateBlocked} onClick={() => { void applyUpdate(); }}>Uuenda</button>
    </div>
  );
}
