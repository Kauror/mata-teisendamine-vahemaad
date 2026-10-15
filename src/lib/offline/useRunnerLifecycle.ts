'use client';

import { useEffect, useRef, type Dispatch, type MutableRefObject, type SetStateAction } from 'react';
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

type RunnerAutosaveOptions = {
  enabled: boolean;
  runId: string | null;
  setStorageError: Dispatch<SetStateAction<string>>;
  // The runner state whose change is a save point, in a fixed order (an
  // effect dependency list). Every render writes the snapshot; a change in
  // one of these writes it to the device.
  changes: readonly unknown[];
};

// Keeps the runner's latest snapshot in a ref (for the checkpoint hook) and
// saves it to the device whenever one of `changes` changes while enabled.
export function useRunnerAutosave<Session extends RunnerSessionV3>(
  snapshot: Partial<Session>,
  { enabled, runId, setStorageError, changes }: RunnerAutosaveOptions
): MutableRefObject<Partial<Session>> {
  const snapshotRef = useRef<Partial<Session>>(snapshot);
  snapshotRef.current = snapshot;

  useEffect(() => {
    if (!enabled || !runId) return;
    void patchRunnerSession<Session>(runId, snapshotRef.current)
      .catch((error) => setStorageError(runnerStorageFailure(error).message));
    // `changes` is the caller's dependency list; spreading it keeps this
    // effect firing exactly when the runner's own save effect used to.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, runId, setStorageError, ...changes]);

  return snapshotRef;
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
