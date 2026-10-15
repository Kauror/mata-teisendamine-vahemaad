import { csrfHeaders } from '@/lib/auth/client';

// Framework-free plumbing for the parent area, so it can be unit-tested in the
// node test runner: the CSRF request wrapper, de-duplicated JSON loads, the
// one-write-at-a-time guard and the revision bus panels use to refresh each
// other's numbers after a mutation.

export type ParentRequest = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

type RequestOptions = {
  fetchImpl?: typeof globalThis.fetch;
  headers?: (headers: HeadersInit | undefined) => HeadersInit;
  // A 401 means the parent (or family) session is gone. The /vanem page decides
  // on the server whether to show the hub or the login form, so a reload is
  // what takes the parent back to the password field.
  onUnauthorized?: () => void;
};

export function createParentRequest({ fetchImpl, headers, onUnauthorized }: RequestOptions = {}): ParentRequest {
  let signedOut = false;
  return async (input, init = {}) => {
    const send = fetchImpl ?? globalThis.fetch;
    const response = await send(input, { ...init, headers: headers ? headers(init.headers) : csrfHeaders(init.headers, 'parent_csrf') });
    if (response.status === 401 && !signedOut && onUnauthorized) {
      signedOut = true;
      onUnauthorized();
    }
    return response;
  };
}

function reloadToLogin() {
  if (typeof window !== 'undefined') window.location.reload();
}

// Parent APIs require the parent-session double-submit token. Every request in
// the parent area — including DELETE/PATCH calls with no JSON body, and the
// vocabulary admin — goes through this one wrapper.
export const parentFetch: ParentRequest = createParentRequest({ onUnauthorized: reloadToLogin });

// Two panels that need the same endpoint at the same moment (the approvals
// list and the star balances both read /api/parent/dashboard) share one
// request instead of sending two.
export function createJsonLoader(request: ParentRequest) {
  const inFlight = new Map<string, Promise<unknown>>();
  return function getJson<T = unknown>(url: string): Promise<T> {
    const pending = inFlight.get(url);
    if (pending) return pending as Promise<T>;
    const promise = request(url)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`load-failed:${url}`))))
      .finally(() => inFlight.delete(url));
    inFlight.set(url, promise);
    return promise as Promise<T>;
  };
}

// One write at a time across the whole parent area. The flag is checked and
// set synchronously, so a fast double tap cannot POST twice (two identical
// tasks or shop items) in the gap before React re-renders disabled controls.
export function createSaveGuard(onSavingChange: (saving: boolean) => void, onFailure: () => void) {
  let saving = false;
  return {
    get saving() { return saving; },
    async run(action: () => Promise<void>) {
      if (saving) return;
      saving = true;
      onSavingChange(true);
      try {
        await action();
      } catch {
        onFailure();
      } finally {
        saving = false;
        onSavingChange(false);
      }
    }
  };
}

// The data a panel can show. A panel subscribes to the topics it reads and
// re-fetches when one is invalidated; a mutation invalidates exactly the
// topics whose numbers it changes (see PARENT_INVALIDATIONS).
export type ParentTopic = 'dashboard' | 'heldRewards' | 'taskReviews' | 'monthly' | 'freeze' | 'weekly' | 'store' | 'library' | 'learning' | 'rewards';

export const PARENT_RESOURCE_URLS: Record<ParentTopic, string> = {
  dashboard: '/api/parent/dashboard',
  heldRewards: '/api/parent/held-rewards',
  taskReviews: '/api/parent/task-reviews',
  monthly: '/api/parent/monthly-prize',
  freeze: '/api/parent/streak-freeze',
  weekly: '/api/parent/weekly-digest',
  store: '/api/parent/store',
  library: '/api/parent/learning-exercises',
  learning: '/api/parent/learning-settings',
  rewards: '/api/parent/reward-rules'
};

// Which panels' numbers each mutation changes. The dashboard holds the star
// balances, the chore templates and the pending approvals; the monthly prize
// holds the trophy standing; the weekly digest sums stars, trophies and
// exercises. Mutations whose response carries the new state (reward rules,
// learning settings, library status) update in place and need no entry.
export const PARENT_INVALIDATIONS = {
  taskApproval: ['dashboard', 'weekly'],
  heldReward: ['heldRewards', 'dashboard', 'monthly', 'weekly'],
  taskReview: ['taskReviews', 'dashboard', 'weekly'],
  starAdjust: ['dashboard', 'weekly'],
  trophyAdjust: ['monthly', 'weekly'],
  freezeGrant: ['freeze'],
  taskTemplate: ['dashboard'],
  storeItem: ['store'],
  library: ['library']
} as const satisfies Record<string, readonly ParentTopic[]>;

export type ParentMutation = keyof typeof PARENT_INVALIDATIONS;

export class ParentRevisionBus {
  private revisions = new Map<ParentTopic, number>();
  private listeners = new Set<() => void>();

  revision(topic: ParentTopic) {
    return this.revisions.get(topic) ?? 0;
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };

  invalidate(...topics: readonly ParentTopic[]) {
    if (topics.length === 0) return;
    for (const topic of new Set(topics)) this.revisions.set(topic, this.revision(topic) + 1);
    for (const listener of [...this.listeners]) listener();
  }

  after(mutation: ParentMutation) {
    this.invalidate(...PARENT_INVALIDATIONS[mutation]);
  }
}

// Reads the server's message from a failed response, falling back to the
// screen's own wording.
export async function failureMessage(response: Response, fallback: string) {
  const body = await response.json().catch(() => ({})) as { message?: unknown };
  return typeof body.message === 'string' && body.message ? body.message : fallback;
}

export function jsonInit(method: string, body: unknown): RequestInit {
  return { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}
