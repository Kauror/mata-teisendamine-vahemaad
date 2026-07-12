import type { PingResponse } from '@/lib/shared/types';
import { setServerOffsetMs } from '@/lib/offline/meta';
import { csrfHeaders } from '@/lib/auth/client';

// navigator.onLine is only a hint; real reachability is proven by the ping
// endpoint, which also lets us estimate the device/server clock offset.

export function isOnlineHint(): boolean {
  return typeof navigator === 'undefined' ? true : navigator.onLine;
}

export async function pingServer(timeoutMs = 5000, externalSignal?: AbortSignal): Promise<PingResponse | null> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return null;
  const controller = new AbortController();
  const onExternalAbort = () => controller.abort(externalSignal?.reason);
  externalSignal?.addEventListener('abort', onExternalAbort, { once: true });
  const timer = setTimeout(() => controller.abort(new DOMException('Ping timed out.', 'TimeoutError')), timeoutMs);
  try {
    const before = Date.now();
    const res = await fetch('/api/offline/ping', { signal: controller.signal, cache: 'no-store', headers: csrfHeaders() });
    if (!res.ok) return null;
    const after = Date.now();
    const body = (await res.json()) as PingResponse;
    if (!body?.serverTime) return null;
    // Offset estimate assuming symmetric round-trip.
    const serverMs = new Date(body.serverTime).getTime();
    const offset = serverMs - (before + (after - before) / 2);
    if (Number.isFinite(offset)) await setServerOffsetMs(offset);
    return body;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener('abort', onExternalAbort);
  }
}
