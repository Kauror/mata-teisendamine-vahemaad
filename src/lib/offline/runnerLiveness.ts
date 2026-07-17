const RUNNER_HEARTBEAT_PREFIX = 'harjutaja:runner-tab:';

export const RUNNER_HEARTBEAT_INTERVAL_MS = 5_000;
export const RUNNER_HEARTBEAT_LEASE_MS = 15_000;

const RUNNER_PATHS = new Set([
  '/test',
  '/kiur/lugemine',
  '/kiur/loodusopetus/test',
  '/kiur/inglise-keel/sprint',
  '/kirsi/lugemine/esimene-haalik',
  '/kirsi/lugemine/pilt-ja-sona'
]);

export function isRunnerPath(pathname: string): boolean {
  return RUNNER_PATHS.has(pathname);
}

export function writeRunnerHeartbeat(storage: Storage, tabId: string, now = Date.now()): void {
  storage.setItem(`${RUNNER_HEARTBEAT_PREFIX}${tabId}`, String(now));
}

export function clearRunnerHeartbeat(storage: Storage, tabId: string): void {
  storage.removeItem(`${RUNNER_HEARTBEAT_PREFIX}${tabId}`);
}

export function hasLiveRunnerHeartbeat(storage: Storage, now = Date.now()): boolean {
  const expiredKeys: string[] = [];
  let hasLiveHeartbeat = false;

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (!key?.startsWith(RUNNER_HEARTBEAT_PREFIX)) continue;

    const heartbeatAt = Number(storage.getItem(key));
    if (Number.isFinite(heartbeatAt) && now - heartbeatAt <= RUNNER_HEARTBEAT_LEASE_MS) {
      hasLiveHeartbeat = true;
    } else {
      expiredKeys.push(key);
    }
  }

  for (const key of expiredKeys) storage.removeItem(key);
  return hasLiveHeartbeat;
}
