import React, { useState } from 'react';
import { CorekraftLogo } from './CorekraftLogo';
import { Lock, RotateCcw, Compass, Share2, Check, Sparkles } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface TimeoutModalProps {
  isOpen: boolean;
  movesMade: number;
  onTryAgain: () => void;
  onStartPractice: () => void;
  onOpenEnquiry: () => void;
}

export const TimeoutModal: React.FC<TimeoutModalProps> = ({
  isOpen,
  movesMade,
  onTryAgain,
  onStartPractice,
  onOpenEnquiry,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const campaignUrl = typeof window !== 'undefined' ? window.location.href : 'https://mycorekraft.com';
  const shareText = `Can you crack Corekraft’s Christmas Box in 90 seconds? Take the challenge: ${campaignUrl}`;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-center my-8">
        {/* Lock Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-amber-500" />
        </div>

        <CorekraftLogo className="h-7 mx-auto mb-3" theme="dark" />

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
          The Christmas Box Is Still Locked!
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Time ran out at 90 seconds. You made <span className="text-slate-900 font-bold font-mono">{movesMade}</span> moves. Try again with easier mode or practice untimed!
        </p>

        {/* Retry & Practice Options */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={() => {
              soundEffects.playTileSlide();
              onTryAgain();
            }}
            type="button"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again (90s)</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playTileSlide();
              onStartPractice();
            }}
            type="button"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs tracking-wider transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#FF4A68]" />
            <span>Practise Without a Timer</span>
          </button>
        </div>

        {/* Social Share Incomplete quote */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs mb-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-500 font-medium">Challenge your team:</span>
            <button
              onClick={handleCopyShare}
              type="button"
              className="text-[11px] font-bold text-[#FF4A68] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
          <p className="italic text-slate-700">
            “Can you crack Corekraft’s Christmas Box in 90 seconds? Take the challenge!”
          </p>
        </div>

        {/* Corporate Gifts CTA Banner */}
        <div className="p-5 rounded-2xl bg-linear-to-br from-rose-50 to-orange-50 border border-rose-100 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[#FF4A68] text-xs font-bold tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Looking for Christmas Gifts for Your Team?</span>
          </div>
          <p className="text-xs text-slate-600 mb-4 max-w-sm mx-auto">
            Discover tailored executive hampers, bespoke corporate branding, and hassle-free festive fulfillment from Corekraft.
          </p>
          <button
            onClick={onOpenEnquiry}
            type="button"
            className="w-full py-3 px-6 rounded-xl bg-[#FF4A68] hover:bg-[#E11D48] text-white font-extrabold text-sm uppercase tracking-wider shadow-md transition-transform active:scale-[0.98] cursor-pointer"
          >
            Plan My Corporate Gifts
          </button>
        </div>
      </div>
    </div>
  );
};
