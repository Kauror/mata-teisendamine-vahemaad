import { Category, Difficulty, GeneratedQuestion } from '@/lib/types';
import { generateSession as generateLengthSession } from '@/lib/exercises/lengths';
import { isKiurLengthTopic } from '@/lib/kiurMathTopics';

type RNG = () => number;
const rInt = (rng: RNG, min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
const pick = <T,>(rng: RNG, arr: readonly T[]) => arr[rInt(rng, 0, arr.length - 1)];
function seededRng(seed: number): RNG { let t = seed >>> 0; return () => { t += 0x6D2B79F5; let x = Math.imul(t ^ (t >>> 15), 1 | t); x ^= x + Math.imul(x ^ (x >>> 7), 61 | x); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; }

const DIV_CATS = ['Jagamine', 'Kontroll korrutamisega', 'Tähe väärtus', 'Võrratused'] as const;
const NUM_CATS = ['Arvkiir', 'Loendamine', 'Eelnev ja järgnev arv', 'Järjestamine', 'Võrdlemine', 'Arvu koostis', 'Nuputa'] as const;
const CIRCLE_CATS = ['Mõisted', 'Raadius', 'Diameeter', 'Võrdlemine', 'Kraadid'] as const;
const PATTERN_CATS = ['Segaharjutus'] as const;

type TopicCategory = (typeof DIV_CATS)[number] | (typeof NUM_CATS)[number] | (typeof CIRCLE_CATS)[number] | (typeof PATTERN_CATS)[number] | 'Segaharjutus';

function mixedPlan(rng: RNG, count: number, types: readonly TopicCategory[]) {
  const out: TopicCategory[] = [];
  for (let i = 0; i < count; i++) out.push(types[i % types.length]);
  for (let i = out.length - 1; i > 0; i--) { const j = rInt(rng, 0, i); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
}

function divisionQ(cat: TopicCategory, d: Difficulty, rng: RNG, i: number): GeneratedQuestion {
  if (cat === 'Jagamine' || cat === 'Kontroll korrutamisega') {
    const divs = d === 'Lihtne' ? [2, 3, 4, 5] : d === 'Keskmine' ? [2, 3, 4, 5, 6, 7, 8, 9] : [6, 7, 8, 9];
    const b = pick(rng, divs); const q = rInt(rng, d === 'Raske' ? 9 : 4, d === 'Raske' ? 24 : 18); const a = b * q;
    const p = cat === 'Kontroll korrutamisega' ? 'Arvuta. Kontrolliks sobib korrutamine. ' : '';
    return { id: `kd-${i}`, category: cat as unknown as Category, difficulty: d, question: `${p}${a} : ${b} = ___`, correctAnswer: q, kind: 'numeric' };
  }
  if (cat === 'Tähe väärtus') {
    const letter = pick(rng, ['a', 'b', 'c', 'd', 'x', 'y']);
    if (rInt(rng, 0, 1) === 0) { const m = rInt(rng, 3, 9); const val = rInt(rng, 4, 12); return { id: `kt-${i}`, category: cat as unknown as Category, difficulty: d, question: `${letter} · ${m} = ${m * val}. Leia ${letter}.`, correctAnswer: val }; }
    const b = rInt(rng, 2, 9); const q = rInt(rng, 4, d === 'Raske' ? 18 : 14); return { id: `kt-${i}`, category: cat as unknown as Category, difficulty: d, question: `${b * q} : ${letter} = ${q}. Leia ${letter}.`, correctAnswer: b };
  }
  const m = d === 'Lihtne' ? rInt(rng, 4, 12) : d === 'Keskmine' ? rInt(rng, 6, 18) : rInt(rng, 8, 25);
  if (rInt(rng, 0, 1) === 0) { const lim = m * rInt(rng, 3, 8) + rInt(rng, 1, m - 1); return { id: `kv-${i}`, category: cat as unknown as Category, difficulty: d, question: `Leia suurim täisarv a, nii et ${m} · a < ${lim}.`, correctAnswer: Math.floor((lim - 1) / m) }; }
  const lim = m * rInt(rng, 3, 8) - rInt(rng, 1, m - 1); return { id: `kv-${i}`, category: cat as unknown as Category, difficulty: d, question: `Leia väikseim täisarv c, nii et c · ${m} > ${lim}.`, correctAnswer: Math.floor(lim / m) + 1 };
}

function numbersQ(cat: TopicCategory, d: Difficulty, rng: RNG, i: number): GeneratedQuestion {
  if (cat === 'Arvkiir') { const step = pick(rng, [10, 100, 1000]); const base = rInt(rng, 2, 9) * step; const hops = rInt(rng, 2, 5); return { id: `na-${i}`, category: cat as unknown as Category, difficulty: d, question: `Arvkiire samm on ${step}. Märgitud arv on ${base}. Mis arv on ${hops} sammu võrra suurem?`, correctAnswer: base + hops * step }; }
  if (cat === 'Loendamine') { const step = d === 'Lihtne' ? pick(rng, [1, 10, 100]) : pick(rng, [10, 100, 1000]); const start = rInt(rng, 1000, 9000); const down = d === 'Raske' && rInt(rng, 0, 1) === 1; const vals = [start, start + (down ? -step : step), start + (down ? -2 * step : 2 * step)]; return { id: `nl-${i}`, category: cat as unknown as Category, difficulty: d, question: `${vals[0]}, ${vals[1]}, ${vals[2]}, ___`, correctAnswer: start + (down ? -3 * step : 3 * step) }; }
  if (cat === 'Eelnev ja järgnev arv') { const n = rInt(rng, 1000, 9999); const after = rInt(rng, 0, 1) === 1; return { id: `ne-${i}`, category: cat as unknown as Category, difficulty: d, question: after ? `Mis arv tuleb vahetult pärast arvu ${n}?` : `Mis arv tuleb vahetult enne arvu ${n}?`, correctAnswer: after ? n + 1 : n - 1 }; }
  if (cat === 'Järjestamine') { const n = d === 'Lihtne' ? 4 : d === 'Keskmine' ? 5 : 6; const dir = rInt(rng, 0, 1) === 0 ? 'asc' : 'desc'; const cards = []; const used = new Set<number>(); while (cards.length < n) { const v = rInt(rng, 1000, 9999); if (used.has(v)) continue; used.add(v); cards.push({ id: `n-${i}-${cards.length}`, label: String(v), valueMm: v }); } return { id: `nj-${i}`, category: cat as unknown as Category, difficulty: d, question: dir === 'asc' ? 'Järjesta arvud väiksemast suuremani.' : 'Järjesta arvud suuremast väiksemani.', correctAnswer: 0, kind: 'ordering', orderingCards: cards, orderingDirection: dir }; }
  if (cat === 'Võrdlemine') { const a = rInt(rng, 1000, 9999); const b = rInt(rng, 1000, 9999); const sign = a === b ? 0 : a > b ? 1 : -1; return { id: `nv-${i}`, category: cat as unknown as Category, difficulty: d, question: `${a} ___ ${b}`, correctAnswer: sign, kind: 'choice' }; }
  if (cat === 'Arvu koostis') { const n = rInt(rng, 1000, 9999); const asks = [
    [`Mitu sajalist on arvus ${n}?`, Math.floor((n % 1000) / 100)],
    [`Mitu tuhandelist on arvus ${n}?`, Math.floor(n / 1000)],
    [`Mis number on kümneliste kohal arvus ${n}?`, Math.floor((n % 100) / 10)],
    [`Mitu ühelist on arvus ${n}?`, n % 10]
  ] as const; const it = pick(rng, asks); return { id: `nk-${i}`, category: cat as unknown as Category, difficulty: d, question: it[0], correctAnswer: it[1] }; }
  const qs = [['Kui palju erineb suurim neljakohaline arv väikseimast viiekohalisest?', 1], ['Kui palju erineb suurim kolmekohaline arv väikseimast neljakohalisest?', 1], ['Mis on väikseim viiekohaline arv?', 10000], ['Mis on suurim neljakohaline arv?', 9999]] as const; const it = pick(rng, qs); return { id: `nn-${i}`, category: cat as unknown as Category, difficulty: d, question: it[0], correctAnswer: it[1] };
}

function circleQ(cat: TopicCategory, d: Difficulty, rng: RNG, i: number): GeneratedQuestion {
  if (cat === 'Mõisted' || cat === 'Kraadid') { const qs = [
    { q: 'Mitu kraadi on täisringis?', a: 360, v: 'circle-full' as const },
    { q: 'Mitu kraadi on poolringis?', a: 180, v: 'circle-half' as const },
    { q: 'Mitu kraadi on veerandringis?', a: 90, v: 'circle-quarter' as const },
    { q: 'Poolring on ___ kraadi.', a: 180, v: 'circle-half' as const }
  ] as const; const it = pick(rng, qs); return { id: `cm-${i}`, category: cat as unknown as Category, difficulty: d, question: it.q, correctAnswer: it.a, visual: it.v }; }
  if (cat === 'Raadius' || cat === 'Diameeter') { const r = rInt(rng, d === 'Lihtne' ? 2 : 4, d === 'Raske' ? 20 : 14); if (rInt(rng, 0, 1) === 0) return { id: `cr-${i}`, category: cat as unknown as Category, difficulty: d, question: `Ringjoone raadius on ${r} cm. Kui pikk on diameeter?`, expectedUnit: 'cm', correctAnswer: r * 2 }; const dia = r * 2; return { id: `cd-${i}`, category: cat as unknown as Category, difficulty: d, question: `Diameeter on ${dia} cm. Kui pikk on raadius?`, expectedUnit: 'cm', correctAnswer: r }; }
  if (cat === 'Võrdlemine') { if (rInt(rng, 0, 1) === 0) { const a = rInt(rng, 2, 15), b = rInt(rng, 2, 15); const sign = a === b ? 0 : a > b ? 1 : -1; return { id: `cv-${i}`, category: cat as unknown as Category, difficulty: d, question: `${a} cm ___ ${b} cm`, expectedUnit: 'cm', correctAnswer: sign, kind: 'choice' }; } const a = rInt(rng, 2, 15), b = rInt(rng, 2, 15); return { id: `cvn-${i}`, category: cat as unknown as Category, difficulty: d, question: `Ühe ringi raadius on ${a} cm ja teise ringi raadius on ${b} cm. Mitu cm on erinevus?`, expectedUnit: 'cm', correctAnswer: Math.abs(a - b) }; }
  return { id: `cs-${i}`, category: cat as unknown as Category, difficulty: d, question: 'Mitu kraadi on täisringis?', correctAnswer: 360, visual: 'circle-full' };
}


function patternQ(cat: TopicCategory, d: Difficulty, rng: RNG, i: number): GeneratedQuestion {
  const pattern = rInt(rng, 0, 3);
  if (pattern === 0) return { id: `mp-${i}`, category: cat as unknown as Category, difficulty: d, question: 'Jätka mustrit: 1, 2, 3, ___', correctAnswer: 4 };
  if (pattern === 1) return { id: `mp-${i}`, category: cat as unknown as Category, difficulty: d, question: 'Jätka mustrit: 2, 4, 6, ___', correctAnswer: 8 };
  if (pattern === 2) return { id: `mp-${i}`, category: cat as unknown as Category, difficulty: d, question: 'Jätka mustrit: 5, 10, 15, ___', correctAnswer: 20 };
  return { id: `mp-${i}`, category: cat as unknown as Category, difficulty: d, question: 'Mitu ringi tuleb järgmises sammus: 3, 6, 9, ___?', correctAnswer: 12 };
}

export function generateKiurMathSession(topic: string, category: string, difficulty: Difficulty, count: number, seed: number): GeneratedQuestion[] {
  if (isKiurLengthTopic(topic)) return generateLengthSession(category as Category, difficulty, count, seed);
  const rng = seededRng(seed);
  const normalizedTopic = topic === 'ring-ja-ringjoon' && category === 'Mustrid' ? 'mustrid' : topic;
  const topicTypes = normalizedTopic === 'jagamine-kahekohaline-uhekohaline' ? DIV_CATS : normalizedTopic === 'arvud-10000' ? NUM_CATS : normalizedTopic === 'ring-ja-ringjoon' ? CIRCLE_CATS : normalizedTopic === 'mustrid' ? PATTERN_CATS : DIV_CATS;
  const types = category === 'Segaharjutus' ? mixedPlan(rng, count, topicTypes) : Array.from({ length: count }, () => category as TopicCategory);
  const out: GeneratedQuestion[] = [];
  const used = new Set<string>();
  for (let i = 0; i < types.length; i++) {
    let tries = 0;
    let q: GeneratedQuestion;
    do {
      q = normalizedTopic === 'jagamine-kahekohaline-uhekohaline' ? divisionQ(types[i], difficulty, rng, i + tries * 17) : normalizedTopic === 'arvud-10000' ? numbersQ(types[i], difficulty, rng, i + tries * 17) : normalizedTopic === 'mustrid' ? patternQ(types[i], difficulty, rng, i + tries * 17) : circleQ(types[i], difficulty, rng, i + tries * 17);
      tries++;
    } while (used.has(`${q.kind}|${q.question}|${q.correctAnswer}`) && tries < 20);
    used.add(`${q.kind}|${q.question}|${q.correctAnswer}`);
    out.push({ ...q, id: `${topic}-${q.id}-${i}` });
  }
  return out;
}

export const generateLengthExercises = generateLengthSession;
