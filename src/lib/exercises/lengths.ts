import { Category, Difficulty, GeneratedQuestion } from '@/lib/types';
import { RNG, pickRandom, randomInt, seededRng, shuffleWithRng } from '@/lib/random';

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

const rInt = randomInt;
const pick = pickRandom;
const shuffle = shuffleWithRng;

const kmMToM = (km:number,m:number)=>km*1000+m;
const cmMmToMm = (cm:number,mm:number)=>cm*10+mm;

function formatShortLengthMm(mm: number, variant: number) {
  if (variant % 3 === 0) return `${mm} mm`;
  const cm = Math.floor(mm / 10);
  const rest = mm % 10;
  if (variant % 3 === 1) return rest === 0 ? `${cm} cm` : `${cm} cm ${rest} mm`;
  return `${(mm / 10).toLocaleString('et-EE', { maximumFractionDigits: 1 })} cm`;
}

function orderingCards(rng: RNG, i: number) {
  const base = rInt(rng, 45, 145);
  const offsets = shuffle(rng, [-18, -13, -9, -6, 5, 8, 12, 17]).slice(0, 2);
  const values = shuffle(rng, [base, base + offsets[0], base + offsets[1]]).map((value) => Math.max(12, value));
  return values.map((valueMm, index) => ({
    id: `o-${i}-${index + 1}`,
    label: formatShortLengthMm(valueMm, i + index),
    valueMm
  }));
}

function byType(type: InternalType, d: Difficulty, rng: RNG, i: number): GeneratedQuestion {
  if (type === 'suitable-unit-choice') {
    const items = [
      { question: 'Millise ühikuga mõõdaksid pliiatsi pikkust?', units: ['cm'], explanation: 'Pliiatsi pikkust mõõdetakse tavaliselt sentimeetrites.' },
      { question: 'Millise ühikuga mõõdaksid linna vahemaad?', units: ['km'], explanation: 'Linnade vahemaad mõõdetakse tavaliselt kilomeetrites.' },
      { question: 'Vali sobiv ühik: koolimaja kõrgus.', units: ['m'], explanation: 'Koolimaja kõrgust mõõdetakse tavaliselt meetrites.' },
      { question: 'Millise ühikuga mõõdaksid paberilehe paksust?', units: ['mm'], explanation: 'Paberilehe paksust mõõdetakse tavaliselt millimeetrites.' },
      { question: 'Vali sobiv ühik vihiku laiuse mõõtmiseks.', units: ['mm', 'cm', 'dm'], explanation: 'Vihiku laiust saab mõõta millimeetrites, sentimeetrites või detsimeetrites. Meetrit ja kilomeetrit siin praktiliselt ei kasutata.' }
    ] as const;
    const it = pick(rng, items);
    const opts = shuffle(rng, ['km','m','dm','cm','mm']);
    const correctAnswers = it.units.map((unit) => opts.indexOf(unit)).filter((idx) => idx >= 0);
    return { id:`mu-${i}`, category:'Teisendamine', difficulty:d, kind:'choice', question:it.question, choiceOptions:opts, correctAnswer:correctAnswers[0], correctAnswers, explanation:it.explanation, subtopic:'pikkusuhikud' };
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
    if(mode===1){const m=rInt(rng,1100,9800); return {id:`kmm-${i}`,category:'Teisendamine',difficulty:d,question:`${m} m = mitu km?`,expectedUnit:'km',correctAnswer:Math.floor(m/1000),explanation:`${m} m = ${Math.floor(m/1000)} km ${m%1000} m.`,subtopic:'pikkusuhikud'};}
    const km=rInt(rng,1,8),m=pick(rng,[20,60,120,300,500,700]); return {id:`kmm-${i}`,category:'Teisendamine',difficulty:d,question:`${km} km ${m} m = mitu m?`,expectedUnit:'m',correctAnswer:kmMToM(km,m),explanation:`${km} km ${m} m = ${kmMToM(km,m)} m.`,subtopic:'pikkusuhikud'};
  }
  if (type === 'length-comparison') {
    const mode=rInt(rng,0,1);
    if(mode===0){const aCm=rInt(rng,3,9),aMm=rInt(rng,0,9),b=cmMmToMm(aCm,aMm)+(pick(rng,[-2,0,3]));const a=cmMmToMm(aCm,aMm); const q=`Kumb on pikem? A) ${aCm} cm ${aMm} mm  B) ${b} mm`; const opts=['A','B','võrdsed']; const idx=a>b?0:a<b?1:2; return {id:`cmp-${i}`,category:'Võrdlemine',difficulty:d,kind:'choice',question:q,choiceOptions:opts,correctAnswer:idx,explanation:`A = ${a} mm. B = ${b} mm.`,subtopic:'pikkusuhikud'};}
    const aKm=rInt(rng,1,4),aM=pick(rng,[20,200,450,500,800]); const left=kmMToM(aKm,aM); const right=left+pick(rng,[-80,-50,0,70,120]); const opts=['A','B','võrdsed']; const idx=left>right?0:left<right?1:2; return {id:`cmp-${i}`,category:'Võrdlemine',difficulty:d,kind:'choice',question:`Kumb on pikem? A) ${aKm} km ${aM} m  B) ${right} m`,choiceOptions:opts,correctAnswer:idx,explanation:`A = ${left} m. B = ${right} m.`,subtopic:'pikkusuhikud'};
  }
  if (type === 'length-ordering') {
    const dir = rInt(rng,0,1)===0?'asc':'desc';
    const cards = orderingCards(rng, i);
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
  const signature = (q: GeneratedQuestion) => `${q.question}|${q.correctAnswer}|${q.orderingCards?.map((card) => `${card.label}:${card.valueMm}`).join(',') ?? ''}`;
  for (let i = 0; i < count; i++) {
    let tries = 0;
    let q: GeneratedQuestion;
    do {
      q = byType(types[i], difficulty, rng, i + tries * 31);
      tries++;
    } while (used.has(signature(q)) && tries < 20);
    used.add(signature(q));
    out.push({ ...q, id: `${q.id}-${i}` });
  }
  return out;
}
