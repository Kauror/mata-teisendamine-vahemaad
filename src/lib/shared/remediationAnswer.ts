// The single answer comparison used by Kordamine. Client-safe (no `db`), so the
// screen that tells the child "Õige!" and the server that scores the session
// reach the same verdict. They used to normalize differently — the server folded
// diacritics, the browser did not — so an answer like "õ" could show as wrong on
// screen and still be counted correct in the saved result.
//
// Deliberately forgiving: case, surrounding whitespace, decimal comma vs point
// and Estonian diacritics are all ignored. Changing that would silently turn
// previously accepted answers into wrong ones.

export function normalizeRemediationAnswer(value: unknown) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .replace(',', '.');
}

export function remediationAnswerMatches(answer: unknown, correct: unknown) {
  return normalizeRemediationAnswer(answer) === normalizeRemediationAnswer(correct);
}
