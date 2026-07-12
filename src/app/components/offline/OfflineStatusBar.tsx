'use client';

import { useOffline } from '@/app/components/offline/OfflineProvider';

// Compact, non-alarming status shown to children. Renders nothing when everything
// is online and synced; never shows codes, exceptions or technical terms.
export function OfflineStatusBar() {
  const { online, syncing, pendingCount } = useOffline();

  if (online && !syncing && pendingCount === 0) return null;

  let label = '';
  let tone: 'ok' | 'warn' | 'muted' = 'muted';
  if (!online) {
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
