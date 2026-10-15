import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createReconnectRetry, RECONNECT_RETRY_DELAYS_MS } from '@/lib/offline/reconnectRetry';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('quick reconnect retries (OFF-00)', () => {
  it('walks the 2/5/10/20/30 s ladder and then leaves it to the periodic interval', async () => {
    const run = vi.fn();
    const retry = createReconnectRetry({ run, isOnlineHint: () => true });
    expect(RECONNECT_RETRY_DELAYS_MS).toEqual([2_000, 5_000, 10_000, 20_000, 30_000]);

    for (const delay of RECONNECT_RETRY_DELAYS_MS) {
      retry.report('offline');
      expect(retry.pending()).toBe(true);
      await vi.advanceTimersByTimeAsync(delay - 1);
      const before = run.mock.calls.length;
      await vi.advanceTimersByTimeAsync(1);
      expect(run.mock.calls.length).toBe(before + 1);
    }

    retry.report('offline');
    expect(retry.pending()).toBe(false);
    await vi.advanceTimersByTimeAsync(10 * 60_000);
    expect(run).toHaveBeenCalledTimes(RECONNECT_RETRY_DELAYS_MS.length);
  });

  it('never keeps more than one retry pending', async () => {
    const run = vi.fn();
    const retry = createReconnectRetry({ run, isOnlineHint: () => true });
    retry.report('offline');
    retry.report('offline');
    retry.report('offline');
    await vi.advanceTimersByTimeAsync(60_000);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it('cancels the pending retry and restarts the ladder after a reachable result', async () => {
    const run = vi.fn();
    const retry = createReconnectRetry({ run, isOnlineHint: () => true });
    retry.report('offline');
    await vi.advanceTimersByTimeAsync(2_000);
    retry.report('offline'); // second rung: 5 s
    retry.report('reachable');
    expect(retry.pending()).toBe(false);
    await vi.advanceTimersByTimeAsync(60_000);
    expect(run).toHaveBeenCalledTimes(1);

    retry.report('offline');
    await vi.advanceTimersByTimeAsync(2_000);
    expect(run).toHaveBeenCalledTimes(2);
  });

  it('does not schedule while the device reports itself offline', async () => {
    const run = vi.fn();
    const retry = createReconnectRetry({ run, isOnlineHint: () => false });
    retry.report('offline');
    expect(retry.pending()).toBe(false);
    await vi.advanceTimersByTimeAsync(60_000);
    expect(run).not.toHaveBeenCalled();
  });

  it('runs nothing after cancel (unmount)', async () => {
    const run = vi.fn();
    const retry = createReconnectRetry({ run, isOnlineHint: () => true });
    retry.report('offline');
    retry.cancel();
    await vi.advanceTimersByTimeAsync(60_000);
    retry.report('offline');
    await vi.advanceTimersByTimeAsync(60_000);
    expect(run).not.toHaveBeenCalled();
  });

  it('survives a failing run', async () => {
    const run = vi.fn().mockRejectedValue(new Error('boom'));
    const retry = createReconnectRetry({ run, isOnlineHint: () => true });
    retry.report('offline');
    await vi.advanceTimersByTimeAsync(2_000);
    expect(run).toHaveBeenCalledTimes(1);
    retry.report('offline');
    expect(retry.pending()).toBe(true);
  });
});
