'use client';
import Link from 'next/link';
import { useEffect,useRef,useState,type FormEvent,type PointerEvent } from 'react';
import type { VocabularyMode,VocabularyState,VocabularyAction } from '@/lib/englishUnits';
type Unit={id:string;unitNumber:number;title:string;available:boolean;wordCount:number;weakCount:number;studyCompletedAt:string|null;testPassedAt:string|null;firstTestScore:number|null;firstTestTotal:number|null;lastTestScore:number|null;lastTestTotal:number|null;testRuns:number};
type Session={id:string;unitId:string;mode:VocabularyMode;revision:number;state:VocabularyState};
async function json<T>(url:string,init?:RequestInit):Promise<T>{
 const response=await fetch(url,{...init,headers:{'Content-Type':'application/json',...(init?.headers??{})},cache:'no-store'});
 const body=await response.json();if(!response.ok)throw new Error(body.message??'Ühendus ebaõnnestus.');return body as T;
}
export default function EnglishVocabularyPage(){
 const [units,setUnits]=useState<Unit[]>([]);
 const [session,setSession]=useState<Session|null>(null);
 const [answer,setAnswer]=useState('');
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const [loading,setLoading]=useState(true);
 const startX=useRef<number|null>(null);
 const requestLock=useRef(false);
 const load=async()=>{setUnits((await json<{units:Unit[]}>('/api/english/units')).units);};
 useEffect(()=>{let active=true;void json<{units:Unit[]}>('/api/english/units').then(data=>{if(active)setUnits(data.units);}).catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[]);
 const begin=async(unitId:string,mode:VocabularyMode)=>{
  if(requestLock.current)return;requestLock.current=true;setBusy(true);setError('');
  try{const item=await json<Session>('/api/english/sessions',{method:'POST',body:JSON.stringify({unitId,mode})});setSession(item);setAnswer('');}
  catch(e){setError(e instanceof Error?e.message:'Viga');}
  finally{requestLock.current=false;setBusy(false);}
 };
 const act=async(action:VocabularyAction)=>{
  if(!session || requestLock.current)return;
  requestLock.current=true;setBusy(true);setError('');
  try{const next=await json<Session>(`/api/english/sessions/${session.id}`,{method:'POST',body:JSON.stringify({revision:session.revision,action})});setSession(next);if(action.action==='next')setAnswer('');if(next.state.completed)await load();}
  catch(e){setError(e instanceof Error?e.message:'Viga');}
  finally{requestLock.current=false;setBusy(false);}
 };
 const end=()=>{setSession(null);setAnswer('');setError('');void load().catch(()=>{});};
 const onDown=(e:PointerEvent<HTMLElement>)=>{if(e.pointerType==='mouse'&&e.button!==0)return;startX.current=e.clientX;};
 const onUp=(e:PointerEvent<HTMLElement>)=>{
  if(startX.current===null||!session||session.state.mode==='test'||!session.state.revealed)return;
  const delta=e.clientX-startX.current;startX.current=null;
  if(Math.abs(delta)>75)void act({action:'grade',known:delta>0});
 };
 const onTestSubmit=(e:FormEvent)=>{e.preventDefault();if(!answer.trim()||busy)return;void act({action:'answer',answer});};
 const unit=units.find(row=>row.id===session?.unitId);
 const state=session?.state;
 const word=state&&!state.completed?state.words.find(item=>item.id===state.queue[state.cursor]):null;
 return <main className='container vocab-page'>
  <section className='vocab-shell' data-accent='blue'>
   <div className='vocab-header'><Link className='back-link' href='/kiur'>← Tagasi</Link><span className='vocab-emoji'>🔤</span><h1>Inglise keel</h1><p>Õpi sõnu ja kontrolli, kuidas need meelde jäid.</p></div>
   {error&&<p role='alert' className='vocab-error'>{error}</p>}
   {!session&&<>
    <h2>Õppetükid</h2>
    {loading&&<p>Laadin õppetükke…</p>}
    {!loading&&units.length===0&&<div className='vocab-panel'><strong>Õppetükke veel ei ole.</strong><p>Kui sõnad on lisatud, saad siin alustada õppimist.</p></div>}
    <div className='vocab-units'>
     {units.map(row=><section className='vocab-unit' key={row.id}>
      <div className='vocab-unit-top'><div><small>UNIT {row.unitNumber}</small><h3>{row.title}</h3><p>{row.wordCount} sõna</p></div><span className='vocab-status'>{!row.available?'🔒 Lukus':row.testPassedAt?'✓ Läbitud':row.studyCompletedAt?'✏️ Test saadaval':'📖 Õppimine'}</span></div>
      {row.available&&row.wordCount>0&&<div className='vocab-buttons'>
       <button type='button' disabled={busy} onClick={()=>begin(row.id,'study')}>📖 {row.studyCompletedAt?'Õpi uuesti':'Alusta õppimist'}</button>
       <button type='button' className='vocab-secondary' disabled={busy||!row.studyCompletedAt} onClick={()=>begin(row.id,'test')}>✏️ Test {row.studyCompletedAt?'':'🔒'}</button>
       {row.weakCount>0&&<button type='button' className='vocab-secondary' disabled={busy} onClick={()=>begin(row.id,'weak')}>↻ Korda eksitud sõnu ({row.weakCount})</button>}
      </div>}
      {row.lastTestTotal!=null&&<p className='vocab-stat'>Viimane test: {row.lastTestScore}/{row.lastTestTotal} · esimesel korral {row.firstTestScore}/{row.firstTestTotal}</p>}
     </section>)}
    </div>
    <Link href='/kiur/inglise-keel/sprint' className='vocab-sprint-link'>Sprint →</Link>
   </>}
   {session&&state&&<>
    <div className='vocab-session-header'><button type='button' className='vocab-secondary' onClick={end}>← Õppetükid</button><div><strong>{unit?.title??session.unitId}</strong><span>{state.mode==='test'?`Test · ${state.round}. ring · ${state.phase==='correction'?'Eksitud sõnad':'Kõik sõnad'}`:state.mode==='weak'?'Eksitud sõnad':'Õppimine'}</span></div></div>
    {!state.completed&&<><div className='vocab-counter'><span>{state.cursor+1} / {state.queue.length}</span><span>{state.mode==='test'?`${state.roundCorrect} õigesti selles ringis`:`${state.mastered.length} / ${state.words.length} teatud`}</span></div><div className='vocab-progress-track'><span style={{width:`${state.queue.length?100*state.cursor/state.queue.length:0}%`}}/></div></>}
    {word&&state.mode!=='test'&&<div className='vocab-deck'>
      <div className={'vocab-flashcard'+(state.revealed?' is-revealed':'')} onPointerDown={onDown} onPointerUp={onUp}>
       <button type='button' className='vocab-card-face' disabled={busy||state.revealed} onClick={()=>void act({action:'reveal'})} aria-label='Näita ingliskeelset sõna'>
        <span className='vocab-card-label'>EESTI KEELES</span><strong>{word.estonian}</strong>
        {state.revealed?<><span className='vocab-card-label'>INGLISE KEELES</span><strong className='vocab-english'>{word.english}</strong>{word.pronunciation&&<span className='vocab-pronunciation'>{word.pronunciation}</span>}</>:<small>Puuduta kaarti, et vastust näha</small>}
       </button>
      </div>
      {state.revealed?<div className='vocab-grade-actions'><button type='button' className='vocab-no' disabled={busy} onClick={()=>void act({action:'grade',known:false})}>← Ei teadnud</button><button type='button' className='vocab-yes' disabled={busy} onClick={()=>void act({action:'grade',known:true})}>Teadsin →</button></div>:<p className='vocab-hint'>Mõtle ingliskeelne sõna ja ava kaart.</p>}
     </div>}
    {word&&state.mode==='test'&&<div className='vocab-test-panel'>
     <span className='vocab-card-label'>KIRJUTA INGLISE KEELES</span><strong className='vocab-test-prompt'>{word.estonian}</strong>
     {!state.feedback?<form onSubmit={onTestSubmit}><label htmlFor='vocab-answer' className='sr-only'>Ingliskeelne sõna</label><input id='vocab-answer' autoComplete='off' autoCapitalize='off' spellCheck={false} value={answer} onChange={e=>setAnswer(e.target.value)} placeholder='Kirjuta siia' maxLength={120} disabled={busy}/><button type='submit' disabled={busy||!answer.trim()}>Kontrolli</button></form>
     :<div className={'vocab-answer-result '+(state.feedback.correct?'correct':'incorrect')} role='status'><strong>{state.feedback.correct?'✓ Õige':'Vastus vajab kordamist'}</strong><p>Sinu vastus: {state.feedback.answer||'—'}</p><p>Õige vastus: {state.feedback.expected}</p><button type='button' disabled={busy} onClick={()=>void act({action:'next'})}>Edasi →</button></div>}
    </div>}
    {state.completed&&<div className='vocab-panel vocab-done'><span className='vocab-done-icon'>✓</span><h2>{state.mode==='test'?'Test läbitud':state.mode==='weak'?'Kordamine lõpetatud':'Õppimine lõpetatud'}</h2>
      {state.mode==='test'?<><p>Viimane täisring: {state.lastTestScore}/{state.words.length} ({Math.round((state.lastTestScore??0)/state.words.length*100)}%)</p><p>Esimene täisring: {state.firstTestScore}/{state.words.length}</p><p>Ringe: {state.round}</p></>:<><p>Esimesel korral teadsid: {state.firstKnown}/{state.words.length}</p><p>Kõik sõnad on lõpuks õigesti vastatud.</p></>}
      <button type='button' onClick={end}>Õppetükkide juurde →</button></div>}
   </>}
  </section>
 </main>;
}
