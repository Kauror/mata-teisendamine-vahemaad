type HistorySummaryRow = {
  subject?: string | null;
  topic?: string | null;
  score?: number | null;
};

export async function fetchBestEnglishSprintScore() {
  const rows = await fetchAllFilteredHistory<HistorySummaryRow>({ subject: 'inglise-keel', topic: 'sprint' });
  return rows.reduce((best, row) => {
    if (row.subject !== 'inglise-keel' || row.topic !== 'sprint') return best;
    return Math.max(best, typeof row.score === 'number' ? row.score : 0);
  }, 0);
}
import { fetchAllFilteredHistory } from '@/lib/historyClient';
