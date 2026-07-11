// Optional leading minus so negative answers are accepted.
const answerRegex = /^-?\d+(?:[,.]\d+)?$/;

export function validateAnswerInput(value: string): string | null {
  if (!value.trim()) return 'Palun sisesta vastus.';
  if (!answerRegex.test(value.trim())) return 'Sisesta ainult number.';
  return null;
}

export function parseAnswer(value: string): number | null {
  const normalized = value.trim().replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isAnswerCorrect(userValue: string, correctValue: number, tolerance = 0.001): boolean {
  const parsed = parseAnswer(userValue);
  if (parsed === null) return false;
  return Math.abs(parsed - correctValue) <= tolerance;
}

export function formatElapsed(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('et-EE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
