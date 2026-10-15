import { describe, expect, it } from 'vitest';
import { mergeLocalHistoryRows, type MergeableHistoryRow } from '@/lib/offline/historyMerge';

type Row = MergeableHistoryRow & { createdAt: string };

const server = (id: number, clientAttemptId?: string): Row => ({ id, clientAttemptId, createdAt: `2026-07-${String(id).padStart(2, '0')}` });

describe('history revision merge (OFF-05)', () => {
  it('keeps rows from "Laadi rohkem" pages that the local window does not hold', () => {
    const shown = [server(30), server(29), server(5), server(4)]; // 5 and 4 came from a loaded page
    const fresh = [server(30), server(29)];

    expect(mergeLocalHistoryRows(shown, fresh).map((row) => row.id).sort((a, b) => b - a)).toEqual([30, 29, 5, 4]);
  });

  it('replaces a pending row by its confirmed copy instead of showing both', () => {
    const shown: Row[] = [server(30), { id: -1, clientAttemptId: 'c-1', pending: true, localStatus: 'pending', createdAt: '2026-07-31' }];
    const fresh = [server(31, 'c-1'), server(30)];

    const merged = mergeLocalHistoryRows(shown, fresh);
    expect(merged.map((row) => row.id).sort((a, b) => b - a)).toEqual([31, 30]);
    expect(merged.some((row) => row.pending)).toBe(false);
  });

  it('prefers the fresh local copy of a confirmed row the server page already showed', () => {
    const shown: Row[] = [{ ...server(30, 'c-30'), createdAt: 'stale' }];
    const fresh: Row[] = [{ ...server(30, 'c-30'), createdAt: 'fresh' }];

    expect(mergeLocalHistoryRows(shown, fresh)).toEqual(fresh);
  });

  it('drops a stale review row and takes the current local state', () => {
    const shown: Row[] = [{ id: -1, clientAttemptId: 'c-2', localStatus: 'needs_review', createdAt: 'x' }, server(4)];
    const fresh: Row[] = [{ id: -1, clientAttemptId: 'c-3', pending: true, localStatus: 'pending', createdAt: 'y' }];

    expect(mergeLocalHistoryRows(shown, fresh).map((row) => row.clientAttemptId ?? row.id)).toEqual(['c-3', 4]);
  });
});
