type HistorySummaryRow = {
  learner?: string | null;
  subject?: string | null;
  topic?: string | null;
  score?: number | null;
};

export async function fetchBestKirsiReadingSprintScore() {
  const rows = await fetchAllFilteredHistory<HistorySummaryRow>({ learner: 'kirsi', subject: 'lugemine', topic: 'pilt-ja-sona' });
  return rows.reduce((best, row) => {
    if (row.learner !== 'kirsi' || row.subject !== 'lugemine' || row.topic !== 'pilt-ja-sona') return best;
    return Math.max(best, typeof row.score === 'number' ? row.score : 0);
  }, 0);
}
import { fetchAllFilteredHistory } from '@/lib/historyClient';
