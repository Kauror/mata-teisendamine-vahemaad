---
name: harjutaja
description: Working on the Harjutaja learning app (Kauror/mata-teisendamine-vahemaad) — its Next.js/React code, the single globals.css, the child and parent pages, or its Playwright suites. Covers how to actually see the password-gated UI, how to measure layout before/after, which file owns which UI block, and the 44px + design-token conventions. Use whenever a task touches this repo.
---

# Harjutaja

Estonian learning app for two children, Kiur and Kirsi. Next.js 15 App Router,
React 19, better-sqlite3, **one** stylesheet (`src/app/globals.css`), Estonian UI
text throughout. Offline/PWA matters — it is installed on real phones.

## Read this first, in this order

1. **You cannot open the app in a browser.** Every route is behind a family
   passphrase. Do not try to type one — use the Playwright harness (below).
2. **The design lives in Claude Design, not on disk.** Mockups and the
   implementation brief are in DesignSync project
   `2ee05e12-d747-4d6d-9434-e8410fc5cf08` ("Mata teisendamine vahemaad").
   Call `list_files` on it *before* searching the filesystem — `claude-code-juhend.md`
   (the numbered implementation guide) is there, not in the repo. A recursive
   `find` over the user's home directory will time out and find nothing.
3. **`npm run test:e2e` costs ~4.2 minutes.** Run it **once, at the end**. Do all
   polishing before verification, never after. Costs: `lint` ~20s,
   `typecheck` ~10s, `test` (355 unit tests) ~5s, `test:e2e` ~4.2min (40 tests,
   Chromium + WebKit).

## Seeing and measuring the UI

The e2e harness is self-contained: its own SQLite file (`.e2e-data/e2e.sqlite`,
rebuilt empty each run), its own test credentials in `playwright.config.ts`, its
own dev server. `e2e/auth.ts` signs in. This is the only way to observe the
authenticated UI, and it touches no real data.

Drop a temporary spec in `e2e/`, run it with `--project=chromium`, read the
`console.log`, then delete it:

```ts
import { expect, test } from './test';
import { authenticateFamily } from './auth';
import { navigateStable } from './navigation';

test.beforeEach(async ({ page }) => authenticateFamily(page));

test('MEASURE', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await navigateStable(page, '/kiur');
  // The panel is async — measuring before /api/child-dashboard lands gives a
  // half-rendered page. Wait for something the response produces.
  await expect(page.locator('.achievement-badge')).toHaveCount(3);

  const y = await page.getByRole('heading', { name: 'Päevased tegevused' })
    .evaluate((n) => n.getBoundingClientRect().top + window.scrollY);
  console.log(`Y=${Math.round(y)}`);
});
```

```bash
npx playwright test e2e/_measure.spec.ts --project=chromium --reporter=list
```

Measure **document-relative Y** (`getBoundingClientRect().top + scrollY`), not
`offsetTop`: `offsetTop` is relative to the nearest positioned ancestor, so a
restructure silently changes what it means and before/after stop comparing.

For a before/after saving, also dump a breakdown (`y`, `h`, `padding`, `gap`) of
each block above the target — it shows immediately whether a target is even
reachable before you spend time tuning toward it.

## Where UI blocks actually live

The surprising ones — these are not where the page suggests:

| On screen | Actually in |
|---|---|
| Child profile page shell, back link | `components/ChildHomeDashboard.tsx` |
| Avatar + name (**5 taps → hidden Paarid game**) | `components/ChildAvatarEasterEgg.tsx` |
| Points ⭐🔥🏆❄️, Pood/Ajalugu, achievements, daily tasks | `components/DailyTasksPanel.tsx` — **all four**, not the profile page |
| Home dashboard cards + tug-of-war leaderboard | `app/page.tsx` |
| Exercise cards, done/count pills | `components/ChildExerciseGrid.tsx` + `lib/childExerciseCards.ts` |
| Achievement data (derived per read, never stored) | `lib/achievements.ts` |
| Tooltip/aria strings | `lib/metricTooltips.ts` |
| Estonian number agreement | `lib/history.ts` |

`ChildHomeDashboard` passes the avatar/name into `DailyTasksPanel` as an
`identity` slot, because the identity card holds all four blocks.

## Conventions that are enforced

**Tokens.** Every value goes in `:root` in `globals.css`. No new one-off hex
outside `:root`, no inline styles in components. Existing families:
`--learner-*` (per-child colour via `data-accent="blue|pink"`), `--card-*`,
`--page-bg`, `--identity-*`, `--pill-*`, `--achievement-*`, `--accent-icon-*`.

**44px touch targets, everywhere.** `globals.css:87` sets a global
`button{min-height:44px}`. When a control must *look* smaller, keep the 44px as
a transparent bleed and override the box:

```css
.thing{position:relative;min-height:30px}      /* override the global floor */
.thing::after{content:'';position:absolute;inset:-7px 0}  /* 30 + 7 + 7 = 44 */
```

Never shrink a target below 44px without the bleed. `e2e/accessibility.spec.ts`
asserts this, including the bleed.

**Estonian agreement.** Never interpolate a bare count into UI text. Use
`exerciseWord`, `dayWord`, `trophyWord`, `questionWord` from `lib/history.ts`
(and `freezeWord` from `lib/streakFreezeNotice.ts`). "1 harjutust" is a bug;
"1 harjutus" is correct. There are unit tests guarding exactly this.

`starWord` is the odd one out: it takes the **formatted string**, not a number,
because "1,5" stays partitive while "1" does not — always
`starWord(formatStars(value))`.

**`MetricTooltip`.** Its `label` prop is *both* the visible tooltip and the
`aria-label`. If a visible caption is shortened or an icon dropped, the label
must carry what was lost. Its hover reveal is gated behind
`@media (hover:hover) and (pointer:fine)` — do not un-gate it, or phones open
tooltips under a scrolling finger.

**One layout.** Prefer changing a base rule over adding a breakpoint override.
When a redesign makes old `@media (max-width:560|640|700|720px)` rules obsolete,
**delete** them rather than overriding them.

## Traps

- **Never run a scripted regex over a CSS selector list.** A partial match
  produced `...::before::before`, and one invalid compound invalidates the
  *entire* comma-separated rule — silently, with no build error. Use targeted
  `Edit` calls. To verify a rule survived, read the parsed CSSOM in a temp spec
  rather than eyeballing the file.
- When restructuring a flex/wrap row into a single row, re-check any
  `:nth-child()` edge-alignment rules — the child that used to be first on the
  second row is now the last on the only row.
- **Never put `overflow-x:auto` on a short row that contains a `MetricTooltip`.**
  Once one axis is non-`visible`, the other computes to `auto` too, so a 30px
  row clips away the tooltip that renders below it. `.achievement-strip` gates
  its scrolling behind `:has(.metric-tooltip:nth-child(4))` for exactly this
  reason. The same applies to any future strip built the same way.
- **Overflow clipping is invisible to the obvious assertions.** Playwright's
  `toBeVisible()`, and `getComputedStyle().visibility`, both pass on a tooltip
  that an ancestor has clipped out of sight. `document.elementFromPoint` is no
  help either, because `.metric-tooltip-content` is `pointer-events:none` and
  hit-testing skips it — that produces a test which fails identically whether
  the bug is present or not. To test it, intersect the element's rect against
  every ancestor whose overflow is not `visible` and assert how much survives
  (see "an achievement tooltip is actually painted" in
  `e2e/accessibility.spec.ts`). Always confirm such a test fails against the
  unfixed CSS before trusting it.
- `e2e/accessibility.spec.ts` asserts accessible-name *shapes* by regex. If a
  label changes, rewrite the regex to match the new shape — do not loosen it to
  `.*`.
- Unit tests are `vitest` (`src/**/*.test.ts`); the two Playwright suites are
  separate: `e2e/` (`npm run test:e2e`) and `e2e-audit/`
  (`npm run test:e2e:audit`, own config and DB).
- `.env.local` holds the real dev secrets. Leave it alone.

## Commands

```bash
npm run lint && npm run typecheck && npm test   # fast, run freely
npm run test:e2e                                 # ~4.2 min, run once at the end
npx playwright test e2e/<file> --project=chromium --reporter=list  # single spec
```

Commits go straight to `main` (no PR flow). Match the existing message style:
a sentence in the imperative, no `feat:`/`fix:` prefix — e.g. "Give the app a
display face, a colour per child, and softer cards".
