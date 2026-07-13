import { OFFLINE_PROTOCOL_VERSION } from '@/lib/shared/types';

// Protocol v2 is the only write protocol. The legacy environment switch remains
// only as a deployment assertion: an explicit `0` is invalid instead of silently
// downgrading to unverifiable protocol-v1 writes.

const V2_ENV = 'OFFLINE_PROTOCOL_V2_ENABLED';

export function isOfflineProtocolV2Enabled(): boolean {
  return process.env[V2_ENV] !== '0';
}

// The ping endpoint advertises only the authoritative write protocol.
export function advertisedProtocolVersion(): 1 | 2 {
  return OFFLINE_PROTOCOL_VERSION;
}

export function advertisedSupportedProtocolVersions(): Array<1 | 2> {
  return [OFFLINE_PROTOCOL_VERSION];
}

// Startup invariant: refuse to boot if the server would advertise a protocol it
// cannot honour. With advertisedProtocolVersion derived from the same flag this
// can only fire if the two ever drift apart in future changes — a guard, not a
// speculative failure. Also rejects a malformed flag value in production so a
// typo like OFFLINE_PROTOCOL_V2_ENABLED=true does not silently downgrade v2.
export function assertOfflineProtocolConsistent(): void {
  const raw = process.env[V2_ENV];
  if (raw !== undefined && raw !== '1') {
    throw new Error(
      `${V2_ENV} must be exactly "1" when set; protocol v1 writes are retired, got ${JSON.stringify(raw)}.`
    );
  }
  if (process.env.NODE_ENV === 'production' && !isOfflineProtocolV2Enabled()) {
    throw new Error('Offline protocol v2 is advertised by ping but not enabled for attempt insertion.');
  }
}
