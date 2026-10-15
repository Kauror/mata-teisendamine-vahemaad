import { describe, expect, it, vi } from 'vitest';
import { createJsonLoader, createParentRequest, createSaveGuard, failureMessage, PARENT_INVALIDATIONS, PARENT_RESOURCE_URLS, ParentRevisionBus, type ParentTopic } from './parentApi';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('createParentRequest', () => {
  it('adds the CSRF header to every request, including bodiless DELETEs', async () => {
    const fetchImpl = vi.fn(async () => json({ ok: true }));
    const request = createParentRequest({ fetchImpl, headers: (headers) => ({ ...Object.fromEntries(new Headers(headers).entries()), 'x-csrf-token': 't0k' }) });
    await request('/api/parent/tasks/1', { method: 'DELETE' });
    await request('/api/parent/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    const calls = fetchImpl.mock.calls as unknown as Array<[string, RequestInit]>;
    expect(calls[0][1]).toMatchObject({ method: 'DELETE', headers: { 'x-csrf-token': 't0k' } });
    expect(calls[1][1].headers).toMatchObject({ 'content-type': 'application/json', 'x-csrf-token': 't0k' });
  });

  it('sends the parent back to the login form once on a 401', async () => {
    const onUnauthorized = vi.fn();
    const request = createParentRequest({ fetchImpl: async () => json({ message: 'Ligipääs puudub.' }, 401), headers: () => ({}), onUnauthorized });
    const response = await request('/api/parent/dashboard');
    await request('/api/parent/store');
    expect(response.status).toBe(401);
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it('does not sign out on other failures', async () => {
    const onUnauthorized = vi.fn();
    const request = createParentRequest({ fetchImpl: async () => json({}, 400), headers: () => ({}), onUnauthorized });
    await request('/api/parent/password', { method: 'POST' });
    expect(onUnauthorized).not.toHaveBeenCalled();
  });
});

describe('createJsonLoader', () => {
  it('shares one request between panels asking for the same endpoint at once', async () => {
    const request = vi.fn(async () => json({ balances: { kiur: 3, kirsi: 1 } }));
    const getJson = createJsonLoader(request);
    const [a, b] = await Promise.all([getJson('/api/parent/dashboard'), getJson('/api/parent/dashboard')]);
    expect(request).toHaveBeenCalledTimes(1);
    expect(a).toEqual(b);
  });

  it('requests again once the earlier request has settled', async () => {
    const request = vi.fn(async () => json({}));
    const getJson = createJsonLoader(request);
    await getJson('/api/parent/store');
    await getJson('/api/parent/store');
    expect(request).toHaveBeenCalledTimes(2);
  });

  it('rejects a failed response and does not keep it cached', async () => {
    const request = vi.fn().mockResolvedValueOnce(json({}, 500)).mockResolvedValueOnce(json({ ok: 1 }));
    const getJson = createJsonLoader(request);
    await expect(getJson('/api/parent/weekly-digest')).rejects.toThrow();
    await expect(getJson('/api/parent/weekly-digest')).resolves.toEqual({ ok: 1 });
  });
});

describe('createSaveGuard', () => {
  it('drops a second write while the first is in flight (no double submit)', async () => {
    const changes: boolean[] = [];
    const guard = createSaveGuard((saving) => changes.push(saving), () => {});
    let release!: () => void;
    const action = vi.fn(() => new Promise<void>((resolve) => { release = resolve; }));
    const first = guard.run(action);
    const second = guard.run(action);
    expect(guard.saving).toBe(true);
    release();
    await Promise.all([first, second]);
    expect(action).toHaveBeenCalledTimes(1);
    expect(changes).toEqual([true, false]);
    expect(guard.saving).toBe(false);
  });

  it('reports a thrown action as a failure and frees the guard', async () => {
    const onFailure = vi.fn();
    const guard = createSaveGuard(() => {}, onFailure);
    await guard.run(async () => { throw new Error('network'); });
    expect(onFailure).toHaveBeenCalledTimes(1);
    const next = vi.fn(async () => {});
    await guard.run(next);
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe('ParentRevisionBus', () => {
  it('bumps only the invalidated topics and notifies subscribers once', () => {
    const bus = new ParentRevisionBus();
    const listener = vi.fn();
    const unsubscribe = bus.subscribe(listener);
    bus.invalidate('dashboard', 'weekly', 'dashboard');
    expect(bus.revision('dashboard')).toBe(1);
    expect(bus.revision('weekly')).toBe(1);
    expect(bus.revision('store')).toBe(0);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    bus.invalidate('store');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('a ± star refreshes balances and the digest, not the shop or library', () => {
    const bus = new ParentRevisionBus();
    bus.after('starAdjust');
    expect(bus.revision('dashboard')).toBe(1);
    expect(bus.revision('weekly')).toBe(1);
    for (const topic of ['store', 'library', 'learning', 'rewards', 'monthly', 'freeze', 'heldRewards', 'taskReviews'] as ParentTopic[]) {
      expect(bus.revision(topic)).toBe(0);
    }
  });

  it('approving anything that pays stars refreshes the balances', () => {
    for (const mutation of ['taskApproval', 'heldReward', 'taskReview'] as const) {
      expect(PARENT_INVALIDATIONS[mutation]).toContain('dashboard');
    }
    expect(PARENT_INVALIDATIONS.heldReward).toContain('heldRewards');
    expect(PARENT_INVALIDATIONS.taskReview).toContain('taskReviews');
    expect(PARENT_INVALIDATIONS.trophyAdjust).toContain('monthly');
  });

  it('every topic has an endpoint', () => {
    for (const topics of Object.values(PARENT_INVALIDATIONS)) {
      for (const topic of topics) expect(PARENT_RESOURCE_URLS[topic]).toMatch(/^\/api\/parent\//);
    }
  });
});

describe('failureMessage', () => {
  it('prefers the server message and falls back to the screen wording', async () => {
    expect(await failureMessage(json({ message: 'Liiga pikk nimi.' }, 400), 'Tegevust ei saanud salvestada.')).toBe('Liiga pikk nimi.');
    expect(await failureMessage(new Response('not json', { status: 500 }), 'Tegevust ei saanud salvestada.')).toBe('Tegevust ei saanud salvestada.');
  });
});
