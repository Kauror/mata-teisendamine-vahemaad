'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createJsonLoader, createSaveGuard, parentFetch, PARENT_RESOURCE_URLS, ParentRevisionBus, type ParentRequest, type ParentTopic } from './parentApi';

export type ParentApi = {
  request: ParentRequest;
  getJson: <T = unknown>(url: string) => Promise<T>;
  bus: ParentRevisionBus;
  // One write at a time across every panel (see createSaveGuard).
  guarded: (action: () => Promise<void>) => Promise<void>;
  setError: (message: string) => void;
  setNotice: (message: string) => void;
};

type Toasts = { error: string; notice: string };

const ApiContext = createContext<ParentApi | null>(null);
const SavingContext = createContext(false);
const ToastContext = createContext<Toasts>({ error: '', notice: '' });

export function ParentApiProvider({ children, request = parentFetch }: { children: ReactNode; request?: ParentRequest }) {
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  // Built once: panels depend on this object in effects, so it must be stable.
  const [api] = useState<ParentApi>(() => {
    const guard = createSaveGuard(setSaving, () => setError('Toimingut ei saanud teha.'));
    return {
      request,
      getJson: createJsonLoader(request),
      bus: new ParentRevisionBus(),
      guarded: (action) => guard.run(action),
      setError,
      setNotice
    };
  });

  // Auto-hide the success toast so it fades away after a brief moment.
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 2600);
    return () => clearTimeout(timer);
  }, [notice]);

  // Errors linger a little longer than confirmations, then fade away too.
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(''), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  return (
    <ApiContext.Provider value={api}>
      <SavingContext.Provider value={saving}>
        <ToastContext.Provider value={{ error, notice }}>{children}</ToastContext.Provider>
      </SavingContext.Provider>
    </ApiContext.Provider>
  );
}

export function useParentApi(): ParentApi {
  const api = useContext(ApiContext);
  if (!api) throw new Error('useParentApi outside ParentApiProvider');
  return api;
}

export function useParentSaving() {
  return useContext(SavingContext);
}

export function ParentToasts() {
  const { error, notice } = useContext(ToastContext);
  if (!error && !notice) return null;
  return (
    <div className='parent-toast-stack'>
      {error && <div className='parent-toast parent-toast-error' role='alert' key={`e-${error}`}>{error}</div>}
      {notice && <div className='parent-toast' role='status' aria-live='polite' key={`n-${notice}`}>{notice}</div>}
    </div>
  );
}

export function useTopicRevision(topic: ParentTopic) {
  const { bus } = useParentApi();
  return useSyncExternalStore(bus.subscribe, () => bus.revision(topic), () => 0);
}

// A panel's own data: fetched when the panel mounts (an accordion section
// mounts its content only once opened) and again whenever its topic is
// invalidated — by this panel or by another one whose mutation changed it.
export function useParentResource<T>(topic: ParentTopic, parse: (body: unknown) => T | null = (body) => body as T) {
  const api = useParentApi();
  const revision = useTopicRevision(topic);
  const [data, setData] = useState<T | null>(null);
  const parseRef = useRef(parse);
  parseRef.current = parse;

  useEffect(() => {
    let cancelled = false;
    api.getJson(PARENT_RESOURCE_URLS[topic])
      .then((body) => {
        if (cancelled) return;
        const parsed = parseRef.current(body);
        if (parsed !== null) setData(parsed);
      })
      .catch(() => { if (!cancelled) api.setError('Andmeid ei saanud laadida.'); });
    return () => { cancelled = true; };
  }, [api, topic, revision]);

  return { data, setData };
}
