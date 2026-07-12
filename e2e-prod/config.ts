// Shared configuration for the production-build service-worker E2E. The same
// session secret must be used by the running server (webServer env) and by the
// global setup that mints a family session cookie, or the injected cookie will
// not verify. This value is test-only.
export const TEST_SESSION_SECRET = 'e2e-prod-session-secret-0123456789abcdef';
export const TEST_PORT = Number(process.env.PW_TEST_PORT ?? 3000);
// RTM3-M01: the Playwright browser talks to http://localhost:3000 directly (no
// TLS proxy), so APP_ORIGIN must be that exact origin or mutation/sync requests
// would fail the middleware exact-origin check. http-loopback is a secure context
// and is accepted by configuredAppOrigin, so the prod build still boots.
export const TEST_ORIGIN = `http://localhost:${TEST_PORT}`;
export const AUTH_STATE_PATH = 'e2e-prod/.auth/state.json';
