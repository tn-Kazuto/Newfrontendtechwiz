'use client';

import React from 'react';

interface Y2KTickerTapeProps {
  inverted?: boolean;
}

export const Y2KTickerTape: React.FC<Y2KTickerTapeProps> = ({ inverted = false }) => {
  const items = [
    '★ FAN HUB PLUS // FANDOM UNIVERSE OS ★',
    '⚡ WORLD TOUR STADIUM ARCHIVE 2026 ⚡',
    '✦ HANTEO & CIRCLE CERTIFIED FIRST PRESS ✦',
    '✪ 24-BIT / 96KHZ LOSSLESS SOUND LAB ✪',
    '★ GLOBAL FAN TELETEXT DISPATCH ★',
    '⚡ ANTI-SCALP ENCRYPTED IDENTITY BARCODE ⚡',
    '✦ AUTHENTIC IMPORT // SEALED COLLECTIBLES ✦',
  ];

  return (
    <div 
      className={`w-full overflow-hidden border-y-2 border-black py-2.5 font-mono text-[12px] font-black tracking-widest uppercase select-none shadow-[0px_2px_0px_#000000] ${
        inverted 
          ? 'bg-[#d91470] text-white' 
          : 'bg-[#ffd60a] text-black'
      }`}
    >
      <div className="animate-y2k-ticker flex gap-8 whitespace-nowrap">
        {Array.from({ length: 4 }).map((_, loopIdx) => (
          <div key={loopIdx} className="flex items-center gap-8 shrink-0">
            {items.map((item, idx) => (
              <span key={idx} className="flex items-center gap-8">
                <span className="flex items-center gap-2 drop-shadow-[1px_1px_0px_#000000]">
                  <span>{item}</span>
                </span>
                <span className={inverted ? 'text-[#ffd60a]' : 'text-[#d91470]'}>◆◆◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

