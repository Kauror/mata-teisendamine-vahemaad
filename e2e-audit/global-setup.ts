import { mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { AUDIT_DB_DIR, AUDIT_DB_FILE } from './config';

export default async function globalSetup() {
  rmSync(AUDIT_DB_DIR, { recursive: true, force: true });
  mkdirSync(path.dirname(AUDIT_DB_FILE), { recursive: true });
}
