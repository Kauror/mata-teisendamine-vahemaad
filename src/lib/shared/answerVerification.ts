import type { GeneratedQuestion, TextAnswerRules } from '@/lib/types';
import { isAnswerCorrect } from '@/lib/validation';

const UNIT_ALIASES: ReadonlyArray<readonly [RegExp, string]> = [
  [/\bmillimeet(?:er|rit)\b/gu, 'mm'],
  [/\bsentimeet(?:er|rit)\b/gu, 'cm'],
  [/\bdetsimeet(?:er|rit)\b/gu, 'dm'],
  [/\bkilomeet(?:er|rit)\b/gu, 'km'],
  [/\bmeet(?:er|rit)\b/gu, 'm'],
  [/\bkilogramm(?:i)?\b/gu, 'kg'],
  [/\bgramm(?:i)?\b/gu, 'g']
];

export function normalizeMathAnswer(value: unknown) {
  let normalized = String(value ?? '')
    .normalize('NFKC')
    .toLocaleLowerCase('et')
    .trim()
    .replace(/(\d),(\d)/g, '$1.$2')
    .replace(/[−–—]/g, '-')
    .replace(/\s+/g, ' ');
  for (const [pattern, replacement] of UNIT_ALIASES) normalized = normalized.replace(pattern, replacement);
  return normalized
    // A child separates parts with "ja", a comma or just a space, and may end
    // with a full stop; none of these change what the answer says. Decimal
    // commas became points above, so only separator commas are left here.
    .replace(/[.!]+$/, '')
    .replace(/\s*,\s*|\s+ja\s+/g, ' ')
    .replace(/([+-]?\d+(?:\.\d+)?)\s+(?=(?:mm|cm|dm|km|m|kg|g)\b)/g, '$1')
    .replace(/(mm|cm|dm|km|kg|m|g)(?=[+-]?\d)/g, '$1 ')
    .replace(/\s+/g, ' ')
    // "9-6+2-5=0" and "9 - 6 + 2 - 5 = 0" are the same equation.
    .replace(/\s*([=+×:<>-])\s*/g, '$1')
    .trim();
}

export function acceptedMathTextAnswers(question: GeneratedQuestion) {
  return [question.correctAnswerText, ...(question.acceptedAnswers ?? [])]
    .filter((answer): answer is string => Boolean(answer));
}

// The listed forms are always enough. A question that carries textAnswerRules
// (maths generator v5 text problems) is also read more naturally; one without
// them is judged exactly as before, so an older attempt's replayed score never
// changes.
export function verifyMathTextAnswer(question: GeneratedQuestion, answer: unknown) {
  const submitted = normalizeMathAnswer(answer);
  const accepted = acceptedMathTextAnswers(question);
  if (accepted.some((label) => normalizeMathAnswer(label) === submitted)) return true;
  const rules = question.textAnswerRules;
  if (!rules) return false;
  if (rules.expression && expressionAnswerIsRight(answer, rules.expression)) return true;
  if (rules.keyword && keywordAnswerIsRight(answer, rules.keyword, rules.rivals ?? [])) return true;
  return Boolean(rules.natural) && naturalAnswerIsRight(answer, accepted);
}

const withoutClock = (value: string) => value.replace(/(^| )kell /g, '$1').trim();
const numbersIn = (value: string) => (value.match(/-?\d+(?:\.\d+)?/g) ?? []).sort().join('|');

// «19» where «kell 19» is accepted, «5,4» as the list «5 ja 4» (the comma
// between two digits otherwise reads as a decimal comma), and a whole sentence
// that contains an accepted answer and no other number («Mall magab 12 tundi.»).
function naturalAnswerIsRight(answer: unknown, accepted: string[]) {
  const raw = String(answer ?? '');
  const submittedForms = Array.from(new Set([normalizeMathAnswer(raw), normalizeMathAnswer(raw.replace(/(\d)\s*,\s*(?=\d)/g, '$1 '))].map(withoutClock)));
  const acceptedForms = Array.from(new Set(accepted.map((label) => withoutClock(normalizeMathAnswer(label)))));
  return submittedForms.some((submitted) => acceptedForms.some((label) => {
    if (submitted === label) return true;
    if (!/\d/.test(label)) return false;
    return ` ${submitted} `.includes(` ${label} `) && numbersIn(submitted) === numbersIn(label);
  }));
}

// «Eve korjas kõige rohkem.» for «Kes korjas kõige rohkem?»: the name (or an
// inflected form of it, «Evel») appears and no other child of the task does.
function keywordAnswerIsRight(answer: unknown, keyword: string, rivals: string[]) {
  const words = String(answer ?? '').normalize('NFKC').toLocaleLowerCase('et').split(/[^\p{L}]+/u).filter(Boolean);
  const names = (name: string) => words.some((word) => word.startsWith(name.toLocaleLowerCase('et')));
  return names(keyword) && !rivals.some(names);
}

// «Aseta tehtemärgid»: the signs alone («- + -», «miinus pluss miinus») or the
// whole expression, optionally with its value («9 - 6 : 2 - 5 = 1»). The
// numbers must be the task's, in its order; × and : go before + and -; a value
// given after «=» must be the right one.
export function expressionAnswerIsRight(answer: unknown, rule: NonNullable<TextAnswerRules['expression']>) {
  const text = String(answer ?? '')
    .normalize('NFKC')
    .toLocaleLowerCase('et')
    .replace(/[−–—]/g, '-')
    .replace(/\bmiinus\b/g, ' - ')
    .replace(/\bpluss\b/g, ' + ')
    .replace(/\bkorda\b/g, ' × ')
    .replace(/\bjagatud\b/g, ' : ')
    .replace(/[*·x]/g, ' × ')
    .replace(/\//g, ' : ')
    .replace(/(\d),(\d)/g, '$1.$2')
    .trim();
  const [left, value, ...extra] = text.split('=');
  if (extra.length) return false;
  const tokens = left.match(/\d+(?:\.\d+)?|[+×:-]/g) ?? [];
  if (tokens.join('') !== left.replace(/\s+/g, '')) return false;
  let operators: string[];
  if (tokens.every((token) => /^[+×:-]$/.test(token))) {
    operators = tokens;
  } else {
    if (tokens.length !== rule.numbers.length * 2 - 1) return false;
    operators = [];
    for (let index = 0; index < tokens.length; index += 1) {
      if (index % 2 === 0 ? Number(tokens[index]) !== rule.numbers[index / 2] : !/^[+×:-]$/.test(tokens[index])) return false;
      if (index % 2 === 1) operators.push(tokens[index]);
    }
  }
  if (operators.length !== rule.numbers.length - 1) return false;
  // × and : first, then + and - from left to right.
  const terms: number[] = [rule.numbers[0]];
  const signs: string[] = [];
  operators.forEach((operator, index) => {
    const next = rule.numbers[index + 1];
    if (operator === '×') terms[terms.length - 1] *= next;
    else if (operator === ':') terms[terms.length - 1] /= next;
    else { signs.push(operator); terms.push(next); }
  });
  const result = terms.slice(1).reduce((sum, term, index) => signs[index] === '+' ? sum + term : sum - term, terms[0]);
  if (value !== undefined) {
    const stated = Number(value.replace(/\s+/g, ''));
    if (!value.trim() || !Number.isFinite(stated) || Math.abs(stated - result) > 1e-9) return false;
  }
  return result < rule.lessThan;
}

export function mathChoiceAnswerLabels(question: GeneratedQuestion) {
  const options = question.choiceOptions;
  if (!options?.length) return [question.correctAnswer === -1 ? '<' : question.correctAnswer === 0 ? '=' : '>'];
  const indexes = question.correctAnswers?.length ? question.correctAnswers : [question.correctAnswer];
  return indexes.map((index) => options[index]).filter((answer): answer is string => Boolean(answer));
}

export function verifyGeneratedMathAnswer(question: GeneratedQuestion, answer: unknown) {
  if (question.kind === 'ordering') {
    const expected = [...(question.orderingCards ?? [])]
      .sort((a, b) => question.orderingDirection === 'desc' ? b.valueMm - a.valueMm : a.valueMm - b.valueMm)
      .map((card) => normalizeMathAnswer(card.label));
    const submitted = String(answer ?? '').split(/\s*(?:→|->|\|)\s*/).map(normalizeMathAnswer).filter(Boolean);
    return JSON.stringify(submitted) === JSON.stringify(expected);
  }
  if (question.kind === 'choice') {
    const normalized = normalizeMathAnswer(answer);
    if (mathChoiceAnswerLabels(question).some((label) => normalizeMathAnswer(label) === normalized)) return true;
    // The runner submits the option label. A bare option index is only a legacy
    // fallback, and only when it cannot be read as a label: with numeric options
    // (["2", "18", "17"]) the answer "2" is the wrong option, not index 2.
    if (question.choiceOptions?.some((option) => normalizeMathAnswer(option) === normalized)) return false;
    const correctIndexes = question.correctAnswers?.length ? question.correctAnswers : [question.correctAnswer];
    return correctIndexes.some((index) => String(index) === normalized);
  }
  if (question.kind === 'text' || question.correctAnswerText) return verifyMathTextAnswer(question, answer);
  return isAnswerCorrect(String(answer ?? ''), question.correctAnswer);
}
