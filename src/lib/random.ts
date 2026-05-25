export type RNG = () => number;

export function seededRng(seed: number): RNG {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomInt(rng: RNG, min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function pickRandom<T>(rng: RNG, arr: readonly T[]) {
  return arr[randomInt(rng, 0, arr.length - 1)];
}

export function shuffleWithRng<T>(rng: RNG, arr: readonly T[]) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomInt(rng, 0, i);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function shuffleWithSeed<T>(arr: readonly T[], seed = Date.now()) {
  return shuffleWithRng(seededRng(seed), arr);
}
