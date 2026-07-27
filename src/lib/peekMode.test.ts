import { describe, expect, it } from 'vitest';
import {
  PARENT_PEEK_COOKIE,
  hasPeekCookie,
  isPeekModeActive,
  mayRecordSeenMarker
} from '@/lib/peekMode';

describe('hasPeekCookie', () => {
  it('finds the flag among the other cookies the app sets', () => {
    expect(hasPeekCookie(`app_access=abc; ${PARENT_PEEK_COOKIE}=1; parent_csrf=xyz`)).toBe(true);
  });

  it('tolerates the spacing browsers actually send', () => {
    expect(hasPeekCookie(`${PARENT_PEEK_COOKIE}=1`)).toBe(true);
    expect(hasPeekCookie(`a=1;${PARENT_PEEK_COOKIE}=1`)).toBe(true);
    expect(hasPeekCookie(`a=1 ;  ${PARENT_PEEK_COOKIE} = 1 `)).toBe(true);
  });

  it('is false without the cookie, or when it has been cleared to an empty value', () => {
    expect(hasPeekCookie('')).toBe(false);
    expect(hasPeekCookie(null)).toBe(false);
    expect(hasPeekCookie('app_access=abc')).toBe(false);
    expect(hasPeekCookie(`${PARENT_PEEK_COOKIE}=`)).toBe(false);
    expect(hasPeekCookie(`${PARENT_PEEK_COOKIE}=0`)).toBe(false);
  });

  it('does not match a cookie that merely ends with the flag name', () => {
    expect(hasPeekCookie(`not_${PARENT_PEEK_COOKIE}=1`)).toBe(false);
  });

  it('does not match the flag name appearing inside another cookie value', () => {
    expect(hasPeekCookie(`decoy=${PARENT_PEEK_COOKIE}=1`)).toBe(false);
  });
});

describe('isPeekModeActive', () => {
  it('is on for a parent, off for a child', () => {
    expect(isPeekModeActive({ cookieHeader: `${PARENT_PEEK_COOKIE}=1` })).toBe(true);
    expect(isPeekModeActive({ cookieHeader: 'app_access=abc' })).toBe(false);
  });

  it('lets the parent opt out per tab to see the page as the child does', () => {
    expect(isPeekModeActive({ cookieHeader: `${PARENT_PEEK_COOKIE}=1`, optedOut: true })).toBe(false);
  });
});

describe('mayRecordSeenMarker', () => {
  it('withholds the write only while peeking', () => {
    expect(mayRecordSeenMarker(false)).toBe(true);
    expect(mayRecordSeenMarker(true)).toBe(false);
  });
});
