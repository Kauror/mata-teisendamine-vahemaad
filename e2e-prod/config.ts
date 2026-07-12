// Shared configuration for the production-build service-worker E2E. The same
// session secret must be used by the running server (webServer env) and by the
// global setup that mints a family session cookie, or the injected cookie will
// not verify. This value is test-only.
export const TEST_SESSION_SECRET = 'e2e-prod-session-secret-0123456789abcdef';
export const TEST_ORIGIN = 'https://localhost:3000';
export const AUTH_STATE_PATH = 'e2e-prod/.auth/state.json';
