'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { AlbumGrid } from '../../components/AlbumGrid';
import { AlbumDetailModal } from '../../components/AlbumDetailModal';
import { CartDrawer } from '../../components/CartDrawer';
import { WishlistModal } from '../../components/WishlistModal';
import { ChatbotModal } from '../../components/ChatbotModal';
import { AudioPlayer } from '../../components/AudioPlayer';
import { AdminModal } from '../../components/AdminModal';
import { FeedbackModal } from '../../components/FeedbackModal';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Footer } from '../../components/Footer';
import { Album } from '../../types';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { Disc, Award, ShieldCheck, Sparkles, BookOpen, Layers } from 'lucide-react';

import { useActiveFandom } from '../../utils/fandomTheme';

export default function CdDvdBookPage() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtistFilter, setSelectedArtistFilter] = useState('all');
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
        <div className="bg-slate-50 border-b border-slate-200">
          <Breadcrumbs
            items={[
              { label: 'CD / DVD & Books (Physical Media)', isActive: true }
            ]}
          />
        </div>

        {/* Dedicated Category-Specific CD/DVD/BOOK Hero Banner */}
        {(() => {
          const bannerConfigs: Record<string, {
            badge: string;
            title1: string;
            title2: string;
            desc: string;
            badgeColor: string;
            stamp1Label: string;
            stamp1Val: string;
            stamp2Label: string;
            stamp2Val: string;
            stamp3Label: string;
            stamp3Val: string;
            stamp3Color?: string;
          }> = {
            gaming: {
              badge: 'ORIGINAL SOUNDTRACKS & OFFICIAL ARTBOOKS · 100% LICENSED',
              title1: 'Gaming OSTs, Vinyl ',
              title2: '& Archival Artbooks',
              desc: 'Official game physical media: audiophile gatefold vinyl soundstages (Elden Ring, Final Fantasy VII), hardcover developer compendiums, and collectors steelbook editions.',
              badgeColor: '#00ff66',
              stamp1Label: 'DEVELOPER DIRECT',
              stamp1Val: 'FROM·HOYO',
              stamp2Label: 'FORMATS',
              stamp2Val: 'VINYL·CD·BOOK',
              stamp3Label: 'ART PRINTS',
              stamp3Val: '100% REAL',
              stamp3Color: '#00ff66',
            },
            manga: {
              badge: 'JAPANESE TANKŌBON & SPECIAL HARDCOVER BOXSETS',
              title1: 'Official Manga, Artbooks ',
              title2: '& Tankōbon Sets',
              desc: 'Imported manga volumes, limited edition anniversary boxsets, serialization guidebooks, and high-definition color shikishi illustrations straight from Japanese publishers.',
              badgeColor: '#f97316',
              stamp1Label: 'PUBLISHERS',
              stamp1Val: 'SHUEISHA·KODAN',
              stamp2Label: 'FORMATS',
              stamp2Val: 'BOOK·SET·CD',
              stamp3Label: 'FIRST-PRINT',
              stamp3Val: 'POB INCL',
              stamp3Color: '#f97316',
            },
            anime: {
              badge: 'SAKUGA BLU-RAY BOXSETS & ANIMATION KEYFRAME BOOKS',
              title1: 'Anime Blu-ray, OSTs ',
              title2: '& Animation Books',
              desc: 'Limited edition anime Blu-ray boxsets, studio keyframe genga collections, Hiroyuki Sawano score vinyls, and Japanese theatrical booklet packages.',
              badgeColor: '#ccff00',
              stamp1Label: 'STUDIOS',
              stamp1Val: 'UFOTABLE·TOEI',
              stamp2Label: 'FORMATS',
              stamp2Val: 'BLU-RAY·OST',
              stamp3Label: 'GENGA PRINTS',
              stamp3Val: '100% AUTH',
              stamp3Color: '#ccff00',
            },
            cosplay: {
              badge: 'COSTUME PATTERN BOOKS & ATELIER MASTER GUIDES',
              title1: 'Cosplay Books, Guides ',
              title2: '& Photobook Compendiums',
              desc: 'Specialized armor fabrication manuals, tailoring master guides, professional international cosplayer photobooks, and makeup transformation books.',
              badgeColor: '#38bdf8',
              stamp1Label: 'MAKER GUILD',
              stamp1Val: 'ATELIER PRO',
              stamp2Label: 'FORMATS',
              stamp2Val: 'GUIDE·BOOK',
              stamp3Label: 'PATTERNS',
              stamp3Val: 'INCLUDED',
              stamp3Color: '#38bdf8',
            },
            comics: {
              badge: 'GRAPHIC NOVELS, OMNIBUSES & VARIANT COVER COMICS',
              title1: 'Graphic Novels, Omnibuses ',
              title2: '& Foil Covers',
              desc: 'Curated comic universe omnibuses, deluxe slipcased graphic novels, Spider-Verse motion artbooks, and collector-graded single issues.',
              badgeColor: '#ffd60a',
              stamp1Label: 'PUBLISHERS',
              stamp1Val: 'MARVEL·DC',
              stamp2Label: 'FORMATS',
              stamp2Val: 'HC·OMNIBUS',
              stamp3Label: 'VIRGIN FOIL',
              stamp3Val: 'CERTIFIED',
              stamp3Color: '#ffd60a',
            },
            cinema: {
              badge: '70MM AUTEUR CRITERION EDITIONS & SYMPHONIC SCORES',
              title1: 'Criterion 4K UHD, Vinyl ',
              title2: '& Script Books',
              desc: 'Auteur cinema catalog: 4K UHD collector digipaks, 70mm archival script books, Hans Zimmer orchestrations on double heavy vinyl, and director storyboard collections.',
              badgeColor: '#d4af37',
              stamp1Label: 'ARCHIVAL',
              stamp1Val: '4K UHD DIGIPAK',
              stamp2Label: 'FORMATS',
              stamp2Val: '2xLP·SCRIPT',
              stamp3Label: 'DIRECTOR POB',
              stamp3Val: 'OFFICIAL',
              stamp3Color: '#d4af37',
            },
            tv: {
              badge: 'SERIES COLLECTOR BOXSETS & NOSTALGIA SYNTH VINYL',
              title1: 'Series Steelbooks, Vinyl ',
              title2: '& Episode Companions',
              desc: 'Deluxe complete season boxsets, Hawkins 80s synthwave score records, behind-the-scenes companion guides, and collector slipcases.',
              badgeColor: '#a78bfa',
              stamp1Label: 'COLLECTOR RUN',
              stamp1Val: 'FULL SEASONS',
              stamp2Label: 'FORMATS',
              stamp2Val: 'LP·STEELBOOK',
              stamp3Label: 'PROP REPLICA',
              stamp3Val: 'INCLUDED',
              stamp3Color: '#a78bfa',
            },
            kpop: {
              badge: 'Hanteo Chart Family Member #HF0082W · 100% Counted',
              title1: 'Official CD, Vinyl ',
              title2: '& Collector Books',
              desc: 'Curated physical media catalog from Seoul, Tokyo, and international record labels. Every purchase contains authentic manufacturer holographic authentication stickers, first-press pre-order benefits (POB), random photocards, and collector slipcases.',
              badgeColor: '#f59e0b',
              stamp1Label: 'CHART TRACKING',
              stamp1Val: 'HANTEO',
              stamp2Label: 'FORMATS',
              stamp2Val: 'CD·LP·DVD',
              stamp3Label: 'POB INCLUSIONS',
              stamp3Val: '100% REAL',
              stamp3Color: '#10b981',
            }
          };

          const conf = bannerConfigs[themeKey] || bannerConfigs.kpop;

          return (
            <section 
              style={{
                backgroundColor: '#000000',
                color: '#ffffff',
                padding: '48px 28px',
                borderBottom: '1px solid #1e293b',
              }}
            >
              <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
                {/* Breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '16px' }}>
                  <Link href="/" className="hover:text-white transition-colors">HOME</Link>
                  <span>/</span>
                  <span style={{ color: '#ffffff', fontWeight: 800 }}>PHYSICAL MEDIA &amp; COLLECTORS' EDITIONS</span>
                  <span>/</span>
                  <span style={{ color: conf.badgeColor, fontWeight: 800 }}>{category}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
                  <div style={{ maxWidth: '780px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#1e293b', color: conf.badgeColor, fontSize: '10px', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', border: `1px solid ${conf.badgeColor}40` }}>
                      <Award style={{ width: '12px', height: '12px' }} />
                      <span>{conf.badge}</span>
                    </div>
                    <h1 
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 'clamp(32px, 4vw, 56px)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                        margin: '0 0 12px 0',
                      }}
                    >
                      {conf.title1}<em style={{ fontWeight: 400, color: '#94a3b8', fontStyle: 'italic' }}>{conf.title2}</em>
                    </h1>
                    <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, margin: 0, fontWeight: 300 }}>
                      {conf.desc}
                    </p>
                  </div>

                  {/* Chart & Certification Stamps */}
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ padding: '14px 20px', backgroundColor: '#0f172a', border: '1px solid #334155', minWidth: '140px' }}>
                      <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>{conf.stamp1Label}</span>
                      <span style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', color: '#ffffff' }}>{conf.stamp1Val}</span>
                    </div>
                    <div style={{ padding: '14px 20px', backgroundColor: '#0f172a', border: '1px solid #334155', minWidth: '140px' }}>
                      <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>{conf.stamp2Label}</span>
                      <span style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', color: '#ffffff' }}>{conf.stamp2Val}</span>
                    </div>
                    <div style={{ padding: '14px 20px', backgroundColor: '#0f172a', border: '1px solid #334155', minWidth: '140px' }}>
                      <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>{conf.stamp3Label}</span>
                      <span style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', color: conf.stamp3Color || '#10b981' }}>{conf.stamp3Val}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Complete Album & Media Grid Component */}
        <AlbumGrid
          onSelectAlbum={(album) => setSelectedAlbum(album)}
          searchQuery={searchQuery}
          selectedArtistFilter={selectedArtistFilter}
          setSelectedArtistFilter={setSelectedArtistFilter}
          fandomCategory={category}
        />
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
        onFilterArtist={(artistId) => setSelectedArtistFilter(artistId)}
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
