'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { TourCalendar } from '../../components/TourCalendar';
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
import { EventHeroBanner } from '../../components/EventHeroBanner';
import { LocationAwareEventExplorer } from '../../components/LocationAwareEventExplorer';
import { useActiveFandom } from '../../utils/fandomTheme';
import { 
  Ticket, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Flame, 
  Radio, 
  Award, 
  HelpCircle,
  Sparkles,
  Heart,
  Store,
  ExternalLink,
  ChevronRight,
  Layers,
  Vote,
  BookOpen,
  Film,
  Gamepad2,
  Tv
} from 'lucide-react';

export default function EventPage() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { setIsCartOpen } = useCartWishlist();
  const { themeKey, category, changeFandom } = useActiveFandom();

  const isManga = themeKey === 'manga';
  const isAnime = themeKey === 'anime';
  const isCosplay = themeKey === 'cosplay';
  const isGaming = themeKey === 'gaming';
  const isComics = themeKey === 'comics';
  const isCinema = themeKey === 'cinema';
  const isTv = themeKey === 'tv';

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
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs 
          items={[
            { label: `${category} Events, Tours & Stage Calendar`, isActive: true }
          ]} 
        />

        {/* Editorial Event Showcase Carousel Banner with Category Dock */}
        <EventHeroBanner 
          activeCategory={category as any}
          onSelectCategory={(cat) => changeFandom(cat)}
        />

        {/* Location-Aware Event Radar & Calendar Explorer (GPS, Map, Radius & Directions) */}
        <LocationAwareEventExplorer fandomCategory={category} />

        {/* Tour Calendar Component with Category Filtering, VIP Passes & Live RSVP */}
        <TourCalendar activeCategory={category} />

        {/* Dynamic Fandom Guidelines & Ecosystem FAQ */}
        <section 
          style={{ 
            backgroundColor: isCinema ? '#09090b' : isManga ? '#fdfbf7' : isGaming ? '#050505' : '#f8fafc', 
            borderTop: isCinema ? '1px solid #d4af37' : isManga ? '2px solid #2d2d2d' : '1px solid #e2e8f0', 
            padding: '64px 24px',
            color: isCinema || isGaming ? '#ffffff' : '#0f172a'
          }}
        >
          <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
              <span 
                style={{ 
                  fontSize: '10px', 
                  fontFamily: isGaming ? "'JetBrains Mono', monospace" : isManga ? "'Kalam', cursive" : 'monospace', 
                  fontWeight: 800, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.2em', 
                  color: isCinema ? '#d4af37' : isAnime ? '#84cc16' : isCosplay ? '#D02020' : '#94a3b8' 
                }}
              >
                {category.toUpperCase()} ECOSYSTEM PROTOCOLS
              </span>
              <h2 
                style={{ 
                  fontFamily: isManga ? "'Kalam', cursive" : isCinema ? "'Playfair Display', Georgia, serif" : "'Space Grotesk', sans-serif", 
                  fontSize: '30px', 
                  fontWeight: 800, 
                  color: isCinema || isGaming ? '#ffffff' : '#0f172a', 
                  margin: '8px 0 0 0' 
                }}
              >
                {isManga ? 'Shonen Jump & Mangaka Stage Protocols' :
                 isAnime ? 'Sakuga Night &ufotable 4K Premiere Protocols' :
                 isCosplay ? 'Bauhaus Constructivist Costume & Prop Protocols' :
                 isGaming ? 'Esports World Championship & Symphony Protocols' :
                 isComics ? 'Comic-Con Hall H & Multiverse Art Protocols' :
                 isCinema ? '70mm IMAX Photochemical Projection Protocols' :
                 isTv ? 'Television Binge & Red Carpet World Premiere Protocols' :
                 'Official Event Verification & Participation Guide'}
              </h2>
              <p className={`text-xs mt-2 max-w-xl mx-auto ${isCinema || isGaming ? 'text-neutral-400' : 'text-slate-500'}`}>
                Comprehensive step-by-step instructions on verified ticketing, autograph lotteries, anti-scalp wristbands, and VIP stage passes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Protocol 1 */}
              <div 
                style={{ 
                  backgroundColor: isCinema ? '#121215' : isGaming ? '#121212' : '#ffffff', 
                  padding: '24px', 
                  border: isCinema ? '1px solid #d4af37' : isManga ? '2px solid #2d2d2d' : isCosplay ? '2px solid #D02020' : '1.5px solid #000000', 
                  borderRadius: isManga ? '6px' : '0px' 
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  {isManga ? <BookOpen style={{ width: '28px', height: '28px', color: '#ff4d4d' }} /> :
                   isCinema ? <Film style={{ width: '28px', height: '28px', color: '#d4af37' }} /> :
                   isGaming ? <Gamepad2 style={{ width: '28px', height: '28px', color: '#00f0ff' }} /> :
                   <Radio style={{ width: '28px', height: '28px', color: '#059669' }} />}
                  <span 
                    className="text-[10px] font-mono font-bold px-2 py-0.5"
                    style={{ 
                      backgroundColor: isCinema ? '#27272a' : isManga ? '#ffe4e6' : isAnime ? '#ecfccb' : '#d1fae5',
                      color: isCinema ? '#d4af37' : isManga ? '#9f1239' : isAnime ? '#3f6212' : '#065f46'
                    }}
                  >
                    {isManga ? 'MANGA GUILD PROTOCOL' : isCinema ? '70MM IMAX PROTOCOL' : isGaming ? 'ARENA LIVE PROTOCOL' : 'WEVERSE PROTOCOL'}
                  </span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 8px 0', color: isCinema || isGaming ? '#ffffff' : '#0f172a' }}>
                  {isManga ? 'Shikishi Lotteries & Mangaka Autographs' :
                   isCinema ? '15/70mm IMAX Analog Soundcheck' :
                   isGaming ? 'Worlds Finals Main Stage Seating' :
                   'Stadium Tours & 4K Weverse Live'}
                </h3>
                <p style={{ fontSize: '12px', color: isCinema || isGaming ? '#a1a1aa' : '#64748b', lineHeight: 1.6, margin: '0 0 12px 0' }}>
                  {isManga ? 'First-edition manga purchasers receive authentic holographic lottery tokens for live sketch stage signings with celebrated Weekly Shonen Jump mangaka.' :
                   isCinema ? 'Screenings feature genuine 70mm photochemical film stock with uncompressed director reference mix and authentic physical film strip specimens.' :
                   isGaming ? 'Encrypted RFID wristbands guarantee instantaneous venue access, exclusive digital battle pass unlocks, and symphonic orchestra prime acoustics.' :
                   'Official tickets include encrypted barcodes with anti-scalping identity binding. Verified Fanclub Members gain priority presale soundcheck access.'}
                </p>
                <ul className={`text-[11px] space-y-1 pl-4 list-disc font-medium ${isCinema || isGaming ? 'text-neutral-300' : 'text-slate-700'}`}>
                  <li>Certified anti-scalping digital identity verification</li>
                  <li>Fast-track VIP express floor check-in gate</li>
                  <li>Exclusive commemorative collector pass inclusions</li>
                </ul>
              </div>

              {/* Protocol 2 */}
              <div 
                style={{ 
                  backgroundColor: isCinema ? '#121215' : isGaming ? '#121212' : '#ffffff', 
                  padding: '24px', 
                  border: isCinema ? '1px solid #d4af37' : isManga ? '2px solid #2d2d2d' : isCosplay ? '2px solid #D02020' : '1.5px solid #000000', 
                  borderRadius: isManga ? '6px' : '0px' 
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <Sparkles style={{ width: '28px', height: '28px', color: isCinema ? '#d4af37' : '#be185d' }} />
                  <span 
                    className="text-[10px] font-mono font-bold px-2 py-0.5"
                    style={{ 
                      backgroundColor: isCinema ? '#27272a' : '#fce7f3',
                      color: isCinema ? '#d4af37' : '#9d174d'
                    }}
                  >
                    EXPO BENEFITS &amp; PERKS
                  </span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 8px 0', color: isCinema || isGaming ? '#ffffff' : '#0f172a' }}>
                  Limited Event Merch &amp; First Press Drops
                </h3>
                <p style={{ fontSize: '12px', color: isCinema || isGaming ? '#a1a1aa' : '#64748b', lineHeight: 1.6, margin: '0 0 12px 0' }}>
                  Ticket holders unlock dedicated pre-order allocations for event-exclusive merchandise, foil artboards, and limited edition boxsets unavailable through retail channels.
                </p>
                <ul className={`text-[11px] space-y-1 pl-4 list-disc font-medium ${isCinema || isGaming ? 'text-neutral-300' : 'text-slate-700'}`}>
                  <li>Direct venue pickup without queue delays</li>
                  <li>Collector authenticity certificates included</li>
                  <li>Exclusive foil variant covers and badges</li>
                </ul>
              </div>

              {/* Protocol 3 */}
              <div 
                style={{ 
                  backgroundColor: isCinema ? '#121215' : isGaming ? '#121212' : '#ffffff', 
                  padding: '24px', 
                  border: isCinema ? '1px solid #d4af37' : isManga ? '2px solid #2d2d2d' : isCosplay ? '2px solid #D02020' : '1.5px solid #000000', 
                  borderRadius: isManga ? '6px' : '0px' 
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <Heart style={{ width: '28px', height: '28px', color: isCinema ? '#d4af37' : '#7e22ce', fill: isCinema ? '#d4af37' : '#7e22ce' }} />
                  <span 
                    className="text-[10px] font-mono font-bold px-2 py-0.5"
                    style={{ 
                      backgroundColor: isCinema ? '#27272a' : '#f3e8ff',
                      color: isCinema ? '#d4af37' : '#6b21a8'
                    }}
                  >
                    COMMUNITY SUPPORT &amp; VOTING
                  </span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 8px 0', color: isCinema || isGaming ? '#ffffff' : '#0f172a' }}>
                  Fan Cheers &amp; Billboard Campaigns
                </h3>
                <p style={{ fontSize: '12px', color: isCinema || isGaming ? '#a1a1aa' : '#64748b', lineHeight: 1.6, margin: '0 0 12px 0' }}>
                  Pool votes and support points to unlock stadium LED banners, Times Square electronic billboards, and celebrate milestones across global fandom communities.
                </p>
                <ul className={`text-[11px] space-y-1 pl-4 list-disc font-medium ${isCinema || isGaming ? 'text-neutral-300' : 'text-slate-700'}`}>
                  <li>Real-time community voting impact</li>
                  <li>International LED screen broadcasting</li>
                  <li>Fandom leaderboards with donor credits</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
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

      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />
    </div>
  );
}
