// Keyset paging for the newest-first ledger timelines (/api/task-history and
// /api/store/history): a page is ordered by (timestamp DESC, id DESC) and the
// cursor is the last row's pair. Unlike historyCursor it accepts any stored
// timestamp text, because these rows are never re-validated on the way in.

export type TimelineCursor = { at: string; id: number };

export const TIMELINE_DEFAULT_LIMIT = 200;
export const TIMELINE_MAX_LIMIT = 500;

export function timelinePageLimit(value: string | null) {
  if (value === null) return TIMELINE_DEFAULT_LIMIT;
  if (!/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 1 && parsed <= TIMELINE_MAX_LIMIT ? parsed : null;
}

export function encodeTimelineCursor(cursor: TimelineCursor) {
  return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64url');
}

// null = no cursor (first page); undefined = malformed.
export function decodeTimelineCursor(value: string | null): TimelineCursor | null | undefined {
  if (value === null) return null;
  try {
    const parsed = JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as Partial<TimelineCursor>;
    if (typeof parsed.at !== 'string' || parsed.at.length === 0 || parsed.at.length > 64) return undefined;
    if (!Number.isSafeInteger(parsed.id) || (parsed.id ?? 0) < 1) return undefined;
    return { at: parsed.at, id: parsed.id! };
  } catch {
    return undefined;
  }
}

// Shared route logic. A request with neither `limit` nor `cursor` is a client
// built before paging existed: it still gets the whole list as a bare array, so
// an installed PWA running cached code keeps working until it updates.
export function timelineResponse<T extends { id: number }>(
  search: URLSearchParams,
  load: (options: { limit: number; before: TimelineCursor | null }) => T[],
  timestampOf: (row: T) => string
): { status: 200; body: T[] | { items: T[]; nextCursor: string | null } } | { status: 400; body: { code: string } } {
  const paged = search.has('limit') || search.has('cursor');
  if (!paged) return { status: 200, body: load({ limit: -1, before: null }) };
  const limit = timelinePageLimit(search.get('limit'));
  const before = decodeTimelineCursor(search.get('cursor'));
  if (limit === null || before === undefined) return { status: 400, body: { code: 'invalid_pagination' } };
  const rows = load({ limit: limit + 1, before });
  const items = rows.slice(0, limit);
  const last = items.at(-1);
  return {
    status: 200,
    body: { items, nextCursor: rows.length > limit && last ? encodeTimelineCursor({ at: timestampOf(last), id: last.id }) : null }
  };
}
