'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ChatbotModalProps {
  onFilterArtist: (artistId: string) => void;
  onOpenCart: () => void;
}

export const ChatbotModal: React.FC<ChatbotModalProps> = ({ onFilterArtist, onOpenCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isGamingTheme, setIsGamingTheme] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkTheme = () => {
      const themeAttr = document.documentElement.getAttribute('data-fandom-theme') || 
                        document.body.getAttribute('data-fandom-theme');
      setIsGamingTheme(themeAttr === 'gaming');
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['data-fandom-theme'] });
    return () => observer.disconnect();
  }, []);

  const initialMessages: ChatMessage[] = [
    {
      id: 'msg-0',
      sender: 'bot',
      text: 'SYSTEM // FANHUB AI CONSOLE V2.0 READY.\nHello Fandom Stan. I am your AI System Assistant. What stadium concert tickets, 4K trailers, lossless audio tracks, or verified releases can I assist you with today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fanhub_chat_history');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return initialMessages;
  });

  // Save chat history to localStorage when streaming is idle
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0 && !streamingMsgId && !isTyping) {
      localStorage.setItem('fanhub_chat_history', JSON.stringify(messages));
    }
  }, [messages, streamingMsgId, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping, streamingMsgId]);

  const handleClearHistory = () => {
    setMessages(initialMessages);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fanhub_chat_history');
    }
  };

  const generateBotReply = (userQuery: string): { 
    reply: string; 
    action?: ChatMessage['suggestedAction'];
    ticketCard?: ChatMessage['ticketCard'];
  } => {
    const q = userQuery.toLowerCase();

    // 0. Question 1: Concert K-Pop tại Hà Nội cuối tuần này / K-Pop concert in Hanoi this weekend
    if (
      (q.includes('k-pop') || q.includes('kpop') || q.includes('seventeen')) && 
      (q.includes('hà nội') || q.includes('hanoi') || q.includes('tuần') || q.includes('weekend'))
    ) {
      return {
        reply: `AI ANALYSIS // K-POP CONCERT SCHEDULE IN HANOI THIS WEEKEND:

🔥 Headliner Stadium Tour: SEVENTEEN [RIGHT HERE] World Tour in Hanoi
📍 Venue: My Dinh National Stadium (Hanoi)
📅 Schedule: This Saturday & Sunday (18:30 - 22:30)
🎟️ Ticket Range: From $48 (Standard Grandstand) to $140 (VIP CARAT Soundcheck Fanzone A).
🛡️ Gate Technology: Integrated 30-second rolling anti-scalp dynamic QR code & ERC-721 Smart Contract verification.

Bonus Fandom Event: NewJeans "Get Up" Cup Sleeve Cafe in Cau Giay (Free RSVP Admission).`,
        action: { type: 'view_album', payload: 'event' },
        ticketCard: {
          id: 'ev-hn-svt-right-here',
          title: 'SEVENTEEN [RIGHT HERE] World Tour in Hanoi',
          artist: 'SEVENTEEN (PLEDIS Entertainment)',
          venue: 'My Dinh National Stadium, Hanoi',
          date: 'This Saturday • 18:30',
          image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=800&q=80',
          price: '$48 - $140 (Standard to VIP)',
          perks: ['VIP Soundcheck Pass', 'Stage-front Fanzone', 'Carat Bong LED Sync', '30s Dynamic QR Pass'],
          actionUrl: '/event?fandom=kpop'
        }
      };
    }

    // 0. Question 2: Hạng vé VIP concert Sơn Tùng bao gồm quyền lợi gì / Son Tung VIP perks
    if (
      (q.includes('sơn tùng') || q.includes('son tung') || q.includes('sky tour') || q.includes('m-tp')) && 
      (q.includes('vip') || q.includes('quyền lợi') || q.includes('quyen loi') || q.includes('vé') || q.includes('ticket') || q.includes('perk'))
    ) {
      return {
        reply: `AI ANALYSIS // SON TUNG M-TP VIP CONCERT TICKET PERKS:

The VIP Diamond / VVIP Fanzone A1 pass for "SKY TOUR Live In Hanoi Arena" provides 5 TOP-TIER EXCLUSIVE BENEFITS:

1. 🌟 Front-row standing/reserved seat directly along the runway catwalk with direct stage sightlines.
2. 🎙️ Soundcheck Access: Exclusive admission 2 hours early to watch Son Tung's live acoustic and band rehearsal.
3. 🎁 Exclusive Merchandise Box: Official Sky Tour Lightstick, individualized signed Hologram Photocard Set, and limited tour tee.
4. 🚀 Dedicated VIP Fast-Track Express Gate with priority security clearance.
5. 🛡️ Electronic NFC Smart Wristband & Blockchain NFT verified ticket preventing duplicate scalper passes.`,
        action: { type: 'view_album', payload: 'event' },
        ticketCard: {
          id: 'ev-hn-sontung-sky-tour',
          title: 'Son Tung M-TP — SKY TOUR Live In Hanoi Arena',
          artist: 'Son Tung M-TP (M-TP Entertainment)',
          venue: 'National Convention Center, Hanoi',
          date: '20:00 (Upcoming Arena Date)',
          image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
          price: '$112 (VIP Diamond Pass)',
          perks: ['Soundcheck 2h before show', 'Fanzone A1 Runway Front', 'Full Boxset Lightstick + Tee', 'Smart Contract NFT'],
          actionUrl: '/event?fandom=vpop'
        }
      };
    }

    // 1. Multimedia Center & Trailer & Rating
    if (q.includes('trailer') || q.includes('multimedia') || q.includes('podcast') || q.includes('review') || q.includes('rating') || q.includes('soundtrack')) {
      return {
        reply: 'SYSTEM // MULTIMEDIA BROADCAST ACTIVE:\nStream 4K trailers, backstage videos, 24-bit lossless audio tracks, and participate in community ratings at the Cinematheque & Sound Lab.',
        action: { type: 'view_album', payload: 'multimedia' },
      };
    }

    // 2. Location-Aware GPS & Meetup Map
    if (q.includes('location') || q.includes('gps') || q.includes('map') || q.includes('nearby') || q.includes('meetup') || q.includes('cafe')) {
      return {
        reply: 'SYSTEM // EVENT RADAR GPS:\nAutomatically discovering cup sleeves, photocard trading sessions, and live arena concerts in your local area.',
        action: { type: 'view_album', payload: 'event' },
      };
    }

    // 3. NewJeans
    if (q.includes('newjeans') || q.includes('bunnies') || q.includes('supernatural') || q.includes('how sweet')) {
      return {
        reply: 'SYSTEM // ARTIST NEWJEANS:\n"Supernatural" 4K single and "Get Up" EP First Press available. Would you like to filter NewJeans on the catalog grid?',
        action: { type: 'filter_artist', payload: 'newjeans' },
      };
    }

    // 4. BLACKPINK
    if (q.includes('blackpink') || q.includes('blink') || q.includes('born pink')) {
      return {
        reply: 'SYSTEM // ARTIST BLACKPINK:\n"BORN PINK" Limited Boxset and Stadium World Tour schedule are synced into the system.',
        action: { type: 'filter_artist', payload: 'blackpink' },
      };
    }

    // 5. Concert Tickets
    if (q.includes('ticket') || q.includes('pass') || q.includes('concert') || q.includes('tour')) {
      return {
        reply: 'SYSTEM // WORLD TOUR STADIUM SCHEDULE:\nSEVENTEEN, BLACKPINK Encore, and Say Hi All-Stars stage pass reservations and ticketing links are live.',
        action: { type: 'view_album', payload: 'event' },
      };
    }

    // 6. Fan-Submitted Articles
    if (q.includes('submit') || q.includes('article') || q.includes('post') || q.includes('community')) {
      return {
        reply: 'SYSTEM // SUBMIT FANDOM DISPATCH:\nYou can submit reviews or lore analysis by clicking "[+ SUBMIT POST]" in the Fandom Community section.',
      };
    }

    // 7. Photocards authenticity
    if (q.includes('photocard') || q.includes('card') || q.includes('pob') || q.includes('auth')) {
      return {
        reply: 'SYSTEM // OFFICIAL AUTHENTICITY:\n100% factory-sealed official imports with original Pre-Order Benefits (POB), counting towards Hanteo & Circle Charts.',
      };
    }

    // 8. Showcase / Cart
    if (q.includes('cart') || q.includes('buy') || q.includes('checkout') || q.includes('bag') || q.includes('pre-order')) {
      return {
        reply: 'SYSTEM // SHOWCASE PRE-ORDER ALERT:\nThis platform operates under non-commercial Showcase Discovery standards. Register alerts for official drop notifications.',
        action: { type: 'open_cart', payload: '' },
      };
    }

    return {
      reply: `SYSTEM ACKNOWLEDGED: "${userQuery}".\nFan Hub Plus supports multi-fandom queries (K-Pop, V-Pop, Anime, Gaming, Cinema, Cosplay). You can select a quick prompt below.`,
    };
  };

  // Helper function: LLM token astream typing effect
  const streamTextToMessage = async (
    targetMsgId: string,
    fullText: string,
    suggestedAction?: ChatMessage['suggestedAction'],
    ticketCard?: ChatMessage['ticketCard']
  ) => {
    setStreamingMsgId(targetMsgId);

    // Split text into tokens / words for natural streaming cadence
    const tokens = fullText.match(/\S+|\s+/g) || [fullText];
    let current = '';

    for (let i = 0; i < tokens.length; i++) {
      current += tokens[i];
      const snapshot = current;
      setMessages((prev) =>
        prev.map((m) => (m.id === targetMsgId ? { ...m, text: snapshot } : m))
      );
      scrollToBottom();
      // 20ms per token delivers a responsive yet distinct astream feel
      await new Promise((resolve) => setTimeout(resolve, 20));
    }

    // Finalize with completed text, suggested action, and ticket card
    setMessages((prev) =>
      prev.map((m) =>
        m.id === targetMsgId
          ? {
              ...m,
              text: fullText,
              suggestedAction,
              ticketCard,
            }
          : m
      )
    );
    setStreamingMsgId(null);
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isTyping || streamingMsgId !== null) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(scrollToBottom, 50);

    // Ensure the 3 bouncing dots are visible for an organic thinking duration (650ms)
    const minTypingDelay = new Promise((resolve) => setTimeout(resolve, 650));

    let replyText = '';
    let action: ChatMessage['suggestedAction'] | undefined = undefined;
    let ticketCard: ChatMessage['ticketCard'] | undefined = undefined;

    const lowerQ = text.toLowerCase();
    // Prioritize high-accuracy demo queries
    if (
      lowerQ.includes('k-pop') || lowerQ.includes('kpop') || 
      lowerQ.includes('sơn tùng') || lowerQ.includes('son tung') || 
      lowerQ.includes('sky tour') || lowerQ.includes('seventeen') ||
      lowerQ.includes('hà nội') || lowerQ.includes('hanoi') ||
      lowerQ.includes('vip') || lowerQ.includes('quyền lợi')
    ) {
      await minTypingDelay;
      const botReply = generateBotReply(text);
      replyText = botReply.reply;
      action = botReply.action;
      ticketCard = botReply.ticketCard;
    } else {
      try {
        const resPromise = fetch("/api/v1/chatbot/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text })
        });

        const [res] = await Promise.all([resPromise, minTypingDelay]);

        if (res.ok) {
          const contentType = res.headers.get("content-type") || "";
          if (contentType.includes("text/event-stream") && res.body) {
            // Native SSE / ReadableStream astream
            setIsTyping(false);
            const botMsgId = `msg-${Date.now() + 1}`;
            const botMsg: ChatMessage = {
              id: botMsgId,
              sender: 'bot',
              text: '',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, botMsg]);
            setStreamingMsgId(botMsgId);

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let streamAcc = '';
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              streamAcc += decoder.decode(value, { stream: true });
              const snap = streamAcc;
              setMessages((prev) =>
                prev.map((m) => (m.id === botMsgId ? { ...m, text: snap } : m))
              );
              scrollToBottom();
            }
            setStreamingMsgId(null);
            return;
          }

          const data = await res.json();
          replyText = data.reply || generateBotReply(text).reply;
          action = data.suggestedAction || generateBotReply(text).action;
          ticketCard = generateBotReply(text).ticketCard;
        } else {
          const botReply = generateBotReply(text);
          replyText = botReply.reply;
          action = botReply.action;
          ticketCard = botReply.ticketCard;
        }
      } catch {
        await minTypingDelay;
        const botReply = generateBotReply(text);
        replyText = botReply.reply;
        action = botReply.action;
        ticketCard = botReply.ticketCard;
      }
    }

    // Trigger token astream effect
    setIsTyping(false);
    const botMsgId = `msg-${Date.now() + 1}`;
    const botMsg: ChatMessage = {
      id: botMsgId,
      sender: 'bot',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, botMsg]);

    await streamTextToMessage(botMsgId, replyText, action, ticketCard);
  };

  const promptSuggestions = [
    'Any K-Pop concerts in Hanoi this weekend?',
    'What perks are in Son Tung VIP ticket?',
    'GPS EVENT RADAR',
    'TRAILER 4K & RATING',
    'STADIUM TOUR DATES',
  ];

  return (
    <>
      {/* Floating Action Trigger Button with High Z-Index */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ borderRadius: '0px' }}
        className={`fixed bottom-6 right-6 z-[9999] px-4 py-3 ${isGamingTheme ? 'bg-black text-white hover:bg-white hover:text-black border-2 border-black shadow-none' : 'bg-[#d91470] text-white hover:bg-[#be185d] border-3 border-black shadow-[4px_4px_0px_#000000]'} font-mono text-xs font-black uppercase tracking-widest cursor-pointer transition-colors duration-100 flex items-center gap-2.5`}
        title="Launch AI Fandom Assistant"
        type="button"
      >
        <span className={`w-2.5 h-2.5 ${isGamingTheme ? 'bg-white' : 'bg-[#ffd60a]'} border border-black animate-ping`} />
        <span>★ AI BOT // FANDOM OS ✦</span>
      </button>

      {/* Chat Window Modal with High Z-Index */}
      {isOpen && (
        <div 
          style={{ borderRadius: '0px' }}
          className={`fixed bottom-24 right-4 sm:right-6 z-[10000] w-[94vw] sm:w-[450px] max-h-[620px] h-[560px] bg-white text-black border-3 border-black flex flex-col overflow-hidden ${isGamingTheme ? 'shadow-none' : 'shadow-[8px_8px_0px_#000000]'} font-mono text-xs`}
        >
          {/* Y2K Window Bar Header */}
          <div className={`${isGamingTheme ? 'bg-black text-white' : 'bg-[#ffd60a] text-black'} px-4 py-2.5 flex items-center justify-between border-b-3 border-black select-none`}>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 ${isGamingTheme ? 'bg-white' : 'bg-[#ff2e93]'} border border-black`} />
              <span className="font-black tracking-widest text-[11px] uppercase">
                SYS.AI // FANDOM_OPERATOR_V2.0
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClearHistory}
                className={`bg-white ${isGamingTheme ? 'hover:bg-black hover:text-white shadow-none' : 'hover:bg-[#ecfeff] shadow-[1px_1px_0px_#000]'} text-black px-2 py-0.5 border border-black text-[10px] font-black uppercase cursor-pointer`}
                title="Purge chat log"
                type="button"
              >
                [PURGE]
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className={`${isGamingTheme ? 'bg-black text-white hover:bg-white hover:text-black border-2 border-white shadow-none' : 'bg-[#ff2e93] text-white hover:bg-[#e11d48] border-2 border-black shadow-[1px_1px_0px_#000]'} px-2 py-0.5 text-[10px] font-black cursor-pointer`}
                title="Close Window"
                type="button"
              >
                [✕]
              </button>
            </div>
          </div>

          {/* Quick FAQ Chips Bar */}
          <div className={`p-2.5 ${isGamingTheme ? 'bg-neutral-100' : 'bg-[#ecfeff]'} border-b-2 border-black flex gap-1.5 overflow-x-auto scrollbar-none text-[10px]`}>
            {promptSuggestions.map((prompt, idx) => (
              <button
                key={idx}
                disabled={isTyping || streamingMsgId !== null}
                onClick={() => handleSend(prompt)}
                style={{ borderRadius: '0px' }}
                className={`whitespace-nowrap px-2.5 py-1 ${isGamingTheme ? 'bg-white hover:bg-black hover:text-white shadow-none' : 'bg-white hover:bg-[#ffd60a] shadow-[1px_1px_0px_#000]'} text-black border-2 border-black font-black uppercase transition-colors cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed`}
                type="button"
              >
                ★ {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fdfbf7] text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  style={{ borderRadius: '0px' }}
                  className={`max-w-[90%] p-3.5 border-2 border-black shadow-[3px_3px_0px_#000000] ${
                    msg.sender === 'user'
                      ? 'bg-[#00f0ff] text-black'
                      : 'bg-white text-black'
                  }`}
                >
                  <div className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-1 flex items-center gap-1">
                    <span>{msg.sender === 'user' ? '⚡ USER_PROMPT' : '✪ SYSTEM_TELETYPE'}</span>
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed font-mono font-medium">
                    {msg.text}
                    {streamingMsgId === msg.id && (
                      <span className="inline-block w-2 h-3.5 bg-[#ff2e93] border border-black animate-pulse ml-1 align-middle" />
                    )}
                  </p>

                  {/* Contextual Action Button */}
                  {msg.suggestedAction && streamingMsgId !== msg.id && (
                    <div className="mt-3 pt-2.5 border-t-2 border-black flex flex-wrap gap-2 animate-in fade-in duration-300">
                      {msg.suggestedAction.type === 'filter_artist' && (
                        <button
                          onClick={() => {
                            onFilterArtist(msg.suggestedAction!.payload);
                            setIsOpen(false);
                          }}
                          style={{ borderRadius: '0px' }}
                          className="px-3 py-1.5 bg-[#ff2e93] text-white hover:bg-[#e11d48] border-2 border-black font-black text-[10px] uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_#000]"
                        >
                          ★ LOCATE // {msg.suggestedAction.payload.toUpperCase()}
                        </button>
                      )}

                      {msg.suggestedAction.type === 'open_cart' && (
                        <button
                          onClick={() => {
                            onOpenCart();
                            setIsOpen(false);
                          }}
                          style={{ borderRadius: '0px' }}
                          className="px-3 py-1.5 bg-[#ffd60a] text-black hover:bg-[#fde047] border-2 border-black font-black text-[10px] uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_#000]"
                        >
                          ★ OPEN SHOWCASE BAG
                        </button>
                      )}

                      {msg.suggestedAction.payload === 'multimedia' && (
                        <a
                          href="#multimedia"
                          onClick={() => setIsOpen(false)}
                          style={{ borderRadius: '0px' }}
                          className="px-3 py-1.5 bg-[#ccff00] text-black hover:bg-[#bef264] border-2 border-black font-black text-[10px] uppercase tracking-wider cursor-pointer inline-block shadow-[2px_2px_0px_#000]"
                        >
                          ★ LAUNCH CINEMATHEQUE
                        </a>
                      )}

                      {msg.suggestedAction.payload === 'event' && (
                        <a
                          href="/event"
                          onClick={() => setIsOpen(false)}
                          style={{ borderRadius: '0px' }}
                          className="px-3 py-1.5 bg-[#00f0ff] text-black hover:bg-[#38bdf8] border-2 border-black font-black text-[10px] uppercase tracking-wider cursor-pointer inline-block shadow-[2px_2px_0px_#000]"
                        >
                          ★ ACCESS STADIUM CALENDAR
                        </a>
                      )}
                    </div>
                  )}

                  {/* Interactive Ticket Link Card */}
                  {msg.ticketCard && streamingMsgId !== msg.id && (
                    <div className="mt-3 p-3 bg-neutral-900 border-2 border-black text-white shadow-[3px_3px_0px_#ff2e93] text-xs space-y-2 animate-in fade-in duration-300">
                      <div className="flex gap-3">
                        <img 
                          src={msg.ticketCard.image} 
                          alt={msg.ticketCard.title}
                          className="w-16 h-16 object-cover border border-white shrink-0" 
                        />
                        <div className="min-w-0">
                          <span className="text-[9px] font-black px-1.5 py-0.2 bg-[#ffd60a] text-black">
                            TICKET CARD LINK
                          </span>
                          <h5 className="text-xs font-black text-white truncate mt-1">
                            {msg.ticketCard.title}
                          </h5>
                          <div className="text-[10px] text-neutral-300 truncate">
                            📍 {msg.ticketCard.venue}
                          </div>
                          <div className="text-[10px] text-pink-400 font-bold">
                            💰 Giá vé: {msg.ticketCard.price}
                          </div>
                        </div>
                      </div>

                      {msg.ticketCard.perks && msg.ticketCard.perks.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {msg.ticketCard.perks.map((p, idx) => (
                            <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-black/60 text-cyan-300 border border-neutral-700">
                              ✓ {p}
                            </span>
                          ))}
                        </div>
                      )}

                      <a
                        href={msg.ticketCard.actionUrl}
                        onClick={() => setIsOpen(false)}
                        className="w-full py-2 bg-[#ff2e93] hover:bg-pink-600 text-white font-black text-[11px] uppercase tracking-wider text-center block no-underline border border-black shadow-[2px_2px_0px_#ffd60a] transition-all"
                      >
                        RESERVE TICKETS / VIEW SEAT MAP →
                      </a>
                    </div>
                  )}

                  <span className="block text-[9px] mt-1.5 font-mono text-neutral-600 font-bold text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Tin nhắn chờ 3 chấm nhảy nhảy (Typing Indicator) */}
            {isTyping && (
              <div className="flex flex-col items-start animate-in fade-in duration-200">
                <div
                  style={{ borderRadius: '0px' }}
                  className="max-w-[90%] p-3.5 border-2 border-black shadow-[3px_3px_0px_#000000] bg-white text-black"
                >
                  <div className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full animate-ping" />
                    <span>✪ SYSTEM_TELETYPE // GENERATING ASTREAM...</span>
                  </div>
                  <div className="flex items-center gap-2 py-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-[#ff2e93] rounded-full animate-bounce [animation-delay:-0.32s] border border-black shadow-[1px_1px_0px_#000]" />
                      <span className="w-2.5 h-2.5 bg-[#00f0ff] rounded-full animate-bounce [animation-delay:-0.16s] border border-black shadow-[1px_1px_0px_#000]" />
                      <span className="w-2.5 h-2.5 bg-[#ffd60a] rounded-full animate-bounce border border-black shadow-[1px_1px_0px_#000]" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-neutral-600 ml-1.5 tracking-wider animate-pulse">
                      ĐANG TẢI PHẢN HỒI...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t-3 border-black flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={
                streamingMsgId !== null
                  ? '[AI ĐANG STREAM DỮ LIỆU...]'
                  : isTyping
                  ? '[AI ĐANG SOẠN PHẢN HỒI...]'
                  : 'ENTER SYSTEM QUERY...'
              }
              disabled={isTyping || streamingMsgId !== null}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ borderRadius: '0px' }}
              className="flex-1 px-3 py-2 border-2 border-black text-xs font-mono uppercase bg-[#fdfbf7] focus:outline-none focus:bg-white focus:border-[#ff2e93] disabled:opacity-50 disabled:bg-neutral-100"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping || streamingMsgId !== null}
              style={{ borderRadius: '0px' }}
              className="px-4 py-2 bg-[#ff2e93] text-white font-black uppercase tracking-wider disabled:opacity-40 hover:bg-[#e11d48] transition-colors cursor-pointer border-2 border-black shadow-[2px_2px_0px_#000] active:translate-y-0.5"
            >
              {streamingMsgId !== null ? '[STREAM...]' : isTyping ? '[...]' : '[SEND →]'}
            </button>
          </form>
        </div>
      )}
    </>
  );
};
