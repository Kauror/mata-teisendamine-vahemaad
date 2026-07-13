# Unraid and Cloudflare Tunnel deployment

The production topology deliberately has no direct LAN or public application
port. The `app` service has no Compose `ports` entry and is reachable only as
`http://pikkuste-harjutaja:3000` on the named Docker network
`pikkuste-harjutaja-edge`. Cloudflare Tunnel is the only ingress. If LAN access
is added later, bind it to a specific trusted LAN address and reassess the
trusted-proxy/authentication boundary; never add `0.0.0.0:3000:3000`.

## Unraid paths and permissions

Clone the checkout at `/mnt/user/appdata/pikkuste-harjutaja` and set this in
`.env`:

```dotenv
APP_DATA_DIR=/mnt/user/appdata/pikkuste-harjutaja/data
MATHS_GAME_DB_FILE=/data/maths-game.sqlite
MATHS_GAME_BACKUP_DIR=/data/backups
```

Create the host data directory and make it writable by container UID/GID 1000.
The image runs as the non-root `node` user, the root filesystem is read-only,
and only `/data` plus the bounded `/tmp` tmpfs are writable. SQLite is stored at
`/data/maths-game.sqlite`; pre-migration backups remain under `/data/backups`.

## Credentials and exact origin

Copy `.env.example` to `.env`. Generate separate family and parent hashes with
`npm run auth:hash -- <secret>` and keep the hashes single-quoted so Compose
does not interpolate their `$` characters. Set a random 32-byte-or-longer
session secret and the exact public HTTPS origin, without a path or trailing
slash:

```dotenv
APP_ORIGIN=https://harjutaja.example.com
CLOUDFLARE_TUNNEL_TOKEN=replace-with-the-tunnel-token
```

Create a Cloudflare Access application for that hostname. In the Tunnel public
hostname configuration, route the hostname to the Docker-network origin
`http://pikkuste-harjutaja:3000` — not `127.0.0.1`, `localhost`, or an Unraid
host port. The bundled tunnel service publishes no ports and binds its metrics
listener to container loopback (`127.0.0.1:2000`). Start both services with:

```sh
docker compose --profile tunnel config
docker compose --profile tunnel up -d --build
```

`init: true` is enabled for both services. Verified startup migrates, backs up,
and validates the database before Next.js starts; SIGTERM/SIGINT are forwarded
to Next.js for bounded shutdown. Check `docker compose logs app` for the database
verification message and wait for the health check before directing traffic.

The Node runtime is pinned to the explicit `22.22.3-alpine3.23` tag and the
cloudflared service to `2026.7.0`. Before a release, resolve both tags to the
approved architecture-specific registry digests and set immutable image
references in the release change; digest changes require the normal container
gate. The final app image installs production dependencies only. `tsx` remains a
production dependency because it runs the verified startup script.

To replace the app without losing data, keep `APP_DATA_DIR` unchanged and run
`docker compose up -d --build --force-recreate app`. Do not remove the host data
directory. Restore only from a reviewed backup and keep the application stopped
while replacing the live SQLite files.

## Release and rollback runbook

Run these commands on Unraid. Replace `RELEASE_SHA` only with the reviewed
candidate SHA; keep the old SHA and image until acceptance completes.

```sh
cd /mnt/user/appdata/pikkuste-harjutaja
OLD_SHA=$(git rev-parse HEAD); OLD_IMAGE=$(docker image inspect pikkuste-harjutaja:local --format '{{.Id}}' 2>/dev/null || true)
git fetch origin && git checkout RELEASE_SHA
test -f .env || cp .env.example .env
mkdir -p /mnt/user/appdata/pikkuste-harjutaja/backups
docker compose stop app
tar -C /mnt/user/appdata/pikkuste-harjutaja -czf /mnt/user/appdata/pikkuste-harjutaja/backups/data-pre-RELEASE_SHA.tgz data
tar -tzf /mnt/user/appdata/pikkuste-harjutaja/backups/data-pre-RELEASE_SHA.tgz >/dev/null
docker compose build --pull app
docker compose run --rm --no-deps app npm run audit:v2 -- /data/maths-game.sqlite
docker compose --profile tunnel up -d --force-recreate
docker compose ps
docker compose logs --tail=300 app
curl -fsS http://pikkuste-harjutaja:3000/api/healthz
```

Rollback only after stopping the new app. Never run old code against a migrated
database; restore the matching pre-deployment archive first.

```sh
cd /mnt/user/appdata/pikkuste-harjutaja
docker compose down
mv data data.failed-RELEASE_SHA
mkdir data
tar -C /mnt/user/appdata/pikkuste-harjutaja -xzf /mnt/user/appdata/pikkuste-harjutaja/backups/data-pre-RELEASE_SHA.tgz
git checkout "$OLD_SHA"
docker compose up -d --force-recreate
```
