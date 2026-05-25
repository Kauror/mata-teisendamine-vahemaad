import { Category, GeneratedQuestion } from '@/lib/types';

type RNG = () => number;

type KirsiCategory = 'Arvutamine 10 piires' | 'Arvutamine 20 piires' | 'Suurem või väiksem kuni 100' | 'Segaülesanded';

function seededRng(seed: number): RNG {
  let t = seed >>> 0;
  return () => { t += 0x6D2B79F5; let x = Math.imul(t ^ (t >>> 15), 1 | t); x ^= x + Math.imul(x ^ (x >>> 7), 61 | x); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
}
const rInt = (rng: RNG, min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
const shuffle = <T,>(rng: RNG, arr: T[]) => { const out = [...arr]; for (let i = out.length - 1; i > 0; i--) { const j = rInt(rng, 0, i); [out[i], out[j]] = [out[j], out[i]]; } return out; };

function calc10(rng: RNG, i: number): GeneratedQuestion {
  const add = i % 2 === 0;
  const a = rInt(rng, 0, 10);
  const b = add ? rInt(rng, 0, 10 - a) : rInt(rng, 0, a);
  return {
    id: `k10-${i}`,
    category: 'Arvutamine' as Category,
    difficulty: 'Lihtne',
    question: `${a} ${add ? '+' : '-'} ${b} = ___`,
    expectedUnit: 'cm',
    correctAnswer: add ? a + b : a - b,
    kind: 'numeric'
  };
}

function calc20(rng: RNG, i: number): GeneratedQuestion {
  const add = i % 2 === 0;
  const a = rInt(rng, 0, 20);
  const b = add ? rInt(rng, 0, 20 - a) : rInt(rng, 0, a);
  return {
    id: `k20-${i}`,
    category: 'Arvutamine' as Category,
    difficulty: 'Keskmine',
    question: `${a} ${add ? '+' : '-'} ${b} = ___`,
    expectedUnit: 'cm',
    correctAnswer: add ? a + b : a - b,
    kind: 'numeric'
  };
}

function compare100(rng: RNG, i: number): GeneratedQuestion {
  const eq = i % 4 === 0;
  const a = rInt(rng, 0, 100);
  const b = eq ? a : rInt(rng, 0, 100);
  const correct = a === b ? '=' : a > b ? '>' : '<';
  return {
    id: `kcmp-${i}`,
    category: 'Võrdlemine' as Category,
    difficulty: 'Lihtne',
    question: `${a} ___ ${b}`,
    expectedUnit: 'cm',
    correctAnswer: correct === '<' ? -1 : correct === '=' ? 0 : 1,
    kind: 'choice'
  };
}

export function generateKirsiSession(mode: KirsiCategory, count: number, seed: number): GeneratedQuestion[] {
  const rng = seededRng(seed);
  const types = mode === 'Segaülesanded'
    ? (count <= 3 ? shuffle(rng, ['Arvutamine 10 piires', 'Arvutamine 20 piires', 'Suurem või väiksem kuni 100']).slice(0, count)
      : Array.from({ length: count }, (_, i) => ['Arvutamine 10 piires', 'Arvutamine 20 piires', 'Suurem või väiksem kuni 100'][i % 3]).map((t) => t as KirsiCategory))
    : Array.from({ length: count }, () => mode);

  const out: GeneratedQuestion[] = [];
  const used = new Set<string>();
  for (let i = 0; i < count; i++) {
    let q: GeneratedQuestion;
    let tries = 0;
    do {
      const t = types[i];
      q = t === 'Arvutamine 10 piires' ? calc10(rng, i + tries * 7)
        : t === 'Arvutamine 20 piires' ? calc20(rng, i + tries * 7)
        : compare100(rng, i + tries * 7);
      tries += 1;
    } while (used.has(q.question) && tries < 20);
    used.add(q.question);
    out.push({ ...q, id: `${q.id}-${i}` });
  }
  return out;
}
