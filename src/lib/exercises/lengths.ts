import { Category, Difficulty, GeneratedQuestion, CATEGORIES } from '@/lib/types';

const id = () => crypto.randomUUID();
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]) => arr[rand(0, arr.length - 1)];

function teisendamine(difficulty: Difficulty): GeneratedQuestion {
  if (difficulty === 'Lihtne') {
    const m = rand(1, 9);
    return { id: id(), category: 'Teisendamine', difficulty, question: `Mitu sentimeetrit on ${m} m?`, expectedUnit: 'cm', correctAnswer: m * 100 };
  }
  if (difficulty === 'Keskmine') {
    const cm = rand(20, 900);
    return { id: id(), category: 'Teisendamine', difficulty, question: `Mitu meetrit on ${cm} cm?`, expectedUnit: 'm', correctAnswer: cm / 100 };
  }
  const km = rand(1, 12);
  const m = rand(100, 900);
  return { id: id(), category: 'Teisendamine', difficulty, question: `Mitu meetrit on ${km} km ${m} m?`, expectedUnit: 'm', correctAnswer: km * 1000 + m };
}

function vordlemine(difficulty: Difficulty): GeneratedQuestion {
  const a = difficulty === 'Raske' ? rand(1, 4) * 1000 : rand(40, 300);
  const b = difficulty === 'Raske' ? rand(200, 3500) : rand(20, 260);
  const unit: GeneratedQuestion['expectedUnit'] = difficulty === 'Raske' ? 'm' : 'cm';
  return { id: id(), category: 'Võrdlemine', difficulty, question: `Kui suur on vahe: ${a} ${unit} ja ${b} ${unit}?`, expectedUnit: unit, correctAnswer: Math.abs(a - b) };
}

function jarjestamine(difficulty: Difficulty): GeneratedQuestion {
  const values = [rand(20, 220), rand(20, 220), rand(20, 220)].sort((x, y) => x - y);
  const ask = pick(['lühem', 'pikem', 'keskmine']);
  const map = { lühem: values[0], keskmine: values[1], pikem: values[2] };
  return { id: id(), category: 'Järjestamine', difficulty, question: `Pikkused on ${values[0]} cm, ${values[1]} cm ja ${values[2]} cm. Kirjuta kõige ${ask} pikkus sentimeetrites.`, expectedUnit: 'cm', correctAnswer: map[ask as keyof typeof map] };
}

function arvutamine(difficulty: Difficulty): GeneratedQuestion {
  const a = rand(30, difficulty === 'Raske' ? 500 : 250);
  const b = rand(10, difficulty === 'Raske' ? 250 : 120);
  const add = Math.random() > 0.5;
  return { id: id(), category: 'Arvutamine', difficulty, question: `Leia ${add ? 'summa' : 'vahe'}: ${a} cm ${add ? '+' : '-'} ${b} cm.`, expectedUnit: 'cm', correctAnswer: add ? a + b : a - b };
}

function puuduvArv(difficulty: Difficulty): GeneratedQuestion {
  const m = rand(1, difficulty === 'Raske' ? 20 : 10);
  const forward = Math.random() > 0.5;
  return forward
    ? { id: id(), category: 'Puuduv arv', difficulty, question: `${m} m = ___ cm`, expectedUnit: 'cm', correctAnswer: m * 100 }
    : { id: id(), category: 'Puuduv arv', difficulty, question: `___ cm = ${m} m`, expectedUnit: 'cm', correctAnswer: m * 100 };
}

function umbermoot(difficulty: Difficulty): GeneratedQuestion {
  const a = rand(2, difficulty === 'Raske' ? 60 : 20);
  const b = rand(2, difficulty === 'Raske' ? 50 : 18);
  return { id: id(), category: 'Ümbermõõt', difficulty, question: `Ristküliku küljed on ${a} cm ja ${b} cm. Leia ümbermõõt.`, expectedUnit: 'cm', correctAnswer: 2 * (a + b) };
}

function tekstulesanne(difficulty: Difficulty): GeneratedQuestion {
  if (difficulty === 'Raske') {
    const km = rand(1, 5);
    const m = rand(100, 900);
    const rest = rand(100, 900);
    return { id: id(), category: 'Tekstülesanded', difficulty, question: `Raja pikkus on ${km} km ${m} m. Läbiti ${rest} m. Mitu meetrit on veel minna?`, expectedUnit: 'm', correctAnswer: km * 1000 + m - rest };
  }
  const total = rand(120, 400);
  const cut = rand(20, 110);
  return { id: id(), category: 'Tekstülesanded', difficulty, question: `Pael oli ${total} cm pikk. Ära lõigati ${cut} cm. Mitu sentimeetrit jäi?`, expectedUnit: 'cm', correctAnswer: total - cut };
}

const generators: Record<Exclude<Category, 'Segaharjutus'>, (d: Difficulty) => GeneratedQuestion> = {
  Teisendamine: teisendamine,
  Võrdlemine: vordlemine,
  Järjestamine: jarjestamine,
  Arvutamine: arvutamine,
  'Puuduv arv': puuduvArv,
  Ümbermõõt: umbermoot,
  Tekstülesanded: tekstulesanne
};

export function generateLengthExercises(category: Category, difficulty: Difficulty, count: number): GeneratedQuestion[] {
  const out: GeneratedQuestion[] = [];
  for (let i = 0; i < count; i += 1) {
    const actual = category === 'Segaharjutus' ? pick(CATEGORIES.filter((c) => c !== 'Segaharjutus') as Exclude<Category, 'Segaharjutus'>[]) : category;
    out.push(generators[actual as Exclude<Category, 'Segaharjutus'>](difficulty));
  }
  return out;
}
