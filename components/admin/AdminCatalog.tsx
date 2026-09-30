'use client';

import React, { useState } from 'react';
import { useAdminLanguage } from '../../context/AdminLanguageContext';
import { mockAlbums } from '../../data/mockData';
import { Album } from '../../types';
import {
  Package,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  X,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface AdminCatalogProps {
  searchQuery: string;
  isAddModalOpen?: boolean;
  setIsAddModalOpen?: (open: boolean) => void;
}

export const AdminCatalog: React.FC<AdminCatalogProps> = ({ searchQuery: externalSearch, isAddModalOpen: externalModalOpen, setIsAddModalOpen: setExternalModalOpen }) => {
  const { t } = useAdminLanguage();
  const [albums, setAlbums] = useState<Album[]>(mockAlbums);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('NewJeans');
  const [newPrice, setNewPrice] = useState(25);
  const [newStock, setNewStock] = useState(50);
  const [newTag, setNewTag] = useState<Album['tag']>('Pre-Order');

  const effectiveModalOpen = externalModalOpen !== undefined ? externalModalOpen : isAddModalOpen;
  const setEffectiveModalOpen = setExternalModalOpen || setIsAddModalOpen;

  const activeSearch = externalSearch || searchTerm;

  const handleAddAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Album = {
      id: `custom-${Date.now()}`,
      title: newTitle,
      artist: newArtist,
      artistId: newArtist.toLowerCase().replace(/\s+/g, ''),
      priceUSD: newPrice,
      priceVND: newPrice * 25000,
      coverImage: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80',
      galleryImages: [],
      type: 'Mini Album',
      releaseDate: new Date().toISOString().split('T')[0],
      tag: newTag,
      rating: 5.0,
      reviewCount: 1,
      popularityScore: 90,
      stock: newStock,
      description: `Official first-press release of ${newTitle} by ${newArtist}.`,
      versions: [{ id: 'std', name: 'Standard Edition', extraPriceUSD: 0 }],
      inclusions: ['Photobook', 'Photocard (1 of 4)', 'CD-R'],
      photocards: [],
      tracks: [{ id: 1, title: 'Title Track Comeback', duration: '3:15', isTitleTrack: true }],
      reviews: [],
    };

    setAlbums([created, ...albums]);
    setNewTitle('');
    setEffectiveModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setAlbums((prev) => prev.filter((a) => a.id !== id));
  };

  const filteredAlbums = albums.filter((alb) => {
    const matchesSearch =
      alb.title.toLowerCase().includes(activeSearch.toLowerCase()) ||
      alb.artist.toLowerCase().includes(activeSearch.toLowerCase());
    const matchesArtist = selectedArtist === 'all' || alb.artistId === selectedArtist || alb.artist.toLowerCase() === selectedArtist.toLowerCase();
    return matchesSearch && matchesArtist;
  });

  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
      
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderRadius: '8px' }}>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('catalog')} & Inventory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage album listings, limited edition photocards, and stock quantities
          </p>
        </div>

        <button
          onClick={() => setEffectiveModalOpen(true)}
          type="button"
          style={{ borderRadius: '8px' }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-sky-500 dark:hover:bg-sky-400 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addNewAlbum')}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderRadius: '8px' }}>
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search catalog by title, SKU, or artist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderRadius: '8px' }}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedArtist}
            onChange={(e) => setSelectedArtist(e.target.value)}
            style={{ borderRadius: '8px' }}
            className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">{t('allArtists')}</option>
            <option value="newjeans">NewJeans</option>
            <option value="blackpink">BLACKPINK</option>
            <option value="bts">BTS</option>
            <option value="straykids">Stray Kids</option>
            <option value="ive">IVE</option>
            <option value="aespa">aespa</option>
          </select>
        </div>
      </div>

      {/* Album List Grid / Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden" style={{ borderRadius: '8px' }}>
        <div className="overflow-x-auto admin-custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">{t('albumTitle')}</th>
                <th className="py-3.5 px-4">{t('artist')}</th>
                <th className="py-3.5 px-4">{t('price')}</th>
                <th className="py-3.5 px-4">{t('stockRemaining')}</th>
                <th className="py-3.5 px-4">{t('tag')}</th>
                <th className="py-3.5 px-4 text-right">{t('action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAlbums.map((alb) => (
                <tr key={alb.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                    <img
                      src={alb.coverImage}
                      alt={alb.title}
                      className="w-10 h-10 object-cover flex-shrink-0 shadow-2xs"
                      style={{ borderRadius: '8px' }}
                    />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{alb.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{alb.type} • {alb.releaseDate}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-sky-600 dark:text-sky-400">
                    {alb.artist}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                    ${alb.priceUSD.toFixed(2)}
                    <span className="text-[10px] text-slate-400 block font-normal">
                      {alb.priceVND.toLocaleString()} ₫
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-extrabold ${
                        alb.stock < 20
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {alb.stock} units
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200" style={{ borderRadius: '8px' }}>
                      {alb.tag}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    <button
                      onClick={() => handleDelete(alb.id)}
                      type="button"
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                      title={t('delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Album Form Modal */}
      {effectiveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden" style={{ borderRadius: '8px' }}>
            <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-sky-400" />
                <h3 className="font-extrabold text-sm">{t('createAlbumTitle')}</h3>
              </div>
              <button
                onClick={() => setEffectiveModalOpen(false)}
                type="button"
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAlbum} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('albumTitle')}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('enterAlbumTitle')}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ borderRadius: '8px' }}
                  className="w-full p-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {t('selectArtist')}
                  </label>
                  <select
                    value={newArtist}
                    onChange={(e) => setNewArtist(e.target.value)}
                    style={{ borderRadius: '8px' }}
                    className="w-full p-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
                  >
                    <option value="NewJeans">NewJeans</option>
                    <option value="BLACKPINK">BLACKPINK</option>
                    <option value="BTS">BTS</option>
                    <option value="Stray Kids">Stray Kids</option>
                    <option value="IVE">IVE</option>
                    <option value="aespa">aespa</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {t('priceUSD')}
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    style={{ borderRadius: '8px' }}
                    className="w-full p-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {t('stockQuantity')}
                  </label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    style={{ borderRadius: '8px' }}
                    className="w-full p-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {t('albumTag')}
                  </label>
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value as any)}
                    style={{ borderRadius: '8px' }}
                    className="w-full p-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-white"
                  >
                    <option value="Pre-Order">Pre-Order</option>
                    <option value="Limited Edition">Limited Edition</option>
                    <option value="Hot Seller">Hot Seller</option>
                    <option value="Restocked">Restocked</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setEffectiveModalOpen(false)}
                  style={{ borderRadius: '8px' }}
                  className="px-4 py-2 text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  style={{ borderRadius: '8px' }}
                  className="px-5 py-2 text-xs font-extrabold bg-slate-900 text-white dark:bg-sky-500 dark:text-white shadow-md"
                >
                  {t('saveAlbum')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
