import { describe, expect, it } from 'vitest';
import {
  PARENT_PEEK_COOKIE,
  PARENT_PEEK_OFF_COOKIE,
  hasPeekCookie,
  hasPeekOptOutCookie,
  isChildWritePath,
  isPeekReadOnlyRequest,
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

describe('read-only peek on the server', () => {
  it('refuses child writes while a parent session rides along, unless the parent chose to act as the child', () => {
    expect(isPeekReadOnlyRequest({ parentSession: true, cookieHeader: `${PARENT_PEEK_COOKIE}=1` })).toBe(true);
    expect(isPeekReadOnlyRequest({ parentSession: true, cookieHeader: null })).toBe(true);
    expect(isPeekReadOnlyRequest({ parentSession: true, cookieHeader: `${PARENT_PEEK_COOKIE}=1; ${PARENT_PEEK_OFF_COOKIE}=1` })).toBe(false);
  });

  it('never refuses a child without a parent session, whatever cookies are sent', () => {
    // The readable peek cookie alone is not trusted for this decision.
    expect(isPeekReadOnlyRequest({ parentSession: false, cookieHeader: `${PARENT_PEEK_COOKIE}=1` })).toBe(false);
  });

  it('reads the opt-out cookie exactly', () => {
    expect(hasPeekOptOutCookie(`${PARENT_PEEK_OFF_COOKIE}=1`)).toBe(true);
    expect(hasPeekOptOutCookie(`${PARENT_PEEK_OFF_COOKIE}=`)).toBe(false);
    expect(hasPeekOptOutCookie(`x_${PARENT_PEEK_OFF_COOKIE}=1`)).toBe(false);
  });

  it('covers every child write endpoint and leaves reads and sync alone', () => {
    for (const path of ['/api/english/sessions', '/api/english/sessions/vs_x', '/api/tasks/complete', '/api/remediation', '/api/remediation/abc', '/api/store/purchase', '/api/store/freeze', '/api/store/gift']) {
      expect(isChildWritePath(path)).toBe(true);
    }
    for (const path of ['/api/english/units', '/api/offline/sync', '/api/parent/tasks', '/api/history', '/api/store']) {
      expect(isChildWritePath(path)).toBe(false);
    }
  });
});
