# Textbook learning framework (Õpiku õppetükid)

A reusable, data-driven framework for textbook units: **Õpi → Harjuta → Test →
Läbitud**. Adding a unit or a whole subject means adding structured TypeScript
content — no new engine code, no HTML.

The first course is Kiur's `loodusopetus-opik` ("Loodusõpetus – Õpiku
õppetükid"). Its units 10–22 are registered as **metadata-only drafts** (number,
title, pages); their lessons and questions are written later from the corrected
textbook text. A preview-only demo course (`textbook-demo`) shows the whole flow
to the parent.

## Architecture

| Phase | What | Where |
|---|---|---|
| 1 (done) | Pure core: content model, grading, test selection, practice scheduler, validator, API contract, content | `src/lib/textbook/`, `src/content/textbook/` |
| 2a | Server: migration, sessions (snapshot + revision + idempotency), gates, unlocks, rewards (v2 path, like a vocabulary pass), isolated preview learner, parent APIs | `src/lib/server/textbook/`, `src/app/api/textbook/`, `src/app/api/parent/textbook/` |
| 2b | UI: child routes under `/kiur/loodusopetus/opik`, lesson renderer, SVG diagrams, the six answer components, practice/test runners, parent section + preview | `src/app/...` |

The core has no database and no React. Everything is deterministic (seeded) and
JSON-serialisable, so the server stores engine state as JSON and replays nothing.

| Module | Job |
|---|---|
| `types.ts` | Course → Unit → Lesson → Section → ContentBlock; objectives; questions; responses; course settings |
| `grading.ts` | `gradeAnswer(question, response)` for all six types; `parseResponse`, `isResponseComplete`, `correctResponseFor` |
| `presentation.ts` | `FrozenQuestion` = deep copy + stored display order |
| `testSelection.ts` | `buildTestSnapshot`, `canBuildTest`, `retakeDiversity`, `historyFromSnapshots` |
| `testSession.ts` | Test state machine: `saveTestAnswer` (no feedback), `submitTest` |
| `practiceScheduler.ts` | Practice state machine: `createPracticeState`, `recordPracticeAnswer`, `currentPracticeQuestion` |
| `progression.ts` | Access (the vocabulary unlock rules, reused) and `computeUnitGates` → status code |
| `scoring.ts` | Integer pass rule, `seedFromString`, `contentHash` |
| `validator.ts` | `validateCourse`, `validateUnit` / `publishable` |
| `diagramRegistry.ts` | Known diagram IDs and their hotspot regions (data only) |
| `api.ts` | Routes, request/response types, `toClientQuestion` (strips keys) |

## Content model in one page

```
Course { id, title, subject, learners, previewOnly, settings, units[] }
  Unit { id, courseId, number, title, pages?, status: 'draft'|'ready', contentVersion,
         objectives[], lessons[], questions[] }
    Lesson { id, title, order, required, objectiveIds[], sections[] }
      Section { id, title?, blocks[] }          ← one screen ("Edasi")
    LearningObjective { id, description, required, sources[] }
    Question { id, unitId, stem, context?, primaryObjectiveId, relatedObjectiveIds?,
               variantGroupId, cognitiveLevel, difficulty 1–3,
               eligibility { practice, test }, explanation, misconception?, sources[], answer }
```

- **IDs** are stable, lowercase `a-z0-9-` and independent of titles. Question IDs
  are unique across the course. Convention: `<unit>-q01`, `<unit>-g01`, `<unit>-o1`.
- **`status`** is the authoring status. Publication (what the child sees) is a
  parent switch in the database; a `draft` can never be published.
- **`contentVersion`**: bump it on every content change. Running sessions keep
  their frozen copy; new sessions use the new content.
- **Sources** (`{ kind: 'textbook' | 'supplementary', pages?, url?, attribution? }`)
  on blocks (optional), objectives (recommended) and questions (required).

### Blocks

`heading`, `paragraph`, `list`, `definition`, `keyFact` ("Jäta meelde!"),
`comparison` (2–3 columns), `table`, `diagram` (registered ID), `caption`,
`externalResource` (https link, publisher, type article/gallery/video/interactive,
"what to observe"; `qr` reserved, renders nothing), `enrichment`
(`extra` = "Lisateadmine", `fun_fact` = "Huvitav fakt").

Text fields are `RichText`: a string, or segments `{ text, emphasis?: 'strong' | 'term' }`.
Nothing else — no links, no HTML.

### The six answer types

| Type | Key | Response the browser sends |
|---|---|---|
| `single_choice` | `correctOptionId` | `{ type, optionId }` |
| `multiple_selection` | `correctOptionIds` (≥1, not all) | `{ type, optionIds }` |
| `matching` | `correctPairs` promptId → choiceId (choices used once; extra choices = distractors) | `{ type, pairs }` |
| `grouping` | `correctGroupByItem` itemId → groupId | `{ type, assignments }` |
| `ordering` | `correctOrder` (item IDs) | `{ type, order }` |
| `diagram_hotspot` | `correctRegionId` (registry region) | `{ type, regionId }` |

Everything is compared by ID. Only a fully correct answer counts (no partial
credit). True/false is `single_choice` (use `trueFalse()`), a passage or a
table is a `context` (`text` / `table` / `diagram`) plus one of the six types.
Grading never reads the context.

`keepOptionOrder: true` keeps the authored order (Õige/Vale, numbers);
otherwise options, matching sides, grouping items and ordering items are
shuffled once per session (seeded) and the order is stored. An ordering
question never starts in the solved order.

### Diagrams

`diagramRegistry.ts` lists every diagram ID with its regions
(`id`, `label`, neutral `marker` letter, neutral `position` text). The UI owns
one React SVG component per ID that draws exactly those regions, each tappable
with its region ID. In hotspot questions the labels are hidden (the label is the
answer): the picture shows markers, and an accessible list of region buttons
("A – kõige ülemine osa") is offered. `toClientQuestion` sends only markers and
positions. Diagrams must read at 375 px; no canvas, no heavy libraries.

## Adding a new unit (step by step)

1. **Write the content** in the course module, e.g.
   `src/content/textbook/loodusopetus-opik/unit10.ts`, and replace the draft
   entry in `index.ts` with it. Use the builders in
   `src/content/textbook/authoring.ts` (`questionsFor`, `single`, `trueFalse`,
   `multi`, `matching`, `grouping`, `ordering`, `hotspot`).
2. **Objectives first.** Copy the textbook's own objectives where they exist.
   Mark the ones the test must cover as `required`.
3. **Lessons.** Keep the textbook wording. One section ≈ one phone screen. Link
   each required objective to a required lesson (`objectiveIds`).
4. **New diagram?** Add its ID and regions to `diagramRegistry.ts` (and ask for
   the SVG component in the UI layer).
5. **Questions.** Per required objective: at least 2 practice questions, and
   several distinct variant groups of test questions across the three levels.
   Aim for 10–15 practice and 30–40 test-eligible questions in ≥ 30 groups.
6. Set `status: 'ready'` and a new `contentVersion`.
7. Run `npm run content:validate` until the unit reads **AVALDATAV** without
   warnings, then `npm test`.
8. Publish it in the parent area (*Loodusõpetuse õppetükid*), after previewing.

Minimal example (a real unit needs many more questions — the validator says how
many):

```ts
import { questionsFor, single, trueFalse } from '@/content/textbook/authoring';
import type { Unit } from '@/lib/textbook/types';

const SRC = [{ kind: 'textbook' as const, pages: '44–45' }];
const q = questionsFor('lo-opik-u10', SRC);

export const unit10: Unit = {
  id: 'lo-opik-u10', courseId: 'loodusopetus-opik', number: 10, title: 'Maa kuju',
  pages: { from: 44, to: 47 }, status: 'ready', contentVersion: '2026-11-01.1',
  objectives: [{ id: 'lo-opik-u10-o1', description: '…', required: true, sources: SRC }],
  lessons: [{
    id: 'lo-opik-u10-l1', title: '…', order: 1, required: true, objectiveIds: ['lo-opik-u10-o1'],
    sections: [{ id: 'lo-opik-u10-l1-s1', blocks: [
      { id: 'lo-opik-u10-b01', type: 'paragraph', text: '…', source: SRC[0] },
      { id: 'lo-opik-u10-b02', type: 'keyFact', items: ['…'] }
    ] }]
  }],
  questions: [
    q({ id: 'lo-opik-u10-q01', stem: '…?', primaryObjectiveId: 'lo-opik-u10-o1', variantGroupId: 'lo-opik-u10-g01',
        cognitiveLevel: 'factual', explanation: '…', answer: single([['a', '…'], ['b', '…'], ['c', '…']], 'a') }),
    q({ id: 'lo-opik-u10-q02', stem: 'Õige või vale? …', primaryObjectiveId: 'lo-opik-u10-o1', variantGroupId: 'lo-opik-u10-g02',
        cognitiveLevel: 'understanding', explanation: '…', answer: trueFalse(false) })
  ]
};
```

## Adding a new course

1. Create `src/content/textbook/<course-id>/index.ts` exporting a `Course`
   (`learners`, `subject`, `settings`; start from `DEFAULT_COURSE_SETTINGS`:
   20 questions, pass 95/100, levels 8/7/5, practice target 12, retake practice
   required).
2. List it in `src/content/textbook/registry.ts`.
3. A course only for the parent preview: `previewOnly: true`, `learners: []`.
   Child routes resolve courses only through `getChildCourse`, which refuses it.
4. A new `subject` value needs adding to `CourseSubject` in `types.ts`.

## The validator

```
npm run content:validate                    # every course
npm run content:validate -- textbook-demo   # one course
npm run content:validate -- --strict        # warnings fail too
```

The parent UI uses the same code (`publishable(unit, course)`), so the messages
are Estonian. **Errors block publication**, warnings do not.

Errors include: draft status (`unit_draft`, `unit_no_content`); bad or duplicate
IDs; lesson order and structure; empty blocks; malformed tables; non-https
links; unknown diagrams; unknown objectives; missing stem, explanation or
sources; answer keys that do not fit their options (and a self-check that the
key grades correct); fewer than 2 practice questions for a required objective;
and **no buildable test** (`test_too_few_questions`, `test_too_few_groups`,
`test_objective_coverage`, `test_level_quota`, …).

Warnings include: thin retake diversity (fewer than ⌈1.5 × test length⌉ test
variant groups or a required objective with one group — `retake_diversity`),
fewer practice questions than the practice target, fewer than three answer
types, duplicate stems, objectives not linked to a required lesson.

## Authoring quality rules

- Correct facts and Estonian terminology; preserve the textbook's wording.
- One unambiguous correct answer, except in explicitly multi-answer types.
- Distractors plausible but demonstrably wrong; no trick wording.
- Answerable from the required lesson text or reasonable prior knowledge —
  never from optional external resources or enrichment boxes.
- No trivial rewordings: near-identical questions share a `variantGroupId`
  (a test never contains two questions from one group).
- Several distinct groups per objective, spread over the three levels:
  `factual` (terms, facts), `understanding` (comparison, cause), `application`
  (interpretation, reasoning with a text/table/diagram context).
- Every question has an explanation, an objective trace and a source; add a
  `misconception` note where a typical mistake is known.
- No free-text answers, ever.

## The engines

**Pass rule.** `requiredCorrect = ceil(n · num / den)` in integers →
19/20 passes, 18/20 fails, 18 questions need 18. Never a rounded percentage.

**Test selection** (`buildTestSnapshot`). Hard: exactly `testLength` test-eligible
questions, unique IDs, at most one per variant group. Strict: every required
objective is the primary objective of some question, and the level quotas are
exact. Preference: groups and questions used least in earlier attempts
(`history`), ties by seed. Algorithm: backtracking over objective coverage
(fewest-candidate objective first, pruned by bipartite matching and memoised
failures), then a capacitated bipartite matching (augmenting paths) of the
remaining groups to level slots. The search is exhaustive, so `canBuildTest`
failing is a proof (cross-checked against brute force in the tests). If strict
is impossible at runtime the build relaxes coverage, then quotas, and records it
in `relaxations`; it throws only with fewer distinct groups than the test
length. The snapshot freezes the questions (deep copies with keys), the display
order and each question's option order.

**Practice** (`practiceScheduler.ts`). The plan covers every required objective
and is topped up round-robin to `practiceTarget` with distinct questions. Only a
correct answer satisfies, and only the primary objective. A wrong answer on an
unsatisfied objective schedules one correction two positions later (unseen
question of another group → unseen same group → seen, least asked) unless one is
already queued; the same question never comes twice in a row. Complete = every
objective satisfied and the queue empty. Termination: once answers are correct,
it ends within queue length + 2 answers (property-tested). Targeted mode (after
a failed test) covers only the missed objectives, preferring questions that were
not in that test.

**Test session.** Answers are saved without feedback and may be changed; submit
requires all answers and reveals the review.

## API contract (summary — `src/lib/textbook/api.ts`)

Child (`/api/textbook/…`) and preview (`/api/parent/textbook/preview/…`) share
the same shapes: course overview, unit detail, lesson, lesson complete, practice
start/resume/answer, test start/resume/answer/submit. Parent:
`/api/parent/textbook` overview, unit detail (with keys), publish, unlock,
preview start/reset. Every mutation carries `actionId`; session actions also
`revision` (stale → 409 with the current session). The browser only ever gets
`ClientQuestion` (from `toClientQuestion`): no keys, explanations, objectives or
hotspot labels before they are revealed. Preview uses the learner `preview` and
must never touch real rewards, attempts, streaks, unlocks or history.
