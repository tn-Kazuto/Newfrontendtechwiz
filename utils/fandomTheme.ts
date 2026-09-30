import { useState, useEffect, useCallback } from 'react';

export const getFandomCategoryFromTheme = (theme: string): string => {
  const t = (theme || '').toLowerCase();
  if (t === 'all') return 'All Fandoms';
  if (t === 'manga') return 'Manga';
  if (t === 'anime') return 'Anime';
  if (t === 'cosplay') return 'Cosplay';
  if (t === 'gaming' || t === 'game') return 'Gaming';
  if (t === 'comics' || t === 'comic') return 'Comics';
  if (t === 'cinema' || t === 'movie' || t === 'movies') return 'Movies';
  if (t === 'tv') return 'TV Shows';
  return 'K-Pop';
};

export const getFandomThemeKeyFromCategory = (cat: string): string => {
  const c = (cat || '').toLowerCase();
  if (c === 'all' || c === 'all fandoms') return 'all';
  if (c.includes('manga')) return 'manga';
  if (c.includes('anime')) return 'anime';
  if (c.includes('cosplay')) return 'cosplay';
  if (c.includes('game') || c.includes('gaming')) return 'gaming';
  if (c.includes('comic')) return 'comics';
  if (c.includes('movie') || c.includes('cinema')) return 'cinema';
  if (c.includes('tv')) return 'tv';
  return 'kpop';
};

export const getActiveFandomTheme = (propsTheme?: string, propsCategory?: string): string => {
  // 1. Check direct category prop
  if (propsCategory && propsCategory !== 'all') {
    const cat = propsCategory.toLowerCase();
    if (cat.includes('manga')) return 'manga';
    if (cat.includes('anime')) return 'anime';
    if (cat.includes('cosplay')) return 'cosplay';
    if (cat.includes('comic')) return 'comics';
    if (cat.includes('game') || cat.includes('gaming')) return 'gaming';
    if (cat.includes('movie') || cat.includes('cinema')) return 'cinema';
    if (cat.includes('tv')) return 'tv';
    if (cat.includes('kpop') || cat.includes('k-pop')) return 'kpop';
  }

  // 2. Check direct themeKey prop
  if (propsTheme && propsTheme !== 'all') {
    const th = propsTheme.toLowerCase();
    if (th.includes('manga')) return 'manga';
    if (th.includes('anime')) return 'anime';
    if (th.includes('cosplay')) return 'cosplay';
    if (th.includes('comic')) return 'comics';
    if (th.includes('game') || th.includes('gaming')) return 'gaming';
    if (th.includes('cinema') || th.includes('movie')) return 'cinema';
    if (th.includes('tv')) return 'tv';
    if (th.includes('kpop')) return 'kpop';
  }

  if (typeof window !== 'undefined') {
    // 3. Check URL query params (?category=manga or ?fandom=manga)
    const params = new URLSearchParams(window.location.search);
    const catParam = (params.get('category') || params.get('fandom') || '').toLowerCase();
    if (catParam.includes('manga')) return 'manga';
    if (catParam.includes('anime')) return 'anime';
    if (catParam.includes('cosplay')) return 'cosplay';
    if (catParam.includes('comic')) return 'comics';
    if (catParam.includes('game') || catParam.includes('gaming')) return 'gaming';
    if (catParam.includes('movie') || catParam.includes('cinema')) return 'cinema';
    if (catParam.includes('tv')) return 'tv';
    if (catParam.includes('kpop') || catParam.includes('k-pop')) return 'kpop';

    // 4. Check localStorage persistent category selection
    try {
      const stored = localStorage.getItem('fanhub_fandom_theme') || localStorage.getItem('fanhub_fandom_category');
      if (stored && stored !== 'all') {
        const st = stored.toLowerCase();
        if (st.includes('manga')) return 'manga';
        if (st.includes('anime')) return 'anime';
        if (st.includes('cosplay')) return 'cosplay';
        if (st.includes('comic')) return 'comics';
        if (st.includes('game') || st.includes('gaming')) return 'gaming';
        if (st.includes('cinema') || st.includes('movie')) return 'cinema';
        if (st.includes('tv')) return 'tv';
        if (st.includes('kpop')) return 'kpop';
      }
    } catch { }

    // 5. Check document attribute
    const domTheme = document.body?.getAttribute('data-fandom-theme') || document.documentElement?.getAttribute('data-fandom-theme');
    if (domTheme && domTheme !== 'all') {
      const dt = domTheme.toLowerCase();
      if (dt.includes('manga')) return 'manga';
      if (dt.includes('anime')) return 'anime';
      if (dt.includes('cosplay')) return 'cosplay';
      if (dt.includes('comic')) return 'comics';
      if (dt.includes('game') || dt.includes('gaming')) return 'gaming';
      if (dt.includes('cinema') || dt.includes('movie')) return 'cinema';
      if (dt.includes('tv')) return 'tv';
      if (dt.includes('kpop')) return 'kpop';
    }

    // 6. Check pathname
    const pathname = window.location.pathname.toLowerCase();
    if (pathname.includes('/manga')) return 'manga';
    if (pathname.includes('/gaming')) return 'gaming';
    if (pathname.includes('/anime')) return 'anime';
    if (pathname.includes('/comic')) return 'comics';
    if (pathname.includes('/cosplay')) return 'cosplay';
    if (pathname.includes('/cinema') || pathname.includes('/movie')) return 'cinema';
  }

  return 'kpop';
};

export const persistFandomTheme = (theme: string, category?: string) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('fanhub_fandom_theme', theme);
      if (category) localStorage.setItem('fanhub_fandom_category', category);
    } catch { }
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-fandom-theme', theme);
      document.body.setAttribute('data-fandom-theme', theme);
    }
    window.dispatchEvent(new CustomEvent('fandom-theme-change', { detail: { theme, category } }));
  }
};

export function useActiveFandom(initialTheme?: string, initialCategory?: string) {
  const [themeKey, setThemeKey] = useState<string>(() => {
    return initialTheme || getActiveFandomTheme(initialTheme, initialCategory);
  });
  const [category, setCategory] = useState<string>(() => {
    return initialCategory || getFandomCategoryFromTheme(themeKey);
  });

  useEffect(() => {
    const sync = () => {
      const currentTheme = getActiveFandomTheme();
      const currentCat = getFandomCategoryFromTheme(currentTheme);
      setThemeKey(currentTheme);
      setCategory(currentCat);
    };
    sync();

    const handleCustomChange = (e: any) => {
      if (e?.detail?.theme && e.detail.theme !== 'all') {
        const nextTheme = e.detail.theme;
        const nextCategory = e.detail.category || getFandomCategoryFromTheme(nextTheme);
        setThemeKey(nextTheme);
        setCategory(nextCategory);
      } else {
        sync();
      }
    };

    window.addEventListener('fandom-theme-change', handleCustomChange);
    return () => window.removeEventListener('fandom-theme-change', handleCustomChange);
  }, []);

  const changeFandom = useCallback((newCategoryOrTheme: string) => {
    const key = getFandomThemeKeyFromCategory(newCategoryOrTheme);
    const cat = getFandomCategoryFromTheme(key);
    setThemeKey(key);
    setCategory(cat);
    persistFandomTheme(key, cat);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('fandom', key);
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  return { themeKey, category, changeFandom, setThemeKey, setCategory };
}
