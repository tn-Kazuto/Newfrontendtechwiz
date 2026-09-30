export type CategoryType = 'K-Pop' | 'V-Pop' | 'Anime' | 'Movie' | 'Gaming' | string;

export type AlbumType = 
  | 'Full Album' 
  | 'Mini Album' 
  | 'Single' 
  | 'Limited Kit' 
  | 'Lightstick' 
  | 'OST & Vinyl' 
  | 'Collector Box' 
  | 'Figure & Merch'
  | 'Full Album & Merch Box'
  | 'Concert Merchandise & Album'
  | 'Movie Soundtrack & Merchandise'
  | string;

export interface Track {
  id: number;
  title: string;
  duration: string;
  isTitleTrack?: boolean;
  previewUrl?: string;
}

export interface Review {
  id: string;
  userName: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  fandomTag: string;
}

export interface AlbumVersion {
  id: string;
  name: string;
  extraPriceUSD: number;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  category?: CategoryType;
  priceUSD: number;
  priceVND: number;
  originalPriceUSD?: number;
  coverImage: string;
  galleryImages: string[];
  type: AlbumType;
  releaseDate: string;
  tag: 'Limited Edition' | 'Pre-Order' | 'Hot Seller' | 'Restocked' | 'Collector Special' | 'Hot Seller VN' | 'Special Edition' | 'VN Special Edition' | 'Vietnamese Cinema Hit' | string;
  rating: number;
  reviewCount: number;
  popularityScore: number;
  stock: number;
  description: string;
  versions: AlbumVersion[];
  inclusions: string[];
  photocards: {
    member: string;
    image: string;
  }[];
  tracks: Track[];
  reviews: Review[];
  musicVideoUrl?: string;
}

export interface Artist {
  id: string;
  name: string;
  koreanName: string;
  agency: string;
  category?: CategoryType;
  fandomName: string;
  debutYear: number;
  members: string[];
  image: string;
  bio: string;
  totalAlbums: number;
  bannerImage: string;
}

export type EventPlatform = 'Weverse' | 'Withmuu' | 'Mubeat' | 'Official';
export type EventType = 'concert' | 'fansign' | 'luckydraw' | 'voting' | 'popup' | 'convention';

export interface VotingContender {
  rank: number;
  name: string;
  percentage: number;
  votes: number;
  avatar?: string;
}

export interface VotingProgress {
  target: number;
  current: number;
  unit: string;
  percentage: number;
  topContenders?: VotingContender[];
}

export interface TourEvent {
  id: string;
  artistName: string;
  tourName: string;
  tourTitle?: string;
  artistId?: string;
  city: string;
  country: string;
  venue: string;
  date: string;
  time?: string;
  status: 'Available' | 'Selling Fast' | 'Sold Out' | 'Presale Soon' | 'Live Now' | 'Apply Open' | 'Voting Active';
  ticketPriceFromUSD: number;
  ticketPriceFromVND: number;
  ticketPriceUSD?: number;
  ticketPriceVND?: number;
  mapQuery: string;

  // Extensions for Weverse, Withmuu, and Mubeat fandom event styles
  eventType?: EventType;
  sourcePlatform?: EventPlatform;
  badgeText?: string;
  coverImage?: string;
  bannerImage?: string;
  seatMapImage?: string;
  artistAvatar?: string;
  fandomName?: string;
  description?: string;
  perks?: string[];
  organizer?: string;
  applyPeriod?: string;
  winnerAnnouncementDate?: string;
  winnerCount?: number;
  votingProgress?: VotingProgress;
  actionLabel?: string;
  category?: CategoryType;
  externalUrl?: string;
  isOnlineLive?: boolean;
  lat?: number;
  lng?: number;
  address?: string;
  isMeetup?: boolean;
  meetupType?: 'stadium_concert' | 'cup_sleeve_cafe' | 'photocard_trade' | 'anime_expo' | 'gaming_arena';
  distanceKm?: number;
  freeEntry?: boolean;
  ticketLink?: string;
}

export interface CartItem {
  album: Album;
  selectedVersion: string;
  quantity: number;
}

export interface WishlistItem {
  album: Album;
  addedAt: string;
  note?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'filter_artist' | 'view_album' | 'open_cart';
    payload: string;
  };
  ticketCard?: {
    id: string;
    title: string;
    artist: string;
    venue: string;
    date: string;
    image: string;
    price: string;
    perks?: string[];
    actionUrl: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'visitor' | 'registered' | 'admin';
  avatar: string;
  favoriteFandoms: string[];
  memberSince: string;
}

export type FandomCategoryKey = 
  | 'K-Pop' 
  | 'Anime' 
  | 'Gaming' 
  | 'Movies' 
  | 'TV Shows' 
  | 'Comics' 
  | 'Manga' 
  | 'Cosplay';

export interface FeaturedArticle {
  id: string;
  title: string;
  excerpt: string;
  category: FandomCategoryKey;
  author: {
    name: string;
    avatar: string;
    role?: string;
  };
  date: string;
  readTime: string;
  coverImage: string;
  tags: string[];
  isHot?: boolean;
  isTrending?: boolean;
  likes: number;
  commentsCount: number;
  badgeText?: string;
  accentQuote?: string;
}

export interface UpcomingRelease {
  id: string;
  title: string;
  creatorOrArtist: string;
  category: FandomCategoryKey;
  type: string;
  releaseDate: string;
  daysRemaining: number;
  priceVND: number;
  priceUSD: number;
  status: 'Pre-Order' | 'Coming Soon' | 'Special Edition' | 'Limited Drop';
  coverImage: string;
  perks: string[];
  badgeText?: string;
  preOrderUrl?: string;
  platformOrVenue?: string;
}
