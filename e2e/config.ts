import path from 'node:path';

// One shared SQLite file for the whole dev-server suite. Kept out of the repo
// and rebuilt from empty by global-setup on every run.
export const E2E_DB_DIR = path.resolve(process.cwd(), '.e2e-data');
export const E2E_DB_FILE = path.join(E2E_DB_DIR, 'e2e.sqlite');
