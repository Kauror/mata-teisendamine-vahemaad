import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import { addAppDays } from '@/lib/appDate';
import {
  getActiveLearningStreak,
  getCurrentLearningStreak,
  getLearningDaysThisWeek,
  getLongestLearningStreak
} from '@/lib/learningPoints';
import {
  FREEZE_PRICE_STARS,
  MAX_HELD_FREEZES,
  gapNeedingCover,
  getStreakFreezeState,
  grantStreakFreeze,
  heldFreezeCount,
  purchaseStreakFreeze,
  settleStreakFreezes
} from '@/lib/streakFreeze';

const TODAY = '2026-07-28';
const learner = 'kirsi' as const;

let nextAttemptId = 1;

// A study day is a day with a settled study reward — that is what the streak
// counter reads.
function seedStudyDay(date: string) {
  const id = nextAttemptId++;
  db.prepare(`
    INSERT INTO attempts (id, createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions, learner, subject, topic)
    VALUES (?, ?, 'Segaülesanded', 'Lihtne', 10, 9, 60, '[]', ?, 'matemaatika', 'arvutamine')
  `).run(id, `${date}T10:00:00.000Z`, learner);
  db.prepare(`
    INSERT INTO study_attempt_rewards (attemptId, learner, exerciseKey, score, questionCount, scorePercent,
      baseValueBeforeScore, earnedBeforeCap, awardedAmount, dailyCap, dailyLearningEarnedBefore,
      dailyLearningEarnedAfter, decayAttemptNumberToday, createdAt)
    VALUES (?, ?, 'kirsi.math.arvutamine', 9, 10, 0.9, 1, 1, 1, 10, 0, 1, 1, ?)
  `).run(id, learner, `${date}T10:00:00.000Z`);
}

function giveStars(amount: number) {
  db.prepare(`
    INSERT INTO point_ledger (learner, amount, source, description, createdAt)
    VALUES (?, ?, 'parent_adjustment', 'test', ?)
  `).run(learner, amount, `${TODAY}T08:00:00.000Z`);
}

// A run of consecutive study days ending on `endDate`.
function seedStreak(days: number, endDate: string) {
  for (let index = 0; index < days; index += 1) seedStudyDay(addAppDays(endDate, -index));
}

// Buys a freeze and backdates it, standing in for "the child bought this some
// days ago". A freeze only covers days missed after it was acquired, so tests
// about spending one have to put it in hand first.
function holdFreezeSince(date: string) {
  purchaseStreakFreeze(learner);
  db.prepare(`
    UPDATE streak_freezes SET acquiredAt = ?
    WHERE id = (SELECT id FROM streak_freezes WHERE learner = ? AND consumedAt IS NULL ORDER BY id DESC LIMIT 1)
  `).run(`${date}T09:00:00.000Z`, learner);
}

beforeEach(() => {
  db.prepare('DELETE FROM store_purchases').run();
  db.prepare('DELETE FROM streak_freezes').run();
  db.prepare('DELETE FROM study_attempt_rewards').run();
  db.prepare('DELETE FROM point_ledger').run();
  db.prepare('DELETE FROM attempts').run();
  nextAttemptId = 1;
});

describe('buying a freeze', () => {
  it('costs stars and is held until it is needed', () => {
    giveStars(25);
    const result = purchaseStreakFreeze(learner);
    expect(result.held).toBe(1);
    expect(result.balance).toBe(25 - FREEZE_PRICE_STARS);
  });

  it('refuses when the child cannot afford it', () => {
    giveStars(FREEZE_PRICE_STARS - 1);
    expect(() => purchaseStreakFreeze(learner)).toThrow('Tähti ei ole piisavalt.');
    expect(heldFreezeCount(learner)).toBe(0);
  });

  it('refuses to stockpile beyond the hold limit', () => {
    giveStars(100);
    for (let index = 0; index < MAX_HELD_FREEZES; index += 1) purchaseStreakFreeze(learner);
    expect(() => purchaseStreakFreeze(learner)).toThrow(/juba/);
    expect(heldFreezeCount(learner)).toBe(MAX_HELD_FREEZES);
  });

  it('takes no stars when the purchase is refused', () => {
    giveStars(100);
    for (let index = 0; index < MAX_HELD_FREEZES; index += 1) purchaseStreakFreeze(learner);
    const balanceAtLimit = getStreakFreezeState(learner, TODAY);
    expect(() => purchaseStreakFreeze(learner)).toThrow();
    expect(db.prepare('SELECT COUNT(*) AS n FROM point_ledger WHERE source = ?').get('streak_freeze'))
      .toEqual({ n: MAX_HELD_FREEZES });
    expect(balanceAtLimit.canBuy).toBe(false);
  });

  it('shows up in the shop history so the spent stars are accounted for', () => {
    giveStars(25);
    purchaseStreakFreeze(learner);
    const purchase = db
      .prepare('SELECT titleSnapshot, priceSnapshot, storeItemId FROM store_purchases WHERE learner = ?')
      .get(learner) as { titleSnapshot: string; priceSnapshot: number; storeItemId: number | null };
    expect(purchase.titleSnapshot).toContain('Külmutus');
    expect(purchase.priceSnapshot).toBe(FREEZE_PRICE_STARS);
    // Built in, so it hangs off no parent-authored store item.
    expect(purchase.storeItemId).toBeNull();
  });

  it('can be granted free by a parent', () => {
    grantStreakFreeze(learner);
    expect(heldFreezeCount(learner)).toBe(1);
    // No stars moved.
    expect(db.prepare('SELECT COUNT(*) AS n FROM point_ledger').get()).toEqual({ n: 0 });
  });
});

describe('spending a freeze on a missed day', () => {
  it('saves the streak over a single missed day', () => {
    seedStreak(5, addAppDays(TODAY, -2)); // practised up to the day before yesterday
    giveStars(25);
    holdFreezeSince(addAppDays(TODAY, -5));

    // Without the freeze the run is already broken.
    expect(gapNeedingCover(learner, TODAY)).toEqual([addAppDays(TODAY, -1)]);

    const settled = settleStreakFreezes(learner, TODAY);
    expect(settled.covered).toEqual([addAppDays(TODAY, -1)]);
    expect(settled.held).toBe(0);
    expect(getActiveLearningStreak(learner, TODAY)).toBe(6);
  });

  it('does not spend freezes on a gap it cannot fully bridge', () => {
    seedStreak(5, addAppDays(TODAY, -3)); // two days missed
    giveStars(25);
    holdFreezeSince(addAppDays(TODAY, -6)); // only one freeze held

    const settled = settleStreakFreezes(learner, TODAY);
    // Burning the one freeze would not save the streak, so it is kept.
    expect(settled.covered).toEqual([]);
    expect(heldFreezeCount(learner)).toBe(1);
    expect(getActiveLearningStreak(learner, TODAY)).toBe(0);
  });

  it('bridges a two-day gap when two freezes are held', () => {
    seedStreak(5, addAppDays(TODAY, -3));
    giveStars(50);
    holdFreezeSince(addAppDays(TODAY, -6));
    holdFreezeSince(addAppDays(TODAY, -6));

    const settled = settleStreakFreezes(learner, TODAY);
    expect(settled.covered).toEqual([addAppDays(TODAY, -2), addAppDays(TODAY, -1)]);
    expect(getActiveLearningStreak(learner, TODAY)).toBe(7);
  });

  it('never spends a freeze on today, which is not missed yet', () => {
    seedStreak(3, addAppDays(TODAY, -1)); // practised yesterday, nothing today
    giveStars(25);
    holdFreezeSince(addAppDays(TODAY, -4));

    expect(gapNeedingCover(learner, TODAY)).toEqual([]);
    expect(settleStreakFreezes(learner, TODAY).covered).toEqual([]);
    expect(heldFreezeCount(learner)).toBe(1);
    // The existing grace period already keeps today's streak alive.
    expect(getActiveLearningStreak(learner, TODAY)).toBe(3);
  });

  it('does nothing for a child who has never studied', () => {
    giveStars(25);
    purchaseStreakFreeze(learner);
    expect(settleStreakFreezes(learner, TODAY).covered).toEqual([]);
    expect(heldFreezeCount(learner)).toBe(1);
  });

  it('is safe to settle repeatedly', () => {
    seedStreak(5, addAppDays(TODAY, -2));
    giveStars(50);
    holdFreezeSince(addAppDays(TODAY, -5));
    holdFreezeSince(addAppDays(TODAY, -5));

    expect(settleStreakFreezes(learner, TODAY).covered).toEqual([addAppDays(TODAY, -1)]);
    // Settlement runs on every dashboard read; the second one must be a no-op.
    expect(settleStreakFreezes(learner, TODAY).covered).toEqual([]);
    expect(settleStreakFreezes(learner, TODAY).covered).toEqual([]);
    expect(heldFreezeCount(learner)).toBe(1);
    expect(getActiveLearningStreak(learner, TODAY)).toBe(6);
  });

  it('will not rescue a day that was already missed when the freeze was bought', () => {
    // Insurance, not a bail-out: noticing the broken streak this morning and
    // buying a freeze must not undo yesterday.
    seedStreak(5, addAppDays(TODAY, -2));
    giveStars(25);
    purchaseStreakFreeze(learner); // bought today, after yesterday was lost

    const settled = settleStreakFreezes(learner, TODAY);
    expect(settled.covered).toEqual([]);
    expect(heldFreezeCount(learner)).toBe(1);
    expect(getActiveLearningStreak(learner, TODAY)).toBe(0);
  });

  it("rescues yesterday when a parent grants the freeze today", () => {
    // The case the grant exists for: the child was ill yesterday and nobody
    // knew until this morning. A bought freeze cannot reach back, a granted
    // one can.
    seedStreak(5, addAppDays(TODAY, -2));
    grantStreakFreeze(learner);

    const settled = settleStreakFreezes(learner, TODAY);
    expect(settled.covered).toEqual([addAppDays(TODAY, -1)]);
    expect(getActiveLearningStreak(learner, TODAY)).toBe(6);
  });

  it('spends the parent grant before the freeze the child paid for', () => {
    seedStreak(5, addAppDays(TODAY, -2));
    giveStars(25);
    holdFreezeSince(addAppDays(TODAY, -5));
    grantStreakFreeze(learner);

    settleStreakFreezes(learner, TODAY);
    const spent = db
      .prepare('SELECT source FROM streak_freezes WHERE consumedAt IS NOT NULL')
      .all() as Array<{ source: string }>;
    expect(spent).toEqual([{ source: 'parent_grant' }]);
    // The bought one is still in hand for next time.
    expect(heldFreezeCount(learner)).toBe(1);
  });

  it('leaves a long absence alone rather than nibbling at it', () => {
    seedStreak(5, addAppDays(TODAY, -40));
    giveStars(50);
    holdFreezeSince(addAppDays(TODAY, -45));
    holdFreezeSince(addAppDays(TODAY, -45));

    expect(settleStreakFreezes(learner, TODAY).covered).toEqual([]);
    expect(heldFreezeCount(learner)).toBe(MAX_HELD_FREEZES);
  });
});

describe('what a frozen day does NOT count towards', () => {
  beforeEach(() => {
    seedStreak(6, addAppDays(TODAY, -2));
    giveStars(25);
    holdFreezeSince(addAppDays(TODAY, -6));
    settleStreakFreezes(learner, TODAY);
  });

  it('shows the child an unbroken streak', () => {
    expect(getActiveLearningStreak(learner, TODAY)).toBe(7);
  });

  it('does not pay the streak bonus, which reads the unfrozen streak', () => {
    // getCurrentLearningStreak decides the 7-day bonus and the parent's streak
    // rewards. A bought freeze must never trigger a payout.
    expect(getCurrentLearningStreak(learner, addAppDays(TODAY, -1))).toBe(0);
  });

  it('does not extend the personal record', () => {
    expect(getLongestLearningStreak(learner)).toBe(6);
  });

  it('does not count towards the perfect-week achievement', () => {
    // TODAY is Tuesday 2026-07-28, so this week began Monday 2026-07-27 — which
    // is exactly the day the freeze covered. Every seeded study day falls in the
    // previous week, so a frozen day counting as practice would show up here as
    // a 1. It must stay 0.
    expect(addAppDays(TODAY, -1)).toBe('2026-07-27');
    expect(getLearningDaysThisWeek(learner, TODAY)).toBe(0);
  });
});
