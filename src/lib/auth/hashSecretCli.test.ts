import { execSync } from 'node:child_process';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { verifySecretHash } from '@/lib/auth/password';

const repoRoot = path.resolve(__dirname, '../../..');

// RTM4-C02: prove the documented operator command actually hashes the chosen PIN.
// Regression guard against the trailing `--` alias swallowing the argument (which
// produced a valid hash of the literal '--', so startup succeeded but the PIN
// never worked). The PIN is a fixed literal, so the shell command is not
// user-controlled.
function runDocumentedHashCommand(pin: string): string {
  const output = execSync(`npm run --silent auth:hash -- ${pin}`, {
    cwd: repoRoot,
    encoding: 'utf8'
  });
  return output.trim();
}

describe('auth:hash CLI (RTM4-C02)', () => {
  it('hashes the supplied PIN, not the -- separator', () => {
    const hash = runDocumentedHashCommand('1234');
    expect(hash.startsWith('scrypt$')).toBe(true);
    expect(verifySecretHash('1234', hash)).toBe(true);
    // The historical defect hashed '--'; that hash must NOT verify against the PIN.
    expect(verifySecretHash('--', hash)).toBe(false);
  }, 60_000);
});
