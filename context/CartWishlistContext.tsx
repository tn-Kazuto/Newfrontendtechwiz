'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Album, CartItem, WishlistItem } from '../types';

interface CartWishlistContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  currency: 'USD' | 'VND';
  toggleCurrency: () => void;
  addToCart: (album: Album, selectedVersion?: string, quantity?: number) => void;
  removeFromCart: (albumId: string, version: string) => void;
  updateQuantity: (albumId: string, version: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (album: Album) => void;
  updateWishlistNote: (albumId: string, note: string) => void;
  isWishlisted: (albumId: string) => boolean;
  cartTotalUSD: number;
  cartTotalVND: number;
  cartCount: number;
  wishlistCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  formatPrice: (usd: number, vnd?: number) => string;
}

const CartWishlistContext = createContext<CartWishlistContextType | undefined>(undefined);

export const CartWishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [currency, setCurrency] = useState<'USD' | 'VND'>('USD');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('kpop_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('kpop_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedCur = localStorage.getItem('kpop_currency') as 'USD' | 'VND';
      if (savedCur) setCurrency(savedCur);
    } catch {
      // ignore JSON errors
    }
  }, []);

  // Save changes
  useEffect(() => {
    localStorage.setItem('kpop_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('kpop_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleCurrency = () => {
    const next = currency === 'USD' ? 'VND' : 'USD';
    setCurrency(next);
    localStorage.setItem('kpop_currency', next);
  };

  const addToCart = (album: Album, selectedVersion?: string, quantity: number = 1) => {
    const ver = selectedVersion || (album.versions.length > 0 ? album.versions[0].name : 'Standard');
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.album.id === album.id && item.selectedVersion === ver
      );
      if (existing) {
        return prev.map((item) =>
          item.album.id === album.id && item.selectedVersion === ver
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { album, selectedVersion: ver, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (albumId: string, version: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.album.id === albumId && item.selectedVersion === version))
    );
  };

  const updateQuantity = (albumId: string, version: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.album.id === albumId && item.selectedVersion === version) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (album: Album) => {
    setWishlist((prev) => {
      const found = prev.find((w) => w.album.id === album.id);
      if (found) {
        return prev.filter((w) => w.album.id !== album.id);
      } else {
        return [...prev, { album, addedAt: new Date().toISOString() }];
      }
    });
  };

  const updateWishlistNote = (albumId: string, note: string) => {
    setWishlist((prev) =>
      prev.map((w) => (w.album.id === albumId ? { ...w, note } : w))
    );
  };

  const isWishlisted = (albumId: string) => {
    return wishlist.some((w) => w.album.id === albumId);
  };

  const cartTotalUSD = cart.reduce((total, item) => {
    const verObj = item.album.versions.find((v) => v.name === item.selectedVersion);
    const extra = verObj ? verObj.extraPriceUSD : 0;
    return total + (item.album.priceUSD + extra) * item.quantity;
  }, 0);

  const cartTotalVND = cart.reduce((total, item) => {
    const verObj = item.album.versions.find((v) => v.name === item.selectedVersion);
    const extra = verObj ? verObj.extraPriceUSD * 25000 : 0;
    return total + (item.album.priceVND + extra) * item.quantity;
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const formatPrice = (usd: number, vnd?: number) => {
    if (currency === 'VND') {
      const val = vnd !== undefined ? vnd : usd * 25000;
      return `${val.toLocaleString('vi-VN')} ₫`;
    }
    return `$${usd.toFixed(2)}`;
  };

  return (
    <CartWishlistContext.Provider
      value={{
        cart,
        wishlist,
        currency,
        toggleCurrency,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        updateWishlistNote,
        isWishlisted,
        cartTotalUSD,
        cartTotalVND,
        cartCount,
        wishlistCount,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        formatPrice,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error('useCartWishlist must be used within a CartWishlistProvider');
  }
  return context;
};
