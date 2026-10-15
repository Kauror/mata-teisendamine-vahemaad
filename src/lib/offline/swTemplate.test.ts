import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';

// Executes scripts/sw-template.js (the source of the generated public/sw.js)
// against a minimal fake worker global, so its fetch/install handlers can be
// exercised without a browser.

const ORIGIN = 'https://app.test';
const BUILD = 'build-b';

class FakeCache {
  entries = new Map<string, Response>();
  putGate: Promise<void> | null = null;
  async put(key: string, response: Response) {
    if (this.putGate) await this.putGate;
    this.entries.set(key, response);
  }
  async match(key: string) {
    return this.entries.get(key);
  }
}

function page(pathname: string, buildId: string | null, body = `<html>${buildId}</html>`) {
  const headers = new Headers({ 'Content-Type': 'text/html; charset=utf-8' });
  if (buildId !== null) headers.set('X-App-Build-Id', buildId);
  const response = new Response(body, { headers });
  Object.defineProperty(response, 'url', { value: ORIGIN + pathname });
  return response;
}

function asset(pathname: string, type: string, body = `body of ${pathname}`) {
  const response = new Response(body, { headers: { 'Content-Type': type } });
  Object.defineProperty(response, 'url', { value: ORIGIN + pathname });
  return response;
}

type WorkerOptions = {
  precache?: string[];
  publicAssets?: string[];
  stores?: Map<string, FakeCache>;
};

function loadWorker(fetchImpl: (input: string) => Promise<Response>, options: WorkerOptions = {}) {
  const listeners: Record<string, (event: unknown) => void> = {};
  const stores = options.stores ?? new Map<string, FakeCache>();
  const caches = {
    async open(name: string) {
      if (!stores.has(name)) stores.set(name, new FakeCache());
      return stores.get(name)!;
    },
    async keys() { return [...stores.keys()]; },
    async delete(name: string) { return stores.delete(name); }
  };
  const self = {
    location: { origin: ORIGIN },
    addEventListener: (type: string, listener: (event: unknown) => void) => { listeners[type] = listener; },
    clients: { claim: async () => {} },
    skipWaiting: () => {}
  };
  const manifest = { manifestVersion: 5, shellRoutes: ['/kiur', '/offline'], publicAssets: options.publicAssets ?? [] };
  const source = fs.readFileSync(path.join(process.cwd(), 'scripts', 'sw-template.js'), 'utf8')
    .replace('__BUILD_ID__', BUILD)
    .replace('__PRECACHE__', JSON.stringify(options.precache ?? []))
    .replace('__CAPABILITY_MANIFEST__', JSON.stringify(manifest));
  // Navigations pass the request object; install passes a path string.
  const fetchMock = vi.fn((input: string | { url: string }) => fetchImpl(typeof input === 'string' ? input : input.url));
  new Function('self', 'caches', 'fetch', source)(self, caches, fetchMock);
  const shell = () => caches.open(`harjutaja-shell-${BUILD}`);
  const staticCache = () => caches.open(`harjutaja-static-${BUILD}`);

  function navigate(pathname: string) {
    let responded: Promise<Response> | null = null;
    const waits: Promise<unknown>[] = [];
    listeners.fetch({
      request: { method: 'GET', url: ORIGIN + pathname, mode: 'navigate' },
      respondWith: (promise: Promise<Response>) => { responded = promise; },
      waitUntil: (promise: Promise<unknown>) => { waits.push(promise); }
    });
    return { response: responded! as Promise<Response>, waits };
  }

  function install() {
    let done: Promise<unknown> | null = null;
    listeners.install({ waitUntil: (promise: Promise<unknown>) => { done = promise; } });
    return done! as Promise<unknown>;
  }

  return { navigate, install, shell, staticCache, fetchMock };
}

describe('service worker navigation caching (OFF-03, OFF-08)', () => {
  it('caches its own build\'s HTML in the background and returns the response at once', async () => {
    const worker = loadWorker(async (url) => page(new URL(url, ORIGIN).pathname, BUILD));
    const cache = await worker.shell();
    let release!: () => void;
    cache.putGate = new Promise<void>((resolve) => { release = resolve; });

    const { response, waits } = worker.navigate('/kiur');

    // The navigation resolves while the cache write is still blocked.
    expect(await (await response).text()).toBe(`<html>${BUILD}</html>`);
    expect(waits).toHaveLength(1);
    expect(cache.entries.has('/kiur')).toBe(false);
    release();
    await Promise.all(waits);
    expect(await cache.entries.get('/kiur')?.text()).toBe(`<html>${BUILD}</html>`);
  });

  it.each([['another build', 'build-c'], ['no build header', null]] as const)(
    'serves but never caches HTML with %s',
    async (_label, buildId) => {
      const worker = loadWorker(async (url) => page(new URL(url, ORIGIN).pathname, buildId));
      const cache = await worker.shell();
      cache.entries.set('/kiur', page('/kiur', BUILD, 'own-build-shell'));

      const { response, waits } = worker.navigate('/kiur');

      expect(await (await response).text()).toBe(`<html>${buildId}</html>`);
      expect(waits).toHaveLength(0);
      expect(await cache.entries.get('/kiur')?.text()).toBe('own-build-shell');
    }
  );

  it('falls back to the cached shell when the network fails', async () => {
    const worker = loadWorker(async () => { throw new TypeError('Failed to fetch'); });
    (await worker.shell()).entries.set('/kiur', page('/kiur', BUILD, 'cached-shell'));

    const { response } = worker.navigate('/kiur');

    expect(await (await response).text()).toBe('cached-shell');
  });

  it('does not cache paths outside the shell manifest', async () => {
    const worker = loadWorker(async (url) => page(new URL(url, ORIGIN).pathname, BUILD));
    const { response, waits } = worker.navigate('/parent');
    await response;
    expect(waits).toHaveLength(0);
  });
});

// Install does not judge the build header: sw.js and the pages come from the
// same server, and refusing would turn a deploy race into a failed update.
// Only the runtime refresh of the shell is limited to the worker's own build.
describe('service worker install (OFF-03)', () => {
  it.each([['its own build id', BUILD], ['another build id', 'build-c'], ['no build header', null]] as const)('installs shells with %s', async (_label, buildId) => {
    const worker = loadWorker(async (url) => page(new URL(url, ORIGIN).pathname, buildId));
    await worker.install();
    const cache = await worker.shell();
    expect(cache.entries.has('/kiur')).toBe(true);
    expect(cache.entries.has('/__offline-cache-complete__')).toBe(true);
  });
});

describe('service worker install fetching (OFF-10)', () => {
  const CHUNKS = Array.from({ length: 12 }, (_, i) => `/_next/static/chunks/${i}-abc.js`);

  function serve(url: string) {
    const pathname = new URL(url, ORIGIN).pathname;
    if (pathname.startsWith('/_next/static/')) return asset(pathname, 'application/javascript');
    if (pathname.endsWith('.png')) return asset(pathname, 'image/png');
    return page(pathname, BUILD);
  }

  function previousBuildStores(entries: Record<string, Response>) {
    const old = new FakeCache();
    for (const [key, response] of Object.entries(entries)) old.entries.set(key, response);
    return new Map([['harjutaja-static-build-a', old]]);
  }

  it('keeps at most five requests in flight, and more than one', async () => {
    let inFlight = 0;
    let peak = 0;
    const worker = loadWorker(async (url) => {
      inFlight++;
      peak = Math.max(peak, inFlight);
      await new Promise((resolve) => setTimeout(resolve, 1));
      inFlight--;
      return serve(url);
    }, { precache: CHUNKS, publicAssets: ['/web-app-manifest-192x192.png'] });

    await worker.install();

    expect(peak).toBe(5);
    expect(worker.fetchMock).toHaveBeenCalledTimes(CHUNKS.length + 1 + 2);
    const cache = await worker.staticCache();
    for (const chunk of CHUNKS) expect(cache.entries.has(chunk)).toBe(true);
    expect((await worker.shell()).entries.has('/__offline-cache-complete__')).toBe(true);
  });

  it('copies hashed static files from an earlier build instead of downloading them', async () => {
    const stores = previousBuildStores({
      [CHUNKS[0]]: asset(CHUNKS[0], 'application/javascript', 'old-build-copy'),
      // Public assets are not content-hashed: always fetched fresh.
      '/web-app-manifest-192x192.png': asset('/web-app-manifest-192x192.png', 'image/png', 'stale-icon')
    });
    const worker = loadWorker(async (url) => serve(url), {
      precache: CHUNKS.slice(0, 2),
      publicAssets: ['/web-app-manifest-192x192.png'],
      stores
    });

    await worker.install();

    const fetched = worker.fetchMock.mock.calls.map(([input]) => input);
    expect(fetched).not.toContain(CHUNKS[0]);
    expect(fetched).toContain(CHUNKS[1]);
    expect(fetched).toContain('/web-app-manifest-192x192.png');
    const cache = await worker.staticCache();
    expect(await cache.entries.get(CHUNKS[0])?.text()).toBe('old-build-copy');
    expect(await cache.entries.get('/web-app-manifest-192x192.png')?.text()).toBe('body of /web-app-manifest-192x192.png');
    expect((await worker.shell()).entries.has('/__offline-cache-complete__')).toBe(true);
  });

  it('downloads again when the earlier copy fails validation', async () => {
    const stores = previousBuildStores({ [CHUNKS[0]]: asset(CHUNKS[0], 'text/html', '<html>login</html>') });
    const worker = loadWorker(async (url) => serve(url), { precache: [CHUNKS[0]], stores });

    await worker.install();

    expect(worker.fetchMock.mock.calls.map(([input]) => input)).toContain(CHUNKS[0]);
    expect(await (await worker.staticCache()).entries.get(CHUNKS[0])?.text()).toBe(`body of ${CHUNKS[0]}`);
  });

  it('stays all-or-nothing: one invalid response fails the install and writes no marker', async () => {
    const worker = loadWorker(async (url) => {
      if (url === CHUNKS[3]) return asset(CHUNKS[3], 'text/html', 'redirected to /access');
      return serve(url);
    }, { precache: CHUNKS });

    await expect(worker.install()).rejects.toThrow(`Required offline resource failed validation: ${CHUNKS[3]}`);
    expect((await worker.shell()).entries.has('/__offline-cache-complete__')).toBe(false);
    // Lanes stop taking new work once a task has failed.
    expect(worker.fetchMock.mock.calls.length).toBeLessThan(CHUNKS.length + 2);
  });
});
