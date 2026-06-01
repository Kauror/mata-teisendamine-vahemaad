export function formatStars(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toLocaleString('et-EE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}
