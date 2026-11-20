import db from '@/lib/db';
import { listOfflineTaskReviews } from '@/lib/offline/server/taskReviews';
import { listHeldRewardAttempts } from '@/lib/server/rewards/projection';
import { pendingReviewCount } from '@/lib/server/unitTests/store';

// Everything the parent's "Vajab sinu otsust" card lists, as one number:
// chores waiting for a yes, offline chores to review, held exercise stars and
// handed-in kontrolltööd. The home page shows it on the parent link so the
// parent notices without opening the parent area.
export function parentDecisionCount(): number {
  const approvals = (db.prepare("SELECT COUNT(*) AS count FROM task_instance_assignments WHERE status = 'pending_approval'").get() as { count: number }).count;
  return approvals + listOfflineTaskReviews().length + listHeldRewardAttempts().length + pendingReviewCount();
}
