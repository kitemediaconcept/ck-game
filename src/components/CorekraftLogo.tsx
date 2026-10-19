import React from 'react';

interface CorekraftLogoProps {
  className?: string;
  theme?: 'dark' | 'light';
}

/**
 * Recreates the authentic Corekraft logo from image.png and mycorekraft.com:
 * Lowercase bold modern sans 'corekraft' with signature coral-pink crown over the 'c'.
 */
export const CorekraftLogo: React.FC<CorekraftLogoProps> = ({
  className = 'h-8',
  theme = 'dark',
}) => {
  const textColor = theme === 'dark' ? '#0F172A' : '#FFFFFF';
  
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 240 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain"
        aria-label="Corekraft Logo"
      >
        <defs>
          <linearGradient id="corekraftPinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4A68" />
            <stop offset="100%" stopColor="#FF6B6B" />
          </linearGradient>
        </defs>

        {/* Signature coral-pink crown accent above the 'c' */}
        <path
          d="M 12 10 L 26 10 C 26.5 10 27 10.5 27 11 L 27 16 C 27 16.5 26.5 17 26 17 L 21 17 C 20.5 17 20 16.5 20 16 L 20 14 C 20 13.5 19.5 13 19 13 C 18.5 13 18 13.5 18 14 L 18 16 C 18 16.5 17.5 17 17 17 L 12 17 C 11.5 17 11 16.5 11 16 L 11 11 C 11 10.5 11.5 10 12 10 Z"
          fill="url(#corekraftPinkGrad)"
        />

        {/* 'corekraft' wordmark */}
        <text
          x="10"
          y="48"
          fill={textColor}
          fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
          fontWeight="800"
          fontSize="36"
          letterSpacing="-1.2px"
        >
          corekraft
        </text>
      </svg>
    </div>
  );
};
