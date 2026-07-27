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

export const PARENT_PEEK_COOKIE = 'harjutaja_peek';
export const PARENT_PEEK_COOKIE_VALUE = '1';

// Matches MAX_AGE_SECONDS of the parent session in parentAuth.ts. Every guarded
// navigation refreshes or clears it, so this is only the ceiling for a device
// that stops navigating entirely.
export const PARENT_PEEK_MAX_AGE_SECONDS = 60 * 60 * 12;

// Per-tab escape hatch: lets a signed-in parent experience the page exactly as
// the child does (markers and all) without logging out.
export const PEEK_OPT_OUT_STORAGE_KEY = 'harjutaja:peek-off';

export function hasPeekCookie(cookieHeader: string | null | undefined) {
  if (!cookieHeader) return false;
  return cookieHeader.split(';').some((part) => {
    const separator = part.indexOf('=');
    if (separator < 0) return false;
    return part.slice(0, separator).trim() === PARENT_PEEK_COOKIE
      && part.slice(separator + 1).trim() === PARENT_PEEK_COOKIE_VALUE;
  });
}

export function isPeekModeActive(input: { cookieHeader?: string | null; optedOut?: boolean }) {
  return hasPeekCookie(input.cookieHeader) && !input.optedOut;
}

// True when a one-shot notification may record that it has been seen. Peek mode
// is the only reason to withhold the write.
export function mayRecordSeenMarker(peekMode: boolean) {
  return !peekMode;
}
