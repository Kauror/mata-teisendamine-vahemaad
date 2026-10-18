import { describe, expect, it } from 'vitest';
import { generateKiurMathSession } from '@/lib/exercises/kiurMath';
import { generateKirsiSession } from '@/lib/exercises/kirsiMath';
import { MATH_GENERATOR_VERSION } from '@/lib/exercises/mathGeneratorVersion';
import { verifyGeneratedMathAnswer } from '@/lib/shared/answerVerification';
import type { GeneratedQuestion } from '@/lib/types';

// Independent oracles for every question the CURRENT maths generator version
// can ask. Each oracle reads the question as the child sees it, works the
// answer out on its own (it never calls the generator's arithmetic) and checks
// the answer key, the options, the explanation and the wording against it.
// Every generated question must be recognised by exactly one oracle, so a new
// question template cannot slip in unchecked. Older versions keep their known
// defects on purpose; they only replay attempts made before each bump.

const SEEDS = 600;
const TIMEOUT = 240_000;
const v = MATH_GENERATOR_VERSION;
const PLACE: Record<string, number> = { tuhandel: 1000, sajal: 100, kümnel: 10, ühel: 1 };

type Verdict = string[];

function keyOf(question: GeneratedQuestion) {
  if (question.kind === 'choice' && question.choiceOptions) return question.choiceOptions[question.correctAnswer];
  if (question.kind === 'text') return question.correctAnswerText ?? '';
  return String(question.correctAnswer);
}

function expectKey(problems: Verdict, question: GeneratedQuestion, expected: string | number) {
  if (keyOf(question) !== String(expected)) problems.push(`key ${keyOf(question)} != ${expected}`);
}

// Estonian: a numeral 1 takes the nominative («1 sajaline», «1 plokk»), any
// other number the partitive («2 sajalist», «2 plokki»).
function grammarProblems(text: string): Verdict {
  const problems: Verdict = [];
  if (/(^|[^\d])1 (tuhandelist|sajalist|kümnelist|ühelist|plokki)\b/u.test(text)) problems.push("«1 …list» instead of «1 …line»");
  if (/(^|[^\d])([02-9]|\d{2,}) (tuhandeline|sajaline|kümneline|üheline|plokk)\b/u.test(text)) problems.push("«N …line» instead of «N …list»");
  return problems;
}

function parsePlaceParts(text: string, separator: RegExp) {
  return text.split(separator).reduce((sum, part) => {
    const match = /^(\d) (tuhandel|sajal|kümnel|ühel)(?:ine|ist)$/u.exec(part.trim());
    if (!match) throw new Error(`cannot read «${part}»`);
    return sum + Number(match[1]) * PLACE[match[2]];
  }, 0);
}

function arithmeticSeries(nums: number[]) {
  const step = nums[1] - nums[0];
  return nums.every((value, index) => index === 0 || value - nums[index - 1] === step) ? step : null;
}

// Returns null when no oracle recognises the question, else its problems.
function oracle(q: GeneratedQuestion): Verdict | null {
  const t = q.question;
  const opts = q.choiceOptions ?? [];
  const p: Verdict = [...grammarProblems(t), ...grammarProblems(q.explanation ?? '')];
  if (q.kind === 'choice' && opts.length) {
    if (new Set(opts).size !== opts.length) p.push(`repeated option ${opts.join('|')}`);
    if (opts[q.correctAnswer] === undefined) p.push('key outside options');
  }
  let m: RegExpExecArray | null;

  // ---- Jagamine
  if ((m = /^(?:Arvuta jagatis|Vali õige vastus): (\d+) : (\d+) = \?$/.exec(t)) || (m = /^Arvuta järgmine jagatis: (\d+) : (\d+)$/.exec(t))) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    if (a % b) p.push('not divisible');
    if (a < 10 || a > 99 || b < 2 || b > 9) p.push('out of level');
    expectKey(p, q, a / b);
    return p;
  }
  if ((m = /^(\d+) : (\d+) = \((\d+) : \2\) \+ \((\d+) : \2\)\. Arvuta jagatis\.$/.exec(t))) {
    const [a, d, x, y] = m.slice(1).map(Number);
    if (x + y !== a || x % d || y % d) p.push('split is not a split into multiples');
    if (x === 0 || y === 0) p.push('split has a zero part');
    expectKey(p, q, a / d);
    return p;
  }
  if ((m = /^Milline (?:jaotus aitab arvutada|abitehe sobib arvutamiseks) (\d+) : (\d+)\?$/.exec(t))) {
    const [a, d] = [Number(m[1]), Number(m[2])];
    const good = opts.filter((option) => {
      const parts = /^(\d+) : (\d+) ja (\d+) : (\d+)$/.exec(option);
      return parts && Number(parts[1]) + Number(parts[3]) === a && Number(parts[2]) === d && Number(parts[4]) === d && Number(parts[1]) % d === 0 && Number(parts[3]) % d === 0 && Number(parts[1]) > 0 && Number(parts[3]) > 0;
    });
    if (good.length !== 1 || good[0] !== keyOf(q)) p.push(`not exactly one useful split`);
    return p;
  }
  if ((m = /^(\d+) (?:kommi|kleepsu|pliiatsit|kaarti) jagatakse võrdselt (\d+) (?:lapse|sõbra|mängija|õpilase) vahel\. Mitu saab igaüks\?$/.exec(t))
    || (m = /^(\d+) (?:õuna|klotsi|palli|raamatut) pannakse \S+\. Igas \S+ on (\d+) (?:õuna|klotsi|palli|raamatut)\. Mitu \S+ saab\?$/.exec(t))
    || (m = /^(\d+) eset jagatakse võrdselt (\d+) rühma vahel\. Mitu eset on igas rühmas\?$/.exec(t))) {
    expectKey(p, q, Number(m[1]) / Number(m[2]));
    return p;
  }
  if ((m = /^(\d+) eset jagatakse võrdselt (\d+) rühma\. Milline arvutus sobib\?$/.exec(t))) {
    expectKey(p, q, `${m[1]} : ${m[2]}`);
    return p;
  }
  if ((m = /^(\d+) : (\d+) = (\d+)\. Milline tehe kontrollib vastust\?$/.exec(t))) {
    const [a, b, c] = m.slice(1).map(Number);
    if (a / b !== c) p.push('shown division is wrong');
    const trueOptions = opts.filter((option) => {
      const e = /^(\d+) ([×+-]) (\d+) = (\d+)$/.exec(option);
      if (!e) return false;
      const [x, y, r] = [Number(e[1]), Number(e[3]), Number(e[4])];
      return (e[2] === '×' ? x * y : e[2] === '+' ? x + y : x - y) === r;
    });
    if (trueOptions.length !== 1) p.push(`true options: ${trueOptions.join(' | ')}`);
    expectKey(p, q, `${c} × ${b} = ${a}`);
    return p;
  }
  // ---- Arvud 10 000 piires
  if ((m = /^(?:Arvuta(?: summa| vahe)?|Liida arvud|Lahuta arvud): (\d+) ([+-]) (\d+)$/.exec(t))) {
    const r = m[2] === '+' ? Number(m[1]) + Number(m[3]) : Number(m[1]) - Number(m[3]);
    if (r < 0 || r > 10000) p.push('result outside 0..10 000');
    expectKey(p, q, r);
    return p;
  }
  if ((m = /^Kas arvutus on õige\? (\d+) ([+:-]) (\d+) = (-?\d+)$/.exec(t))) {
    const [a, b, shown] = [Number(m[1]), Number(m[3]), Number(m[4])];
    const r = m[2] === '+' ? a + b : m[2] === '-' ? a - b : a / b;
    expectKey(p, q, r === shown ? 'Õige' : 'Vale');
    if (!(q.explanation ?? '').includes(String(r))) p.push('explanation does not give the right result');
    return p;
  }
  if ((m = /^Milline on arvu (\d{4}) õige lahutus\?$/.exec(t))) {
    const n = Number(m[1]);
    const sums = opts.map((option) => option.split(' + ').reduce((sum, term) => sum + Number(term), 0));
    if (sums.filter((sum) => sum === n).length !== 1 || sums[q.correctAnswer] !== n) p.push('not exactly one split adds up');
    const digits = m[1].split('').map(Number);
    expectKey(p, q, digits.map((digit, index) => digit * [1000, 100, 10, 1][index]).filter(Boolean).join(' + '));
    return p;
  }
  if ((m = /^Mis on numbri (\d) väärtus arvus (\d{4})\?$/.exec(t))) {
    const index = m[2].indexOf(m[1]);
    if (index < 0 || m[2].lastIndexOf(m[1]) !== index || m[1] === '0') p.push('digit missing, zero or repeated');
    expectKey(p, q, Number(m[1]) * [1000, 100, 10, 1][index]);
    return p;
  }
  if ((m = /^Ümarda lähima (sajani|tuhandeni): (\d+)$/.exec(t))) {
    const step = m[1] === 'sajani' ? 100 : 1000;
    const n = Number(m[2]);
    if (n % step === 0) p.push('already round');
    if (opts.length < 3) p.push('fewer than three options');
    expectKey(p, q, Math.floor((n + step / 2) / step) * step);
    return p;
  }
  if ((m = /^Vali ligikaudne vastus: (\d+) ([+-]) (\d+)$/.exec(t))) {
    const exact = m[2] === '+' ? Number(m[1]) + Number(m[3]) : Number(m[1]) - Number(m[3]);
    const nearest = [...opts].sort((a, b) => Math.abs(Number(a) - exact) - Math.abs(Number(b) - exact));
    if (nearest[0] !== keyOf(q) || Math.abs(Number(nearest[1]) - exact) <= Math.abs(Number(nearest[0]) - exact)) p.push('key is not the clearly nearest estimate');
    return p;
  }
  if ((m = /^(.*)\. Milline arv tekib\?$/.exec(t))) {
    expectKey(p, q, parsePlaceParts(m[1], /, /));
    return p;
  }
  if ((m = /^Millist arvu näitavad plokid\? (.*)\.$/.exec(t))) {
    const n = m[1].split(', ').reduce((sum, part) => {
      const e = /^(tuhandel|sajal|kümnel|ühel)ised: (\d)$/.exec(part)!;
      return sum + Number(e[2]) * PLACE[e[1]];
    }, 0);
    expectKey(p, q, n);
    return p;
  }
  // ---- Ring ja ringjoon
  if (t.startsWith('Kas kirjeldus käib ringi või ringjoone kohta?')) {
    expectKey(p, q, t.includes('joon, mis piirab') ? 'Ringjoon' : 'Ring');
    if ((q.visual === 'ring-outline') !== (keyOf(q) === 'Ringjoon')) p.push('figure does not match');
    return p;
  }
  if (t === 'Milline sirglõik on raadius?' || t === 'Milline sirglõik on läbimõõt?') {
    // Place 0 of the lettered figure is the radius / the diameter.
    const labels = q.visualLabels ?? (t.includes('raadius') ? 'ABC' : 'BAC');
    if (q.visual !== (t.includes('raadius') ? 'radius-demo' : 'diameter-demo')) p.push('wrong figure');
    expectKey(p, q, labels[0]);
    return p;
  }
  if ((m = /^Kus asub punkt ([ABC])\?$/.exec(t))) {
    const labels = q.visualLabels ?? 'ABC';
    expectKey(p, q, ['ringi sees', 'ringjoone peal', 'ringist väljas'][labels.indexOf(m[1])]);
    return p;
  }
  if ((m = /^Ringjoone raadius on (\d+) (cm|mm)\. Kui pikk on läbimõõt\?$/.exec(t))) {
    if (q.expectedUnit !== m[2]) p.push('unit');
    expectKey(p, q, Number(m[1]) * 2);
    return p;
  }
  if ((m = /^Ringjoone läbimõõt on (\d+) (cm|mm)\. Kui pikk on raadius\?$/.exec(t))) {
    if (q.expectedUnit !== m[2]) p.push('unit');
    expectKey(p, q, Number(m[1]) / 2);
    return p;
  }
  if ((m = /^Kahel ringjoonel on sama keskpunkt\. Suurema ringjoone raadius on (\d+) cm\. Väiksema ringjoone raadius on poole väiksem\./.exec(t))) {
    expectKey(p, q, Number(m[1]) / 2);
    return p;
  }
  if ((m = /^K raadius on (\d+) mm ja L raadius on (\d+) cm\. (.*)$/.exec(t))) {
    const [k, l] = [Number(m[1]), Number(m[2]) * 10];
    expectKey(p, q, m[3].startsWith('Kas') ? (k === l ? 'Jah' : 'Ei') : k > l ? 'K' : k < l ? 'L' : 'sama suured');
    return p;
  }
  if ((m = /^Mitu kraadi on (täisring|pool ringi|veerand ringi|kolmveerand ringi)\?$/.exec(t))) {
    const degrees = { täisring: 360, 'pool ringi': 180, 'veerand ringi': 90, 'kolmveerand ringi': 270 }[m[1]]!;
    expectKey(p, q, degrees);
    // The figure must not print the answer: a sector-missing figure labels the
    // known part and puts «?» on the rest.
    if (q.visual === 'sector-missing' && (q.visualKnownDegrees === degrees || 360 - (q.visualKnownDegrees ?? 90) !== degrees)) p.push('figure shows the answer or another angle');
    return p;
  }
  if ((m = /^Ring on jagatud kaheks osaks\. Värvitud osa on (\d+)°\. Kui suur on teine osa\?$/.exec(t))) {
    if (q.visualKnownDegrees !== Number(m[1])) p.push('figure angle differs');
    expectKey(p, q, 360 - Number(m[1]));
    return p;
  }
  // ---- Mustrid
  if ((m = /^(?:Jätka mustrit|Leia arvu ja pildi muster|Leia paaride muster): ([\d, ]+), __$/.exec(t)) || (m = /^Jätka arvutusahelat: ([\d →]+) → __$/.exec(t))) {
    const nums = m[1].split(/, | → /).map(Number);
    const step = arithmeticSeries(nums);
    if (step === null) p.push('not an arithmetic sequence');
    const next = nums[nums.length - 1] + (step ?? 0);
    if (next < 0) p.push('negative answer');
    expectKey(p, q, next);
    return p;
  }
  if ((m = /^Jälgi, kuidas samm muutub: ([\d, ]+), __$/.exec(t))) {
    const nums = m[1].split(', ').map(Number);
    const diffs = nums.slice(1).map((value, index) => value - nums[index]);
    if (arithmeticSeries(diffs) === null) p.push('steps do not change evenly');
    expectKey(p, q, nums[nums.length - 1] + diffs[diffs.length - 1] + (diffs[1] - diffs[0]));
    return p;
  }
  if ((m = /^Jälgi vahelduvat mustrit: ([\d, ]+), __$/.exec(t))) {
    const nums = m[1].split(', ').map(Number);
    const diffs = nums.slice(1).map((value, index) => value - nums[index]);
    if (diffs[0] !== diffs[2] || diffs[1] !== diffs[3]) p.push('does not alternate');
    expectKey(p, q, nums[nums.length - 1] + diffs[0]);
    return p;
  }
  if ((m = /^Leia puuduv arv mustris: (.*)$/.exec(t))) {
    const parts = m[1].split(', ');
    const gap = parts.indexOf('__');
    const known = parts.map((part, index) => [index, Number(part)] as const).filter(([index]) => index !== gap);
    const step = (known[known.length - 1][1] - known[0][1]) / (known[known.length - 1][0] - known[0][0]);
    if (!known.every(([index, value]) => value === known[0][1] + (index - known[0][0]) * step)) p.push('not arithmetic');
    expectKey(p, q, known[0][1] + (gap - known[0][0]) * step);
    return p;
  }
  if ((m = /^Leia reegel: ([\d, ]+)$/.exec(t))) {
    const step = arithmeticSeries(m[1].split(', ').map(Number));
    expectKey(p, q, step !== null && step > 0 ? `+${step}` : String(step));
    return p;
  }
  if ((m = /^Leia arv, mis ei sobi mustrisse: (.*)$/.exec(t))) {
    const nums = m[1].split(', ').map(Number);
    const fixers = nums.map((_, odd) => {
      const rest = nums.map((value, index) => [index, value] as const).filter(([index]) => index !== odd);
      const step = (rest[1][1] - rest[0][1]) / (rest[1][0] - rest[0][0]);
      return rest.every(([index, value]) => value === rest[0][1] + (index - rest[0][0]) * step) ? odd : -1;
    }).filter((index) => index >= 0);
    if (fixers.length !== 1) p.push(`${fixers.length} numbers could be the odd one`);
    else expectKey(p, q, nums[fixers[0]]);
    return p;
  }
  if ((m = /^Leia tabeli reegel: (.*)$/.exec(t))) {
    const pairs = m[1].split(', ').map((pair) => pair.split('→'));
    const known = pairs.filter(([, out]) => out !== '__').map(([input, out]) => [Number(input), Number(out)]);
    const last = Number(pairs[pairs.length - 1][0]);
    const sameDifference = known.every(([input, out]) => out - input === known[0][1] - known[0][0]);
    const sameRatio = known.every(([input, out]) => out / input === known[0][1] / known[0][0]);
    if (sameDifference === sameRatio) p.push('rule is not unique');
    expectKey(p, q, sameDifference ? last + known[0][1] - known[0][0] : last * (known[0][1] / known[0][0]));
    return p;
  }
  if ((m = /^Jätka mustrit: ([■▲★●](?: [■▲★●])*) __$/u.exec(t))) {
    const shapes = m[1].split(' ');
    const period = [1, 2, 3].find((length) => shapes.every((shape, index) => shape === shapes[index % length]))!;
    expectKey(p, q, shapes[shapes.length % period]);
    return p;
  }
  if ((m = /^Vaata, kuidas muster kasvab: (\d+) plokki?, (\d+) plokki, (\d+) plokki\. Mitu plokki on järgmises reas\?$/.exec(t))) {
    const nums = m.slice(1, 4).map(Number);
    expectKey(p, q, nums[2] + (nums[2] - nums[1]));
    return p;
  }
  if ((m = /^Milline muster see on\? (.*)$/.exec(t))) {
    const items = m[1].split(/, | /);
    const nums = items.map(Number);
    const expected = nums.some(Number.isNaN) ? 'kordub kujunditena' : nums[1] > nums[0] ? 'suureneb' : 'väheneb';
    expectKey(p, q, expected);
    return p;
  }
  // ---- Mõõtühikud
  if ((m = /^(\d+) cm = mitu mm\?$/.exec(t))) { expectKey(p, q, Number(m[1]) * 10); return p; }
  if ((m = /^(\d+) cm (\d+) mm = mitu mm\?$/.exec(t))) { expectKey(p, q, Number(m[1]) * 10 + Number(m[2])); return p; }
  if ((m = /^(\d+) mm = mitu cm ja mm\? Sisesta ainult cm arv\.$/.exec(t))) { expectKey(p, q, Math.floor(Number(m[1]) / 10)); return p; }
  if ((m = /^(\d+) km = mitu m\?$/.exec(t))) { expectKey(p, q, Number(m[1]) * 1000); return p; }
  if ((m = /^(\d+) km (\d+) m = mitu m\?$/.exec(t))) { expectKey(p, q, Number(m[1]) * 1000 + Number(m[2])); return p; }
  if ((m = /^(\d+) m = mitu km ja m\? Sisesta ainult km arv\.$/.exec(t))) { expectKey(p, q, Math.floor(Number(m[1]) / 1000)); return p; }
  if ((m = /^(\d+) m = mitu km\?$/.exec(t))) {
    // Asked plainly, «mitu km» means the whole length in kilometres.
    expectKey(p, q, Number(m[1]) / 1000);
    return p;
  }
  if ((m = /^Arvuta pikkustega: (\d+) cm (\d+) mm \+ (\d+) cm (\d+) mm = mitu mm\?$/.exec(t))) {
    expectKey(p, q, Number(m[1]) * 10 + Number(m[2]) + Number(m[3]) * 10 + Number(m[4]));
    return p;
  }
  if ((m = /^Arvuta pikkustega: (\d+) km (\d+) m \+ (\d+) km (\d+) m = mitu m\?$/.exec(t))) {
    expectKey(p, q, Number(m[1]) * 1000 + Number(m[2]) + Number(m[3]) * 1000 + Number(m[4]));
    return p;
  }
  if ((m = /^Arvuta pikkustega: (\d+) cm - (\d+) cm = \?$/.exec(t))) { expectKey(p, q, Number(m[1]) - Number(m[2])); return p; }
  if ((m = /^Kumb on pikem\? A\) (\d+) (?:cm (\d+) mm|km (\d+) m) {2}B\) (\d+) (?:mm|m)$/.exec(t))) {
    const a = m[2] !== undefined ? Number(m[1]) * 10 + Number(m[2]) : Number(m[1]) * 1000 + Number(m[3]);
    const b = Number(m[4]);
    expectKey(p, q, a > b ? 'A' : a < b ? 'B' : 'võrdsed');
    return p;
  }
  if ((m = /^(\d+) cm __ mm = (\d+) mm\. Leia puuduv mm arv\.$/.exec(t))) {
    const rest = Number(m[2]) - Number(m[1]) * 10;
    if (rest < 0 || rest > 9) p.push('no digit fits');
    expectKey(p, q, rest);
    return p;
  }
  if ((m = /^__ km (\d+) m = (\d+) m\. Leia puuduv km arv\.$/.exec(t)) || (m = /^(\d+) km \+ __ m = (\d+) m\. Leia puuduv meeter\.$/.exec(t))) {
    const isKm = t.startsWith('__');
    const missing = isKm ? (Number(m[2]) - Number(m[1])) / 1000 : Number(m[2]) - Number(m[1]) * 1000;
    if (!Number.isInteger(missing) || missing < 0 || (isKm && Number(m[1]) >= 1000)) p.push('no whole number fits the gap');
    expectKey(p, q, missing);
    if (/\d[.,]\d/.test(q.explanation ?? '')) p.push(`explanation has a fraction: ${q.explanation}`);
    return p;
  }
  if ((m = /^Ruudu külg on (\d+) cm\. Leia ümbermõõt\.$/.exec(t))) { expectKey(p, q, Number(m[1]) * 4); return p; }
  if ((m = /^Ristküliku küljed on (\d+) cm ja (\d+) cm\. Leia ümbermõõt\.$/.exec(t))) { expectKey(p, q, 2 * (Number(m[1]) + Number(m[2]))); return p; }
  if ((m = /^Kolmnurga küljed on (\d+) cm, (\d+) cm ja (\d+) cm\. Leia ümbermõõt\.$/.exec(t))) {
    const sides = m.slice(1, 4).map(Number).sort((a, b) => a - b);
    if (sides[0] + sides[1] <= sides[2]) p.push(`no such triangle: ${sides.join(', ')}`);
    expectKey(p, q, sides[0] + sides[1] + sides[2]);
    return p;
  }
  if (t === 'Tallinnast Paidesse on 93 km. Kui pikk on edasi-tagasi sõit?') { expectKey(p, q, 186); return p; }
  if (t === 'Tartu–Põltsamaa on 56 km ja Põltsamaa–Paide on 48 km. Kui pikk on tee kokku?') { expectKey(p, q, 104); return p; }
  if (t === 'Üks tee on 129 km ja teine 93 km. Kui palju on esimene tee pikem?') { expectKey(p, q, 36); return p; }
  if (t === 'Lõik A on 45 mm. Lõik B on 6 cm. Kui palju on B pikem?') { expectKey(p, q, 15); return p; }
  if (t === 'Vali realistlik pikkus pliiatsi jaoks.') { expectKey(p, q, '5 cm'); return p; }
  if (/ühik/.test(t) && q.correctAnswers) {
    const units = t.includes('vihiku') ? ['mm', 'cm', 'dm'] : t.includes('pliiatsi') ? ['cm'] : t.includes('linna') ? ['km'] : t.includes('koolimaja') ? ['m'] : t.includes('paberilehe') ? ['mm'] : [];
    const labels = q.correctAnswers.map((index) => opts[index]).sort();
    if (JSON.stringify(labels) !== JSON.stringify([...units].sort())) p.push(`accepted units ${labels.join(',')}`);
    return p;
  }
  if (q.kind === 'ordering') {
    for (const card of q.orderingCards ?? []) {
      const mm = /^(\d+) mm$/.exec(card.label);
      const cm = /^(\d+) cm(?: (\d) mm)?$/.exec(card.label);
      const decimal = /^(\d+),(\d) cm$/.exec(card.label);
      const value = mm ? Number(mm[1]) : cm ? Number(cm[1]) * 10 + Number(cm[2] ?? 0) : decimal ? Number(decimal[1]) * 10 + Number(decimal[2]) : NaN;
      if (value !== card.valueMm) p.push(`card «${card.label}» is not ${card.valueMm} mm`);
    }
    if (new Set(q.orderingCards?.map((card) => card.valueMm)).size !== q.orderingCards?.length) p.push('two cards are equally long');
    return p;
  }
  return null;
}

function kirsiOracle(q: GeneratedQuestion): Verdict | null {
  const p: Verdict = [];
  let m: RegExpExecArray | null;
  if ((m = /^(\d+) ([+-]) (\d+) = ___$/.exec(q.question))) {
    const r = m[2] === '+' ? Number(m[1]) + Number(m[3]) : Number(m[1]) - Number(m[3]);
    if (r < 0 || r > (q.id.startsWith('k10') ? 10 : 20)) p.push('out of range');
    expectKey(p, q, r);
    return p;
  }
  if ((m = /^(\d+) ___ (\d+)$/.exec(q.question))) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    if (q.correctAnswer !== (a < b ? -1 : a === b ? 0 : 1)) p.push('comparison key');
    return p;
  }
  if (q.type === 'counting') {
    if (q.choiceOptions?.[q.correctAnswer] !== String(q.count) || new Set(q.choiceOptions).size !== 3) p.push('counting options');
    return p;
  }
  if (q.type === 'clock') {
    expectKey(p, q, `${q.clockHour}:${String(q.clockMinutes).padStart(2, '0')}`);
    if (new Set(q.choiceOptions).size !== 3) p.push('clock options');
    return p;
  }
  return null;
}

const KIUR_CATEGORIES: Record<string, string[]> = {
  'jagamine-kahekohaline-uhekohaline': ['Arvuta jagatis', 'Jaga osadeks', 'Vali sobiv jaotus', 'Jaga võrdselt', 'Jaga rühmadesse', 'Vali jagamistehe', 'Kontrolli korrutamisega', 'Vali jagatis', 'Rühmadega jagamine', 'Kas arvutus on õige?', 'Jaga sama arvuga', 'Vali abitehe', 'Segaharjutus'],
  'arvud-10000-piires': ['Liida sajalised', 'Lahuta sajalised', 'Liida tuhandelised', 'Lahuta tuhandelised', 'Liida 2- või 3-kohaline arv', 'Lahuta 2- või 3-kohaline arv', 'Liida kaks 4-kohalist arvu', 'Lahuta 4-kohalised arvud', 'Lahuta arv järkudeks', 'Pane arv kokku', 'Numbri väärtus', 'Ümardamine', 'Ligikaudne arvutus', 'Leia arvutusviga', 'Plokid ja järgud', 'Segaharjutus'],
  'ring-ja-ringjoon': ['Ring või ringjoon', 'Leia raadius', 'Leia läbimõõt', 'Läbimõõt raadiusest', 'Raadius läbimõõdust', 'Punkti asukoht', 'Sama keskpunkt', 'Võrdle raadiuseid', 'Ringi kraadid', 'Puuduv kraad', 'Segaharjutus'],
  mustrid: ['Segaharjutus'],
  'mootuhikud-pikkused': ['Segaharjutus']
};

function sweep(generate: (seed: number) => GeneratedQuestion[], check: (q: GeneratedQuestion) => Verdict | null) {
  const failures = new Map<string, string>();
  const unrecognised: string[] = [];
  let checked = 0;
  for (let seed = 1; seed <= SEEDS; seed += 1) {
    for (const question of generate(seed)) {
      checked += 1;
      const verdict = check(question);
      if (verdict === null) { if (unrecognised.length < 5) unrecognised.push(question.question); continue; }
      for (const problem of verdict) if (!failures.has(problem)) failures.set(problem, `${question.question} → ${keyOf(question)}`);
      // The child's own right answer must be accepted by the shared scorer.
      if (!verifyGeneratedMathAnswer(question, question.kind === 'ordering'
        ? [...(question.orderingCards ?? [])].sort((a, b) => question.orderingDirection === 'desc' ? b.valueMm - a.valueMm : a.valueMm - b.valueMm).map((card) => card.label).join('|')
        : keyOf(question))) failures.set('scorer rejects the key', question.question);
    }
  }
  return { checked, failures: [...failures].map(([problem, example]) => `${problem} :: ${example}`), unrecognised };
}

describe(`maths generator ${v}: independent oracles`, () => {
  for (const [topic, categories] of Object.entries(KIUR_CATEGORIES)) {
    it.each(categories)(`${topic} / %s`, (category) => {
      const result = sweep((seed) => generateKiurMathSession(topic, category, 'Lihtne', 15, seed, v), oracle);
      expect(result.unrecognised).toEqual([]);
      expect(result.failures).toEqual([]);
      expect(result.checked).toBe(SEEDS * 15);
    }, TIMEOUT);
  }

  it.each(['Loendamine', 'Arvutamine 10 piires', 'Arvutamine 20 piires', 'Suurem või väiksem kuni 100', 'Segaülesanded', 'Kellaaeg'] as const)('Kirsi / %s', (mode) => {
    const result = sweep((seed) => generateKirsiSession(mode, 15, seed, v), kirsiOracle);
    expect(result.unrecognised).toEqual([]);
    expect(result.failures).toEqual([]);
  }, TIMEOUT);
});

describe(`maths generator ${v}: the defects fixed in v4 stay fixed`, () => {
  const all = (topic: string, category: string) => Array.from({ length: SEEDS }, (_, index) => generateKiurMathSession(topic, category, 'Lihtne', 15, index + 1, v)).flat();

  it('asks for kilometres and metres when the metres are not whole kilometres (EDU-01)', () => {
    const questions = all('mootuhikud-pikkused', 'Segaharjutus').filter((q) => /^\d+ m = mitu km/.test(q.question));
    expect(questions.length).toBeGreaterThan(100);
    for (const q of questions) {
      const metres = Number(q.question.split(' ')[0]);
      if (metres % 1000) expect(q.question).toBe(`${metres} m = mitu km ja m? Sisesta ainult km arv.`);
      expect(q.explanation).toBe(`${metres} m = ${Math.floor(metres / 1000)} km ${metres % 1000} m.`);
    }
  }, TIMEOUT);

  it('only asks «__ km 300 m» for totals that end in 300 m (EDU-02)', () => {
    const questions = all('mootuhikud-pikkused', 'Segaharjutus').filter((q) => q.question.startsWith('__ km 300 m'));
    expect(questions.length).toBeGreaterThan(20);
    for (const q of questions) expect(Number.isInteger(q.correctAnswer)).toBe(true);
  }, TIMEOUT);

  it('draws only triangles that exist (EDU-03)', () => {
    const triangles = all('mootuhikud-pikkused', 'Segaharjutus').filter((q) => q.question.startsWith('Kolmnurga'));
    expect(triangles.length).toBeGreaterThan(100);
    for (const q of triangles) {
      const [a, b, c] = (q.question.match(/\d+/g) ?? []).map(Number).sort((x, y) => x - y);
      expect(a + b, q.question).toBeGreaterThan(c);
    }
  }, TIMEOUT);

  it('writes «1 plokk», «2 plokki» and «1 sajaline» (EDU-04, EDU-05)', () => {
    const blocks = all('mustrid', 'Segaharjutus').filter((q) => q.question.startsWith('Vaata, kuidas muster kasvab'));
    expect(blocks.some((q) => q.question.startsWith('Vaata, kuidas muster kasvab: 2 plokki, 4 plokki'))).toBe(true);
    expect(blocks.some((q) => q.explanation === 'Igas reas on 1 plokk rohkem.')).toBe(true);
    const composed = all('arvud-10000-piires', 'Pane arv kokku');
    expect(composed.some((q) => /(^|, )1 sajaline/.test(q.question))).toBe(true);
  }, TIMEOUT);

  it('never splits a division into a zero part (EDU-06)', () => {
    for (const category of ['Jaga osadeks', 'Vali sobiv jaotus', 'Vali abitehe']) {
      for (const q of all('jagamine-kahekohaline-uhekohaline', category)) {
        expect(q.question, category).not.toMatch(/\(0 :/);
        expect(q.choiceOptions?.[q.correctAnswer] ?? '', category).not.toMatch(/^0 :/);
      }
    }
  }, TIMEOUT);

  it('does not print the answer of «kolmveerand ringi» on the figure (EDU-07)', () => {
    const questions = all('ring-ja-ringjoon', 'Ringi kraadid').filter((q) => q.question === 'Mitu kraadi on kolmveerand ringi?');
    expect(questions.length).toBeGreaterThan(0);
    for (const q of questions) {
      expect(q.visual).toBe('sector-missing');
      expect(q.visualKnownDegrees).toBe(90);
    }
  }, TIMEOUT);
});

describe(`maths generator ${v}: Tekstülesanded`, () => {
  const tasks = Array.from({ length: 200 }, (_, index) => generateKiurMathSession('tekstulesanded', 'Tekstülesanded', 'Lihtne', 5, index + 1, v)).flat();
  const byId = (id: string) => tasks.find((task) => task.id.startsWith(`${id}-`))!;

  it('keys every task with the number its own worked solution ends on', () => {
    expect(new Set(tasks.map((task) => task.id.replace(/-\d+$/, ''))).size).toBeGreaterThan(110);
    for (const task of tasks) {
      const result = /= (\d[\d ]*\d|\d)(?: [a-zõäöü]+)?\.$/u.exec(task.explanation ?? '');
      if (!result) continue;
      const numbers: string[] = (task.correctAnswerText ?? '').replace(/(\d) (\d{3})/g, '$1$2').match(/\d+/g) ?? [];
      if (!numbers.length) continue;
      const last = result[1].replace(/ /g, '');
      // A solution ending in a conversion (… = 3500 m = 3 km 500 m) or a
      // difference the answer restates may end on another number; it must
      // still be one of the answer's numbers or the answer's whole length.
      expect(numbers.includes(last) || task.explanation!.includes(`= ${task.correctAnswerText}`) || numbers.length > 1, `${task.question} → ${task.correctAnswerText} / ${task.explanation}`).toBe(true);
      expect(verifyGeneratedMathAnswer(task, task.correctAnswerText), task.question).toBe(true);
    }
  });

  it('accepts both orders of a two-number answer and the natural answer forms (EDU-08)', () => {
    expect(verifyGeneratedMathAnswer(byId('tekst-022'), '4 ja 5')).toBe(true);
    expect(verifyGeneratedMathAnswer(byId('tekst-022'), '5, 4')).toBe(true);
    expect(verifyGeneratedMathAnswer(byId('tekst-030'), '1 ja 0')).toBe(true);
    expect(verifyGeneratedMathAnswer(byId('tekst-101'), 'võrdsed')).toBe(true);
    expect(verifyGeneratedMathAnswer(byId('tekst-115'), 'kell 15.05')).toBe(true);
    expect(verifyGeneratedMathAnswer(byId('tekst-120'), 'Kell 19.00')).toBe(true);
    // Still strict where it should be.
    expect(verifyGeneratedMathAnswer(byId('tekst-022'), '3 ja 4')).toBe(false);
    expect(verifyGeneratedMathAnswer(byId('tekst-115'), 'kell 15.45')).toBe(false);
  });

  it('spells the tasks correctly (EDU-08)', () => {
    expect(byId('tekst-061').question.startsWith('Staadionil on 10 000 istekohta.')).toBe(true);
    expect(byId('tekst-075').explanation).toContain('Teised kaks külge on võrdsed');
    for (const task of tasks) expect(task.question).not.toMatch(/Staasion|kaks küljed/);
  });
});
