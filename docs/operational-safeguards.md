# Production operational safeguards

## Health and recovery

`/api/healthz` is deliberately a cheap public liveness probe and does not touch SQLite. Authenticated parents can use `/api/parent/readiness` for a minimal database read, required-table check, migration-count check, and verified-startup-state check. The response exposes only `ready: true` or `ready: false`.

Before migrations, startup creates and fsyncs a SQLite online backup. Retention runs only after the live database passes integrity, foreign-key, semantic, and migration verification. `BACKUP_RETENTION_DAYS` defaults to 30 and `BACKUP_RETENTION_MAX_COUNT` defaults to 10. The current deployment backup and newest successful backup are never deleted; logs contain backup basenames only.

## Browser and edge policy

The app sends CSP, `nosniff`, referrer, permissions, anti-framing, and HSTS headers. Production CSP keeps `unsafe-inline` for Next.js bootstrap/style compatibility but does not allow `unsafe-eval`, third-party origins, plugins, or framing. The development server alone receives `unsafe-eval`, which its runtime requires. Service-worker scripts and blob workers remain allowed from this origin.

Cloudflare must also enable HSTS for the public hostname because the edge terminates HTTPS. Do not expose the container directly, and configure the tunnel origin as `http://pikkuste-harjutaja:3000` on the named Docker network.

## Release security gates

CI fails on high or critical production npm dependency findings, detected secrets, high or critical Docker/Compose misconfiguration, and fixable high or critical findings in the built production image. Unfixed base-image findings are reported but are a documented exception because no patched package exists; update the pinned base image as soon as a fixed release is available. Development-only dependency findings do not block a production release, though they should still be maintained separately.
