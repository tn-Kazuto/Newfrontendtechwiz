'use client';

import React from 'react';
import Link from 'next/link';

export const MultimediaProtocolBanner: React.FC = () => {
  return (
    <div 
      style={{ borderRadius: '0px' }}
      className="p-8 bg-[#ffd60a] text-black border-3 border-black shadow-[6px_6px_0px_#000000] flex flex-col md:flex-row items-center justify-between gap-6 font-mono"
    >
      <div className="space-y-2 text-center md:text-left">
        <span 
          style={{ borderRadius: '0px' }}
          className="text-[10px] uppercase tracking-widest bg-[#ff2e93] text-white border border-black px-2.5 py-1 font-black shadow-[2px_2px_0px_#000] inline-block"
        >
          STANDARDS // LOSSLESS AUDIO AUDIT
        </span>
        <h3 className="font-serif text-xl md:text-2xl font-black uppercase text-black tracking-tight">
          Official Master Rights &amp; High-Fidelity Distribution
        </h3>
        <p className="font-sans text-xs font-semibold text-neutral-800 max-w-2xl leading-relaxed">
          Every broadcast stream, behind-the-scenes documentary, and original soundtrack is licensed under official distribution pacts certified by global labels.
        </p>
      </div>

      <div className="shrink-0">
        <Link
          href="/#upcoming-releases"
          style={{ borderRadius: '0px' }}
          className="px-6 py-3.5 bg-[#ff2e93] text-white text-xs font-mono font-black uppercase tracking-widest hover:bg-[#e11d48] border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-y-0.5 transition-all inline-block"
        >
          [VIEW RELEASE SCHEDULE →]
        </Link>
      </div>
    </div>
  );
};
