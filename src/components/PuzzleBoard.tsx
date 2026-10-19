import React, { useEffect, useCallback, useState } from 'react';
import { getHamperDataUri } from '../utils/hamperArtwork';
import {
  BOARD_SIZE,
  BLANK_TILE,
  isAdjacentToEmpty,
  getTileIndexForDirection,
  isTileInCorrectPosition,
  getCoordinates,
} from '../utils/puzzleEngine';
import { soundEffects } from '../utils/soundEffects';
import { Check } from 'lucide-react';

interface PuzzleBoardProps {
  board: number[];
  onTileClick: (index: number) => void;
  isSolved: boolean;
  disabled?: boolean;
  showTileNumbers?: boolean;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  board,
  onTileClick,
  isSolved,
  disabled = false,
  showTileNumbers = true,
}) => {
  const [hamperUri] = useState<string>(getHamperDataUri());
  const emptyIndex = board.indexOf(BLANK_TILE);
  const emptyCoords = getCoordinates(emptyIndex);

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (disabled || isSolved) return;

      let direction: 'up' | 'down' | 'left' | 'right' | null = null;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        direction = 'up';
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        direction = 'down';
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        direction = 'left';
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        direction = 'right';
      }

      if (direction) {
        e.preventDefault();
        const tileIndex = getTileIndexForDirection(direction, emptyIndex);
        if (tileIndex !== null) {
          onTileClick(tileIndex);
        }
      }
    },
    [disabled, isSolved, emptyIndex, onTileClick]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Determine slide direction arrow pointing toward the empty slot
  const getSlideArrow = (index: number): string | null => {
    if (!isAdjacentToEmpty(index, emptyIndex)) return null;
    const tileCoords = getCoordinates(index);
    if (tileCoords.row < emptyCoords.row) return '↓';
    if (tileCoords.row > emptyCoords.row) return '↑';
    if (tileCoords.col < emptyCoords.col) return '→';
    if (tileCoords.col > emptyCoords.col) return '←';
    return null;
  };

  return (
    <div className="relative mx-auto w-full max-w-[440px] sm:max-w-[480px] aspect-square p-2.5 sm:p-3 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/60 transition-all select-none">
      {/* Outer clean border line */}
      <div className="absolute inset-1 rounded-2xl border border-slate-100 pointer-events-none" />

      {/* Grid Container */}
      <div
        className={`w-full h-full grid grid-cols-4 grid-rows-4 gap-1.5 sm:gap-2 rounded-2xl overflow-hidden bg-slate-100/80 p-1.5 ${
          isSolved ? 'gap-0 p-0 border-none' : ''
        }`}
      >
        {board.map((tile, index) => {
          const isBlank = tile === BLANK_TILE;

          if (isBlank && !isSolved) {
            return (
              <div
                key="blank-slot"
                className="w-full h-full rounded-xl bg-slate-200/70 border border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden"
                aria-label="Empty puzzle slot"
              >
                <div className="text-[11px] font-mono font-medium text-slate-400 flex items-center gap-1">
                  <span>16</span>
                </div>
              </div>
            );
          }

          const effectiveTile = isBlank && isSolved ? 16 : tile;
          const targetIndex = effectiveTile - 1;
          const targetCol = targetIndex % BOARD_SIZE;
          const targetRow = Math.floor(targetIndex / BOARD_SIZE);

          const bgPosX = `${(targetCol / 3) * 100}%`;
          const bgPosY = `${(targetRow / 3) * 100}%`;

          const isMovable = !disabled && !isSolved && isAdjacentToEmpty(index, emptyIndex);
          const isCorrect = isTileInCorrectPosition(board, index);
          const slideArrow = isMovable ? getSlideArrow(index) : null;

          return (
            <button
              key={`tile-${effectiveTile}`}
              type="button"
              disabled={disabled || isSolved || !isMovable}
              onClick={() => {
                if (isMovable) {
                  soundEffects.playTileSlide();
                  onTileClick(index);
                }
              }}
              style={{
                backgroundImage: `url("${hamperUri}")`,
                backgroundSize: '400% 400%',
                backgroundPosition: `${bgPosX} ${bgPosY}`,
              }}
              className={`relative w-full h-full transition-all duration-150 transform cursor-default focus:outline-none ${
                isSolved
                  ? 'rounded-none'
                  : 'rounded-xl shadow-xs ' +
                    (isMovable
                      ? 'cursor-pointer hover:scale-[1.03] active:scale-[0.98] ring-2 ring-[#FF4A68] hover:ring-3 shadow-md'
                      : 'opacity-95')
              }`}
              aria-label={`Tile ${effectiveTile}${isMovable ? ' (Can slide)' : ''}`}
            >
              {/* Tile number badge + correct indicator */}
              {showTileNumbers && !isSolved && (
                <div
                  className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-mono font-bold flex items-center gap-0.5 shadow-sm pointer-events-none transition-colors ${
                    isCorrect
                      ? 'bg-emerald-600 text-white border border-emerald-700'
                      : 'bg-slate-900/85 text-white border border-black/20'
                  }`}
                >
                  <span>{effectiveTile}</span>
                  {isCorrect && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
              )}

              {/* Slide direction arrow on movable tiles */}
              {slideArrow && !isSolved && (
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-full bg-[#FF4A68] text-white text-[11px] font-bold shadow-sm pointer-events-none animate-pulse">
                  {slideArrow}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
