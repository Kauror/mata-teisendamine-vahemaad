import db from '@/lib/db';
import { getBalance, getBalances, Learner, nowIso, todayDateString } from '@/lib/tasks';

export type StoreVisibility = 'kiur' | 'kirsi' | 'both';
export type StoreStockType = 'unlimited' | 'fixed_stock' | 'daily_stock' | 'one_time_global';
export type StoreItemState = 'available' | 'not_enough_stars' | 'out_of_stock' | 'daily_limit_reached' | 'not_available_yet' | 'not_available_today' | 'expired' | 'already_bought';

export type StoreItemRow = {
  id: number;
  title: string;
  description: string | null;
  price: number;
  visibility: StoreVisibility;
  stockType: StoreStockType;
  fixedStockRemaining: number | null;
  dailyStockLimit: number | null;
  availableFrom: string | null;
  availableUntil: string | null;
  availableWeekdaysJson: string | null;
  isActive: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type StoreChildItem = StoreItemRow & {
  state: StoreItemState;
  stateLabel: string;
  canBuy: boolean;
  missingStars: number;
  dailyRemaining: number | null;
};

export type StorePurchase = {
  id: number;
  storeItemId: number | null;
  learner: Learner;
  titleSnapshot: string;
  descriptionSnapshot: string | null;
  priceSnapshot: number;
  visibilitySnapshot: StoreVisibility;
  stockTypeSnapshot: StoreStockType;
  purchasedAt: string;
  ledgerEntryId: number;
  balanceAfterPurchase: number;
  metadataJson: string | null;
};

const WEEKDAY_NAMES = ['esmaspäeval', 'teisipäeval', 'kolmapäeval', 'neljapäeval', 'reedel', 'laupäeval', 'pühapäeval'];

function weekdayForDate(date: string) {
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  return day === 0 ? 7 : day;
}

function formatDate(date: string) {
  const [year, month, day] = date.split('-');
  return `${day}.${month}.${year}`;
}

function formatStars(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toLocaleString('et-EE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function parseWeekdays(raw: string | null) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((day) => Number.isInteger(day) && day >= 1 && day <= 7) as number[] : [];
  } catch {
    return [];
  }
}

function nextWeekdayLabel(days: number[], todayWeekday: number) {
  if (!days.length) return 'valitud päeval';
  const next = days
    .map((day) => ({ day, distance: (day - todayWeekday + 7) % 7 || 7 }))
    .sort((a, b) => a.distance - b.distance)[0]?.day;
  return next ? WEEKDAY_NAMES[next - 1] : 'valitud päeval';
}

function validateItemInput(input: {
  title: string;
  description?: string | null;
  price: number;
  visibility: StoreVisibility;
  stockType: StoreStockType;
  fixedStockRemaining?: number | null;
  dailyStockLimit?: number | null;
  availableFrom?: string | null;
  availableUntil?: string | null;
  availableWeekdays?: number[];
  isActive?: boolean;
}) {
  const title = input.title.trim();
  const description = (input.description || '').trim();
  if (!title) throw new Error('Nimi on kohustuslik.');
  if (title.length > 80) throw new Error('Nimi võib olla kuni 80 märki.');
  if (description.length > 300) throw new Error('Kirjeldus võib olla kuni 300 märki.');
  if (!Number.isInteger(input.price) || input.price < 1 || input.price > 999) throw new Error('Hind peab olema 1-999 tähte.');
  if (!['kiur', 'kirsi', 'both'].includes(input.visibility)) throw new Error('Vale nähtavus.');
  if (!['unlimited', 'fixed_stock', 'daily_stock', 'one_time_global'].includes(input.stockType)) throw new Error('Vale tüüp.');
  if (input.stockType === 'fixed_stock' && (!Number.isInteger(input.fixedStockRemaining) || Number(input.fixedStockRemaining) < 0)) throw new Error('Kogus peab olema vähemalt 0.');
  if (input.stockType === 'daily_stock' && (!Number.isInteger(input.dailyStockLimit) || Number(input.dailyStockLimit) < 1)) throw new Error('Päevane kogus peab olema vähemalt 1.');
  const weekdays = input.availableWeekdays?.filter((day) => Number.isInteger(day) && day >= 1 && day <= 7) ?? [];
  return { title, description, weekdays };
}

function appDateFromIso(value: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Kiev',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date(value));
  const get = (type: string) => parts.find((part) => part.type === type)?.value || '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

function purchaseDate(row: { purchasedAt: string; metadataJson: string | null }) {
  if (row.metadataJson) {
    try {
      const metadata = JSON.parse(row.metadataJson) as { date?: unknown };
      if (typeof metadata.date === 'string') return metadata.date;
    } catch {
      // Fall back to the purchase timestamp below.
    }
  }
  return appDateFromIso(row.purchasedAt);
}

function getDailyUsed(itemId: number, date: string) {
  const rows = db.prepare('SELECT purchasedAt, metadataJson FROM store_purchases WHERE storeItemId = ?').all(itemId) as Array<{ purchasedAt: string; metadataJson: string | null }>;
  return rows.filter((row) => purchaseDate(row) === date).length;
}

function isHiddenToday(itemId: number, date: string) {
  return Boolean(db.prepare('SELECT id FROM store_item_hidden_dates WHERE storeItemId = ? AND date = ?').get(itemId, date));
}

function oneTimeBought(itemId: number) {
  return Boolean(db.prepare('SELECT id FROM store_purchases WHERE storeItemId = ? LIMIT 1').get(itemId));
}

function itemVisibleToLearner(item: StoreItemRow, learner: Learner) {
  return item.visibility === 'both' || item.visibility === learner;
}

function itemState(item: StoreItemRow, learner: Learner, balance: number, date: string): StoreChildItem {
  const todayWeekday = weekdayForDate(date);
  const weekdays = parseWeekdays(item.availableWeekdaysJson);
  const missingStars = Math.max(0, item.price - balance);
  let dailyRemaining: number | null = null;
  let state: StoreItemState = 'available';
  let stateLabel = 'Osta';

  if (!itemVisibleToLearner(item, learner) || !item.isActive || item.deletedAt || isHiddenToday(item.id, date)) {
    state = 'expired';
    stateLabel = 'Pole saadaval';
  } else if (item.availableFrom && item.availableFrom > date) {
    state = 'not_available_yet';
    stateLabel = `Saadaval alates: ${formatDate(item.availableFrom)}`;
  } else if (item.availableUntil && item.availableUntil < date) {
    state = 'expired';
    stateLabel = 'Pole saadaval';
  } else if (weekdays.length > 0 && !weekdays.includes(todayWeekday)) {
    state = 'not_available_today';
    stateLabel = `Saadaval: ${nextWeekdayLabel(weekdays, todayWeekday)}`;
  } else if (item.stockType === 'fixed_stock' && (item.fixedStockRemaining ?? 0) <= 0) {
    state = 'out_of_stock';
    stateLabel = 'Otsas';
  } else if (item.stockType === 'daily_stock') {
    dailyRemaining = Math.max(0, (item.dailyStockLimit ?? 0) - getDailyUsed(item.id, date));
    if (dailyRemaining <= 0) {
      state = 'daily_limit_reached';
      stateLabel = 'Täna otsas · Uueneb homme';
    }
  } else if (item.stockType === 'one_time_global' && oneTimeBought(item.id)) {
    state = 'already_bought';
    stateLabel = 'Ostetud';
  }

  if (state === 'available' && missingStars > 0) {
    state = 'not_enough_stars';
    stateLabel = `Puudu: ${formatStars(missingStars)} ⭐`;
  }

  return { ...item, state, stateLabel, canBuy: state === 'available', missingStars, dailyRemaining };
}

function activeChildItems(learner: Learner, date: string) {
  const rows = db.prepare('SELECT * FROM store_items WHERE deletedAt IS NULL AND isActive = 1 ORDER BY createdAt DESC').all() as StoreItemRow[];
  return rows.filter((item) => itemVisibleToLearner(item, learner) && !isHiddenToday(item.id, date));
}

export function getChildStore(learner: Learner, date = todayDateString()) {
  const balance = getBalance(learner);
  const items = activeChildItems(learner, date).map((item) => itemState(item, learner, balance, date));
  const purchases = db.prepare('SELECT * FROM store_purchases WHERE learner = ? ORDER BY purchasedAt DESC LIMIT 10').all(learner) as StorePurchase[];
  return { learner, balance, items, purchases };
}

export function createStoreItem(input: {
  title: string;
  description?: string | null;
  price: number;
  visibility: StoreVisibility;
  stockType: StoreStockType;
  fixedStockRemaining?: number | null;
  dailyStockLimit?: number | null;
  availableFrom?: string | null;
  availableUntil?: string | null;
  availableWeekdays?: number[];
  isActive?: boolean;
}) {
  const clean = validateItemInput(input);
  const now = nowIso();
  const result = db.prepare(`
    INSERT INTO store_items (title, description, price, visibility, stockType, fixedStockRemaining, dailyStockLimit, availableFrom, availableUntil, availableWeekdaysJson, isActive, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    clean.title,
    clean.description || null,
    input.price,
    input.visibility,
    input.stockType,
    input.stockType === 'fixed_stock' ? input.fixedStockRemaining : null,
    input.stockType === 'daily_stock' ? input.dailyStockLimit : null,
    input.availableFrom || null,
    input.availableUntil || null,
    clean.weekdays.length ? JSON.stringify(clean.weekdays) : null,
    input.isActive === false ? 0 : 1,
    now,
    now
  );
  return result.lastInsertRowid;
}

export function updateStoreItem(id: number, input: Parameters<typeof createStoreItem>[0]) {
  const clean = validateItemInput(input);
  db.prepare(`
    UPDATE store_items
    SET title = ?, description = ?, price = ?, visibility = ?, stockType = ?, fixedStockRemaining = ?, dailyStockLimit = ?, availableFrom = ?, availableUntil = ?, availableWeekdaysJson = ?, isActive = ?, updatedAt = ?
    WHERE id = ? AND deletedAt IS NULL
  `).run(
    clean.title,
    clean.description || null,
    input.price,
    input.visibility,
    input.stockType,
    input.stockType === 'fixed_stock' ? input.fixedStockRemaining : null,
    input.stockType === 'daily_stock' ? input.dailyStockLimit : null,
    input.availableFrom || null,
    input.availableUntil || null,
    clean.weekdays.length ? JSON.stringify(clean.weekdays) : null,
    input.isActive === false ? 0 : 1,
    nowIso(),
    id
  );
}

export function deleteStoreItem(id: number) {
  db.prepare('UPDATE store_items SET deletedAt = ?, updatedAt = ? WHERE id = ? AND deletedAt IS NULL').run(nowIso(), nowIso(), id);
}

export function hideStoreItemToday(id: number, date = todayDateString()) {
  db.prepare('INSERT OR IGNORE INTO store_item_hidden_dates (storeItemId, date, createdAt) VALUES (?, ?, ?)').run(id, date, nowIso());
}

export function showStoreItemToday(id: number, date = todayDateString()) {
  db.prepare('DELETE FROM store_item_hidden_dates WHERE storeItemId = ? AND date = ?').run(id, date);
}

export function purchaseStoreItem(learner: Learner, itemId: number, date = todayDateString()) {
  const buy = db.transaction(() => {
    const item = db.prepare('SELECT * FROM store_items WHERE id = ? AND deletedAt IS NULL').get(itemId) as StoreItemRow | undefined;
    if (!item) throw new Error('Poe eset ei leitud.');
    const balance = getBalance(learner);
    const state = itemState(item, learner, balance, date);
    if (!state.canBuy) throw new Error(state.stateLabel);
    if (balance < item.price) throw new Error('Tähti ei ole piisavalt.');

    if (item.stockType === 'fixed_stock') {
      const updated = db.prepare('UPDATE store_items SET fixedStockRemaining = fixedStockRemaining - 1, updatedAt = ? WHERE id = ? AND fixedStockRemaining > 0').run(nowIso(), item.id);
      if (updated.changes !== 1) throw new Error('Otsas.');
    }

    if (item.stockType === 'daily_stock') {
      const remaining = Math.max(0, (item.dailyStockLimit ?? 0) - getDailyUsed(item.id, date));
      if (remaining <= 0) throw new Error('Täna otsas.');
    }

    if (item.stockType === 'one_time_global' && oneTimeBought(item.id)) {
      throw new Error('Ostetud.');
    }

    const purchasedAt = nowIso();
    const ledger = db.prepare(`
      INSERT INTO point_ledger (learner, amount, source, sourceId, description, createdAt, metadataJson)
      VALUES (?, ?, 'store_purchase', ?, ?, ?, ?)
    `).run(learner, -item.price, item.id, `Ost: ${item.title}`, purchasedAt, JSON.stringify({ stockType: item.stockType, visibility: item.visibility }));
    const balanceAfter = getBalance(learner);

    const purchase = db.prepare(`
      INSERT INTO store_purchases (storeItemId, learner, titleSnapshot, descriptionSnapshot, priceSnapshot, visibilitySnapshot, stockTypeSnapshot, purchasedAt, ledgerEntryId, balanceAfterPurchase, metadataJson)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(item.id, learner, item.title, item.description, item.price, item.visibility, item.stockType, purchasedAt, ledger.lastInsertRowid, balanceAfter, JSON.stringify({ date }));

    db.prepare('UPDATE point_ledger SET sourceId = ? WHERE id = ?').run(purchase.lastInsertRowid, ledger.lastInsertRowid);
    return { purchaseId: purchase.lastInsertRowid, title: item.title, price: item.price, balanceAfter };
  });
  return buy();
}

export function getParentStoreDashboard(date = todayDateString()) {
  const items = db.prepare('SELECT * FROM store_items WHERE deletedAt IS NULL ORDER BY createdAt DESC').all() as StoreItemRow[];
  const hiddenToday = db.prepare('SELECT storeItemId FROM store_item_hidden_dates WHERE date = ?').all(date) as Array<{ storeItemId: number }>;
  const hiddenIds = new Set(hiddenToday.map((row) => row.storeItemId));
  const enriched = items.map((item) => ({
    ...item,
    hiddenToday: hiddenIds.has(item.id),
    dailyRemaining: item.stockType === 'daily_stock' ? Math.max(0, (item.dailyStockLimit ?? 0) - getDailyUsed(item.id, date)) : null,
    boughtOnce: item.stockType === 'one_time_global' ? oneTimeBought(item.id) : false
  }));
  const purchases = db.prepare('SELECT * FROM store_purchases ORDER BY purchasedAt DESC LIMIT 100').all() as StorePurchase[];
  return { date, balances: getBalances(), items: enriched, purchases };
}

export function getStorePurchaseHistory() {
  return db.prepare('SELECT * FROM store_purchases ORDER BY purchasedAt DESC').all() as StorePurchase[];
}
