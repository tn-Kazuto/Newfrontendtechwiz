'use client';

import React from 'react';
import { Users, Disc, Calendar, ShieldCheck } from 'lucide-react';

interface SiteLink {
  label: string;
  href: string;
  isAction?: boolean;
  onClick?: () => void;
}

interface SiteCategory {
  category: string;
  code: string;
  accentColor: string;
  iconBg: string;
  icon: React.ReactNode;
  links: SiteLink[];
}

interface SitemapSectionProps {
  onOpenAdmin: () => void;
  onOpenFeedback: () => void;
  onOpenWishlist?: () => void;
}

export const SitemapSection: React.FC<SitemapSectionProps> = ({ onOpenAdmin, onOpenFeedback, onOpenWishlist }) => {
  const siteStructure: SiteCategory[] = [
    {
      category: 'Fandom Universe & Profiles',
      code: '★ 01 UNIVERSE',
      accentColor: 'bg-[#d91470]',
      iconBg: 'bg-[#fdf2f8]',
      icon: <Users className="w-4 h-4 text-[#d91470]" />,
      links: [
        { label: 'Idol & Character Profiles', href: '#artists' },
        { label: 'Debut History & Agency Lore', href: '#artists' },
        { label: 'Official Fandom Fanclubs', href: '#artists' },
        { label: 'Character Dossiers & Gallery', href: '#artists' },
      ],
    },
    {
      category: 'Discovery & Album Drops',
      code: '✦ 02 DROPS',
      accentColor: 'bg-[#00f0ff]',
      iconBg: 'bg-[#ecfeff]',
      icon: <Disc className="w-4 h-4 text-cyan-600" />,
      links: [
        { label: 'Fandom Content Explorer', href: '#albums' },
        { label: 'Official Albums & Merchandise', href: '#albums' },
        { label: 'Limited Editions & Boxsets', href: '#albums' },
        { label: 'Audio Teaser Previews', href: '#albums' },
      ],
    },
    {
      category: 'Multimedia & Radar Drops',
      code: '⚡ 03 MEDIA',
      accentColor: 'bg-[#ffd60a]',
      iconBg: 'bg-[#fefce8]',
      icon: <Calendar className="w-4 h-4 text-amber-600" />,
      links: [
        { label: 'Multimedia Streaming Center', href: '#multimedia' },
        { label: 'Trailers, Podcasts & OSTs', href: '#multimedia' },
        { label: 'Upcoming Drops & Pre-Orders', href: '#upcoming-releases' },
        { label: 'Fan Submitted Articles & News', href: '#upcoming-releases' },
      ],
    },
    {
      category: 'Tour, Community & Tools',
      code: '✪ 04 UTILITIES',
      accentColor: 'bg-[#ccff00]',
      iconBg: 'bg-[#f7fee7]',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
      links: [
        { label: 'World Tour & Stadium Arenas', href: '#tours' },
        { label: 'Fan Community Social Feed', href: '#community' },
        { label: 'Collector Wishlist & Notes', href: '#', onClick: onOpenWishlist },
        { label: 'Admin Control Panel Preview', href: '#', onClick: onOpenAdmin },
        { label: 'Feedback & Bug Submission', href: '#', onClick: onOpenFeedback },
      ],
    },
  ];

  return (
    <section 
      id="sitemap" 
      style={{
        paddingTop: '80px',
        paddingBottom: '96px',
      }}
      className="py-16 px-4 lg:px-8 bg-[#fdfbf7] border-b-4 border-black"
    >
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider mb-3 px-3.5 py-1.5 bg-[#ffd60a] text-black border-2 border-black shadow-[3px_3px_0px_#000]">
            <span>★ SRS SPECIFICATION // SECTION 1.9 SITEMAP &amp; DIRECTORY ✦</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-black text-black uppercase tracking-tight">
            Complete Website Architecture &amp;{' '}
            <span className="text-[#d91470] underline decoration-4 decoration-black">
              Directory
            </span>
          </h2>
          <p className="font-sans font-semibold text-xs sm:text-sm text-neutral-700 mt-2">
            Explore all functional modules, catalog directories, Lossless soundstage consoles, and interactive fan hubs.
          </p>
        </div>

        {/* 4-Column Vibrant Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteStructure.map((cat, idx) => {
            return (
              <div
                key={idx}
                style={{ borderRadius: '0px' }}
                className="bg-white border-3 border-black shadow-[5px_5px_0px_#000000] hover:shadow-[7px_7px_0px_#000000] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                {/* Top Banner Accent */}
                <div>
                  <div className={`${cat.accentColor} px-4 py-2 border-b-2 border-black flex items-center justify-between`}>
                    <span className={`font-mono text-[10px] font-black uppercase tracking-widest ${cat.accentColor.includes('#d91470') ? 'text-white' : 'text-black'}`}>
                      {cat.code}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${cat.accentColor.includes('#d91470') ? 'bg-white' : 'bg-black'}`} />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-black">
                      <div className={`w-7 h-7 ${cat.iconBg} border border-black flex items-center justify-center shrink-0`}>
                        {cat.icon}
                      </div>
                      <h3 className="font-mono text-xs font-black text-black uppercase tracking-wider">
                        {cat.category}
                      </h3>
                    </div>

                    <ul className="space-y-3 text-xs font-mono" style={{ listStyle: 'none', padding: 0 }}>
                      {cat.links.map((link, lIdx) => {
                        if (link.onClick) {
                          return (
                            <li key={lIdx}>
                              <button
                                onClick={link.onClick}
                                className="w-full text-left font-bold text-black hover:text-[#ff2e93] transition-colors flex items-center justify-between p-1.5 hover:bg-[#fff9db] border border-transparent hover:border-black cursor-pointer group"
                                type="button"
                              >
                                <span className="group-hover:translate-x-1 transition-transform">
                                  {link.label}
                                </span>
                                <span className="bg-[#ffd60a] text-black font-black text-[10px] px-1 border border-black shadow-[1px_1px_0px_#000]">
                                  MODAL
                                </span>
                              </button>
                            </li>
                          );
                        }

                        return (
                          <li key={lIdx}>
                            <a
                              href={link.href}
                              className="font-medium text-neutral-800 hover:text-black hover:font-bold transition-all flex items-center gap-2 p-1.5 hover:bg-[#ecfeff] border border-transparent hover:border-black group"
                            >
                              <span className="text-[#ff2e93] font-black group-hover:translate-x-1 transition-transform">→</span>
                              <span>{link.label}</span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* Footer status bar for each category */}
                <div className="px-5 py-2.5 border-t border-black bg-neutral-50 font-mono text-[10px] text-neutral-600 flex items-center justify-between">
                  <span>STATUS: SYNCED</span>
                  <span className="font-bold text-black">[OK]</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

