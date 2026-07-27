import { describe, expect, it } from 'vitest';
import { offlineStatusPresentation } from './offlineStatusPresentation';

describe('offlineStatusPresentation', () => {
  it('does not render a status for healthy or initial unknown idle states', () => {
    expect(offlineStatusPresentation({
      online: true,
      syncing: false,
      pendingCount: 0,
      syncState: 'healthy'
    })).toBeNull();

    expect(offlineStatusPresentation({
      online: true,
      syncing: false,
      pendingCount: 0,
      syncState: 'unknown'
    })).toBeNull();
  });

  it('gives epoch regression a parent-facing warning instead of an empty pill', () => {
    expect(offlineStatusPresentation({
      online: true,
      syncing: false,
      pendingCount: 0,
      syncState: 'epoch_regression'
    })).toEqual({
      label: 'Sünkroonimine vajab lapsevanema abi',
      tone: 'warn'
    });
  });

  it('still presents transient and pending states while the sync state is unknown', () => {
    expect(offlineStatusPresentation({
      online: true,
      syncing: true,
      pendingCount: 0,
      syncState: 'unknown'
    })).toEqual({
      label: 'Sünkroonin…',
      tone: 'muted'
    });

    expect(offlineStatusPresentation({
      online: true,
      syncing: false,
      pendingCount: 2,
      syncState: 'unknown'
    })).toEqual({
      label: '2 tulemust ootab sünkroonimist',
      tone: 'ok'
    });
  });
});
