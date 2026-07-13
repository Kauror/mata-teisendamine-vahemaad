import { afterEach, describe, expect, it } from 'vitest';
import {
  advertisedProtocolVersion,
  advertisedSupportedProtocolVersions,
  assertOfflineProtocolConsistent,
  isOfflineProtocolV2Enabled
} from '@/lib/offline/protocol';

const original = process.env.OFFLINE_PROTOCOL_V2_ENABLED;

afterEach(() => {
  if (original === undefined) delete process.env.OFFLINE_PROTOCOL_V2_ENABLED;
  else process.env.OFFLINE_PROTOCOL_V2_ENABLED = original;
});

describe('offline write protocol advertisement', () => {
  it('advertises and enables only protocol v2 by default', () => {
    delete process.env.OFFLINE_PROTOCOL_V2_ENABLED;
    expect(isOfflineProtocolV2Enabled()).toBe(true);
    expect(advertisedProtocolVersion()).toBe(2);
    expect(advertisedSupportedProtocolVersions()).toEqual([2]);
    expect(() => assertOfflineProtocolConsistent()).not.toThrow();
  });

  it('rejects an attempted protocol-v1 downgrade', () => {
    process.env.OFFLINE_PROTOCOL_V2_ENABLED = '0';
    expect(() => assertOfflineProtocolConsistent()).toThrow(/protocol v1 writes are retired/);
  });
});
