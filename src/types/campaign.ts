/**
 * Types for the Corekraft Crack the Christmas Box campaign
 */

export interface PuzzleState {
  board: number[]; // Array of 16 numbers (1-15, and 0 for blank)
  moves: number;
  emptyIndex: number;
  isSolved: boolean;
  hintsRemaining: number;
}

export type GameMode = 'challenge' | 'practice';

export type GamePhase = 
  | 'intro'      // 5-second initial preview & rules
  | 'playing'    // Active gameplay
  | 'victory'    // Solved within deadline (or practice solved)
  | 'timeout';   // Timer ran out

export interface GameStats {
  puzzleStarts: number;
  challengeWins: number;
  timeouts: number;
  practiceSessions: number;
  totalMovesMade: number;
  hintsUsedCount: number;
  bestTimeSeconds: number | null;
  bestMoves: number | null;
}

export interface CorporateEnquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  teamSize: string;
  budgetPerHamper: string;
  deliveryDate: string;
  notes: string;
  submittedAt: string;
}
