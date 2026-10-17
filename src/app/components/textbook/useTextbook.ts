'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { csrfHeaders } from '@/lib/auth/client';
import { PEEK_READ_ONLY_MESSAGE } from '@/lib/peekMode';
import type { PracticeSessionView, TestSessionView, TextbookScope } from '@/lib/textbook/api';
import { parentFetch } from '@/app/components/parent/parentApi';
import { readPeekMode, usePeekMode } from '@/app/components/usePeekMode';
import {
  createLearnerClient,
  newActionId,
  type LearnerClient,
  type TextbookClientError,
  type TextbookRequest,
  type TextbookResult
} from '@/app/components/textbook/textbookClient';

// Child routes carry the family CSRF token; preview routes are parent routes
// and go through the parent wrapper (parent CSRF + "signed out → reload").
const childRequest: TextbookRequest = (input, init = {}) => fetch(input, { ...init, headers: csrfHeaders(init.headers, 'app_csrf') });

export function textbookRequest(scope: TextbookScope): TextbookRequest {
  return scope === 'child' ? childRequest : (input, init) => parentFetch(input, init);
}

export function useLearnerClient(scope: TextbookScope): LearnerClient {
  return useMemo(() => createLearnerClient(scope, textbookRequest(scope)), [scope]);
}

export const PEEK_ERROR: TextbookClientError = { code: 'forbidden', status: 403, message: PEEK_READ_ONLY_MESSAGE, retryable: false };

// A parent peeking at the child's screen may look but not write. The preview
// scope is the parent's own isolated learner, so it is never blocked.
export function writesBlocked(scope: TextbookScope) {
  return scope === 'child' && readPeekMode();
}

/* ------------------------------------------------------------ loading */

export function useTextbookLoad<T>(load: () => Promise<TextbookResult<T>>, deps: readonly unknown[]) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<TextbookClientError | null>(null);
  const [loading, setLoading] = useState(true);
  const loadRef = useRef(load);
  loadRef.current = load;
  const generation = useRef(0);

  const reload = useCallback(async () => {
    const mine = ++generation.current;
    setLoading(true);
    setError(null);
    const result = await loadRef.current();
    if (mine !== generation.current) return;
    if (result.ok) setData(result.data);
    else setError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the caller lists what the load depends on.
  }, [reload, ...deps]);

  return { data, setData, error, loading, reload };
}

/* ----------------------------------------------------------- sessions */

type SessionView = PracticeSessionView | TestSessionView;

export type SessionRunnerConfig<V extends SessionView> = {
  scope: TextbookScope;
  unitId: string;
  // Starts or resumes the unit's run (POST, so it carries an actionId).
  start: (actionId: string) => Promise<TextbookResult<V>>;
  // Re-reads a known session (?session=… in the URL).
  fetchSession: (sessionId: string) => Promise<TextbookResult<V>>;
};

// One resumable server session (practice or test), the same way the English
// vocabulary sessions work:
//  - the session id lives in the URL (?session=…), so a reload or a closed tab
//    comes back to the same run;
//  - actions are queued, one at a time; each carries an actionId and the last
//    revision seen; a transport failure is retried with the same actionId;
//  - a 409 that carries the current session (another tab moved it on) is
//    adopted instead of shown as an error;
//  - while a parent peeks, nothing is started or answered.
export function useSessionRunner<V extends SessionView>(config: SessionRunnerConfig<V>) {
  const [view, setView] = useState<V | null>(null);
  const [error, setError] = useState<TextbookClientError | null>(null);
  const [busy, setBusy] = useState(false);
  const viewRef = useRef<V | null>(null);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const configRef = useRef(config);
  configRef.current = config;
  const peeking = usePeekMode();
  const { scope, unitId } = config;

  const adopt = useCallback((next: V) => {
    viewRef.current = next;
    setView(next);
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get('session') !== next.sessionId) {
        url.searchParams.set('session', next.sessionId);
        window.history.replaceState(window.history.state, '', url.toString());
      }
    } catch {
      // No URL to update (tests): the server still resumes the active run.
    }
  }, []);

  const load = useCallback(async () => {
    setError(null);
    if (writesBlocked(scope)) {
      setError(PEEK_ERROR);
      return;
    }
    const { start, fetchSession } = configRef.current;
    let result: TextbookResult<V> | null = null;
    const url = new URL(window.location.href);
    const existing = url.searchParams.get('session');
    if (existing) {
      result = await fetchSession(existing);
      // A stale link (an old run, another unit): start or resume normally.
      if (!result.ok && (result.error.status === 404 || result.error.status === 403)) {
        url.searchParams.delete('session');
        window.history.replaceState(window.history.state, '', url.toString());
        result = null;
      }
    }
    if (!result || (result.ok && result.data.unitId !== unitId)) result = await start(newActionId());
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (result.data.unitId !== unitId) {
      setError({ code: 'forbidden', status: 403, message: 'See link kuulub teisele õppetükile.', retryable: false });
      return;
    }
    adopt(result.data);
  }, [adopt, scope, unitId]);

  useEffect(() => {
    void load();
  }, [load, peeking]);

  // After a failure, actions still waiting were based on a state the server
  // may not have reached: they are dropped until "Proovi uuesti" resyncs.
  const failed = useRef(false);

  // Runs one session action. `call` gets a fresh actionId and the current
  // view; `extract` picks the new session out of a successful response.
  const act = useCallback(<R,>(call: (current: V, actionId: string) => Promise<TextbookResult<R>>, extract: (data: R) => V): Promise<{ data: R | null; view: V | null }> => {
    const run = async (): Promise<{ data: R | null; view: V | null }> => {
      if (failed.current) return { data: null, view: viewRef.current };
      if (writesBlocked(scope)) {
        failed.current = true;
        setError(PEEK_ERROR);
        return { data: null, view: viewRef.current };
      }
      const current = viewRef.current;
      if (!current) return { data: null, view: null };
      setBusy(true);
      try {
        const result = await call(current, newActionId());
        if (result.ok) {
          const next = extract(result.data);
          adopt(next);
          return { data: result.data, view: next };
        }
        // Another tab (or a retried request) already moved the session on:
        // show the server's state, not an error.
        if (result.error.status === 409 && result.error.session && result.error.session.sessionId === current.sessionId) {
          const next = result.error.session as V;
          adopt(next);
          return { data: null, view: next };
        }
        failed.current = true;
        setError(result.error);
        return { data: null, view: viewRef.current };
      } finally {
        setBusy(false);
      }
    };
    const next = queue.current.then(run, run);
    queue.current = next.catch(() => null);
    return next;
  }, [adopt, scope]);

  const [retrying, setRetrying] = useState(false);

  const retry = useCallback(() => {
    void (async () => {
      setRetrying(true);
      try {
        await queue.current;
        failed.current = false;
        const current = viewRef.current;
        if (!current) {
          await load();
          return;
        }
        const result = await configRef.current.fetchSession(current.sessionId);
        if (result.ok) {
          adopt(result.data);
          setError(null);
        } else {
          failed.current = true;
          setError(result.error);
        }
      } finally {
        setRetrying(false);
      }
    })();
  }, [adopt, load]);

  // Waits for queued actions (e.g. before leaving the page).
  const flush = useCallback(() => queue.current, []);

  return { view, error, busy, act, retry, retrying, flush, reload: load };
}
