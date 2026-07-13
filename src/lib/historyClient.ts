export type HistoryPage<T> = { items: T[]; nextCursor: string | null };

export async function fetchHistoryPage<T>(parameters: URLSearchParams | string = ''): Promise<HistoryPage<T>> {
  const query = typeof parameters === 'string' ? parameters : parameters.toString();
  const response = await fetch(`/api/history${query ? `?${query}` : ''}`, { cache: 'no-store' });
  if (!response.ok) throw new Error('history-load-failed');
  return response.json() as Promise<HistoryPage<T>>;
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
