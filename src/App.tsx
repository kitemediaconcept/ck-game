/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CorekraftLogo } from './components/CorekraftLogo';
import { PuzzleBoard } from './components/PuzzleBoard';
import { HintModal } from './components/HintModal';
import { VictoryModal } from './components/VictoryModal';
import { TimeoutModal } from './components/TimeoutModal';
import { EnquiryModal } from './components/EnquiryModal';
import { AdminDashboard } from './components/AdminDashboard';
import { getHamperDataUri } from './utils/hamperArtwork';
import { soundEffects } from './utils/soundEffects';
import {
  generateSolvableBoard,
  makeMove,
  isBoardSolved,
  DifficultyLevel,
  DIFFICULTY_PRESETS,
} from './utils/puzzleEngine';
import {
  GameMode,
  GamePhase,
  GameStats,
  CorporateEnquiry,
} from './types/campaign';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Eye,
  Clock,
  RotateCcw,
  Compass,
  CheckCircle2,
  Hash,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Sliders,
} from 'lucide-react';

const DEFAULT_CHALLENGE_SECONDS = 90;
const INITIAL_PREVIEW_SECONDS = 5;

export default function App() {
  // Campaign State
  const [mode, setMode] = useState<GameMode>('challenge');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [introCountdown, setIntroCountdown] = useState<number>(INITIAL_PREVIEW_SECONDS);

  // Puzzle State
  const [board, setBoard] = useState<number[]>(() => generateSolvableBoard('easy').board);
  const [moves, setMoves] = useState<number>(0);
  const [hintsRemaining, setHintsRemaining] = useState<number>(2);
  const [hintsUsedThisRound, setHintsUsedThisRound] = useState<number>(0);
  const [isHintOpen, setIsHintOpen] = useState<boolean>(false);
  const [showTileNumbers, setShowTileNumbers] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundEffects.getMuted());

  // Timer State (Deadline-based)
  const [timeRemaining, setTimeRemaining] = useState<number>(DEFAULT_CHALLENGE_SECONDS);
  const [solveDuration, setSolveDuration] = useState<number>(0);
  const deadlineRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Modals
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState<boolean>(false);
  const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState<boolean>(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Persistent Analytics & Leads
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem('corekraft_puzzle_stats');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      puzzleStarts: 0,
      challengeWins: 0,
      timeouts: 0,
      practiceSessions: 0,
      totalMovesMade: 0,
      hintsUsedCount: 0,
      bestTimeSeconds: null,
      bestMoves: null,
    };
  });

  const [enquiries, setEnquiries] = useState<CorporateEnquiry[]>(() => {
    try {
      const saved = localStorage.getItem('corekraft_gifting_leads');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Count how many tiles are currently in correct positions
  const solvedTilesCount = board.reduce((acc, tile, idx) => {
    if (tile !== 0 && tile === idx + 1) return acc + 1;
    return acc;
  }, 0);

  useEffect(() => {
    try {
      localStorage.setItem('corekraft_puzzle_stats', JSON.stringify(stats));
    } catch {}
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem('corekraft_gifting_leads', JSON.stringify(enquiries));
    } catch {}
  }, [enquiries]);

  // Intro countdown
  useEffect(() => {
    if (phase !== 'intro') return;

    setIntroCountdown(INITIAL_PREVIEW_SECONDS);
    const interval = setInterval(() => {
      setIntroCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  // Start gameplay
  const startGameplay = useCallback(() => {
    const now = Date.now();
    startTimeRef.current = now;

    if (mode === 'challenge') {
      const deadline = now + DEFAULT_CHALLENGE_SECONDS * 1000;
      deadlineRef.current = deadline;
      setTimeRemaining(DEFAULT_CHALLENGE_SECONDS);

      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      timerIntervalRef.current = setInterval(() => {
        const remainingMs = deadlineRef.current ? deadlineRef.current - Date.now() : 0;
        const seconds = Math.max(0, Math.ceil(remainingMs / 1000));
        setTimeRemaining(seconds);

        if (seconds <= 0) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          soundEffects.playTimeoutLock();
          setPhase('timeout');
          setIsTimeoutModalOpen(true);
          setStats((prev) => ({
            ...prev,
            timeouts: prev.timeouts + 1,
          }));
        }
      }, 250);
    } else {
      setTimeRemaining(0);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setTimeRemaining(elapsed);
      }, 1000);
    }

    setPhase('playing');
    setStats((prev) => ({
      ...prev,
      puzzleStarts: prev.puzzleStarts + 1,
      practiceSessions: mode === 'practice' ? prev.practiceSessions + 1 : prev.practiceSessions,
    }));
  }, [mode]);

  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  // Reset round
  const resetRound = useCallback(
    (newMode: GameMode = 'challenge', newDiff: DifficultyLevel = difficulty) => {
      stopTimer();
      const newBoard = generateSolvableBoard(newDiff).board;
      setBoard(newBoard);
      setMoves(0);
      setHintsRemaining(2);
      setHintsUsedThisRound(0);
      setIsHintOpen(false);
      setIsVictoryModalOpen(false);
      setIsTimeoutModalOpen(false);
      setMode(newMode);
      setDifficulty(newDiff);
      setPhase('intro');
    },
    [difficulty, stopTimer]
  );

  // Handle tile move
  const handleTileClick = useCallback(
    (tileIndex: number) => {
      if (phase !== 'playing') return;

      const result = makeMove(board, tileIndex);
      if (!result) return;

      const nextBoard = result.board;
      const nextMoves = moves + 1;
      setBoard(nextBoard);
      setMoves(nextMoves);

      setStats((prev) => ({
        ...prev,
        totalMovesMade: prev.totalMovesMade + 1,
      }));

      if (isBoardSolved(nextBoard)) {
        stopTimer();
        const durationSec =
          mode === 'challenge'
            ? Math.max(1, DEFAULT_CHALLENGE_SECONDS - timeRemaining)
            : timeRemaining;

        setSolveDuration(durationSec);
        setPhase('victory');
        setIsVictoryModalOpen(true);

        if (mode === 'challenge') {
          setStats((prev) => {
            const isBestTime =
              prev.bestTimeSeconds === null ||
              durationSec < prev.bestTimeSeconds ||
              (durationSec === prev.bestTimeSeconds &&
                (prev.bestMoves === null || nextMoves < prev.bestMoves));

            return {
              ...prev,
              challengeWins: prev.challengeWins + 1,
              bestTimeSeconds: isBestTime ? durationSec : prev.bestTimeSeconds,
              bestMoves: isBestTime ? nextMoves : prev.bestMoves,
            };
          });
        }
      }
    },
    [board, phase, moves, mode, timeRemaining, stopTimer]
  );

  const handleUseHint = () => {
    if (hintsRemaining <= 0 || phase !== 'playing' || isHintOpen) return;
    soundEffects.playHintChime();
    setHintsRemaining((prev) => prev - 1);
    setHintsUsedThisRound((prev) => prev + 1);
    setIsHintOpen(true);

    setStats((prev) => ({
      ...prev,
      hintsUsedCount: prev.hintsUsedCount + 1,
    }));
  };

  const handleToggleMute = () => {
    const updated = soundEffects.toggleMute();
    setIsMuted(updated);
  };

  const isSolved = phase === 'victory';

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sf flex flex-col justify-between selection:bg-[#FF4A68] selection:text-white">
      {/* Top Header - White Theme Matching mycorekraft.com */}
      <header className="border-b border-slate-100 bg-white/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Brand Wordmark & External Site Link */}
          <div className="flex items-center gap-3">
            <a
              href="https://mycorekraft.com/"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-1.5 focus:outline-none"
              title="Visit mycorekraft.com"
            >
              <CorekraftLogo className="h-7 sm:h-8" theme="dark" />
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF4A68] transition-colors" />
            </a>
            <div className="hidden sm:block h-5 w-px bg-slate-200" />
            <span className="hidden sm:inline-block text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Corporate Gifting Campaign
            </span>
          </div>

          {/* Quick Controls: Numbers, Sound, Plan Gifts CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowTileNumbers(!showTileNumbers)}
              type="button"
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                showTileNumbers
                  ? 'bg-rose-50 border-rose-200 text-[#FF4A68]'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title="Toggle Tile Number Badges"
            >
              <Hash className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Numbers</span>
            </button>

            <button
              onClick={handleToggleMute}
              type="button"
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-[#FF4A68] transition-colors cursor-pointer"
              aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsEnquiryModalOpen(true)}
              type="button"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
            >
              Plan Gifts
            </button>
          </div>
        </div>
      </header>

      {/* Main Campaign Arena */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 flex flex-col items-center justify-center">
        {/* Campaign Hero Headline */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#FF4A68] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Corekraft — Crack the Christmas Box</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
            Can You Crack the Christmas Box?
          </h1>

          <p className="text-sm sm:text-base text-slate-500 font-normal">
            15 tiles. 90 seconds. One perfectly packed gift.
          </p>

          {/* Difficulty Preset Selector */}
          <div className="mt-4 inline-flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {(['easy', 'standard', 'expert'] as DifficultyLevel[]).map((level) => {
              const cfg = DIFFICULTY_PRESETS[level];
              const isActive = difficulty === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => resetRound(mode, level)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200 font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {cfg.name}
                </button>
              );
            })}
          </div>

          {mode === 'practice' && (
            <div className="mt-3 block text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full w-fit mx-auto">
              Practice Mode — Untimed (Does not count toward timed challenge record)
            </div>
          )}
        </div>

        {/* Phase 1: Pre-Play Intro Preview (5s completed image + Rules breakdown) */}
        {phase === 'intro' ? (
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100 text-center animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase">
                <Clock className="w-4 h-4 text-[#FF4A68]" />
                <span>Gift Hamper Preview ({introCountdown}s)</span>
              </div>
              <span className="text-xs text-slate-500">{DIFFICULTY_PRESETS[difficulty].description}</span>
            </div>

            {/* Completed Hamper Preview Image */}
            <div className="relative w-64 sm:w-72 aspect-square mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-md mb-5">
              <img
                src={getHamperDataUri()}
                alt="Completed Corekraft Hamper"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent flex items-end justify-center p-3">
                <span className="text-[11px] font-semibold text-white">
                  Executive Notebook · Bottle · Mug · Pen · Keychain
                </span>
              </div>
            </div>

            {/* Rules Checklist */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2 mb-6 text-slate-600">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Easy Sliding Controls</strong>: Tap any highlighted adjacent tile or press <strong>Arrow keys / WASD</strong> to slide pieces into the empty space.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Green Checkmarks</strong>: Correctly placed tiles show a green checkmark so you easily track your progress.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>2 Reference Hints</strong>: Use the hint button anytime during your 90-second run.
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={startGameplay}
              type="button"
              className="w-full py-4 px-8 rounded-2xl bg-[#FF4A68] hover:bg-[#E11D48] text-white font-extrabold text-base uppercase tracking-wider shadow-lg shadow-rose-200 transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Accept the Challenge</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-[11px] text-slate-400 mt-2">
              The 90-second countdown begins when you press Accept the Challenge.
            </p>
          </div>
        ) : (
          /* Active Gameplay Arena */
          <div className="w-full flex flex-col items-center">
            {/* Top HUD Meter Strip */}
            <div className="w-full max-w-[480px] bg-white border border-slate-200 rounded-3xl p-3 sm:p-4 mb-4 shadow-sm flex items-center justify-between">
              {/* Timer HUD */}
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-2xl ${
                    timeRemaining <= 15 && mode === 'challenge'
                      ? 'bg-rose-50 text-[#FF4A68] animate-pulse'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    {mode === 'challenge' ? 'Time Remaining' : 'Elapsed Time'}
                  </span>
                  <span
                    className={`text-xl sm:text-2xl font-extrabold font-mono tabular-nums ${
                      timeRemaining <= 15 && mode === 'challenge'
                        ? 'text-[#FF4A68]'
                        : 'text-slate-900'
                    }`}
                  >
                    {mode === 'challenge' ? `${timeRemaining}s` : `${timeRemaining}s`}
                  </span>
                </div>
              </div>

              {/* Solved Progress / Moves */}
              <div className="text-center px-3 border-x border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  In Place
                </span>
                <span className="text-base sm:text-lg font-bold font-mono text-emerald-600 tabular-nums">
                  {solvedTilesCount}/15 ✓
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {moves} moves
                </span>
              </div>

              {/* Reference Hint Button */}
              <div>
                <button
                  onClick={handleUseHint}
                  disabled={hintsRemaining <= 0 || isSolved}
                  type="button"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    hintsRemaining > 0 && !isSolved
                      ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs cursor-pointer'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  }`}
                  title="Preview completed image for 3 seconds"
                >
                  <Eye className="w-4 h-4" />
                  <span>Hint ({hintsRemaining})</span>
                </button>
              </div>
            </div>

            {/* Puzzle Grid */}
            <PuzzleBoard
              board={board}
              onTileClick={handleTileClick}
              isSolved={isSolved}
              showTileNumbers={showTileNumbers}
              disabled={phase !== 'playing'}
            />

            {/* Lower Utility Controls */}
            <div className="w-full max-w-[480px] mt-4 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Arrows / WASD</span>
                <span>or tap tiles</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => resetRound('challenge', difficulty)}
                  type="button"
                  className="hover:text-[#FF4A68] flex items-center gap-1 transition-colors cursor-pointer font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart</span>
                </button>

                {mode === 'challenge' && (
                  <button
                    onClick={() => resetRound('practice', difficulty)}
                    type="button"
                    className="hover:text-teal-700 flex items-center gap-1 transition-colors cursor-pointer text-teal-600 font-medium"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Practice Mode</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Corporate Gifting Banner */}
      <section className="bg-slate-50 border-t border-slate-100 py-6 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-base font-extrabold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-[#FF4A68]" />
              <span>Looking for Christmas Gifts for Your Team?</span>
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Explore bespoke luxury hampers with your corporate logo debossed, engraved, and delivered on schedule across India & globally.
            </p>
          </div>

          <button
            onClick={() => setIsEnquiryModalOpen(true)}
            type="button"
            className="px-6 py-3 rounded-xl bg-[#FF4A68] hover:bg-[#E11D48] text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
          >
            Plan My Corporate Gifts
          </button>
        </div>
      </section>

      {/* Clean Minimal White Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CorekraftLogo className="h-5" theme="dark" />
            <span className="text-slate-400">
              © 2026 Corekraft Corporate Gifting · Kozhikode, Kerala
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <a
              href="https://mycorekraft.com/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#FF4A68] transition-colors"
            >
              mycorekraft.com
            </a>
            <span className="text-slate-300">·</span>
            <button
              onClick={() => setIsEnquiryModalOpen(true)}
              type="button"
              className="hover:text-[#FF4A68] transition-colors cursor-pointer"
            >
              Wholesale Hampers
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={() => setIsAdminOpen(true)}
              type="button"
              className="hover:text-slate-800 flex items-center gap-1 transition-colors cursor-pointer text-slate-400"
              title="Campaign Organizer Console"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700" />
              <span>Organizer Console</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <HintModal
        isOpen={isHintOpen}
        onClose={() => setIsHintOpen(false)}
        hintsRemaining={hintsRemaining}
        timeRemaining={timeRemaining}
      />

      <VictoryModal
        isOpen={isVictoryModalOpen}
        timeSeconds={solveDuration}
        moves={moves}
        hintsUsed={hintsUsedThisRound}
        onPlayAgain={() => resetRound(mode, difficulty)}
        onOpenEnquiry={() => {
          setIsVictoryModalOpen(false);
          setIsEnquiryModalOpen(true);
        }}
        isPracticeMode={mode === 'practice'}
      />

      <TimeoutModal
        isOpen={isTimeoutModalOpen}
        movesMade={moves}
        onTryAgain={() => resetRound('challenge', difficulty)}
        onStartPractice={() => resetRound('practice', difficulty)}
        onOpenEnquiry={() => {
          setIsTimeoutModalOpen(false);
          setIsEnquiryModalOpen(true);
        }}
      />

      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        onSubmitSuccess={(newEnquiry) => {
          setEnquiries((prev) => [newEnquiry, ...prev]);
        }}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        stats={stats}
        enquiries={enquiries}
        onClearStats={() => {
          setStats({
            puzzleStarts: 0,
            challengeWins: 0,
            timeouts: 0,
            practiceSessions: 0,
            totalMovesMade: 0,
            hintsUsedCount: 0,
            bestTimeSeconds: null,
            bestMoves: null,
          });
        }}
      />
    </div>
  );
}
