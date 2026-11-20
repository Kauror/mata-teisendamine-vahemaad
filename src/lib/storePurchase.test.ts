import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import { createStoreItem, purchaseStoreItem } from '@/lib/store';
import { getBalance, manualPointAdjustment } from '@/lib/tasks';

// C8: a purchase carries a client-generated id. A retry after a lost response
// returns the original purchase instead of buying a second time.

beforeEach(() => {
  db.pragma('foreign_keys = OFF');
  db.exec('DELETE FROM store_purchases; DELETE FROM store_item_hidden_dates; DELETE FROM store_items; DELETE FROM point_ledger;');
  db.pragma('foreign_keys = ON');
  manualPointAdjustment('kiur', 10, 'test');
});

function item(stockType: 'unlimited' | 'fixed_stock' = 'unlimited') {
  return Number(createStoreItem({ title: 'Jäätis', price: 3, visibility: 'both', stockType, fixedStockRemaining: stockType === 'fixed_stock' ? 2 : null }));
}

describe('store purchase retry', () => {
  it('buys once for one purchase id, however often it is retried', () => {
    const id = item('fixed_stock');
    const first = purchaseStoreItem('kiur', id, undefined, '018f47f6-9f2c-4b9a-8a2e-00000000c801');
    const retry = purchaseStoreItem('kiur', id, undefined, '018f47f6-9f2c-4b9a-8a2e-00000000c801');
    expect(retry).toEqual(first);
    expect(getBalance('kiur')).toBe(7);
    expect((db.prepare('SELECT COUNT(*) AS count FROM store_purchases').get() as { count: number }).count).toBe(1);
    expect((db.prepare('SELECT fixedStockRemaining FROM store_items WHERE id = ?').get(id) as { fixedStockRemaining: number }).fixedStockRemaining).toBe(1);
  });

  it('a new purchase id buys again', () => {
    const id = item();
    purchaseStoreItem('kiur', id, undefined, '018f47f6-9f2c-4b9a-8a2e-00000000c802');
    purchaseStoreItem('kiur', id, undefined, '018f47f6-9f2c-4b9a-8a2e-00000000c803');
    expect(getBalance('kiur')).toBe(4);
  });

  it('refuses a purchase id reused for another item or child', () => {
    const id = item();
    const other = item();
    purchaseStoreItem('kiur', id, undefined, '018f47f6-9f2c-4b9a-8a2e-00000000c804');
    expect(() => purchaseStoreItem('kiur', other, undefined, '018f47f6-9f2c-4b9a-8a2e-00000000c804')).toThrow();
    expect(getBalance('kiur')).toBe(7);
  });
});
