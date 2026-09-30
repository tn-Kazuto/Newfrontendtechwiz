'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MediaItem, LiveChatMessage } from '../../data/multimediaData';
import { Gift, Sparkles, Heart, Flame, Zap, Star, Wallet, Plus, Send, Radio, MessageSquare, Video } from 'lucide-react';

interface MultimediaLiveChatProps {
  activeMedia: MediaItem;
  isCinemaMode: boolean;
  liveChatList: LiveChatMessage[];
  newChatMessage: string;
  floatingReactions: { id: number; text: string; x: number }[];
  onNewChatMessageChange: (val: string) => void;
  onSendChatMessage: (e: React.FormEvent) => void;
  onTriggerReaction: (text: string) => void;
}

interface FlyingGift {
  id: number;
  name: string;
  icon: string;
  sender: string;
  color: string;
}

export const MultimediaLiveChat: React.FC<MultimediaLiveChatProps> = ({
  activeMedia,
  isCinemaMode,
  liveChatList,
  newChatMessage,
  floatingReactions,
  onNewChatMessageChange,
  onSendChatMessage,
  onTriggerReaction,
}) => {
  // Virtual Wallet Balance state (default: 1.500.000 VNĐ / 1,500 Coins)
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('fanhub_user_wallet_coins');
      return saved ? parseInt(saved, 10) : 1500000;
    } catch {
      return 1500000;
    }
  });

  const [flyingGifts, setFlyingGifts] = useState<FlyingGift[]>([]);
  const [isGiftDrawerOpen, setIsGiftDrawerOpen] = useState(false);
  const [giftSuccessAlert, setGiftSuccessAlert] = useState<string | null>(null);
  const [activeCam, setActiveCam] = useState<'cam1' | 'cam2' | 'cam3'>('cam1');

  // Auto-scroll inside chat container ONLY (prevents page from scrolling down)
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [liveChatList]);

  // Different multi-cam URLs for concert simulation
  const camUrls = {
    cam1: activeMedia.embedUrl || 'https://www.youtube-nocookie.com/embed/gdZLi9oWNZg?autoplay=1&mute=0',
    cam2: 'https://www.youtube-nocookie.com/embed/ZncbtRo7RXs?autoplay=1&mute=0',
    cam3: 'https://www.youtube-nocookie.com/embed/hT_nvWreIhg?autoplay=1&mute=0',
  };

  const virtualGifts = [
    { id: 'lightstick', name: 'Official Lightstick', icon: '🌟', cost: 50000, color: '#ffd60a' },
    { id: 'heart_balloon', name: 'Heart Balloon', icon: '💖', cost: 10000, color: '#ff2e93' },
    { id: 'crown', name: 'Diamond Crown', icon: '👑', cost: 200000, color: '#00f0ff' },
    { id: 'rocket', name: 'Super Star Rocket', icon: '🚀', cost: 500000, color: '#a855f7' },
  ];

  const handleSendVirtualGift = (gift: typeof virtualGifts[0]) => {
    if (walletBalance < gift.cost) {
      alert('Insufficient wallet coins! Please add funds to send gifts to idol.');
      return;
    }

    const nextBal = walletBalance - gift.cost;
    setWalletBalance(nextBal);
    try {
      localStorage.setItem('fanhub_user_wallet_coins', nextBal.toString());
    } catch {}

    const giftId = Date.now();
    const newFlying: FlyingGift = {
      id: giftId,
      name: gift.name,
      icon: gift.icon,
      sender: 'YOU (Fan Verified) ⭐',
      color: gift.color,
    };
    setFlyingGifts(prev => [...prev, newFlying]);

    // Dispatch broadcast event for chat
    onNewChatMessageChange(`[GIFT DISPATCHED: ${gift.icon} ${gift.name} (${gift.cost.toLocaleString()} coins) TO IDOL!]`);

    setGiftSuccessAlert(`SENT ${gift.icon} ${gift.name}! -${gift.cost.toLocaleString()} coins`);
    setTimeout(() => setGiftSuccessAlert(null), 3000);

    setTimeout(() => {
      setFlyingGifts(prev => prev.filter(g => g.id !== giftId));
    }, 3500);
  };

  const handleAddFunds = () => {
    const next = walletBalance + 500000;
    setWalletBalance(next);
    try {
      localStorage.setItem('fanhub_user_wallet_coins', next.toString());
    } catch {}
    setGiftSuccessAlert(`TOPPED UP +500,000 COINS TO FANDOM WALLET!`);
    setTimeout(() => setGiftSuccessAlert(null), 2500);
  };

  const handleQuickComment = (text: string) => {
    onNewChatMessageChange(text);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
      {/* 1. Livestream Screen (8 columns) */}
      <div className="lg:col-span-8 relative bg-black flex flex-col justify-center items-center overflow-hidden border-b lg:border-b-0 lg:border-r-2 border-black">
        <div className="relative w-full aspect-video bg-black">
          <iframe
            key={activeCam}
            src={camUrls[activeCam]}
            title={activeMedia.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          {/* Live Status Overlay Header */}
          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none font-mono">
            <div className="flex items-center gap-2">
              <span 
                style={{ borderRadius: '0px' }}
                className="px-2.5 py-1 bg-[#ef4444] text-white border-2 border-black text-[10px] font-black tracking-widest uppercase shadow-[2px_2px_0px_#000] animate-pulse flex items-center gap-1.5"
              >
                <Radio size={12} className="animate-spin" />
                ● LIVE BROADCAST (ZERO LATENCY)
              </span>
              <span 
                style={{ borderRadius: '0px' }}
                className="px-2 py-1 bg-black text-[#ffd60a] border-2 border-black text-[10px] font-black shadow-[2px_2px_0px_#000]"
              >
                {activeMedia.liveViewers?.toLocaleString() || '86,450'} VIEWERS
              </span>
            </div>

            <span 
              style={{ borderRadius: '0px' }}
              className="px-2 py-1 bg-black text-[#00f0ff] text-[10px] font-mono font-black border-2 border-black shadow-[2px_2px_0px_#000]"
            >
              WEBSOCKET // 4K 60FPS
            </span>
          </div>

          {/* Multi-Cam Angle Switcher HUD */}
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 font-mono text-[10px]">
            <span className="bg-black/85 text-neutral-400 px-2 py-1 border border-neutral-700 font-bold hidden sm:inline">
              <Video size={10} className="inline mr-1 text-[#ffd60a]" />
              MULTI-CAM:
            </span>
            <button
              type="button"
              onClick={() => setActiveCam('cam1')}
              className={`px-2 py-1 font-black uppercase cursor-pointer border border-black shadow-[1px_1px_0px_#000] transition-colors ${
                activeCam === 'cam1' ? 'bg-[#ffd60a] text-black font-extrabold' : 'bg-black/85 text-white hover:bg-neutral-800'
              }`}
            >
              [CAM 1: MAIN STAGE]
            </button>
            <button
              type="button"
              onClick={() => setActiveCam('cam2')}
              className={`px-2 py-1 font-black uppercase cursor-pointer border border-black shadow-[1px_1px_0px_#000] transition-colors ${
                activeCam === 'cam2' ? 'bg-[#00f0ff] text-black font-extrabold' : 'bg-black/85 text-white hover:bg-neutral-800'
              }`}
            >
              [CAM 2: CLOSE-UP]
            </button>
            <button
              type="button"
              onClick={() => setActiveCam('cam3')}
              className={`px-2 py-1 font-black uppercase cursor-pointer border border-black shadow-[1px_1px_0px_#000] transition-colors ${
                activeCam === 'cam3' ? 'bg-[#ff2e93] text-white font-extrabold' : 'bg-black/85 text-white hover:bg-neutral-800'
              }`}
            >
              [CAM 3: CATWALK VIP]
            </button>
          </div>

          {/* Flying Gift Animations across Video Screen */}
          {flyingGifts.map(g => (
            <div
              key={g.id}
              className="absolute left-1/2 bottom-16 -translate-x-1/2 z-30 pointer-events-none animate-bounce flex items-center gap-3 p-3 bg-black/90 border-3 border-white shadow-[6px_6px_0px_#ffd60a]"
            >
              <span className="text-4xl animate-spin" style={{ animationDuration: '3s' }}>{g.icon}</span>
              <div className="text-left font-mono">
                <div className="text-[10px] text-[#ffd60a] font-black uppercase">VIRTUAL GIFT DISPATCHED</div>
                <div className="text-sm font-black text-white">{g.sender} gifted {g.name}!</div>
              </div>
            </div>
          ))}

          {/* Floating Reaction Text Animations */}
          {floatingReactions.map((r) => (
            <div
              key={r.id}
              style={{
                borderRadius: '0px',
                left: `${r.x}%`,
              }}
              className="absolute bottom-16 pointer-events-none text-xs font-mono font-black border-2 border-black px-2.5 py-1 bg-[#ffd60a] text-black shadow-[3px_3px_0px_#000000] animate-bounce z-20"
            >
              {r.text}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Interactive Teletext Live Chat & Virtual Gifting (4 columns) */}
      <div 
        className={`lg:col-span-4 flex flex-col font-mono text-xs ${
          isCinemaMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-black'
        }`}
      >
        <div className="flex-1 flex flex-col h-full min-h-[480px]">
          {/* Chat Header with Wallet Balance */}
          <div className="p-3 border-b-2 border-black flex items-center justify-between bg-[#fefce8] text-black">
            <div>
              <h4 className="font-mono font-black text-xs uppercase tracking-wider text-black m-0 flex items-center gap-1.5">
                <MessageSquare size={13} className="text-[#ff2e93]" />
                <span>LIVE CHAT TELETEXT (WEBSOCKET)</span>
              </h4>
              <span className="text-[10px] text-neutral-600 font-bold">
                REALTIME FAN BROADCAST • {liveChatList.length} MESSAGES
              </span>
            </div>

            {/* Wallet pill button */}
            <div className="flex items-center gap-1.5 bg-black text-[#ffd60a] px-2 py-1 border border-black shadow-[1px_1px_0px_#000]">
              <Wallet size={12} className="text-[#ffd60a]" />
              <span className="text-[11px] font-black">{walletBalance.toLocaleString('vi-VN')}₫</span>
              <button
                type="button"
                onClick={handleAddFunds}
                className="w-4 h-4 bg-[#ffd60a] hover:bg-yellow-400 text-black font-black flex items-center justify-center text-[10px] cursor-pointer ml-1"
                title="Top up wallet balance"
              >
                +
              </button>
            </div>
          </div>

          {giftSuccessAlert && (
            <div className="p-2 bg-emerald-500 text-black font-black text-[11px] text-center border-b border-black animate-in fade-in">
              {giftSuccessAlert}
            </div>
          )}

          {/* Messages Scroller */}
          <div 
            ref={chatContainerRef}
            className="flex-1 p-3.5 space-y-2.5 overflow-y-auto max-h-[320px] text-[11px] relative bg-slate-50 dark:bg-black/50 scroll-smooth"
          >
            {liveChatList.map((msg) => (
              <div 
                key={msg.id} 
                className="border-b border-neutral-200 dark:border-neutral-800 pb-1.5 flex items-start gap-2.5 animate-in fade-in duration-150"
              >
                <img 
                  src={msg.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} 
                  alt={msg.user} 
                  className="w-6 h-6 border border-black object-cover shrink-0 mt-0.5" 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-neutral-500 mb-0.5 text-[10px]">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-black text-[#ff2e93] truncate">{msg.user}</span>
                      {msg.badge && (
                        <span 
                          className="px-1 py-0.2 bg-black text-[#ffd60a] text-[8px] font-mono font-bold uppercase shrink-0 border border-black"
                          style={{ borderColor: msg.badgeColor || '#000' }}
                        >
                          {msg.badge}
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-bold text-neutral-400 shrink-0 ml-1">{msg.timestamp}</span>
                  </div>
                  <p className="leading-snug font-sans font-medium text-black dark:text-neutral-200 m-0 break-words">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Virtual Gifting Bar */}
          <div className="px-3 py-2 border-t-2 border-black bg-[#fef08a] text-black">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase flex items-center gap-1">
                <Gift size={12} className="text-[#ff2e93]" />
                <span>VIRTUAL GIFTS FOR IDOL:</span>
              </span>
              <button
                type="button"
                onClick={() => setIsGiftDrawerOpen(!isGiftDrawerOpen)}
                className="text-[10px] font-black text-blue-700 underline cursor-pointer"
              >
                {isGiftDrawerOpen ? 'Collapse ▲' : 'View Gifts ▼'}
              </button>
            </div>

            {/* Quick Gift Buttons */}
            <div className="grid grid-cols-4 gap-1.5">
              {virtualGifts.map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handleSendVirtualGift(g)}
                  className="p-1 bg-white hover:bg-black hover:text-white text-black border border-black text-center cursor-pointer transition-colors shadow-[1px_1px_0px_#000]"
                >
                  <div className="text-base leading-none mb-0.5">{g.icon}</div>
                  <div className="text-[9px] font-bold truncate">{g.name.split(' ')[0]}</div>
                  <div className="text-[8px] opacity-70">{(g.cost / 1000)}k</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Floating Reaction Emojis & Comment Chips Bar */}
          <div className="px-3 py-1.5 border-t border-black flex flex-wrap items-center justify-between gap-1 text-[11px] font-mono font-black bg-[#ecfeff]">
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-neutral-500">REACT:</span>
              {['❤️', '🔥', '⭐', '⚡', '🎉'].map((txt) => (
                <button
                  key={txt}
                  type="button"
                  onClick={() => onTriggerReaction(txt)}
                  className="px-1.5 py-0.5 bg-white hover:bg-[#ffd60a] text-black border border-black text-xs cursor-pointer shadow-[1px_1px_0px_#000] transition-colors"
                >
                  {txt}
                </button>
              ))}
            </div>

            {/* Quick Comment Chips */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleQuickComment('🔥 STAGE ON FIRE!!')}
                className="px-1.5 py-0.5 bg-white hover:bg-neutral-200 text-black border border-black text-[9px] cursor-pointer"
              >
                + "🔥 FIRE!!"
              </button>
              <button
                type="button"
                onClick={() => handleQuickComment('💎 VIETNAM LOVES YOU!! ❤️')}
                className="px-1.5 py-0.5 bg-white hover:bg-neutral-200 text-black border border-black text-[9px] cursor-pointer"
              >
                + "🇻🇳 VN LOVES U"
              </button>
            </div>
          </div>

          {/* Chat Message Input Form */}
          <form 
            onSubmit={onSendChatMessage} 
            className="p-2.5 border-t-2 border-black flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900"
          >
            <input
              type="text"
              placeholder="Send live comment to idol..."
              value={newChatMessage}
              onChange={(e) => onNewChatMessageChange(e.target.value)}
              style={{ borderRadius: '0px' }}
              className="flex-1 px-3 py-2 text-xs border-2 border-black bg-white dark:bg-black font-mono focus:outline-none focus:ring-2 focus:ring-[#ff2e93]"
            />
            <button
              type="submit"
              disabled={!newChatMessage.trim()}
              style={{ borderRadius: '0px' }}
              className="px-3.5 py-2 bg-[#ff2e93] hover:bg-[#e11d48] text-white font-mono text-xs font-black uppercase tracking-wider disabled:opacity-40 cursor-pointer border-2 border-black shadow-[2px_2px_0px_#000] transition-all flex items-center gap-1"
            >
              <Send size={12} />
              <span>SEND</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
