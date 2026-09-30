'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Post {
  id: number;
  user: string;
  avatar: string;
  time: string;
  content: string;
  image: string | null;
  likes: number;
  comments: number;
  tag: string;
  fandomBadge: string;
  badgeBg: string;
  badgeText: string;
  categories: string[];
  isLiked?: boolean;
}

const initialPosts: Post[] = [
  {
    id: 1,
    user: 'Bunnies_01',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    time: '2 hours ago',
    content: 'Just received my Get Up album! The holographic photo cards and typography are stunning. Check out this shimmer reflection!',
    image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=800',
    likes: 342,
    comments: 45,
    tag: '#NewJeans',
    fandomBadge: '★ BUNNIES VERIFIED',
    badgeBg: 'bg-[#d91470]',
    badgeText: 'text-white',
    categories: ['Trending', 'Fan Art', 'Following'],
  },
  {
    id: 2,
    user: 'Blink_Forever',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    time: '5 hours ago',
    content: 'Who else is ready for the world tour? I already secured my VIP stadium admission pass for the Hanoi stadium soundcheck!',
    image: null,
    likes: 890,
    comments: 120,
    tag: '#BLACKPINK',
    fandomBadge: '✦ BLINK VIP PASSHOLDER',
    badgeBg: 'bg-[#ffd60a]',
    badgeText: 'text-black',
    categories: ['Trending', 'Discussions', 'Following'],
  },
  {
    id: 3,
    user: 'Stay_Max',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    time: '1 day ago',
    content: 'My fanart for the 5-STAR era! Took 15 hours of architectural line drafting and neon cyber shading. Hope you guys like it.',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800',
    likes: 1205,
    comments: 88,
    tag: '#StrayKids',
    fandomBadge: '⚡ STAY ARTIST',
    badgeBg: 'bg-[#00f0ff]',
    badgeText: 'text-black',
    categories: ['Trending', 'Fan Art'],
  },
  {
    id: 4,
    user: 'Army_007',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    time: '2 days ago',
    content: "Stream PROOF! Let's break the streaming record today. We are almost at the global chart goal for the certified milestone.",
    image: null,
    likes: 5430,
    comments: 320,
    tag: '#BTS',
    fandomBadge: '✪ ARMY GLOBAL LEAD',
    badgeBg: 'bg-[#c084fc]',
    badgeText: 'text-black',
    categories: ['Trending', 'Discussions', 'Following'],
  }
];

export const FanCommunityFeed: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Trending');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPostText, setNewPostText] = useState('');
  const [selectedTag, setSelectedTag] = useState('#NewJeans');
  const [attachImage, setAttachImage] = useState(false);
  const [copiedPostId, setCopiedPostId] = useState<number | null>(null);

  const tabs = [
    { id: 'Trending', label: '★ Trending', count: posts.filter(p => p.categories.includes('Trending')).length, color: 'bg-[#d91470]', textColor: 'text-white' },
    { id: 'Following', label: '✦ Following', count: posts.filter(p => p.categories.includes('Following')).length, color: 'bg-[#00f0ff]', textColor: 'text-black' },
    { id: 'Fan Art', label: '⚡ Fan Art', count: posts.filter(p => p.categories.includes('Fan Art')).length, color: 'bg-[#ffd60a]', textColor: 'text-black' },
    { id: 'Discussions', label: '✪ Discussions', count: posts.filter(p => p.categories.includes('Discussions')).length, color: 'bg-[#ccff00]', textColor: 'text-black' },
  ];

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'Trending') return true;
    return post.categories.includes(activeTab);
  });

  const handleLike = (postId: number) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likes: isLiked ? p.likes + 1 : p.likes - 1,
        };
      }
      return p;
    }));
  };

  const handleShare = (postId: number) => {
    setCopiedPostId(postId);
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: Post = {
      id: Date.now(),
      user: 'You',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      time: 'Just now',
      content: newPostText,
      image: attachImage ? 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800' : null,
      likes: 1,
      comments: 0,
      tag: selectedTag,
      fandomBadge: '★ YOU [VIP MEMBER]',
      badgeBg: 'bg-[#d91470]',
      badgeText: 'text-white',
      categories: ['Trending', 'Following', attachImage ? 'Fan Art' : 'Discussions'],
      isLiked: true,
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    setAttachImage(false);
  };

  return (
    <section 
      id="community" 
      style={{
        paddingTop: '80px',
        paddingBottom: '96px',
      }}
      className="w-full py-20 md:py-28 bg-[#fdfbf7] text-black border-b-4 border-black relative"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        {/* ==================== 1. Vibrant Y2K Header ==================== */}
        <div style={{ marginBottom: '48px' }} className="mb-12 sm:mb-16">
          {/* Eyebrow */}
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#d91470] border border-black animate-pulse" />
              <span className="font-mono text-xs font-black uppercase tracking-widest text-[#be185d] bg-[#fdf2f8] px-2.5 py-1 border border-black shadow-[2px_2px_0px_#000]">
                SECTION 07 // GLOBAL COMMUNITY LORE &amp; FANDOM WIRE
              </span>
            </div>

            <div className="font-mono text-xs bg-[#00f0ff] text-black border-2 border-black px-3.5 py-1.5 uppercase font-black shadow-[3px_3px_0px_#000] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
              <span>14.8K GLOBAL FANS ACTIVE NOW</span>
            </div>
          </div>

          {/* Heading Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b-4 border-black gap-6">
            <div>
              <div className="inline-block bg-[#ffd60a] border-2 border-black px-3 py-1 font-mono text-xs font-black uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#000]">
                ✦ 24/7 FANDOM BUZZ &amp; FAN ART DISPATCH
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-black leading-tight tracking-tight">
                Fan Community &amp;{' '}
                <em className="font-serif italic font-normal text-[#d91470] drop-shadow-[1px_1px_0px_#000000]">
                  Lore Wire
                </em>
              </h2>
              <p className="font-sans font-semibold text-xs sm:text-sm text-neutral-700 max-w-xl mt-3 leading-relaxed">
                Connect, share high-res fan art, analyze comeback theories, and exchange verified tour experiences with fandom members worldwide.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    type="button"
                    style={{ borderRadius: '0px' }}
                    className={`px-4 py-2.5 font-black uppercase tracking-wider cursor-pointer transition-all border-2 border-black ${
                      isActive 
                        ? `${tab.color} ${tab.textColor || 'text-black'} shadow-[4px_4px_0px_#000000] -translate-y-0.5` 
                        : 'bg-white text-black shadow-[2px_2px_0px_#000000] hover:bg-[#fff9db] hover:shadow-[3px_3px_0px_#000000]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="ml-2 bg-black text-white px-1.5 py-0.5 text-[10px] font-mono">
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ==================== 2. Interactive Post Composer ==================== */}
        <div 
          style={{ borderRadius: '0px', marginTop: '48px', marginBottom: '48px' }}
          className="max-w-4xl mx-auto mt-10 sm:mt-14 mb-12 sm:mb-16 bg-white border-3 border-black overflow-hidden font-mono text-xs shadow-[6px_6px_0px_#000000]"
        >
          {/* Header Bar */}
          <div className="p-3.5 border-b-2 border-black bg-[#ffd60a] flex items-center justify-between flex-wrap gap-2">
            <span className="font-black uppercase tracking-widest text-black flex items-center gap-2">
              <span className="text-base">⚡</span> DISPATCH TO GLOBAL FANDOM WIRE
            </span>
            
            {/* Tag Selection Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['#NewJeans', '#BLACKPINK', '#StrayKids', '#BTS', '#aespa'].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  style={{ borderRadius: '0px' }}
                  className={`px-2.5 py-1 text-[11px] font-black uppercase cursor-pointer border-2 border-black transition-all ${
                    selectedTag === tag 
                      ? 'bg-[#d91470] text-white shadow-[2px_2px_0px_#000] -translate-y-0.5' 
                      : 'bg-white text-black hover:bg-[#ecfeff]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Composer Body */}
          <form onSubmit={handleCreatePost} className="p-6 bg-white">
            <div className="flex items-start gap-4">
              <div 
                style={{ borderRadius: '0px' }}
                className="relative w-12 h-12 border-2 border-black overflow-hidden shrink-0 bg-[#ecfeff] shadow-[2px_2px_0px_#000]"
              >
                <Image 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                  alt="You" 
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <textarea 
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  aria-label="Compose a fan community dispatch"
                  placeholder="COMPOSE LOG OR THEORETICAL ANALYSIS (DROP YOUR FAN THEORIES HERE)..."
                  rows={3}
                  style={{ borderRadius: '0px' }}
                  className="w-full bg-[#fdfbf7] p-3 border-2 border-black outline-none text-xs font-mono uppercase resize-none leading-relaxed focus:bg-white focus:border-[#ff2e93] transition-colors"
                />

                {attachImage && (
                  <div 
                    style={{ borderRadius: '0px' }}
                    className="mt-2 p-2.5 bg-[#ecfeff] border-2 border-black flex items-center justify-between text-[11px] font-bold"
                  >
                    <span className="text-black">★ IMAGE ATTACHED // Y2K CONCERT ARTIFACT LOADED</span>
                    <button 
                      type="button" 
                      onClick={() => setAttachImage(false)}
                      className="font-black text-[#d91470] underline hover:no-underline cursor-pointer"
                    >
                      [REMOVE ✕]
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Composer Footer Actions */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t-2 border-black font-mono">
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => setAttachImage(!attachImage)}
                  style={{ borderRadius: '0px' }}
                  className="px-3.5 py-2 bg-[#00f0ff] hover:bg-[#38bdf8] text-black border-2 border-black font-black uppercase tracking-wider text-[11px] cursor-pointer shadow-[2px_2px_0px_#000] active:translate-y-0.5"
                >
                  {attachImage ? '★ PHOTO ATTACHED' : '+ ATTACH PHOTO'}
                </button>
                <span className="text-neutral-600 font-bold text-[11px]">
                  {newPostText.length}/280 CHARS
                </span>
              </div>

              <button 
                type="submit"
                disabled={!newPostText.trim()}
                style={{ borderRadius: '0px' }}
                className="px-6 py-2.5 bg-[#d91470] text-white hover:bg-[#be185d] disabled:opacity-40 border-2 border-black text-xs font-black uppercase tracking-widest cursor-pointer shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                [DISPATCH TO FEED →]
              </button>
            </div>
          </form>
        </div>

        {/* ==================== 3. Feed Grid (Vibrant Y2K Cards) ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {filteredPosts.map((post) => {
            const hasImage = Boolean(post.image);

            return (
              <div 
                key={post.id}
                style={{ borderRadius: '0px' }}
                className="bg-white border-3 border-black flex flex-col justify-between shadow-[5px_5px_0px_#000000] hover:shadow-[7px_7px_0px_#ff2e93] transition-all duration-200"
              >
                {/* Card Top Header */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        style={{ borderRadius: '0px' }}
                        className="relative w-12 h-12 border-2 border-black bg-[#ffd60a] overflow-hidden shrink-0 shadow-[2px_2px_0px_#000]"
                      >
                        <Image 
                          src={post.avatar} 
                          alt={post.user} 
                          fill
                          sizes="48px"
                          className="object-cover" 
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="font-black text-sm text-black">
                            {post.user}
                          </span>
                          <span className="bg-[#ccff00] text-black border border-black font-black text-[9px] px-1.5 py-0.2 shadow-[1px_1px_0px_#000]">
                            VERIFIED
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-600 mt-1">
                          <span>{post.time}</span>
                          <span>•</span>
                          <span className={`${post.badgeBg} ${post.badgeText} border border-black px-1.5 py-0.2 font-black uppercase text-[9px] shadow-[1px_1px_0px_#000]`}>
                            {post.fandomBadge}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={() => handleShare(post.id)}
                      style={{ borderRadius: '0px' }}
                      className="px-2.5 py-1 border-2 border-black bg-[#ecfeff] hover:bg-[#00f0ff] font-mono text-[10px] font-black uppercase cursor-pointer shadow-[2px_2px_0px_#000] transition-colors"
                    >
                      {copiedPostId === post.id ? '★ COPIED' : 'SHARE'}
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <p className={`font-sans font-medium text-sm leading-relaxed text-black bg-[#fdfbf7] p-3 border-l-4 border-[#d91470]`}>
                      &ldquo;{post.content}&rdquo;
                    </p>
                  </div>

                  {/* Post Image Preview - FULL VIVID COLOR */}
                  {post.image && (
                    <div 
                      style={{ borderRadius: '0px' }}
                      className="relative w-full h-64 border-2 border-black overflow-hidden bg-neutral-100 shadow-[3px_3px_0px_#000]"
                    >
                      <Image 
                        src={post.image} 
                        alt="Fan Content" 
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 bg-black text-[#ffd60a] border border-black font-mono text-[9px] font-black px-2 py-0.5 uppercase shadow-[1px_1px_0px_#000]">
                        ★ ORIGINAL FANWORK
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Bottom Meta & Interactive Stats */}
                <div className="p-4 px-6 border-t-2 border-black bg-[#fff9db] flex items-center justify-between font-mono text-xs flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={() => handleLike(post.id)}
                      style={{ borderRadius: '0px' }}
                      className={`px-3 py-1.5 border-2 border-black font-black uppercase tracking-wider text-[11px] cursor-pointer shadow-[2px_2px_0px_#000] transition-all active:translate-y-0.5 ${
                        post.isLiked 
                          ? 'bg-[#d91470] text-white' 
                          : 'bg-white text-black hover:bg-[#ffd60a]'
                      }`}
                    >
                      {post.isLiked ? `★ UPVOTED // ${post.likes}` : `♥ UPVOTE // ${post.likes}`}
                    </button>

                    <button 
                      type="button"
                      style={{ borderRadius: '0px' }}
                      className="px-3 py-1.5 border-2 border-black bg-white hover:bg-[#00f0ff] font-black uppercase tracking-wider text-[11px] cursor-pointer shadow-[2px_2px_0px_#000] active:translate-y-0.5 transition-colors"
                    >
                      💬 DISCUSS // {post.comments}
                    </button>
                  </div>

                  <span 
                    style={{ borderRadius: '0px' }}
                    className="border-2 border-black px-2.5 py-1 text-[11px] font-black uppercase tracking-wider bg-[#00f0ff] text-black shadow-[2px_2px_0px_#000]"
                  >
                    {post.tag}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

