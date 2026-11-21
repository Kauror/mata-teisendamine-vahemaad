import { describe, expect, it } from 'vitest';
import { dayPhrase, subjectGenitive, taskHeadline } from './schoolText';

const SAT = '2026-11-21';

describe('dayPhrase', () => {
  it('says today, tomorrow, a weekday this week and a date further on', () => {
    expect(dayPhrase(SAT, SAT, 'on')).toBe('Täna');
    expect(dayPhrase('2026-11-22', SAT, 'by')).toBe('Homseks');
    expect(dayPhrase('2026-11-24', SAT, 'on')).toBe('Teisipäeval');
    expect(dayPhrase('2026-11-27', SAT, 'by')).toBe('Reedeks');
    expect(dayPhrase('2026-12-01', SAT, 'on')).toBe('1. detsembril');
  });
});

describe('subjectGenitive', () => {
  it('bends the usual subjects and gives up on unknown ones', () => {
    expect(subjectGenitive('Eesti keel')).toBe('eesti keele');
    expect(subjectGenitive('Loodusõpetus')).toBe('loodusõpetuse');
    expect(subjectGenitive('Matemaatika')).toBe('matemaatika');
    expect(subjectGenitive('Kehaline kasvatus')).toBe('kehalise kasvatuse');
    expect(subjectGenitive('Robootika ring')).toBeNull();
  });
});

describe('taskHeadline', () => {
  it('names the day, the subject and that it is a test', () => {
    expect(taskHeadline({ date: '2026-11-24', subject: 'Eesti keel', type: 'Kontrolltöö', kind: 'test', text: '' }, SAT))
      .toBe('Teisipäeval on eesti keele kontrolltöö.');
    expect(taskHeadline({ date: '2026-11-23', subject: 'Robootika ring', type: 'Tunnikontroll', kind: 'test', text: '' }, SAT))
      .toBe('Esmaspäeval on tunnikontroll: Robootika ring.');
    expect(taskHeadline({ date: '2026-11-25', subject: 'Tehnoloogiaõpetus', type: 'Kodune ülesanne', kind: 'homework', text: '' }, SAT))
      .toBe('Kolmapäevaks: tehnoloogiaõpetus');
  });
});
