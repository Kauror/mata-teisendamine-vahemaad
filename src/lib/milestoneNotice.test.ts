import { describe, expect, it } from 'vitest';
import { decideMilestoneNotice } from '@/lib/milestoneNotice';

const child = { seenMilestoneId: 'milestone-10', milestoneId: 'milestone-25', peekMode: false };

describe('decideMilestoneNotice', () => {
  it('announces a newly unlocked milestone without recording it yet', () => {
    // The write happens on dismissal — rendering the notice is not seeing it.
    expect(decideMilestoneNotice(child)).toEqual({ show: true, recordNow: false });
  });

  it('stays quiet once the child has acknowledged that milestone', () => {
    expect(decideMilestoneNotice({ ...child, seenMilestoneId: 'milestone-25' })).toEqual({ show: false, recordNow: false });
  });

  it('adopts the current milestone silently on a browser that has never seen one', () => {
    expect(decideMilestoneNotice({ ...child, seenMilestoneId: null })).toEqual({ show: false, recordNow: true });
  });

  it('does not let a peeking parent do that silent adoption', () => {
    // Otherwise a parent opening a fresh browser buries a notice the child
    // never saw — the exact failure peek mode exists to prevent.
    expect(decideMilestoneNotice({ ...child, seenMilestoneId: null, peekMode: true })).toEqual({ show: false, recordNow: false });
  });

  it('still shows the notice to a peeking parent — only the marker is withheld', () => {
    expect(decideMilestoneNotice({ ...child, peekMode: true })).toEqual({ show: true, recordNow: false });
  });
});
