'use client';

import { KirsiReadingPair } from '@/lib/kirsiReadingPairs';
import MatchingBoard, { type MatchingSelection } from '@/app/components/MatchingBoard';

type PictureWordSprintBoardProps = {
  pairs: KirsiReadingPair[];
  onPair: (ok: boolean, picture: KirsiReadingPair, word: KirsiReadingPair) => void;
  onBoardComplete: () => void;
  layoutSeed?: number;
  state: PictureWordSprintBoardState;
  onStateChange: (state: PictureWordSprintBoardState) => void;
};

// Saved as part of the picture–word run; the field names are its storage format.
export type PictureWordSprintBoardState = {
  boardKey: string;
  selectedPictureId: string | null;
  selectedWordId: string | null;
  completedIds: string[];
};

// Pictures on the left, words on the right.
export default function PictureWordSprintBoard({ pairs, onPair, onBoardComplete, layoutSeed = 1, state, onStateChange }: PictureWordSprintBoardProps) {
  const selection: MatchingSelection = {
    boardKey: state.boardKey,
    leftId: state.selectedPictureId,
    rightId: state.selectedWordId,
    completedIds: state.completedIds
  };
  return (
    <MatchingBoard
      items={pairs}
      layoutSeed={layoutSeed}
      selection={selection}
      onSelectionChange={(next) => onStateChange({
        boardKey: next.boardKey,
        selectedPictureId: next.leftId,
        selectedWordId: next.rightId,
        completedIds: next.completedIds
      })}
      onPair={onPair}
      onBoardComplete={onBoardComplete}
      className='matching-board picture-word-board'
      leftColumnLabel='Pildid'
      rightColumnLabel='Sõnad'
      leftCardClassName='word-card picture-card'
      rightCardClassName='word-card reading-word-card'
      leftCardLabel={(pair, done) => `${pair.image} pilt${done ? ', valmis' : ''}`}
      renderLeft={(pair) => <span className='picture-card-emoji' aria-hidden>{pair.image}</span>}
      renderRight={(pair) => <span>{pair.word}</span>}
    />
  );
}
