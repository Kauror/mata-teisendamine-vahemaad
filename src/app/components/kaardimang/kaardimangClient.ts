// The browser side of the Kaardimäng API (lib/kaardimang/api.ts). Online only:
// a request that cannot be sent is an honest 'offline' error, never a queued
// write. A mutation lost in transit is retried with the SAME body (same
// actionId), so the server applies it at most once.

import { csrfHeaders } from '@/lib/auth/client';
import { ACTION_ID_PATTERN } from '@/lib/textbook/api';
import { mapUrl, seasPath, type LevelId } from '@/content/kaardimang/regions';
import type { KaardimangPlayer } from '@/lib/kaardimang/competition';
import type { MapViewData, SeasOverlay } from '@/content/kaardimang/types';
import {
  KAARDIMANG_PARENT_API,
  kaardimangApi,
  type AnswerRequest,
  type AnswerResponse,
  type DismissNoticeRequest,
  type KaardimangErrorResponse,
  type KaardimangScope,
  type NoticesResponse,
  type OverviewResponse,
  type ParentCompetitionResponse,
  type ParentKaardimangResponse,
  type RoundView,
  type StartRoundRequest
} from '@/lib/kaardimang/api';

export type ClientError = { code: string; status: number; message: string; round?: RoundView };
export type Result<T> = { ok: true; data: T } | { ok: false; error: ClientError };

export const OFFLINE_MESSAGE = 'Kaardimäng vajab internetiühendust. Kontrolli ühendust ja proovi uuesti.';

export function newActionId(): string {
  const id = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `a${Date.now().toString(36)}${Math.random().toString(36).slice(2, 14)}`;
  return ACTION_ID_PATTERN.test(id) ? id : `a${Date.now().toString(36)}${Math.random().toString(36).slice(2, 14)}`;
}

const RETRY_DELAYS_MS = [400, 900];

async function send<T>(scope: KaardimangScope | 'parent', url: string, init: RequestInit, retries: number): Promise<Result<T>> {
  const headers = csrfHeaders(init.headers, scope === 'child' ? 'app_csrf' : 'parent_csrf');
  for (let attempt = 0; ; attempt += 1) {
    let response: Response;
    try {
      response = await fetch(url, { ...init, headers });
    } catch {
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt] ?? 1200));
        continue;
      }
      return { ok: false, error: { code: 'offline', status: 0, message: OFFLINE_MESSAGE } };
    }
    const body = await response.json().catch(() => null) as unknown;
    if (response.ok) return { ok: true, data: body as T };
    const record = (body && typeof body === 'object' ? body : {}) as Partial<KaardimangErrorResponse>;
    return {
      ok: false,
      error: {
        code: typeof record.code === 'string' ? record.code : 'unknown',
        status: response.status,
        message: typeof record.message === 'string' && record.message ? record.message : 'Midagi läks valesti. Proovi uuesti.',
        ...(record.round ? { round: record.round } : {})
      }
    };
  }
}

const get = <T,>(scope: KaardimangScope | 'parent', url: string) => send<T>(scope, url, { method: 'GET', cache: 'no-store' }, 0);
const post = <T,>(scope: KaardimangScope | 'parent', url: string, body: unknown) =>
  send<T>(scope, url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }, RETRY_DELAYS_MS.length);

export function createKaardimangClient(scope: KaardimangScope, player: KaardimangPlayer | null = null) {
  const routes = kaardimangApi(scope, player);
  return {
    overview: () => get<OverviewResponse>(scope, routes.overview),
    start: (body: StartRoundRequest) => post<RoundView>(scope, routes.start, body),
    round: (roundId: string) => get<RoundView>(scope, routes.round(roundId)),
    answer: (roundId: string, body: AnswerRequest) => post<AnswerResponse>(scope, routes.answer(roundId), body),
    // Starts the question's speed clock; a lost one only costs the speed point.
    shown: (roundId: string, questionIndex: number) => send<{ ok: true }>(scope, routes.shown(roundId), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ questionIndex }) }, 0),
    // The player closed a one-shot notice (idempotent, so retried).
    dismissNotice: (body: DismissNoticeRequest) => post<NoticesResponse>(scope, routes.notices, body)
  };
}

export type CompetitionAction =
  | { action: 'create'; title: string; views: string[]; days: number; rewards: [number, number, number] }
  | { action: 'end'; id: number }
  | { action: 'cancel'; id: number }
  | { action: 'delete'; id: number }
  | { action: 'extend'; id: number; days: number };

export const parentKaardimangClient = {
  overview: () => get<ParentKaardimangResponse>('parent', KAARDIMANG_PARENT_API.overview),
  resetPreview: () => post<{ deletedRounds: number }>('parent', KAARDIMANG_PARENT_API.previewReset, { actionId: newActionId() }),
  competition: () => get<ParentCompetitionResponse>('parent', KAARDIMANG_PARENT_API.competition),
  // Not retried: creating twice would be refused anyway, and ending is final.
  changeCompetition: (body: CompetitionAction) => send<ParentCompetitionResponse>('parent', KAARDIMANG_PARENT_API.competition, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }, 0),
  setLevel: (player: KaardimangPlayer, level: LevelId) => post<ParentCompetitionResponse>('parent', KAARDIMANG_PARENT_API.levels, { player, level })
};

// Map files are immutable per data version: fetch each once per page.
const mapCache = new Map<string, Promise<MapViewData>>();
export function loadMap(viewId: string): Promise<MapViewData> {
  let pending = mapCache.get(viewId);
  if (!pending) {
    const fetchJson = <T,>(url: string) => fetch(url).then((response) => {
      if (!response.ok) throw new Error(`map ${url}: ${response.status}`);
      return response.json() as Promise<T>;
    });
    // The world map carries the sea outlines (a separate file) after its oceans.
    pending = viewId === 'world'
      ? Promise.all([fetchJson<MapViewData>(mapUrl(viewId)), fetchJson<SeasOverlay>(`/${seasPath()}`)])
        .then(([map, seas]) => ({ ...map, areas: [...map.areas, ...seas.areas], labels: { ...map.labels, ...seas.labels } }))
      : fetchJson<MapViewData>(mapUrl(viewId));
    pending.catch(() => mapCache.delete(viewId));
    mapCache.set(viewId, pending);
  }
  return pending;
}
