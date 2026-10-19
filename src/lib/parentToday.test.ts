import { describe, expect, it } from 'vitest';
import { parentTodayChild } from '@/lib/parentToday';

describe('parentTodayChild', () => {
  const exercises = [{ id: 'a', title: 'Sõnavara' }, { id: 'b', title: 'Loe ja vasta' }, { id: 'c', title: 'Sprint' }];

  it('counts exercises done today and marks repeats', () => {
    const card = parentTodayChild('kiur', 12, exercises, { a: 1, c: 3 }, []);
    expect(card.exercises.done).toBe(2);
    expect(card.exercises.total).toBe(3);
    expect(card.exercises.rows.map((row) => [row.state, row.meta])).toEqual([['done', ''], ['todo', ''], ['done', '3×']]);
  });

  it('maps task states: approval waits, a sibling-locked task counts as done', () => {
    const card = parentTodayChild('kirsi', 0, [], {}, [
      { title: 'Pese hambad', points: 1, status: 'completed', completedBy: 'kirsi' },
      { title: 'Õues 1 h', points: 1, status: 'pending_approval', completedBy: null },
      { title: 'Nõudepesumasin', points: 1, status: 'locked', completedBy: 'kiur' },
      { title: 'Voodi', points: 1, status: 'active', completedBy: null }
    ]);
    expect(card.tasks.rows).toEqual([
      { name: 'Pese hambad', state: 'done', meta: '+1' },
      { name: 'Õues 1 h', state: 'wait', meta: 'ootab sind' },
      { name: 'Nõudepesumasin', state: 'done', meta: 'tegi Kiur' },
      { name: 'Voodi', state: 'todo', meta: '' }
    ]);
    expect(card.tasks.done).toBe(2);
  });

  it('lists what is left, exercises first; a task waiting for the parent is not left', () => {
    const card = parentTodayChild('kiur', 0, exercises, { a: 1 }, [
      { title: 'Õues 1 h', points: 1, status: 'pending_approval', completedBy: null },
      { title: 'Raamat', points: 3, status: 'active', completedBy: null }
    ]);
    expect(card.left).toEqual(['Loe ja vasta', 'Sprint', 'Raamat']);
  });
});
