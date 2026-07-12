# RTM offline release gate

Run the automated checks from a clean checkout:

```bash
npm ci
npm run typecheck
npm test
npm run test:e2e:install
npm run test:e2e
PW_TEST_PORT=3100 CI=1 npm run test:e2e:prod
```

`PW_TEST_PORT` prevents a developer server on port 3000 from being silently
reused. The production suite must show an active worker and offline reloads for
the child dashboard and cached confirmed-result detail.

Before deployment, audit a WAL-safe copy of the live database:

```bash
npm run audit:v2 -- data/maths-game.sqlite
```

There is no `--approve-existing` bypass. The rollout is blocked until the audit
reports zero pre-existing protocol-v2 attempts.

## Manual iPhone acceptance

Use the staged HTTPS deployment, not localhost:

1. Open the child app online and wait for Offline Readiness to report ready.
2. Add it to the iPhone Home Screen, then launch the installed app.
3. Enable airplane mode; force-close and reopen the app.
4. Reload the dashboard, history, and each offline-enabled runner.
5. Complete and restart an active runner offline; verify exact restoration.
6. Disable airplane mode and verify a single canonical result, correct reward,
   and accessible cached answer review.
7. Repeat with two devices syncing in reverse completion order, including a
   Kiur sprint below half of the prior record.

Record iPhone model, iOS version, deployment SHA, and a short screen recording
for each completed gate.
