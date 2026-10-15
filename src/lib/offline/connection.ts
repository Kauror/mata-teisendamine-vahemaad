import type { PingResponse } from '@/lib/shared/types';
import { setServerOffsetMs } from '@/lib/offline/meta';
import { csrfHeaders } from '@/lib/auth/client';

// navigator.onLine is only a hint; real reachability is proven by the ping
// endpoint, which also lets us estimate the device/server clock offset.

export function isOnlineHint(): boolean {
  return typeof navigator === 'undefined' ? true : navigator.onLine;
}

// An expired family session answers the ping with 401 (middleware). That is a
// reachable server refusing us, not an outage: callers must surface "enter the
// PIN again" instead of "no internet", or queued results never get a reason.
export type PingResult =
  | { status: 'reachable'; ping: PingResponse }
  | { status: 'unauthorized'; httpStatus: number }
  | { status: 'unreachable' };

export async function pingServer(timeoutMs = 5000, externalSignal?: AbortSignal): Promise<PingResult> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return { status: 'unreachable' };
  const controller = new AbortController();
  const onExternalAbort = () => controller.abort(externalSignal?.reason);
  externalSignal?.addEventListener('abort', onExternalAbort, { once: true });
  const timer = setTimeout(() => controller.abort(new DOMException('Ping timed out.', 'TimeoutError')), timeoutMs);
  try {
    const before = Date.now();
    const res = await fetch('/api/offline/ping', { signal: controller.signal, cache: 'no-store', headers: csrfHeaders() });
    if (res.status === 401 || res.status === 403) return { status: 'unauthorized', httpStatus: res.status };
    if (!res.ok) return { status: 'unreachable' };
    const after = Date.now();
    const body = (await res.json()) as PingResponse;
    if (!body?.serverTime) return { status: 'unreachable' };
    // Offset estimate assuming symmetric round-trip.
    const serverMs = new Date(body.serverTime).getTime();
    const offset = serverMs - (before + (after - before) / 2);
    if (Number.isFinite(offset)) await setServerOffsetMs(offset);
    return { status: 'reachable', ping: body };
  } catch {
    return { status: 'unreachable' };
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener('abort', onExternalAbort);
  }
}
