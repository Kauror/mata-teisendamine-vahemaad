// Merge a fresh IndexedDB history read (the newest confirmed rows plus local
// pending/review rows) into what the history page already shows: the server
// first page and every "Laadi rohkem" page. Replacing the list instead made
// loaded rows vanish after every background sync (OFF-05).
//
// Rules: local rows are authoritative for what they contain (a pending row that
// became confirmed replaces both its pending copy and any server copy); shown
// confirmed rows that the local window does not contain are kept; shown local
// rows (pending, review, synthetic ids) are dropped, because the fresh read
// already holds their current state.

export type MergeableHistoryRow = {
  id: number;
  clientAttemptId?: string | null;
  pending?: boolean;
  localStatus?: string;
};

function isLocalRow(row: MergeableHistoryRow): boolean {
  return row.id <= 0 || Boolean(row.pending) || row.localStatus !== undefined;
}

export function mergeLocalHistoryRows<T extends MergeableHistoryRow>(current: readonly T[], fresh: readonly T[]): T[] {
  const freshIds = new Set(fresh.filter((row) => !isLocalRow(row)).map((row) => row.id));
  const freshClientIds = new Set(fresh.map((row) => row.clientAttemptId).filter((id): id is string => Boolean(id)));
  const kept = current.filter((row) =>
    !isLocalRow(row) &&
    !freshIds.has(row.id) &&
    (!row.clientAttemptId || !freshClientIds.has(row.clientAttemptId))
  );
  return [...fresh, ...kept];
}
