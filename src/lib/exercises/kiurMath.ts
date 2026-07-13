import { Category, Difficulty, GeneratedQuestion } from '@/lib/types';
import { generateSession as generateLengthSession } from '@/lib/exercises/lengths';
import { isKiurLengthTopic } from '@/lib/kiurMathTopics';
import { kiurTextProblemPool } from '@/lib/kiurTextProblems';
import { RNG, pickRandom, randomInt, seededRng, shuffleWithRng } from '@/lib/random';

const rInt = randomInt;
const pick = pickRandom;

const DIV_CATS = ['Arvuta jagatis', 'Jaga osadeks', 'Vali sobiv jaotus', 'Jaga võrdselt', 'Jaga rühmadesse', 'Vali jagamistehe', 'Kontrolli korrutamisega', 'Vali jagatis', 'Rühmadega jagamine', 'Kas arvutus on õige?', 'Jaga sama arvuga', 'Vali abitehe', 'Segaharjutus'] as const;
const BIG_NUM_CATS = ['Liida sajalised', 'Lahuta sajalised', 'Liida tuhandelised', 'Lahuta tuhandelised', 'Liida 2- või 3-kohaline arv', 'Lahuta 2- või 3-kohaline arv', 'Liida kaks 4-kohalist arvu', 'Lahuta 4-kohalised arvud', 'Lahuta arv järkudeks', 'Pane arv kokku', 'Numbri väärtus', 'Ümardamine', 'Ligikaudne arvutus', 'Leia arvutusviga', 'Plokid ja järgud'] as const;
const CIRCLE_CATS = ['Ring või ringjoon', 'Leia raadius', 'Leia läbimõõt', 'Läbimõõt raadiusest', 'Raadius läbimõõdust', 'Punkti asukoht', 'Sama keskpunkt', 'Võrdle raadiuseid', 'Ringi kraadid', 'Puuduv kraad'] as const;
const PATTERN_CATS = ['Segaharjutus'] as const;
const MULTIPLICATION_EXERCISE_KEY = 'kiur.math.multiplication';
const TEXT_PROBLEM_EXERCISE_KEY = 'kiur.math.tekstulesanded';

type TopicCategory = (typeof DIV_CATS)[number] | (typeof BIG_NUM_CATS)[number] | (typeof CIRCLE_CATS)[number] | (typeof PATTERN_CATS)[number] | 'Segaharjutus';

function mixedPlan(rng: RNG, count: number, types: readonly TopicCategory[]) {
  const out: TopicCategory[] = [];
  for (let i = 0; i < count; i++) out.push(types[i % types.length]);
  return shuffleWithRng(rng, out);
}

function divisionQ(cat: TopicCategory, d: Difficulty, rng: RNG, i: number): GeneratedQuestion {
  const mk = () => {
    const divisor = rInt(rng, 2, 9);
    const quotient = rInt(rng, d === 'Lihtne' ? 2 : 4, d === 'Raske' ? 22 : 16);
    const dividend = divisor * quotient;
    if (dividend < 10 || dividend > 99) return mk();
    return { dividend, divisor, quotient };
  };
  const { dividend, divisor, quotient } = mk();

  if (cat === 'Arvuta jagatis') {
    return { id: `jd-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'kahekohalise-arvu-jagamine', question: `Arvuta jagatis: ${dividend} : ${divisor} = ?`, correctAnswer: quotient, explanation: `${dividend} : ${divisor} = ${quotient}, sest ${quotient} × ${divisor} = ${dividend}.` };
  }
  if (cat === 'Jaga osadeks') {
    const tens = Math.floor(dividend / 10) * 10;
    const rest = dividend - tens;
    const splitA = rest % divisor === 0 && tens % divisor === 0 ? tens : dividend - divisor * 2;
    const splitB = dividend - splitA;
    return { id: `jo-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'kahekohalise-arvu-jagamine', question: `${dividend} : ${divisor} = (${splitA} : ${divisor}) + (${splitB} : ${divisor}). Arvuta jagatis.`, correctAnswer: quotient, explanation: `${splitA} : ${divisor} ja ${splitB} : ${divisor} annavad kokku ${quotient}.` };
  }
  if (cat === 'Vali sobiv jaotus') {
    const a = dividend - divisor * 2;
    const b = divisor * 2;
    return { id: `vj-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'kahekohalise-arvu-jagamine', question: `Milline jaotus aitab arvutada ${dividend} : ${divisor}?`, correctAnswer: 0, kind: 'choice', choiceOptions: [`${a} : ${divisor} ja ${b} : ${divisor}`, `${dividend - 1} : ${divisor} ja 1 : ${divisor}`, `${dividend} : 2 ja ${dividend} : 3`], explanation: 'Sobiv jaotus annab kaks osa, mis mõlemad jaguvad sama jagajaga.' };
  }
  if (cat === 'Jaga võrdselt') {
    const things = pick(rng, ['kommi', 'kleepsu', 'pliiatsit', 'kaarti']);
    const who = pick(rng, ['lapse', 'sõbra', 'mängija', 'õpilase']);
    return { id: `jv-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'kahekohalise-arvu-jagamine', question: `${dividend} ${things} jagatakse võrdselt ${divisor} ${who} vahel. Mitu saab igaüks?`, correctAnswer: quotient, explanation: `Jagame ${dividend} : ${divisor} = ${quotient}.` };
  }
  if (cat === 'Jaga rühmadesse') {
    const things = pick(rng, ['õuna', 'klotsi', 'palli', 'raamatut']);
    const containers = pick(rng, [
      { inessivePlural: 'kottides', inessiveSingular: 'kotis', partitiveSingular: 'kotti' },
      { inessivePlural: 'karpides', inessiveSingular: 'karbis', partitiveSingular: 'karpi' },
      { inessivePlural: 'rühmades', inessiveSingular: 'rühmas', partitiveSingular: 'rühma' },
      { inessivePlural: 'virnades', inessiveSingular: 'virnas', partitiveSingular: 'virna' }
    ] as const);
    return { id: `jr-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'kahekohalise-arvu-jagamine', question: `${dividend} ${things} pannakse ${containers.inessivePlural}. Igas ${containers.inessiveSingular} on ${divisor} ${things}. Mitu ${containers.partitiveSingular} saab?`, correctAnswer: quotient, explanation: `Kui igas rühmas on ${divisor}, siis ${dividend} : ${divisor} = ${quotient}.` };
  }
  if (cat === 'Vali jagamistehe') {
    return { id: `vt-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'kahekohalise-arvu-jagamine', question: `${dividend} eset jagatakse võrdselt ${divisor} rühma. Milline arvutus sobib?`, correctAnswer: 0, kind: 'choice', choiceOptions: [`${dividend} : ${divisor}`, `${dividend} + ${divisor}`, `${divisor} : ${dividend}`], explanation: 'Võrdseks jagamine tähendab jagamistehet.' };
  }
  if (cat === 'Kontrolli korrutamisega') {
    return { id: `kc-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'kahekohalise-arvu-jagamine', question: `${dividend} : ${divisor} = ${quotient}. Milline tehe kontrollib vastust?`, correctAnswer: 0, kind: 'choice', choiceOptions: [`${quotient} × ${divisor} = ${dividend}`, `${quotient} + ${divisor} = ${dividend}`, `${dividend} - ${quotient} = ${divisor}`], explanation: 'Jagamist kontrollime korrutamisega.' };
  }
  if (cat === 'Vali jagatis') {
    const candidates = [quotient, quotient + 1, Math.max(2, quotient - 1), quotient + divisor, quotient + 2, Math.max(2, quotient - 2)];
    const uniq = Array.from(new Set(candidates)).slice(0, 4);
    while (uniq.length < 4) uniq.push(uniq[uniq.length - 1] + 1);
    return { id: `vjg-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'kahekohalise-arvu-jagamine', question: `Vali õige vastus: ${dividend} : ${divisor} = ?`, correctAnswer: 0, kind: 'choice', choiceOptions: uniq.map(String), explanation: `${dividend} : ${divisor} = ${quotient}.` };
  }
  if (cat === 'Rühmadega jagamine') {
    return { id: `rg-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'kahekohalise-arvu-jagamine', question: `${dividend} eset jagatakse võrdselt ${divisor} rühma vahel. Mitu eset on igas rühmas?`, correctAnswer: quotient, explanation: `${dividend} : ${divisor} = ${quotient}.` };
  }
  if (cat === 'Kas arvutus on õige?') {
    const ok = rInt(rng, 0, 1) === 0;
    const shown = ok ? quotient : quotient + pick(rng, [-2, -1, 1, 2]);
    return { id: `ko-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'kahekohalise-arvu-jagamine', question: `Kas arvutus on õige? ${dividend} : ${divisor} = ${shown}`, correctAnswer: ok ? 0 : 1, kind: 'choice', choiceOptions: ['Õige', 'Vale'], explanation: `${dividend} : ${divisor} = ${quotient}.` };
  }
  if (cat === 'Jaga sama arvuga') {
    const d2 = divisor;
    const q2 = Math.max(2, Math.min(49, quotient + pick(rng, [1, 2, 3])));
    const a2 = d2 * q2;
    const validAlt = a2 >= 10 && a2 <= 99;
    const target = validAlt ? pick(rng, [`${dividend} : ${divisor}`, `${a2} : ${d2}`]) : `${dividend} : ${divisor}`;
    const ans = target == `${dividend} : ${divisor}` ? quotient : q2;
    return { id: `sa-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'kahekohalise-arvu-jagamine', question: `Arvuta järgmine jagatis: ${target}`, correctAnswer: ans, explanation: 'Jagame sama jagajaga.' };
  }
  const helperA = dividend - divisor * 2;
  const helperB = divisor * 2;
  return { id: `ab-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'kahekohalise-arvu-jagamine', question: `Milline abitehe sobib arvutamiseks ${dividend} : ${divisor}?`, correctAnswer: 0, kind: 'choice', choiceOptions: [`${helperA} : ${divisor} ja ${helperB} : ${divisor}`, `${dividend} : 2 ja ${dividend} : 4`, `${dividend + 4} : ${divisor}`], explanation: `${dividend} saab jagada osadeks, mis jaguvad ${divisor}-ga.` };
}


function bigNumberQ(cat: TopicCategory, d: Difficulty, rng: RNG, i: number): GeneratedQuestion {
  const mk4 = (min = 1200, max = 9800) => rInt(rng, min, max);

  if (cat === 'Liida sajalised') {
    const a = rInt(rng, 20, 95) * 100;
    const b = rInt(rng, 1, Math.min(9, Math.floor((10000 - a) / 100))) * 100;
    return { id: `n1-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'suured-arvud', question: `Arvuta: ${a} + ${b}`, correctAnswer: a + b, explanation: `Lisa sajalised: ${a} + ${b} = ${a + b}.` };
  }
  if (cat === 'Lahuta sajalised') {
    const a = rInt(rng, 40, 99) * 100;
    const b = rInt(rng, 1, Math.min(9, Math.floor((a - 100) / 100))) * 100;
    return { id: `n2-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'suured-arvud', question: `Arvuta: ${a} - ${b}`, correctAnswer: a - b, explanation: `Võta sajalised maha: ${a} - ${b} = ${a - b}.` };
  }
  if (cat === 'Liida tuhandelised') {
    const a = mk4(1200, 8800);
    const b = rInt(rng, 1, Math.floor((10000 - a) / 1000)) * 1000;
    return { id: `n3-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'suured-arvud', question: `Arvuta: ${a} + ${b}`, correctAnswer: a + b, explanation: `Lisa tuhandelised: ${a} + ${b} = ${a + b}.` };
  }
  if (cat === 'Lahuta tuhandelised') {
    const a = mk4(2500, 9800);
    const b = rInt(rng, 1, Math.floor((a - 100) / 1000)) * 1000;
    return { id: `n4-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'suured-arvud', question: `Arvuta: ${a} - ${b}`, correctAnswer: a - b, explanation: `Võta tuhandelised maha: ${a} - ${b} = ${a - b}.` };
  }
  if (cat === 'Liida 2- või 3-kohaline arv') {
    const a = mk4(2000, 9300);
    const b = rInt(rng, 2, 9) * 10 + pick(rng, [0, 20, 40, 60, 80, 100, 120, 240, 300, 440]);
    const bb = Math.min(b, 10000 - a);
    return { id: `n5-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'suured-arvud', question: `Arvuta summa: ${a} + ${bb}`, correctAnswer: a + bb, explanation: `Liidame osade kaupa: ${a} + ${bb} = ${a + bb}.` };
  }
  if (cat === 'Lahuta 2- või 3-kohaline arv') {
    const a = mk4(2300, 9800);
    const b = pick(rng, [50, 120, 200, 300, 440, 560, 780]);
    const bb = Math.min(b, a - 100);
    return { id: `n6-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'suured-arvud', question: `Arvuta vahe: ${a} - ${bb}`, correctAnswer: a - bb, explanation: `Lahutame osade kaupa: ${a} - ${bb} = ${a - bb}.` };
  }
  if (cat === 'Liida kaks 4-kohalist arvu') {
    const a = mk4(1200, 7000);
    const b = mk4(1100, 9000 - a);
    return { id: `n7-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'suured-arvud', question: `Liida arvud: ${a} + ${b}`, correctAnswer: a + b, explanation: 'Liida tuhanded, sajad, kümned ja ühelised eraldi.' };
  }
  if (cat === 'Lahuta 4-kohalised arvud') {
    const a = mk4(3500, 9800);
    const b = mk4(1200, a - 100);
    return { id: `n8-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'suured-arvud', question: `Lahuta arvud: ${a} - ${b}`, correctAnswer: a - b, explanation: 'Lahuta järgud rahulikult osade kaupa.' };
  }
  if (cat === 'Lahuta arv järkudeks') {
    const n = mk4(1000, 10000);
    const t = Math.floor(n / 1000), s = Math.floor((n % 1000) / 100), k = Math.floor((n % 100) / 10), y = n % 10;
    const good = `${t * 1000}${s ? ` + ${s * 100}` : ''}${k ? ` + ${k * 10}` : ''}${y ? ` + ${y}` : ''}`.replace(/\s\+\s$/, '');
    const bad1 = `${t * 1000} + ${s * 10} + ${k * 100} + ${y}`;
    const bad2 = `${t * 1000} + ${s * 100} + ${k} + ${y * 10}`;
    return { id: `n9-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'suured-arvud', question: `Milline on arvu ${n} õige lahutus?`, correctAnswer: 0, kind: 'choice', choiceOptions: [good, bad1, bad2], explanation: `Arvus ${n} on ${t} tuhandelist, ${s} sajalist, ${k} kümnelist ja ${y} ühelist.` };
  }
  if (cat === 'Pane arv kokku') {
    const t = rInt(rng, 1, 9), s = rInt(rng, 0, 9), k = rInt(rng, 0, 9), y = rInt(rng, 0, 9);
    const n = t * 1000 + s * 100 + k * 10 + y;
    const parts = shuffleWithRng(rng, [`${t} tuhandelist`, `${s} sajalist`, `${k} kümnelist`, `${y} ühelist`]);
    return { id: `n10-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'suured-arvud', question: `${parts.join(', ')}. Milline arv tekib?`, correctAnswer: n, explanation: `${t * 1000} + ${s * 100} + ${k * 10} + ${y} = ${n}.` };
  }
  if (cat === 'Numbri väärtus') {
    const n = mk4(1200, 9800);
    const idx = rInt(rng, 0, 3);
    const digits = String(n).padStart(4, '0').split('').map(Number);
    const value = digits[idx] * [1000, 100, 10, 1][idx];
    const rawOpts = [value, digits[idx] * [100, 10, 1, 1000][idx], digits[idx], value + (value === 0 ? 1 : 10)];
    const opts = Array.from(new Set(rawOpts)).map(String);
    while (opts.length < 3) opts.push(String(Number(opts[opts.length - 1]) + 1));
    return { id: `n11-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'suured-arvud', question: `Mis on numbri ${digits[idx]} väärtus arvus ${n}?`, correctAnswer: 0, kind: 'choice', choiceOptions: opts.slice(0, 3), explanation: `${digits[idx]} on ${['tuhandeliste', 'sajaliste', 'kümneliste', 'üheliste'][idx]} kohal.` };
  }
  if (cat === 'Ümardamine') {
    const n = mk4(1200, 9800);
    if (rInt(rng, 0, 1) === 0) {
      const ans = Math.round(n / 100) * 100;
      const opts = Array.from(new Set([ans, Math.floor(n / 100) * 100, Math.ceil(n / 100) * 100, ans + 100])).slice(0, 3).map(String);
      return { id: `n12-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'suured-arvud', question: `Ümarda lähima sajani: ${n}`, correctAnswer: 0, kind: 'choice', choiceOptions: opts, explanation: `${n} ümardatuna lähima sajani on ${ans}.` };
    }
    const ans = Math.round(n / 1000) * 1000;
    const opts = Array.from(new Set([ans, Math.floor(n / 1000) * 1000, Math.ceil(n / 1000) * 1000, Math.min(10000, ans + 1000)])).slice(0, 3).map(String);
    return { id: `n12-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'suured-arvud', question: `Ümarda lähima tuhandeni: ${n}`, correctAnswer: 0, kind: 'choice', choiceOptions: opts, explanation: `${n} ümardatuna lähima tuhandeni on ${ans}.` };
  }
  if (cat === 'Ligikaudne arvutus') {
    const add = rInt(rng, 0, 1) === 0;
    const a = mk4(2300, 9100);
    const b = mk4(700, add ? 10000 - a : a - 500);
    const est = add ? (Math.round(a / 100) * 100 + Math.round(b / 100) * 100) : (Math.round(a / 100) * 100 - Math.round(b / 100) * 100);
    return { id: `n13-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'suured-arvud', question: `Vali ligikaudne vastus: ${a} ${add ? '+' : '-'} ${b}`, correctAnswer: 0, kind: 'choice', choiceOptions: [String(est), String(est + 400), String(Math.max(0, est - 400))], explanation: `Ümardame: ${a} ≈ ${Math.round(a / 100) * 100} ja ${b} ≈ ${Math.round(b / 100) * 100}.` };
  }
  if (cat === 'Leia arvutusviga') {
    const rows = [
      { q: 'Kas arvutus on õige? 4300 + 200 = 4500', ok: 'Õige', e: '200 tähendab 2 sajalist.' },
      { q: 'Kas arvutus on õige? 7600 - 3000 = 7300', ok: 'Vale', e: '3000 tähendab 3 tuhandelist. Õige vastus on 4600.' },
      { q: 'Kas arvutus on õige? 5600 + 400 = 6000', ok: 'Õige', e: 'Liitsime 4 sajalist.' },
      { q: 'Kas arvutus on õige? 8200 - 500 = 7700', ok: 'Õige', e: 'Lahutasime 5 sajalist.' }
    ] as const;
    const it = pick(rng, rows);
    return { id: `n14-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'suured-arvud', question: it.q, correctAnswer: it.ok === 'Õige' ? 0 : 1, kind: 'choice', choiceOptions: ['Õige', 'Vale'], explanation: it.e };
  }

  const t = rInt(rng, 2, 9), s = rInt(rng, 0, 9), k = rInt(rng, 0, 9), y = rInt(rng, 0, 9);
  const n = t * 1000 + s * 100 + k * 10 + y;
  const parts = shuffleWithRng(rng, [`tuhandelised: ${t}`, `sajalised: ${s}`, `kümnelised: ${k}`, `ühelised: ${y}`]);
  return { id: `n15-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'suured-arvud', question: `Millist arvu näitavad plokid? ${parts.join(', ')}.`, correctAnswer: n, explanation: `${t} tuhandelist, ${s} sajalist, ${k} kümnelist ja ${y} ühelist teeb kokku ${n}.`, visual: 'place-value-blocks' };
}

function circleQ(cat: TopicCategory, d: Difficulty, rng: RNG, i: number): GeneratedQuestion {
  const unit = pick(rng, ['cm', 'mm'] as const);
  if (cat === 'Ring või ringjoon') {
    const variants = [
      { q: 'Kas kirjeldus käib ringi või ringjoone kohta? See on joon, mis piirab ringi.', a: 'Ringjoon', e: 'Ringjoon on ainult piirjoon ehk ringi piirav joon.', v: 'ring-outline' as const },
      { q: 'Kas kirjeldus käib ringi või ringjoone kohta? See on ringjoonega piiratud kujund koos sisuga.', a: 'Ring', e: 'Ring on ringjoonega piiratud tasandi osa ehk kujund koos sisuga.', v: 'ring-filled' as const }
    ] as const;
    const it = pick(rng, variants);
    return { id: `cg-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'ring-ja-ringjoon', question: it.q, correctAnswer: it.a === 'Ring' ? 0 : 1, kind: 'choice', choiceOptions: ['Ring', 'Ringjoon'], explanation: it.e, visual: it.v };
  }
  if (cat === 'Leia raadius') return { id: `cr-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'ring-ja-ringjoon', question: 'Milline sirglõik on raadius?', correctAnswer: 0, kind: 'choice', choiceOptions: ['A', 'B', 'C'], explanation: 'Raadius ühendab keskpunkti ringjoone punktiga.', visual: 'radius-demo' };
  if (cat === 'Leia läbimõõt') return { id: `cd-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'ring-ja-ringjoon', question: 'Milline sirglõik on läbimõõt?', correctAnswer: 1, kind: 'choice', choiceOptions: ['A', 'B', 'C'], explanation: 'Läbimõõt läbib keskpunkti ja ühendab ringjoone kahte punkti.', visual: 'diameter-demo' };
  if (cat === 'Läbimõõt raadiusest') { const r = rInt(rng, 3, 15); return { id: `cdf-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'ring-ja-ringjoon', question: `Ringjoone raadius on ${r} ${unit}. Kui pikk on läbimõõt?`, expectedUnit: unit, correctAnswer: r * 2, explanation: `Läbimõõt on kaks raadiust: ${r * 2} ${unit}.` }; }
  if (cat === 'Raadius läbimõõdust') { const r = rInt(rng, 3, 14); return { id: `crf-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'ring-ja-ringjoon', question: `Ringjoone läbimõõt on ${r * 2} ${unit}. Kui pikk on raadius?`, expectedUnit: unit, correctAnswer: r, explanation: 'Raadius on pool läbimõõdust.' }; }
  if (cat === 'Punkti asukoht') { const ask = pick(rng, ['Kus asub punkt A?', 'Kus asub punkt B?', 'Kus asub punkt C?'] as const); const map = { 'Kus asub punkt A?': 0, 'Kus asub punkt B?': 1, 'Kus asub punkt C?': 2 } as const; const exp = map[ask] === 0 ? 'Punkt on ringi sees, kui see asub ringjoonega piiratud ala sees.' : map[ask] === 1 ? 'Punkt ringjoone peal asub täpselt piirjoonel.' : 'Punkt on ringist väljas, kui see jääb ringjoonest väljapoole.'; return { id: `cp-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'ring-ja-ringjoon', question: ask, correctAnswer: map[ask], kind: 'choice', choiceOptions: ['ringi sees', 'ringjoone peal', 'ringist väljas'], explanation: exp, visual: 'point-position' }; }
  if (cat === 'Sama keskpunkt') { const bigger = pick(rng, [6, 8, 10]); return { id: `cc-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'ring-ja-ringjoon', question: `Kahel ringjoonel on sama keskpunkt. Suurema ringjoone raadius on ${bigger} cm. Väiksema ringjoone raadius on poole väiksem. Kui suur on väiksema ringjoone raadius?`, expectedUnit: 'cm', correctAnswer: bigger / 2, explanation: 'Poole väiksem tähendab, et jagame kahega.', visual: 'concentric-circles' }; }
  if (cat === 'Võrdle raadiuseid') {
    const cm = pick(rng, [3, 4, 5]);
    const mm = cm * 10;
    const mode = rInt(rng, 0, 1);
    if (mode === 0) {
      return { id: `cv-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'ring-ja-ringjoon', question: `K raadius on ${mm} mm ja L raadius on ${cm} cm. Kas ringjooned on sama suured?`, correctAnswer: 0, kind: 'choice', choiceOptions: ['Jah', 'Ei'], explanation: `${cm} cm = ${mm} mm, seega on ringjooned sama suured.` };
    }
    return { id: `cv-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'ring-ja-ringjoon', question: `K raadius on ${mm} mm ja L raadius on ${cm} cm. Milline ringjoon on suurem?`, correctAnswer: 2, kind: 'choice', choiceOptions: ['K', 'L', 'sama suured'], explanation: `${cm} cm = ${mm} mm, seega on ringjooned sama suured.` };
  }
  if (cat === 'Ringi kraadid') { const set = [{ q: 'Mitu kraadi on täisring?', a: 360, v: 'circle-full' as const }, { q: 'Mitu kraadi on pool ringi?', a: 180, v: 'circle-half' as const }, { q: 'Mitu kraadi on veerand ringi?', a: 90, v: 'circle-quarter' as const }, { q: 'Mitu kraadi on kolmveerand ringi?', a: 270, v: 'sector-missing' as const }] as const; const it = pick(rng, set); return { id: `ck-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'ring-ja-ringjoon', question: it.q, correctAnswer: it.a, explanation: `Täisring on 360° ja sellest leitakse osad.`, visual: it.v, visualKnownDegrees: it.v === 'sector-missing' ? it.a : undefined }; }
  const knownA = pick(rng, [45, 60, 75, 90, 120, 135, 150, 180, 190, 210, 240, 270, 300]);
  return { id: `cm-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'ring-ja-ringjoon', question: `Ring on jagatud kaheks osaks. Värvitud osa on ${knownA}°. Kui suur on teine osa?`, correctAnswer: 360 - knownA, explanation: `Täisring on 360°. 360° − ${knownA}° = ${360 - knownA}°.`, visual: 'sector-missing', visualKnownDegrees: knownA };
}

function patternQ(cat: TopicCategory, d: Difficulty, rng: RNG, i: number): GeneratedQuestion {
  const t = rInt(rng, 0, 13);

  if (t === 0) {
    const step = pick(rng, [100, 200, 500]);
    const start = rInt(rng, 10, 70) * 100;
    const seq = [start, start + step, start + 2 * step, start + 3 * step];
    return { id: `mp-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'arvu-ja-loogikamustrid', question: `Jätka mustrit: ${seq.join(', ')}, __`, correctAnswer: start + 4 * step, explanation: `Iga kord lisatakse ${step}.` };
  }

  if (t === 1) {
    const step = pick(rng, [100, 200, 500]);
    const start = rInt(rng, 45, 95) * 100;
    const seq = [start, start - step, start - 2 * step, start - 3 * step];
    return { id: `mp-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'arvu-ja-loogikamustrid', question: `Jätka mustrit: ${seq.join(', ')}, __`, correctAnswer: start - 4 * step, explanation: `Iga kord võetakse maha ${step}.` };
  }

  if (t === 2) {
    const step = pick(rng, [100, 200, 500]);
    const start = rInt(rng, 15, 70) * 100;
    const miss = 2;
    const seq = [start, start + step, start + 2 * step, start + 3 * step, start + 4 * step];
    const shown = seq.map((n, idx) => idx === miss ? '__' : String(n)).join(', ');
    return { id: `mp-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'arvu-ja-loogikamustrid', question: `Leia puuduv arv mustris: ${shown}`, correctAnswer: seq[miss], explanation: `Muster suureneb iga kord ${step} võrra.` };
  }

  if (t === 3) {
    const step = pick(rng, [100, 200, 500]);
    const start = rInt(rng, 10, 70) * 100;
    const seq = [start, start + step, start + 2 * step, start + 3 * step];
    return { id: `mp-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'arvu-ja-loogikamustrid', question: `Leia reegel: ${seq.join(', ')}`, correctAnswer: 1, kind: 'choice', choiceOptions: [`+${Math.floor(step / 2)}`, `+${step}`, `-${step}`, `+1000`], explanation: `${seq[0]} → ${seq[1]} suureneb ${step} võrra.` };
  }

  if (t === 4) {
    const start = pick(rng, [1000, 2000, 3000]);
    const seq = [start, start + 100, start + 300, start + 600, start + 1000];
    return { id: `mp-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'arvu-ja-loogikamustrid', question: `Jälgi, kuidas samm muutub: ${seq.join(', ')}, __`, correctAnswer: start + 1500, explanation: 'Sammud on +100, +200, +300, +400. Järgmine samm on +500.' };
  }

  if (t === 5) {
    const start = pick(rng, [1000, 3000, 5000]);
    const add = pick(rng, [200, 300, 500]);
    const sub = pick(rng, [100, 200]);
    const seq = [start, start + add, start + add - sub, start + 2 * add - sub, start + 2 * add - 2 * sub];
    return { id: `mp-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'arvu-ja-loogikamustrid', question: `Jälgi vahelduvat mustrit: ${seq.join(', ')}, __`, correctAnswer: start + 3 * add - 2 * sub, explanation: `Muster vaheldub: +${add}, siis -${sub}.` };
  }

  if (t === 6) {
    const step = pick(rng, [100, 200, 500]);
    const start = rInt(rng, 10, 60) * 100;
    const correct = [start, start + step, start + 2 * step, start + 3 * step, start + 4 * step];
    const wrong = [...correct];
    wrong[3] += step * 2;
    const opts = wrong.map(String);
    return { id: `mp-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'arvu-ja-loogikamustrid', question: `Leia arv, mis ei sobi mustrisse: ${wrong.join(', ')}`, correctAnswer: 3, kind: 'choice', choiceOptions: opts, explanation: `Muster peaks suurenema iga kord ${step} võrra.` };
  }

  if (t === 7) {
    const mode = rInt(rng, 0, 2);
    if (mode === 0) {
      return { id: `mp-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'arvu-ja-loogikamustrid', question: 'Leia tabeli reegel: 1000→1200, 2000→2200, 3000→3200, 4000→__', correctAnswer: 4200, explanation: 'Iga sisendarvule lisatakse 200.' };
    }
    if (mode === 1) {
      return { id: `mp-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'arvu-ja-loogikamustrid', question: 'Leia tabeli reegel: 1500→3000, 2000→4000, 2500→5000, 3000→__', correctAnswer: 6000, explanation: 'Väljund on kaks korda suurem.' };
    }
    return { id: `mp-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'arvu-ja-loogikamustrid', question: 'Leia tabeli reegel: 5000→4500, 6000→5500, 7000→6500, 8000→__', correctAnswer: 7500, explanation: 'Iga kord lahutatakse 500.' };
  }

  if (t === 8) {
    const step = pick(rng, [200, 300, -300]);
    // For a decreasing chain, keep the start high enough that the answer
    // (start + 4*step) never goes negative — the answer input has no minus key.
    const start = step < 0 ? pick(rng, [2000, 5000]) : pick(rng, [1000, 2000, 5000]);
    const seq = [start, start + step, start + 2 * step, start + 3 * step];
    return { id: `mp-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'arvu-ja-loogikamustrid', question: `Jätka arvutusahelat: ${seq.join(' → ')} → __`, correctAnswer: start + 4 * step, explanation: `Sama tehe kordub: ${step > 0 ? '+' + step : String(step)}.` };
  }

  if (t === 9) {
    const sets = [
      { q: 'Jätka mustrit: ■ ▲ ■ ▲ ■ __', opts: ['▲', '■', '●'], c: 0, e: 'Muster kordub: ruut, kolmnurk.' },
      { q: 'Jätka mustrit: ★ ● ▲ ★ ● ▲ ★ __', opts: ['●', '▲', '■'], c: 0, e: 'Muster kordub kolme kujundiga.' }
    ] as const;
    const it = pick(rng, sets);
    return { id: `mp-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'arvu-ja-loogikamustrid', question: it.q, correctAnswer: it.c, kind: 'choice', choiceOptions: [...it.opts], explanation: it.e };
  }

  if (t === 10) {
    const base = pick(rng, [1, 2]);
    const seq = [base, base * 2, base * 3];
    return { id: `mp-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'arvu-ja-loogikamustrid', question: `Vaata, kuidas muster kasvab: ${seq[0]} plokk, ${seq[1]} plokki, ${seq[2]} plokki. Mitu plokki on järgmises reas?`, correctAnswer: base * 4, explanation: `Igas reas on ${base} plokki rohkem.` };
  }

  if (t === 11) {
    const n = pick(rng, [100, 500, 1000]);
    return { id: `mp-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'arvu-ja-loogikamustrid', question: `Leia arvu ja pildi muster: ${n}, ${n * 2}, ${n * 3}, ${n * 4}, __`, correctAnswer: n * 5, explanation: `Arv suureneb iga kord ${n} võrra.` };
  }

  if (t === 12) {
    const mul = pick(rng, [100, 200, 500]);
    return { id: `mp-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'arvu-ja-loogikamustrid', question: `Leia paaride muster: ${mul}, ${mul * 2}, ${mul * 3}, __`, correctAnswer: mul * 4, explanation: `Arv suureneb iga kord ${mul} võrra.` };
  }

  const options = ['suureneb', 'väheneb', 'kordub kujunditena', 'ei ole muster'];
  const mode = rInt(rng, 0, 2);
  if (mode === 0) return { id: `mp-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'arvu-ja-loogikamustrid', question: 'Milline muster see on? 1000, 1200, 1400, 1600', correctAnswer: 0, kind: 'choice', choiceOptions: options, explanation: 'Arvud suurenevad iga kord 200 võrra.' };
  if (mode === 1) return { id: `mp-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'arvu-ja-loogikamustrid', question: 'Milline muster see on? 5000, 4500, 4000, 3500', correctAnswer: 1, kind: 'choice', choiceOptions: options, explanation: 'Arvud vähenevad iga kord 500 võrra.' };
  return { id: `mp-${i}`, category: cat as unknown as Category, difficulty: d, subtopic: 'arvu-ja-loogikamustrid', question: 'Milline muster see on? ■ ▲ ■ ▲ ■ ▲', correctAnswer: 2, kind: 'choice', choiceOptions: options, explanation: 'Kujundid korduvad kindlas järjekorras.' };
}


function multiplicationFacts(rng: RNG) {
  const hardFacts = shuffleWithRng(rng, [
    [6, 7], [7, 8], [8, 9], [9, 6], [7, 9], [6, 8], [8, 8], [9, 9]
  ] as const);
  const mixedFacts = shuffleWithRng(rng, Array.from({ length: 9 }, (_, aIndex) => (
    Array.from({ length: 9 }, (_, bIndex) => [aIndex + 2, bIndex + 2] as const)
  )).flat().filter(([a, b]) => a * b <= 100 && a !== 10 && b !== 10));
  const tenFacts = shuffleWithRng(rng, Array.from({ length: 9 }, (_, index) => [index + 2, 10] as const));

  const selected: Array<readonly [number, number]> = [];
  const used = new Set<string>();
  const add = (fact: readonly [number, number]) => {
    const key = `${fact[0]}x${fact[1]}`;
    if (used.has(key) || selected.length >= 15) return;
    used.add(key);
    selected.push(fact);
  };

  hardFacts.slice(0, 5).forEach(add);
  tenFacts.slice(0, 2).forEach(add);
  mixedFacts.forEach(add);

  return shuffleWithRng(rng, selected.slice(0, 15));
}

function multiplicationQ(fact: readonly [number, number], i: number): GeneratedQuestion {
  const [left, right] = fact;
  const answer = left * right;
  const displayExpression = `${left} \u00d7 ${right}`;
  return {
    id: `mul-${left}-${right}-${i}`,
    type: 'multiplication',
    category: 'Korrutamine' as Category,
    difficulty: 'Lihtne',
    subtopic: 'korrutamine',
    question: `${displayExpression} = ?`,
    prompt: `${displayExpression} = ?`,
    left,
    right,
    operator: '\u00d7',
    correctAnswer: answer,
    displayExpression,
    explanation: `${displayExpression} = ${answer}`,
    exerciseKey: MULTIPLICATION_EXERCISE_KEY
  };
}

function generateMultiplicationSession(count: number, seed: number): GeneratedQuestion[] {
  const rng = seededRng(seed);
  return multiplicationFacts(rng).slice(0, count).map((fact, index) => multiplicationQ(fact, index));
}

function generateTextProblemSession(seed: number): GeneratedQuestion[] {
  const rng = seededRng(seed);
  return shuffleWithRng(rng, kiurTextProblemPool).slice(0, 5).map((task, index) => ({
    id: `${task.id}-${index}`,
    type: 'text-problem',
    category: 'Tekstülesanded' as Category,
    difficulty: 'Lihtne',
    question: task.question,
    prompt: task.question,
    correctAnswer: 0,
    correctAnswerText: task.answer,
    acceptedAnswers: task.acceptedAnswers,
    explanation: task.solution,
    kind: 'text',
    exerciseKey: TEXT_PROBLEM_EXERCISE_KEY
  }));
}

export function generateKiurMathSession(topic: string, category: string, difficulty: Difficulty, count: number, seed: number): GeneratedQuestion[] {
  if (isKiurLengthTopic(topic)) return generateLengthSession(category as Category, difficulty, count, seed);
  if (topic === 'korrutamine') return generateMultiplicationSession(count, seed);
  if (topic === 'tekstulesanded' || category === 'Tekstülesanded') return generateTextProblemSession(seed);
  const rng = seededRng(seed);
  const normalizedTopic = topic;
  const isBigNumbers = normalizedTopic === 'arvud-10000-piires' || normalizedTopic === 'arvud-10000';
  const topicTypes = normalizedTopic === 'jagamine-kahekohaline-uhekohaline' ? DIV_CATS : isBigNumbers ? BIG_NUM_CATS : normalizedTopic === 'ring-ja-ringjoon' ? CIRCLE_CATS : normalizedTopic === 'mustrid' ? PATTERN_CATS : null;
  if (!topicTypes) return [];
  const types = category === 'Segaharjutus' ? mixedPlan(rng, count, topicTypes) : Array.from({ length: count }, () => category as TopicCategory);
  const out: GeneratedQuestion[] = [];
  const used = new Set<string>();
  for (let i = 0; i < types.length; i++) {
    let tries = 0;
    let q: GeneratedQuestion;
    do {
      q = normalizedTopic === 'jagamine-kahekohaline-uhekohaline'
        ? divisionQ(types[i], difficulty, rng, i + tries * 17)
        : isBigNumbers
          ? bigNumberQ(types[i], difficulty, rng, i + tries * 17)
          : normalizedTopic === 'mustrid'
            ? patternQ(types[i], difficulty, rng, i + tries * 17)
            : circleQ(types[i], difficulty, rng, i + tries * 17);
      tries++;
    } while (used.has(`${q.kind}|${q.question}|${q.correctAnswer}`) && tries < 20);
    used.add(`${q.kind}|${q.question}|${q.correctAnswer}`);
    out.push({ ...q, id: `${topic}-${q.id}-${i}` });
  }
  return out;
}
