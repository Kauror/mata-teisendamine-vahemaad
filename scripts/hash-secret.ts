import { hashSecret } from '../src/lib/auth/password';

// RTM4-C02: `npm run auth:hash -- <pin>` expands to `tsx scripts/hash-secret.ts
// -- <pin>`, so the argument list can contain a leading `--` separator. Drop any
// `--` tokens and take the first real argument, so the documented command hashes
// the chosen PIN rather than the literal `--`.
const secret = process.argv.slice(2).filter((arg) => arg !== '--')[0];
if (!secret) {
  console.error('Usage: npm run auth:hash -- <secret>');
  process.exit(2);
}
process.stdout.write(`${hashSecret(secret)}\n`);
