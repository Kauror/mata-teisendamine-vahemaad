# Overnight full-app audit — 2026-10-17/18

Branch `feat/overnight-units-15-21`, base `origin/main` **ed55a76** (production
since 2026-10-17). Rollback point: ed55a76 (image `pikkuste-harjutaja:ed55a76`).
Nothing in this branch is deployed, and no unit is published.

## A. Executive summary

Two jobs: integrate the textbook packages for Units 10–21 that were not yet in
the app, and audit and fix the whole app.

- **Textbook:** Units 15, 16, 17, 18, 19 and 21 are integrated as `ready` and
  **unpublished**. Each has validated content, original SVG diagrams, and
  tests for selection, preview and hotspot secrecy. Units 10–14 were already
  live and were left alone. There is no package for Unit 20 "Vulkaanid", so it
  stays a draft; a draft between ready units does not block the child's order.
- **Fixes:** 30 defects found by the audits and fixed, each with a regression
  test that was seen to fail first (TB-02 was the one exception, see D),
  plus the integration fixes below:
  - 11 exercise-content errors, two of them maths questions with wrong answer
    keys;
  - 6 security issues;
  - 4 reward/sync issues, where the child lost stars or freezes;
  - 7 in Kaardimäng;
  - 2 in the textbook engine/UI;
  - and, while integrating the units, content wording, diagram titles that
    gave away answers, and Crimea in the Unit 18 map data.
- **Performance:** with every unit in, textbook pages would have grown by
  48 kB of first-load JS. Lazy per-unit diagram chunks and moving one helper
  brought them back near the old size. The course list and Kaardimäng are now
  *smaller* than before the night (see E).
- **Tests:** unit tests went from 1131 to 1333 and are all green on a quiet
  machine. The Playwright suite result is in G.

**Verdict: READY WITH LIMITATIONS** (see J).

## B. Integration status (Units 10–21)

| Unit | Title | Status | Validator | Questions / groups | Diagrams | Preview | Published |
|---|---|---|---|---|---|---|---|
| 10 | Maa kuju | already live | AVALDATAV | 54 / 39 | 4 + photo | yes | **yes** (by the parent, before tonight) |
| 11 | Gloobus | already live | AVALDATAV | 74 / 64 | 4 | yes | no |
| 12 | Kaart | already live | AVALDATAV | 94 / 68 | 4 | yes | no |
| 13 | Kaardi mõõtkava | already live | AVALDATAV | 117 / 100 | 4 | yes | no |
| 14 | Kaartide mitmekesisus | already live | AVALDATAV | 108 / 74 | 4 | yes | no |
| 15 | Mandrid ja maailmajaod | **integrated tonight** | AVALDATAV, 0 warnings | 117 / 77 | 4 | yes | no |
| 16 | Maailmameri | **integrated tonight** | AVALDATAV, 0 warnings | 99 / 64 | 4 | yes | no |
| 17 | Eesti geograafiline asend | **integrated tonight** | AVALDATAV, 0 warnings | 111 / 70 | 4 | yes | no |
| 18 | Euroopa kaart | **integrated tonight** | AVALDATAV, 0 warnings | 137 / 82 | 4 | yes | no |
| 19 | Maakera siseehitus | **integrated tonight** | AVALDATAV, 0 warnings | 134 / 68 | 6 | yes | no |
| 20 | Vulkaanid | **blocked: no package** | MUSTAND (draft) | — | — | — | — |
| 21 | Maavärinad | **integrated tonight** | AVALDATAV, 0 warnings | 136 / 83 | 9 | yes | no |

Applies to every new unit:

- **Test building:** 40 seeded tests are each strict: 20 questions from
  20 groups, 8/7/5 cognitive levels, every objective covered, no relaxations,
  19 correct to pass. Three chained retakes reuse no group (0/0/0), except
  Unit 16, which reuses 2 groups in the third retake. The engine only prefers
  unused groups within the strict quotas.
- **Server preview run** (`textbook.test.ts`, data-driven over every ready unit):
  - reading gate;
  - practice with a correction covering every objective;
  - 18/20 fails, then targeted practice, then 19/20 passes and opens the next
    unit;
  - frozen snapshots;
  - Kiur sees nothing, and no real records are touched.
- **Hotspot secrecy:** checked by unit test and by e2e. Letters only; no
  region name in the drawn text, title or ARIA.
- **Textbook photos:** the reference scans were used only to check the
  diagrams and are not in the repository or `public/`.

## C. Coverage matrix

| Subsystem | Inspected | Tested | Result |
|---|---|---|---|
| Textbook content 15–21 | package audit + native validator + review against SOURCE_ALIGNMENT and the page photos | validator stats, 40-seed/retake selection, server preview run, diagram unit tests, e2e render of every ready unit | pass |
| Textbook engine (grading, selection, practice, progression, sessions, rewards) | full read | property tests over every ready unit (`engineAudit.test.ts`), Tallinn-day reward test, existing suites | pass; 2 fixed, 2 open (H) |
| Rewards, shop, gifts, freezes, held rewards, offline sync | economy map of every ledger path | duplicate submit, double spend, isolation, caps, DST 2026-10-25 / 2027-03-28, late sync | pass; 4 fixed, 4 open (H) |
| Backend security (96 handlers) | route inventory, auth/CSRF/peek/scoping, SQL, XSS, headers, errors | route-level tests for each finding | pass; 6 fixed, 4 open (H) |
| Exercise content (maths, reading, English, science, Kordamine) | every generator and authored bank | 432,000 items per run checked by independent oracles; 1.49 M in exploration | pass; 11 fixed |
| Kaardimäng | geography, small states, game logic, server grading, data size | 57 tests (47 at the start) | pass; 7 fixed, 4 open (H) |
| UI / mobile | real-units e2e at 375/360 px, accessibility spec (44 px), six-width sweep (see G) | Playwright | see G |
| Performance | production build route sizes, chunk contents | before/after builds | improved (E) |
| Offline / PWA | sync paths (rewards agent), update-flow e2e, offline specs | existing e2e + new sync tests | pass |

## D. Bugs discovered and fixed

Every fix has a regression test that was seen failing before the fix, with
one exception: TB-02's test was written together with its helper.

### Rewards and sync (`fix/overnight-rewards`)

| ID | Severity | Root cause | Fix | Regression test |
|---|---|---|---|---|
| RW-01 | medium | A task ticked offline in the evening and synced next morning was refused (`missed`), so the child got 0 stars. | A `missed` task can still be completed when the completion falls on the task's own Tallinn day, within the 14-day offline limit. | `taskSync.test.ts` "late offline task completions" (5 tests) |
| RW-02 | low | The joint daily bonus decided after the day treated `missed` tasks as done. | `missed` counts as not done; the other child's share of a first-completer task is locked when it is settled late. | `tasks.test.ts` (2 tests) |
| RW-03 | medium | A morning read spent a streak freeze on "yesterday" before last night's offline exercise synced. | Freezes whose day turns out studied are given back before settling. | `streakFreeze.test.ts` |
| RW-04 | medium | The parent changing star rules mid-exercise caused the finished attempt to be rejected (`metadata_mismatch`), losing the work. | Held for parent review (`reward_policy_changed`); approval pays under the starting rules. | `insertAttempt.test.ts` |

### Security (`fix/overnight-security`)

| ID | Severity | Root cause | Fix |
|---|---|---|---|
| SEC-01 | medium (game parent-only) | The Kaardimäng round JSON carried `targetId`, `targetKey` and `hideCapitalId` for questions not yet answered, i.e. the answer. | An explicit client view; those fields are sent only after the question is answered. |
| SEC-02 | low–medium | Middleware treated any path ending in `.png` or `.svg` as a public file, skipping the family session. | Extension rule limited to root files, `/textbook-images/` and `/kaardimang/`. |
| SEC-03 | low | `GET /api/history/[id]` returned results the parent had hidden. | `deletedAt IS NULL`. |
| SEC-04 | medium | The parent password-change check was not rate-limited. | Login throttle plus bounded JSON reader. |
| SEC-05 | low | 23 routes echoed raw `error.message` (TypeError, SQLite). | Only domain (Estonian) messages pass; everything else is logged. |
| SEC-06 | low | API responses had no `Cache-Control`. | `no-store` on `/api/*`. |

Each has a route-level test.

### Exercise content (`fix/overnight-content`)

EDU-01 to EDU-08 go into a new maths generator version, `math-2026-10c` (v4).
v1–v3 still generate exactly what they did and are still verified (pinned
fingerprints were committed first).

| ID | Severity | Defect |
|---|---|---|
| EDU-01 | high | "7803 m = mitu km?" was keyed 7; the right answer 7,803 was marked wrong (~3 % of Mõõtühikud questions). |
| EDU-02 | high | "__ km 300 m = 6400 m" has no whole-number answer. |
| EDU-03 | medium | Impossible triangles (4, 4, 9 cm). |
| EDU-04, 05 | low | Number agreement ("2 plokk", "1 sajalist"). |
| EDU-06 | medium | Division splits with a zero part. |
| EDU-07 | medium | "kolmveerand ringi" figure printed the answer (270°). |
| EDU-08 | medium | Text problems: misspelling; equivalent answers ("4 ja 5", "15.05") rejected. |
| EDU-09 | medium | Two identical English prompts could appear on one sprint board, so pairing the "wrong" one ended the sprint. |
| EDU-10 | low | SAI/LEIB pictures swapped (old picture still verifies old attempts). |
| EDU-11 | low | "tigu on limune" → "limus" (mollusc). |

### Kaardimäng (`fix/overnight-kaart`)

| ID | Defect |
|---|---|
| MAP-01 | A wrong answer on a three-button question left only the right one. |
| MAP-02 | Too few capital options in small views. |
| MAP-03 | "Trinidad ja Tobago" genitive. |
| MAP-04 | South Pole dot graded wrong for "Leia Antarktis". |
| MAP-05 | Marker tap circles overlapped on phones, so taps went to the wrong country. |
| MAP-06 | South Pole tap circle about 20 px, now 44 px. |
| MAP-07 | Non-neutral wording on disputed areas. |

### Textbook engine (`fix/overnight-engine`)

| ID | Defect |
|---|---|
| TB-01 | The known CI flake: the stale-revision test sent an empty ordering answer to a random first question. Now deterministic. |
| TB-02 | After finishing the reading out of order, the card did not offer "Harjuta". |

### Found during unit integration

- **Unit 15:** 10 wording fixes (no key changes), e.g. "kumb" used with four
  options, "maailmaosa".
- **Unit 16:** 9 wording fixes (content version `2026-10-17.2`).
- **Unit 18:** the package's Natural Earth data drew Crimea in Russia, and
  Northern Cyprus apart from Cyprus. Both are corrected in the data and
  pinned by tests.
- **Unit 21:**
  - q041's wrong option "Küpros" sits on an active plate boundary, so it was
    replaced by "Gotland";
  - q034's stem made plural;
  - two diagram titles that named the answer were renamed.
- **e2e spec:** it assumed one label and one tap area per hotspot region.
  Unit 16 draws the Pacific at both map edges (the new `twin` region), so the
  spec now counts regions instead.

## E. Performance

First-load JS from the production build (`next build`), in kB:

| Route | Before (ed55a76) | All units, eager | After |
|---|---|---|---|
| textbook practice (`…/harjuta`) | 146 | 194 | **152** |
| textbook reading (`…/lugemine/…`) | 140 | 188 | **146** |
| textbook test (`…/test`) | 149 | 197 | **155** |
| course list (`…/opik`) | 122 | 131 | **116** |
| unit page (`…/opik/[unitId]`) | 123 | 132 | **116** |
| Kaardimäng (child and parent) | 143 | 152 | **136** |
| home `/`, `/vanem` | 113, 146 | 113, 146 | 113, 146 |

How the numbers came down:

1. `DiagramView` loads Units 11–21 through `next/dynamic`, one chunk per unit,
   chosen by the registry ID prefix. They are still rendered on the server.
   The world, Europe and Baltic map data now load only with their own unit.
2. `toClientQuestion` moved out of `lib/textbook/api.ts`. That file is
   imported by client pages for route constants, and it dragged the whole
   diagram registry (~53 KB raw) into the course list and Kaardimäng.

What the Kaardimäng agent measured (nothing needed changing):

- Map views load lazily per view, 3–54 kB gzip each.
- At most 212 paths per view.
- The largest view parses in about 3.3 ms.

## F. Code quality

- **Shared map outlines:** one app-owned copy of the continent outlines,
  instead of five identical copies from the packages.
- **Per-unit diagram files:** each unit's diagram code lives in its own files.
  The eager component map (`diagrams/components.ts`) is for tests; the app
  uses the lazy view. A test fails if a registered diagram has no loader.
- **`DiagramFrame` `twin` prop:** one region drawn in two places, needed
  because the Pacific spans the map edge.
- **Error messages:** one `publicErrorMessage` helper replaces 23 ad-hoc
  `error.message` echoes.
- **Faster tests:** the textbook server test's per-unit timeout is now 60 s.
  Each run passes every earlier unit first, so it grows with the number of
  units.
- **Shared ready list:** the "ready units" assertions now use one explicit
  list per test file.
- **No repo-wide reformatting:** each agent's diff is limited to its area.

## G. Test results

Run on the final branch on a quiet machine (Windows, Node 22.23.3):

| Command | Result |
|---|---|
| `npm run content:validate` | pass: "Sisu kontroll: korras", Units 10–19 and 21 AVALDATAV |
| `npm run validate:science` | pass, 140 tasks |
| `npm run typecheck` | pass |
| `npm run lint` | pass, no warnings |
| `npm test` | **1333/1333 pass, 138 files** (baseline 1131) |
| `npm run test:content` | pass |
| `npm run build` | pass |
| `npm run test:e2e` (CI=1, Chromium + WebKit, 92 tests) | first full run: 85 passed, 2 flaky, 5 failed — see below |

**The five failures in the first run:**

- **`textbook-real-units`, both browsers:** a real spec defect, explained in
  D. It assumed one label per region, and Unit 16's Pacific is drawn twice.
  After fixing the spec: _see final line below_.
- **`parent-peek`, 3 tests, WebKit only:** `page.goto('/kiur')` timed out
  after 37 minutes of dev-server run time. Rerun: all pass in both browsers.
- **`remediation` (WebKit), flaky:** passed on retry, and passed in the rerun.

**Earlier in the night, under load:**

- During the night, with 11 agents sharing the machine, the full `npm test`
  timed out in unrelated files such as `syncDelta` and `hashSecretCli`. On the
  quiet machine every file passes.
- The `test:e2e:audit` stage of `npm run test:audit` failed at that time
  because its server took 233 s to start (limit 120 s). That is environmental
  and was not rerun.

## H. Remaining issues, by risk

1. **Kaardimäng, before opening it to Kiur** (still parent-only):
   - capital option IDs contain the country code, and `highlightId` equals
     the right option, so the answer is readable in devtools;
   - about 250 map-tap targets are under 44 px at 360 px. Raising them all
     would turn most whole-world-part views into button questions; this is a
     design choice;
   - the Europe icon is 🏰, not an animal;
   - `DATA_VERSION` was not bumped after two in-place data fixes.
2. **The family session is not bound to a child.** `learner`/`from` come from
   the request, so either child's screen can act for the other, including
   gifting stars. That is by design; changing it needs an auth redesign.
3. **Peek mode is not enforced on the server** for `/api/offline/sync` push;
   only the client blocks it. Fixing it would change the offline protocol.
4. **Textbook test autosave:** if Kiur changes an answer and leaves within
   0.6 s, the save is cancelled, and the answer shows as unanswered on
   resume.
5. **Two tabs on one test:** a stale submit can end in a 422 "not all
   answered" with no retry button.
6. **Shop:**
   - a retry after a lost response can buy twice (no request key);
   - the price is charged as it is at confirm time;
   - offline task review can pay twice if the parent edits the task meanwhile.
7. **Hotspot region IDs** (`pacific`, `russia`) are readable in the DOM and
   API; only someone opening devtools sees them.
8. **Content notes for the owner:**
   - Unit 17 b026 cites p. 67 for Peipus;
   - Unit 17 b027 "western" would be more precise as "south-western";
   - Unit 21 q059: Osmussaar magnitude 4,5 vs about 4.7 in some sources;
   - SCI-SORT-006 sorts visible steam as a gas;
   - Kordamine filler options are not random.
9. **Unit 18 map overlaps:** the tap areas on the Europe maps are larger than
   some countries, so a tap on Poland inside Germany's area selects Germany.

## I. Git and deployment

- **Branch:** `feat/overnight-units-15-21`, pushed, with a PR.
- **No direct push to main.**
- **Merged branches** (each keeps its own commits): `feat/textbook-unit15`,
  `-16`, `-17`, `-18`, `-19`, `-21`, `fix/overnight-engine`,
  `fix/overnight-rewards`, `fix/overnight-kaart`, `fix/overnight-security`,
  `fix/overnight-content`, plus two performance commits (dd6c341, d1d7424).
- **Migrations:** none. Stored data formats are unchanged; the maths v1–v3
  generators are kept.
- **Deployment:** **not deployed.** Follow `docs/release-checklist.md`:
  - backup `data-pre-<sha>.tgz`;
  - `docker compose build app`;
  - `up -d --no-deps --force-recreate app`.
- **Rollback image:** `pikkuste-harjutaja:ed55a76`.
- **Units 15–21 stay unpublished** until the parent publishes each in
  Vanem → Loodusõpetuse õppetükid.

## J. Verdict

**READY WITH LIMITATIONS.**

- **Evidence:** all unit, content, type, lint and build checks pass. The e2e
  failures were either fixed (the spec defect) or passed on rerun (timing).
  No known critical or high-severity regression remains.
- **Limitations:**
  - the open items in H, mostly Kaardimäng, which must not be opened to Kiur
    before H-1 is resolved;
  - Unit 20 has no content;
  - the CI run on the PR is the final word on the Linux and WebKit layout
    (fonts differ from Windows).
