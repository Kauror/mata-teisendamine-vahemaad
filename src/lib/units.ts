export const UNIT_TO_MM = {
  mm: 1,
  cm: 10,
  dm: 100,
  m: 1000,
  km: 1000000
} as const;

export type LengthUnit = keyof typeof UNIT_TO_MM;

export function toMm(value: number, unit: LengthUnit): number {
  return value * UNIT_TO_MM[unit];
}

export function fromMm(mm: number, unit: LengthUnit): number {
  return mm / UNIT_TO_MM[unit];
}

export function convert(value: number, from: LengthUnit, to: LengthUnit): number {
  return fromMm(toMm(value, from), to);
}

export function mixedToMm(parts: Array<{ value: number; unit: LengthUnit }>): number {
  return parts.reduce((sum, p) => sum + toMm(p.value, p.unit), 0);
}

export function formatUnitEt(unit: LengthUnit): string {
  return unit;
}
