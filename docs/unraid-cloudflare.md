# Unraid and Cloudflare Tunnel deployment

The production topology deliberately has no direct LAN or public application
port. The `app` service has no Compose `ports` entry and is reachable only as
`http://pikkuste-harjutaja:3000` on the named Docker network
`pikkuste-harjutaja-edge`. Cloudflare Tunnel is the only ingress. If LAN access
is added later, bind it to a specific trusted LAN address and reassess the
trusted-proxy/authentication boundary; never add `0.0.0.0:3000:3000`.

## Unraid paths and permissions

The checkout lives at `/mnt/user/appdata/mata-teisendamine-vahemaad` (the
repository name). Its `data/` folder is mounted at `/data` in the container
(compose default `APP_DATA_DIR=./data`; if `.env` sets `APP_DATA_DIR`, it must
point at that same folder).

The compose file sets `MATHS_GAME_DB_FILE=/data/maths-game.sqlite`,
`MATHS_GAME_BACKUP_DIR=/data/backups` and
`SCHOOL_TIMETABLE_FILE=/data/school-timetable.json`. The host data folder must
be writable by container UID/GID 1000. The image runs as the non-root `node`
user, the root filesystem is read-only, and only `/data` plus the bounded `/tmp`
tmpfs are writable.

The checkout also holds two **untracked** things the deploy relies on:
`docker-compose.override.yml` and `backups/`. Never run `git clean` there.

### The school timetable

The children's timetable is private and is not in the repository. Place it as
`data/school-timetable.json` in the checkout (format and a fictional example:
`src/lib/schoolTimetable.example.json`), owned by UID 1000 and readable by the
container. Without it the app runs and simply shows no timetable; the app log
says `School timetable unavailable`. To change the timetable later, replace the
file; the app reads it again when its modification time changes.

## Credentials and exact origin

Copy `.env.example` to `.env`. Generate separate family and parent hashes on a
development machine with `npm run auth:hash -- <secret>` (the production image
has no npm) and keep the hashes single-quoted so Compose does not interpolate
their `$` characters. Set a random session secret of at least 32 characters and
the exact public HTTPS origin, without a path or trailing slash:

```dotenv
APP_ORIGIN=https://harjutaja.example.com
CLOUDFLARE_TUNNEL_TOKEN=replace-with-the-tunnel-token
```

Changing `APP_ACCESS_PIN_HASH` signs every device out (see
`docs/authentication-boundary.md`).

Create a Cloudflare Access application for that hostname, and a WAF
rate-limiting rule for `/api/access` and `/api/parent/login`. In the Tunnel
public hostname configuration, route the hostname to the Docker-network origin
`http://pikkuste-harjutaja:3000` — not `127.0.0.1`, `localhost`, or an Unraid
host port. The bundled tunnel service publishes no ports and binds its metrics
listener to container loopback (`127.0.0.1:2000`).

The tunnel (`cloudflared`, compose profile `tunnel`) is started once and then
left alone: an app release never recreates it. That is why every release command
below uses `--no-deps` and names the `app` service.

`init: true` is enabled for both services. Verified startup checks, backs up,
migrates and validates the database before Next.js starts; SIGTERM/SIGINT are
forwarded to Next.js for bounded shutdown. The app container stops restarting
after five failed starts (`restart: on-failure:5`); see "Recovery" below.

The runtime is the digest-pinned `node:22.23.1-alpine3.23` image from the
`Dockerfile`, and cloudflared is pinned to `2026.7.0` by digest. The production
image has **no npm**: run scripts with
`docker compose run --rm --no-deps app ./node_modules/.bin/tsx scripts/<name>.ts`.
The root filesystem is read-only, so ad-hoc code is fed through
`docker exec -i pikkuste-harjutaja node -`.

## Release runbook

Run on the Unraid host. `<sha>` is the reviewed commit; the image tag of the
running release (`docker inspect pikkuste-harjutaja --format '{{.Config.Image}}'`)
is the rollback.

```sh
cd /mnt/user/appdata/mata-teisendamine-vahemaad
```

1. **Before:** take a read-only database snapshot (publication rows, star sums
   per child, attempts, migration count) by feeding a snapshot script through
   `docker exec -i pikkuste-harjutaja node - < snapshot.js`, and note the numbers.
2. **Check out and build** (about 5 minutes; the running app is untouched):
   ```sh
   git fetch -q origin && git checkout -q <sha>
   APP_VERSION=$(date +%Y.%m.%d) APP_IMAGE_TAG=<sha> docker compose build app
   ```
3. **Release:** stop the app, archive the data folder, verify the archive, start
   the new image without touching the tunnel:
   ```sh
   docker compose stop app
   tar -C . -czf backups/data-pre-<sha>.tgz data && tar -tzf backups/data-pre-<sha>.tgz >/dev/null
   APP_VERSION=$(date +%Y.%m.%d) APP_IMAGE_TAG=<sha> docker compose up -d --no-deps --force-recreate app
   ```
4. **Wait for `(healthy)`** in `docker compose ps`. The log shows
   `Database startup verification passed: {...}` with integrity, migration
   count and balances. The health check reads SQLite, takes the write lock and
   checks free space on the data volume.
5. **After:** run the snapshot again. Balances, attempts and publication rows
   must equal the "before" snapshot.
6. **Probes** from outside: the public `/access` page answers 200; a child API
   without a session answers 401; API responses carry `Cache-Control: no-store`.
7. **Record** the SHA, image tag, backup archive and balances.

## Rollback

Stop the new app first. Never run old code against a database a newer release
migrated: restore the matching pre-release archive, then start the old image.

```sh
cd /mnt/user/appdata/mata-teisendamine-vahemaad
docker compose stop app
mv data data.failed-<sha>
tar -C . -xzf backups/data-pre-<sha>.tgz
git checkout -q <old-sha>
APP_IMAGE_TAG=<old-sha> docker compose up -d --no-deps --force-recreate app
```

If the release ran no migration, the old image can start on the current data
without the restore. Keep `data.failed-<sha>` until the cause is understood.

## Recovery

- **The app keeps failing to start:** after five failed starts Docker stops
  restarting it. Read `docker compose logs --tail=300 app`. A corrupt database
  fails the startup integrity check before any copy is made, and at most three
  startup backups are written per hour. Restore the last good copy (nightly
  backup or `backups/data-pre-<sha>.tgz`) with the app stopped, then start it
  with the release command above.
- **After an Unraid reboot**, check that the app container is running
  (`docker compose ps`); start it with
  `docker compose up -d --no-deps app` if not.
- Replace the live SQLite files only with the application stopped, and never
  delete the host data folder.
