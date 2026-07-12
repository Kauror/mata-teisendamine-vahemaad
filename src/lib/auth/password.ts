import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const VERSION = 1;
const KEY_LENGTH = 32;
const N = 16_384;
const R = 8;
const P = 1;

export function hashSecret(secret: string, salt = randomBytes(16)) {
  if (typeof secret !== 'string' || secret.length < 4 || secret.length > 1024) {
    throw new Error('Secret must contain between 4 and 1024 characters.');
  }
  const derived = scryptSync(secret, salt, KEY_LENGTH, { N, r: R, p: P, maxmem: 64 * 1024 * 1024 });
  return `scrypt$v=${VERSION}$N=${N},r=${R},p=${P}$${salt.toString('base64url')}$${derived.toString('base64url')}`;
}

export function isScryptHash(value: unknown): value is string {
  return typeof value === 'string' && /^scrypt\$v=1\$N=\d+,r=\d+,p=\d+\$[A-Za-z0-9_-]+\$[A-Za-z0-9_-]+$/.test(value);
}

export function verifySecretHash(secret: string, encoded: string) {
  if (!isScryptHash(encoded) || typeof secret !== 'string' || secret.length > 1024) return false;
  const [, versionPart, paramsPart, saltPart, hashPart] = encoded.split('$');
  if (versionPart !== `v=${VERSION}`) return false;
  const params = Object.fromEntries(paramsPart.split(',').map((entry) => entry.split('=')));
  const parsedN = Number(params.N);
  const parsedR = Number(params.r);
  const parsedP = Number(params.p);
  if (parsedN !== N || parsedR !== R || parsedP !== P) return false;

  try {
    const expected = Buffer.from(hashPart, 'base64url');
    const actual = scryptSync(secret, Buffer.from(saltPart, 'base64url'), expected.length, {
      N: parsedN,
      r: parsedR,
      p: parsedP,
      maxmem: 64 * 1024 * 1024
    });
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
