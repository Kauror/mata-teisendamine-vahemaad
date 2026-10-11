'use client';
import {useEffect,useState,type FormEvent} from 'react';
import {csrfHeaders} from '@/lib/auth/client';
type Unit={id:string;unitNumber:number;title:string;wordCount:number;published:number;manuallyUnlocked:number;available:boolean;studyCompletedAt:string|null;testPassedAt:string|null;firstTestScore:number|null;firstTestTotal:number|null;lastTestScore:number|null;lastTestTotal:number|null;weakCount:number;testRuns:number};
export default function ParentEnglishUnits(){
 const [units,setUnits]=useState<Unit[]>([]);
 const [number,setNumber]=useState(1);
 const [title,setTitle]=useState('Unit 1');
 const [draft,setDraft]=useState('');
 const [selected,setSelected]=useState('');
 const [notice,setNotice]=useState('');
 const [busy,setBusy]=useState(false);
 const [details,setDetails]=useState<Array<{estonian:string;english:string;studyWrong:number|null;testWrong:number|null;needsPractice:number|null}>>([]);
 const load=()=>fetch('/api/parent/english-units').then(r=>r.json()).then(r=>setUnits(r.units??[]));
 useEffect(()=>{void load();},[]);
 const save=async(data:Record<string,unknown>)=>{
  setBusy(true);setNotice('');
  try{
   const res=await fetch('/api/parent/english-units',{method:'POST',headers:csrfHeaders({'Content-Type':'application/json'},'parent_csrf'),body:JSON.stringify(data)});
   const payload=await res.json();if(!res.ok)throw Error(payload.message??'Salvestamine ebaõnnestus.');
   setUnits(payload.units);setNotice('Salvestatud.');
  }catch(err){setNotice(err instanceof Error?err.message:'Viga.');}finally{setBusy(false);}
 };
 const create=(e:FormEvent)=>{e.preventDefault();void save({action:'save',unitNumber:number,title,published:false,manuallyUnlocked:false});};
 const importWords=(e:FormEvent)=>{e.preventDefault();if(!selected)return;
  try{
   // TSV/CSV text pasted from a spreadsheet, header optional.
   const lines=draft.replace(/^\uFEFF/,'').trim().split(/\r?\n/).map(line=>line.split('\t'));
   if(!lines.length||lines.some(row=>row.length<2))throw Error('Kopeeri Excelist vähemalt kaks veergu: eesti ja inglise sõna.');
   const rows=lines[0][0].toLowerCase().includes('eesti')?lines.slice(1):lines;
   const words=rows.map(row=>({estonian:row[0].trim(),english:row[1].trim(),pronunciation:(row[2]??'').trim(),acceptedAnswers:(row[3]??'').split('|').map(v=>v.trim()).filter(Boolean)}));
   void save({action:'words',unitId:selected,words});
  }catch(err){setNotice(err instanceof Error?err.message:'Viga.');}
 };
 const inspect=async(id:string)=>{setSelected(id);const r=await fetch('/api/parent/english-units/'+encodeURIComponent(id));if(r.ok){const d=await r.json();setDetails(d.words??[]);}};
 return <div className='vocab-parent'>
  <p>Õppetükid avanevad automaatselt pärast eelmise õppetüki vähemalt 95% testi või vanema loal. Sõnad avalda alles siis, kui need on valmis.</p>
  {notice&&<p role='status'>{notice}</p>}
  <form onSubmit={create} className='parent-form'><h3>Lisa õppetükk</h3><label>Number<input type='number' min={1} max={999} value={number} onChange={e=>{setNumber(Number(e.target.value));setTitle('Unit '+e.target.value);}}/></label><label>Pealkiri<input value={title} maxLength={100} onChange={e=>setTitle(e.target.value)}/></label><button type='submit' disabled={busy}>Lisa / muuda</button></form>
  <div className='learning-compact-list'>{units.map(unit=><div key={unit.id} className='learning-compact-row'><div className='learning-compact-info'><strong>{unit.title} · {unit.wordCount} sõna</strong><span>{unit.testPassedAt?'✓ Test läbitud':unit.studyCompletedAt?'Õppimine tehtud':'Õppimine tegemata'} · {unit.testRuns} testi · {unit.weakCount} eksitud sõna</span><span>{unit.firstTestTotal? `Esimene test ${unit.firstTestScore}/${unit.firstTestTotal}`:''}</span></div><div className='learning-compact-actions'>
   <button type='button' className='filter-chip' onClick={()=>void inspect(unit.id)}>Sõnad / tulemused</button>
   <button type='button' className='filter-chip' disabled={busy} onClick={()=>void save({action:'save',unitNumber:unit.unitNumber,title:unit.title,published:!unit.published,manuallyUnlocked:Boolean(unit.manuallyUnlocked)})}>{unit.published?'Peida':'Avalda'}</button>
   <button type='button' className='filter-chip' disabled={busy} onClick={()=>void save({action:'save',unitNumber:unit.unitNumber,title:unit.title,published:Boolean(unit.published),manuallyUnlocked:!unit.manuallyUnlocked})}>{unit.manuallyUnlocked?'Eemalda käsitsi avamine':'Ava käsitsi'}</button>
  </div></div>)}</div>
  {selected&&<section className='parent-card'><h3>{units.find(u=>u.id===selected)?.title??selected}</h3>
   <form onSubmit={importWords} className='parent-form'><label>Kleebi Exceli lahtrid (tabidega eraldatud: Eesti, Inglise, hääldus, lubatud muud vastused)</label><textarea value={draft} onChange={e=>setDraft(e.target.value)} rows={7} placeholder={'kass\tcat\t/kæt/\nkoer\tdog\t/dɒɡ/'}/><button type='submit' disabled={busy||!draft.trim()}>Salvesta sõnad</button></form>
   <p>Sõnade muutmine on pärast harjutamise alustamist lukustatud, et vanad tulemused säiliksid.</p>
   {details.map((word,i)=><div className='vocab-parent-word' key={i}><strong>{word.estonian} → {word.english}</strong><span>Õppimisel eksimusi {word.studyWrong??0} · testis {word.testWrong??0} {word.needsPractice?'· kordamisel':''}</span></div>)}
  </section>}
 </div>;
}
