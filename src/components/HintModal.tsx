import React, { useEffect, useState } from 'react';
import { getHamperDataUri } from '../utils/hamperArtwork';
import { X, Clock } from 'lucide-react';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  hintsRemaining: number;
  timeRemaining: number;
}

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  onClose,
  hintsRemaining,
  timeRemaining,
}) => {
  const [countdown, setCountdown] = useState<number>(3);
  const hamperUri = getHamperDataUri();

  useEffect(() => {
    if (!isOpen) {
      setCountdown(3);
      return;
    }

    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Top Header */}
        <div className="w-full flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <span className="w-2 h-2 rounded-full bg-[#FF4A68]" />
            <span>REFERENCE HINT ({countdown}s)</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-[#FF4A68]" />
            <span>Countdown: {timeRemaining}s</span>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close hint"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Completed Image Preview with 4x4 Grid Overlay */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-inner my-2">
          <img
            src={hamperUri}
            alt="Corekraft Christmas Hamper Reference"
            className="w-full h-full object-cover"
          />

          {/* Clean grid lines showing tile numbers */}
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="border border-slate-900/15 flex items-start justify-start p-1"
              >
                <span className="text-[10px] font-mono font-bold text-white bg-slate-900/80 px-1 rounded shadow-xs">
                  {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-3 flex items-center justify-between w-full text-xs text-slate-500">
          <span>Hints remaining: {hintsRemaining}</span>
          <span className="text-[#FF4A68] font-semibold">Auto-closes in {countdown}s</span>
        </div>
      </div>
    </div>
  );
};
