# English unit tests (Kontrolltööd; internally "lisatest")

These are the workbook tests ("I Love English", Test N A/B) that follow a
vocabulary unit's words test. Kaur's decisions (20.11.2026):

- Who: Kiur only, the same as Sõnavara.
- When: the test opens once the words test of the same unit is passed.
- Variant: the app picks A or B at random. A unit with only one variant always gets that one.
- Pictures: the book's pictures are never shown. A picture is rewritten as a short Estonian description (`scene`), and a picture clue becomes an Estonian word.
- Grading:
  - every closed answer is marked by the app;
  - open answers wait for the parent;
  - the parent can overrule any mark (✓ 1, ½ 0.5, ✗ 0).
- The parent's decision:
  - **Kinnita** — final. Stars are paid only on approval.
  - **Saada parandamiseks** — the child changes only the answers that were not ✓, then hands the test in again.
  - **Salvesta hiljemaks** — keeps the marks without deciding.
- Pass mark: 75 % or more (grade 4 or 5).
  - Grades: 5 ≥ 90 %, 4 ≥ 75 %, 3 ≥ 50 %, 2 ≥ 20 %, otherwise 1.
  - Below 75 % pays no stars, and a new random variant opens as a retake.
  - A passed test is done.
- Next unit: the additional test never blocks the next vocabulary unit.

## Content

The workbook is copyrighted and this repository is public, so **the test
content is not in the repository**.

- The parent imports it in Vanem → Halda → Õppesisu → *Inglise keele lisatestid*.
- There is one JSON file per unit and variant. The format is described in the worklog `harjutaja-english-unit-tests/CONTENT_SPEC.md`, and `src/lib/unitTests/validate.ts` is the authority.
- One bad file blocks the whole import.
- Re-importing a file updates the variant. Tests already started keep the copy they were started on.
- **Eelvaade** shows a variant with its answers, so the parent can check a transcription before Kiur gets it. **Väljas** switches a variant off.

Exercise types:

| type | child does | checked by |
|---|---|---|
| `choice` | taps one option (word bank or per-item options) | app |
| `text` | types; may have several fields (e.g. English + Estonian) | app (`check: auto`), or parent (`check: parent`) |
| `order` | taps words into a sentence | app (word order, ignoring case and punctuation) |
| `crossword` | fills a letter grid (the book's layout, or laid out by the app) | app, per word |

Typed answers are compared ignoring case, spacing, the apostrophe variant,
commas and a closing `. ! ?`. Anything else counts as different, and the
parent overrules it if it is right.

## Flow and storage

The tables come from migration 17:

- `english_unit_test_variants` holds the imported content.
- `english_unit_test_attempts` holds one row per try:
  - the content snapshot, answers, marks, comment, status, score and grade;
  - the learning attempt it produced.

Status goes `in_progress` → `submitted` → (`returned` → `submitted`)* → `approved`.

- Answers are saved as the child types, every 1.2 s.
- Every write carries the revision the page last saw. A page that fell behind gets the current state back.
- An approved, passed test inserts one protocol-v2 attempt:
  - `topic = lisatest`, `exerciseId = kiur.english.vocabulary`, runner `kiur-english-unit-test`;
  - it is settled by the normal reward projection, so star settings, decay, daily cap and streaks apply;
  - the runner is its own, so it does not count as a second words test that day.
- If the parent has hidden Sõnavara, the attempt is held (`not_permitted`), like any other not-permitted attempt.

Peek mode: `/api/english/unit-tests*` is a child write path, so a peeking parent cannot answer.

## Files

- `src/lib/unitTests/`: types, validation, crossword layout, grading, the child's view (no answers).
- `src/lib/server/unitTests/store.ts`: import, the child's attempt, the parent's review.
- `src/app/components/unitTests/`: the sheet (shared), the child's runner, the parent's review and preview.
- `src/app/components/parent/UnitTestsPanel.tsx`: import and the variant list.
- Routes:
  - `/kiur/inglise-keel/[unitId]/lisatest` (with `?katse=` to view one attempt);
  - `/vanem/lisatest/[id]`;
  - `/vanem/lisatest/eelvaade`.
- Tests:
  - `src/lib/unitTests/unitTests.test.ts`;
  - `src/lib/server/unitTests/store.test.ts`;
  - `e2e/unit-tests.spec.ts`. Set `UT_CONTENT_FILE` to run it on a real content file and `UT_SCREENSHOT_DIR` to save screenshots.
