import { describe, expect, it } from 'vitest';
import { advanceMathLevel, INITIAL_MATH_LEVEL, isAdaptiveMathTopic, mathLevelAfter, type MathLevelSession } from '@/lib/mathDifficulty';

const run = (difficulty: string, score: number, questionCount = 15): MathLevelSession => ({ difficulty, score, questionCount });

describe('adaptive maths difficulty', () => {
  it('starts at Lihtne', () => {
    expect(mathLevelAfter([])).toEqual({ level: 'Lihtne', goodSessions: 0 });
  });

  it('steps up after two sessions at 90 % or more, then to Raske after two more', () => {
    expect(mathLevelAfter([run('Lihtne', 14)]).level).toBe('Lihtne');
    expect(mathLevelAfter([run('Lihtne', 14), run('Lihtne', 15)]).level).toBe('Keskmine');
    expect(mathLevelAfter([run('Lihtne', 14), run('Lihtne', 15), run('Keskmine', 14)]).level).toBe('Keskmine');
    expect(mathLevelAfter([run('Lihtne', 14), run('Lihtne', 15), run('Keskmine', 14), run('Keskmine', 14)]).level).toBe('Raske');
    expect(mathLevelAfter([run('Lihtne', 14), run('Lihtne', 15), run('Keskmine', 14), run('Keskmine', 14), run('Raske', 15), run('Raske', 15)]).level).toBe('Raske');
  });

  it('needs the two good sessions in a row', () => {
    expect(mathLevelAfter([run('Lihtne', 14), run('Lihtne', 12), run('Lihtne', 14)]).level).toBe('Lihtne');
  });

  it('steps down below 60 %, never below Lihtne', () => {
    const atRaske = [run('Lihtne', 15), run('Lihtne', 15), run('Keskmine', 15), run('Keskmine', 15)];
    expect(mathLevelAfter([...atRaske, run('Raske', 8)]).level).toBe('Keskmine');
    expect(mathLevelAfter([...atRaske, run('Raske', 9)]).level).toBe('Raske');
    expect(mathLevelAfter([run('Lihtne', 2)]).level).toBe('Lihtne');
  });

  it('ignores sessions at another level, e.g. every old Lihtne run once he is past it', () => {
    const atKeskmine = mathLevelAfter([run('Lihtne', 15), run('Lihtne', 15)]);
    expect(advanceMathLevel(atKeskmine, run('Lihtne', 0))).toEqual(atKeskmine);
    expect(advanceMathLevel(INITIAL_MATH_LEVEL, run('Raske', 15))).toEqual(INITIAL_MATH_LEVEL);
  });

  it('adapts only Kiur\'s generated topics', () => {
    expect(isAdaptiveMathTopic('kiur', 'jagamine-kahekohaline-uhekohaline')).toBe(true);
    expect(isAdaptiveMathTopic('kiur', 'tekstulesanded')).toBe(false);
    expect(isAdaptiveMathTopic('kiur', 'korrutamine')).toBe(false);
    expect(isAdaptiveMathTopic('kirsi', 'arvutamine')).toBe(false);
  });
});
