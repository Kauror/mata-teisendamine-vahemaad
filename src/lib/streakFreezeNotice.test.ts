import { describe, expect, it } from 'vitest';
import { freezeWord, streakFreezeNotice } from '@/lib/streakFreezeNotice';

describe('freezeWord', () => {
  it('agrees with the number, as the rest of the app does', () => {
    expect(freezeWord(1)).toBe('külmutus');
    expect(freezeWord(0)).toBe('külmutust');
    expect(freezeWord(2)).toBe('külmutust');
  });
});

describe('streakFreezeNotice', () => {
  it('says nothing when no freeze was spent', () => {
    expect(streakFreezeNotice({ coveredDays: 0, held: 2 })).toBeNull();
  });

  it('names the missed day, the rescue and what is left', () => {
    const notice = streakFreezeNotice({ coveredDays: 1, held: 1 });
    expect(notice?.headline).toBe('Eile jäi vahele, kasutasid ära külmutuse.');
    expect(notice?.detail).toBe('Sul on järgi veel 1 külmutus.');
  });

  it('agrees with the number when more than one is left', () => {
    expect(streakFreezeNotice({ coveredDays: 1, held: 2 })?.detail)
      .toBe('Sul on järgi veel 2 külmutust.');
  });

  it('tells the child when they have run out, and where to get another', () => {
    expect(streakFreezeNotice({ coveredDays: 1, held: 0 })?.detail)
      .toBe('Külmutused on otsas, osta poest uus.');
  });

  it('handles two days in one go', () => {
    const notice = streakFreezeNotice({ coveredDays: 2, held: 0 });
    expect(notice?.headline).toBe('2 päeva jäi vahele, kasutasid ära külmutused.');
  });
});
