'use client';
import type { EnglishVocabularyWord } from '@/lib/englishVocabulary';
import MatchingBoard, { type MatchingChange, type MatchingSelection } from '@/app/components/MatchingBoard';

type EnglishMatchingBoardProps = {
  words: EnglishVocabularyWord[];
  onPair: (ok: boolean, word: EnglishVocabularyWord, chosenOption: EnglishVocabularyWord) => void;
  onBoardComplete: () => void;
  layoutSeed?: number;
  showFeedback?: boolean;
  state: EnglishMatchingBoardState;
  onStateChange: (state: EnglishMatchingBoardState) => void;
};

// Saved as part of the English sprint run; the field names are its storage format.
export type EnglishMatchingBoardState = {
  boardKey: string;
  selectedEnglishId: string | null;
  selectedEstonianId: string | null;
  completedIds: string[];
  feedback: string;
};

function nextFeedback(change: MatchingChange, current: string) {
  if (change.kind === 'reset') return '';
  if (change.kind === 'pair') return change.ok ? 'Õige!' : 'Proovi uuesti';
  return current;
}

// English words on the left, their Estonian meanings on the right.
export default function EnglishMatchingBoard({ words, onPair, onBoardComplete, layoutSeed = 1, showFeedback = true, state, onStateChange }: EnglishMatchingBoardProps) {
  const selection: MatchingSelection = {
    boardKey: state.boardKey,
    leftId: state.selectedEnglishId,
    rightId: state.selectedEstonianId,
    completedIds: state.completedIds
  };
  return (
    <MatchingBoard
      items={words}
      layoutSeed={layoutSeed}
      selection={selection}
      onSelectionChange={(next, change) => onStateChange({
        boardKey: next.boardKey,
        selectedEnglishId: next.leftId,
        selectedEstonianId: next.rightId,
        completedIds: next.completedIds,
        feedback: nextFeedback(change, state.feedback)
      })}
      onPair={onPair}
      onBoardComplete={onBoardComplete}
      renderLeft={(word) => word.english}
      renderRight={(word) => word.estonian}
    >
      {showFeedback ? <p className='matching-feedback'>{state.feedback}</p> : null}
    </MatchingBoard>
  );
}
