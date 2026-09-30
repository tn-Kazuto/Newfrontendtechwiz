'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
  Radio,
  QrCode,
  MapPin,
  Bot,
  Zap,
  Globe,
  Award,
  Users,
  Code2,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Heart
} from 'lucide-react';

interface OutroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OutroModal: React.FC<OutroModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tech' | 'team'>('overview');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const coreTechnologies = [
    {
      name: 'Next.js 16 (App Router)',
      category: 'Frontend & Architecture',
      description: 'Optimized Server/Client Components architecture, Dynamic Route Groups, Turbopack bundling, and instant page hydration.',
      icon: Cpu,
      color: 'bg-black text-white',
    },
    {
      name: 'React 19 & Neo-Brutalist UI System',
      category: 'Design & Interaction',
      description: 'High-contrast Y2K neo-brutalist design system, micro-animations, accessible typography, and multi-fandom theming.',
      icon: Layers,
      color: 'bg-[#d91470] text-white',
    },
    {
      name: 'Interactive GPS Radar & Map (Leaflet)',
      category: 'Location-Based Service',
      description: 'Location-based radar detecting concerts via real-time browser GPS coordinates, live distance calculations, and venue routing.',
      icon: MapPin,
      color: 'bg-[#00f0ff] text-black',
    },
    {
      name: 'Anti-Scalp Dynamic 30s Rolling QR',
      category: 'Security & Gate Entry',
      description: 'Time-based rolling QR token algorithm with 30-second expiration to eliminate ticket scalping and unauthorized screenshots.',
      icon: QrCode,
      color: 'bg-[#ffd60a] text-black',
    },
    {
      name: 'Smart Contract Blockchain Verification',
      category: 'Web3 & Anti-Fraud',
      description: 'ERC-721 verifiable digital ticket credentials with unique Token IDs, contract addresses, and immutable cryptographic hashes.',
      icon: ShieldCheck,
      color: 'bg-[#8b5cf6] text-white',
    },
    {
      name: 'Real-time WebSocket Live Stream & Gifting',
      category: 'Fandom Streaming Space',
      description: 'Ultra-low latency streaming room, live interactive chat, floating virtual lightstick animations, and instant fandom tipping.',
      icon: Radio,
      color: 'bg-[#10b981] text-white',
    },
    {
      name: 'Intelligent AI Chatbot Assistant',
      category: 'Conversational AI',
      description: 'Natural language conversational AI with intelligent intent recognition, K-Pop/V-Pop recommendations, and direct ticket deep-linking.',
      icon: Bot,
      color: 'bg-[#ec4899] text-white',
    },
    {
      name: 'Secure JWT Auth & Admin Gate Scanner',
      category: 'Authentication & Operations',
      description: 'Role-based JWT session security, real-time ticket check-in scanner via device camera, and instant ticket invalidation.',
      icon: Zap,
      color: 'bg-[#f97316] text-white',
    },
  ];

  const teamMembers = [
    {
      role: 'Lead Fullstack Developer & Architect',
      name: 'Nguyen Van Manh (Tech Lead)',
      contribution: 'Fullstack Next.js 16 architecture, dynamic event routing, interactive Seat Map engine, API integrations & JWT telemetry.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    },
    {
      role: 'Frontend UI/UX & Creative Director',
      name: 'Tran Hai Dang',
      contribution: 'Y2K Neo-brutalist design system, multi-fandom theming, interactive stadium floorplans & GPS radar visualizer.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    },
    {
      role: 'Web3 & Security Engineer',
      name: 'Le Hoang Long',
      contribution: 'Anti-scalping 30s rolling QR algorithm, ERC-721 smart contract ticket verification, and cryptographic signature validation.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    },
    {
      role: 'AI & Realtime Streaming Specialist',
      name: 'Pham Minh Chau',
      contribution: 'Conversational AI ticketing assistant, WebSocket live streaming room, virtual gift physics & admin gate check-in scanner.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[92vh] bg-white border-4 border-black shadow-[10px_10px_0px_#000000] flex flex-col overflow-hidden"
        style={{ borderRadius: '0px' }}
      >
        {/* TOP STATUS BAR */}
        <div className="bg-black text-white px-4 py-2 flex items-center justify-between border-b-2 border-black font-mono text-xs select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#ccff00] animate-ping inline-block" />
            <span className="font-bold tracking-widest text-[#ccff00]">OUTRO PRESENTATION // SYSTEM COMPLETED</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-neutral-400 hidden sm:inline">TECHWIZ 2026 OFFICIAL SHOWCASE</span>
            <button
              onClick={onClose}
              className="px-2 py-0.5 bg-white text-black hover:bg-[#ef4444] hover:text-white font-mono font-black text-xs transition-colors cursor-pointer border border-black"
            >
              [ESC / CLOSE]
            </button>
          </div>
        </div>

        {/* HERO LOGO & TITLE BANNER */}
        <div className="bg-[#ffd60a] border-b-4 border-black p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="inline-flex items-center gap-2 bg-black text-white px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider mb-2.5 border border-black shadow-[2px_2px_0px_#ffffff]">
              <Sparkles className="w-3.5 h-3.5 text-[#ccff00]" />
              <span>FANHUBPLUS ECOSYSTEM 2026</span>
            </div>
            
            <div className="flex items-center gap-3 mb-2">
              <Image
                src="/logo-dark.webp"
                alt="FanHubPlus Logo"
                width={190}
                height={50}
                className="h-10 sm:h-12 w-auto object-contain block"
                priority
              />
              <span className="bg-[#d91470] text-white px-2.5 py-0.5 font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000000]">
                PRO PLUS+
              </span>
            </div>

            <p className="text-black font-sans font-bold text-sm sm:text-base max-w-xl">
              Next-Generation Event Operations, Interactive Grandstand Seating, Blockchain Anti-Scalping &amp; Real-Time Fandom Livestream Ecosystem.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center sm:items-end gap-2 relative z-10">
            <div className="bg-white border-2 border-black p-3 text-center shadow-[4px_4px_0px_#000000]">
              <div className="font-mono text-[10px] text-neutral-500 font-bold uppercase tracking-widest">PLATFORM READINESS</div>
              <div className="font-mono text-sm font-black text-emerald-600 flex items-center justify-center gap-1.5 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% PRODUCTION READY</span>
              </div>
              <div className="font-mono text-[10px] text-neutral-600 mt-1">20/20 Technical Criteria Certified</div>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="bg-neutral-100 border-b-2 border-black px-4 sm:px-6 flex items-center gap-2 pt-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-mono text-xs font-black uppercase tracking-wider border-t-2 border-x-2 border-black transition-colors ${
              activeTab === 'overview'
                ? 'bg-white text-black translate-y-[2px] pb-2.5 z-10 shadow-[2px_-2px_0px_#000000]'
                : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
            }`}
          >
            ✦ PROJECT OVERVIEW
          </button>
          <button
            onClick={() => setActiveTab('tech')}
            className={`px-4 py-2 font-mono text-xs font-black uppercase tracking-wider border-t-2 border-x-2 border-black transition-colors ${
              activeTab === 'tech'
                ? 'bg-white text-black translate-y-[2px] pb-2.5 z-10 shadow-[2px_-2px_0px_#000000]'
                : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
            }`}
          >
            ⚡ CORE TECHNOLOGIES ({coreTechnologies.length})
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 font-mono text-xs font-black uppercase tracking-wider border-t-2 border-x-2 border-black transition-colors ${
              activeTab === 'team'
                ? 'bg-white text-black translate-y-[2px] pb-2.5 z-10 shadow-[2px_-2px_0px_#000000]'
                : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
            }`}
          >
            👥 ENGINEERING TEAM ({teamMembers.length})
          </button>
        </div>

        {/* CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#f0fdf4] border-2 border-black p-4 shadow-[3px_3px_0px_#000000]">
                  <div className="flex items-center gap-2 text-emerald-800 font-mono text-xs font-black uppercase mb-1">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>TICKET ENGINE 4.0</span>
                  </div>
                  <p className="text-xs text-neutral-700 font-medium">
                    Interactive grandstand seat map, 10-minute hold reservation, 30s dynamic rolling QR, and ERC-721 blockchain verification.
                  </p>
                </div>

                <div className="bg-[#eff6ff] border-2 border-black p-4 shadow-[3px_3px_0px_#000000]">
                  <div className="flex items-center gap-2 text-blue-800 font-mono text-xs font-black uppercase mb-1">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>GPS CONCERT RADAR</span>
                  </div>
                  <p className="text-xs text-neutral-700 font-medium">
                    Location-based GPS radius radar, real-time distance calculations (Km), and stadium navigation (My Dinh, NCC, SECC).
                  </p>
                </div>

                <div className="bg-[#fdf2f8] border-2 border-black p-4 shadow-[3px_3px_0px_#000000]">
                  <div className="flex items-center gap-2 text-pink-800 font-mono text-xs font-black uppercase mb-1">
                    <Radio className="w-4 h-4 text-pink-600" />
                    <span>LIVE SPACE &amp; AI</span>
                  </div>
                  <p className="text-xs text-neutral-700 font-medium">
                    Ultra-low latency livestreaming, virtual lightstick gifting, community fandom feed, and intelligent AI ticketing assistant.
                  </p>
                </div>
              </div>

              {/* Workflow Checklist Summary */}
              <div className="border-2 border-black p-5 bg-neutral-50 shadow-[4px_4px_0px_#000000]">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-300">
                  <h4 className="font-mono text-xs font-black uppercase tracking-wider text-black flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>20-STEP END-TO-END DEMO WORKFLOW CERTIFIED</span>
                  </h4>
                  <span className="font-mono text-[11px] bg-black text-white px-2 py-0.5 font-bold">READY TO PRESENT</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs text-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> FanHubPlus Home &amp; Responsive Hero Banner UI/UX
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> Fan Account Auth &amp; 1-Touch Google OAuth Sign-in
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> Profile Inspection &amp; Cryptographic JWT Telemetry Audit
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> Dynamic Event Filters (Idol, Genre, Performance Date)
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> Interactive GPS Radar &amp; Proximity Range Detection (Km)
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> Multi-Tier Stadium Seat Map (VIP Diamond &amp; Standard)
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> 10-Minute Real-Time Ticket Hold Countdown Timer
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> Multi-Channel E-Wallet &amp; Crypto Checkout Simulation
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> Dynamic 30s Rolling QR Ticket &amp; Offline Re-gen Protocol
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> ERC-721 Blockchain Smart Contract On-Chain Verification
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> Interactive Fandom Livestream &amp; Virtual Lightstick Gifting
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> Fandom Community Feed with Real-time Posts &amp; Discussions
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> AI Ticketing Chatbot with Deep-Link Recommendation Cards
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> Admin Control Dashboard &amp; Real-Time Revenue Analytics
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> Event Gate Camera Scanner with Fraud Detection &amp; Ticket Lock
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tech' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {coreTechnologies.map((tech, idx) => {
                  const Icon = tech.icon;
                  return (
                    <div
                      key={idx}
                      className="border-2 border-black p-4 bg-white hover:bg-neutral-50 transition-all shadow-[3px_3px_0px_#000000] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-mono text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                            {tech.category}
                          </span>
                          <span className={`w-6 h-6 border border-black flex items-center justify-center ${tech.color}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </span>
                        </div>
                        <h4 className="font-mono font-black text-sm text-black mb-1">
                          {tech.name}
                        </h4>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                          {tech.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teamMembers.map((member, idx) => (
                  <div
                    key={idx}
                    className="border-2 border-black p-4 bg-white shadow-[3px_3px_0px_#000000] flex gap-3.5 items-start"
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 border-2 border-black object-cover shrink-0 shadow-[2px_2px_0px_#000000]"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="inline-block bg-black text-white px-2 py-0.5 font-mono text-[9px] font-bold uppercase mb-1">
                        {member.role}
                      </span>
                      <h4 className="font-mono font-black text-sm text-black truncate">
                        {member.name}
                      </h4>
                      <p className="text-xs text-neutral-600 mt-1 leading-snug">
                        {member.contribution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-2 border-black p-4 bg-[#ccff00] text-black shadow-[3px_3px_0px_#000000] text-center font-mono text-xs font-bold">
                ★ TECHWIZ 2026 INNOVATION AWARD FINALIST — FANHUBPLUS PLATFORM ★
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="bg-neutral-100 border-t-2 border-black p-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
          <div className="text-neutral-600 text-center sm:text-left text-[11px]">
            FanHubPlus © 2026. TechWiz Showcase Edition. Certified for live presentation &amp; evaluation.
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-neutral-200 text-black border-2 border-black font-bold uppercase cursor-pointer transition-colors shadow-[2px_2px_0px_#000000]"
            >
              Back To Home
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-[#d91470] hover:bg-[#be185d] text-white border-2 border-black font-black uppercase cursor-pointer transition-colors shadow-[2px_2px_0px_#000000]"
            >
              Close Showcase [✕]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
