import db from '@/lib/db';
import { addAppDays, appDateRange, isoToAppDate, todayDateString } from '@/lib/appDate';
import { studyDates } from '@/lib/studyDays';
import { getBalance, nowIso, type Learner } from '@/lib/tasks';

// "Külmutus" — a child buys one while they have stars to spare, and a single
// missed day spends it instead of resetting the streak. Bought ahead rather
// than offered as a rescue afterwards, so the child has to plan for the bad day
// before it arrives.
export const FREEZE_PRICE_STARS = 10;

// Two covers a weekend away or a short illness. It also caps the damage: with a
// large balance an unlimited stock would let a child buy a fortnight off.
export const MAX_HELD_FREEZES = 2;

// How far back a parent-granted freeze may reach. Illness and travel are almost
// always noticed after the fact, so a grant that could only protect future days
// would miss the very case it exists for. A parent decides these one at a time,
// so there is no balance to farm — unlike a bought freeze, which stays strictly
// forward-looking.
export const PARENT_GRANT_BACKDATE_DAYS = 2;

export type StreakFreezeSource = 'purchase' | 'parent_grant';

export type StreakFreezeRow = {
  id: number;
  learner: Learner;
  source: StreakFreezeSource;
  priceStars: number;
  ledgerEntryId: number | null;
  acquiredAt: string;
  consumedAt: string | null;
  coveredDate: string | null;
};

export type StreakFreezeState = {
  held: number;
  maxHeld: number;
  price: number;
  canBuy: boolean;
  // Why the child cannot buy right now, in their own language. Null when they can.
  blockedReason: string | null;
  // Days a freeze is currently covering, newest first. Drives the "your streak
  // was saved" notice.
  recentlyCovered: string[];
};

function heldRows(learner: Learner) {
  return db
    .prepare('SELECT * FROM streak_freezes WHERE learner = ? AND consumedAt IS NULL ORDER BY acquiredAt')
    .all(learner) as StreakFreezeRow[];
}

export function heldFreezeCount(learner: Learner) {
  return heldRows(learner).length;
}

// Every day a freeze is currently standing in for. The streak counter treats
// these as practised days; nothing else in the app does.
export function frozenDates(learner: Learner): Set<string> {
  const rows = db
    .prepare('SELECT coveredDate FROM streak_freezes WHERE learner = ? AND coveredDate IS NOT NULL')
    .all(learner) as Array<{ coveredDate: string }>;
  return new Set(rows.map((row) => row.coveredDate));
}

export function purchaseStreakFreeze(learner: Learner) {
  const buy = db.transaction(() => {
    if (heldFreezeCount(learner) >= MAX_HELD_FREEZES) {
      throw new Error(`Sul on juba ${MAX_HELD_FREEZES} külmutust.`);
    }
    const balance = getBalance(learner);
    if (balance < FREEZE_PRICE_STARS) throw new Error('Tähti ei ole piisavalt.');

    const createdAt = nowIso();
    const ledger = db.prepare(`
      INSERT INTO point_ledger (learner, amount, source, description, createdAt, metadataJson)
      VALUES (?, ?, 'streak_freeze', ?, ?, ?)
    `).run(learner, -FREEZE_PRICE_STARS, 'Külmutus ❄️', createdAt, JSON.stringify({ price: FREEZE_PRICE_STARS }));

    db.prepare(`
      INSERT INTO streak_freezes (learner, source, priceStars, ledgerEntryId, acquiredAt, createdAt, updatedAt)
      VALUES (?, 'purchase', ?, ?, ?, ?, ?)
    `).run(learner, FREEZE_PRICE_STARS, Number(ledger.lastInsertRowid), createdAt, createdAt, createdAt);

    // Also record it as a shop purchase (with no storeItemId — the freeze is
    // built in, not a parent-authored row). Without this the child watches ten
    // stars disappear with nothing in "Hiljuti ostetud" to explain it, and the
    // parent's purchase history is silently incomplete.
    const balanceAfter = getBalance(learner);
    db.prepare(`
      INSERT INTO store_purchases (storeItemId, learner, titleSnapshot, descriptionSnapshot, priceSnapshot,
        visibilitySnapshot, stockTypeSnapshot, purchasedAt, ledgerEntryId, balanceAfterPurchase, metadataJson)
      VALUES (NULL, ?, ?, ?, ?, ?, 'unlimited', ?, ?, ?, ?)
    `).run(
      learner,
      'Külmutus ❄️',
      'Hoiab õpiseeria alles, kui üks päev jääb harjutamata.',
      FREEZE_PRICE_STARS,
      learner,
      createdAt,
      Number(ledger.lastInsertRowid),
      balanceAfter,
      JSON.stringify({ kind: 'streak_freeze' })
    );

    return { held: heldFreezeCount(learner), balance: balanceAfter };
  });
  return buy();
}

// A parent hands one over for a day that genuinely was not the child's fault -
// illness, travel. Free, and still subject to the hold limit so it cannot be
// used to stockpile.
export function grantStreakFreeze(learner: Learner) {
  const grant = db.transaction(() => {
    if (heldFreezeCount(learner) >= MAX_HELD_FREEZES) {
      throw new Error(`Lapsel on juba ${MAX_HELD_FREEZES} külmutust.`);
    }
    const createdAt = nowIso();
    db.prepare(`
      INSERT INTO streak_freezes (learner, source, priceStars, acquiredAt, createdAt, updatedAt)
      VALUES (?, 'parent_grant', 0, ?, ?, ?)
    `).run(learner, createdAt, createdAt, createdAt);
    return { held: heldFreezeCount(learner) };
  });
  return grant();
}

function latestStudyDateOnOrBefore(dates: Set<string>, date: string) {
  const past = [...dates].filter((day) => day <= date).sort();
  return past.at(-1) ?? null;
}

// Which past days would need covering for the streak to survive into today.
// Today itself is never included: it is not missed until it is over.
export function gapNeedingCover(learner: Learner, today = todayDateString()) {
  const dates = studyDates(learner);
  const lastStudyDay = latestStudyDateOnOrBefore(dates, today);
  // Nothing to protect - a streak has to exist before it can be saved.
  if (!lastStudyDay || lastStudyDay === today) return [];
  // A gap wider than the child could ever cover is a broken streak, not a
  // pending one. Bailing out here also keeps a months-long absence from
  // building a date list day by day.
  const earliestCoverable = addAppDays(today, -MAX_HELD_FREEZES);
  if (addAppDays(lastStudyDay, 1) < earliestCoverable) return [];
  const frozen = frozenDates(learner);
  return appDateRange(addAppDays(lastStudyDay, 1), addAppDays(today, -1))
    .filter((day) => !dates.has(day) && !frozen.has(day));
}

// The oldest day this freeze is allowed to stand in for.
function earliestDayCovered(freeze: StreakFreezeRow) {
  const acquiredDay = isoToAppDate(freeze.acquiredAt) ?? freeze.acquiredAt.slice(0, 10);
  return freeze.source === 'parent_grant' ? addAppDays(acquiredDay, -PARENT_GRANT_BACKDATE_DAYS) : acquiredDay;
}

export type SettlementResult = { covered: string[]; held: number };

// Spend held freezes on the days that broke the streak. Runs on every dashboard
// read, so it must be idempotent — the unique index on (learner, coveredDate)
// is the backstop.
export function settleStreakFreezes(learner: Learner, today = todayDateString()): SettlementResult {
  const settle = db.transaction((): SettlementResult => {
    const gap = gapNeedingCover(learner, today);
    const available = heldRows(learner);

    // All or nothing. Spending two freezes on a three-day gap buys nothing:
    // the streak still breaks and the child has lost both.
    if (gap.length === 0 || gap.length > available.length) {
      return { covered: [], held: available.length };
    }

    // A bought freeze only covers a day missed AFTER it was bought. Without this
    // the feature quietly becomes a next-morning bail-out: notice the broken
    // streak, buy a freeze, undo yesterday. It is insurance, so it has to be in
    // hand before the bad day. A parent's grant is the deliberate exception and
    // may reach back PARENT_GRANT_BACKDATE_DAYS.
    const unused = [...available];
    const assignments: Array<{ id: number; day: string }> = [];
    for (const day of gap) {
      const eligible = unused.filter((freeze) => earliestDayCovered(freeze) <= day);
      if (eligible.length === 0) return { covered: [], held: available.length };
      // Days are handled oldest first, so spend the freeze that reaches back
      // least far and keep the more flexible one for the later day. It also
      // means a parent's grant is used before a freeze the child paid for,
      // which is the kinder way round.
      const chosen = eligible.reduce((best, freeze) => (
        earliestDayCovered(freeze) > earliestDayCovered(best) ? freeze : best
      ));
      assignments.push({ id: chosen.id, day });
      unused.splice(unused.indexOf(chosen), 1);
    }

    const consumedAt = nowIso();
    for (const assignment of assignments) {
      db.prepare(`
        UPDATE streak_freezes SET consumedAt = ?, coveredDate = ?, updatedAt = ?
        WHERE id = ? AND consumedAt IS NULL
      `).run(consumedAt, assignment.day, consumedAt, assignment.id);
    }

    return { covered: gap, held: heldFreezeCount(learner) };
  });
  return settle();
}

// Days a freeze saved recently enough to still be worth telling the child
// about. Time-boxed rather than acknowledgement-based, so simply looking at the
// page — as a parent checking in, say — can never consume the message.
export function recentlyCoveredDates(learner: Learner, today = todayDateString(), windowDays = 2) {
  const frozen = frozenDates(learner);
  return appDateRange(addAppDays(today, -windowDays), today)
    .filter((day) => frozen.has(day))
    .reverse();
}

export function getStreakFreezeState(learner: Learner, today = todayDateString()): StreakFreezeState {
  const held = heldFreezeCount(learner);
  const balance = getBalance(learner);
  const atLimit = held >= MAX_HELD_FREEZES;
  const tooPoor = balance < FREEZE_PRICE_STARS;
  return {
    held,
    maxHeld: MAX_HELD_FREEZES,
    price: FREEZE_PRICE_STARS,
    canBuy: !atLimit && !tooPoor,
    blockedReason: atLimit
      ? `Rohkem kui ${MAX_HELD_FREEZES} külmutust korraga hoida ei saa.`
      : tooPoor
        ? 'Tähti ei ole veel piisavalt.'
        : null,
    recentlyCovered: recentlyCoveredDates(learner, today)
  };
}
