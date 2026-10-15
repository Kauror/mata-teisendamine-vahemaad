export type HistoryPage<T> = { items: T[]; nextCursor: string | null };

export async function fetchHistoryPage<T>(parameters: URLSearchParams | string = ''): Promise<HistoryPage<T>> {
  const query = typeof parameters === 'string' ? parameters : parameters.toString();
  const response = await fetch(`/api/history${query ? `?${query}` : ''}`, { cache: 'no-store' });
  if (!response.ok) throw new Error('history-load-failed');
  return response.json() as Promise<HistoryPage<T>>;
}

// Every row of a paged newest-first timeline (/api/task-history,
// /api/store/history). The history page shows them all, grouped by month, so
// each request is bounded but the list is the complete one, as before.
export async function fetchWholeTimeline<T>(path: string, pageSize = 200, maxPages = 100): Promise<T[]> {
  const rows: T[] = [];
  let cursor: string | null = null;
  for (let page = 0; page < maxPages; page++) {
    const parameters = new URLSearchParams({ limit: String(pageSize) });
    if (cursor) parameters.set('cursor', cursor);
    const response = await fetch(`${path}?${parameters.toString()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('timeline-load-failed');
    const body = await response.json() as HistoryPage<T>;
    rows.push(...body.items);
    cursor = body.nextCursor;
    if (!cursor) break;
  }
  return rows;
}

export async function fetchAllFilteredHistory<T>(filters: Record<string, string>) {
  const rows: T[] = [];
  let cursor: string | null = null;
  do {
    const parameters = new URLSearchParams({ ...filters, limit: '100' });
    if (cursor) parameters.set('cursor', cursor);
    const page = await fetchHistoryPage<T>(parameters);
    rows.push(...page.items);
    cursor = page.nextCursor;
  } while (cursor);
  return rows;
}
