import { CATEGORIES, Category, Difficulty, GeneratedQuestion } from '@/lib/types';
import { LengthUnit, convert, mixedToMm } from '@/lib/units';

type RNG = () => number;
const NON_MIX = CATEGORIES.filter((c) => c !== 'Segaharjutus') as Exclude<Category, 'Segaharjutus'>[];

function seededRng(seed: number): RNG {
  let t = seed >>> 0;
  return () => { t += 0x6D2B79F5; let x = Math.imul(t ^ (t >>> 15), 1 | t); x ^= x + Math.imul(x ^ (x >>> 7), 61 | x); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
}
const rInt = (rng: RNG, min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
const shuffle = <T,>(rng: RNG, arr: T[]) => { const out = [...arr]; for (let i = out.length - 1; i > 0; i--) { const j = rInt(rng, 0, i); [out[i], out[j]] = [out[j], out[i]]; } return out; };
const pick = <T,>(rng: RNG, arr: T[]) => arr[rInt(rng, 0, arr.length - 1)];

function conversion(d: Difficulty, rng: RNG, i: number): GeneratedQuestion {
  const easy = [[1, 'm', 'cm'], [2, 'm', 'cm'], [1, 'cm', 'mm'], [5, 'cm', 'mm'], [1, 'dm', 'cm'], [4, 'dm', 'cm'], [20, 'mm', 'cm'], [30, 'cm', 'dm'], [100, 'cm', 'm'], [2, 'km', 'm']] as const;
  const med = [[rInt(rng,1,9), 'm', 'dm'], [rInt(rng,2,9), 'dm', 'cm'], [rInt(rng,2,12), 'cm', 'mm'], [rInt(rng,2,6), 'm', 'cm']] as const;
  const hard = [[Number((rInt(rng,11,39)/10).toFixed(1)), 'km', 'm'], [rInt(rng,200,4000), 'm', 'km'], [rInt(rng,10,300), 'dm', 'm']] as const;
  const t = d === 'Lihtne' ? easy[i % easy.length] : d === 'Keskmine' ? med[i % med.length] : hard[i % hard.length];
  const [value, from, to] = t as [number, LengthUnit, LengthUnit];
  return { id: `t-${i}`, category: 'Teisendamine', difficulty: d, question: `${String(value).replace('.', ',')} ${from} = ___ ${to}`, expectedUnit: to, correctAnswer: convert(value, from, to) };
}

function compare(d: Difficulty, rng: RNG, i:number): GeneratedQuestion { const pairs = d==='Lihtne'
? [[[8,'cm'],[80,'mm'],'mm'],[[4,'dm'],[40,'cm'],'cm'],[[2,'m'],[200,'cm'],'cm']]
: d==='Keskmine' ? [[[rInt(rng,2,9),'dm'],[rInt(rng,20,95),'cm'],'cm'],[[rInt(rng,1,3),'m'],[rInt(rng,80,250),'cm'],'cm'],[[rInt(rng,5,12),'cm'],[rInt(rng,40,140),'mm'],'mm']]
: [[[rInt(rng,1,4),'km'],[rInt(rng,400,1800),'m'],'m'],[[rInt(rng,3,12),'m'],[rInt(rng,160,980),'cm'],'cm'],[[rInt(rng,30,200),'cm'],[rInt(rng,200,2000),'mm'],'mm']];
const p=pairs[i%pairs.length] as [[number,LengthUnit],[number,LengthUnit],LengthUnit]; const diff=Math.abs(convert(p[0][0],p[0][1],p[2])-convert(p[1][0],p[1][1],p[2]));
return {id:`c-${i}`,category:'Võrdlemine',difficulty:d,question:`Kui suur on vahe: ${p[0][0]} ${p[0][1]} ja ${p[1][0]} ${p[1][1]}?`,expectedUnit:p[2],correctAnswer:diff}; }

function ordering(d:Difficulty,rng:RNG,i:number):GeneratedQuestion{const n=d==='Lihtne'?3:d==='Keskmine'?4:5; const dir=(rInt(rng,0,1)===0?'asc':'desc') as 'asc'|'desc';
const units:LengthUnit[] = d==='Raske'?['mm','cm','dm','m','km']:['mm','cm','dm','m']; const cards=[] as {id:string;label:string;valueMm:number}[]; const used=new Set<number>();
while(cards.length<n){const u=pick(rng,units); const v=u==='km'?rInt(rng,1,3):u==='m'?rInt(rng,1,12):rInt(rng,2,90); const mm=mixedToMm([{value:v,unit:u}]); if(used.has(mm)) continue; used.add(mm); cards.push({id:`o-${i}-${cards.length}`,label:`${v} ${u}`,valueMm:mm});}
return {id:`o-${i}`,category:'Järjestamine',difficulty:d,question:dir==='asc'?'Järjesta pikkused alates kõige väiksemast.':'Järjesta pikkused alates kõige suuremast.',expectedUnit:'cm',correctAnswer:0,kind:'ordering',orderingCards:shuffle(rng,cards),orderingDirection:dir};}

function arithmetic(d:Difficulty,rng:RNG,i:number):GeneratedQuestion{const add=i%2===0; if(d==='Lihtne'){const u=pick(rng,['cm','dm','m'] as LengthUnit[]); const a=rInt(rng,1,10),b=rInt(rng,1,10); return {id:`a-${i}`,category:'Arvutamine',difficulty:d,question:`Leia ${add?'summa':'vahe'}: ${a} ${u} ${add?'+':'-'} ${Math.min(b,a)} ${u}.`,expectedUnit:u,correctAnswer:add?a+b:a-Math.min(b,a)};} const am=rInt(rng,1,9),ac=rInt(rng,10,90),bm=rInt(rng,1,6),bc=rInt(rng,10,90); const x=am*100+ac,y=bm*100+bc; const hi=Math.max(x,y),lo=Math.min(x,y); const hiM=Math.floor(hi/100), hiC=hi%100, loM=Math.floor(lo/100), loC=lo%100; return {id:`a-${i}`,category:'Arvutamine',difficulty:d,question:add?`Leia summa: ${am} m ${ac} cm + ${bm} m ${bc} cm. Vastus cm-des.`:`Leia vahe: ${hiM} m ${hiC} cm ja ${loM} m ${loC} cm. Vastus cm-des.`,expectedUnit:'cm',correctAnswer:add?x+y:hi-lo};}

function missing(d:Difficulty,rng:RNG,i:number):GeneratedQuestion{const easy=[['50 cm + ___ cm = 100 cm',50,'cm'],['5 cm + ___ cm = 10 cm',5,'cm'],['1 m = ___ cm',100,'cm'],['___ mm = 8 cm',80,'mm']] as const; const med=[['700 m + ___ m = 1 km',300,'m'],['2 m 4 dm = ___ cm',240,'cm'],['___ m = 300 cm',3,'m'],['3 dm 5 cm = ___ cm',35,'cm']] as const; const arr=d==='Lihtne'?easy:d==='Keskmine'?med:[...med,['1,5 km = ___ m',1500,'m'] as const]; const it=arr[i%arr.length]; return {id:`p-${i}`,category:'Puuduv arv',difficulty:d,question:it[0],expectedUnit:it[2] as LengthUnit,correctAnswer:it[1]};}

function perimeter(d:Difficulty,rng:RNG,i:number):GeneratedQuestion{if(d==='Lihtne'){const s=pick(rng,[2,3,4,5]); return{id:`u-${i}`,category:'Ümbermõõt',difficulty:d,question:`Ruudu külg on ${s} m. Leia ümbermõõt meetrites.`,expectedUnit:'m',correctAnswer:s*4};} if(d==='Raske'&&i%3===0){return{id:`u-${i}`,category:'Ümbermõõt',difficulty:d,question:'Jalgpalliväljaku pikkus on 105 m ja laius 68 m. Leia ümbermõõt meetrites.',expectedUnit:'m',correctAnswer:346};} const a=rInt(rng,2,d==='Keskmine'?12:35),b=rInt(rng,2,d==='Keskmine'?10:28),c=rInt(rng,2,d==='Keskmine'?10:28); if(i%2===0) return{id:`u-${i}`,category:'Ümbermõõt',difficulty:d,question:`Ristküliku küljed on ${a} m ja ${b} m. Leia ümbermõõt meetrites.`,expectedUnit:'m',correctAnswer:2*(a+b)}; return{id:`u-${i}`,category:'Ümbermõõt',difficulty:d,question:`Kolmnurga küljed on ${a} m, ${b} m ja ${c} m. Leia ümbermõõt meetrites.`,expectedUnit:'m',correctAnswer:a+b+c};}

function text(d:Difficulty,rng:RNG,i:number):GeneratedQuestion{const e=[['Jalgrattur sõidab 5 km. Siis sõidab veel 3 km. Kui palju ta kokku sõitis?',8,'km']] as const; const m=[['Buss sõidab 60 km/h ja sõidab 2 tundi. Kui pika maa ta läbib?',120,'km'],['Mari kõndis 1200 m ja siis veel 800 m. Kui palju kokku meetrites?',2000,'m']] as const; const h=[['Matkaja läks 2 km, siis veel 850 m ja tagasi 600 m. Mitu meetrit ta kokku edasi liikus?',2250,'m']] as const; const arr=d==='Lihtne'?e:d==='Keskmine'?m:h; const t=arr[i%arr.length]; return{id:`x-${i}`,category:'Tekstülesanded',difficulty:d,question:t[0],expectedUnit:t[2] as LengthUnit,correctAnswer:t[1]};}

const builders={Teisendamine:conversion,'Võrdlemine':compare,'Järjestamine':ordering,'Arvutamine':arithmetic,'Puuduv arv':missing,'Ümbermõõt':perimeter,'Tekstülesanded':text} as const;

function mixedPlan(rng:RNG,count:number){if(count<=NON_MIX.length) return shuffle(rng,[...NON_MIX]).slice(0,count); const base=shuffle(rng,[...NON_MIX]); while(base.length<count){const c=pick(rng,NON_MIX); if(base[base.length-1]!==c) base.push(c);} return base;}

export function generateSession(mode: Category, difficulty: Difficulty, count: number, seed: number): GeneratedQuestion[] {
  const rng = seededRng(seed); const types = mode==='Segaharjutus'?mixedPlan(rng,count):Array.from({length:count},()=>mode as Exclude<Category,'Segaharjutus'>);
  const out:GeneratedQuestion[]=[]; const used=new Set<string>();
  for(let i=0;i<count;i++){let tries=0; let q:GeneratedQuestion;
    do { q=builders[types[i]](difficulty,rng,i+tries*13); tries++; } while(used.has(`${q.category}|${q.question}|${q.correctAnswer}`)&&tries<20);
    used.add(`${q.category}|${q.question}|${q.correctAnswer}`); out.push({...q,id:`${q.id}-${i}`}); }
  return out;
}

export const generateLengthExercises = generateSession;
