import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { closeOfflineDbForTests, OFFLINE_DB_NAME } from '@/lib/offline/db';
import { metaRepo } from '@/lib/offline/repositories';
import { syncNow } from '@/lib/offline/syncEngine';
import { SYNC_RETRY_MIN_MS } from '@/lib/offline/syncPolicy';

// OFF-11: the request timeout bounds each request, not the whole cycle, and a
// cycle that moved data before failing does not grow the backoff.

const REQUEST_TIMEOUT_MS = 300;
vi.mock('@/lib/offline/syncPolicy', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/offline/syncPolicy')>()),
  SYNC_REQUEST_TIMEOUT_MS: 300
}));

async function resetDatabase() {
  await closeOfflineDbForTests();
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(OFFLINE_DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => resolve();
  });
}

afterEach(async () => {
  vi.unstubAllGlobals();
  await resetDatabase();
});

const SERVER_TIME = new Date().toISOString();

function pullPage(page: number, hasMore: boolean) {
  return {
    protocolVersion: 2,
    phase: 'pull',
    serverTime: SERVER_TIME,
    historyEpoch: 0,
    pull: { attempts: [], tombstones: [], taskChanges: [], remediationChanges: [] },
    hasMore: { attempts: hasMore, tombstones: false, taskChanges: false, remediationChanges: false, historyBackfill: false },
    nextCursor: {
      lastServerAttemptId: page, lastTombstoneId: 0, lastTaskChangeId: 0,
      lastRemediationChangeId: 0, lastAttemptChangeId: 0, historyEpoch: 0,
      catalogueVersions: {}, syncedAt: SERVER_TIME
    }
  };
}

function wait(ms: number, signal?: AbortSignal | null) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(signal.reason);
    }, { once: true });
  });
}

// Pull pages answer after `delays[page]` ms; a page past the list never answers.
function mockSlowServer(delays: number[], pages = delays.length) {
  let page = 0;
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    if (String(input).includes('/api/offline/ping')) {
      return Response.json({ ok: true, serverTime: SERVER_TIME, protocolVersion: 2, supportedProtocolVersions: [2], appVersion: 'test' });
    }
    const current = page;
    page += 1;
    await wait(delays[current] ?? 60_000, init?.signal);
    return Response.json(pullPage(current + 1, current + 1 < pages));
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

async function seedRetryState(retryCount: number) {
  await metaRepo.put('syncRetryState', { status: 'retry_wait', retryCount, nextRetryAt: new Date(Date.now() - 1_000).toISOString(), updatedAt: new Date().toISOString() });
}

describe('per-request sync timeout (OFF-11)', () => {
  it('finishes a cycle longer than the timeout when every request is within it', async () => {
    const pageDelay = Math.round(REQUEST_TIMEOUT_MS * 0.5);
    const fetchMock = mockSlowServer([pageDelay, pageDelay, pageDelay, pageDelay]);

    const started = Date.now();
    const outcome = await syncNow('manual:test');

    expect(outcome).toMatchObject({ ok: true });
    expect(Date.now() - started).toBeGreaterThan(REQUEST_TIMEOUT_MS);
    expect(fetchMock).toHaveBeenCalledTimes(5);
    expect(await metaRepo.get('syncRetryState', null)).toMatchObject({ status: 'idle', retryCount: 0 });
  });

  it('times out a request that does not answer and grows the backoff when nothing moved', async () => {
    mockSlowServer([]);
    await seedRetryState(3);

    expect(await syncNow('manual:test')).toMatchObject({ ok: false, reason: 'timeout', pushed: 0, pulled: 0 });

    const state = await metaRepo.get<{ status: string; retryCount: number; nextRetryAt: string }>('syncRetryState', { status: 'idle', retryCount: 0, nextRetryAt: '' });
    expect(state).toMatchObject({ status: 'retry_wait', retryCount: 4 });
    expect(new Date(state.nextRetryAt).getTime() - Date.now()).toBeGreaterThan(SYNC_RETRY_MIN_MS * 4);
  });

  it('restarts the backoff at its shortest delay when pages arrived before the timeout', async () => {
    mockSlowServer([10, 10], 5);
    await seedRetryState(3);

    expect(await syncNow('manual:test')).toMatchObject({ ok: false, reason: 'timeout' });

    const state = await metaRepo.get<{ status: string; retryCount: number; nextRetryAt: string }>('syncRetryState', { status: 'idle', retryCount: 0, nextRetryAt: '' });
    expect(state).toMatchObject({ status: 'retry_wait', retryCount: 1 });
    expect(new Date(state.nextRetryAt).getTime() - Date.now()).toBeLessThanOrEqual(SYNC_RETRY_MIN_MS * 1.25);
  });
});
