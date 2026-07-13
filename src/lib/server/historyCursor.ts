const RFC3339 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/;

export type HistoryCursor = { createdAt: string; id: number };

export function historyPageLimit(value: string | null) {
  if (value === null) return 50;
  if (!/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 1 && parsed <= 100 ? parsed : null;
}

export function encodeHistoryCursor(cursor: HistoryCursor) {
  return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64url');
}

export function decodeHistoryCursor(value: string | null): HistoryCursor | null | undefined {
  if (value === null) return null;
  try {
    const parsed = JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as Partial<HistoryCursor>;
    if (typeof parsed.createdAt !== 'string' || !RFC3339.test(parsed.createdAt) || !Number.isFinite(Date.parse(parsed.createdAt))) return undefined;
    if (!Number.isSafeInteger(parsed.id) || (parsed.id ?? 0) < 1) return undefined;
    return { createdAt: parsed.createdAt, id: parsed.id! };
  } catch {
    return undefined;
  }
}
