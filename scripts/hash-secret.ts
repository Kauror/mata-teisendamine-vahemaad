import { hashSecret } from '../src/lib/auth/password';

const secret = process.argv[2];
if (!secret) {
  console.error('Usage: npm run auth:hash -- <secret>');
  process.exit(2);
}
process.stdout.write(`${hashSecret(secret)}\n`);
