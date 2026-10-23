// Kaardimäng question engine: builds a frozen round for one map view and
// grades answers. Pure (no database, no React): the server freezes what
// buildRound returns and the browser only ever sees toClientQuestion's view.
//
// It is deliberately separate from the textbook's six answer types: a map
// question's target is a stable id (country, capital, continent, world part,
// ocean or point), never a name string or a pixel position.

import { CATALOG, countryWithCapital, findCountry, nameOf, quizCapital, viewCountries } from '@/content/kaardimang/catalog';
import { CONTINENTS, COUNTIES, OCEANS, SEAS, WORLD_PARTS, findCounty, findSea, type County, type LevelId, type MapViewDef, type WorldSetId } from '@/content/kaardimang/regions';
import type { CatalogCountry } from '@/content/kaardimang/types';
import { shuffleWithRng, type RNG as Rng } from '@/lib/random';

const shuffle = <T,>(items: T[], rng: Rng): T[] => shuffleWithRng(rng, items);

export type QuestionKind =
  | 'find_country' | 'name_highlighted' | 'capital_of_country' | 'country_of_capital'
  | 'find_continent' | 'find_world_part' | 'find_ocean' | 'find_point'
  | 'find_county' | 'name_highlighted_county' | 'centre_of_county' | 'county_of_centre' | 'find_sea';
export type TargetType = 'country' | 'capital' | 'continent' | 'worldPart' | 'ocean' | 'point' | 'county' | 'countyCentre' | 'sea';

export type FrozenQuestion = {
  id: string;
  kind: QuestionKind;
  answering: 'map' | 'buttons';
  targetType: TargetType;
  targetId: string;
  // Mastery key: 'country:EST', 'capital:EST', 'ocean:pacific', …
  targetKey: string;
  answerId: string;
  prompt: string;
  options: Array<{ id: string; label: string }> | null;
  highlightId: string | null;
  // A capital-name question must not show that capital's label on the map.
  hideCapitalId: string | null;
  hintEt: string;
  explainEt: string;
};

export type QuestionState = {
  attempts: number;
  wrongIds: string[];
  removedOptionIds: string[];
  resolved: null | 'correct' | 'revealed';
  firstTry: boolean | null;
  // Competition timing (server clock): when the question first appeared on
  // screen, and when it was answered. Absent in rounds from before 23.10.
  shownAt?: string;
  resolvedAt?: string;
};

export type RoundState = { questions: FrozenQuestion[]; states: QuestionState[]; cursor: number };

export type TargetStat = { seen: number; firstTryCorrect: number; missCount: number };

// What a view's map file says about places, for hints and tap fairness.
export type ViewGeometry = {
  width: number;
  height: number;
  labels: Record<string, [number, number, number]>;
  markers: Array<{ id: string; x: number; y: number }>;
};

export type RoundSpec = { view: MapViewDef; setId: WorldSetId | null; level: LevelId };

export const ROUND_LENGTH = 8;
const MAX_PER_TARGET = 2;

/* ------------------------------------------------------------------ hints */

// One-line facts about the Maailm and Antarktika places; hints in Mängi, facts in Uuri.
export const PLACE_HINTS: Record<string, string> = {
  'continent:eurasia': 'Euraasia on kõige suurem manner – sinna kuuluvad nii Euroopa kui ka Aasia.',
  'continent:africa': 'Aafrika asub Euroopast lõunas, seda läbib ekvaator.',
  'continent:north-america': 'Põhja-Ameerika asub põhjapoolkeral, Atlandi ookeanist läänes.',
  'continent:south-america': 'Lõuna-Ameerika asub Põhja-Ameerikast lõunas; neid ühendab kitsas maakitsus.',
  'continent:australia': 'Austraalia on kõige väiksem manner, Aasiast kagus.',
  'continent:antarctica': 'Antarktis asub lõunapooluse ümber.',
  'worldPart:europe': 'Euroopa asub Euraasia mandri lääneosas.',
  'worldPart:asia': 'Aasia on kõige suurem maailmajagu, Euroopast idas.',
  'worldPart:africa': 'Aafrika asub Euroopast lõunas.',
  'worldPart:americas': 'Ameerika hõlmab kahte mandrit: Põhja- ja Lõuna-Ameerikat.',
  'worldPart:oceania': 'Austraalia ja Okeaania asub Aasiast kagus, Vaikses ookeanis.',
  'worldPart:antarctica': 'Antarktika asub kaardi kõige alumises servas.',
  'ocean:pacific': 'Vaikne ookean on kõige suurem – see on kaardi mõlemal serval.',
  'ocean:atlantic': 'Atlandi ookean jääb Ameerika ning Euroopa ja Aafrika vahele.',
  'ocean:indian': 'India ookean on Aafrikast idas ja Austraaliast läänes.',
  'ocean:arctic': 'Põhja-Jäämeri on põhjapooluse ümber.',
  'ocean:southern': 'Lõuna-Jäämeri ümbritseb Antarktist.',
  'point:south-pole': 'Lõunapoolus on Antarktise keskel.',
  'sea:baltic': 'Läänemeri on Eesti kõrval, Skandinaavia ja ülejäänud Euroopa vahel.',
  'sea:north': 'Põhjameri jääb Suurbritannia ja Skandinaavia vahele.',
  'sea:mediterranean': 'Vahemeri on Euroopa ja Aafrika vahel.',
  'sea:finland': 'Soome laht on Eesti ja Soome vahel.',
  'sea:bengal': 'Bengali laht on Indiast idas.',
  'sea:guinea': 'Guinea laht on Aafrika lääneranniku all, ekvaatori lähedal.',
  'sea:persian': 'Pärsia laht on Araabia poolsaare ja Iraani vahel.',
  'sea:black': 'Must meri jääb Ukraina ja Türgi vahele.',
  'sea:red': 'Punane meri on kitsas meri Aafrika ja Araabia poolsaare vahel.',
  'sea:caribbean': 'Kariibi meri on Kesk-Ameerikast idas ja Lõuna-Ameerikast põhjas.',
  'sea:arabian': 'Araabia meri on Araabia poolsaare ja India vahel.',
  'sea:south-china': 'Lõuna-Hiina meri on Hiinast lõunas, Vietnami ja Filipiinide vahel.',
  'sea:riga': 'Liivi laht on Eesti ja Läti vahel.',
  'sea:bothnia': 'Botnia laht on Rootsi ja Soome vahel.',
  'sea:mexico': 'Mehhiko laht on USA-st lõunas ja Mehhikost idas.',
  'sea:hudson': 'Hudsoni laht on suur laht Kanada põhjaosas.'
};

const AREAS = [
  ['loodeosas', 'põhjaosas', 'kirdeosas'],
  ['lääneosas', 'keskosas', 'idaosas'],
  ['edelaosas', 'lõunaosas', 'kaguosas']
];

export function directionHint(geometry: ViewGeometry | null, id: string, name: string): string {
  const point = geometry?.labels[id] ?? (geometry?.markers.find((marker) => marker.id === id) ? [geometry.markers.find((marker) => marker.id === id)!.x, geometry.markers.find((marker) => marker.id === id)!.y, 0] : null);
  if (!geometry || !point) return `Vihje: ${name} on selle kaardi peal – vaata rahulikult üle.`;
  const col = Math.min(2, Math.max(0, Math.floor((point[0] / geometry.width) * 3)));
  const row = Math.min(2, Math.max(0, Math.floor((point[1] / geometry.height) * 3)));
  return `Vihje: ${name} asub kaardi ${AREAS[row][col]}.`;
}

/* ----------------------------------------------------------- the targets */

type Candidate = { targetKey: string; targetId: string; kinds: QuestionKind[]; weight: number };

function weightFor(targetKey: string, stats: Map<string, TargetStat>): number {
  const stat = stats.get(targetKey);
  if (!stat || stat.seen === 0) return 3;
  return 1 + Math.min(stat.missCount, 3) * 3;
}

function countryKinds(country: CatalogCountry, view: MapViewDef, level: LevelId): QuestionKind[] {
  const tappable = country.tappableIn?.includes(view.id) ?? false;
  const capital = quizCapital(country);
  const kinds: QuestionKind[] = [tappable ? 'find_country' : 'name_highlighted'];
  if (tappable) kinds.push('name_highlighted');
  if (level !== 'explorer' && capital) kinds.push('capital_of_country');
  if (level === 'geographer' && capital && tappable) kinds.push('country_of_capital');
  return kinds;
}

// Eesti: every county is big enough to tap. Avastaja finds and names the
// counties; Rändur adds "Mis on X keskus?"; Geograaf also taps the county of a town.
function countyKinds(level: LevelId): QuestionKind[] {
  const kinds: QuestionKind[] = ['find_county', 'name_highlighted_county'];
  if (level !== 'explorer') kinds.push('centre_of_county');
  if (level === 'geographer') kinds.push('county_of_centre');
  return kinds;
}

function candidatesFor(spec: RoundSpec, stats: Map<string, TargetStat>): Candidate[] {
  const { view, setId, level } = spec;
  if (view.kind === 'estonia') {
    const pool = level === 'explorer' ? COUNTIES.filter((county) => county.wellKnown) : COUNTIES;
    return pool.map((county) => ({
      targetKey: `county:${county.id}`,
      targetId: county.id,
      kinds: countyKinds(level),
      weight: weightFor(`county:${county.id}`, stats)
    }));
  }
  const place = (type: TargetType, id: string, kind: QuestionKind): Candidate => {
    const targetKey = `${type}:${id}`;
    return { targetKey, targetId: id, kinds: [kind], weight: weightFor(targetKey, stats) };
  };
  if (view.kind === 'antarctica') {
    return [
      place('continent', 'antarctica', 'find_continent'),
      place('point', 'south-pole', 'find_point'),
      place('ocean', 'southern', 'find_ocean'),
      place('ocean', 'atlantic', 'find_ocean'),
      place('ocean', 'indian', 'find_ocean'),
      place('ocean', 'pacific', 'find_ocean'),
      place('continent', 'south-america', 'find_continent'),
      place('continent', 'africa', 'find_continent'),
      place('continent', 'australia', 'find_continent')
    ];
  }
  if (view.kind === 'world') {
    if (setId === 'continents') return CONTINENTS.map((item) => place('continent', item.id, 'find_continent'));
    if (setId === 'worldParts') return WORLD_PARTS.map((item) => place('worldPart', item.id, 'find_world_part'));
    if (setId === 'oceans') return OCEANS.map((item) => place('ocean', item.id, 'find_ocean'));
    if (setId === 'seas') return SEAS.map((item) => place('sea', item.id, 'find_sea'));
  }
  const countries = view.kind === 'world'
    ? CATALOG.countries.filter((country) => country.target && (country.tappableIn ?? []).includes('world'))
    : viewCountries(view);
  const known = countries.filter((country) => country.wellKnown);
  const pool = level === 'explorer' && known.length >= 4 ? known : countries;
  return pool.map((country) => ({
    targetKey: `country:${country.id}`,
    targetId: country.id,
    kinds: countryKinds(country, view, level),
    weight: weightFor(`country:${country.id}`, stats)
  }));
}

function weightedPick<T extends { weight: number }>(items: T[], rng: Rng): T {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = rng() * total;
  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}

/* -------------------------------------------------------------- questions */

function countryOptions(answer: CatalogCountry, pool: CatalogCountry[], count: number, rng: Rng) {
  const others = shuffle(pool.filter((country) => country.id !== answer.id), rng).slice(0, count - 1);
  return shuffle([answer, ...others], rng).map((country) => ({ id: country.id, label: country.nameEt }));
}

// Wrong capitals come from the view's set first. A set where few countries
// have one plain capital (Lõuna-Aafrika, Mikroneesia) is topped up from the
// rest of the world part, then the world, so every question has `count` buttons.
function capitalOptions(answer: CatalogCountry, pool: CatalogCountry[], count: number, rng: Rng) {
  const right = quizCapital(answer)!;
  const seen = new Set([right.nameEt]);
  const others: Array<{ id: string; label: string }> = [];
  const inPool = new Set(pool.map((country) => country.id));
  const samePart = CATALOG.countries.filter((country) => country.target && country.worldPart === answer.worldPart && !inPool.has(country.id));
  const rest = CATALOG.countries.filter((country) => country.target && country.worldPart !== answer.worldPart && !inPool.has(country.id));
  for (const country of [...shuffle(pool, rng), ...shuffle(samePart, rng), ...shuffle(rest, rng)]) {
    const capital = quizCapital(country);
    if (!capital || country.id === answer.id || seen.has(capital.nameEt)) continue;
    seen.add(capital.nameEt);
    others.push({ id: capital.id, label: capital.nameEt });
    if (others.length === count - 1) break;
  }
  return shuffle([{ id: right.id, label: right.nameEt }, ...others], rng);
}

function countyOptions(answer: County, count: number, rng: Rng, label: (county: County) => string, id: (county: County) => string) {
  const others = shuffle(COUNTIES.filter((county) => county.id !== answer.id), rng).slice(0, count - 1);
  return shuffle([answer, ...others], rng).map((county) => ({ id: id(county), label: label(county) }));
}

type QuestionBase = Pick<FrozenQuestion, 'id' | 'kind' | 'targetKey' | 'targetId' | 'options' | 'highlightId' | 'hideCapitalId'>;

function buildCountyQuestion(base: QuestionBase, county: County, kind: QuestionKind, optionCount: number, geometry: ViewGeometry | null, rng: Rng): FrozenQuestion {
  const explain = `${county.nameEt} – keskus ${county.centreEt}`;
  const buttonHint = 'Vihje: üks vale vastus on nüüd ära võetud.';
  switch (kind) {
    case 'find_county':
      return { ...base, answering: 'map', targetType: 'county', answerId: county.id, prompt: `Leia kaardilt ${county.nameEt}.`, hintEt: directionHint(geometry, county.id, county.nameEt), explainEt: explain };
    case 'name_highlighted_county':
      return {
        ...base, answering: 'buttons', targetType: 'county', answerId: county.id, highlightId: county.id,
        prompt: 'Mis maakond on kaardil esile tõstetud?', options: countyOptions(county, optionCount, rng, (item) => item.nameEt, (item) => item.id),
        hintEt: buttonHint, explainEt: explain
      };
    case 'centre_of_county':
      return {
        ...base, answering: 'buttons', targetType: 'countyCentre', targetKey: `countyCentre:${county.id}`, answerId: county.centreId, highlightId: county.id, hideCapitalId: county.centreId,
        prompt: `Mis on ${county.nameEt} keskus?`, options: countyOptions(county, optionCount, rng, (item) => item.centreEt, (item) => item.centreId),
        hintEt: buttonHint, explainEt: `${county.centreEt} on ${county.nameEt} keskus.`
      };
    case 'county_of_centre':
      return {
        ...base, answering: 'map', targetType: 'countyCentre', targetKey: `countyCentre:${county.id}`, answerId: county.id, hideCapitalId: county.centreId,
        prompt: `Millise maakonna keskus on ${county.centreEt}? Puuduta seda maakonda kaardil.`,
        hintEt: directionHint(geometry, county.id, 'See maakond'), explainEt: `${county.centreEt} on ${county.nameEt} keskus.`
      };
    default:
      throw new Error(`Unexpected county kind ${kind}`);
  }
}

function buildQuestion(index: number, candidate: Candidate, kind: QuestionKind, spec: RoundSpec, geometry: ViewGeometry | null, rng: Rng): FrozenQuestion {
  const base = { id: `q${index + 1}`, kind, targetKey: candidate.targetKey, targetId: candidate.targetId, options: null, highlightId: null, hideCapitalId: null };
  const name = nameOf(candidate.targetId);
  const optionCount = spec.level === 'explorer' ? 3 : 4;
  const county = findCounty(candidate.targetId);
  if (county) return buildCountyQuestion(base, county, kind, optionCount, geometry, rng);
  if (kind === 'find_continent' || kind === 'find_world_part' || kind === 'find_ocean' || kind === 'find_sea' || kind === 'find_point') {
    const type: TargetType = kind === 'find_continent' ? 'continent' : kind === 'find_world_part' ? 'worldPart' : kind === 'find_ocean' ? 'ocean' : kind === 'find_sea' ? 'sea' : 'point';
    const prompt = kind === 'find_continent' ? `Leia ${CONTINENTS.find((item) => item.id === candidate.targetId)?.genEt ?? name} manner.`
      : kind === 'find_world_part' ? `Leia ${name} maailmajagu.`
        : `Leia ${name}.`;
    return { ...base, answering: 'map', targetType: type, answerId: candidate.targetId, prompt, hintEt: `Vihje: ${PLACE_HINTS[candidate.targetKey] ?? ''}`.trim(), explainEt: name.charAt(0).toUpperCase() + name.slice(1) };
  }
  const country = findCountry(candidate.targetId)!;
  const pool = spec.view.kind === 'world'
    ? CATALOG.countries.filter((item) => item.target && (item.tappableIn ?? []).includes('world'))
    : viewCountries(spec.view);
  const distractorPool = pool.length >= optionCount ? pool : CATALOG.countries.filter((item) => item.target && item.worldPart === country.worldPart);
  const explain = countryWithCapital(country);
  switch (kind) {
    case 'find_country':
      return { ...base, answering: 'map', targetType: 'country', answerId: country.id, prompt: `Leia kaardilt ${country.nameEt}.`, hintEt: directionHint(geometry, country.id, country.nameEt), explainEt: explain };
    case 'name_highlighted':
      return {
        ...base, answering: 'buttons', targetType: 'country', answerId: country.id, highlightId: country.id,
        prompt: 'Mis riik on kaardil esile tõstetud?', options: countryOptions(country, distractorPool, optionCount, rng),
        hintEt: 'Vihje: üks vale vastus on nüüd ära võetud.', explainEt: explain
      };
    case 'capital_of_country': {
      const capital = quizCapital(country)!;
      return {
        ...base, answering: 'buttons', targetType: 'capital', targetKey: `capital:${country.id}`, answerId: capital.id, highlightId: country.id, hideCapitalId: capital.id,
        prompt: `Mis on ${country.nameGenEt} pealinn?`, options: capitalOptions(country, distractorPool, optionCount, rng),
        hintEt: 'Vihje: üks vale vastus on nüüd ära võetud.', explainEt: `${capital.nameEt} on ${country.nameGenEt} pealinn.`
      };
    }
    case 'country_of_capital': {
      const capital = quizCapital(country)!;
      return {
        ...base, answering: 'map', targetType: 'capital', targetKey: `capital:${country.id}`, answerId: country.id, hideCapitalId: capital.id,
        prompt: `Millise riigi pealinn on ${capital.nameEt}? Puuduta seda riiki kaardil.`,
        hintEt: directionHint(geometry, country.id, 'See riik'), explainEt: `${capital.nameEt} on ${country.nameGenEt} pealinn.`
      };
    }
    default:
      throw new Error(`Unexpected kind ${kind}`);
  }
}

// A short round: up to ROUND_LENGTH questions, each target at most twice (in
// different ways, never back to back), favouring targets the learner missed
// before and ones not yet practised. A small set gives a shorter round.
export function buildRound(spec: RoundSpec, geometry: ViewGeometry | null, stats: Map<string, TargetStat>, rng: Rng): RoundState {
  const candidates = candidatesFor(spec, stats);
  if (candidates.length === 0) throw new Error(`No targets for ${spec.view.id}`);
  const firstPass: Candidate[] = [];
  const remaining = [...candidates];
  while (remaining.length && firstPass.length < ROUND_LENGTH) {
    const pick = weightedPick(remaining, rng);
    firstPass.push(pick);
    remaining.splice(remaining.indexOf(pick), 1);
  }
  const plan: Array<{ candidate: Candidate; kind: QuestionKind }> = firstPass.map((candidate) => ({ candidate, kind: candidate.kinds[Math.floor(rng() * candidate.kinds.length)] }));
  // A small pool: ask some targets a second time, in another way.
  for (const candidate of shuffle(firstPass, rng)) {
    if (plan.length >= ROUND_LENGTH) break;
    const used = plan.filter((item) => item.candidate === candidate).map((item) => item.kind);
    const other = candidate.kinds.filter((kind) => !used.includes(kind));
    if (other.length && used.length < MAX_PER_TARGET) plan.push({ candidate, kind: other[Math.floor(rng() * other.length)] });
  }
  const ordered = orderWithoutRepeats(shuffle(plan, rng), (item) => item.candidate.targetId);
  const questions = ordered.map((item, index) => buildQuestion(index, item.candidate, item.kind, spec, geometry, rng));
  return { questions, states: questions.map(() => emptyState()), cursor: 0 };
}

// Always continue with the key that has the most items left (other than the
// one just used), so equal keys never end up side by side when avoidable.
export function orderWithoutRepeats<T>(items: T[], keyOf: (item: T) => string): T[] {
  const groups = new Map<string, T[]>();
  for (const item of items) groups.set(keyOf(item), [...(groups.get(keyOf(item)) ?? []), item]);
  const out: T[] = [];
  let last: string | null = null;
  while (out.length < items.length) {
    let best: string | null = null;
    for (const [key, list] of groups) {
      if (!list.length || key === last) continue;
      if (best === null || list.length > groups.get(best)!.length) best = key;
    }
    best ??= last!;
    out.push(groups.get(best)!.shift()!);
    last = best;
  }
  return out;
}

export function emptyState(): QuestionState {
  return { attempts: 0, wrongIds: [], removedOptionIds: [], resolved: null, firstTry: null };
}

/* ---------------------------------------------------------------- grading */

export type AnswerOutcome = 'correct' | 'wrong_retry' | 'revealed' | 'neutral';
export type GradeResult = { outcome: AnswerOutcome; state: QuestionState; messageEt: string };

// The neutral answer: a tap in open sea outside every ocean touch area, or on
// land during an ocean question. Never counted as wrong.
export const SEA_ANSWER = 'sea';
// A tap on land that belongs to no continent or world part in this question
// (New Zealand is on no continent). Also neutral.
export const NO_AREA_ANSWER = 'none';
export const ANSWER_ID_PATTERN = /^[A-Za-z0-9-]{1,60}$/u;

export function gradeAnswer(question: FrozenQuestion, state: QuestionState, answerId: string): GradeResult {
  if (state.resolved) throw new Error('Question already resolved');
  if (question.answering === 'buttons' && !question.options?.some((option) => option.id === answerId)) {
    throw new Error('Not an option of this question');
  }
  if (answerId === NO_AREA_ANSWER) {
    return { outcome: 'neutral', state, messageEt: 'See saar ei kuulu ühegi mandri hulka. Proovi mujal.' };
  }
  if (question.kind === 'find_sea') {
    // Land, open ocean or a sea's edge: not a wrong answer, just not a sea.
    if (!findSea(answerId)) return { outcome: 'neutral', state, messageEt: 'Puuduta mere keskele.' };
    // A gulf is part of its sea: Soome laht for "Leia Läänemeri." is right.
    if (findSea(answerId)?.partOf === question.answerId) answerId = question.answerId;
  }
  if (answerId === SEA_ANSWER || (question.kind === 'find_ocean' && !OCEANS.some((ocean) => ocean.id === answerId))) {
    return { outcome: 'neutral', state, messageEt: question.kind === 'find_ocean' ? 'Puuduta ookeani keskele, kaugemale rannikust.' : 'Seal on meri. Puuduta maad.' };
  }
  if (answerId === question.answerId) {
    return { outcome: 'correct', state: { ...state, resolved: 'correct', firstTry: state.attempts === 0 }, messageEt: `Õige! ${question.explainEt}` };
  }
  const attempts = state.attempts + 1;
  const wrongIds = [...state.wrongIds, answerId];
  if (attempts >= 2) {
    return { outcome: 'revealed', state: { ...state, attempts, wrongIds, resolved: 'revealed', firstTry: false }, messageEt: `Õige vastus: ${question.explainEt}` };
  }
  let removedOptionIds = state.removedOptionIds;
  if (question.answering === 'buttons') {
    // The tapped button goes, and one more wrong one if that still leaves a
    // choice: with three buttons (Avastaja) the retry must not be the answer alone.
    removedOptionIds = [...removedOptionIds, answerId];
    const left = question.options!.filter((option) => !removedOptionIds.includes(option.id));
    const removable = left.find((option) => option.id !== question.answerId);
    if (removable && left.length > 2) removedOptionIds = [...removedOptionIds, removable.id];
  }
  const tapped = question.answering === 'map' ? `See on ${nameOf(answerId)}. ` : '';
  return { outcome: 'wrong_retry', state: { ...state, attempts, wrongIds, removedOptionIds }, messageEt: `${tapped}Proovi veel. ${question.hintEt}`.trim() };
}

/* ---------------------------------------------------------- client views */

// The target (`targetId`, and the mastery key built from it) and the capital a
// question hides are the answer itself for most kinds — "Leia kaardilt Eesti"
// has targetId EST, "Mis on Norra pealinn?" hides nor-oslo — so they stay on
// the server until the question is resolved, exactly like `answerId`.
export type ClientQuestion = Omit<FrozenQuestion, 'answerId' | 'explainEt' | 'hintEt' | 'targetId' | 'targetKey' | 'hideCapitalId'> & {
  state: QuestionState;
  // Only once the question is resolved (or a hint has been earned).
  targetId: string | null;
  hideCapitalId: string | null;
  correctId: string | null;
  explainEt: string | null;
  hintEt: string | null;
};

export function toClientQuestion(question: FrozenQuestion, state: QuestionState): ClientQuestion {
  const resolved = Boolean(state.resolved);
  return {
    id: question.id,
    kind: question.kind,
    answering: question.answering,
    targetType: question.targetType,
    prompt: question.prompt,
    options: question.options,
    highlightId: question.highlightId,
    state,
    targetId: resolved ? question.targetId : null,
    hideCapitalId: resolved ? question.hideCapitalId : null,
    correctId: resolved ? question.answerId : null,
    explainEt: resolved ? question.explainEt : null,
    hintEt: state.attempts > 0 ? question.hintEt : null
  };
}
