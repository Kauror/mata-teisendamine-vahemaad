'use client';

import { approvalMeta, learnerLabel } from './format';
import { failureMessage, jsonInit } from './parentApi';
import type { Dashboard, HeldReward, OfflineTaskReview } from './types';
import { useParentApi, useParentResource } from './useParentApi';

const heldFrom = (body: unknown) => {
  const held = (body as { held?: unknown } | null)?.held;
  return Array.isArray(held) ? held as HeldReward[] : [];
};
const reviewsFrom = (body: unknown) => {
  const reviews = (body as { reviews?: unknown } | null)?.reviews;
  return Array.isArray(reviews) ? reviews as OfflineTaskReview[] : [];
};

// Everything waiting on the parent: chores that need a yes, offline chores done
// against a since-changed task, and exercise stars held back. Always loaded —
// it is not inside an accordion section.
export function ApprovalsPanel() {
  const api = useParentApi();
  const { data: dashboard } = useParentResource<Dashboard>('dashboard');
  const { data: heldRewards } = useParentResource('heldRewards', heldFrom);
  const { data: offlineTaskReviews } = useParentResource('taskReviews', reviewsFrom);
  const pendingApprovals = dashboard?.pendingApprovals ?? [];
  const held = heldRewards ?? [];
  const reviews = offlineTaskReviews ?? [];

  const resolveApproval = (assignmentId: number, action: 'approve' | 'reject') => api.guarded(async () => {
    api.setError('');
    api.setNotice('');
    const res = await api.request('/api/parent/approvals', jsonInit('POST', { assignmentId, action }));
    if (!res.ok) {
      api.setError(await failureMessage(res, 'Toimingut ei saanud teha.'));
      api.bus.after('taskApproval');
      return;
    }
    api.setNotice(action === 'approve' ? 'Tähed kinnitatud.' : 'Tegevus saadeti uuesti tegemiseks.');
    api.bus.after('taskApproval');
  });

  const approveHeldReward = (attemptId: number) => api.guarded(async () => {
    api.setError('');
    api.setNotice('');
    const res = await api.request('/api/parent/held-rewards', jsonInit('POST', { attemptId, action: 'approve' }));
    if (!res.ok) {
      api.setError(await failureMessage(res, 'Toimingut ei saanud teha.'));
      api.bus.after('heldReward');
      return;
    }
    api.setNotice('Harjutuse tähed kinnitatud.');
    api.bus.after('heldReward');
  });

  const resolveOfflineTaskReview = (clientActionId: string, action: 'approve' | 'reject') => api.guarded(async () => {
    const res = await api.request('/api/parent/task-reviews', jsonInit('POST', { clientActionId, action }));
    if (!res.ok) {
      api.setError(await failureMessage(res, 'Toimingut ei saanud teha.'));
      return;
    }
    api.setNotice(action === 'approve' ? 'Offline tegevus kinnitatud ja tähed lisatud.' : 'Offline tegevus lükati tagasi.');
    api.bus.after('taskReview');
  });

  return (
    <>
      {pendingApprovals.length > 0 && (
        <section className='parent-approvals' aria-label='Vanema kinnitus'>
          <h2>✋ Vanema kinnitus ({pendingApprovals.length})</h2>
          <p>Need tegevused ootavad sinu kinnitust, enne kui laps tähed saab.</p>
          <div className='parent-approval-list'>
            {pendingApprovals.map((item) => (
              <div key={item.assignmentId} className='parent-approval-row'>
                <div className='parent-approval-info'>
                  <strong>{learnerLabel(item.learner)} · {item.title}</strong>
                  <span>{approvalMeta(item)}</span>
                </div>
                <div className='parent-approval-actions'>
                  <button type='button' className='view-button' onClick={() => resolveApproval(item.assignmentId, 'approve')}>Kinnita</button>
                  <button type='button' className='filter-chip' onClick={() => resolveApproval(item.assignmentId, 'reject')}>Lükka tagasi</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {reviews.length > 0 && (
        <section className='parent-approvals' aria-label='Offline tegevuste ülevaatus'>
          <h2>📥 Offline tegevuste ülevaatus ({reviews.length})</h2>
          <p>Need tegevused tehti vanema muudetud või kustutatud ülesande alusel. Otsusta, kas algne punktisumma kehtib.</p>
          <div className='parent-approval-list'>
            {reviews.map((item) => (
              <div key={item.clientActionId} className='parent-approval-row'>
                <div className='parent-approval-info'><strong>{learnerLabel(item.learner)} · {item.title}</strong><span>+{item.points} ⭐ · {item.taskDate}{item.reasonCode ? ` · ${item.reasonCode}` : ''}</span></div>
                <div className='parent-approval-actions'><button type='button' className='view-button' onClick={() => resolveOfflineTaskReview(item.clientActionId, 'approve')}>Kinnita</button><button type='button' className='filter-chip' onClick={() => resolveOfflineTaskReview(item.clientActionId, 'reject')}>Lükka tagasi</button></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {held.length > 0 && (
        <section className='parent-approvals' aria-label='Ülevaatust ootavad tähed'>
          <h2>🔎 Ülevaatust ootavad tähed ({held.length})</h2>
          <p>Need harjutused tehti valmis, kuid tähed on kinni peetud (nt kella nihe või katalooginõue). Kinnita, et laps tähed saab.</p>
          <div className='parent-approval-list'>
            {held.map((item) => (
              <div key={item.id} className='parent-approval-row'>
                <div className='parent-approval-info'>
                  <strong>{learnerLabel(item.learner)} · {item.exerciseId ?? 'harjutus'}</strong>
                  <span>
                    {item.score}/{item.questionCount}
                    {item.completionDate ? ` · ${item.completionDate}` : ''}
                    {item.status === 'needs_review' ? ' · ülevaatus' : ' · kinni peetud'}
                    {item.reviewReasonCode ? ` (${item.reviewReasonCode})` : ''}
                  </span>
                </div>
                <div className='parent-approval-actions'>
                  <button type='button' className='view-button' onClick={() => approveHeldReward(item.id)}>Kinnita tähed</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
