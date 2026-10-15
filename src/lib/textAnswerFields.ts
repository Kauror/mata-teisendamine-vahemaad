import type { GeneratedQuestion } from '@/lib/types';

// A text problem whose answer is "number + unit" ("27 raamatut", "3 m 20 cm")
// is entered through one number field per number, with the unit shown as a
// pill. The runner composes the fields back into one string, and that string
// is what gets verified, so the units must reproduce the answer text exactly.
export type TextAnswerField = { unit: string };

export function textAnswerFields(question: GeneratedQuestion): TextAnswerField[] | null {
  const answer = question.correctAnswerText;
  if (!answer || /[:=+]/.test(answer) || /\d\s*-\s*\d/.test(answer) || /\b(vähem|rohkem|võrdsed|kell)\b/i.test(answer)) return null;
  const numberMatches = answer.match(/\d+(?:[,.]\d+)?/g) ?? [];
  const matches = [...answer.matchAll(/(\d+(?:[,.]\d+)?)\s*([A-Za-zõäöüšžÕÄÖÜŠŽ]+)\b/g)];
  if (!numberMatches.length || matches.length !== numberMatches.length) return null;
  const fields = matches.map((match) => ({ unit: match[2] }));
  // The last unit takes everything after its number, so a multi-word tail
  // ("12 minuti pärast", "36 väikest ringi") survives the round trip.
  const last = matches[matches.length - 1];
  fields[fields.length - 1] = { unit: answer.slice((last.index ?? 0) + last[1].length).trim() };
  return fields;
}

export function textAnswerValues(answer: string, fields: TextAnswerField[]) {
  const values = answer.match(/\d+(?:[,.]\d+)?/g) ?? [];
  return fields.map((_, index) => values[index] ?? '');
}

export function composeTextAnswer(fields: TextAnswerField[], values: string[]) {
  return fields.map((field, index) => `${values[index] ?? ''} ${field.unit}`.trim()).join(' ').trim();
}
