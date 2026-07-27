'use client';

import { useOffline } from '@/app/components/offline/OfflineProvider';
import { offlineStatusPresentation } from '@/app/components/offline/offlineStatusPresentation';

// Compact, non-alarming status shown to children. Renders nothing when everything
// is online and synced; never shows codes, exceptions or technical terms.
export function OfflineStatusBar() {
  const { online, syncing, pendingCount, syncState } = useOffline();
  const presentation = offlineStatusPresentation({ online, syncing, pendingCount, syncState });
  if (!presentation) return null;

  return (
    <div className={`offline-status offline-status-${presentation.tone}`} role="status" aria-live="polite">
      <span aria-hidden>{!online ? '📴' : syncing ? '🔄' : '☁️'}</span>
      <span>{presentation.label}</span>
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
