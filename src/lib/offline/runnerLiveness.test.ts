import { describe, expect, it } from 'vitest';
import {
  RUNNER_HEARTBEAT_LEASE_MS,
  clearRunnerHeartbeat,
  hasLiveRunnerHeartbeat,
  isRunnerPath,
  writeRunnerHeartbeat
} from './runnerLiveness';

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

describe('runner liveness', () => {
  it.each([
    '/test',
    '/kiur/lugemine',
    '/kiur/loodusopetus/test',
    '/kiur/inglise-keel/sprint',
    '/kirsi/lugemine/esimene-haalik',
    '/kirsi/lugemine/pilt-ja-sona'
  ])('recognises runner route %s', (pathname) => {
    expect(isRunnerPath(pathname)).toBe(true);
  });

  it.each(['/', '/kiur', '/history', '/opi/matemaatika'])('does not treat %s as a runner route', (pathname) => {
    expect(isRunnerPath(pathname)).toBe(false);
  });

  it('reports and clears a live heartbeat', () => {
    const storage = new MemoryStorage();
    writeRunnerHeartbeat(storage, 'tab-1', 1_000);

    expect(hasLiveRunnerHeartbeat(storage, 1_001)).toBe(true);
    clearRunnerHeartbeat(storage, 'tab-1');
    expect(hasLiveRunnerHeartbeat(storage, 1_001)).toBe(false);
  });

  it('ignores and removes expired or invalid heartbeats', () => {
    const storage = new MemoryStorage();
    writeRunnerHeartbeat(storage, 'expired', 1_000);
    storage.setItem('harjutaja:runner-tab:invalid', 'not-a-date');

    expect(hasLiveRunnerHeartbeat(storage, 1_000 + RUNNER_HEARTBEAT_LEASE_MS + 1)).toBe(false);
    expect(storage.length).toBe(0);
  });

  it('stays live while at least one tab has a fresh heartbeat', () => {
    const storage = new MemoryStorage();
    writeRunnerHeartbeat(storage, 'old-tab', 1_000);
    writeRunnerHeartbeat(storage, 'open-tab', 20_000);

    expect(hasLiveRunnerHeartbeat(storage, 20_001)).toBe(true);
    expect(storage.getItem('harjutaja:runner-tab:old-tab')).toBeNull();
  });
});
