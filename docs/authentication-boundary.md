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
Successful login clears only the matching source bucket; it does not clear the
global distributed-attack bucket. Expired limiter rows are removed
opportunistically after seven days.

Production startup also requires a working inner parent-authentication path.
The preferred model is enforced: `PARENT_PASSWORD_HASH` must contain a generated
scrypt hash unless the migrated database already contains a valid
`parent_password_hash`. A missing or malformed credential stops verified startup;
neither the password nor either hash is printed. Legacy plaintext database values
continue to migrate under the database migration lock. Changing the parent
password writes only a new scrypt hash and increments `parent_auth_version`, so
every previously issued parent session fails its version check immediately.
