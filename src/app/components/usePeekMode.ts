'use client';

import { useSyncExternalStore } from 'react';
import { PEEK_OPT_OUT_STORAGE_KEY, hasPeekCookie, isPeekModeActive } from '@/lib/peekMode';

// A module-level store rather than a context: the child screens are server
// components, and the three consumers (the recap popup, the daily panel, the
// banner) sit in different subtrees but must agree instantly when the parent
// toggles the escape hatch.

const listeners = new Set<() => void>();

// getSnapshot must return a cached value — recomputing per render would loop.
let peekSnapshot: boolean | null = null;
let parentSnapshot: boolean | null = null;

function readOptOut() {
  try {
    return window.sessionStorage.getItem(PEEK_OPT_OUT_STORAGE_KEY) === '1';
  } catch {
    // sessionStorage unavailable (private mode) — no opt-out, just peek.
    return false;
  }
}

function refresh() {
  const cookieHeader = typeof document === 'undefined' ? '' : document.cookie;
  const parent = hasPeekCookie(cookieHeader);
  const peek = isPeekModeActive({ cookieHeader, optedOut: parent && readOptOut() });
  const changed = parent !== parentSnapshot || peek !== peekSnapshot;
  parentSnapshot = parent;
  peekSnapshot = peek;
  return changed;
}

function publish() {
  if (!refresh()) return;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // A soft navigation can change the cookie without remounting the tree, so
  // re-read on every mount instead of trusting the cached value forever.
  publish();
  return () => {
    listeners.delete(listener);
  };
}

function getPeekSnapshot() {
  if (peekSnapshot === null) refresh();
  return peekSnapshot as boolean;
}

function getParentSnapshot() {
  if (parentSnapshot === null) refresh();
  return parentSnapshot as boolean;
}

// The server renders every page as if nobody were peeking; the cookie is only
// read after hydration. That is deliberate — the HTML must stay identical for
// parent and child so the offline shell cache cannot be poisoned.
function getServerSnapshot() {
  return false;
}

export function setPeekOptOut(optedOut: boolean) {
  try {
    if (optedOut) window.sessionStorage.setItem(PEEK_OPT_OUT_STORAGE_KEY, '1');
    else window.sessionStorage.removeItem(PEEK_OPT_OUT_STORAGE_KEY);
  } catch {
    // Ignore storage failures; the toggle simply will not stick.
  }
  publish();
}

// True while a parent is looking and the one-shot markers must not be written.
export function usePeekMode() {
  return useSyncExternalStore(subscribe, getPeekSnapshot, getServerSnapshot);
}

// True whenever a parent session is present on this browser, opted out or not,
// so the banner can offer the way back.
export function useParentPresent() {
  return useSyncExternalStore(subscribe, getParentSnapshot, getServerSnapshot);
}
