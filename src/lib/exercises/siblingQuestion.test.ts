import { describe, expect, it } from 'vitest';
import { generateKirsiSession } from '@/lib/exercises/kirsiMath';
import { generateKiurMathSession } from '@/lib/exercises/kiurMath';
import { generateSiblingQuestion, hasSiblingGenerator, questionContentKey } from '@/lib/exercises/siblingQuestion';
import type { GeneratedQuestion } from '@/lib/types';

const shape = (q: GeneratedQuestion) => q.question.replace(/\d+/g, '#');

describe('sibling questions for Kordamine', () => {
  it.each(['jagamine-kahekohaline-uhekohaline', 'arvud-10000-piires', 'ring-ja-ringjoon', 'mustrid', 'mootuhikud-pikkused', 'korrutamine'])('%s: same template, new content, for nearly every question', (topic) => {
    let found = 0, total = 0;
    for (let seed = 1; seed <= 40; seed += 1) {
      for (const question of generateKiurMathSession(topic, 'Segaharjutus', 'Lihtne', 15, seed)) {
        total += 1;
        const sibling = generateSiblingQuestion({ learner: 'kiur', topic, category: 'Segaharjutus', question }, seed * 31 + total);
        if (!sibling) continue;
        found += 1;
        expect(questionContentKey(sibling)).not.toBe(questionContentKey(question));
        expect(sibling.kind ?? 'numeric').toBe(question.kind ?? 'numeric');
        if (shape(sibling) !== shape(question)) expect(sibling.category).toBe(question.category);
      }
    }
    // A few templates have only one or two questions («Ring või ringjoon»):
    // those are replayed as they were.
    expect(found / total).toBeGreaterThan(0.85);
  });

  it.each(['Loendamine', 'Arvutamine 10 piires', 'Arvutamine 20 piires', 'Suurem või väiksem kuni 100', 'Kellaaeg'] as const)('Kirsi %s', (mode) => {
    for (let seed = 1; seed <= 20; seed += 1) {
      for (const question of generateKirsiSession(mode, 15, seed)) {
        const sibling = generateSiblingQuestion({ learner: 'kirsi', topic: 'x', category: mode, question }, seed);
        expect(sibling).not.toBeNull();
        expect(sibling!.type).toBe(question.type);
        expect(questionContentKey(sibling!)).not.toBe(questionContentKey(question));
      }
    }
  });

  it('has no generator for fixed content', () => {
    expect(hasSiblingGenerator({ learner: 'kiur', topic: 'tekstulesanded', category: 'Tekstülesanded' })).toBe(false);
    expect(hasSiblingGenerator({ learner: 'kiur', topic: 'loe-ja-vasta', category: 'Lugemine' })).toBe(false);
  });
});
