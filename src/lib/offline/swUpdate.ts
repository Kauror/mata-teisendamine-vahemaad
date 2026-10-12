// Small, testable pieces of the "Uus versioon on saadaval" flow. The browser
// objects are typed structurally so tests can drive them with plain fakes.

export type WorkerLike = {
  state: string;
  postMessage: (message: unknown) => void;
  addEventListener: (type: 'statechange', listener: () => void) => void;
  removeEventListener: (type: 'statechange', listener: () => void) => void;
};

export type RegistrationLike = {
  waiting: WorkerLike | null;
  installing: WorkerLike | null;
  update: () => Promise<unknown>;
};

const SETTLED = new Set(['installed', 'activating', 'activated', 'redundant']);

// Resolves once an installing worker has finished installing (or failed), or
// after the timeout — never hangs the update button.
export function waitUntilSettled(worker: WorkerLike, timeoutMs: number): Promise<void> {
  if (SETTLED.has(worker.state)) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => {
      if (!SETTLED.has(worker.state)) return;
      clearTimeout(timer);
      worker.removeEventListener('statechange', done);
      resolve();
    };
    const timer = setTimeout(() => {
      worker.removeEventListener('statechange', done);
      resolve();
    }, timeoutMs);
    worker.addEventListener('statechange', done);
  });
}

// The newest version available, so one "Uuenda" lands on the latest build.
// A long-open app may hold an older waiting worker while several newer builds
// were deployed; activating that one would only lead to another prompt right
// after the reload. Asking the server first replaces it with the newest.
export async function newestWaitingWorker(registration: RegistrationLike, timeoutMs = 15_000): Promise<WorkerLike | null> {
  try {
    await registration.update();
  } catch {
    // Offline or the server is busy: the worker already waiting is still valid.
  }
  for (let round = 0; round < 3 && registration.installing; round += 1) {
    await waitUntilSettled(registration.installing, timeoutMs);
  }
  return registration.waiting;
}

// An installing worker became redundant. That is a real failure only when
// nothing else took its place — a newer build superseding it is normal.
export function isInstallFailure(registration: Pick<RegistrationLike, 'waiting' | 'installing'>) {
  return !registration.waiting && !registration.installing;
}

// Checks for a new version at most this often (tab shown, periodic timer).
export const UPDATE_CHECK_MIN_INTERVAL_MS = 60_000;
