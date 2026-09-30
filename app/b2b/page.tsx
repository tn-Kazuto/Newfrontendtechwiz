'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { CartDrawer } from '../../components/CartDrawer';
import { WishlistModal } from '../../components/WishlistModal';
import { ChatbotModal } from '../../components/ChatbotModal';
import { AudioPlayer } from '../../components/AudioPlayer';
import { AdminModal } from '../../components/AdminModal';
import { FeedbackModal } from '../../components/FeedbackModal';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Footer } from '../../components/Footer';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { useActiveFandom } from '../../utils/fandomTheme';
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  Check, 
  Send, 
  Package, 
  Truck, 
  FileText, 
  Globe2, 
  TrendingUp, 
  Sparkles,
  HelpCircle,
  PhoneCall,
  Clock
} from 'lucide-react';

export default function B2bPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { setIsCartOpen } = useCartWishlist();
  const { themeKey, category } = useActiveFandom();

  // Form State
  const [orgName, setOrgName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Vietnam');
  const [targetCategory, setTargetCategory] = useState('K-Pop Albums & Official Lightsticks');
  const [quantity, setQuantity] = useState(50);
  const [notes, setNotes] = useState('');
  const [submittedQuoteId, setSubmittedQuoteId] = useState<string | null>(null);

  // Sync default target category with active fandom
  React.useEffect(() => {
    if (category) {
      const c = category.toLowerCase();
      if (c.includes('game')) setTargetCategory('Gaming Arena Gear & Peripheral Wholesale');
      else if (c.includes('manga')) setTargetCategory('Manga Tankōbon & Boxsets Distribution');
      else if (c.includes('anime')) setTargetCategory('Anime Sakuga Blu-ray & Convention Goods');
      else if (c.includes('cosplay')) setTargetCategory('Cosplay Studio Materials & Wig Bundles');
      else if (c.includes('comic')) setTargetCategory('Comic Shop Omnibuses & Graphic Novels');
      else if (c.includes('cinema') || c.includes('movie')) setTargetCategory('Auteur Cinema 4K UHD & Script Publications');
      else if (c.includes('tv')) setTargetCategory('Series Apparel & Fanclub Watch Party Packs');
      else setTargetCategory('K-Pop Albums & Official Lightsticks');
    }
  }, [category]);

  // Discount tier calculation
  let discountRate = 15;
  if (quantity >= 201) discountRate = 35;
  else if (quantity >= 51) discountRate = 25;

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !email) return;

    const quoteId = `B2B-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedQuoteId(quoteId);
  };

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
              { label: 'B2B Distribution & Bulk Orders (Wholesale & Fan Club)', isActive: true }
            ]}
          />
        </div>

        {/* Dedicated B2B Hero Banner */}
        {/* Dedicated Category-Specific B2B Hero Banner */}
        {(() => {
          const bannerConfigs: Record<string, {
            badge: string;
            badgeColor: string;
            title1: string;
            title2: string;
            desc: string;
            metric1Val: string;
            metric1Label: string;
            metric2Val: string;
            metric2Label: string;
            metric3Val: string;
            metric3Label: string;
          }> = {
            gaming: {
              badge: 'AUTHORIZED GAMING & ESPORTS WHOLESALE HUB · DIRECT LICENSES',
              badgeColor: '#00ff66',
              title1: 'Gaming Gear, Peripherals ',
              title2: '& Esports Wholesale',
              desc: 'Specialized wholesale distribution for LAN centers, cyber cafes, esports academies, and gaming hobby retailers across 65+ countries. Tiered volume pricing up to 35% discount with direct developer authenticity verification.',
              metric1Val: '35% OFF',
              metric1Label: 'MAX DISCOUNT',
              metric2Val: '100% REAL',
              metric2Label: 'DEVELOPER DIRECT',
              metric3Val: '65+ COUNTRIES',
              metric3Label: 'GLOBAL LOGISTICS',
            },
            manga: {
              badge: 'JAPANESE MANGA & BOOKSTORE WHOLESALE CONSIGNMENT',
              badgeColor: '#f97316',
              title1: 'Manga Tankōbon, Boxsets ',
              title2: '& Bookstore Distribution',
              desc: 'Tailored bulk supply for manga cafes, anime bookstores, comic shops, and university libraries. Direct Shueisha, Kodansha & Hakusensha import licenses with guaranteed first-press extras.',
              metric1Val: '35% OFF',
              metric1Label: 'BULK DISCOUNT',
              metric2Val: '100% OFFICIAL',
              metric2Label: 'PUBLISHER DIRECT',
              metric3Val: '65+ COUNTRIES',
              metric3Label: 'SEA/AIR FREIGHT',
            },
            anime: {
              badge: 'CONVENTION MERCH & ANIME SHOP WHOLESALE ALLIANCE',
              badgeColor: '#ccff00',
              title1: 'Sakuga Blu-ray, Merch ',
              title2: '& Convention Bulk Orders',
              desc: 'Wholesale fulfillment for anime hobby retailers, comic-con vendor booths, and regional screening clubs. Licensed Toei, Aniplex, and Ufotable distributor allotments.',
              metric1Val: '35% OFF',
              metric1Label: 'MAX WHOLESALE',
              metric2Val: '100% REAL',
              metric2Label: 'STUDIO LICENSED',
              metric3Val: '65+ COUNTRIES',
              metric3Label: 'FAST CLEARANCE',
            },
            cosplay: {
              badge: 'STUDIO FABRICATION & PROP SHOP BULK MATERIALS HUB',
              badgeColor: '#38bdf8',
              title1: 'Cosplay Materials, Wigs ',
              title2: '& Workshop Bulk Supply',
              desc: 'Bulk material supplies for cosplay production studios, theater prop shops, and maker ateliers. Pallet discounts on high-density EVA foam, wholesale lace-front wig bundles, and workshop hardware.',
              metric1Val: '35% OFF',
              metric1Label: 'VOLUME SAVINGS',
              metric2Val: 'STUDIO GRADE',
              metric2Label: 'TESTED MATERIALS',
              metric3Val: '65+ COUNTRIES',
              metric3Label: 'BULK CRATES',
            },
            comics: {
              badge: 'COMIC SHOP SYNDICATE & DIRECT MARKET WHOLESALE',
              badgeColor: '#ffd60a',
              title1: 'Graphic Novels, Omnibuses ',
              title2: '& Comic Shop Wholesale',
              desc: 'Direct market wholesale for comic book shops, convention exhibitors, and online retailers. Case-quantity discounts on Marvel, DC, and indie publisher graphic novels and archival supplies.',
              metric1Val: '35% OFF',
              metric1Label: 'CASE DISCOUNT',
              metric2Val: 'MINT GRADE',
              metric2Label: 'DIAMOND STANDARD',
              metric3Val: '65+ COUNTRIES',
              metric3Label: 'AIR FREIGHT',
            },
            cinema: {
              badge: 'FILM SOCIETY & BOUTIQUE CINEMA RECEPTIVE SUPPLY',
              badgeColor: '#d4af37',
              title1: '70mm Auteur Media, 4K UHD ',
              title2: '& Cinema Exhibition Wholesale',
              desc: 'Archival physical media distribution for arthouse cinemas, film schools, and boutique film clubs. Bulk pricing on Criterion editions, 4K UHD digipaks, and deluxe screenplay publications.',
              metric1Val: '35% OFF',
              metric1Label: 'ACADEMIC/SHOP',
              metric2Val: '100% ARCHIVAL',
              metric2Label: '4K DCI MASTER',
              metric3Val: '65+ COUNTRIES',
              metric3Label: 'GLOBAL DISPATCH',
            },
            tv: {
              badge: 'STREAMING FANCLUB & EVENT BULK MERCHANDISE',
              badgeColor: '#a78bfa',
              title1: 'Series Merchandise, Apparel ',
              title2: '& Watch Party Wholesale',
              desc: 'Volume ordering for fan-led watch parties, university TV clubs, and television fandom pop-ups. Licensed apparel batches, prop replica packs, and commemorative season boxsets.',
              metric1Val: '35% OFF',
              metric1Label: 'FANCLUB TIER',
              metric2Val: '100% LICENSED',
              metric2Label: 'OFFICIAL SERIES',
              metric3Val: '65+ COUNTRIES',
              metric3Label: 'WORLDWIDE SHIP',
            },
            kpop: {
              badge: 'Authorized Wholesale Distributor · Global Export Hub',
              badgeColor: '#38bdf8',
              title1: 'B2B Wholesale, Bulk Orders ',
              title2: '& Fanclub Group Buys',
              desc: 'Tailored wholesale supply solutions for independent record shops, regional fan club coordinators, universities, and commercial retailers across 65+ countries. Tiered volume pricing up to 35% discount with full Hanteo Chart verification.',
              metric1Val: '35% OFF',
              metric1Label: 'MAX DISCOUNT',
              metric2Val: '100% REAL',
              metric2Label: 'CHART COUNTED',
              metric3Val: '65+ COUNTRIES',
              metric3Label: 'EXPORT DESTINATIONS',
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
                  <span style={{ color: '#ffffff', fontWeight: 800 }}>B2B WHOLESALE &amp; BULK DISTRIBUTION</span>
                  <span>/</span>
                  <span style={{ color: conf.badgeColor, fontWeight: 800 }}>{category}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
                  <div style={{ maxWidth: '780px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#1e293b', color: conf.badgeColor, fontSize: '10px', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', border: `1px solid ${conf.badgeColor}40` }}>
                      <Building2 style={{ width: '12px', height: '12px' }} />
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

                  {/* Wholesale Metrics */}
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ padding: '14px 20px', backgroundColor: '#0f172a', border: '1px solid #334155', minWidth: '140px' }}>
                      <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>{conf.metric1Label}</span>
                      <span style={{ fontSize: '26px', fontWeight: 900, fontFamily: 'monospace', color: conf.badgeColor }}>{conf.metric1Val}</span>
                    </div>
                    <div style={{ padding: '14px 20px', backgroundColor: '#0f172a', border: '1px solid #334155', minWidth: '140px' }}>
                      <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>{conf.metric2Label}</span>
                      <span style={{ fontSize: '26px', fontWeight: 900, fontFamily: 'monospace', color: '#10b981' }}>{conf.metric2Val}</span>
                    </div>
                    <div style={{ padding: '14px 20px', backgroundColor: '#0f172a', border: '1px solid #334155', minWidth: '140px' }}>
                      <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>{conf.metric3Label}</span>
                      <span style={{ fontSize: '26px', fontWeight: 900, fontFamily: 'monospace', color: '#ffffff' }}>{conf.metric3Val}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Content Section */}
        <section className="py-16 px-4 sm:px-7 max-w-[1440px] mx-auto">
          
          {/* 3 Tier Cards */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <span style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#94a3b8' }}>
                VOLUME TIERS
              </span>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '8px 0 0 0' }}>
                Tiered Wholesale Volume Pricing
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Tier 1 */}
              <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #e2e8f0', padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="hover:border-black transition-all">
                <div>
                  <span style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', backgroundColor: '#f1f5f9', color: '#0f172a', padding: '3px 8px', display: 'inline-block', marginBottom: '12px' }}>
                    TIER 1 · COMMUNITY & STARTER
                  </span>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '22px', fontWeight: 800, margin: '0 0 8px 0' }}>
                    10 – 50 Units
                  </h3>
                  <div style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'monospace', color: '#0f172a', margin: '12px 0' }}>
                    15% <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748b' }}>OFF MSRP</span>
                  </div>
                  <ul style={{ margin: '16px 0 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#475569' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} style={{ color: '#10b981' }} /> Official Hanteo Certified Sales</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} style={{ color: '#10b981' }} /> Standard Export Carton Packing</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} style={{ color: '#10b981' }} /> Pre-order Benefits Guaranteed</li>
                  </ul>
                </div>
              </div>

              {/* Tier 2 */}
              <div style={{ backgroundColor: '#000000', color: '#ffffff', border: '2px solid #000000', padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }} className="shadow-xl">
                <span style={{ position: 'absolute', top: '-10px', right: '16px', backgroundColor: '#38bdf8', color: '#000000', fontSize: '9px', fontFamily: 'monospace', fontWeight: 800, padding: '2px 8px', textTransform: 'uppercase' }}>
                  MOST POPULAR FOR FANCLUBS
                </span>
                <div>
                  <span style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', backgroundColor: '#1e293b', color: '#38bdf8', padding: '3px 8px', display: 'inline-block', marginBottom: '12px' }}>
                    TIER 2 · REGIONAL PARTNER
                  </span>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '22px', fontWeight: 800, margin: '0 0 8px 0', color: '#ffffff' }}>
                    51 – 200 Units
                  </h3>
                  <div style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'monospace', color: '#ffffff', margin: '12px 0' }}>
                    25% <span style={{ fontSize: '14px', fontWeight: 500, color: '#94a3b8' }}>OFF MSRP</span>
                  </div>
                  <ul style={{ margin: '16px 0 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#cbd5e1' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} style={{ color: '#38bdf8' }} /> All Tier 1 Benefits Included</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} style={{ color: '#38bdf8' }} /> Priority Factory Batch Allocation</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} style={{ color: '#38bdf8' }} /> Free Customs Clearance Documentation</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} style={{ color: '#38bdf8' }} /> Custom Bubblewrap Protection</li>
                  </ul>
                </div>
              </div>

              {/* Tier 3 */}
              <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #e2e8f0', padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="hover:border-black transition-all">
                <div>
                  <span style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', backgroundColor: '#f1f5f9', color: '#0f172a', padding: '3px 8px', display: 'inline-block', marginBottom: '12px' }}>
                    TIER 3 · ENTERPRISE DISTRIBUTOR
                  </span>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '22px', fontWeight: 800, margin: '0 0 8px 0' }}>
                    201+ Units
                  </h3>
                  <div style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'monospace', color: '#0f172a', margin: '12px 0' }}>
                    35% <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748b' }}>OFF MSRP</span>
                  </div>
                  <ul style={{ margin: '16px 0 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#475569' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} style={{ color: '#10b981' }} /> All Tier 2 Benefits Included</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} style={{ color: '#10b981' }} /> Dedicated 1-on-1 Account Manager</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} style={{ color: '#10b981' }} /> Direct Pallet Air / Sea Freight</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} style={{ color: '#10b981' }} /> Flexible Net-30 Payment Terms</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Quote Calculator & Request Form */}
          <div style={{ maxWidth: '880px', margin: '0 auto', backgroundColor: '#ffffff', border: '2px solid #000000', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            
            {/* Header bar */}
            <div style={{ backgroundColor: '#000000', color: '#ffffff', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} style={{ color: '#38bdf8' }} />
                <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  OFFICIAL B2B WHOLESALE QUOTE REQUEST
                </span>
              </div>
              <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#94a3b8' }}>
                AVERAGE RESPONSE TIME: &lt; 2 HOURS
              </span>
            </div>

            {submittedQuoteId ? (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <Check size={28} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                  Wholesale Inquiry Successfully Dispatched!
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '480px', margin: '0 auto 20px auto', lineHeight: 1.6 }}>
                  Thank you, <strong>{contactName || orgName}</strong>. Our dedicated B2B Wholesale account manager has received your inquiry for <strong>{quantity} units</strong> ({discountRate}% volume discount applied).
                </p>
                <div style={{ display: 'inline-block', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px 16px', fontSize: '12px', fontFamily: 'monospace', fontWeight: 800, color: '#0f172a', marginBottom: '24px' }}>
                  REFERENCE QUOTE ID: #{submittedQuoteId}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => setSubmittedQuoteId(null)}
                    style={{ padding: '10px 24px', backgroundColor: '#000000', color: '#ffffff', border: 'none', fontSize: '11px', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', cursor: 'pointer' }}
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuote} style={{ padding: '28px' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                      ORGANIZATION / STORE / FANCLUB NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Seoul Pop Goods Ltd. / Vietnam Tokki Fan Club"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      style={{ width: '100%', height: '40px', padding: '0 12px', fontSize: '12px', border: '1.5px solid #000000', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                      CONTACT PERSON *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nguyen Minh Anh"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      style={{ width: '100%', height: '40px', padding: '0 12px', fontSize: '12px', border: '1.5px solid #000000', outline: 'none' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                      BUSINESS EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="partner@fandomstore.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ width: '100%', height: '40px', padding: '0 12px', fontSize: '12px', border: '1.5px solid #000000', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                      PHONE / WHATSAPP / ZALO
                    </label>
                    <input
                      type="text"
                      placeholder="+84 90 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ width: '100%', height: '40px', padding: '0 12px', fontSize: '12px', border: '1.5px solid #000000', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                      DESTINATION COUNTRY
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      style={{ width: '100%', height: '40px', padding: '0 12px', fontSize: '12px', border: '1.5px solid #000000', outline: 'none' }}
                    />
                  </div>
                </div>

                {/* Target Category & Quantity Slider */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                      TARGET INVENTORY CATEGORY
                    </label>
                    <select
                      value={targetCategory}
                      onChange={(e) => setTargetCategory(e.target.value)}
                      style={{ width: '100%', height: '40px', padding: '0 12px', fontSize: '12px', border: '1.5px solid #000000', outline: 'none', backgroundColor: '#ffffff' }}
                    >
                      <option value="Gaming Arena Gear & Peripheral Wholesale">Gaming Arena Gear & Peripheral Wholesale</option>
                      <option value="Manga Tankōbon & Boxsets Distribution">Manga Tankōbon & Boxsets Distribution</option>
                      <option value="Anime Sakuga Blu-ray & Convention Goods">Anime Sakuga Blu-ray & Convention Goods</option>
                      <option value="Cosplay Studio Materials & Wig Bundles">Cosplay Studio Materials & Wig Bundles</option>
                      <option value="Comic Shop Omnibuses & Graphic Novels">Comic Shop Omnibuses & Graphic Novels</option>
                      <option value="Auteur Cinema 4K UHD & Script Publications">Auteur Cinema 4K UHD & Script Publications</option>
                      <option value="Series Apparel & Fanclub Watch Party Packs">Series Apparel & Fanclub Watch Party Packs</option>
                      <option value="K-Pop Albums & Official Lightsticks">K-Pop Albums & Official Lightsticks (Hanteo Certified)</option>
                      <option value="Mixed Assortment">Mixed Global Fandom Assortment</option>
                    </select>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <label style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a' }}>
                        ESTIMATED ORDER VOLUME
                      </label>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 800, color: '#000000' }}>
                        {quantity} UNITS ({discountRate}% OFF)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={500}
                      step={5}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#000000', height: '40px' }}
                    />
                  </div>
                </div>

                {/* Special Instructions */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                    SPECIFIC ARTISTS, TITLES, OR CUSTOM PACKAGING REQUIREMENTS
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Looking for 30 copies of NewJeans 'Get Up' Bunny Beach Bag ver. and 20 aespa 'Armageddon' CDP..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', fontSize: '12px', border: '1.5px solid #000000', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    height: '46px',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 800,
                    fontFamily: 'monospace',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  className="hover:bg-neutral-800"
                >
                  <Send size={14} />
                  <span>Request Wholesale Quotation & Chart Verification</span>
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* Modals & Drawers */}
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
