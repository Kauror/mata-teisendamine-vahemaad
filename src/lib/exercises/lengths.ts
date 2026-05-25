import { Category, Difficulty, GeneratedQuestion } from '@/lib/types';

type RNG = () => number;
type InternalType =
  | 'suitable-unit-choice'
  | 'cm-mm-conversion'
  | 'km-m-conversion'
  | 'length-comparison'
  | 'length-ordering'
  | 'length-addition'
  | 'length-subtraction'
  | 'missing-measurement'
  | 'perimeter-with-units'
  | 'route-distance'
  | 'ruler-or-segment'
  | 'realistic-length-choice';

const INTERNAL_TYPES: InternalType[] = [
  'suitable-unit-choice','cm-mm-conversion','km-m-conversion','length-comparison','length-ordering','length-addition','length-subtraction','missing-measurement','perimeter-with-units','route-distance','ruler-or-segment','realistic-length-choice'
];

function seededRng(seed: number): RNG { let t = seed >>> 0; return () => { t += 0x6D2B79F5; let x = Math.imul(t ^ (t >>> 15), 1 | t); x ^= x + Math.imul(x ^ (x >>> 7), 61 | x); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; }
const rInt = (rng: RNG, min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
const pick = <T,>(rng: RNG, arr: readonly T[]) => arr[rInt(rng, 0, arr.length - 1)];
const shuffle = <T,>(rng: RNG, arr: T[]) => { const out=[...arr]; for(let i=out.length-1;i>0;i--){const j=rInt(rng,0,i); [out[i],out[j]]=[out[j],out[i]];} return out; };

const kmMToM = (km:number,m:number)=>km*1000+m;
const cmMmToMm = (cm:number,mm:number)=>cm*10+mm;

function byType(type: InternalType, d: Difficulty, rng: RNG, i: number): GeneratedQuestion {
  if (type === 'suitable-unit-choice') {
    const items = [
      ['Millise ühikuga mõõdaksid pliiatsi pikkust?', 'cm'],
      ['Millise ühikuga mõõdaksid linna vahemaad?', 'km'],
      ['Vali sobiv ühik: koolimaja kõrgus.', 'm'],
      ['Millise ühikuga mõõdaksid paberilehe paksust?', 'mm'],
      ['Millise ühikuga mõõdaksid vihiku laiust?', 'dm']
    ] as const;
    const it = pick(rng, items);
    const opts = shuffle(rng, ['km','m','dm','cm','mm']);
    return { id:`mu-${i}`, category:'Teisendamine', difficulty:d, kind:'choice', question:it[0], choiceOptions:opts, correctAnswer:opts.indexOf(it[1]), explanation:`Selle mõõtmiseks sobib kõige paremini ${it[1]}.`, subtopic:'pikkusuhikud' };
  }
  if (type === 'cm-mm-conversion') {
    const mode = rInt(rng,0,2);
    if(mode===0){const cm=rInt(rng,2,12); return {id:`cmm-${i}`,category:'Teisendamine',difficulty:d,question:`${cm} cm = mitu mm?`,expectedUnit:'mm',correctAnswer:cm*10,explanation:`1 cm = 10 mm, seega ${cm} cm = ${cm*10} mm.`,subtopic:'pikkusuhikud'};}
    if(mode===1){const mm=rInt(rng,11,98); return {id:`cmm-${i}`,category:'Teisendamine',difficulty:d,question:`${mm} mm = mitu cm ja mm? Sisesta ainult cm arv.`,expectedUnit:'cm',correctAnswer:Math.floor(mm/10),explanation:`${mm} mm = ${Math.floor(mm/10)} cm ${mm%10} mm.`,subtopic:'pikkusuhikud'};}
    const cm=rInt(rng,2,9), mm=rInt(rng,1,9); return {id:`cmm-${i}`,category:'Teisendamine',difficulty:d,question:`${cm} cm ${mm} mm = mitu mm?`,expectedUnit:'mm',correctAnswer:cmMmToMm(cm,mm),explanation:`${cm} cm ${mm} mm = ${cmMmToMm(cm,mm)} mm.`,subtopic:'pikkusuhikud'};
  }
  if (type === 'km-m-conversion') {
    const mode = rInt(rng,0,2);
    if(mode===0){const km=rInt(rng,2,9); return {id:`kmm-${i}`,category:'Teisendamine',difficulty:d,question:`${km} km = mitu m?`,expectedUnit:'m',correctAnswer:km*1000,explanation:`1 km = 1000 m, seega ${km} km = ${km*1000} m.`,subtopic:'pikkusuhikud'};}
    if(mode===1){const m=rInt(rng,1100,9800); return {id:`kmm-${i}`,category:'Teisendamine',difficulty:d,question:`${m} m = mitu km ja m? Sisesta ainult km arv.`,expectedUnit:'km',correctAnswer:Math.floor(m/1000),explanation:`${m} m = ${Math.floor(m/1000)} km ${m%1000} m.`,subtopic:'pikkusuhikud'};}
    const km=rInt(rng,1,8),m=pick(rng,[20,60,120,300,500,700]); return {id:`kmm-${i}`,category:'Teisendamine',difficulty:d,question:`${km} km ${m} m = mitu m?`,expectedUnit:'m',correctAnswer:kmMToM(km,m),explanation:`${km} km ${m} m = ${kmMToM(km,m)} m.`,subtopic:'pikkusuhikud'};
  }
  if (type === 'length-comparison') {
    const mode=rInt(rng,0,1);
    if(mode===0){const aCm=rInt(rng,3,9),aMm=rInt(rng,0,9),b=cmMmToMm(aCm,aMm)+(pick(rng,[-2,0,3]));const a=cmMmToMm(aCm,aMm); const q=`Võrdle pikkusi: ${aCm} cm ${aMm} mm ja ${b} mm. Vali: vasak, parem või võrdsed.`; const opts=['vasak','parem','võrdsed']; const idx=a>b?0:a<b?1:2; return {id:`cmp-${i}`,category:'Võrdlemine',difficulty:d,kind:'choice',question:q,choiceOptions:opts,correctAnswer:idx,explanation:`${aCm} cm ${aMm} mm = ${a} mm.`,subtopic:'pikkusuhikud'};}
    const aKm=rInt(rng,1,4),aM=pick(rng,[20,200,500,800]); const left=kmMToM(aKm,aM); const right=left+pick(rng,[-50,0,120]); const opts=['vasak','parem','võrdsed']; const idx=left>right?0:left<right?1:2; return {id:`cmp-${i}`,category:'Võrdlemine',difficulty:d,kind:'choice',question:`Kumb on pikem: ${aKm} km ${aM} m või ${right} m?`,choiceOptions:opts,correctAnswer:idx,explanation:`${aKm} km ${aM} m = ${left} m.`,subtopic:'pikkusuhikud'};
  }
  if (type === 'length-ordering') {
    const dir = rInt(rng,0,1)===0?'asc':'desc';
    const cards = [
      { id:`o-${i}-1`, label:'73 mm', valueMm:73 },
      { id:`o-${i}-2`, label:'7 cm', valueMm:70 },
      { id:`o-${i}-3`, label:'7 cm 5 mm', valueMm:75 }
    ];
    return {id:`ord-${i}`,category:'Järjestamine',difficulty:d,kind:'ordering',question:dir==='asc'?'Järjesta pikkused lühimast pikimani.':'Järjesta pikkused pikimast lühimani.',orderingCards:shuffle(rng,cards),orderingDirection:dir,expectedUnit:'mm',correctAnswer:0,explanation:'Võrdlemiseks teisenda kõik millimeetriteks.',subtopic:'pikkusuhikud'};
  }
  if (type === 'length-addition') {
    if (rInt(rng,0,1)===0){const aCm=rInt(rng,2,8),aMm=rInt(rng,1,8),bCm=rInt(rng,1,6),bMm=rInt(rng,1,8); const total=cmMmToMm(aCm,aMm)+cmMmToMm(bCm,bMm); return {id:`add-${i}`,category:'Arvutamine',difficulty:d,question:`Arvuta pikkustega: ${aCm} cm ${aMm} mm + ${bCm} cm ${bMm} mm = mitu mm?`,expectedUnit:'mm',correctAnswer:total,explanation:`Liidame millimeetrites: ${total} mm.`,subtopic:'pikkusuhikud'};}
    const aKm=rInt(rng,1,5),aM=pick(rng,[100,200,300,400,500]),bKm=rInt(rng,1,3),bM=pick(rng,[100,200,300,400,500]); const total=kmMToM(aKm,aM)+kmMToM(bKm,bM); return {id:`add-${i}`,category:'Arvutamine',difficulty:d,question:`Arvuta pikkustega: ${aKm} km ${aM} m + ${bKm} km ${bM} m = mitu m?`,expectedUnit:'m',correctAnswer:total,explanation:`Liidame meetrites: ${total} m.`,subtopic:'pikkusuhikud'};
  }
  if (type === 'length-subtraction') {
    const a=rInt(rng,60,95),b=rInt(rng,20,59); return {id:`sub-${i}`,category:'Arvutamine',difficulty:d,question:`Arvuta pikkustega: ${a} cm - ${b} cm = ?`,expectedUnit:'cm',correctAnswer:a-b,explanation:`Lahutame sentimeetrid: ${a}-${b}=${a-b}.`,subtopic:'pikkusuhikud'};
  }
  if (type === 'missing-measurement') {
    const mode=rInt(rng,0,2);
    if(mode===0){const full=rInt(rng,31,89); const cm=Math.floor(full/10); return {id:`mis-${i}`,category:'Puuduv arv',difficulty:d,question:`${cm} cm __ mm = ${full} mm. Leia puuduv mm arv.`,expectedUnit:'mm',correctAnswer:full%10,explanation:`${full} mm = ${cm} cm ${full%10} mm.`,subtopic:'pikkusuhikud'};}
    if(mode===1){const total=pick(rng,[2300,5300,6400,7800]); return {id:`mis-${i}`,category:'Puuduv arv',difficulty:d,question:`__ km 300 m = ${total} m. Leia puuduv km arv.`,expectedUnit:'km',correctAnswer:(total-300)/1000,explanation:`${total} m = ${(total-300)/1000} km 300 m.`,subtopic:'pikkusuhikud'};}
    return {id:`mis-${i}`,category:'Puuduv arv',difficulty:d,question:'2 km + __ m = 2500 m. Leia puuduv meeter.',expectedUnit:'m',correctAnswer:500,explanation:'2500 m = 2 km 500 m.',subtopic:'pikkusuhikud'};
  }
  if (type === 'perimeter-with-units') {
    const mode=rInt(rng,0,2);
    if(mode===0){const s=rInt(rng,3,8); return {id:`per-${i}`,category:'Ümbermõõt',difficulty:d,question:`Ruudu külg on ${s} cm. Leia ümbermõõt.`,expectedUnit:'cm',correctAnswer:s*4,explanation:`Ruudu ümbermõõt on 4 × ${s} cm = ${s*4} cm.`,subtopic:'pikkusuhikud'};}
    if(mode===1){const a=rInt(rng,4,9),b=rInt(rng,3,7); return {id:`per-${i}`,category:'Ümbermõõt',difficulty:d,question:`Ristküliku küljed on ${a} cm ja ${b} cm. Leia ümbermõõt.`,expectedUnit:'cm',correctAnswer:2*(a+b),explanation:`2 × (${a}+${b}) = ${2*(a+b)} cm.`,subtopic:'pikkusuhikud'};}
    const a=rInt(rng,3,7),b=rInt(rng,4,8),c=rInt(rng,5,9); return {id:`per-${i}`,category:'Ümbermõõt',difficulty:d,question:`Kolmnurga küljed on ${a} cm, ${b} cm ja ${c} cm. Leia ümbermõõt.`,expectedUnit:'cm',correctAnswer:a+b+c,explanation:`${a}+${b}+${c} = ${a+b+c} cm.`,subtopic:'pikkusuhikud'};
  }
  if (type === 'route-distance') {
    const mode=rInt(rng,0,2);
    if(mode===0){return {id:`rt-${i}`,category:'Tekstülesanded',difficulty:d,question:'Tallinnast Paidesse on 93 km. Kui pikk on edasi-tagasi sõit?',expectedUnit:'km',correctAnswer:186,explanation:'Edasi-tagasi tähendab 2 × 93 km = 186 km.',subtopic:'pikkusuhikud'};}
    if(mode===1){return {id:`rt-${i}`,category:'Tekstülesanded',difficulty:d,question:'Tartu–Põltsamaa on 56 km ja Põltsamaa–Paide on 48 km. Kui pikk on tee kokku?',expectedUnit:'km',correctAnswer:104,explanation:'56 km + 48 km = 104 km.',subtopic:'pikkusuhikud'};}
    return {id:`rt-${i}`,category:'Tekstülesanded',difficulty:d,question:'Üks tee on 129 km ja teine 93 km. Kui palju on esimene tee pikem?',expectedUnit:'km',correctAnswer:36,explanation:'129 km - 93 km = 36 km.',subtopic:'pikkusuhikud'};
  }
  if (type === 'ruler-or-segment') {
    const a=45,b=60; return {id:`seg-${i}`,category:'Võrdlemine',difficulty:d,question:`Lõik A on ${a} mm. Lõik B on 6 cm. Kui palju on B pikem?`,expectedUnit:'mm',correctAnswer:b-a,explanation:'6 cm = 60 mm, seega vahe on 15 mm.',subtopic:'pikkusuhikud'};
  }
  const opts = ['5 mm','5 cm','5 m','5 km'];
  return {id:`real-${i}`,category:'Tekstülesanded',difficulty:d,kind:'choice',question:'Vali realistlik pikkus pliiatsi jaoks.',choiceOptions:opts,correctAnswer:1,explanation:'Pliiatsi pikkus on tavaliselt sentimeetrites.',subtopic:'pikkusuhikud'};
}

function mixedPlan(rng: RNG, count: number): InternalType[] {
  if (count <= INTERNAL_TYPES.length) return shuffle(rng, [...INTERNAL_TYPES]).slice(0, count);
  const out = shuffle(rng, [...INTERNAL_TYPES]);
  while (out.length < count) {
    const t = pick(rng, INTERNAL_TYPES);
    if (out[out.length - 1] !== t) out.push(t);
  }
  return out;
}

export function generateSession(_mode: Category, difficulty: Difficulty, count: number, seed: number): GeneratedQuestion[] {
  const rng = seededRng(seed);
  const types = mixedPlan(rng, count);
  const out: GeneratedQuestion[] = [];
  const used = new Set<string>();
  for (let i = 0; i < count; i++) {
    let tries = 0;
    let q: GeneratedQuestion;
    do {
      q = byType(types[i], difficulty, rng, i + tries * 31);
      tries++;
    } while (used.has(`${q.question}|${q.correctAnswer}`) && tries < 20);
    used.add(`${q.question}|${q.correctAnswer}`);
    out.push({ ...q, id: `${q.id}-${i}` });
  }
  return out;
}

export const generateLengthExercises = generateSession;
