import { afterEach, describe, expect, it, vi } from 'vitest';
import { isInstallFailure, newestWaitingWorker, waitUntilSettled, type RegistrationLike, type WorkerLike } from '@/lib/offline/swUpdate';

class FakeWorker implements WorkerLike {
  listeners = new Set<() => void>();
  messages: unknown[] = [];
  constructor(public name: string, public state: string) {}
  postMessage(message: unknown) { this.messages.push(message); }
  addEventListener(_type: 'statechange', listener: () => void) { this.listeners.add(listener); }
  removeEventListener(_type: 'statechange', listener: () => void) { this.listeners.delete(listener); }
  become(state: string) {
    this.state = state;
    for (const listener of [...this.listeners]) listener();
  }
}

afterEach(() => vi.useRealTimers());

describe('newest waiting worker', () => {
  it('activates the newest build, not the one found when the app was opened', async () => {
    // The app was opened with build 1 waiting; builds 2 and 3 were deployed since.
    const old = new FakeWorker('build-1', 'installed');
    const newest = new FakeWorker('build-3', 'installing');
    const registration: RegistrationLike = {
      waiting: old,
      installing: null,
      update: async () => {
        registration.installing = newest;
        setTimeout(() => {
          registration.installing = null;
          registration.waiting = newest;
          old.become('redundant');
          newest.become('installed');
        }, 5);
      }
    };
    const worker = await newestWaitingWorker(registration);
    expect(worker).toBe(newest);
  });

  it('keeps the waiting worker when the update check fails (offline)', async () => {
    const waiting = new FakeWorker('build-1', 'installed');
    const registration: RegistrationLike = { waiting, installing: null, update: async () => { throw new Error('offline'); } };
    expect(await newestWaitingWorker(registration)).toBe(waiting);
  });

  it('returns null when nothing is waiting any more (another tab already updated)', async () => {
    const registration: RegistrationLike = { waiting: null, installing: null, update: async () => undefined };
    expect(await newestWaitingWorker(registration)).toBeNull();
  });

  it('never hangs on an install that does not finish', async () => {
    vi.useFakeTimers();
    const stuck = new FakeWorker('build-2', 'installing');
    const registration: RegistrationLike = { waiting: null, installing: stuck, update: async () => undefined };
    const pending = newestWaitingWorker(registration, 1000);
    await vi.advanceTimersByTimeAsync(3500);
    await expect(pending).resolves.toBeNull();
  });
});

describe('install outcome', () => {
  it('treats a superseded install as normal and a lone failed install as an error', () => {
    expect(isInstallFailure({ waiting: new FakeWorker('newer', 'installed'), installing: null })).toBe(false);
    expect(isInstallFailure({ waiting: null, installing: new FakeWorker('newer', 'installing') })).toBe(false);
    expect(isInstallFailure({ waiting: null, installing: null })).toBe(true);
  });

  it('settles on installed or redundant and cleans up its listener', async () => {
    const worker = new FakeWorker('w', 'installing');
    const settled = waitUntilSettled(worker, 10_000);
    worker.become('installed');
    await settled;
    expect(worker.listeners.size).toBe(0);
  });
});
