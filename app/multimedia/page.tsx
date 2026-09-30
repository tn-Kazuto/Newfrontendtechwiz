'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { MultimediaCenter } from '../../components/MultimediaCenter';
import { AlbumDetailModal } from '../../components/AlbumDetailModal';
import { CartDrawer } from '../../components/CartDrawer';
import { WishlistModal } from '../../components/WishlistModal';
import { ChatbotModal } from '../../components/ChatbotModal';
import { AudioPlayer } from '../../components/AudioPlayer';
import { AdminModal } from '../../components/AdminModal';
import { FeedbackModal } from '../../components/FeedbackModal';
import { Footer } from '../../components/Footer';
import { Album } from '../../types';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { Tv, Radio, Sparkles, Volume2 } from 'lucide-react';

import { useActiveFandom } from '../../utils/fandomTheme';
import { FanCommunityFeed } from '../../components/FanCommunityFeed';

export default function MultimediaPage() {
  const [activeMainTab, setActiveMainTab] = useState<'live' | 'feed'>('live');
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { setIsCartOpen } = useCartWishlist();
  const { themeKey, category } = useActiveFandom();

  return (
    <div 
      className={`min-h-screen flex flex-col fandom-theme-${themeKey} transition-colors duration-500`}
      data-fandom-theme={themeKey}
    >
      {/* Navigation Header */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        fandomThemeKey={themeKey}
        fandomCategory={category}
      />

      <main className="flex-1">
        {/* Unified Breadcrumbs Navigation */}
        <div className="bg-white border-b-2 border-black">
          <Breadcrumbs 
            items={[
              { label: 'Cinematheque & Sound Lab (Multimedia Streaming Hub)', isActive: true }
            ]} 
          />
        </div>

        {/* Dedicated Multimedia Category Hero Banner */}
        {(() => {
          const heroConfigs: Record<string, {
            badge: string;
            title1: string;
            title2: string;
            desc: string;
            spec1Label: string;
            spec1Val: string;
            spec1Color: string;
            spec2Label: string;
            spec2Val: string;
            spec2Color: string;
            spec3Label: string;
            spec3Val: string;
            spec3Color: string;
            accentColor: string;
          }> = {
            gaming: {
              badge: 'SECTION 03 ARCHIVE // 4K 60FPS ESPORTS ARENA & CYBER SYNTH LAB',
              title1: 'Arcade Net & ',
              title2: 'Sound Lab',
              desc: 'Official esports & gaming audiovisual archive: 4K 60FPS cinematic trailers, Worlds tournament streams, 24-bit lossless symphonic game OSTs, and developer soundscapes.',
              spec1Label: 'RESOLUTION',
              spec1Val: '4K 60FPS',
              spec1Color: '#00ff66',
              spec2Label: 'AUDIO CODEC',
              spec2Val: '24-BIT FLAC',
              spec2Color: '#00f0ff',
              spec3Label: 'LATENCY',
              spec3Val: 'ZERO DELAY',
              spec3Color: '#ff0055',
              accentColor: '#00ff66',
            },
            manga: {
              badge: 'SECTION 05 ARCHIVE // MOTION COMICS & AUTHOR AUDIO DIARIES',
              title1: 'Ink Motion & ',
              title2: 'Soundstage',
              desc: 'Motion manga releases, behind-the-drawing-board Mangaka audio podcasts, serialized anime opening themes, and Japanese voice-actor live readings.',
              spec1Label: 'RENDER',
              spec1Val: '4K MOTION INK',
              spec1Color: '#2d2d2d',
              spec2Label: 'AUDIO CODEC',
              spec2Val: 'HI-RES MASTER',
              spec2Color: '#c2410c',
              spec3Label: 'BROADCAST',
              spec3Val: 'VOICE DRAMA',
              spec3Color: '#4338ca',
              accentColor: '#c2410c',
            },
            anime: {
              badge: 'SECTION 02 ARCHIVE // 4K SAKUGA KEYFRAMES & HI-RES SOUNDTRACKS',
              title1: 'Sakuga Cinema & ',
              title2: 'Sound Lab',
              desc: 'High-framerate sakuga animation sequences, Hiroyuki Sawano orchestral suites, voice actor table reads, and IMAX anime movie trailers.',
              spec1Label: 'RESOLUTION',
              spec1Val: '4K HDR 60FPS',
              spec1Color: '#ccff00',
              spec2Label: 'AUDIO CODEC',
              spec2Val: '24-BIT / 192K',
              spec2Color: '#00f0ff',
              spec3Label: 'STUDIO',
              spec3Val: 'UFOTABLE HDR',
              spec3Color: '#ccff00',
              accentColor: '#ccff00',
            },
            cosplay: {
              badge: 'SECTION 04 ARCHIVE // 4K RUNWAY & ATELIER MASTERCLASSES',
              title1: 'Atelier Runway & ',
              title2: 'Audio Craft',
              desc: 'World Cosplay Summit 4K multi-cam stage coverage, prop craftsmanship live workshops, convention masquerades, and character theme tracks.',
              spec1Label: 'COVERAGE',
              spec1Val: '4K MULTI-CAM',
              spec1Color: '#38bdf8',
              spec2Label: 'AUDIO CODEC',
              spec2Val: 'STUDIO STEREO',
              spec2Color: '#facc15',
              spec3Label: 'WORKSHOP',
              spec3Val: 'LIVE ATELIER',
              spec3Color: '#ef4444',
              accentColor: '#38bdf8',
            },
            comics: {
              badge: 'SECTION 06 ARCHIVE // POP-ART MOTION PANELS & NOIR SOUNDTRACKS',
              title1: 'Panel Motion & ',
              title2: 'Audio Vault',
              desc: 'Spider-Verse dynamic comic motion cuts, legendary Hans Zimmer & Danny Elfman comic scores, and creator spotlight masterclasses.',
              spec1Label: 'RESOLUTION',
              spec1Val: '4K CINEMATIC',
              spec1Color: '#ffd60a',
              spec2Label: 'AUDIO CODEC',
              spec2Val: 'DOLBY ATMOS',
              spec2Color: '#00f0ff',
              spec3Label: 'FORMAT',
              spec3Val: 'PANEL SYNC',
              spec3Color: '#ff2e93',
              accentColor: '#ffd60a',
            },
            cinema: {
              badge: 'SECTION 07 ARCHIVE // 70MM THEATRICAL & UNCOMPRESSED SCORES',
              title1: 'Cinematheque 70mm & ',
              title2: 'Score Lab',
              desc: 'Theatrical 4K HDR trailers, uncompressed 24-bit / 96kHz symphonic film scores, director commentaries, and backstage filmmaking documentaries.',
              spec1Label: 'FORMAT',
              spec1Val: '70MM IMAX',
              spec1Color: '#d4af37',
              spec2Label: 'AUDIO CODEC',
              spec2Val: 'FLAC 96KHZ',
              spec2Color: '#f1f5f9',
              spec3Label: 'MASTER',
              spec3Val: 'AUTEUR DCI',
              spec3Color: '#d4af37',
              accentColor: '#d4af37',
            },
            tv: {
              badge: 'SECTION 08 ARCHIVE // 4K CRT STREAMS & SERIES COMPOSITIONS',
              title1: 'Binge Station & ',
              title2: 'Series Lab',
              desc: 'Binge TV series trailers, cast table reads, 80s synthwave scores, and interactive fan watchalong livestreams.',
              spec1Label: 'RESOLUTION',
              spec1Val: '4K ULTRA HD',
              spec1Color: '#a78bfa',
              spec2Label: 'AUDIO CODEC',
              spec2Val: 'SURROUND 5.1',
              spec2Color: '#38bdf8',
              spec3Label: 'WATCHPARTY',
              spec3Val: 'REALTIME',
              spec3Color: '#f43f5e',
              accentColor: '#a78bfa',
            },
            kpop: {
              badge: 'SECTION 01 ARCHIVE // 4K BROADCAST & LOSSLESS 24-BIT SOUND LAB',
              title1: 'Cinematheque & ',
              title2: 'Sound Lab',
              desc: 'Official audio-visual archive: 4K HDR cinematic trailers, backstage footage, 24-bit audiophile Lossless soundstage, studio podcasts, and interactive real-time teletext live streams.',
              spec1Label: 'RESOLUTION',
              spec1Val: '4K HDR',
              spec1Color: '#ffd60a',
              spec2Label: 'AUDIO CODEC',
              spec2Val: '24-BIT/96K',
              spec2Color: '#00f0ff',
              spec3Label: 'TELETEXT',
              spec3Val: 'REALTIME',
              spec3Color: '#ff2e93',
              accentColor: '#00f0ff',
            }
          };

          const conf = heroConfigs[themeKey] || heroConfigs.kpop;

          return (
            <section 
              className="bg-black text-white px-4 sm:px-8 py-10 sm:py-14 border-b-4 border-black relative overflow-hidden"
            >
              {/* Subtle Cyber Grid Background */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

              <div className="max-w-[1440px] mx-auto relative z-10">
                {/* Breadcrumb Path */}
                <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 uppercase tracking-widest mb-4">
                  <Link href="/" className="hover:text-[#ffd60a] transition-colors">HOME</Link>
                  <span>/</span>
                  <span className="text-[#ffd60a] font-bold">MULTIMEDIA STREAMING HUB</span>
                  <span>/</span>
                  <span className="text-white uppercase font-bold">{category}</span>
                </div>

                <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-8">
                  <div className="max-w-3xl space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ff2e93] text-white border-2 border-white font-mono text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_#ffffff]">
                      <Tv className="w-3.5 h-3.5" />
                      <span>{conf.badge}</span>
                    </div>

                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-tight tracking-tight">
                      {conf.title1}{' '}
                      <em className="font-serif italic font-normal" style={{ color: conf.accentColor }}>
                        {conf.title2}
                      </em>
                    </h1>

                    <p className="font-serif text-xs sm:text-sm text-neutral-300 leading-relaxed font-light max-w-2xl">
                      {conf.desc}
                    </p>
                  </div>

                  {/* Specification Stamps */}
                  <div className="flex gap-3 sm:gap-4 flex-wrap font-mono">
                    <div 
                      style={{ borderRadius: '0px' }}
                      className="p-3 sm:p-4 bg-neutral-900 border-2 border-white min-w-[130px] shadow-[3px_3px_0px_#ffd60a]"
                    >
                      <span className="text-[9px] text-neutral-400 uppercase tracking-widest block font-bold">{conf.spec1Label}</span>
                      <span className="text-lg font-black flex items-center gap-1" style={{ color: conf.spec1Color }}>
                        <Sparkles className="w-4 h-4" />
                        {conf.spec1Val}
                      </span>
                    </div>

                    <div 
                      style={{ borderRadius: '0px' }}
                      className="p-3 sm:p-4 bg-neutral-900 border-2 border-white min-w-[130px] shadow-[3px_3px_0px_#00f0ff]"
                    >
                      <span className="text-[9px] text-neutral-400 uppercase tracking-widest block font-bold">{conf.spec2Label}</span>
                      <span className="text-lg font-black flex items-center gap-1" style={{ color: conf.spec2Color }}>
                        <Volume2 className="w-4 h-4" />
                        {conf.spec2Val}
                      </span>
                    </div>

                    <div 
                      style={{ borderRadius: '0px' }}
                      className="p-3 sm:p-4 bg-neutral-900 border-2 border-white min-w-[130px] shadow-[3px_3px_0px_#ff2e93]"
                    >
                      <span className="text-[9px] text-neutral-400 uppercase tracking-widest block font-bold">{conf.spec3Label}</span>
                      <span className="text-lg font-black flex items-center gap-1" style={{ color: conf.spec3Color }}>
                        <Radio className="w-4 h-4" />
                        {conf.spec3Val}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Fandom Hub / Live Space Navigation Tabs */}
        <div className="bg-[#fefce8] border-b-2 border-black sticky top-[60px] z-30 px-4 sm:px-8 py-2.5">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveMainTab('live')}
                className={`px-4 py-2 text-xs font-black uppercase tracking-wider font-mono border-2 border-black transition-all cursor-pointer ${
                  activeMainTab === 'live'
                    ? 'bg-[#ff2e93] text-white shadow-[2px_2px_0px_#000]'
                    : 'bg-white text-black hover:bg-neutral-100'
                }`}
              >
                ★ IDOL LIVE STREAM (LIVE SPACE)
              </button>

              <button
                type="button"
                onClick={() => setActiveMainTab('feed')}
                className={`px-4 py-2 text-xs font-black uppercase tracking-wider font-mono border-2 border-black transition-all cursor-pointer ${
                  activeMainTab === 'feed'
                    ? 'bg-[#00f0ff] text-black shadow-[2px_2px_0px_#000]'
                    : 'bg-white text-black hover:bg-neutral-100'
                }`}
              >
                ✦ FANDOM COMMUNITY FEED
              </button>
            </div>

            <span className="hidden sm:inline font-mono text-[11px] text-neutral-600 font-bold">
              WEBSOCKET SYNCHRONIZED STREAM &amp; SOCIAL FEED
            </span>
          </div>
        </div>

        {activeMainTab === 'live' ? (
          /* Full Interactive Multimedia Center & Livestream with Virtual Gifting */
          <MultimediaCenter defaultCategory={category} />
        ) : (
          /* Fandom Community Feed */
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8">
            <FanCommunityFeed />
          </div>
        )}
      </main>

      {/* Modals & Drawers */}
      <AlbumDetailModal
        album={selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
      />
      <CartDrawer />
      <WishlistModal />
      <AudioPlayer />
      <ChatbotModal
        onFilterArtist={() => {}}
        onOpenCart={() => setIsCartOpen(true)}
      />
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />
    </div>
  );
}
