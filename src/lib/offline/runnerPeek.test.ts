import { afterEach, describe, expect, it, vi } from 'vitest';

const peek = vi.hoisted(() => ({ active: false }));
vi.mock('@/app/components/usePeekMode', () => ({ readPeekMode: () => peek.active }));

import { assertNotPeeking, RunnerStorageError, runnerStorageFailure } from '@/lib/offline/runnerSession';

describe('runners in parent peek mode', () => {
  afterEach(() => { peek.active = false; });

  it('let a child start and save as usual', () => {
    expect(() => assertNotPeeking()).not.toThrow();
  });

  it('refuse to start or save for a parent who is looking, with a reason the runner can show', () => {
    peek.active = true;
    let caught: unknown;
    try { assertNotPeeking(); } catch (error) { caught = error; }
    expect(caught).toBeInstanceOf(RunnerStorageError);
    expect(runnerStorageFailure(caught)).toMatchObject({ code: 'peek_read_only', recoverable: false });
    expect(runnerStorageFailure(caught).message).toMatch(/Vaatlusrežiimis/);
  });
});
