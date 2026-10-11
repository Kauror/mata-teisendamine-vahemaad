import {describe,it,expect} from 'vitest';
import {advanceVocabularyState,currentVocabularyWord,isVocabularyAnswerCorrect,makeVocabularyState,normalizeVocabularyAnswer,vocabularyPasses,type VocabularyWord} from '@/lib/englishUnits';
const words:VocabularyWord[]=[
 {id:'a',estonian:'kass',english:'cat',pronunciation:'/kæt/',acceptedAnswers:[]},
 {id:'b',estonian:'koer',english:'dog',pronunciation:'/dɒɡ/',acceptedAnswers:[]},
 {id:'c',estonian:'maja',english:'house',pronunciation:'/haʊs/',acceptedAnswers:[]}
];
const first=()=>0.99;
describe('English vocabulary states',()=>{
 it('never permits a swipe until answer is revealed',()=>{
  const state=makeVocabularyState(words,'study',first);
  expect(()=>advanceVocabularyState(state,{action:'grade',known:true})).toThrow();
  expect(state.cursor).toBe(0);
 });
 it('requeues wrong cards and finishes only after every word has received a correct swipe',()=>{
  let state=makeVocabularyState(words,'study',first);
  state=advanceVocabularyState(state,{action:'reveal'}).state;
  state=advanceVocabularyState(state,{action:'grade',known:false}).state;
  expect(state.queue).toHaveLength(4);
  expect(state.firstKnown).toBe(0);
  while(!state.completed){
   state=advanceVocabularyState(state,{action:'reveal'}).state;
   state=advanceVocabularyState(state,{action:'grade',known:true}).state;
  }
  expect(state.mastered).toEqual(['b','c','a']);
  expect(state.firstKnown).toBe(2);
 });
 it('checks exact spelling, capitalization, spaces and explicit alternatives',()=>{
  expect(normalizeVocabularyAnswer('  CAt  ')).toBe('cat');
  expect(isVocabularyAnswerCorrect(words[0],'CAt')).toBe(true);
  expect(isVocabularyAnswerCorrect(words[0],'cta')).toBe(false);
  expect(isVocabularyAnswerCorrect({...words[0],acceptedAnswers:['kitty']},'Kitty')).toBe(true);
 });
 it('uses true 95% threshold, including small units',()=>{
  expect(vocabularyPasses(18,19)).toBe(false);
  expect(vocabularyPasses(19,20)).toBe(true);
  expect(vocabularyPasses(18,20)).toBe(false);
  expect(vocabularyPasses(1,1)).toBe(true);
  expect(vocabularyPasses(0,1)).toBe(false);
 });
 it('tests missed items, then starts a fresh FULL round until passing',()=>{
  let state=makeVocabularyState(words,'test',first);
  for(let i=0;i<3;i++){
   state=advanceVocabularyState(state,{action:'answer',answer:i===0?'bad':currentVocabularyWord(state)!.english}).state;
   state=advanceVocabularyState(state,{action:'next'}).state;
  }
  expect(state.firstTestScore).toBe(2);
  expect(state.completed).toBe(false);
  expect(state.phase).toBe('correction');
  expect(state.queue).toHaveLength(1);
  state=advanceVocabularyState(state,{action:'answer',answer:currentVocabularyWord(state)!.english}).state;
  state=advanceVocabularyState(state,{action:'next'}).state;
  expect(state.phase).toBe('full');
  expect(state.round).toBe(2);
  expect(state.queue).toHaveLength(3);
  for(let i=0;i<3;i++){
   state=advanceVocabularyState(state,{action:'answer',answer:currentVocabularyWord(state)!.english}).state;
   state=advanceVocabularyState(state,{action:'next'}).state;
  }
  expect(state.completed).toBe(true);
  expect(state.lastTestScore).toBe(3);
  expect(state.firstTestScore).toBe(2);
 });
 it('retries a missed correction card before repeating whole test',()=>{
  let state=makeVocabularyState(words.slice(0,2),'test',first);
  state=advanceVocabularyState(state,{action:'answer',answer:'oops'}).state;
  state=advanceVocabularyState(state,{action:'next'}).state;
  state=advanceVocabularyState(state,{action:'answer',answer:'oops'}).state;
  state=advanceVocabularyState(state,{action:'next'}).state;
  expect(state.phase).toBe('correction');
  state=advanceVocabularyState(state,{action:'answer',answer:'oops'}).state;
  state=advanceVocabularyState(state,{action:'next'}).state;
  expect(state.queue.length).toBe(3);
  expect(state.phase).toBe('correction');
 });
});
