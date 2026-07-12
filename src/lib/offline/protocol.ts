import { LEGACY_OFFLINE_PROTOCOL_VERSION, OFFLINE_PROTOCOL_VERSION } from '@/lib/shared/types';

// Single source of truth for whether offline protocol v2 is switched on. Both the
// ping endpoint (what the server advertises) and the attempt-insertion path (what
// the server actually accepts) read this, so the two can never disagree: the
// server never advertises a protocol it would then reject. See RTM-002.

const V2_ENV = 'OFFLINE_PROTOCOL_V2_ENABLED';

export function isOfflineProtocolV2Enabled(): boolean {
  return process.env[V2_ENV] === '1';
}

// The protocol version the ping endpoint advertises to clients. Never advertise
// v2 unless v2 attempt insertion is actually enabled.
export function advertisedProtocolVersion(): 1 | 2 {
  return isOfflineProtocolV2Enabled() ? OFFLINE_PROTOCOL_VERSION : LEGACY_OFFLINE_PROTOCOL_VERSION;
}

export function advertisedSupportedProtocolVersions(): Array<1 | 2> {
  return isOfflineProtocolV2Enabled()
    ? [OFFLINE_PROTOCOL_VERSION, LEGACY_OFFLINE_PROTOCOL_VERSION]
    : [LEGACY_OFFLINE_PROTOCOL_VERSION];
}

// Startup invariant: refuse to boot if the server would advertise a protocol it
// cannot honour. With advertisedProtocolVersion derived from the same flag this
// can only fire if the two ever drift apart in future changes — a guard, not a
// speculative failure. Also rejects a malformed flag value in production so a
// typo like OFFLINE_PROTOCOL_V2_ENABLED=true does not silently downgrade v2.
export function assertOfflineProtocolConsistent(): void {
  const raw = process.env[V2_ENV];
  if (raw !== undefined && raw !== '0' && raw !== '1') {
    throw new Error(
      `${V2_ENV} must be exactly "1" (enabled) or "0"/unset (disabled), got ${JSON.stringify(raw)}.`
    );
  }
  if (advertisedProtocolVersion() === OFFLINE_PROTOCOL_VERSION && !isOfflineProtocolV2Enabled()) {
    throw new Error('Offline protocol v2 is advertised by ping but not enabled for attempt insertion.');
  }
}
