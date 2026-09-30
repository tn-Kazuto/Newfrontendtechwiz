'use client';

import React, { useState } from 'react';
import { ArtisticButton } from './ui/ArtisticButton';
import { Sparkles, ArrowRight, Bookmark, ShoppingBag, Check } from 'lucide-react';

export default function ArtisticShowcase() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-16 sm:py-24 border-t border-zinc-200/70 dark:border-zinc-800">
      {/* Header of the Showcase */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-zinc-200/60 dark:border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Design System Specification 2026</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            Artistic Typography & Premium Button System
          </h2>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-sm sm:text-base max-w-2xl">
            Standardizing 3 distinct typography archetypes paired with 4 pixel-perfect button variants, featuring WCAG 2.1 AA contrast and natural motion curves.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ArtisticButton
            variant="kinetic"
            href="#buttons-section"
            className="text-xs"
          >
            Explore Button Tokens
          </ArtisticButton>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: 3 ARTISTIC TYPOGRAPHY ARCHETYPES
          ========================================================================= */}
      <div className="space-y-16 mb-24">
        {/* Archetype 1: Editorial Haute Couture */}
        <div className="rounded-3xl p-8 sm:p-12 bg-stone-50 dark:bg-zinc-900/40 border border-stone-200/80 dark:border-zinc-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between gap-4 mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
              Archetype 01 // Editorial Haute Couture
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-stone-200/70 dark:bg-zinc-800 text-stone-700 dark:text-stone-300">
              Cormorant Garamond + Plus Jakarta Sans
            </span>
          </div>

          {/* Editorial Headline with alternating Regular & Italic rhythm */}
          <div className="my-6">
            <h3 className="font-haute-display text-4xl sm:text-6xl lg:text-7xl font-light tracking-[-0.015em] leading-[1.08] text-zinc-900 dark:text-stone-100">
              The <span className="italic font-normal text-stone-900 dark:text-white">Ephemeral Beauty</span> of <span className="font-semibold italic text-amber-900 dark:text-amber-200/90">Curated Sounds</span> & Visual Poetry.
            </h3>
          </div>

          <p className="font-haute-body text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-3xl leading-[1.6] my-6">
            A curated intersection of timeless haute couture serif elegance and Parisian editorial typography. Light 300 headlines balanced with romantic Italic 400 accents create enduring emotional depth for exclusive music releases and collector editions.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-stone-200 dark:border-zinc-800">
            <ArtisticButton variant="celestial" icon={<ShoppingBag className="w-4 h-4" />}>
              Order Exclusive Edition
            </ArtisticButton>
            <ArtisticButton variant="kinetic" href="#editorial-view">
              Explore Full Collection
            </ArtisticButton>
          </div>
        </div>

        {/* Archetype 2: Modernist Avant-Garde */}
        <div className="rounded-3xl p-8 sm:p-12 bg-zinc-950 text-white border border-zinc-800 relative overflow-hidden">
          <div className="flex items-center justify-between gap-4 mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
              Archetype 02 // Modernist Avant-Garde
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-zinc-800 text-zinc-300">
              Syne (800) + JetBrains Mono
            </span>
          </div>

          <div className="my-6">
            <h3 className="font-avantgarde-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] leading-[1.12] text-white">
              DIGITAL SYMPHONY <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-600">// HORIZON 2026</span>
            </h3>
          </div>

          <div className="font-avantgarde-mono text-xs sm:text-sm text-zinc-400 space-y-1.5 my-6 bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 max-w-2xl">
            <p className="text-emerald-400 font-semibold">// METRIC_LATENCY: 1.18MS | SAMPLING_RATE: 192KHZ 32-BIT</p>
            <p>DATA_STREAM: LOSSLESS MASTER AUDIO RECORDING VERIFIED</p>
            <p>ENCRYPTION: HARDWARE-BASED CERTIFICATE ID #KPOP-2026-HQ</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-zinc-800/80">
            <ArtisticButton variant="frosted" icon={<ArrowRight className="w-4 h-4" />}>
              Access Recording Studio
            </ArtisticButton>
          </div>
        </div>

        {/* Archetype 3: Tactile Organic Craft */}
        <div className="rounded-3xl p-8 sm:p-12 bg-amber-50/50 dark:bg-stone-900/30 border border-amber-200/60 dark:border-stone-800 relative overflow-hidden">
          <div className="flex items-center justify-between gap-4 mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800 dark:text-amber-400">
              Archetype 03 // Tactile Organic Craft
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              Caveat (Handwritten) + Plus Jakarta Sans
            </span>
          </div>

          <div className="relative py-4">
            <span className="font-tactile-accent text-2xl sm:text-3xl text-amber-700 dark:text-amber-400 font-bold -rotate-2 inline-block">
              ✍️ &quot;Limited trial print run with handwritten signature – strictly 100 copies!&quot;
            </span>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-4 tracking-tight">
              Handcrafted Ink Signature Photocard
            </h3>

            <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              Adds an authentic personal touch with callout margin notes, handcrafted stickers, and idol emotional imprints dedicated to true fans.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-6 mt-4 border-t border-amber-200/50 dark:border-stone-800">
            <ArtisticButton variant="tactile" icon={<Bookmark className="w-4 h-4" />}>
              Save to Craft Collection
            </ArtisticButton>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: 4 BUTTON VARIANTS INTERACTIVE LAB
          ========================================================================= */}
      <div id="buttons-section" className="space-y-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-white">
            4 Pixel-Perfect Standardized Button Variants
          </h3>
          <p className="text-zinc-500 text-sm mt-2">
            Each button variant adheres to 3 architectural tiers: morphology, surface luminescence, and subtle micro-motion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: The Celestial Shimmer */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  01. The Celestial Shimmer
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  Primary CTA
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                Pill silhouette (`rounded-full`), deep gradient substrate, 1px hairline stroke with an animated 45° luminous sweep triggered on hover.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 py-6 px-4 bg-zinc-100/70 dark:bg-zinc-950/60 rounded-xl justify-center">
              <ArtisticButton variant="celestial" size="sm">
                Small Button
              </ArtisticButton>
              <ArtisticButton variant="celestial" size="md">
                Explore Now
              </ArtisticButton>
              <ArtisticButton variant="celestial" size="lg">
                Large CTA
              </ArtisticButton>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span>hover:scale-[1.02] active:scale-[0.98]</span>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `<ArtisticButton variant="celestial">Explore Now</ArtisticButton>`,
                    'celestial'
                  )
                }
                className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                {copiedKey === 'celestial' ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>

          {/* Card 2: Frosted Obsidian Glass */}
          <div className="rounded-2xl p-6 sm:p-8 bg-zinc-950 text-white border border-zinc-800 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-100">
                  02. Frosted Obsidian Glass
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  Secondary Floating
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                Aerodynamic geometry (`rounded-2xl`), frosted obsidian substrate with backdrop blur (`backdrop-blur-xl`), reflective hairline rim, and 2px micro-glide arrow.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 py-6 px-4 bg-zinc-900/90 rounded-xl justify-center">
              <ArtisticButton variant="frosted" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                View Details
              </ArtisticButton>
              <ArtisticButton variant="frosted" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                Leaderboard
              </ArtisticButton>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span>backdrop-blur-xl border-white/10</span>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `<ArtisticButton variant="frosted" icon={<ArrowRight />}>Leaderboard</ArtisticButton>`,
                    'frosted'
                  )
                }
                className="hover:text-white transition-colors cursor-pointer"
              >
                {copiedKey === 'frosted' ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>

          {/* Card 3: Editorial Kinetic Arrow */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  03. Editorial Kinetic Arrow
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  Ghost Link Magazine
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                Small uppercase tracking (`tracking-[0.2em]`), left-to-right animated underline expansion, and kinetic diagonal arrow on hover.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 py-6 px-4 bg-zinc-100/70 dark:bg-zinc-950/60 rounded-xl justify-center">
              <ArtisticButton variant="kinetic" size="sm">
                Read Interview
              </ArtisticButton>
              <ArtisticButton variant="kinetic" size="md">
                Explore 2026 Edition
              </ArtisticButton>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span>scale-x-0 -&gt; 100 | translate-x-1 -translate-y-1</span>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `<ArtisticButton variant="kinetic" href="/magazines">Explore 2026 Edition</ArtisticButton>`,
                    'kinetic'
                  )
                }
                className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                {copiedKey === 'kinetic' ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>

          {/* Card 4: Handcrafted Neo-Tactile */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  04. Handcrafted Neo-Tactile
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  Tactile Feedback
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                Organic asymmetrical geometry (`rounded-[14px_4px_16px_6px]`), 2px jet-black border, and 3px brutalist drop shadow. Simulates mechanical push feedback when clicked.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 py-6 px-4 bg-zinc-100/70 dark:bg-zinc-950/60 rounded-xl justify-center">
              <ArtisticButton variant="tactile" size="sm">
                Try Pressing
              </ArtisticButton>
              <ArtisticButton variant="tactile" size="md">
                Claim Special Photocard
              </ArtisticButton>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span>active:translate(3px,3px) active:shadow-none</span>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `<ArtisticButton variant="tactile">Claim Special Photocard</ArtisticButton>`,
                    'tactile'
                  )
                }
                className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                {copiedKey === 'tactile' ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
