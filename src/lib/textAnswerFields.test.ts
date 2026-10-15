import { describe, expect, it } from 'vitest';
import { generateKiurMathSession } from '@/lib/exercises/kiurMath';
import { kiurTextProblemPool } from '@/lib/kiurTextProblems';
import { verifyGeneratedMathAnswer } from '@/lib/shared/answerVerification';
import { composeTextAnswer, textAnswerFields, textAnswerValues } from '@/lib/textAnswerFields';
import type { GeneratedQuestion } from '@/lib/types';

// Every pool task as the runner receives it: generated the same way the server
// re-generates a session to verify it, so the shape cannot drift from the real one.
function generatedPool() {
  const byTask = new Map<string, GeneratedQuestion>();
  for (let seed = 1; seed < 5000 && byTask.size < kiurTextProblemPool.length; seed++) {
    for (const question of generateKiurMathSession('tekstulesanded', 'Tekstülesanded', 'Lihtne', 5, seed)) {
      byTask.set(question.id.replace(/-\d+$/, ''), question);
    }
  }
  return byTask;
}

// What the runner submits when the child types exactly the expected numbers.
function runnerAnswer(question: GeneratedQuestion, typed: string) {
  const fields = textAnswerFields(question);
  if (!fields) return typed;
  return composeTextAnswer(fields, textAnswerValues(typed, fields));
}

describe('text problem answer fields', () => {
  const pool = generatedPool();

  it('reaches every task in the pool', () => {
    expect(pool.size).toBe(kiurTextProblemPool.length);
  });

  it.each(kiurTextProblemPool.map((task) => [task.id, task.answer] as const))('%s (%s) can be answered correctly', (id) => {
    const question = pool.get(id)!;
    expect(verifyGeneratedMathAnswer(question, runnerAnswer(question, question.correctAnswerText!))).toBe(true);
    for (const accepted of question.acceptedAnswers ?? []) {
      expect(verifyGeneratedMathAnswer(question, runnerAnswer(question, accepted))).toBe(true);
    }
  });

  it('keeps a multi-word unit after the last number', () => {
    expect(textAnswerFields(pool.get('tekst-036')!)).toEqual([{ unit: 'minuti pärast' }]);
    expect(textAnswerFields(pool.get('tekst-094')!)).toEqual([{ unit: 'väikest ringi' }]);
    expect(textAnswerFields(pool.get('tekst-001')!)).toEqual([{ unit: 'raamatut' }]);
  });

  it('accepts what a child would type for the sentence answers', () => {
    expect(verifyGeneratedMathAnswer(pool.get('tekst-017')!, '8 tundi ja 1 tund vähem')).toBe(true);
    expect(verifyGeneratedMathAnswer(pool.get('tekst-017')!, '8 ja 2')).toBe(false);
    expect(verifyGeneratedMathAnswer(pool.get('tekst-019')!, 'kell 21, kell 5.')).toBe(true);
    expect(verifyGeneratedMathAnswer(pool.get('tekst-019')!, 'kell 22 ja kell 6')).toBe(false);
    expect(verifyGeneratedMathAnswer(pool.get('tekst-026')!, '9-6+2-5=0')).toBe(true);
    expect(verifyGeneratedMathAnswer(pool.get('tekst-026')!, '-, +, -')).toBe(true);
    expect(verifyGeneratedMathAnswer(pool.get('tekst-026')!, '+ + +')).toBe(false);
    expect(verifyGeneratedMathAnswer(pool.get('tekst-034')!, '-+')).toBe(true);
    expect(verifyGeneratedMathAnswer(pool.get('tekst-034')!, '+ -')).toBe(false);
  });
});
