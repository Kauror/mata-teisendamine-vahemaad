# English vocabulary units (Sõnavara)

Kiur's textbook vocabulary, studied unit by unit at `/kiur/inglise-keel`.
The existing Sprint is unchanged and still linked from that page.

## Flow per unit

**Locked → Available → Study → Test → Completed**

1. **Õppimine (flashcards).** The Estonian word is shown; the child taps the
   card to see the English word and its pronunciation, then swipes right
   (*Teadsin*) or left (*Ei teadnud*) — or uses the buttons or ← / → keys.
   An unknown card comes back after three other cards. Study is complete when
   every word has had one *Teadsin*. The first-encounter score is kept.
2. **Test (typed).** Opens after study. The child types the English word.
   Comparison ignores letter case, surrounding/repeated spaces, typographic
   apostrophes (’ vs ') and a closing `. ! ?`; nothing else is forgiven unless
   the parent stored the spelling as an accepted answer.
3. **95% rule.** Only a complete round counts. Below 95%: a correction round
   with just the missed words (each repeated until typed right), then the whole
   unit again. Integer arithmetic: 19/20 passes, 18/20 fails, an 18-word unit
   needs 18/18.
4. **Completion.** Passing opens the next *published* unit. Completed units
   stay open and can be studied or tested again; the original completion
   record is never overwritten.

## Access rules (`src/lib/vocabulary/unlock.ts`)

- Unpublished units (or units with no words) are invisible to the child.
- The first published unit is always open, whatever its number.
- A unit opens when the previous published unit is passed, when the parent
  opens it by hand, or when the child has already passed it.
- Every rule is enforced on the server when a session starts and on every
  action, so direct URLs and API calls cannot bypass it.

## Weak words (`src/lib/vocabulary/weakWords.ts`)

A typed mistake (test, correction or practice) marks a word as needing
practice. Two consecutive correct answers given unaided (a full test round, or
a word's first try in practice) clear it. Study swipes never change it.
"Korda eksitud sõnu" practises these words, per unit or across units; it
never changes test results and never awards stars.

## Stars and history

Only a **passed** test creates a learning attempt: a protocol-v2 row
(`subject = inglise-keel`, `topic = sonavara`,
`exerciseId = kiur.english.vocabulary`, `clientAttemptId = vocab-test:<session>`)
settled by the existing canonical reward projection. The parent's learning
settings, decay, daily cap, streaks and reward rules apply unchanged.
Study, correction rounds, failed rounds and practice award nothing. If the
parent hides the exercise during a test, the attempt is recorded but held for
review (`not_permitted`), like any other unpermitted attempt.

## Sessions

The server owns all state (`english_vocab_sessions.stateJson`) and runs the
pure state machine in `src/lib/vocabulary/engine.ts`. Each action carries an
`actionId` and the last seen `revision`: a retried request returns the stored
result, a request from a tab that fell behind is refused with the current
state. Every action — events, statistics, progress, attempt, stars — is one
SQLite transaction. The session id is kept in the URL, so a reload resumes it.

The module is **online-only** (runner `kiur.english.vocabulary`,
`offlineStart: false`); offline, the page says so instead of starting.

## Importing words (`/vanem` → *Inglise keele sõnavara*)

Accepted files: `.xlsx`, CSV (UTF-8), tab-separated text. Two layouts:

- a unit column on every row (`unit | estonian | english | pronunciation | accepted_answers`), or
- section rows such as `UNIT 3 | Thank you` that start each unit (the
  textbook export layout); the text after `|` becomes the unit title.

The header row and columns are detected and can be changed. Accepted answers
are separated with `;` or `|`. Every row is validated (required fields, unit
number 1–999, duplicates, lengths, Excel errors/number cells, malformed
accepted answers); any error blocks the whole import. Warnings (multi-form
English such as `drink, drank`, a trailing comma, one Estonian prompt with two
answers) do not block. Imported units are never published automatically.

### Safe-edit policy

- A word is the same word when its Estonian and English match (case and
  spacing ignored). It keeps its id and statistics; pronunciation, accepted
  answers and order are updated in place, and every change is stored in
  `english_vocab_word_revisions`.
- A changed spelling is a new word. *Merge* mode never removes anything;
  *replace* mode retires words missing from the file (hidden, history kept).
- Words are never deleted once used, and a unit with history can be renamed
  but not renumbered or deleted.
- Running sessions use their own copy of the words, and every recorded answer
  stores the expected spelling of its time.
- The preview is bound to a hash; if the data changed before confirming, the
  import is refused and the preview must be repeated.

## Data

Migration 9 (`english_vocabulary`) adds the `english_vocab_*` tables. It is
purely additive.
