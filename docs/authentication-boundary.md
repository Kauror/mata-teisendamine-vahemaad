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
