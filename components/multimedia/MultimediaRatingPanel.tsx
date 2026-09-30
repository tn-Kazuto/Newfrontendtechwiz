'use client';

import React from 'react';
import { MediaItem } from '../../data/multimediaData';

interface MultimediaRatingPanelProps {
  activeMedia: MediaItem;
  isCinemaMode: boolean;
  hoverRating: number | null;
  showRatingBreakdown: boolean;
  isBookmarked: boolean;
  onRateMedia: (stars: number) => void;
  onHoverRatingChange: (stars: number | null) => void;
  onToggleBreakdown: () => void;
  onVoteThumbs: (vote: 'up' | 'down') => void;
  onToggleBookmark: () => void;
  onShare: () => void;
}

export const MultimediaRatingPanel: React.FC<MultimediaRatingPanelProps> = ({
  activeMedia,
  isCinemaMode,
  hoverRating,
  showRatingBreakdown,
  isBookmarked,
  onRateMedia,
  onHoverRatingChange,
  onToggleBreakdown,
  onVoteThumbs,
  onToggleBookmark,
  onShare,
}) => {
  return (
    <div 
      className={`border-t-2 border-black flex flex-col font-mono text-xs transition-colors duration-200 ${
        isCinemaMode ? 'bg-[#111111] text-white border-neutral-800' : 'bg-[#fdfbf7] text-black border-black'
      }`}
    >
      {/* Accent Color Strip */}
      <div className="flex h-1.5">
        <div className="flex-1 bg-[#ff2e93]" />
        <div className="flex-1 bg-[#ffd60a]" />
        <div className="flex-1 bg-[#00f0ff]" />
        <div className="flex-1 bg-[#ff2e93]" />
        <div className="flex-1 bg-[#ffd60a]" />
      </div>

      {/* Interactive Dock Row */}
      <div className="p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left: Dual Community Rating Widget */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-3">
            {/* Score Box */}
            <div 
              style={{ borderRadius: '0px' }}
              className="border-2 border-black bg-[#ffd60a] text-black px-3.5 py-1.5 text-center shadow-[2px_2px_0px_#000000]"
            >
              <span className="text-base font-black block leading-none">{activeMedia.rating.average}</span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-800">/ 5.0</span>
            </div>

            <div>
              {/* Star Rating Controls */}
              <div className="flex items-center gap-1 text-base">
                {[1, 2, 3, 4, 5].map((starNum) => {
                  const isFilled = (hoverRating !== null ? hoverRating : Math.round(activeMedia.rating.average)) >= starNum;

                  return (
                    <button
                      key={starNum}
                      type="button"
                      onMouseEnter={() => onHoverRatingChange(starNum)}
                      onMouseLeave={() => onHoverRatingChange(null)}
                      onClick={() => onRateMedia(starNum)}
                      className={`cursor-pointer transition-transform hover:scale-125 ${
                        isFilled ? 'text-[#ff2e93]' : 'text-neutral-300 dark:text-neutral-600'
                      }`}
                      title={`Rate ${starNum} out of 5 stars`}
                    >
                      ★
                    </button>
                  );
                })}
              </div>

              {/* Audit Logs Count & Breakdown Trigger */}
              <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-500 font-bold">
                <span>{activeMedia.rating.count.toLocaleString()} AUDIT LOGS</span>
                <button
                  type="button"
                  onClick={onToggleBreakdown}
                  className="text-[#ff2e93] hover:underline cursor-pointer font-black"
                >
                  {showRatingBreakdown ? '[HIDE BREAKDOWN ▴]' : '[DISTRIBUTION ▾]'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Community Vote Feedback (Recommend vs Skip) */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-center">
          <button
            type="button"
            onClick={() => onVoteThumbs('up')}
            style={{ borderRadius: '0px' }}
            className={`px-4 py-2 border-2 border-black font-mono font-black uppercase tracking-wider cursor-pointer transition-all shadow-[2px_2px_0px_#000000] active:translate-y-0.5 ${
              activeMedia.rating.userVote === 'up'
                ? 'bg-[#10b981] text-white'
                : 'bg-white hover:bg-[#ffd60a] text-black'
            }`}
          >
            [RECOMMEND // {activeMedia.rating.thumbsUp.toLocaleString()}]
          </button>

          <button
            type="button"
            onClick={() => onVoteThumbs('down')}
            style={{ borderRadius: '0px' }}
            className={`px-4 py-2 border-2 border-black font-mono font-black uppercase tracking-wider cursor-pointer transition-all shadow-[2px_2px_0px_#000000] active:translate-y-0.5 ${
              activeMedia.rating.userVote === 'down'
                ? 'bg-[#ef4444] text-white'
                : 'bg-white hover:bg-neutral-200 text-black'
            }`}
          >
            [SKIP // {activeMedia.rating.thumbsDown.toLocaleString()}]
          </button>
        </div>

        {/* Right: Quick Archive / Bookmark & Share Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={onToggleBookmark}
            style={{ borderRadius: '0px' }}
            className={`px-4 py-2 border-2 border-black font-mono font-black uppercase tracking-wider cursor-pointer transition-all shadow-[2px_2px_0px_#000000] active:translate-y-0.5 ${
              isBookmarked
                ? 'bg-[#00f0ff] text-black'
                : 'bg-white hover:bg-[#ecfeff] text-black'
            }`}
          >
            {isBookmarked ? '★ [ARCHIVED]' : '[+ ARCHIVE]'}
          </button>

          <button
            type="button"
            onClick={onShare}
            style={{ borderRadius: '0px' }}
            className="px-4 py-2 border-2 border-black font-mono font-black uppercase tracking-wider cursor-pointer bg-white hover:bg-[#ff2e93] hover:text-white text-black transition-all shadow-[2px_2px_0px_#000000] active:translate-y-0.5"
          >
            [SHARE ⎘]
          </button>
        </div>
      </div>

      {/* Rating Breakdown Drawer */}
      {showRatingBreakdown && (
        <div className="p-6 border-t-2 border-black bg-white dark:bg-black font-mono text-xs">
          <div className="max-w-md mx-auto space-y-2">
            <span className="font-mono font-black uppercase tracking-widest block text-center mb-3 text-[#ff2e93]">
              AUDIT DISTRIBUTION ({activeMedia.rating.count.toLocaleString()} ENTRIES)
            </span>
            {[5, 4, 3, 2, 1].map((stars) => {
              const percent = activeMedia.rating.distribution[stars as keyof typeof activeMedia.rating.distribution] || 0;
              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="w-10 font-black text-black dark:text-white">{stars}★</span>
                  <div className="flex-1 h-3 border-2 border-black bg-neutral-100 dark:bg-neutral-800">
                    <div
                      className="h-full bg-[#ffd60a] border-r-2 border-black"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-black text-[#ff2e93]">{percent}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
