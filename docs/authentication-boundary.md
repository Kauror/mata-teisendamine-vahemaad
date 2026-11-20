# Authentication and trusted proxy boundary

The production application must sit behind Cloudflare Tunnel and Cloudflare
Access. The Next.js container must not publish a public host port. Cloudflare
Access is a required outer authentication layer before the family credential and
parent password forms; the application credentials remain the inner family
authorization boundary.

Set `AUTH_TRUSTED_PROXY_MODE=cloudflare` only in that topology. The application
then uses Cloudflare's overwritten `CF-Connecting-IP` value as the source-rate
limit identity. It validates that the value is one IPv4 or IPv6 address and does
not use `User-Agent`, arbitrary `X-Forwarded-For`, or malformed multi-value
headers. Direct access to the application container would let a caller forge the
trusted header, so Docker networking and host firewalling must make direct public
access impossible.

`AUTH_TRUSTED_PROXY_MODE=reverse_proxy` is reserved for a controlled proxy that
overwrites `X-Real-IP`. `direct` deliberately groups all requests into one source
bucket and is suitable only for local development where Next.js has no reliable
socket-address API at the route layer.

Family and parent login scopes have separate per-source and global throttles.

- **Per source (client key):** five free failures, then an exponential block
  that doubles with every further failure (5 min, 10 min, 20 min, … capped at
  24 h). Failures are counted over 24 hours, so one address gets about 14
  guesses a day. One address cannot block another.
- **Global:** never blocks. After 30 failures in 15 minutes from all sources
  together, every login attempt waits a little before its credential is checked
  (200 ms per extra failure, at most 5 s). A stranger cannot lock the family out.

Successful login clears only the matching source bucket; it does not clear the
global slowdown. Expired limiter rows are removed opportunistically after seven
days.

**Recommended (Cloudflare dashboard, not code):** put a Cloudflare Access policy
or a WAF rate-limiting rule in front of `/api/access` and `/api/parent/login`,
for example "5 requests per minute per IP" on those paths. It stops guessing
before it reaches the container and costs nothing.

## Revoking sessions

- **Family sessions** carry a family epoch: a fingerprint of
  `APP_ACCESS_PIN_HASH` and the optional `APP_FAMILY_SESSION_EPOCH`. Changing the
  family PIN therefore signs every device out. To sign every device out without
  changing the PIN, set `APP_FAMILY_SESSION_EPOCH` to a new value and recreate
  the container. The epoch comes from configuration because the edge middleware
  verifies family sessions and cannot open SQLite. Sessions issued before the
  epoch existed are re-signed by the middleware on their next request (same CSRF
  token, same expiry). If the PIN is changed within 14 days of that release,
  also rotate `APP_SESSION_SECRET_CURRENT` (without a PREVIOUS) to drop any
  pre-epoch session that has not been seen since.
- **Parent sessions:** logout records the token in `parent_session_revocations`
  (by a hash of its unique CSRF value), and every parent check refuses it from
  then on. Changing the parent password still bumps `parent_auth_version`.

## Each device remembers its child

The family PIN lets any device in, so the family session alone cannot tell
Kiur's phone from Kirsi's. The parent, signed in on a device, chooses in
Vanem → Seaded → "See seade" whether it is Kiur's phone, Kirsi's phone or a
parent device (both children). The choice is a signed, HttpOnly cookie
(`device_child`, 400 days, re-signed monthly on page loads) that only
`/api/parent/device-binding` sets.

- Every child write route (shop purchase, freeze and gift, tasks, Kordamine,
  English sessions and kontrolltööd, textbook, Kaardimäng, offline sync pushes)
  refuses to act for the other child with 403 and an Estonian message.
- A navigation to the other child's pages redirects to the bound child. Service
  worker precache fetches are not redirected, so offline installs still work.
- A parent device keeps the old behaviour.
- **Migration:** unbound devices keep working exactly as before, so no child is
  locked out after the deploy. Vanem → Täna shows a prompt on an unbound device.
  Once every phone is bound, the parent switches on "Nõua sidumist"; from then on
  an unbound device cannot act for a child until a parent binds it.
- Rotating `APP_SESSION_SECRET_CURRENT` without a PREVIOUS unbinds every device.
- A device bound to one child that still holds the other child's unsynced
  offline records gets a 403 on that push; the records stay in its outbox. Bind
  it to "Vanema seade" briefly to let them sync.

Production startup also requires a working inner parent-authentication path.
The preferred model is enforced: `PARENT_PASSWORD_HASH` must contain a generated
scrypt hash unless the migrated database already contains a valid
`parent_password_hash`. A missing or malformed credential stops verified startup;
neither the password nor either hash is printed. Legacy plaintext database values
continue to migrate under the database migration lock. Changing the parent
password writes only a new scrypt hash and increments `parent_auth_version`, so
every previously issued parent session fails its version check immediately.
