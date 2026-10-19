import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { generateAndDownloadScoreCard } from '../utils/scoreCardGenerator';
import { soundEffects } from '../utils/soundEffects';
import { CorekraftLogo } from './CorekraftLogo';
import { Award, Share2, Download, RotateCcw, Check, Sparkles } from 'lucide-react';

interface VictoryModalProps {
  isOpen: boolean;
  timeSeconds: number;
  moves: number;
  hintsUsed: number;
  onPlayAgain: () => void;
  onOpenEnquiry: () => void;
  isPracticeMode?: boolean;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  timeSeconds,
  moves,
  hintsUsed,
  onPlayAgain,
  onOpenEnquiry,
  isPracticeMode = false,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [ribbonUntied, setRibbonUntied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      soundEffects.playVictoryFanfare();
      soundEffects.playRibbonWhoosh();

      const ribbonTimer = setTimeout(() => {
        setRibbonUntied(true);
      }, 350);

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#FF4A68', '#D4AF37', '#0F172A', '#10B981', '#F59E0B'],
        });
      } catch {}

      return () => clearTimeout(ribbonTimer);
    } else {
      setRibbonUntied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const campaignUrl = typeof window !== 'undefined' ? window.location.href : 'https://mycorekraft.com';
  const shareText = `I cracked Corekraft’s Christmas Box in ${timeSeconds} seconds and ${moves} moves! Can you beat me? ${campaignUrl}`;

  const handleCopyShare = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await generateAndDownloadScoreCard({
        timeSeconds,
        moves,
        hintsUsed,
        campaignUrl,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      {/* Decorative Ribbon Unravel Banner */}
      <div
        className={`pointer-events-none fixed inset-0 flex items-center justify-center transition-all duration-700 ${
          ribbonUntied ? 'opacity-0 scale-125' : 'opacity-100 scale-100'
        }`}
      >
        <div className="w-96 h-12 bg-linear-to-r from-[#FF4A68] via-amber-400 to-[#FF4A68] shadow-2xl transform -rotate-6 flex items-center justify-center text-white font-extrabold tracking-widest text-sm rounded-lg">
          ★ COREKRAFT UNLOCKED ★
        </div>
      </div>

      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-center my-8">
        {/* Coral Badge Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mb-4">
          <Award className="w-8 h-8 text-[#FF4A68]" />
        </div>

        <div>
          <CorekraftLogo className="h-7 mx-auto mb-3" theme="dark" />

          {isPracticeMode && (
            <div className="inline-block text-[11px] font-semibold tracking-wider uppercase text-slate-600 bg-slate-100 px-3 py-0.5 rounded-full mb-2">
              Practice Session Completed
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">
            You Cracked the Christmas Box!
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            {isPracticeMode
              ? 'Great job assembling the Corekraft holiday hamper!'
              : 'You mastered the puzzle and unlocked Corekraft’s executive holiday gift set.'}
          </p>

          {/* Performance Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Time
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#FF4A68] font-mono tabular-nums">
                {timeSeconds}s
              </span>
            </div>

            <div className="flex flex-col items-center border-x border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Moves
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                {moves}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Hints
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 font-mono tabular-nums">
                {hintsUsed}/2
              </span>
            </div>
          </div>

          {/* Action Row: Download Certificate & Social Share */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              type="button"
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Generating Card...' : 'Download Score Card'}</span>
            </button>

            <button
              onClick={handleCopyShare}
              type="button"
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs tracking-wider hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-[#FF4A68]" />
                  <span>Share Result</span>
                </>
              )}
            </button>
          </div>

          {/* Social Share Quote */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 mb-6">
            <span className="text-[#FF4A68] font-bold block mb-1">Share message:</span>
            <p className="italic text-slate-700">
              “I cracked Corekraft’s Christmas Box in {timeSeconds} seconds and {moves} moves! Can you beat me?”
            </p>
          </div>

          {/* Primary Lead Conversion Banner */}
          <div className="p-5 rounded-2xl bg-linear-to-br from-rose-50 to-orange-50 border border-rose-100 text-center mb-6">
            <div className="flex items-center justify-center gap-1.5 text-[#FF4A68] text-xs font-bold tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Looking for Christmas Gifts for Your Team?</span>
            </div>
            <p className="text-xs text-slate-600 mb-4 max-w-sm mx-auto">
              Custom-branded corporate hampers containing executive notebooks, drinkware, pens & bespoke accessories with festive delivery.
            </p>
            <button
              onClick={onOpenEnquiry}
              type="button"
              className="w-full py-3 px-6 rounded-xl bg-[#FF4A68] hover:bg-[#E11D48] text-white font-extrabold text-sm uppercase tracking-wider shadow-md transition-transform active:scale-[0.98] cursor-pointer"
            >
              Plan My Corporate Gifts
            </button>
          </div>

          {/* Play Again */}
          <button
            onClick={onPlayAgain}
            type="button"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer py-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Play Again to Beat Your Record</span>
          </button>
        </div>
      </div>
    </div>
  );
};
