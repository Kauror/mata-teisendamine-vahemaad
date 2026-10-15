// The two reads a child page makes after hydration: the dashboard (points,
// streak, trophies, achievements, today's tasks) and the family notice.
//
// Why preloaded rather than rendered into the HTML: the service worker stores
// the /kiur and /kirsi documents as the offline shell (scripts/sw-template.js),
// so any number baked into the document is replayed on an offline launch —
// possibly days later, as if it were today — and the document must stay
// identical for every visitor (see peekMode.ts). The page therefore keeps no
// child data in its HTML. Instead the document carries
// <link rel="preload" as="fetch" crossorigin> for these URLs, so the browser
// starts both requests while it is still downloading the JavaScript, and the
// components' own fetch() picks up the in-flight response instead of starting
// the request only after hydration. Offline, the preload simply fails and the
// components fall back to the IndexedDB snapshot exactly as before.
//
// The preload is only reused when the fetch matches it exactly: same URL, and
// CORS mode with same-origin credentials, which is what a plain same-origin
// fetch() is and what crossorigin="anonymous" produces. So the URLs live here,
// and both the preload and the fetch build them from these helpers.

type Learner = 'kiur' | 'kirsi';

export const NOTICE_URL = '/api/notice';

export function childDashboardUrl(learner: Learner) {
  return `/api/child-dashboard?learner=${learner}`;
}

// Options for react-dom's preload(): as="fetch" plus crossorigin="" so the
// request mode matches a default fetch() and the browser can hand it over.
export const CHILD_PAGE_DATA_PRELOAD = { as: 'fetch', crossOrigin: 'anonymous' } as const;

// Depends on the route's learner only — never on who is looking — so the
// document stays the same for the child and for a peeking parent.
export function childPageDataPreloads(learner: Learner) {
  return [childDashboardUrl(learner), NOTICE_URL];
}
