// Shared, client-safe vocabulary types. Nothing here touches the database.

// The word as a session sees it. A session copies these values when it starts,
// so a parent correcting the word list later never changes the meaning of an
// answer already given or the queue of a session in progress.
export type VocabWordSnapshot = {
  id: string;
  estonian: string;
  english: string;
  pronunciation: string;
  acceptedAnswers: string[];
};

export type VocabMode = 'study' | 'test' | 'practice';

// One graded interaction, as recorded in english_vocab_events.
//  - study:      a self-assessed swipe ("Teadsin" / "Ei teadnud")
//  - full:       a typed answer inside a complete test round (the only kind
//                that can satisfy the 95% rule)
//  - correction: a typed answer in a correction round
//  - practice:   a typed answer in "Korda eksitud sõnu"
export type VocabEventPhase = 'study' | 'full' | 'correction' | 'practice';

export type VocabEvent = {
  wordId: string;
  phase: VocabEventPhase;
  round: number;
  correct: boolean;
  answer: string | null;
  expected: string;
  // Study: whether this was the word's first card in the session.
  firstEncounter: boolean;
  // Whether a correct answer here is evidence the child can produce the word
  // unaided (see weakWords.ts). False when the answer was just shown to them.
  countsForRecovery: boolean;
};
