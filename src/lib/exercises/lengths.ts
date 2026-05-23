import { CATEGORIES, Category, Difficulty, GeneratedQuestion } from '@/lib/types';
import { LengthUnit, convert, mixedToMm, fromMm } from '@/lib/units';

type RNG = () => number;

function seededRng(seed: number): RNG {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

const rInt = (rng: RNG, min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
const pick = <T,>(rng: RNG, arr: T[]) => arr[rInt(rng, 0, arr.length - 1)];
const uid = (i: number) => `q-${i}`;

function buildTeisendamine(rng: RNG, difficulty: Difficulty, i: number): GeneratedQuestion {
  const pools: Record<Difficulty, Array<{from: LengthUnit; to: LengthUnit; mixed?: boolean; decimal?: boolean}>> = {
    Lihtne: [{from:'m',to:'cm'},{from:'cm',to:'mm'},{from:'dm',to:'cm'},{from:'m',to:'dm'},{from:'cm',to:'dm'}],
    Keskmine: [{from:'mm',to:'cm'},{from:'cm',to:'m'},{from:'dm',to:'mm'},{from:'m',to:'dm'},{from:'cm',to:'dm',mixed:true}],
    Raske: [{from:'km',to:'m',decimal:true},{from:'m',to:'km'},{from:'cm',to:'m'},{from:'km',to:'cm',mixed:true},{from:'m',to:'cm',mixed:true}]
  };
  const t = pools[difficulty][i % pools[difficulty].length];
  if (t.mixed) {
    const a = rInt(rng, 1, 5); const b = rInt(rng, 1, 9); const c = rInt(rng, 1, 9);
    const parts: Array<{value:number; unit:LengthUnit}> = difficulty === 'Raske' ? [{value:a,unit:'m'},{value:b,unit:'dm'},{value:c,unit:'cm'}] : [{value:a,unit:'dm'},{value:b,unit:'cm'}];
    const mm = mixedToMm(parts);
    return { id: uid(i), category:'Teisendamine', difficulty, question:`Mitu ${t.to} on ${parts.map((p)=>`${p.value} ${p.unit}`).join(' ')}?`, expectedUnit:t.to, correctAnswer: fromMm(mm, t.to)};
  }
  const value = t.decimal ? Number((rInt(rng, 10, 35) / 10).toFixed(1)) : rInt(rng, 2, 30);
  return { id: uid(i), category:'Teisendamine', difficulty, question:`Mitu ${t.to} on ${String(value).replace('.', ',')} ${t.from}?`, expectedUnit:t.to, correctAnswer: convert(value, t.from, t.to) };
}

function buildVordlemine(rng: RNG, difficulty: Difficulty, i:number): GeneratedQuestion {
  const cases = [
    {a:[rInt(rng,6,12),'cm'] as const,b:[rInt(rng,40,140),'mm'] as const,u:'mm' as const},
    {a:[rInt(rng,2,9),'dm'] as const,b:[rInt(rng,20,95),'cm'] as const,u:'cm' as const},
    {a:[rInt(rng,1,4),'m'] as const,b:[rInt(rng,80,350),'cm'] as const,u:'cm' as const},
    {a:[rInt(rng,1,3),'km'] as const,b:[rInt(rng,400,1800),'m'] as const,u:'m' as const}
  ];
  const c = cases[i % (difficulty==='Lihtne'?2:difficulty==='Keskmine'?3:4)];
  const diffMm = Math.abs(mixedToMm([{value:c.a[0],unit:c.a[1] as LengthUnit}]) - mixedToMm([{value:c.b[0],unit:c.b[1] as LengthUnit}]));
  return { id:uid(i), category:'Võrdlemine', difficulty, question:`Kui suur on vahe: ${c.a[0]} ${c.a[1]} ja ${c.b[0]} ${c.b[1]}?`, expectedUnit:c.u, correctAnswer: fromMm(diffMm, c.u) };
}

function buildJarjestamine(rng:RNG, difficulty:Difficulty, i:number):GeneratedQuestion {
  const target = ['lühem','pikem','keskmine'][i%3] as 'lühem'|'pikem'|'keskmine';
  const triplets = difficulty==='Raske' ? [[{v:2,u:'km'},{v:1500,u:'m'},{v:1800,u:'m'}],[{v:1,u:'m'},{v:95,u:'cm'},{v:12,u:'dm'}]] : [[{v:3,u:'dm'},{v:25,u:'cm'},{v:400,u:'mm'}],[{v:70,u:'cm'},{v:9,u:'dm'},{v:800,u:'mm'}]];
  const t = pick(rng, triplets as any[]);
  const vals = t.map((x:any)=>fromMm(mixedToMm([{value:x.v,unit:x.u}]), difficulty==='Raske'?'m':'cm')).sort((a:number,b:number)=>a-b);
  const ans = target==='lühem'?vals[0]:target==='pikem'?vals[2]:vals[1];
  const outUnit = difficulty==='Raske'?'m':'cm';
  return {id:uid(i),category:'Järjestamine',difficulty,question:`Antud on ${t.map((x:any)=>`${x.v} ${x.u}`).join(', ')}. Kirjuta kõige ${target} pikkus ${outUnit}-des.`,expectedUnit:outUnit,correctAnswer:ans};
}

function buildArvutamine(rng:RNG,difficulty:Difficulty,i:number):GeneratedQuestion { const sub=i%2===1;
  if (difficulty==='Raske'&&sub){const aMm=mixedToMm([{value:rInt(rng,5,9),unit:'m'},{value:rInt(rng,0,99),unit:'cm'}]);const bMm=mixedToMm([{value:rInt(rng,1,4),unit:'m'},{value:rInt(rng,0,99),unit:'cm'}]);const max=Math.max(aMm,bMm),min=Math.min(aMm,bMm);return{id:uid(i),category:'Arvutamine',difficulty,question:`Leia vahe: ${fromMm(max,'m')} m ja ${fromMm(min,'m')} m. Vastus sentimeetrites.`,expectedUnit:'cm',correctAnswer:fromMm(max-min,'cm')}}
  const a=rInt(rng,40,300), b=rInt(rng,10,180); return {id:uid(i),category:'Arvutamine',difficulty,question:`Leia ${sub?'vahe':'summa'}: ${a} cm ${sub?'-':'+'} ${b} cm.`,expectedUnit:'cm',correctAnswer:sub?a-b:a+b}; }

function buildPuuduv(rng:RNG,difficulty:Difficulty,i:number):GeneratedQuestion{ const variants=[
['1 m = ___ cm',100,'cm'],['3 dm 5 cm = ___ cm',35,'cm'],['___ cm = 2 m',200,'cm'],['___ mm = 8 cm',80,'mm'],['1 km = ___ m',1000,'m'],['2 m 4 dm = ___ cm',240,'cm'],['___ m = 300 cm',3,'m'],['1,5 km = ___ m',1500,'m']
] as const; const v=variants[i% (difficulty==='Lihtne'?4:difficulty==='Keskmine'?6:8)]; return {id:uid(i),category:'Puuduv arv',difficulty,question:v[0],expectedUnit:v[2] as LengthUnit,correctAnswer:v[1]}; }

function buildUmbermoot(rng:RNG,difficulty:Difficulty,i:number):GeneratedQuestion{ const t=i%3;
  if(t===0){const a=rInt(rng,3, difficulty==='Lihtne'?12:30);return{id:uid(i),category:'Ümbermõõt',difficulty,question:`Ruudu külg on ${a} cm. Leia ümbermõõt sentimeetrites.`,expectedUnit:'cm',correctAnswer:a*4};}
  if(t===1){const a=rInt(rng,4,20),b=rInt(rng,3,18);return{id:uid(i),category:'Ümbermõõt',difficulty,question:`Ristküliku pikkus on ${a} cm ja laius ${b} cm. Leia ümbermõõt sentimeetrites.`,expectedUnit:'cm',correctAnswer:2*(a+b)};}
  const a=rInt(rng,4,12),b=rInt(rng,4,12),c=rInt(rng,4,12); return{id:uid(i),category:'Ümbermõõt',difficulty,question:`Kolmnurga küljed on ${a} cm, ${b} cm ja ${c} cm. Leia ümbermõõt sentimeetrites.`,expectedUnit:'cm',correctAnswer:a+b+c}; }

function buildTekst(rng:RNG,difficulty:Difficulty,i:number):GeneratedQuestion{ const scenarios=[
['Mari pael oli 2 m pikk. Ta lõikas ära 45 cm. Mitu sentimeetrit jäi?',155,'cm'],
['Juku kõndis 1 km 200 m. Sõber kõndis 950 m. Mitu meetrit rohkem kõndis Juku?',250,'m'],
['Tunneli piirang on 3,8 m. Veoauto on 4 m. Mitu sentimeetrit on liiga kõrge?',20,'cm'],
['Laud on 1 m 20 cm ja teine laud 85 cm. Mitu sentimeetrit on kokku?',205,'cm']
] as const; const s=scenarios[(i+rInt(rng,0,9))%scenarios.length]; return {id:uid(i),category:'Tekstülesanded',difficulty,question:s[0],expectedUnit:s[2] as LengthUnit,correctAnswer:s[1]}; }

const map = {Teisendamine:buildTeisendamine,'Võrdlemine':buildVordlemine,'Järjestamine':buildJarjestamine,'Arvutamine':buildArvutamine,'Puuduv arv':buildPuuduv,'Ümbermõõt':buildUmbermoot,'Tekstülesanded':buildTekst} as const;

export function generateLengthExercises(category: Category, difficulty: Difficulty, count: number, seed: number): GeneratedQuestion[] {
  const rng = seededRng(seed);
  const result: GeneratedQuestion[] = [];
  const used = new Set<string>();
  const cats = CATEGORIES.filter((c) => c !== 'Segaharjutus') as Exclude<Category,'Segaharjutus'>[];
  const sequence = category === 'Segaharjutus'
    ? Array.from({ length: count }, (_, i) => cats[i % cats.length])
    : Array.from({ length: count }, () => category as Exclude<Category,'Segaharjutus'>);
  for (let i = 0; i < count; i++) {
    let q = map[sequence[i]](rng, difficulty, i);
    let guard = 0;
    while (used.has(q.question) && guard < 8) { q = map[sequence[i]](rng, difficulty, i + guard + 10); guard++; }
    used.add(q.question);
    result.push({ ...q, id: `${q.id}-${i}` });
  }
  return result;
}
