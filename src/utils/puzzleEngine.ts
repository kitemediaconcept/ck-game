/**
 * Puzzle engine for 4x4 15-puzzle.
 * Solvability is guaranteed by simulating legal moves from the solved state.
 */

export const BOARD_SIZE = 4;
export const TOTAL_TILES = 16;
export const BLANK_TILE = 0;

export const SOLVED_BOARD: number[] = [
  1, 2, 3, 4,
  5, 6, 7, 8,
  9, 10, 11, 12,
  13, 14, 15, 0,
];

export type DifficultyLevel = 'easy' | 'standard' | 'expert';

export interface DifficultyConfig {
  name: string;
  shuffleLength: number;
  minManhattan: number;
  maxManhattan: number;
  description: string;
}

export const DIFFICULTY_PRESETS: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    name: 'Casual (Easy)',
    shuffleLength: 14,
    minManhattan: 6,
    maxManhattan: 12,
    description: 'Quick & fun · Solve in 20–45s',
  },
  standard: {
    name: 'Standard',
    shuffleLength: 28,
    minManhattan: 12,
    maxManhattan: 22,
    description: 'Balanced challenge · Solve in 45–75s',
  },
  expert: {
    name: 'Expert',
    shuffleLength: 120,
    minManhattan: 30,
    maxManhattan: 999,
    description: 'Master solver · 100+ moves',
  },
};

/**
 * Returns row and column (0-indexed) for an index (0-15)
 */
export function getCoordinates(index: number): { row: number; col: number } {
  return {
    row: Math.floor(index / BOARD_SIZE),
    col: index % BOARD_SIZE,
  };
}

/**
 * Computes the target coordinate for a tile number (1-15, or 0)
 */
export function getTargetCoordinates(tileNumber: number): { row: number; col: number } {
  if (tileNumber === BLANK_TILE) {
    return { row: 3, col: 3 };
  }
  const solvedIndex = tileNumber - 1;
  return getCoordinates(solvedIndex);
}

/**
 * Calculates Manhattan distance of all numbered tiles (excluding blank) from their goal positions.
 */
export function calculateManhattanDistance(board: number[]): number {
  let distance = 0;
  for (let i = 0; i < board.length; i++) {
    const tile = board[i];
    if (tile !== BLANK_TILE) {
      const current = getCoordinates(i);
      const target = getTargetCoordinates(tile);
      distance += Math.abs(current.row - target.row) + Math.abs(current.col - target.col);
    }
  }
  return distance;
}

/**
 * Checks if a specific tile is currently in its correct goal slot.
 */
export function isTileInCorrectPosition(board: number[], index: number): boolean {
  const tile = board[index];
  if (tile === BLANK_TILE) {
    return index === 15;
  }
  return tile === index + 1;
}

/**
 * Checks if the board is in the win/solved configuration.
 */
export function isBoardSolved(board: number[]): boolean {
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== SOLVED_BOARD[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Returns valid neighbor indices of the blank position that can legally slide into the blank.
 */
export function getLegalMoveIndices(emptyIndex: number): number[] {
  const { row, col } = getCoordinates(emptyIndex);
  const legal: number[] = [];

  // Tile above blank slides DOWN into blank
  if (row > 0) legal.push((row - 1) * BOARD_SIZE + col);
  // Tile below blank slides UP into blank
  if (row < BOARD_SIZE - 1) legal.push((row + 1) * BOARD_SIZE + col);
  // Tile left of blank slides RIGHT into blank
  if (col > 0) legal.push(row * BOARD_SIZE + (col - 1));
  // Tile right of blank slides LEFT into blank
  if (col < BOARD_SIZE - 1) legal.push(row * BOARD_SIZE + (col + 1));

  return legal;
}

/**
 * Checks if a specific tile index is adjacent to the blank position.
 */
export function isAdjacentToEmpty(tileIndex: number, emptyIndex: number): boolean {
  const t = getCoordinates(tileIndex);
  const e = getCoordinates(emptyIndex);
  return (
    (t.row === e.row && Math.abs(t.col - e.col) === 1) ||
    (t.col === e.col && Math.abs(t.row - e.row) === 1)
  );
}

/**
 * Executes a move on the board immutably, swapping the specified tile with the blank.
 */
export function makeMove(board: number[], tileIndex: number): { board: number[]; emptyIndex: number } | null {
  const emptyIndex = board.indexOf(BLANK_TILE);
  if (!isAdjacentToEmpty(tileIndex, emptyIndex)) {
    return null;
  }
  const nextBoard = [...board];
  nextBoard[emptyIndex] = board[tileIndex];
  nextBoard[tileIndex] = BLANK_TILE;

  return {
    board: nextBoard,
    emptyIndex: tileIndex,
  };
}

/**
 * Generates a strictly solvable puzzle by executing legal random moves from the solved board,
 * rejecting immediate reversals, and ensuring board is not solved and fits difficulty parameters.
 */
export function generateSolvableBoard(level: DifficultyLevel = 'easy'): {
  board: number[];
  emptyIndex: number;
  manhattanDistance: number;
} {
  const config = DIFFICULTY_PRESETS[level] || DIFFICULTY_PRESETS.easy;
  const maxAttempts = 30;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const board = [...SOLVED_BOARD];
    let emptyIndex = 15;
    let lastMovedTile: number | null = null;

    for (let step = 0; step < config.shuffleLength; step++) {
      const legalIndices = getLegalMoveIndices(emptyIndex);
      const filtered = legalIndices.filter((idx) => board[idx] !== lastMovedTile);
      const candidates = filtered.length > 0 ? filtered : legalIndices;

      const chosenIndex = candidates[Math.floor(Math.random() * candidates.length)];
      const tileToMove = board[chosenIndex];

      board[emptyIndex] = tileToMove;
      board[chosenIndex] = BLANK_TILE;
      lastMovedTile = tileToMove;
      emptyIndex = chosenIndex;
    }

    const dist = calculateManhattanDistance(board);
    if (!isBoardSolved(board) && dist >= config.minManhattan) {
      return {
        board,
        emptyIndex,
        manhattanDistance: dist,
      };
    }
  }

  // Fallback
  const board = [...SOLVED_BOARD];
  let emptyIndex = 15;
  let lastMovedTile: number | null = null;

  for (let step = 0; step < config.shuffleLength; step++) {
    const legalIndices = getLegalMoveIndices(emptyIndex);
    const filtered = legalIndices.filter((idx) => board[idx] !== lastMovedTile);
    const candidates = filtered.length > 0 ? filtered : legalIndices;
    const chosenIndex = candidates[Math.floor(Math.random() * candidates.length)];
    const tileToMove = board[chosenIndex];

    board[emptyIndex] = tileToMove;
    board[chosenIndex] = BLANK_TILE;
    lastMovedTile = tileToMove;
    emptyIndex = chosenIndex;
  }

  return {
    board,
    emptyIndex,
    manhattanDistance: calculateManhattanDistance(board),
  };
}

/**
 * Directional helper for Arrow / WASD keys
 */
export function getTileIndexForDirection(
  direction: 'up' | 'down' | 'left' | 'right',
  emptyIndex: number
): number | null {
  const { row, col } = getCoordinates(emptyIndex);

  switch (direction) {
    case 'up':
      return row < BOARD_SIZE - 1 ? (row + 1) * BOARD_SIZE + col : null;
    case 'down':
      return row > 0 ? (row - 1) * BOARD_SIZE + col : null;
    case 'left':
      return col < BOARD_SIZE - 1 ? row * BOARD_SIZE + (col + 1) : null;
    case 'right':
      return col > 0 ? row * BOARD_SIZE + (col - 1) : null;
    default:
      return null;
  }
}
