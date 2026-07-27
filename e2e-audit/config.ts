import path from 'node:path';

export const AUDIT_PORT = Number(process.env.PW_AUDIT_PORT ?? 3101);
// Use localhost rather than 127.0.0.1: WebKit reports caught same-origin fetch
// cancellations using its access-control wording, and the shared E2E fixture
// deliberately recognizes that wording for the localhost loopback origin.
export const AUDIT_ORIGIN = `http://localhost:${AUDIT_PORT}`;
export const AUDIT_DB_DIR = path.resolve(process.cwd(), '.e2e-audit-data');
export const AUDIT_DB_FILE = path.join(AUDIT_DB_DIR, 'audit.sqlite');
