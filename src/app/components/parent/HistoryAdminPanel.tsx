'use client';

import { useCallback, useEffect, useState } from 'react';
import { historySummary, learnerLabel, mergeHistoryPage } from './format';
import { failureMessage } from './parentApi';
import type { ParentHistoryAttempt } from './types';
import { useParentApi } from './useParentApi';

// "Ajaloo haldamine": hide results from the children's history. Paged on its
// own: no other panel's action reloads it, so pages opened with "Näita rohkem"
// stay open.
export function HistoryAdminPanel({ onSummary }: { onSummary: (summary: string) => void }) {
  const api = useParentApi();
  const [parentHistory, setParentHistory] = useState<ParentHistoryAttempt[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [confirmHideAll, setConfirmHideAll] = useState(false);

  const loadPage = useCallback(async (from: string | null) => {
    const res = await api.request(from ? `/api/parent/history?cursor=${encodeURIComponent(from)}` : '/api/parent/history');
    if (!res.ok) throw new Error('history');
    const body = await res.json() as { items?: ParentHistoryAttempt[]; nextCursor?: string | null };
    const items = Array.isArray(body.items) ? body.items : [];
    setParentHistory((current) => mergeHistoryPage(current, items, from !== null));
    setCursor(typeof body.nextCursor === 'string' ? body.nextCursor : null);
    setLoaded(true);
  }, [api]);

  useEffect(() => {
    loadPage(null).catch(() => api.setError('Andmeid ei saanud laadida.'));
  }, [api, loadPage]);

  useEffect(() => {
    if (loaded) onSummary(historySummary(parentHistory.length, cursor !== null));
  }, [cursor, loaded, onSummary, parentHistory.length]);

  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      await loadPage(cursor);
    } catch {
      api.setError('Ajalugu ei saanud laadida.');
    } finally {
      setLoadingMore(false);
    }
  };

  const hideAttempt = (id: number) => api.guarded(async () => {
    const res = await api.request(`/api/parent/history/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      api.setError(await failureMessage(res, 'Tulemust ei saanud peita.'));
      return;
    }
    setParentHistory((current) => current.filter((item) => item.id !== id));
    setConfirmId(null);
    api.setNotice('Tulemus on ajaloos peidetud.');
  });

  const hideAll = () => api.guarded(async () => {
    const res = await api.request('/api/parent/history', { method: 'DELETE' });
    if (!res.ok) {
      api.setError(await failureMessage(res, 'Ajalugu ei saanud peita.'));
      return;
    }
    setParentHistory([]);
    setCursor(null);
    setConfirmHideAll(false);
    setConfirmId(null);
    api.setNotice('Harjutuste ajalugu on peidetud.');
  });

  return (
    <section className='parent-card'>
      <p>Peitmine eemaldab tulemuse laste ajaloovaatest, kuid ei muuda teenitud tähti, seeriat ega võistlustulemusi.</p>
      <div className='stock-list'>
        {parentHistory.map((item) => (
          <div key={item.id} className='stock-row'>
            <div className='stock-info'>
              <strong>{learnerLabel(item.learner)} · {item.category}</strong>
              <span>{new Date(item.createdAt).toLocaleString('et-EE')} · {item.score}/{item.questionCount}</span>
            </div>
            <div className='stock-actions'>
              {confirmId === item.id ? (
                <>
                  <button type='button' className='filter-chip' onClick={() => setConfirmId(null)}>Tühista</button>
                  <button type='button' className='delete-button' onClick={() => hideAttempt(item.id)}>Peida tulemus</button>
                </>
              ) : (
                <button type='button' className='delete-button' onClick={() => setConfirmId(item.id)}>Peida</button>
              )}
            </div>
          </div>
        ))}
        {loaded && parentHistory.length === 0 && <p>Nähtavaid harjutustulemusi ei ole.</p>}
        {!loaded && <p>Laadin...</p>}
      </div>
      {cursor && (
        <div className='parent-action-row'>
          <button type='button' className='filter-chip' disabled={loadingMore} onClick={() => void loadMore()}>{loadingMore ? 'Laadin...' : 'Näita rohkem'}</button>
        </div>
      )}
      {parentHistory.length > 0 && (
        <div className='parent-action-row'>
          {confirmHideAll ? (
            <>
              <button type='button' className='filter-chip' onClick={() => setConfirmHideAll(false)}>Tühista</button>
              <button type='button' className='delete-button' onClick={hideAll}>Jah, peida kõik</button>
            </>
          ) : (
            <button type='button' className='delete-button' onClick={() => setConfirmHideAll(true)}>Peida kogu harjutuste ajalugu</button>
          )}
        </div>
      )}
    </section>
  );
}
