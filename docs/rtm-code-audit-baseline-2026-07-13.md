# RTM code-audit baseline — 2026-07-13

## Repository state

- Branch: `main`
- Baseline commit: `7e8bc95c7d61b8bbe90615e5cf7dd96d30abc4da`
- Upstream: `origin/main`
- Working tree before installation and tests: clean
- Node.js: `v22.22.3`
- npm: `10.9.8`

The repository already contains four earlier RTM audit rounds and later offline
release fixes. Those changes must be preserved. In particular, the current code
already has checksummed additive SQLite migrations, WAL-safe pre-migration
backups, protocol-v2 server score recomputation, transactional attempt/reward
settlement, exact-origin and CSRF middleware for protected mutations, and a
verified-startup wrapper.

## Baseline commands and results

| Command | Result |
| --- | --- |
| `npm ci` | Passed; 387 packages installed. npm reported one pre-existing moderate advisory and Windows/OneDrive `EPERM` cleanup warnings. |
| `npm run typecheck` | Passed. |
| `npm test` | Passed: 19 files, 93 tests. |
| `npm run build` | Passed: Next.js 15.5.18 production build and service-worker generation. |
| `npm run test:e2e:install` | Passed; Chromium and WebKit available. |
| `npm run test:e2e` | Passed: 6 tests across Chromium and WebKit. |
| `$env:PW_TEST_PORT='3100'; $env:CI='1'; npm run test:e2e:prod` | Passed: 5 production tests. |

The working tree remained clean after the baseline commands.

## Audit inspection

- CI: `.github/workflows/ci.yml` runs unit/build and browser jobs, but does not
  yet contain all requested release, dependency, container, secret, and Compose
  gates.
- Container: the current image runs as root, copies the complete dependency tree,
  publishes `127.0.0.1:3000`, lacks `init: true`, and does not define the shared
  Cloudflare Tunnel network required by the release plan.
- Database: migrations are ordered, checksummed, transactional, additive, and
  idempotent. Startup uses a WAL-safe backup and verification path. Retention and
  a distinct readiness probe are not implemented.
- Rewards/history: canonical protocol-v2 reward projection still filters
  `deletedAt IS NULL`; child-accessible history routes still expose `DELETE` and
  the child history UI renders destructive controls.
- Attempt writes: direct `POST /api/history` and protocol-v1 sync writes still
  reach `insertAttempt`; protocol v1 remains advertised/read-write capable.
- Authentication: middleware performs family, exact-origin, and CSRF checks for
  protected mutations. History deletion is outside the parent namespace. Login
  throttling includes user-agent and accepts forwarding headers without a
  documented trusted-proxy policy.
- Offline sync: known `PublicRequestError` responses are classified, but the
  unexpected-exception fallback returns `422` instead of `500`.
- Mathematics runner: final submission updates React answer state and then
  finalizes from the previous snapshot. Client text verification also accepts
  matching numeric components even when units differ, while server verification
  uses different logic.
- Parent authentication: runtime support for `PARENT_PASSWORD_HASH` and session
  auth-version invalidation exists, but verified production startup does not yet
  require parent-auth readiness and `.env.example` does not document the hash.
- Operations/UX: history API is unbounded; security headers and backup retention
  are absent; dashboard cards contain nested interactive behaviour; a mobile
  rule reduces the main subject action to 38 px; the global font is Arial-only.

## Baseline risks

The open findings above are pre-existing at the baseline SHA. The dependency
advisory must be classified before release. Production-data audit and staged
HTTPS/iPhone acceptance evidence are external release gates and cannot be
claimed from this disposable development checkout.
