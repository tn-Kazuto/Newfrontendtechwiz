export type MediaType = 'trailer' | 'video' | 'podcast' | 'livestream' | 'soundtrack';
export type FandomCategory = 'K-Pop' | 'V-Pop' | 'Anime' | 'Gaming' | 'Cinema' | 'Manga' | 'Cosplay' | 'Comics' | 'TV Shows' | 'Movies';

export interface LiveChatMessage {
  id: string;
  user: string;
  avatar: string;
  badge?: string;
  badgeColor?: string;
  message: string;
  timestamp: string;
}

export interface ChapterMark {
  time: string;
  seconds: number;
  title: string;
}

export interface MediaRating {
  average: number;
  count: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  thumbsUp: number;
  thumbsDown: number;
  userRating?: number | null;
  userVote?: 'up' | 'down' | null;
}

export interface MediaItem {
  id: string;
  title: string;
  subtitle?: string;
  artist: string;
  agency?: string;
  type: MediaType;
  category: FandomCategory;
  thumbnailUrl: string;
  embedUrl?: string; // YouTube embed or custom video stream
  audioUrl?: string; // Audio track preview
  duration: string;
  durationSeconds: number;
  views: number;
  releaseDate: string;
  description: string;
  rating: MediaRating;
  isLive?: boolean;
  liveViewers?: number;
  liveStatusText?: string;
  chatMessages?: LiveChatMessage[];
  chapters?: ChapterMark[];
  tags: string[];
  qualityBadge?: string;
  soundtrackMeta?: {
    albumName: string;
    trackNumber: number;
    totalTracks: number;
    bitrate: string;
    composer?: string;
    lyricsSnippet?: string;
  };
  podcastMeta?: {
    host: string;
    season: number;
    episode: number;
    topics: string[];
  };
  trailerMeta?: {
    premiereDate?: string;
    productionStudio: string;
    aspectRatio: string;
  };
}

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  // 1. LIVESTREAM: SEVENTEEN & BTS Live Concert World Tour Broadcast
  {
    id: 'media-live-1',
    title: '🔴 [LIVE NOW] SEVENTEEN World Tour [RIGHT HERE] — 4K GLOBAL STAGE BROADCAST',
    subtitle: 'Broadcasting live from Goyang Stadium • Multi-View 4K 60FPS • Zero Latency Audio',
    artist: 'SEVENTEEN (세븐틴)',
    agency: 'PLEDIS Entertainment / HYBE Labels',
    type: 'livestream',
    category: 'K-Pop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/gdZLi9oWNZg?autoplay=1&mute=0',
    duration: 'LIVE NOW',
    durationSeconds: 9999,
    views: 894500,
    releaseDate: 'TODAY // LIVE BROADCAST',
    description: 'Opening kickoff stadium concert for the SEVENTEEN World Tour with all 13 members in front of 55,000 live attendees. Real-time Dolby Atmos soundstage, Bluetooth Caratbong lightstick syncing, zero-latency multi-cam angles, and global fan teletext chat.',
    qualityBadge: '4K LIVE • 60 FPS • DOLBY ATMOS',
    isLive: true,
    liveViewers: 86450,
    liveStatusText: '86,450 CARATs tuning in live worldwide right now',
    rating: {
      average: 5.0,
      count: 48100,
      distribution: {
        5: 96,
        4: 3,
        3: 1,
        2: 0,
        1: 0,
      },
      thumbsUp: 680000,
      thumbsDown: 420,
    },
    chatMessages: [
      { id: 'c1', user: 'MinGyu_Stan_VN 💎', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80', badge: 'CARAT VIP', badgeColor: '#f43f5e', message: 'The sound system is insane! Mingyu visual is out of this world 🔥🔥🔥', timestamp: '10:14' },
      { id: 'c2', user: 'Seoul_Vibe_Hoshi 🐯', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', badge: 'TIGER HORANGI', badgeColor: '#f59e0b', message: 'HORANGHAE!! The Super choreography is completely unreal! ⚡⚡', timestamp: '10:15' },
      { id: 'c3', user: 'MaiAnh_KpopFan 💖', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80', badge: 'TOP FAN', badgeColor: '#10b981', message: 'Hanoi fans are cheering so loud! Anyone going to Bangkok concert in Dec?', timestamp: '10:15' },
      { id: 'c4', user: 'Joshua_Guitar_Hero ⭐', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80', badge: 'SUPER CHAT $20', badgeColor: '#6366f1', message: 'Sending love from Vietnam to all 13 members! Stay healthy and safe! ❤️', timestamp: '10:16' },
      { id: 'c5', user: 'TokyoCARAT_Momo 🇯🇵', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', badge: 'VERIFIED', badgeColor: '#ec4899', message: 'The 4K 60FPS stream quality is crisp like being in VIP row 1!! 🌟', timestamp: '10:16' },
      { id: 'c6', user: 'Wonwoo_CatClub 🐱', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80', badge: 'MEMBER', badgeColor: '#8b5cf6', message: 'Just tipped 50,000 coins lightstick to the stage! Let’s get it! 🚀✨', timestamp: '10:17' }
    ],
    tags: ['SEVENTEEN', 'RIGHT HERE', 'Livestream', 'Concert 4K', 'CARAT', 'Live Stage', 'WEBSOCKET_CHAT']
  },

  // 2. TRAILER: NewJeans - Supernatural Official MV
  {
    id: 'media-trailer-1',
    title: "NewJeans (뉴진스) 'Supernatural' Official Comeback MV",
    subtitle: 'Official Comeback Music Video & Visual Teaser',
    artist: 'NewJeans',
    agency: 'ADOR / HYBE Labels',
    type: 'trailer',
    category: 'K-Pop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/ZncbtRo7RXs?autoplay=1&mute=0',
    duration: '03:42',
    durationSeconds: 222,
    views: 18450200,
    releaseDate: '24/06/2024',
    description: "NewJeans summer blockbuster collaboration with music icon Pharrell Williams, infusing nostalgic 90s New Jack Swing beats. Brilliant 4K HDR visuals with authentic retro Y2K aesthetic and energetic choreography.",
    qualityBadge: '4K ULTRA HD • DOLBY ATMOS',
    rating: {
      average: 4.9,
      count: 24890,
      distribution: {
        5: 86,
        4: 10,
        3: 3,
        2: 1,
        1: 0,
      },
      thumbsUp: 312000,
      thumbsDown: 1420,
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'Intro Y2K Nostalgia' },
      { time: '00:45', seconds: 45, title: 'Chorus Hook Dance' },
      { time: '01:50', seconds: 110, title: 'Pharrell Williams Sample' },
      { time: '02:40', seconds: 160, title: 'Special Dance Break' },
      { time: '03:20', seconds: 200, title: 'Outro Scene & Credits' }
    ],
    tags: ['NewJeans', 'Supernatural', 'K-Pop', 'MV 4K', 'ADOR', 'Pharrell Williams'],
    trailerMeta: {
      premiereDate: 'June 24, 2024',
      productionStudio: 'ADOR Visual Team & Shin Woo-seok',
      aspectRatio: '16:9 DCI 4K'
    }
  },

  // 3. VIDEO: Say Hi All-Stars - Grand Finale Stage & Backstage Fancam 4K
  {
    id: 'media-video-1',
    title: 'Say Hi All-Stars Finale: Stage Performance & Behind-The-Scenes 4K',
    subtitle: 'Special Episode: Full Performance, Multi-angle Dance & Behind The Stage',
    artist: 'HIEUTHUHAI, Anh Tu Atus, JSOL, Erik, Quang Hung MasterD',
    agency: 'VieON / Vie Channel',
    type: 'video',
    category: 'V-Pop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/hT_nvWreIhg?autoplay=1&mute=0',
    duration: '28:15',
    durationSeconds: 1695,
    views: 8940000,
    releaseDate: '15/09/2024',
    description: 'Explosive live stage performance from Say Hi All-Stars with emotional and funny backstage moments at the monumental 25,000-seat stadium concert.',
    qualityBadge: 'FULL HD 1080P60',
    rating: {
      average: 4.8,
      count: 18760,
      distribution: {
        5: 82,
        4: 13,
        3: 3,
        2: 1,
        1: 1,
      },
      thumbsUp: 285000,
      thumbsDown: 3100,
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'Backstage choreography rehearsal' },
      { time: '06:12', seconds: 372, title: 'Exclusive backstage artist interview' },
      { time: '12:45', seconds: 765, title: 'Live Stage: Brand new audio mix' },
      { time: '21:30', seconds: 1290, title: 'Trophy ceremony & grand finale' }
    ],
    tags: ['Say Hi All-Stars', 'HIEUTHUHAI', 'V-Pop', 'Concert 2024', 'Fancam 4K']
  },

  // 4. PODCAST: Daebak Show w/ Eric Nam & aespa Karina
  {
    id: 'media-podcast-1',
    title: 'Daebak Show Ep. 165: aespa Karina & Winter on "Whiplash" & Cyberpunk Tour',
    subtitle: 'Fandom Audio Talkshow • Exclusive in-depth interview on music and creative drive',
    artist: 'Eric Nam ft. Karina & Winter (aespa)',
    agency: 'DIVE Studios',
    type: 'podcast',
    category: 'K-Pop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    embedUrl: 'https://www.youtube-nocookie.com/embed/jWQx2f-CErU?autoplay=1&mute=0',
    duration: '45:20',
    durationSeconds: 2720,
    views: 1250000,
    releaseDate: '02/10/2024',
    description: 'Special podcast episode featuring Karina & Winter sharing unreleased stories: vocal training for the Cyberpunk "Whiplash" concept, dorm life, and appreciation for global MYs.',
    qualityBadge: 'HI-RES PODCAST • STEREO MASTER',
    rating: {
      average: 4.9,
      count: 9840,
      distribution: {
        5: 89,
        4: 8,
        3: 2,
        2: 1,
        1: 0,
      },
      thumbsUp: 142000,
      thumbsDown: 640,
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'Welcoming Karina & Winter to DIVE Studio' },
      { time: '08:30', seconds: 510, title: 'The origin of the Cyberpunk concept in Whiplash' },
      { time: '22:15', seconds: 1335, title: 'Favorite food habits & trainee day memories' },
      { time: '37:40', seconds: 2260, title: 'Special heartfelt message to global MY fandom' }
    ],
    podcastMeta: {
      host: 'Eric Nam',
      season: 4,
      episode: 165,
      topics: ['K-Pop Life', 'aespa Comeback', 'Mental Health in Idol Life', 'Future Tours']
    },
    tags: ['Podcast', 'aespa', 'Karina', 'Winter', 'Eric Nam', 'DIVE Studios']
  },

  // 5. SOUNDTRACK: Queen of Tears OST - BSS (SEVENTEEN)
  {
    id: 'media-ost-1',
    title: 'Queen of Tears OST: "The Reasons of My Smiles" (자꾸만 웃게 돼) - BSS (SEVENTEEN)',
    subtitle: 'Official Original Soundtrack • Lossless 24-bit / 96kHz Hi-Res Studio Master',
    artist: 'BSS (Seungkwan, DK, Hoshi - SEVENTEEN)',
    agency: 'Studio Dragon / Genie Music',
    type: 'soundtrack',
    category: 'Cinema',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    embedUrl: 'https://www.youtube-nocookie.com/embed/kXpLzU9_kQ4?autoplay=1&mute=0',
    duration: '03:34',
    durationSeconds: 214,
    views: 34200000,
    releaseDate: '10/03/2024',
    description: 'The pan-Asian hit soundtrack from record-shattering television drama "Queen of Tears". Heartwarming vocals by SEVENTEEN subunit BSS delivering deep emotional resonance.',
    qualityBadge: 'FLAC 24-BIT / 96KHZ LOSSLESS',
    rating: {
      average: 5.0,
      count: 36500,
      distribution: {
        5: 95,
        4: 4,
        3: 1,
        2: 0,
        1: 0,
      },
      thumbsUp: 720000,
      thumbsDown: 1100,
    },
    soundtrackMeta: {
      albumName: 'Queen of Tears (Original Television Soundtrack) Pt.1',
      trackNumber: 1,
      totalTracks: 12,
      bitrate: 'FLAC 24-bit / 96kHz Lossless Studio Master',
      composer: 'Nam Hye-seung, Kim Kyung-hee',
      lyricsSnippet: 'Even through stormy rain and wind, your smile remains the only reason I want to return home...'
    },
    tags: ['Soundtrack', 'Queen of Tears', 'BSS', 'SEVENTEEN', 'K-Drama OST', 'Lossless']
  },

  // 6. TRAILER: Demon Slayer: Kimetsu no Yaiba - Infinity Castle Arc Movie Trilogy
  {
    id: 'media-trailer-2',
    title: 'Demon Slayer: Kimetsu no Yaiba "Infinity Castle" - Official 4K Movie Trailer',
    subtitle: 'Blockbuster movie trailer for the Infinity Castle Trilogy • Ufotable',
    artist: 'Ufotable & Aniplex',
    agency: 'Ufotable Animation Studio',
    type: 'trailer',
    category: 'Anime',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/f9X6GkHnS9E?autoplay=1&mute=0',
    duration: '02:48',
    durationSeconds: 168,
    views: 42100000,
    releaseDate: '2024/2025',
    description: 'Official theatrical trailer for the Infinity Castle arc: the final climactic war between the Demon Slayer Corps Hashira and Demon King Muzan Kibutsuji. Breathtaking 3D CGI visuals by Ufotable.',
    qualityBadge: 'IMAX CINEMA 4K HDR',
    rating: {
      average: 5.0,
      count: 51200,
      distribution: {
        5: 96,
        4: 3,
        3: 1,
        2: 0,
        1: 0,
      },
      thumbsUp: 1250000,
      thumbsDown: 2300,
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'The doors of the Infinity Castle unfold' },
      { time: '00:52', seconds: 52, title: 'The Hashira assemble: Giyu, Sanemi, Gyomei' },
      { time: '01:45', seconds: 105, title: 'Upper Rank One Kokushibo appears' },
      { time: '02:20', seconds: 140, title: 'Tanjiro & Sun Breathing awakening' }
    ],
    tags: ['Demon Slayer', 'Kimetsu no Yaiba', 'Anime', 'Trailer 4K', 'Ufotable', 'Infinity Castle'],
    trailerMeta: {
      premiereDate: '2025 (Worldwide Theatrical Release)',
      productionStudio: 'Ufotable & Shueisha',
      aspectRatio: '2.39:1 CinemaScope'
    }
  },

  // 7. SOUNDTRACK: Solo Leveling OST - "Dark Aria" by Hiroyuki Sawano
  {
    id: 'media-ost-2',
    title: 'Solo Leveling Season 2 OST: "Dark Aria" (Arise Anthem) - Hiroyuki Sawano',
    subtitle: 'Transformation Anthem & Shadow Monarch theme • Full Symphony Orchestra',
    artist: 'Hiroyuki Sawano ft. XAI',
    agency: 'A-1 Pictures / Sony Music Japan',
    type: 'soundtrack',
    category: 'Anime',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    embedUrl: 'https://www.youtube-nocookie.com/embed/8t3X32_1YkU?autoplay=1&mute=0',
    duration: '04:12',
    durationSeconds: 252,
    views: 19800000,
    releaseDate: '05/01/2024',
    description: 'Monumental orchestral epic by master composer Hiroyuki Sawano. Brass fanfares, operatic choral chants, and thunderous drums accompanying the legendary "Arise" moment.',
    qualityBadge: 'HI-RES AUDIO 24-BIT DSD',
    rating: {
      average: 4.9,
      count: 27900,
      distribution: {
        5: 91,
        4: 7,
        3: 2,
        2: 0,
        1: 0,
      },
      thumbsUp: 490000,
      thumbsDown: 1800,
    },
    soundtrackMeta: {
      albumName: 'Solo Leveling Original Soundtrack Vol.1',
      trackNumber: 2,
      totalTracks: 18,
      bitrate: 'Lossless Hi-Res 24-bit / 192kHz',
      composer: 'Hiroyuki Sawano',
      lyricsSnippet: 'Rise from the shadows, claim the throne that was written in your blood...'
    },
    tags: ['Solo Leveling', 'Hiroyuki Sawano', 'Dark Aria', 'Anime OST', 'Arise']
  },

  // 8. LIVESTREAM: League of Legends Worlds Championship Fan Watchalong & Concert
  {
    id: 'media-live-2',
    title: '🔴 [LIVESTREAM] LoL World Championship 2024: Opening Ceremony & Fan Watch Party',
    subtitle: 'Live opening ceremony stage featuring Linkin Park & NewJeans',
    artist: 'Riot Games Music, Linkin Park, Faker & T1',
    agency: 'Riot Games',
    type: 'livestream',
    category: 'Gaming',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/C3GouGa0noM?autoplay=1&mute=1',
    duration: 'LIVE',
    durationSeconds: 0,
    views: 1250000,
    releaseDate: 'Today',
    description: 'Live broadcast of the premier esports spectacle at the O2 Arena in London. 3D holographic augmented stage and the anthem "Heavy Is The Crown".',
    qualityBadge: '4K ULTRA LOW LATENCY',
    isLive: true,
    liveViewers: 62400,
    liveStatusText: '62,400 gamers and fans watching live right now',
    rating: {
      average: 4.9,
      count: 38200,
      distribution: {
        5: 88,
        4: 9,
        3: 2,
        2: 1,
        1: 0,
      },
      thumbsUp: 810000,
      thumbsDown: 3500,
    },
    chatMessages: [
      { id: 'c11', user: 'Faker_God_VN', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80', badge: 'T1 FANDOM', badgeColor: '#ef4444', message: 'T1 Champions! The 5th trophy for the Unkillable Demon King Faker!', timestamp: '12:01' },
      { id: 'c12', user: 'LinkinPark_Soldier', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', badge: 'VIP SUB', badgeColor: '#3b82f6', message: 'Heavy is the Crown live is unbelievable!! Emily vocals are crazy good!', timestamp: '12:02' },
      { id: 'c13', user: 'Hanoi_Esports_Fan', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80', badge: 'TOP FAN', badgeColor: '#10b981', message: '4K live stream is crystal clear with zero buffering, amazing broadcast!', timestamp: '12:02' },
    ],
    tags: ['LMHT', 'Worlds 2024', 'Faker', 'T1', 'Linkin Park', 'Gaming']
  },

  // 9. VIDEO: BTS Run BTS! Special Episode - Telepathy Challenge
  {
    id: 'media-video-2',
    title: 'Run BTS! 2024 Special Edition: "Telepathy Challenge" (Full 1080p60)',
    subtitle: 'Exclusive episode with multi-language subtitles and member individual cams',
    artist: 'BTS (RM, Jin, SUGA, j-hope, Jimin, V, Jung Kook)',
    agency: 'BIGHIT MUSIC / HYBE',
    type: 'video',
    category: 'K-Pop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/gdZLi9oWNZg?autoplay=1&mute=0',
    duration: '34:10',
    durationSeconds: 2050,
    views: 29500000,
    releaseDate: '18/07/2024',
    description: 'Legendary BTS variety show episode where the 7 members must reunite at the same location purely guided by shared memories after a decade together. Filled with heartfelt humor.',
    qualityBadge: 'FULL HD 1080P60 • MULTI-SUB',
    rating: {
      average: 5.0,
      count: 68900,
      distribution: {
        5: 97,
        4: 2,
        3: 1,
        2: 0,
        1: 0,
      },
      thumbsUp: 1450000,
      thumbsDown: 1200,
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'Intro & Telepathy Game Rules' },
      { time: '08:15', seconds: 495, title: 'The memory site linked to 2013 debut day' },
      { time: '18:40', seconds: 1120, title: 'Emotional reunion moment by the Han River' },
      { time: '29:10', seconds: 1750, title: 'BBQ dinner and heartfelt message to ARMY' }
    ],
    tags: ['BTS', 'Run BTS', 'ARMY', 'BIGHIT', 'K-Pop Show', 'Variety']
  },

  // 10. PODCAST: Fandom Radio Night - Late Night Stories With Fans
  {
    id: 'media-podcast-2',
    title: 'Fandom Radio Night #42: "A Decade of Fandom - First Concert Tickets & Cherished Memories"',
    subtitle: 'Late night fandom radio talk with Host Minh Anh & Listener letters',
    artist: 'Minh Anh & Fandom Community Guests',
    agency: 'FanHub Global Studios',
    type: 'podcast',
    category: 'V-Pop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    embedUrl: 'https://www.youtube-nocookie.com/embed/5NV6Rdv1a3I?autoplay=1&mute=0',
    duration: '52:10',
    durationSeconds: 3130,
    views: 450000,
    releaseDate: '12/10/2024',
    description: 'Reflective late-night podcast dedicated to global fandom stories. Looking back on growing up with idols, overnight ticket camping, and the joy of live arena concerts.',
    qualityBadge: 'WARM ANALOG RADIO 320KBPS',
    rating: {
      average: 4.9,
      count: 5340,
      distribution: {
        5: 89,
        4: 8,
        3: 2,
        2: 1,
        1: 0,
      },
      thumbsUp: 76000,
      thumbsDown: 310,
    },
    podcastMeta: {
      host: 'Minh Anh (FanHub Community)',
      season: 2,
      episode: 42,
      topics: ['Concert Ticketing Stories', 'Fandom Culture in VN', 'Lightstick Memories', 'Growing Up With Idols']
    },
    tags: ['Podcast', 'Radio', 'Fandom Stories', 'Late Night', 'Concert Experience']
  },

  // 11. TRAILER: Black Myth: Wukong - Cinematic Story & Orchestral Trailer
  {
    id: 'media-trailer-3',
    title: 'Black Myth: Wukong - Official Cinematic Story Trailer & Folk Symphony 4K',
    subtitle: 'Action RPG Masterpiece inspired by Journey to the West • Game Science',
    artist: 'Game Science Music Ensemble',
    agency: 'Game Science',
    type: 'trailer',
    category: 'Gaming',
    thumbnailUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/pnSsgrjpC88?autoplay=1&mute=0',
    duration: '04:30',
    durationSeconds: 270,
    views: 31200000,
    releaseDate: '20/08/2024',
    description: 'Cinematic trailer featuring an 80-piece symphony orchestra with traditional pipa and war drums. Highlighting Eastern mythology rendered in state-of-the-art Unreal Engine 5.',
    qualityBadge: '4K RAY TRACING • DOLBY CINEMA',
    rating: {
      average: 5.0,
      count: 44200,
      distribution: {
        5: 95,
        4: 4,
        3: 1,
        2: 0,
        1: 0,
      },
      thumbsUp: 980000,
      thumbsDown: 1400,
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'Pipa melodies over Mount Huaguo' },
      { time: '01:15', seconds: 75, title: 'Confrontation with Elder Jinchi' },
      { time: '02:40', seconds: 160, title: 'Climactic orchestral crescendo' },
      { time: '03:50', seconds: 230, title: 'The golden staff awakes' }
    ],
    tags: ['Black Myth Wukong', 'Gaming', 'Trailer 4K', 'Unreal Engine 5', 'Orchestra']
  },

  // 12. SOUNDTRACK: Bruno Mars & Lady Gaga - "Die With A Smile" (Acoustic Vinyl Edition)
  {
    id: 'media-ost-3',
    title: 'Lady Gaga & Bruno Mars - "Die With A Smile" (Official Acoustic Vinyl Master)',
    subtitle: 'Acoustic Guitar & Vintage Grand Piano • 24-bit Studio Master Edition',
    artist: 'Lady Gaga & Bruno Mars',
    agency: 'Interscope / Atlantic Records',
    type: 'soundtrack',
    category: 'Cinema',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    embedUrl: 'https://www.youtube-nocookie.com/embed/kPa7bsKwL-8?autoplay=1&mute=0',
    duration: '04:11',
    durationSeconds: 251,
    views: 56000000,
    releaseDate: '16/08/2024',
    description: 'Timeless Billboard Hot 100 #1 ballad. Two legendary music icons uniting their powerhouse vocals with warm acoustic guitar and grand piano arrangements.',
    qualityBadge: 'VINYL MASTER 24-BIT / 96KHZ',
    rating: {
      average: 5.0,
      count: 73400,
      distribution: {
        5: 96,
        4: 3,
        3: 1,
        2: 0,
        1: 0,
      },
      thumbsUp: 1620000,
      thumbsDown: 1900,
    },
    soundtrackMeta: {
      albumName: 'Die With A Smile - Acoustic Studio Sessions',
      trackNumber: 1,
      totalTracks: 2,
      bitrate: 'Vinyl Master Hi-Res 24-bit',
      composer: 'Bruno Mars, Lady Gaga, Andrew Watt, D’Mile',
      lyricsSnippet: 'If the world was ending, I’d wanna be next to you...'
    },
    tags: ['Die With A Smile', 'Bruno Mars', 'Lady Gaga', 'Vinyl Master', 'Acoustic']
  },

  // 13. MANGA: Chainsaw Man Chapter 180 Motion Comic & Audio Drama
  {
    id: 'media-manga-1',
    title: 'Chainsaw Man Chapter 180: Official Motion Manga & Voice Drama Teaser',
    subtitle: 'Dynamic motion manga comic release • Shueisha & MAPPA',
    artist: 'Tatsuki Fujimoto / Shueisha',
    agency: 'Weekly Shonen Jump',
    type: 'trailer',
    category: 'Manga',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/f9X6GkHnS9E?autoplay=1&mute=0',
    duration: '03:15',
    durationSeconds: 195,
    views: 8900000,
    releaseDate: '2024-10-15',
    description: 'Special official motion comic presentation with dynamic ink transitions, screen screentone effects, and intense voiceover soundscape for the latest Chainsaw Man climax.',
    qualityBadge: '4K MOTION INK • 60FPS',
    rating: {
      average: 4.95,
      count: 14200,
      distribution: { 5: 92, 4: 6, 3: 2, 2: 0, 1: 0 },
      thumbsUp: 340000,
      thumbsDown: 850,
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'Denji in the ruined city' },
      { time: '01:10', seconds: 70, title: 'War Devil Yoru awakening' },
      { time: '02:30', seconds: 150, title: 'Black Chainsaw Man descent' }
    ],
    tags: ['Chainsaw Man', 'Manga', 'Motion Comic', 'Fujimoto', 'Shonen Jump']
  },

  // 14. MANGA SOUNDSTAGE: Berserk Memorial Audio Archive
  {
    id: 'media-manga-2',
    title: 'Berserk Memorial Vinyl Soundstage: "Guts" & "Forces" Symphonic Suite',
    subtitle: 'Susumu Hirasawa Memorial Compositions • Lossless 24-bit Vinyl Rip',
    artist: 'Susumu Hirasawa & Shiro Sagisu',
    agency: 'Hakusensha',
    type: 'soundtrack',
    category: 'Manga',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    embedUrl: 'https://www.youtube-nocookie.com/embed/8t3X32_1YkU?autoplay=1&mute=0',
    duration: '05:40',
    durationSeconds: 340,
    views: 12400000,
    releaseDate: '2024-05-20',
    description: 'Immortal tribute to the legendary dark fantasy magnum opus by Kentaro Miura. Haunting vocals, acoustic strings, and relentless marching rhythms.',
    qualityBadge: 'FLAC 24-BIT / 192KHZ',
    rating: {
      average: 5.0,
      count: 28900,
      distribution: { 5: 97, 4: 2, 3: 1, 2: 0, 1: 0 },
      thumbsUp: 620000,
      thumbsDown: 420,
    },
    soundtrackMeta: {
      albumName: 'Berserk Sound Chronicle Vinyl Suite',
      trackNumber: 1,
      totalTracks: 14,
      bitrate: '24-bit 192kHz Audiophile Master',
      composer: 'Susumu Hirasawa',
      lyricsSnippet: 'Tell me what you see, beyond the eternal sacrifice...'
    },
    tags: ['Berserk', 'Manga', 'Susumu Hirasawa', 'Guts Theme', 'Vinyl Master']
  },

  // 15. COSPLAY: World Cosplay Summit Nagoya 2024 Finals
  {
    id: 'media-cosplay-1',
    title: '🔴 World Cosplay Summit Nagoya 2024: Championship Stage & Grand Parade 4K',
    subtitle: 'Live broadcast from Nagoya Oasis 21 • 36 Country Champion Teams',
    artist: 'World Cosplay Summit Committee',
    agency: 'WCS Executive Office Japan',
    type: 'livestream',
    category: 'Cosplay',
    thumbnailUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/zSQ48zyWZrY?autoplay=1&mute=1',
    duration: 'LIVE',
    durationSeconds: 0,
    views: 1480000,
    releaseDate: 'Today',
    description: 'The premier worldwide craftsmanship and performance showdown featuring custom mechanical armor, LED-embedded wings, and championship stage acting.',
    qualityBadge: '4K BROADCAST 60FPS',
    isLive: true,
    liveViewers: 28900,
    liveStatusText: '28,900 cosplay artisans streaming live worldwide',
    rating: {
      average: 4.96,
      count: 19800,
      distribution: { 5: 93, 4: 5, 3: 2, 2: 0, 1: 0 },
      thumbsUp: 390000,
      thumbsDown: 610,
    },
    chatMessages: [
      { id: 'cc1', user: 'EvaArmorMaster_VN', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80', badge: 'PRO MAKER', badgeColor: '#3b82f6', message: 'The mechanical wings on Team Japan are insane! 3D printed servo joints!', timestamp: '14:20' },
      { id: 'cc2', user: 'Nagoya_Fan_Live', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', badge: 'WCS VIP', badgeColor: '#ec4899', message: 'Team Vietnam Monster Hunter armor details are top 3 for sure!! 🔥', timestamp: '14:21' }
    ],
    tags: ['Cosplay', 'WCS 2024', 'Nagoya', 'Craftsmanship', 'Stage Performance']
  },

  // 16. COMICS: Across The Spider-Verse Motion Masterclass & Score
  {
    id: 'media-comics-1',
    title: 'Spider-Man: Across The Spider-Verse - Comic Art Motion Masterclass & OST',
    subtitle: 'Pop-Art Halftone Animation & Daniel Pemberton Metro Synth Score',
    artist: 'Sony Pictures Animation & Daniel Pemberton',
    agency: 'Marvel Comics / Sony Pictures',
    type: 'video',
    category: 'Comics',
    thumbnailUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/hT_nvWreIhg?autoplay=1&mute=0',
    duration: '18:40',
    durationSeconds: 1120,
    views: 22100000,
    releaseDate: '2024-03-12',
    description: 'Visual breakdown of the Ben-Day dots, comic ink line boiling, and the iconic orchestral synth breakdown for Miguel O’Hara’s Spider-Man 2099 theme.',
    qualityBadge: 'IMAX ENHANCED 4K',
    rating: {
      average: 4.98,
      count: 48900,
      distribution: { 5: 96, 4: 3, 3: 1, 2: 0, 1: 0 },
      thumbsUp: 1100000,
      thumbsDown: 1300,
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'Earth-65 Gwen Stacy watercolor style' },
      { time: '06:15', seconds: 375, title: 'Spider-Punk hand-cut zine animation' },
      { time: '12:30', seconds: 750, title: '2099 Synth Elephant sound breakdown' }
    ],
    tags: ['Spider-Verse', 'Comics', 'Pop-Art', 'Miles Morales', 'Daniel Pemberton']
  },

  // 17. TV SHOWS: Stranger Things 5 Hawkins Synth Lab
  {
    id: 'media-tv-1',
    title: 'Stranger Things Season 5: Hawkins Sound Lab & The Upside Down Synth Suite',
    subtitle: 'Behind The Scenes 4K • Kyle Dixon & Michael Stein Modular Synthesizer Demo',
    artist: 'SURVIVE (Kyle Dixon & Michael Stein)',
    agency: 'Netflix / Lakeshore Records',
    type: 'soundtrack',
    category: 'TV Shows',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    embedUrl: 'https://www.youtube-nocookie.com/embed/kPa7bsKwL-8?autoplay=1&mute=0',
    duration: '06:22',
    durationSeconds: 382,
    views: 15400000,
    releaseDate: '2024-09-01',
    description: 'Analog synth magic featuring vintage Prophet-5 and Arp 2600 modular systems creating the eerie Hawkins atmosphere and heart-pounding climax arpeggios.',
    qualityBadge: '24-BIT 96KHZ ANALOG MASTER',
    rating: {
      average: 4.95,
      count: 24300,
      distribution: { 5: 94, 4: 5, 3: 1, 2: 0, 1: 0 },
      thumbsUp: 510000,
      thumbsDown: 820,
    },
    soundtrackMeta: {
      albumName: 'Stranger Things Final Season Sound Archives',
      trackNumber: 1,
      totalTracks: 20,
      bitrate: 'Analog Master 24-bit',
      composer: 'Kyle Dixon & Michael Stein',
      lyricsSnippet: 'Echoes from the Upside Down reverberate through the analog circuits...'
    },
    tags: ['Stranger Things', 'TV Shows', 'Synthwave', 'Netflix', 'Hawkins']
  },

  // 18. GAMING: Genshin Impact Symphonic Concert Tour 4K
  {
    id: 'media-gaming-symphony',
    title: 'HoYo-MiX: Genshin Impact Global Concert Tour 2024 - Full Philharmonic 4K',
    subtitle: 'London Philharmonic Orchestra live at Royal Albert Hall',
    artist: 'HoYo-MiX & London Philharmonic',
    agency: 'miHoYo / HoYoverse',
    type: 'video',
    category: 'Gaming',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/pnSsgrjpC88?autoplay=1&mute=0',
    duration: '42:15',
    durationSeconds: 2535,
    views: 28400000,
    releaseDate: '2024-08-10',
    description: 'Symphonic tour featuring Fontaine, Sumeru, Inazuma, and Liyue battle suites with authentic regional instruments, choir chants, and guitar solos.',
    qualityBadge: '4K ULTRA HD • DOLBY ATMOS',
    rating: {
      average: 5.0,
      count: 76000,
      distribution: { 5: 98, 4: 2, 3: 0, 2: 0, 1: 0 },
      thumbsUp: 1820000,
      thumbsDown: 1100,
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'Fontaine Symphony: Pluie sur la ville' },
      { time: '12:40', seconds: 760, title: 'Inazuma Duel Before the Throne' },
      { time: '26:10', seconds: 1570, title: 'Liyue Harbor Moonlit Festival' },
      { time: '38:00', seconds: 2280, title: 'Grand Finale & Standing Ovation' }
    ],
    tags: ['Genshin Impact', 'HoYo-MiX', 'Gaming', 'Concert 4K', 'Symphony']
  },

  // 19. TRAILER: BLACKPINK - BORN PINK World Tour Finale 4K Trailer
  {
    id: 'media-blackpink-1',
    title: "BLACKPINK (블랙핑크) - 'BORN PINK' World Tour Finale Stadium 4K Trailer",
    subtitle: 'Official World Tour Encore Concert Movie & Stage Teaser • YG Entertainment',
    artist: 'BLACKPINK',
    agency: 'YG Entertainment',
    type: 'trailer',
    category: 'K-Pop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/gQlMMD8auMs?autoplay=1&mute=0',
    duration: '03:15',
    durationSeconds: 195,
    views: 38400000,
    releaseDate: '10/08/2024',
    description: 'High-octane stadium concert trailer featuring Jennie, Jisoo, Rosé, and Lisa across sold-out nights with laser pyrotechnics and iconic choreographies.',
    qualityBadge: '4K DOLBY VISION • THEATRICAL',
    rating: {
      average: 5.0,
      count: 62000,
      distribution: { 5: 96, 4: 3, 3: 1, 2: 0, 1: 0 },
      thumbsUp: 1450000,
      thumbsDown: 1100,
    },
    chapters: [
      { time: '00:00', seconds: 0, title: 'Stadium pyrotechnics & Pink Venom intro' },
      { time: '01:10', seconds: 70, title: 'Solo member highlights & crowd energy' },
      { time: '02:30', seconds: 150, title: 'Grand finale: As If It\'s Your Last' }
    ],
    tags: ['BLACKPINK', 'BORN PINK', 'BLINK', 'K-Pop', 'Trailer 4K', 'YG Entertainment']
  },

  // 20. TRAILER: IVE - 'HEYA' Official Comeback Music Video 4K
  {
    id: 'media-ive-1',
    title: "IVE (아이브) - 'HEYA' (해야) Official Comeback Music Video 4K",
    subtitle: 'Official Concept Film & Visual Comeback • Starship Entertainment',
    artist: 'IVE',
    agency: 'Starship Entertainment',
    type: 'trailer',
    category: 'K-Pop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/07EzZB4_dQ0?autoplay=1&mute=0',
    duration: '03:28',
    durationSeconds: 208,
    views: 24200000,
    releaseDate: '29/04/2024',
    description: 'Breathtaking oriental aesthetics meeting modern hip-hop beats in IVE explosive visual comeback with Jang Wonyoung and An Yujin.',
    qualityBadge: '4K HDR • 60FPS',
    rating: {
      average: 4.95,
      count: 31200,
      distribution: { 5: 92, 4: 6, 3: 2, 2: 0, 1: 0 },
      thumbsUp: 670000,
      thumbsDown: 920,
    },
    tags: ['IVE', 'HEYA', 'DIVE', 'K-Pop', 'Comeback 4K', 'Starship']
  },

  // 21. TRAILER: Stray Kids - 'Chk Chk Boom' Official Cinematic MV
  {
    id: 'media-straykids-1',
    title: "Stray Kids (스트레이 키즈) - 'Chk Chk Boom' Official Cinematic MV",
    subtitle: 'Blockbuster comeback with Hugh Jackman & Ryan Reynolds cameo • JYP',
    artist: 'Stray Kids',
    agency: 'JYP Entertainment',
    type: 'trailer',
    category: 'K-Pop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/0P0aQrlbpJg?autoplay=1&mute=0',
    duration: '03:40',
    durationSeconds: 220,
    views: 45000000,
    releaseDate: '19/07/2024',
    description: 'Cinematic Latin-infused hip-hop anthem from 3RACHA, set in New York City with Deadpool and Wolverine guest appearances.',
    qualityBadge: '4K ULTRA HD • 60FPS',
    rating: {
      average: 5.0,
      count: 78000,
      distribution: { 5: 97, 4: 2, 3: 1, 2: 0, 1: 0 },
      thumbsUp: 1980000,
      thumbsDown: 1300,
    },
    tags: ['Stray Kids', 'Chk Chk Boom', 'STAY', 'K-Pop', 'JYP', 'Deadpool']
  },

  // 22. TRAILER: Son Tung M-TP - Dung Lam Trai Tim Anh Dau 4K MV
  {
    id: 'media-sontung-1',
    title: "Sơn Tùng M-TP - 'Đừng Làm Trái Tim Anh Đau' Official Music Video 4K",
    subtitle: 'Top trending #1 blockbuster visual comeback • M-TP Entertainment',
    artist: 'Son Tung M-TP',
    agency: 'M-TP Entertainment',
    type: 'trailer',
    category: 'V-Pop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/abPmZCZZrFA?autoplay=1&mute=0',
    duration: '05:25',
    durationSeconds: 325,
    views: 68000000,
    releaseDate: '08/06/2024',
    description: 'Joyful, romantic retro office love story MV starring Son Tung M-TP and Pimtha that dominated global YouTube music trending for weeks.',
    qualityBadge: '4K DCI COLOR MASTER',
    rating: {
      average: 5.0,
      count: 98000,
      distribution: { 5: 98, 4: 2, 3: 0, 2: 0, 1: 0 },
      thumbsUp: 2400000,
      thumbsDown: 1800,
    },
    tags: ['Son Tung M-TP', 'SKY', 'V-Pop', 'MV 4K', 'M-TP Entertainment']
  },

  // 23. VIDEO: Anh Trai Vuot Ngan Chong Gai - Live Stadium 4K
  {
    id: 'media-chonggai-1',
    title: "Anh Trai Vượt Ngàn Chông Gai - 'Trống Cơm' & 'Dòng Máu Lạc Hồng' Live Concert 4K",
    subtitle: 'Massive 30,000 stadium live performance • Fire & Cultural Heritage',
    artist: 'Anh Trai Vuot Ngan Chong Gai',
    agency: 'YAE Entertainment / VTV3',
    type: 'video',
    category: 'V-Pop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/hT_nvWreIhg?autoplay=1&mute=0',
    duration: '22:40',
    durationSeconds: 1360,
    views: 18900000,
    releaseDate: '19/10/2024',
    description: 'Monumental red-ocean stadium concert combining traditional Vietnamese folk drums, rock guitars, and contemporary rap from 33 master artists.',
    qualityBadge: '4K BROADCAST 60FPS',
    rating: {
      average: 5.0,
      count: 54000,
      distribution: { 5: 96, 4: 3, 3: 1, 2: 0, 1: 0 },
      thumbsUp: 1120000,
      thumbsDown: 950,
    },
    tags: ['Anh Trai Vuot Ngan Chong Gai', 'Trong Com', 'V-Pop', 'Concert 4K']
  },

  // 24. TRAILER: One Piece Egghead Island Climax 4K Trailer
  {
    id: 'media-onepiece-1',
    title: "One Piece 'Egghead Island Arc' - Official Climax Anime Trailer 4K",
    subtitle: 'Gear 5 Luffy vs Saturn & Kizaru • Toei Animation & Eiichiro Oda',
    artist: 'One Piece',
    agency: 'Toei Animation / Shueisha',
    type: 'trailer',
    category: 'Manga',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/zSQ48zyWZrY?autoplay=1&mute=0',
    duration: '02:50',
    durationSeconds: 170,
    views: 31200000,
    releaseDate: '2024-07-07',
    description: 'The futuristic island of Dr. Vegapunk under Buster Call assault as Luffy activates Sun God Nika in full cinematic Sakuga animation.',
    qualityBadge: '4K SAKUGA HDR',
    rating: {
      average: 5.0,
      count: 48900,
      distribution: { 5: 96, 4: 3, 3: 1, 2: 0, 1: 0 },
      thumbsUp: 1190000,
      thumbsDown: 880,
    },
    tags: ['One Piece', 'Gear 5', 'Egghead Island', 'Manga', 'Trailer 4K', 'Luffy']
  },

  // 25. TRAILER: Jujutsu Kaisen Season 3 Culling Game Teaser Trailer 4K
  {
    id: 'media-jjk-1',
    title: "Jujutsu Kaisen Season 3: 'Culling Game Arc' Official Production Teaser 4K",
    subtitle: 'MAPPA Studio sakuga animation showcase • Shibuya aftermath',
    artist: 'Jujutsu Kaisen',
    agency: 'Studio MAPPA / Toho',
    type: 'trailer',
    category: 'Anime',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/f9X6GkHnS9E?autoplay=1&mute=0',
    duration: '02:30',
    durationSeconds: 150,
    views: 36700000,
    releaseDate: '2024-08-25',
    description: 'Official MAPPA production preview of the deadly Culling Game ritual orchestrated by Kenjaku, starring Yuta Okkotsu and Yuji Itadori.',
    qualityBadge: '4K MAPPA MASTER',
    rating: {
      average: 4.98,
      count: 52100,
      distribution: { 5: 95, 4: 4, 3: 1, 2: 0, 1: 0 },
      thumbsUp: 1340000,
      thumbsDown: 910,
    },
    tags: ['Jujutsu Kaisen', 'MAPPA', 'Culling Game', 'Anime', 'Trailer 4K', 'Gojo']
  },

  // 26. TRAILER: Christopher Nolan 70mm IMAX Suite 4K
  {
    id: 'media-nolan-1',
    title: "Christopher Nolan & Hans Zimmer: The 70mm IMAX Retrospective & Suite 4K",
    subtitle: 'Oppenheimer, Interstellar & Inception Theatrical Symphony Suite',
    artist: 'Christopher Nolan',
    agency: 'Syncopy / Universal Pictures',
    type: 'trailer',
    category: 'Cinema',
    thumbnailUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1200&q=80',
    embedUrl: 'https://www.youtube-nocookie.com/embed/kPa7bsKwL-8?autoplay=1&mute=0',
    duration: '05:10',
    durationSeconds: 310,
    views: 29800000,
    releaseDate: '2024-06-15',
    description: 'A monument to photochemical 70mm analog film craft with the titanic musical scores of Ludwig Göransson and Hans Zimmer.',
    qualityBadge: '70MM IMAX 4K DCI',
    rating: {
      average: 5.0,
      count: 41200,
      distribution: { 5: 97, 4: 2, 3: 1, 2: 0, 1: 0 },
      thumbsUp: 980000,
      thumbsDown: 650,
    },
    tags: ['Christopher Nolan', 'Oppenheimer', 'Interstellar', 'Hans Zimmer', 'Cinema 70mm']
  }
];

export const CATEGORY_ARTISTS_MAP: Record<string, { label: string; query: string }[]> = {
  'K-Pop': [
    { label: 'Tất cả K-Pop', query: '' },
    { label: 'NewJeans', query: 'NewJeans' },
    { label: 'BLACKPINK', query: 'BLACKPINK' },
    { label: 'BTS', query: 'BTS' },
    { label: 'SEVENTEEN', query: 'SEVENTEEN' },
    { label: 'aespa', query: 'aespa' },
    { label: 'IVE', query: 'IVE' },
    { label: 'Stray Kids', query: 'Stray Kids' },
  ],
  'V-Pop': [
    { label: 'Tất cả V-Pop', query: '' },
    { label: 'Say Hi All-Stars', query: 'Say Hi' },
    { label: 'Anh Trai Vượt Ngàn Chông Gai', query: 'Chong Gai' },
    { label: 'Sơn Tùng M-TP', query: 'Son Tung' },
  ],
  'Anime': [
    { label: 'Tất cả Anime', query: '' },
    { label: 'Demon Slayer', query: 'Demon Slayer' },
    { label: 'Jujutsu Kaisen', query: 'Jujutsu' },
    { label: 'Solo Leveling', query: 'Solo Leveling' },
  ],
  'Manga': [
    { label: 'Tất cả Manga', query: '' },
    { label: 'One Piece', query: 'One Piece' },
    { label: 'Chainsaw Man', query: 'Chainsaw Man' },
    { label: 'Berserk', query: 'Berserk' },
  ],
  'Gaming': [
    { label: 'Tất cả Gaming', query: '' },
    { label: 'T1 & Faker', query: 'Faker' },
    { label: 'Genshin Impact', query: 'Genshin' },
    { label: 'Black Myth: Wukong', query: 'Wukong' },
  ],
  'Comics': [
    { label: 'Tất cả Comics', query: '' },
    { label: 'Spider-Man & Spider-Verse', query: 'Spider' },
  ],
  'Cinema': [
    { label: 'Tất cả Cinema', query: '' },
    { label: 'Christopher Nolan', query: 'Christopher Nolan' },
    { label: 'Lady Gaga & Bruno Mars', query: 'Bruno Mars' },
    { label: 'Queen of Tears OST', query: 'Queen of Tears' },
  ],
  'Movies': [
    { label: 'Tất cả Movies', query: '' },
    { label: 'Christopher Nolan', query: 'Christopher Nolan' },
    { label: 'Lady Gaga & Bruno Mars', query: 'Bruno Mars' },
    { label: 'Queen of Tears OST', query: 'Queen of Tears' },
  ],
  'TV Shows': [
    { label: 'Tất cả TV Shows', query: '' },
    { label: 'Stranger Things', query: 'Stranger Things' },
  ],
  'Cosplay': [
    { label: 'Tất cả Cosplay', query: '' },
    { label: 'World Cosplay Summit', query: 'Cosplay' },
  ],
};

