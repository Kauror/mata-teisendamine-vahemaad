import { mayRecordSeenMarker } from '@/lib/peekMode';

export type MilestoneNoticeDecision = {
  // Announce the milestone to the child now.
  show: boolean;
  // Write the "seen" marker immediately, without showing anything.
  recordNow: boolean;
};

// What to do when the dashboard reports an unlocked exercise milestone.
//
// The marker is written on dismissal, not on render: a notice the child never
// acknowledged has not been seen, so a stray page load — a parent checking the
// deployment, a tab that crashed — must not consume it.
export function decideMilestoneNotice(input: {
  // The milestone id this browser has already recorded, or null if it has never
  // recorded one.
  seenMilestoneId: string | null;
  milestoneId: string;
  peekMode: boolean;
}): MilestoneNoticeDecision {
  if (input.seenMilestoneId === input.milestoneId) return { show: false, recordNow: false };

  // First visit from this browser: adopt the current milestone quietly rather
  // than announcing one the child may have earned long ago. Nothing is shown,
  // so nothing is consumed — but a peeking parent must not do the adopting
  // either, or looking at a fresh browser buries a notice the child never saw.
  if (input.seenMilestoneId === null) return { show: false, recordNow: mayRecordSeenMarker(input.peekMode) };

  return { show: true, recordNow: false };
}
