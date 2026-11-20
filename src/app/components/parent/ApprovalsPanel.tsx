'use client';

import Link from 'next/link';
import { approvalMeta, heldReasonLabel, learnerLabel, offlineReviewReason } from './format';
import { failureMessage, jsonInit } from './parentApi';
import type { Dashboard, HeldReward, OfflineTaskReview } from './types';
import { useParentApi, useParentResource } from './useParentApi';
import { isoToAppDate } from '@/lib/appDate';

const heldFrom = (body: unknown) => {
  const held = (body as { held?: unknown } | null)?.held;
  return Array.isArray(held) ? held as HeldReward[] : [];
};
type PendingUnitTest = { id: string; learner: 'kiur' | 'kirsi'; unitLabel: string; variant: string; submittedAt: string; submissions: number; autoScore: { unmarked: number } };
const unitTestsFrom = (body: unknown) => {
  const pending = (body as { pending?: unknown } | null)?.pending;
  return Array.isArray(pending) ? pending as PendingUnitTest[] : [];
};
const reviewsFrom = (body: unknown) => {
  const reviews = (body as { reviews?: unknown } | null)?.reviews;
  return Array.isArray(reviews) ? reviews as OfflineTaskReview[] : [];
};

// Everything waiting on the parent: chores that need a yes, offline chores done
// against a since-changed task, and exercise stars held back. The first card
// on Täna, always loaded.
export function ApprovalsPanel() {
  const api = useParentApi();
  const { data: dashboard } = useParentResource<Dashboard>('dashboard');
  const { data: heldRewards } = useParentResource('heldRewards', heldFrom);
  const { data: offlineTaskReviews } = useParentResource('taskReviews', reviewsFrom);
  const { data: unitTestData } = useParentResource('unitTests', unitTestsFrom);
  const unitTests = unitTestData ?? [];
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
    api.setNotice(action === 'approve' ? 'Võrguühenduseta tehtud tegevus kinnitatud ja tähed lisatud.' : 'Võrguühenduseta tehtud tegevus lükati tagasi.');
    api.bus.after('taskReview');
  });

  const total = pendingApprovals.length + reviews.length + held.length + unitTests.length;

  return (
    <section className='pv-card pv-asks' aria-label='Vajab sinu otsust'>
      <h2 className='pv-h'><span>Vajab sinu otsust</span><span>{total}</span></h2>
      {total === 0 && <p className='pv-done'>✓ Praegu ei oota midagi</p>}

      {pendingApprovals.map((item) => (
        <div key={`a-${item.assignmentId}`} className='pv-ask'>
          <div className='pv-ask-line'>
            <span>{learnerLabel(item.learner)} · {item.title}<small>{approvalMeta(item)}</small></span>
            <span>+{item.points} ⭐</span>
          </div>
          <div className='pv-btns'>
            <button type='button' className='pv-btn' data-k='ok' onClick={() => resolveApproval(item.assignmentId, 'approve')}>Kinnita</button>
            <button type='button' className='pv-btn' data-k='no' onClick={() => resolveApproval(item.assignmentId, 'reject')}>Lükka tagasi</button>
          </div>
        </div>
      ))}

      {/* An English unit test (lisatest) handed in: the parent marks the open
          answers, checks the automatic marks and approves or sends it back. */}
      {unitTests.map((item) => (
        <div key={`u-${item.id}`} className='pv-ask'>
          <div className='pv-ask-line'>
            <span>
              {learnerLabel(item.learner)} · Kontrolltöö: {item.unitLabel} ({item.variant})
              <small>
                {item.submissions > 1 ? 'Parandatud kontrolltöö' : 'Ära antud'} · {isoToAppDate(item.submittedAt) ?? ''}
                {item.autoScore.unmarked > 0 ? ` · ${item.autoScore.unmarked} ${item.autoScore.unmarked === 1 ? 'vastus vajab' : 'vastust vajavad'} sinu hinnangut` : ''}
              </small>
            </span>
          </div>
          <div className='pv-btns'>
            <Link className='pv-btn' data-k='ok' href={`/vanem/lisatest/${item.id}`}>Vaata üle</Link>
          </div>
        </div>
      ))}

      {/* Done offline against a task the parent has since changed or deleted:
          does the original star count still stand? */}
      {reviews.map((item) => (
        <div key={`r-${item.clientActionId}`} className='pv-ask'>
          <div className='pv-ask-line'>
            <span>{learnerLabel(item.learner)} · {item.title}<small>{offlineReviewReason(item.reasonCode)} · {item.taskDate}</small></span>
            <span>+{item.points} ⭐</span>
          </div>
          <div className='pv-btns'>
            <button type='button' className='pv-btn' data-k='ok' onClick={() => resolveOfflineTaskReview(item.clientActionId, 'approve')}>Kinnita</button>
            <button type='button' className='pv-btn' data-k='no' onClick={() => resolveOfflineTaskReview(item.clientActionId, 'reject')}>Lükka tagasi</button>
          </div>
        </div>
      ))}

      {/* An exercise was finished but its stars were held back (a clock jump,
          a catalogue rule): the parent lets them through. */}
      {held.map((item) => (
        <div key={`h-${item.id}`} className='pv-ask'>
          <div className='pv-ask-line'>
            <span>
              {learnerLabel(item.learner)} · {item.exerciseTitle ?? item.exerciseId ?? 'harjutus'}
              <small>
                Harjutuse tähed on kinni peetud · {item.score}/{item.questionCount}
                {item.completionDate ? ` · ${item.completionDate}` : ''}
                {item.reviewReasonCode ? ` · ${heldReasonLabel(item.reviewReasonCode)}` : ''}
              </small>
            </span>
          </div>
          <div className='pv-btns'>
            <button type='button' className='pv-btn' data-k='ok' onClick={() => approveHeldReward(item.id)}>Kinnita tähed</button>
          </div>
        </div>
      ))}
    </section>
  );
}
