'use client';

import React, { useState } from 'react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { usePlayer } from '../context/PlayerContext';
import { Album, Review } from '../types';
import { 
  X, 
  Star, 
  ShoppingCart, 
  Play, 
  CheckCircle, 
  Plus,
  Minus,
  Heart
} from 'lucide-react';

interface AlbumDetailModalProps {
  album: Album | null;
  onClose: () => void;
}

export const AlbumDetailModal: React.FC<AlbumDetailModalProps> = ({ album, onClose }) => {
  const { addToCart, toggleWishlist, isWishlisted, formatPrice } = useCartWishlist();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  if (!album) return null;

  const [selectedVersion, setSelectedVersion] = useState(album.versions[0]?.name || 'Standard');
  const [selectedImage, setSelectedImage] = useState(album.coverImage);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'tracks' | 'photocards' | 'reviews'>('details');

  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [reviewsList, setReviewsList] = useState<Review[]>(album.reviews);

  const selectedVerObj = album.versions.find((v) => v.name === selectedVersion);
  const extraCostUSD = selectedVerObj ? selectedVerObj.extraPriceUSD : 0;
  const currentTotalUSD = (album.priceUSD + extraCostUSD) * quantity;
  const currentTotalVND = (album.priceVND + extraCostUSD * 25000) * quantity;

  const isFav = isWishlisted(album.id);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      userName: 'FandomStan ⭐',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      rating: newRating,
      comment: newComment,
      date: new Date().toISOString().split('T')[0],
      fandomTag: 'Verified Buyer',
    };
    setReviewsList([newRev, ...reviewsList]);
    setNewComment('');
  };

  const inclusions = album.inclusions;
  const description = album.description;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div 
        className="bg-white rounded-kpop max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto"
        style={{ borderRadius: '8px' }}
      >
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span 
              className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ backgroundColor: '#f4f4f5', color: '#1c1c1c' }}
            >
              {album.artist}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">{album.type}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Gallery Column */}
            <div className="md:col-span-5 space-y-3">
              <div 
                className="overflow-hidden bg-slate-100 border border-slate-200 shadow-sm relative"
                style={{ height: '320px', width: '100%', borderRadius: '8px' }}
              >
                <img
                  src={selectedImage}
                  alt={album.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  onClick={() => playTrack(album)}
                  className="absolute bottom-3 left-3 px-4 py-2 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md rounded-full backdrop-blur-md hover:bg-slate-900 active:scale-95 transition-all"
                  style={{ backgroundColor: 'rgba(15, 23, 42, 0.88)' }}
                  type="button"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-sky-400" />
                  <span>Listen to Teaser</span>
                </button>
              </div>

              {/* Thumbnails */}
              {album.galleryImages && album.galleryImages.length > 1 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedImage(album.coverImage)}
                    className="overflow-hidden border-2 transition-all cursor-pointer"
                    style={{
                      borderColor: selectedImage === album.coverImage ? '#000000' : '#e2e8f0',
                      borderRadius: '8px',
                      width: '56px',
                      height: '56px',
                    }}
                    type="button"
                  >
                    <img src={album.coverImage} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                  {album.galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className="overflow-hidden border-2 transition-all cursor-pointer"
                      style={{
                        borderColor: selectedImage === img ? '#000000' : '#e2e8f0',
                        borderRadius: '8px',
                        width: '56px',
                        height: '56px',
                      }}
                      type="button"
                    >
                      <img src={img} alt={`gallery-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Information Column */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                      {album.title}
                    </h2>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: '#000000' }}>
                      {album.artist}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleWishlist(album)}
                    className="p-2 border transition-all cursor-pointer"
                    style={{
                      backgroundColor: isFav ? '#000000' : '#ffffff',
                      color: isFav ? '#ffffff' : '#334155',
                      borderColor: isFav ? '#000000' : '#e2e8f0',
                      borderRadius: '8px',
                    }}
                    title="Wishlist"
                    type="button"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Rating & Stock */}
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{album.rating}</span>
                    <span className="text-slate-400">({reviewsList.length} reviews)</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{album.stock} in stock</span>
                  </span>
                </div>

                {/* Price Display */}
                <div 
                  className="mt-4 p-3 border flex items-baseline gap-3"
                  style={{ backgroundColor: '#fafafa', borderColor: '#d4d4d4', borderRadius: '8px' }}
                >
                  <span className="text-2xl font-black" style={{ color: '#000000' }}>
                    {formatPrice(album.priceUSD + extraCostUSD, album.priceVND + extraCostUSD * 25000)}
                  </span>
                  {album.originalPriceUSD && (
                    <span className="text-sm text-slate-400 line-through">
                      ${(album.originalPriceUSD + extraCostUSD).toFixed(2)}
                    </span>
                  )}
                  <span 
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full ml-auto"
                    style={{ backgroundColor: '#f4f4f5', color: '#1c1c1c' }}
                  >
                    {album.tag}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {description}
                </p>

                {/* Version Selector */}
                {album.versions && album.versions.length > 0 && (
                  <div className="mt-4">
                    <label className="text-xs font-bold text-slate-700 block mb-2">
                      Select Version / Packaging
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {album.versions.map((ver) => (
                        <button
                          key={ver.id}
                          onClick={() => setSelectedVersion(ver.name)}
                          className="p-2.5 text-left text-xs font-semibold border transition-all cursor-pointer flex items-center justify-between"
                          style={{
                            borderColor: selectedVersion === ver.name ? '#000000' : '#e2e8f0',
                            backgroundColor: selectedVersion === ver.name ? '#fafafa' : '#ffffff',
                            color: selectedVersion === ver.name ? '#1c1c1c' : '#334155',
                            borderRadius: '8px',
                          }}
                          type="button"
                        >
                          <span className="truncate">{ver.name}</span>
                          {ver.extraPriceUSD > 0 && (
                            <span className="text-[10px] font-bold ml-1" style={{ color: '#000000' }}>
                              +${ver.extraPriceUSD}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity & CTA Buttons */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Quantity:</span>
                  <div className="flex items-center border border-slate-200 bg-white" style={{ borderRadius: '8px' }}>
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 transition-colors"
                      type="button"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-slate-800 min-w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(album.stock, q + 1))}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 transition-colors"
                      type="button"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      addToCart(album, selectedVersion, quantity);
                      onClose();
                    }}
                    className="flex-1 text-xs sm:text-sm py-3 text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md rounded-full hover:bg-slate-800 active:scale-98 transition-all"
                    style={{ backgroundColor: '#0f172a' }}
                    type="button"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart • {formatPrice(currentTotalUSD, currentTotalVND)}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Modal Tabs Navigation */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 flex-wrap">
              <button
                onClick={() => setActiveTab('details')}
                className="px-4 py-2 text-xs font-bold transition-all cursor-pointer rounded-full active:scale-95"
                style={{
                  backgroundColor: activeTab === 'details' ? '#0f172a' : '#f1f5f9',
                  color: activeTab === 'details' ? '#ffffff' : '#475569',
                }}
                type="button"
              >
                📦 What's Inside
              </button>
              <button
                onClick={() => setActiveTab('tracks')}
                className="px-4 py-2 text-xs font-bold transition-all cursor-pointer rounded-full active:scale-95"
                style={{
                  backgroundColor: activeTab === 'tracks' ? '#0f172a' : '#f1f5f9',
                  color: activeTab === 'tracks' ? '#ffffff' : '#475569',
                }}
                type="button"
              >
                🎵 Tracklist ({album.tracks.length})
              </button>
              <button
                onClick={() => setActiveTab('photocards')}
                className="px-4 py-2 text-xs font-bold transition-all cursor-pointer rounded-full active:scale-95"
                style={{
                  backgroundColor: activeTab === 'photocards' ? '#0f172a' : '#f1f5f9',
                  color: activeTab === 'photocards' ? '#ffffff' : '#475569',
                }}
                type="button"
              >
                ✨ Photocards ({album.photocards.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className="px-4 py-2 text-xs font-bold transition-all cursor-pointer rounded-full active:scale-95"
                style={{
                  backgroundColor: activeTab === 'reviews' ? '#0f172a' : '#f1f5f9',
                  color: activeTab === 'reviews' ? '#ffffff' : '#475569',
                }}
                type="button"
              >
                ⭐ User Reviews ({reviewsList.length})
              </button>
            </div>

            {/* Tab 1: Inclusions */}
            {activeTab === 'details' && (
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {inclusions.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 text-xs text-slate-700"
                    style={{ borderRadius: '8px' }}
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Tracklist */}
            {activeTab === 'tracks' && (
              <div className="pt-4 divide-y divide-slate-100">
                {album.tracks.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3">No music tracks in this merchandise item.</p>
                ) : (
                  album.tracks.map((track) => {
                    const isTrackPlaying = isPlaying && currentTrack?.id === track.id;
                    return (
                      <div
                        key={track.id}
                        className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-50 px-2 transition-colors"
                        style={{ borderRadius: '8px' }}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => playTrack(album, track)}
                            className="rounded-full flex items-center justify-center transition-all cursor-pointer"
                            style={{
                              backgroundColor: isTrackPlaying ? '#000000' : '#fafafa',
                              color: isTrackPlaying ? '#ffffff' : '#000000',
                              borderRadius: '50%',
                              width: '28px',
                              height: '28px',
                            }}
                            type="button"
                          >
                            <Play className="w-3 h-3 fill-current ml-0.5" />
                          </button>
                          <div>
                            <span className="font-bold text-slate-800">
                              {track.id}. {track.title}
                            </span>
                            {track.isTitleTrack && (
                              <span 
                                className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded"
                                style={{ backgroundColor: '#f4f4f5', color: '#1c1c1c' }}
                              >
                                Title Track
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-slate-400 font-mono">{track.duration}</span>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Tab 3: Photocards */}
            {activeTab === 'photocards' && (
              <div className="pt-4">
                <p className="text-xs text-slate-500 mb-3">Random official photocard inclusions preview:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {album.photocards.map((pc, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 p-2 border border-slate-200 text-center space-y-1.5"
                      style={{ borderRadius: '8px' }}
                    >
                      <div className="aspect-[3/4] overflow-hidden bg-slate-200" style={{ borderRadius: '8px' }}>
                        <img src={pc.image} alt={pc.member} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div className="text-xs font-bold text-slate-700">{pc.member}</div>
                      <div className="text-[10px] font-semibold" style={{ color: '#000000' }}>Holo Card</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Reviews */}
            {activeTab === 'reviews' && (
              <div className="pt-4 space-y-6">
                <form onSubmit={handleAddReview} className="bg-slate-50 p-3 border border-slate-200 space-y-2" style={{ borderRadius: '8px' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Write a Review</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setNewRating(s)}
                          className={`text-xs ${s <= newRating ? 'text-amber-500' : 'text-slate-300'}`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Beautiful packaging, arrived safely with protective bubble wrap!"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 text-xs p-2 bg-white border border-slate-200 focus:outline-none"
                      style={{ borderRadius: '8px' }}
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 text-white text-xs font-bold cursor-pointer"
                      style={{ backgroundColor: '#000000', borderRadius: '8px' }}
                    >
                      Submit Review
                    </button>
                  </div>
                </form>

                <div className="space-y-3">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="p-3 bg-white border border-slate-100 shadow-xs space-y-1.5" style={{ borderRadius: '8px' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={rev.avatar} alt="user" className="w-6 h-6 rounded-full object-cover" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                          <span className="text-xs font-bold text-slate-800">{rev.userName}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold" style={{ backgroundColor: '#f4f4f5', color: '#1c1c1c' }}>
                            {rev.fandomTag}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-600">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
