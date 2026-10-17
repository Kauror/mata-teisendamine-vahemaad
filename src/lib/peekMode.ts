// Parent peek mode.
//
// The child pages carry a few one-shot notifications (yesterday's star recap,
// the exercise-milestone notice) whose "already seen" marker lives in the
// device's localStorage. A parent looking around to verify the deployment would
// consume those markers, and the child would never see the notice.
//
// So: when a valid parent session is present the middleware mirrors that fact
// into a readable cookie, and the child components stop writing the markers.
//
// Why a cookie rather than a prop rendered by the server component: the service
// worker caches the /kiur and /kirsi document responses into the offline shell
// (see public/sw.js). Baking "peek mode" into the HTML would let a parent visit
// poison the child's offline shell for the rest of the build. The HTML stays
// identical for everyone; only the cookie differs.
//
// The cookie is a UI hint, not an authorisation decision — it can only *stop*
// writes to local markers, so a stale one costs a repeated popup and nothing
// else. That is why the middleware may set it without the database-backed
// parent auth-version check that /api/parent/* mutations still perform.
//
// Peeking is also strictly read-only for the child's data (owner decision: the
// parent's view must not interfere with anything). The child pages refuse to
// start sessions, tick tasks or buy while peeking, and the middleware refuses
// the same child API writes whenever a signed parent session is on the request
// (it does not trust this readable cookie for that) — unless the parent chose
// "Vaata nagu laps", which sets PARENT_PEEK_OFF_COOKIE.

export const PARENT_PEEK_COOKIE = 'harjutaja_peek';
export const PARENT_PEEK_COOKIE_VALUE = '1';

// Matches MAX_AGE_SECONDS of the parent session in parentAuth.ts. Every guarded
// navigation refreshes or clears it, so this is only the ceiling for a device
// that stops navigating entirely.
export const PARENT_PEEK_MAX_AGE_SECONDS = 60 * 60 * 12;

// Per-tab escape hatch: lets a signed-in parent experience the page exactly as
// the child does (markers and all) without logging out.
export const PEEK_OPT_OUT_STORAGE_KEY = 'harjutaja:peek-off';

// The same choice mirrored into a browser-session cookie, so the server can
// tell "the parent is deliberately using the page as the child" from peeking.
// Set and cleared only by the banner's button.
export const PARENT_PEEK_OFF_COOKIE = 'harjutaja_peek_off';

export const PEEK_READ_ONLY_CODE = 'peek_read_only';
export const PEEK_READ_ONLY_MESSAGE = 'Vaatad lapse vaadet — siin ei saa harjutada.';
// Tasks, the shop and the server's refusal: not only practice.
export const PEEK_READ_ONLY_ACTION_MESSAGE = 'Vaatad lapse vaadet — lapse eest siin midagi ei muudeta.';

function hasCookieFlag(cookieHeader: string | null | undefined, name: string) {
  if (!cookieHeader) return false;
  return cookieHeader.split(';').some((part) => {
    const separator = part.indexOf('=');
    if (separator < 0) return false;
    return part.slice(0, separator).trim() === name
      && part.slice(separator + 1).trim() === PARENT_PEEK_COOKIE_VALUE;
  });
}

export function hasPeekCookie(cookieHeader: string | null | undefined) {
  return hasCookieFlag(cookieHeader, PARENT_PEEK_COOKIE);
}

export function hasPeekOptOutCookie(cookieHeader: string | null | undefined) {
  return hasCookieFlag(cookieHeader, PARENT_PEEK_OFF_COOKIE);
}

// The child-side API writes a peeking parent must not reach. Reads stay open,
// and so does /api/offline/sync: its pull keeps the parent's own device ready
// offline, and attempts are kept out of its outbox on the client instead.
export function isChildWritePath(pathname: string) {
  return pathname === '/api/english/sessions'
    || pathname.startsWith('/api/english/sessions/')
    // Textbook reading, practice and test writes. The parent preview lives
    // under /api/parent/textbook/preview and is the parent's own, so it is not
    // listed here.
    || pathname.startsWith('/api/textbook/')
    // Kaardimäng rounds (the preview lives under /api/parent/kaardimang).
    || pathname.startsWith('/api/kaardimang/')
    || pathname === '/api/tasks/complete'
    || pathname === '/api/remediation'
    || pathname.startsWith('/api/remediation/')
    || pathname === '/api/store/purchase'
    || pathname === '/api/store/freeze'
    || pathname === '/api/store/gift';
}

// Server side: a child write is refused when a verified parent session rides
// along and the parent has not switched to "Vaata nagu laps".
export function isPeekReadOnlyRequest(input: { parentSession: boolean; cookieHeader?: string | null }) {
  return input.parentSession && !hasPeekOptOutCookie(input.cookieHeader);
}

export function isPeekModeActive(input: { cookieHeader?: string | null; optedOut?: boolean }) {
  return hasPeekCookie(input.cookieHeader) && !input.optedOut;
}

// True when a one-shot notification may record that it has been seen. Peek mode
// is the only reason to withhold the write.
export function mayRecordSeenMarker(peekMode: boolean) {
  return !peekMode;
}
