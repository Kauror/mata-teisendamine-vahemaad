type HistorySummaryRow = {
  subject?: string | null;
  topic?: string | null;
  score?: number | null;
};

export async function fetchBestEnglishSprintScore() {
  const response = await fetch('/api/history');
  if (!response.ok) throw new Error('history-load-failed');

  const rows = await response.json() as HistorySummaryRow[];
  return rows.reduce((best, row) => {
    if (row.subject !== 'inglise-keel' || row.topic !== 'sprint') return best;
    return Math.max(best, typeof row.score === 'number' ? row.score : 0);
  }, 0);
}
