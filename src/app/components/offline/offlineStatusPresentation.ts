import type { OfflineSyncState } from '@/app/components/offline/OfflineProvider';

type OfflineStatusPresentation = {
  label: string;
  tone: 'ok' | 'warn' | 'muted';
};

export function offlineStatusPresentation({
  online,
  syncing,
  pendingCount,
  syncState
}: {
  online: boolean;
  syncing: boolean;
  pendingCount: number;
  syncState: OfflineSyncState;
}): OfflineStatusPresentation | null {
  if (syncState === 'auth_blocked') {
    return { label: 'Palun sisesta PIN uuesti, et tulemused saaks sünkroonida', tone: 'warn' };
  }
  if (syncState === 'upgrade_required') {
    return { label: 'Rakendus vajab uuendamist enne sünkroonimist', tone: 'warn' };
  }
  if (syncState === 'storage_error') {
    return { label: 'Seadme salvestus vajab tähelepanu', tone: 'warn' };
  }
  if (syncState === 'epoch_regression') {
    return { label: 'Sünkroonimine vajab lapsevanema abi', tone: 'warn' };
  }
  if (syncState === 'retry_wait' || syncState === 'timeout') {
    return { label: 'Sünkroonimist proovitakse varsti uuesti', tone: 'muted' };
  }
  if (!online || syncState === 'offline') {
    return { label: 'Internetti pole', tone: 'warn' };
  }
  if (syncing) {
    return { label: 'Sünkroonin…', tone: 'muted' };
  }
  if (pendingCount > 0) {
    return { label: `${pendingCount} tulemust ootab sünkroonimist`, tone: 'ok' };
  }

  // Both a healthy idle state and the harmless initial unknown state should be
  // visually quiet. Returning null also prevents future states from producing
  // an empty status pill if they are added without a presentation.
  return null;
}
