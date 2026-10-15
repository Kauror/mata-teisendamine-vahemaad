// Quick reconnect retries for a failed ping while the device itself claims to
// be online (a cold start on a slow network, a server restart, a 5 s ping
// timeout). Without these the next attempt is only the 5-minute interval or a
// visibility/online event, and the parent area and every sync stay locked.
//
// Never more than one retry is pending; a reachable outcome (or unmount)
// cancels it and resets the ladder. After the ladder is exhausted the normal
// periodic interval takes over.

export const RECONNECT_RETRY_DELAYS_MS = [2_000, 5_000, 10_000, 20_000, 30_000] as const;

export type ReconnectRetryOptions = {
  run: () => void | Promise<void>;
  isOnlineHint: () => boolean;
  delays?: readonly number[];
  setTimer?: (callback: () => void, ms: number) => unknown;
  clearTimer?: (handle: unknown) => void;
};

export type ReconnectRetry = {
  // Report how a ping/sync ended: 'offline' schedules the next quick retry
  // (when navigator.onLine is true), anything reachable resets the ladder.
  report: (result: 'offline' | 'reachable') => void;
  cancel: () => void;
  pending: () => boolean;
};

export function createReconnectRetry(options: ReconnectRetryOptions): ReconnectRetry {
  const delays = options.delays ?? RECONNECT_RETRY_DELAYS_MS;
  const setTimer = options.setTimer ?? ((callback, ms) => setTimeout(callback, ms));
  const clearTimer = options.clearTimer ?? ((handle) => clearTimeout(handle as ReturnType<typeof setTimeout>));
  let attempt = 0;
  let timer: unknown = null;
  let disposed = false;

  const clear = () => {
    if (timer !== null) clearTimer(timer);
    timer = null;
  };

  return {
    report(result) {
      if (disposed) return;
      if (result === 'reachable') {
        clear();
        attempt = 0;
        return;
      }
      if (timer !== null) return; // one pending retry at most
      if (!options.isOnlineHint()) return; // the 'online' event will retry
      if (attempt >= delays.length) return; // periodic interval takes over
      const delay = delays[attempt];
      attempt += 1;
      timer = setTimer(() => {
        timer = null;
        if (disposed) return;
        void Promise.resolve().then(options.run).catch(() => {});
      }, delay);
    },
    cancel() {
      disposed = true;
      clear();
    },
    pending() {
      return timer !== null;
    }
  };
}
