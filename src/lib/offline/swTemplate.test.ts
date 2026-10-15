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

function loadWorker(fetchImpl: (input: string) => Promise<Response>) {
  const listeners: Record<string, (event: unknown) => void> = {};
  const stores = new Map<string, FakeCache>();
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
  const manifest = { manifestVersion: 5, shellRoutes: ['/kiur', '/offline'], publicAssets: [] };
  const source = fs.readFileSync(path.join(process.cwd(), 'scripts', 'sw-template.js'), 'utf8')
    .replace('__BUILD_ID__', BUILD)
    .replace('__PRECACHE__', '[]')
    .replace('__CAPABILITY_MANIFEST__', JSON.stringify(manifest));
  // Navigations pass the request object; install passes a path string.
  const fetchMock = vi.fn((input: string | { url: string }) => fetchImpl(typeof input === 'string' ? input : input.url));
  new Function('self', 'caches', 'fetch', source)(self, caches, fetchMock);
  const shell = () => caches.open(`harjutaja-shell-${BUILD}`);

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

  return { navigate, install, shell, fetchMock };
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

describe('service worker install shell validation (OFF-03)', () => {
  it('rejects installation when a shell route was rendered by another build', async () => {
    const worker = loadWorker(async (url) => page(new URL(url, ORIGIN).pathname, 'build-c'));
    await expect(worker.install()).rejects.toThrow(/another build/);
  });

  it.each([['its own build id', BUILD], ['no build header', null]] as const)('installs shells with %s', async (_label, buildId) => {
    const worker = loadWorker(async (url) => page(new URL(url, ORIGIN).pathname, buildId));
    await worker.install();
    const cache = await worker.shell();
    expect(cache.entries.has('/kiur')).toBe(true);
    expect(cache.entries.has('/__offline-cache-complete__')).toBe(true);
  });
});
