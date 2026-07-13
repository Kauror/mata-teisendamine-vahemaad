'use client';

import { useEffect, type Dispatch, type SetStateAction } from 'react';
import type { RunnerSessionV3 } from '@/lib/offline/records';
import { patchRunnerSession, runnerStorageFailure } from '@/lib/offline/runnerSession';

type RunnerCheckpointOptions<Session extends RunnerSessionV3> = {
  enabled: boolean;
  runId: string | null;
  snapshotRef: { current: Partial<Session> };
  setStorageError: Dispatch<SetStateAction<string>>;
};

export function useRunnerCheckpoint<Session extends RunnerSessionV3>({
  enabled,
  runId,
  snapshotRef,
  setStorageError
}: RunnerCheckpointOptions<Session>) {
  useEffect(() => {
    if (!enabled || !runId) return;
    const checkpoint = () => {
      void patchRunnerSession<Session>(runId, snapshotRef.current)
        .catch((error) => setStorageError(runnerStorageFailure(error).message));
    };
    const timer = window.setInterval(checkpoint, 5000);
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') checkpoint();
    };
    window.addEventListener('pagehide', checkpoint);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('pagehide', checkpoint);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [enabled, runId, setStorageError, snapshotRef]);
}

export function useVisibleElapsedTimer(enabled: boolean, setElapsed: Dispatch<SetStateAction<number>>) {
  useEffect(() => {
    if (!enabled) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') setElapsed((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [enabled, setElapsed]);
}
