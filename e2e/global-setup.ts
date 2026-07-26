import { mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { E2E_DB_DIR, E2E_DB_FILE } from './config';

// Give the suite one real SQLite file instead of ':memory:'.
//
// Under `next dev`, route handlers are compiled into separate server chunks and
// each one instantiates its own module graph — so with ':memory:' every route
// gets its OWN empty database. /api/history and /api/offline/sync would agree
// while /api/remediation saw no attempts at all, which silently breaks any test
// that writes state through one route and reads it through another. A file is
// shared by every instance, exactly as it is in production.
//
// Deleted before each run so the suite always starts from an empty database.
export default async function globalSetup() {
  rmSync(E2E_DB_DIR, { recursive: true, force: true });
  mkdirSync(path.dirname(E2E_DB_FILE), { recursive: true });
}
