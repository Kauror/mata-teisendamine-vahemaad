// The best English sprint score, aggregated on the server. Before PAR-11 this
// paged the entire sprint history to the client on every sprint page load just
// to take max(score). It never merged local unsynced runs: offline it throws,
// as before, and the sprint page falls back to 0.
export async function fetchBestEnglishSprintScore(): Promise<number> {
  const response = await fetch('/api/english/sprint-best', { cache: 'no-store' });
  if (!response.ok) throw new Error('sprint-best-load-failed');
  const body = await response.json() as { best?: unknown };
  return typeof body.best === 'number' && Number.isFinite(body.best) ? Math.max(0, body.best) : 0;
}
