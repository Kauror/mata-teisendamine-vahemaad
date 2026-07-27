# UI and content audit

This audit supplements the normal unit, development E2E and production/offline
suites. It uses a disposable SQLite database under `.e2e-audit-data/` and a
dedicated local server on `127.0.0.1:3101`. It never reads or writes production
data.

## Commands

- `npm run test:content` — static and generated-content integrity checks.
- `npm run test:e2e:audit` — Chromium and WebKit UI contract audit.
- `npm run test:audit` — lint, typecheck, science validation, content checks and
  the UI audit in sequence.

Set `PW_AUDIT_PORT` to use another audit port.

## Behaviour matrix

| Surface | Expected behaviour | Automated evidence |
| --- | --- | --- |
| Family PIN | Disabled while empty; invalid value stays on the gate; valid value opens the dashboard | Existing access-gate suite and audit control contracts |
| Home | Child cards, history and parent navigation render without broken content or unnamed controls | Route and responsive contracts |
| Kiur/Kirsi dashboards | Active cards are unique and every card opens a usable protected screen | Exercise-card audit |
| Study pages | Correct child context, revision option, back route and intended runner | Existing study tests plus exercise-card audit |
| Exercise runners | Visible question content, answers and session restoration | Existing math, remediation and audit route tests |
| History | Child filter, statistics, result navigation and absence of child-side destructive controls | Existing accessibility suite and audit route contract |
| Shops | Both child shops load with valid controls and content | Audit route contracts |
| Parent hub | Authentication works; every documented accordion opens and closes | Audit control contracts |
| Responsive layout | Core screens stay inside phone and desktop viewports | Audit responsive contracts |
| Runtime health | No uncaught page errors, console errors, required-request failures or HTTP 5xx responses | Audit runtime recorder |
| Visible content | No replacement characters, common mojibake, broken images, duplicate DOM IDs, unnamed controls or empty status elements | Audit page contract |
| Static content | Unique IDs, required fields, valid reading answers/evidence and consistent first sounds | Content integrity suite |
| Generated maths | Every published Kiur topic and Kirsi mode is generated across deterministic seeds with valid answers and choices | Content integrity suite |
| Science | Exactly 140 structurally valid tasks with valid answers and type-specific data | `npm run validate:science` |
| Offline/PWA | Service-worker registration, cached shell reload and signed production session | Existing production E2E suite |

## State-changing journeys already covered

- Correct, incorrect and restored final mathematics answers.
- Hidden permanent exercise disappearing from the child dashboard.
- Failed sessions entering remediation and completing a remediation round.
- Parent controls responding to keyboard input.
- Offline task completion, reward settlement and sync idempotency at unit/API
  level.

## Manual exploratory checklist

Automation cannot determine whether every sentence is pedagogically ideal or
whether a real child finds a flow understandable. Before release, manually:

1. Complete one exercise of every runner family on a phone.
2. Read all newly added or changed questions, explanations and answer choices.
3. Try back, refresh, double-tap and tab closing during an active exercise.
4. Use each parent mutation once and verify the child-facing result.
5. Install the production build on a physical iPhone, prepare it online, switch
   to airplane mode, complete an exercise, reconnect and verify one upload.
6. Record defects with route, state, viewport, expected behaviour, actual
   behaviour and a screenshot.

## Acceptance gate

The audit is green only when all automated stages pass, failure artifacts have
been reviewed, the working tree contains no generated audit data, and the
physical-device checklist has no unexplained release-blocking failures.
