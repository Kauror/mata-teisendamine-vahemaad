'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { SessionActionInput, SessionView } from '@/lib/server/vocabulary/sessions';
import type { VocabMode } from '@/lib/vocabulary/types';

// Client side of a vocabulary session. The server holds the state; this hook
// only loads it, sends the child's actions one at a time and shows whatever the
// server answers.
//
//  - The session id is kept in the URL (?session=…), so a reload or a closed
//    tab comes back to the very same session, even a finished one.
//  - Actions are queued, never sent in parallel, and each carries an id. A
//    request that failed in transit is retried with the same id, which the
//    server recognises, so a flaky connection can never count an answer twice.
//  - If another tab moved the session on, the server's newer state is adopted.

export type VocabSessionError = { message: string; retryable: boolean };

type ErrorBody = { message?: string; code?: string; session?: SessionView };

function newActionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `a${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

const OFFLINE_MESSAGE = 'Sõnavara vajab internetiühendust. Kontrolli ühendust ja proovi uuesti.';

export function useVocabSession(start: { unitId: string | null; mode: VocabMode }) {
  const [view, setView] = useState<SessionView | null>(null);
  const [error, setError] = useState<VocabSessionError | null>(null);
  const [busy, setBusy] = useState(false);
  const viewRef = useRef<SessionView | null>(null);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const { unitId, mode } = start;

  const adopt = useCallback((next: SessionView) => {
    viewRef.current = next;
    setView(next);
  }, []);

  const load = useCallback(async () => {
    setError(null);
    try {
      const url = new URL(window.location.href);
      const existing = url.searchParams.get('session');
      let response: Response;
      if (existing) {
        response = await fetch(`/api/english/sessions/${encodeURIComponent(existing)}`, { cache: 'no-store' });
        // A stale link (another child's session, an id from an old database):
        // fall back to starting or resuming normally.
        if (response.status === 404) {
          url.searchParams.delete('session');
          window.history.replaceState(null, '', url.toString());
          response = await fetch('/api/english/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ unitId, mode }) });
        }
      } else {
        response = await fetch('/api/english/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ unitId, mode }) });
      }
      const body = await readJson(response);
      if (!response.ok) {
        setError({ message: (body as ErrorBody).message ?? 'Harjutust ei saanud avada.', retryable: response.status >= 500 });
        return;
      }
      const session = body as SessionView;
      if (session.mode !== mode || (unitId && session.unit?.id !== unitId)) {
        setError({ message: 'See link kuulub teisele harjutusele.', retryable: false });
        return;
      }
      if (url.searchParams.get('session') !== session.id) {
        url.searchParams.set('session', session.id);
        window.history.replaceState(null, '', url.toString());
      }
      adopt(session);
    } catch {
      setError({ message: OFFLINE_MESSAGE, retryable: true });
    }
  }, [adopt, mode, unitId]);

  useEffect(() => {
    void load();
  }, [load]);

  // Set when an action fails. Actions still waiting in the queue were based on
  // a state the server may never have reached, so they are dropped rather
  // than sent; "Proovi uuesti" reloads the server's state and clears it.
  const failed = useRef(false);

  const fail = useCallback((next: VocabSessionError) => {
    failed.current = true;
    setError(next);
  }, []);

  const send = useCallback((action: SessionActionInput): Promise<SessionView | null> => {
    const run = async (): Promise<SessionView | null> => {
      if (failed.current) return null;
      const current = viewRef.current;
      if (!current || current.status !== 'active') return current;
      const actionId = newActionId();
      setBusy(true);
      try {
        for (let attempt = 0; attempt < 3; attempt += 1) {
          try {
            const response = await fetch(`/api/english/sessions/${encodeURIComponent(current.id)}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ actionId, revision: current.revision, action })
            });
            const body = await readJson(response) as SessionView & ErrorBody;
            if (response.ok) {
              adopt(body);
              return body;
            }
            if (response.status === 409 && body.session) {
              adopt(body.session);
              return body.session;
            }
            // Anything else: show it, and let "Proovi uuesti" resync from the
            // server — only a closed or missing exercise cannot be retried.
            fail({ message: body.message ?? 'Vastust ei saanud salvestada.', retryable: response.status !== 403 && response.status !== 404 });
            return null;
          } catch {
            // Lost in transit: the same actionId is safe to send again.
            await new Promise((resolve) => window.setTimeout(resolve, 400 * (attempt + 1)));
          }
        }
        fail({ message: OFFLINE_MESSAGE, retryable: true });
        return null;
      } finally {
        setBusy(false);
      }
    };
    const next = queue.current.then(run, run);
    queue.current = next.catch(() => null);
    return next;
  }, [adopt, fail]);

  // The error stays on screen until the server's state is back, so nothing
  // can be tapped against a session that has not been resynced yet.
  const [retrying, setRetrying] = useState(false);

  const retry = useCallback(() => {
    // Let anything still queued drain (it is skipped while `failed` is set),
    // then start again from the server's state.
    const resync = async () => {
      setRetrying(true);
      try {
        await queue.current;
        if (!viewRef.current) {
          failed.current = false;
          await load();
          return;
        }
        const response = await fetch(`/api/english/sessions/${encodeURIComponent(viewRef.current.id)}`, { cache: 'no-store' });
        const body = await readJson(response) as SessionView & ErrorBody;
        if (!response.ok) {
          setError({ message: body.message ?? OFFLINE_MESSAGE, retryable: response.status !== 403 && response.status !== 404 });
          return;
        }
        failed.current = false;
        adopt(body);
        setError(null);
      } catch {
        setError({ message: OFFLINE_MESSAGE, retryable: true });
      } finally {
        setRetrying(false);
      }
    };
    void resync();
  }, [adopt, load]);

  return { view, error, busy, send, retry, retrying };
}
