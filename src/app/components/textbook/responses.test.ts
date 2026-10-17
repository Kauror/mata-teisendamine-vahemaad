import { describe, expect, it } from 'vitest';
import type { ClientAnswerView } from '@/lib/textbook/api';
import {
  assignGroup,
  describeResponse,
  draftFrom,
  emptyDraft,
  isDraftComplete,
  moveItem,
  nextOpenPrompt,
  pairPrompt,
  sameResponse,
  toggleOption,
  viewFromSpec
} from '@/app/components/textbook/responses';

const single: ClientAnswerView = { type: 'single_choice', options: [{ id: 'a', text: 'tahke' }, { id: 'b', text: 'vedel' }] };
const multi: ClientAnswerView = { type: 'multiple_selection', options: [{ id: 'a', text: 'vihm' }, { id: 'b', text: 'lumi' }, { id: 'c', text: 'tuul' }] };
const matching: Extract<ClientAnswerView, { type: 'matching' }> = {
  type: 'matching',
  prompts: [{ id: 'p1', text: 'jää' }, { id: 'p2', text: 'aur' }],
  choices: [{ id: 'c1', text: 'tahke' }, { id: 'c2', text: 'gaasiline' }, { id: 'x1', text: 'pehme' }]
};
const grouping: ClientAnswerView = { type: 'grouping', groups: [{ id: 'g1', text: 'soojenedes' }, { id: 'g2', text: 'jahtudes' }], items: [{ id: 'i1', text: 'sulamine' }, { id: 'i2', text: 'jäätumine' }] };
const ordering: ClientAnswerView = { type: 'ordering', items: [{ id: 's2', text: 'teine' }, { id: 's1', text: 'esimene' }, { id: 's3', text: 'kolmas' }] };
const hotspot: ClientAnswerView = { type: 'diagram_hotspot', diagramId: 'demo-water-cycle', regions: [{ id: 'sun', marker: 'A', position: 'ülemine vasak nurk' }, { id: 'sea', marker: 'B', position: 'alumine vasak osa' }] };

describe('answer drafts', () => {
  it('starts empty, except ordering which starts in the displayed order', () => {
    expect(emptyDraft(single)).toBeNull();
    expect(emptyDraft(hotspot)).toBeNull();
    expect(emptyDraft(multi)).toEqual({ type: 'multiple_selection', optionIds: [] });
    expect(emptyDraft(ordering)).toEqual({ type: 'ordering', order: ['s2', 's1', 's3'] });
    expect(isDraftComplete(ordering, emptyDraft(ordering))).toBe(true);
  });

  it('knows when each answer type is complete', () => {
    expect(isDraftComplete(single, { type: 'single_choice', optionId: 'a' })).toBe(true);
    expect(isDraftComplete(single, { type: 'single_choice', optionId: 'zzz' })).toBe(false);
    expect(isDraftComplete(multi, { type: 'multiple_selection', optionIds: [] })).toBe(false);
    expect(isDraftComplete(multi, toggleOption(null, 'a'))).toBe(true);
    expect(isDraftComplete(matching, { type: 'matching', pairs: { p1: 'c1' } })).toBe(false);
    expect(isDraftComplete(matching, { type: 'matching', pairs: { p1: 'c1', p2: 'c2' } })).toBe(true);
    expect(isDraftComplete(grouping, assignGroup(null, 'i1', 'g1'))).toBe(false);
    expect(isDraftComplete(grouping, assignGroup(assignGroup(null, 'i1', 'g1'), 'i2', 'g2'))).toBe(true);
    expect(isDraftComplete(hotspot, { type: 'diagram_hotspot', regionId: 'sea' })).toBe(true);
    expect(isDraftComplete(hotspot, { type: 'single_choice', optionId: 'sea' })).toBe(false);
  });

  it('takes a saved answer only when its type matches', () => {
    expect(draftFrom(single, { type: 'single_choice', optionId: 'b' })).toEqual({ type: 'single_choice', optionId: 'b' });
    expect(draftFrom(single, { type: 'diagram_hotspot', regionId: 'sea' })).toBeNull();
  });

  it('toggles options in and out', () => {
    const once = toggleOption(null, 'a');
    const twice = toggleOption(toggleOption(once, 'b'), 'a');
    expect(twice).toEqual({ type: 'multiple_selection', optionIds: ['b'] });
  });

  it('uses a matching choice at most once and unpairs on a repeat', () => {
    const first = pairPrompt(null, 'p1', 'c1');
    const moved = pairPrompt(first, 'p2', 'c1');
    expect(moved).toEqual({ type: 'matching', pairs: { p2: 'c1' } });
    expect(pairPrompt(moved, 'p2', 'c1')).toEqual({ type: 'matching', pairs: {} });
    expect(nextOpenPrompt(matching, moved)).toBe('p1');
    expect(nextOpenPrompt(matching, { type: 'matching', pairs: { p1: 'c1', p2: 'c2' } })).toBeNull();
  });

  it('moves ordering items one step and never out of range', () => {
    expect(moveItem(['a', 'b', 'c'], 'c', -1)).toEqual(['a', 'c', 'b']);
    expect(moveItem(['a', 'b', 'c'], 'a', -1)).toEqual(['a', 'b', 'c']);
    expect(moveItem(['a', 'b', 'c'], 'c', 1)).toEqual(['a', 'b', 'c']);
    expect(moveItem(['a', 'b'], 'zzz', 1)).toEqual(['a', 'b']);
  });

  it('compares answers by value', () => {
    expect(sameResponse({ type: 'multiple_selection', optionIds: ['a', 'b'] }, { type: 'multiple_selection', optionIds: ['b', 'a'] })).toBe(true);
    expect(sameResponse({ type: 'ordering', order: ['a', 'b'] }, { type: 'ordering', order: ['b', 'a'] })).toBe(false);
    expect(sameResponse({ type: 'matching', pairs: { p1: 'c1' } }, { type: 'matching', pairs: { p1: 'c1' } })).toBe(true);
    expect(sameResponse(null, null)).toBe(true);
    expect(sameResponse(null, { type: 'single_choice', optionId: 'a' })).toBe(false);
  });
});

describe('describeResponse', () => {
  it('spells out every answer type in Estonian', () => {
    expect(describeResponse(single, { type: 'single_choice', optionId: 'b' })).toEqual(['vedel']);
    expect(describeResponse(multi, { type: 'multiple_selection', optionIds: ['b', 'a'] })).toEqual(['vihm, lumi']);
    expect(describeResponse(matching, { type: 'matching', pairs: { p1: 'c1' } })).toEqual(['jää → tahke', 'aur → —']);
    expect(describeResponse(grouping, { type: 'grouping', assignments: { i1: 'g1', i2: 'g1' } })).toEqual(['soojenedes: sulamine, jäätumine', 'jahtudes: —']);
    expect(describeResponse(ordering, { type: 'ordering', order: ['s1', 's2', 's3'] })).toEqual(['1. esimene', '2. teine', '3. kolmas']);
    expect(describeResponse(hotspot, { type: 'diagram_hotspot', regionId: 'sea' })).toEqual(['B – meri']);
    expect(describeResponse(single, null)).toEqual(['—']);
  });

  it('builds the authored view of a full question for the parent', () => {
    const view = viewFromSpec({ type: 'diagram_hotspot', diagramId: 'demo-plant-parts', correctRegionId: 'leaf' });
    expect(view.type === 'diagram_hotspot' && view.regions.map((region) => region.id)).toEqual(['flower', 'leaf', 'stem', 'root']);
  });
});
