import { describe, expect, it } from 'vitest';
import { answerForms, isAnswerCorrect, normalizeAnswer } from '@/lib/vocabulary/answers';
import { ENGLISH_VOCABULARY } from '@/lib/englishVocabulary';

const word = (english: string, acceptedAnswers: string[] = []) => ({ english, acceptedAnswers });

describe('answer forms of a stored entry', () => {
  it('splits on «;» into whole alternatives', () => {
    expect(answerForms('girl; girls')).toEqual(['girl; girls', 'girl', 'girls']);
  });

  it('reads a comma list of single words as alternatives, but not a sentence', () => {
    expect(answerForms('drink, drank, drunk')).toEqual(['drink, drank, drunk', 'drink', 'drank', 'drunk']);
    expect(answerForms('Sorry, I’m late.')).toEqual(['Sorry, I’m late.']);
    expect(answerForms('Yes, it is.')).toEqual(['Yes, it is.']);
  });

  it('swaps the words around a slash in their context', () => {
    expect(answerForms('eat / have breakfast')).toEqual(['eat / have breakfast', 'eat breakfast', 'have breakfast']);
    expect(answerForms('there is / are')).toEqual(['there is / are', 'there is', 'there are']);
    expect(answerForms('He’s / She’s from')).toEqual(['He’s / She’s from', 'He’s from', 'She’s from']);
  });

  it('treats a bracketed part as optional', () => {
    expect(answerForms('look (at)')).toEqual(['look (at)', 'look at', 'look']);
    expect(answerForms('It’s one (o’clock).')).toEqual(['It’s one (o’clock).', 'It’s one o’clock.', 'It’s one.']);
    expect(answerForms('the United States (of America)')).toContain('the United States');
  });
});

describe('typed answers with several stored forms', () => {
  it('accepts each form of a multi-form entry', () => {
    expect(isAnswerCorrect(word('girl; girls'), 'girls')).toBe(true);
    expect(isAnswerCorrect(word('shoe, shoes'), 'shoe')).toBe(true);
    expect(isAnswerCorrect(word('look (at)'), 'look')).toBe(true);
    expect(isAnswerCorrect(word('look (at)'), 'Look at')).toBe(true);
    expect(isAnswerCorrect(word('eat / have breakfast'), 'have breakfast')).toBe(true);
    expect(isAnswerCorrect(word('It’s one (o’clock).'), "it's one o'clock")).toBe(true);
  });

  it('accepts hyphen/space and US/UK spelling variants of the same word', () => {
    expect(isAnswerCorrect(word('ice-cream'), 'ice cream')).toBe(true);
    expect(isAnswerCorrect(word('ice cream'), 'ice-cream')).toBe(true);
    expect(isAnswerCorrect(word('colour'), 'color')).toBe(true);
    expect(isAnswerCorrect(word('favorite colors'), 'favourite colours')).toBe(true);
    expect(isAnswerCorrect(word('grey'), 'gray')).toBe(true);
  });

  it('still rejects misspellings, partial sentences and look-alike words', () => {
    expect(isAnswerCorrect(word('ice-cream'), 'icecream')).toBe(false);
    expect(isAnswerCorrect(word('look (at)'), 'at')).toBe(false);
    expect(isAnswerCorrect(word('Sorry, I’m late.'), 'sorry')).toBe(false);
    expect(isAnswerCorrect(word('eat / have breakfast'), 'eat')).toBe(false);
    expect(isAnswerCorrect(word('literature'), 'litreature')).toBe(false);
    expect(isAnswerCorrect(word('colour'), 'colur')).toBe(false);
    expect(isAnswerCorrect(word('girl; girls'), 'girl; boys')).toBe(false);
  });

  it('never turns an answer that matched the stored text wrong', () => {
    const stored = ENGLISH_VOCABULARY.map((entry) => entry.english);
    const variants = (value: string) => [value, value.toUpperCase(), ` ${value}  `, value.replace(/’/g, "'"), `${value}!`];
    for (const english of stored) {
      for (const answer of variants(english)) {
        const before = normalizeAnswer(english) === normalizeAnswer(answer) && normalizeAnswer(answer) !== '';
        if (before) expect(isAnswerCorrect(word(english), answer), `${english} ← ${answer}`).toBe(true);
      }
    }
    for (const entry of [word('mum', ['mom', 'mummy']), word('cat')]) {
      for (const answer of [...entry.acceptedAnswers, entry.english]) expect(isAnswerCorrect(entry, answer)).toBe(true);
    }
  });

  it('accepts every expanded form of every Sprint word', () => {
    for (const entry of ENGLISH_VOCABULARY) {
      for (const form of answerForms(entry.english)) expect(isAnswerCorrect(word(entry.english), form), form).toBe(true);
    }
  });
});
