# RTM release checklist

This checklist is a release gate, not a deployment instruction. Complete it for one exact candidate commit. Any unchecked item is a **NO-GO**. GitHub branch protection must require the `security`, `unit`, `e2e`, `e2e-prod`, and `docker-release-gate` jobs for that exact SHA.

## Candidate evidence

- Release SHA:
- Immutable app image identifier/digest:
- Immutable Node base-image digest:
- Immutable cloudflared image digest:
- Staged HTTPS URL:
- iPhone model:
- iOS version:
- Desktop/mobile browser versions:
- Database audit result and timestamp:
- Pre-deployment backup filename:
- CI run URL and uploaded evidence artifact:
- Test evidence or screen-recording location:
- Reviewer and date:

## Automated gates for the exact SHA

- [ ] Clean checkout: `npm ci`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] `npm run test:e2e`
- [ ] `PW_TEST_PORT=3100 CI=1 npm run test:e2e:prod`
- [ ] `docker compose config`
- [ ] `docker compose build`
- [ ] `docker compose up -d`
- [ ] Container becomes healthy and logs `Database startup verification passed`.
- [ ] Tunnel-style probe reaches the app over `pikkuste-harjutaja-edge`; the app publishes no host port.
- [ ] Production dependency, image vulnerability, secret, and deployment-misconfiguration gates pass under the documented thresholds.
- [ ] `git diff --exit-code` and `git status --porcelain --untracked-files=all` are empty after build/tests.
- [ ] WAL-safe audit passes against a copy of the live database: `npm run audit:v2 -- /data/maths-game.sqlite`.

The database audit has no bypass. If it reports any pre-existing protocol-v2 attempt, stop. Preserve the report and reconcile deliberately; do not mutate production data automatically.

## Staged HTTPS and family acceptance

- [ ] Real staged HTTPS deployment is reachable only through the approved edge.
- [ ] Family login succeeds and an incorrect credential fails safely.
- [ ] Parent login succeeds; child users cannot reach parent controls.
- [ ] Child dashboard wording, focus order, touch targets, and child-specific history are correct.
- [ ] A mathematics exercise completes with the displayed final answer recorded exactly.
- [ ] Text and unit-bearing answers use the same authoritative verification path and score identically online/offline.
- [ ] An offline exercise can start, be interrupted, and restore the exact question, answer, position, timer, and seed.
- [ ] An offline completion stays pending, later syncs once, and displays one canonical history/reward result.
- [ ] Two devices sync attempts in reverse completion order without duplicates or incorrect reward order.
- [ ] A held attempt explains its state and parent approval settles it exactly once.
- [ ] Parent can hide one history item and all history; child history has no destructive controls.
- [ ] Before/after ledger totals prove history hiding does not change balances.

## iPhone, service worker, and operations

- [ ] Add the staged app to iPhone Home Screen and launch it from the installed icon.
- [ ] In airplane mode, cold launch and reload work for dashboard, history, cached result detail, and every supported offline runner.
- [ ] A service-worker update activates when no runner is active.
- [ ] A service-worker update is deferred while a runner is active, then activates safely after completion.
- [ ] Verified startup creates and fsyncs a named pre-migration backup; retention protects the current and newest successful backups.
- [ ] Container restart/replacement retains the database and passes verified startup/readiness.
- [ ] Rollback rehearsal restores the reviewed backup with the app stopped, then passes integrity, foreign-key, migration, balance, and history checks.

## Decision

- [ ] **GO** — every item above is checked for the recorded SHA/image.
- [ ] **NO-GO** — blocker, owner, and next action recorded below.

Blockers / notes:

