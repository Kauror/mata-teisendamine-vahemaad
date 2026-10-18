import { describe, expect, it } from 'vitest';
import { emptyState, NO_AREA_ANSWER, SEA_ANSWER, type ClientQuestion } from '@/lib/kaardimang/engine';
import { answerIdFor, playAreaPaint, playPaint, scoreLine } from './mapAnswers';

function question(targetType: ClientQuestion['targetType'], extra: Partial<ClientQuestion> = {}): ClientQuestion {
  return {
    id: 'q1', kind: 'find_country', answering: 'map', targetType, targetId: null, prompt: '', options: null,
    highlightId: null, hideCapitalId: null, state: emptyState(), correctId: null, explainEt: null, hintEt: null, ...extra
  };
}

describe('answerIdFor', () => {
  it('answers a continent or world-part question with the land it belongs to', () => {
    expect(answerIdFor(question('continent'), { kind: 'land', id: 'RUS', wp: 'europe', ct: 'eurasia' })).toBe('eurasia');
    expect(answerIdFor(question('worldPart'), { kind: 'land', id: 'RUS', wp: 'asia', ct: 'eurasia' })).toBe('asia');
    expect(answerIdFor(question('continent'), { kind: 'land', id: 'NZL', wp: 'oceania', ct: null })).toBe(NO_AREA_ANSWER);
  });

  it('turns open sea into the neutral answer and keeps ocean areas as oceans', () => {
    expect(answerIdFor(question('country'), { kind: 'sea' })).toBe(SEA_ANSWER);
    expect(answerIdFor(question('country'), { kind: 'area', id: 'pacific' })).toBe(SEA_ANSWER);
    expect(answerIdFor(question('ocean'), { kind: 'area', id: 'pacific' })).toBe('pacific');
    expect(answerIdFor(question('country'), { kind: 'marker', id: 'VAT' })).toBe('VAT');
  });
});

describe('playPaint', () => {
  it('paints the answer, the misses and the highlight, never revealing an unresolved answer', () => {
    const open = question('country', { highlightId: 'LVA', state: { ...emptyState(), attempts: 1, wrongIds: ['LTU'] } });
    expect(playPaint(open, { id: 'LVA' })).toBe('highlight');
    expect(playPaint(open, { id: 'LTU' })).toBe('wrong');
    expect(playPaint(open, { id: 'EST' })).toBeNull();
    expect(playPaint({ ...open, correctId: 'EST' }, { id: 'EST' })).toBe('correct');
    expect(playAreaPaint(question('ocean', { correctId: 'pacific' }), 'pacific')).toBe('correct');
  });

  it('dims land that is on no continent during a continent question', () => {
    expect(playPaint(question('continent'), { id: 'NZL', ct: null })).toBe('dim');
  });
});

describe('scoreLine', () => {
  it('agrees in Estonian', () => {
    expect(scoreLine(6, 8)).toBe('8 küsimusest 6 õiget');
    expect(scoreLine(1, 8)).toBe('8 küsimusest 1 õige');
  });
});
