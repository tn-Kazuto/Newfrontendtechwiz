'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  MediaItem, 
  MediaType, 
  FandomCategory, 
  INITIAL_MEDIA_ITEMS, 
  LiveChatMessage 
} from '../data/multimediaData';
import {
  MultimediaHeader,
  MultimediaPlayerDeck,
  MultimediaAudioDeck,
  MultimediaLiveChat,
  MultimediaRatingPanel,
  MultimediaFilterBar,
  MultimediaCardGrid,
  MultimediaProtocolBanner,
} from './multimedia';

interface MultimediaCenterProps {
  initialMediaId?: string;
  defaultCategory?: string;
}

export const MultimediaCenter: React.FC<MultimediaCenterProps> = ({
  initialMediaId,
  defaultCategory,
}) => {
  // Media items state (allows persistent rating and thumbs updates in memory)
  const [mediaList, setMediaList] = useState<MediaItem[]>(INITIAL_MEDIA_ITEMS);

  // Active selected media item (defaults to live stream)
  const [activeMediaId, setActiveMediaId] = useState<string>(() => {
    if (initialMediaId) return initialMediaId;
    return 'media-live-1';
  });

  const activeMedia = useMemo(() => {
    return mediaList.find((m) => m.id === activeMediaId) || mediaList[0];
  }, [mediaList, activeMediaId]);

  // Filters & Search
  const [selectedFormat, setSelectedFormat] = useState<MediaType | 'all'>('all');
  const [selectedUniverse, setSelectedUniverse] = useState<FandomCategory | 'all'>('all');
  const [selectedArtist, setSelectedArtist] = useState<string>('');
  const [selectedArtistLabel, setSelectedArtistLabel] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'views' | 'rating' | 'newest' | 'duration'>('views');

  // Handle category selection with auto-trailer playback
  const handleSelectUniverse = (cat: FandomCategory | 'all') => {
    setSelectedUniverse(cat);
    setSelectedArtist('');
    setSelectedArtistLabel('');
    if (cat !== 'all') {
      const firstMatch =
        mediaList.find((m) => (m.category === cat || (cat === 'Cinema' && m.category === 'Movies')) && m.type === 'trailer') ||
        mediaList.find((m) => m.category === cat || (cat === 'Cinema' && m.category === 'Movies'));
      if (firstMatch) {
        setActiveMediaId(firstMatch.id);
      }
    }
  };

  // Handle artist/music group selection with auto-trailer playback
  const handleSelectArtist = (artistQuery: string, artistLabel: string) => {
    setSelectedArtist(artistQuery);
    setSelectedArtistLabel(artistLabel);
    if (artistQuery) {
      const q = artistQuery.toLowerCase();
      const matchedItem =
        mediaList.find((m) => {
          const matchCat = selectedUniverse === 'all' || m.category === selectedUniverse || (selectedUniverse === 'Cinema' && m.category === 'Movies');
          const matchArt = m.artist.toLowerCase().includes(q) || m.tags.some((t) => t.toLowerCase().includes(q)) || m.title.toLowerCase().includes(q);
          return matchCat && matchArt && m.type === 'trailer';
        }) ||
        mediaList.find((m) => {
          const matchCat = selectedUniverse === 'all' || m.category === selectedUniverse || (selectedUniverse === 'Cinema' && m.category === 'Movies');
          return matchCat && (m.artist.toLowerCase().includes(q) || m.tags.some((t) => t.toLowerCase().includes(q)) || m.title.toLowerCase().includes(q));
        });
      if (matchedItem) {
        setActiveMediaId(matchedItem.id);
      }
    }
  };

  // Synchronize category filter with active fandom category
  useEffect(() => {
    const applyCategory = (catName?: string) => {
      if (!catName || catName === 'all') return;
      const lower = catName.toLowerCase();
      let matched: FandomCategory | null = null;
      if (lower.includes('gaming')) matched = 'Gaming';
      else if (lower.includes('manga')) matched = 'Manga';
      else if (lower.includes('anime') || lower.includes('sakuga')) matched = 'Anime';
      else if (lower.includes('cosplay')) matched = 'Cosplay';
      else if (lower.includes('comic')) matched = 'Comics';
      else if (lower.includes('cinema') || lower.includes('movie')) matched = 'Cinema';
      else if (lower.includes('tv')) matched = 'TV Shows';
      else if (lower.includes('kpop') || lower.includes('k-pop')) matched = 'K-Pop';
      else if (lower.includes('vpop') || lower.includes('v-pop')) matched = 'V-Pop';

      if (matched) {
        setSelectedUniverse(matched);
        setSelectedArtist('');
        const firstMatch = mediaList.find((m) => m.category === matched && m.type === 'trailer') || mediaList.find((m) => m.category === matched);
        if (firstMatch) {
          setActiveMediaId(firstMatch.id);
        }
      }
    };

    if (defaultCategory) {
      applyCategory(defaultCategory);
    }

    const handleThemeChange = (e: any) => {
      if (e.detail?.category) {
        applyCategory(e.detail.category);
      }
    };

    window.addEventListener('fandom-theme-change', handleThemeChange);
    return () => window.removeEventListener('fandom-theme-change', handleThemeChange);
  }, [defaultCategory, mediaList]);

  // Cinema Mode / Lighting Dimmer
  const [isCinemaMode, setIsCinemaMode] = useState(false);

  // Audio Player State (for podcast and soundtrack formats)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0); // 0 to 100
  const [isMuted, setIsMuted] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Rating States
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [ratingToast, setRatingToast] = useState<string | null>(null);
  const [showRatingBreakdown, setShowRatingBreakdown] = useState(false);

  // Bookmark / Watch Later
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fanhub_bookmarked_media');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Live Chat State
  const [liveChatList, setLiveChatList] = useState<LiveChatMessage[]>(() => {
    return activeMedia?.chatMessages || [];
  });
  const [newChatMessage, setNewChatMessage] = useState('');
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; text: string; x: number }[]>([]);
  const nextReactionId = useRef(0);

  // Synchronize live chat when activeMedia changes
  useEffect(() => {
    if (activeMedia?.chatMessages) {
      setLiveChatList(activeMedia.chatMessages);
    } else {
      setLiveChatList([]);
    }
    // Pause audio when switching
    setIsPlayingAudio(false);
    setAudioProgress(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [activeMediaId, activeMedia]);

  // Periodic simulated incoming fan comments during livestream
  useEffect(() => {
    if (activeMedia.type !== 'livestream') return;

    const fanFeed = [
      { user: 'Hanoi_CARAT_99 💎', msg: 'The stage lighting is completely unreal tonight! 🔥', badge: 'VIP FAN' },
      { user: 'Blink_Forever_Rose 🌹', msg: 'Sound quality is so crisp in 4K 60FPS!! 🎧', badge: 'MEMBER' },
      { user: 'SonTung_Sky_HN 🌟', msg: 'Sending virtual lightsticks to the stage! 🚀💖', badge: 'SUPPORTER' },
      { user: 'KpopAddict_2026 ⚡', msg: 'Anyone know the setlist for tonight? This song is a masterpiece!', badge: 'CARAT' },
      { user: 'Danang_FanClub ✨', msg: 'Danang fans are cheering so loud right now!! 🇻🇳', badge: 'COMMUNITY' },
      { user: 'Tokyo_LiveStreamer 🇯🇵', msg: 'Watching live from Tokyo, latency is literally zero delay!', badge: 'VERIFIED' },
      { user: 'Saigon_Beats_07 🐯', msg: 'That dance break was insane!! Rewinding mentally 🔥', badge: 'TOP FAN' },
      { user: 'Jenny_StarLight 💖', msg: 'Just tipped 50,000 coins! Keep shining! ⭐⭐⭐', badge: 'VIP SPONSOR' },
    ];

    let index = 0;
    const interval = setInterval(() => {
      const item = fanFeed[index % fanFeed.length];
      index++;

      const newMsg: LiveChatMessage = {
        id: `auto-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        user: item.user,
        avatar: `https://images.unsplash.com/photo-${1534528741775 + (index * 7391) % 100000}?auto=format&fit=crop&w=100&q=80`,
        badge: item.badge,
        badgeColor: '#ff2e93',
        message: item.msg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setLiveChatList((prev) => [...prev, newMsg]);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeMedia.type, activeMedia.id]);

  // Audio time update handler
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlayingAudio(false);
      setAudioProgress(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [activeMediaId]);

  // Handle Play/Pause for Audio
  const toggleAudioPlay = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlayingAudio(true);
    }
  };

  const handleAudioSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setAudioProgress(val);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
    }
  };

  const handleSkipTime = (deltaSeconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime + deltaSeconds);
    }
  };

  const handleChangePlaybackSpeed = (speed: number) => {
    setAudioSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Star Rating Handler
  const handleRateMedia = (stars: number) => {
    setMediaList((prev) =>
      prev.map((item) => {
        if (item.id === activeMedia.id) {
          const currentRating = item.rating;
          const isReRating = currentRating.userRating !== undefined && currentRating.userRating !== null;
          
          const newCount = isReRating ? currentRating.count : currentRating.count + 1;
          const newAvg = Number(
            (
              (currentRating.average * currentRating.count + stars - (isReRating ? (currentRating.userRating || 0) : 0)) /
              newCount
            ).toFixed(1)
          );

          return {
            ...item,
            rating: {
              ...currentRating,
              average: Math.min(5, Math.max(1, newAvg)),
              count: newCount,
              userRating: stars,
            },
          };
        }
        return item;
      })
    );

    setRatingToast(`RATING RECORDED // [${stars}/5.0] FOR "${activeMedia.title.slice(0, 28)}..."`);
    setTimeout(() => setRatingToast(null), 3000);
  };

  // Thumbs Up / Down Handler
  const handleVoteThumbs = (voteType: 'up' | 'down') => {
    setMediaList((prev) =>
      prev.map((item) => {
        if (item.id === activeMedia.id) {
          const currentRating = item.rating;
          let newUp = currentRating.thumbsUp;
          let newDown = currentRating.thumbsDown;
          let newVote: 'up' | 'down' | null = voteType;

          if (currentRating.userVote === voteType) {
            newVote = null;
            if (voteType === 'up') newUp -= 1;
            if (voteType === 'down') newDown -= 1;
          } else {
            if (voteType === 'up') {
              newUp += 1;
              if (currentRating.userVote === 'down') newDown -= 1;
            } else {
              newDown += 1;
              if (currentRating.userVote === 'up') newUp -= 1;
            }
          }

          return {
            ...item,
            rating: {
              ...currentRating,
              thumbsUp: Math.max(0, newUp),
              thumbsDown: Math.max(0, newDown),
              userVote: newVote,
            },
          };
        }
        return item;
      })
    );
  };

  // Bookmark toggle
  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const isSaved = prev.includes(id);
      const next = isSaved ? prev.filter((i) => i !== id) : [...prev, id];
      try {
        localStorage.setItem('fanhub_bookmarked_media', JSON.stringify(next));
      } catch {}
      setRatingToast(isSaved ? 'REMOVED FROM SAVED ARCHIVES' : `★ SAVED "${activeMedia.title.slice(0, 24)}..." TO BOOKMARKS`);
      setTimeout(() => setRatingToast(null), 3000);
      return next;
    });
  };

  // Share Link Handler
  const handleShare = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/multimedia?id=${activeMedia.id}` : '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setShareToast('ARCHIVE URL COPIED TO CLIPBOARD');
    setTimeout(() => setShareToast(null), 2500);
  };

  // Add Live Chat comment
  const handleSendLiveComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;

    let username = 'YOU (Fan Verified) ⭐';
    try {
      const storedUser = localStorage.getItem('fanhub_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.name) username = `${parsed.name} ⭐`;
      }
    } catch {}

    const newMsg: LiveChatMessage = {
      id: `chat-${Date.now()}`,
      user: username,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      badge: 'VERIFIED FAN',
      badgeColor: '#ffd60a',
      message: newChatMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setLiveChatList((prev) => [...prev, newMsg]);
    setNewChatMessage('');
  };

  // Trigger floating reaction animation
  const triggerReaction = (text: string) => {
    const reactionId = nextReactionId.current++;
    const randomX = Math.floor(Math.random() * 60) + 20;

    setFloatingReactions((prev) => [...prev, { id: reactionId, text, x: randomX }]);

    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== reactionId));
    }, 1800);
  };

  // Chapter Jump Handler
  const handleSelectChapter = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      if (!isPlayingAudio) toggleAudioPlay();
    }
  };

  // Filtered & Sorted Media items
  const filteredMediaList = useMemo(() => {
    return mediaList
      .filter((item) => {
        if (selectedFormat !== 'all' && item.type !== selectedFormat) return false;
        if (selectedUniverse !== 'all') {
          const matchCat =
            item.category === selectedUniverse ||
            (selectedUniverse === 'Cinema' && item.category === 'Movies') ||
            (selectedUniverse === 'Movies' && item.category === 'Cinema');
          if (!matchCat) return false;
        }
        if (selectedArtist) {
          const q = selectedArtist.toLowerCase();
          const matchArtist = item.artist.toLowerCase().includes(q);
          const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
          const matchTitle = item.title.toLowerCase().includes(q);
          if (!matchArtist && !matchTags && !matchTitle) return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchArtist = item.artist.toLowerCase().includes(q);
          const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchArtist && !matchTags) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'views') return b.views - a.views;
        if (sortBy === 'rating') return b.rating.average - a.rating.average;
        if (sortBy === 'duration') return b.durationSeconds - a.durationSeconds;
        return 0;
      });
  }, [mediaList, selectedFormat, selectedUniverse, selectedArtist, searchQuery, sortBy]);

  // Format Helper Labels
  const getFormatLabel = (type: MediaType) => {
    switch (type) {
      case 'trailer': return 'TRAILER // MV';
      case 'video': return 'EPISODE // BEHIND';
      case 'podcast': return 'AUDIO // PODCAST';
      case 'livestream': return 'BROADCAST // LIVE';
      case 'soundtrack': return 'ORIGINAL OST';
    }
  };

  return (
    <section 
      id="multimedia" 
      style={{
        paddingTop: '80px',
        paddingBottom: '96px',
      }}
      className={`relative w-full transition-colors duration-200 border-b-4 border-black ${
        isCinemaMode ? 'bg-[#000000] text-white' : 'bg-[#fdfbf7] text-black'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex flex-col gap-14 sm:gap-20">
        
        {/* ========================================================= */}
        {/* 1. EDITORIAL HEADER & CINEMA CONTROLLER                   */}
        {/* ========================================================= */}
        <MultimediaHeader
          isCinemaMode={isCinemaMode}
          onToggleCinemaMode={() => setIsCinemaMode(!isCinemaMode)}
          totalMediaCount={mediaList.length}
        />

        {/* ========================================================= */}
        {/* 2. MASTER PLAYER DECK                                     */}
        {/* ========================================================= */}
        <div 
          style={{ borderRadius: '0px' }}
          className={`border-3 overflow-hidden shadow-[6px_6px_0px_#000000] transition-colors duration-200 ${
            isCinemaMode ? 'bg-[#0a0a0a] border-neutral-800' : 'bg-white border-black'
          }`}
        >
          {/* Deck Body */}
          {activeMedia.type === 'trailer' || activeMedia.type === 'video' ? (
            <MultimediaPlayerDeck
              activeMedia={activeMedia}
              isCinemaMode={isCinemaMode}
              onSelectChapter={handleSelectChapter}
              getFormatLabel={getFormatLabel}
            />
          ) : activeMedia.type === 'livestream' ? (
            <MultimediaLiveChat
              activeMedia={activeMedia}
              isCinemaMode={isCinemaMode}
              liveChatList={liveChatList}
              newChatMessage={newChatMessage}
              floatingReactions={floatingReactions}
              onNewChatMessageChange={setNewChatMessage}
              onSendChatMessage={handleSendLiveComment}
              onTriggerReaction={triggerReaction}
            />
          ) : (
            <MultimediaAudioDeck
              activeMedia={activeMedia}
              isPlayingAudio={isPlayingAudio}
              audioProgress={audioProgress}
              audioSpeed={audioSpeed}
              isMuted={isMuted}
              audioRef={audioRef}
              toggleAudioPlay={toggleAudioPlay}
              handleAudioSeek={handleAudioSeek}
              handleSkipTime={handleSkipTime}
              handleChangePlaybackSpeed={handleChangePlaybackSpeed}
              toggleMute={toggleMute}
            />
          )}

          {/* Dock Bottom Rating & Action Panel */}
          <MultimediaRatingPanel
            activeMedia={activeMedia}
            isCinemaMode={isCinemaMode}
            hoverRating={hoverRating}
            showRatingBreakdown={showRatingBreakdown}
            isBookmarked={bookmarkedIds.includes(activeMedia.id)}
            onRateMedia={handleRateMedia}
            onHoverRatingChange={setHoverRating}
            onToggleBreakdown={() => setShowRatingBreakdown(!showRatingBreakdown)}
            onVoteThumbs={handleVoteThumbs}
            onToggleBookmark={() => toggleBookmark(activeMedia.id)}
            onShare={handleShare}
          />
        </div>

        {/* ========================================================= */}
        {/* 3. MULTIMEDIA FILTER TOOLBAR                              */}
        {/* ========================================================= */}
        <div className="pt-8 sm:pt-12">
          <MultimediaFilterBar
            selectedFormat={selectedFormat}
            selectedUniverse={selectedUniverse}
            selectedArtist={selectedArtist}
            searchQuery={searchQuery}
            sortBy={sortBy}
            mediaList={mediaList}
            onSelectFormat={setSelectedFormat}
            onSelectUniverse={handleSelectUniverse}
            onSelectArtist={handleSelectArtist}
            onSearchChange={setSearchQuery}
            onSortChange={setSortBy}
          />
        </div>

        {/* ========================================================= */}
        {/* 4. MEDIA GALLERY GRID                                     */}
        {/* ========================================================= */}
        <div className="pt-8 sm:pt-12">
          <MultimediaCardGrid
            filteredMediaList={filteredMediaList}
            activeMediaId={activeMedia.id}
            onSelectMedia={(id) => {
              setActiveMediaId(id);
              const mediaSection = document.getElementById('multimedia');
              if (mediaSection && window.scrollY > mediaSection.offsetTop + 400) {
                mediaSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            onResetFilters={() => {
              setSelectedFormat('all');
              setSelectedUniverse('all');
              setSelectedArtist('');
              setSelectedArtistLabel('');
              setSearchQuery('');
            }}
            getFormatLabel={getFormatLabel}
          />
        </div>

        {/* ========================================================= */}
        {/* 5. PROTOCOL BANNER                                        */}
        {/* ========================================================= */}
        <div className="pt-10 sm:pt-14">
          <MultimediaProtocolBanner />
        </div>

      </div>

      {/* Floating Action Toasts */}
      {ratingToast && (
        <div 
          style={{ borderRadius: '0px' }}
          className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-[#ffd60a] text-black font-mono text-xs font-black border-3 border-black shadow-[4px_4px_0px_#000000]"
        >
          ★ {ratingToast}
        </div>
      )}

      {shareToast && (
        <div 
          style={{ borderRadius: '0px' }}
          className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-[#00f0ff] text-black font-mono text-xs font-black border-3 border-black shadow-[4px_4px_0px_#000000]"
        >
          ✓ {shareToast}
        </div>
      )}
    </section>
  );
};
