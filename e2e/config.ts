import path from 'node:path';

// One shared SQLite file for the whole dev-server suite. Kept out of the repo
// and rebuilt from empty by global-setup on every run.
export const E2E_DB_DIR = path.resolve(process.cwd(), '.e2e-data');
export const E2E_DB_FILE = path.join(E2E_DB_DIR, 'e2e.sqlite');

// Minu's school-feed token for the e2e server (its SHA-256 goes into the env).
export const E2E_SCHOOL_FEED_TOKEN = 'e2e-school-feed-token-0123456789';
