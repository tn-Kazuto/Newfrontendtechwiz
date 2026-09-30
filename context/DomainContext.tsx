'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type DomainThemeId = 'music' | 'tech' | 'art' | 'sports' | 'fandom' | 'classic';
export type ThemeMode = 'light' | 'dark';

export interface SubCategoryConfig {
  id: string;
  name: string;
  description?: string;
}

export interface DomainThemeConfig {
  id: DomainThemeId;
  name: string;
  fontFamily: string;
  fontDisplayName: string;
  tagline: string;
  iconType: string;
  vibeText: string;
  subCategories: SubCategoryConfig[];
}

export const DOMAIN_THEMES: DomainThemeConfig[] = [
  {
    id: 'music',
    name: 'Music & Audio',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontDisplayName: 'Plus Jakarta Sans',
    tagline: 'Modern Audio & Sound Hub.',
    iconType: 'music',
    vibeText: 'Synthwave & Electronic Beats',
    subCategories: [
      { id: 'all', name: 'All Music' },
      { id: 'kpop', name: 'K-Pop & Asian Pop' },
      { id: 'usuk', name: 'US-UK Pop & Rock' },
      { id: 'ost', name: 'Film & Cinema OST' },
      { id: 'edm', name: 'EDM & Vinyl Collectors' },
    ],
  },
  {
    id: 'tech',
    name: 'Tech & Gaming',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontDisplayName: 'Plus Jakarta Sans',
    tagline: 'Technology, Hardware & Gaming Hub.',
    iconType: 'tech',
    vibeText: 'Modern Tech & Gaming Audio',
    subCategories: [
      { id: 'all', name: 'All Tech & Gaming' },
      { id: 'gaming', name: 'Game OST (Elden Ring, Genshin)' },
      { id: 'cyber', name: 'Cyberpunk & Synthesizer' },
      { id: 'hardware', name: 'Gaming Merch & Gear Setup' },
      { id: 'anime_tech', name: 'Sci-Fi & Mecha Audio' },
    ],
  },
  {
    id: 'art',
    name: 'Art & Fashion',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontDisplayName: 'Plus Jakarta Sans',
    tagline: 'Design, Fine Art & High Fashion.',
    iconType: 'art',
    vibeText: 'Editorial High Fashion Design',
    subCategories: [
      { id: 'all', name: 'All Art & Fashion' },
      { id: 'ghibli', name: 'Studio Ghibli & Classical' },
      { id: 'editorial', name: 'High Fashion & Vinyl' },
      { id: 'artbook', name: 'Artbooks & Collector Kits' },
      { id: 'indie', name: 'Indie Acoustic & Visual Art' },
    ],
  },
  {
    id: 'sports',
    name: 'Sports & Fitness',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontDisplayName: 'Plus Jakarta Sans',
    tagline: 'High Energy Sports & Fitness Motion.',
    iconType: 'sports',
    vibeText: 'High Energy Athletic Motion',
    subCategories: [
      { id: 'all', name: 'All Sports & Fitness' },
      { id: 'stadium', name: 'Stadium World Tours & Anthems' },
      { id: 'workout', name: 'High Energy Workout Beats' },
      { id: 'athletic', name: 'Activewear & Athletic Merch' },
      { id: 'esports', name: 'E-Sports Arena & Gaming Stadium' },
    ],
  },
  {
    id: 'fandom',
    name: 'K-Pop & Anime Fandom',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontDisplayName: 'Plus Jakarta Sans',
    tagline: 'K-Pop Idol & Anime Universe.',
    iconType: 'fandom',
    vibeText: 'Pastel Idol Dreamland',
    subCategories: [
      { id: 'all', name: 'All Fandom' },
      { id: 'kpop_fandom', name: 'K-Pop Lightsticks & Fan Kits' },
      { id: 'anime_fandom', name: 'Anime Figures & Cards' },
      { id: 'vocaloid', name: 'Vocaloid & Virtual Idol J-Pop' },
      { id: 'fanart', name: 'Fanmade Art & Zines' },
    ],
  },
  {
    id: 'classic',
    name: 'All / Standard',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontDisplayName: 'Plus Jakarta Sans',
    tagline: 'Standard Minimalist Interface.',
    iconType: 'classic',
    vibeText: 'Modern Sky Standard',
    subCategories: [
      { id: 'all', name: 'All Products' },
      { id: 'kpop', name: 'K-Pop Top Hits' },
      { id: 'anime', name: 'Anime & Cinema OST' },
      { id: 'gaming', name: 'Gaming & Tech Audio' },
      { id: 'art', name: 'Art & High Fashion' },
    ],
  },
];

interface DomainContextType {
  currentDomain: DomainThemeId;
  activeSubCategory: string;
  activeConfig: DomainThemeConfig;
  isModalOpen: boolean;
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
  selectDomain: (id: DomainThemeId) => void;
  selectSubCategory: (subId: string) => void;
  closeDomainModal: () => void;
}

const CACHE_KEY_DOMAIN = 'techwiz_user_domain_preference';
const CACHE_KEY_SUBCAT = 'techwiz_user_subcategory_preference';
const CACHE_KEY_MODE = 'techwiz_user_theme_mode';

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export const DomainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDomain, setCurrentDomain] = useState<DomainThemeId>('classic');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all');
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const applyDomainThemeToDom = (domainId: DomainThemeId) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-domain', domainId);
      document.body.setAttribute('data-domain', domainId);
    }
  };

  const applyThemeModeToDom = (mode: ThemeMode) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', mode);
      document.body.setAttribute('data-theme', mode);
      if (mode === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    }
  };

  useEffect(() => {
    // Check cached theme mode
    try {
      const cachedMode = localStorage.getItem(CACHE_KEY_MODE) as ThemeMode | null;
      if (cachedMode === 'dark' || cachedMode === 'light') {
        setThemeModeState(cachedMode);
        applyThemeModeToDom(cachedMode);
      } else {
        applyThemeModeToDom('light');
      }
    } catch (e) {
      applyThemeModeToDom('light');
    }

    // Check cached domain theme
    try {
      const cachedDomain = localStorage.getItem(CACHE_KEY_DOMAIN) as DomainThemeId | null;
      const cachedSubCat = localStorage.getItem(CACHE_KEY_SUBCAT);

      if (cachedDomain && DOMAIN_THEMES.some((t) => t.id === cachedDomain)) {
        setCurrentDomain(cachedDomain);
        applyDomainThemeToDom(cachedDomain);
        if (cachedSubCat) {
          setActiveSubCategory(cachedSubCat);
        }
      } else {
        applyDomainThemeToDom('classic');
        const timer = setTimeout(() => {
          setIsModalOpen(true);
        }, 400);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn('LocalStorage error reading domain cache', e);
    }
  }, []);

  const selectDomain = (id: DomainThemeId) => {
    setCurrentDomain(id);
    setActiveSubCategory('all');
    applyDomainThemeToDom(id);
    try {
      localStorage.setItem(CACHE_KEY_DOMAIN, id);
      localStorage.setItem(CACHE_KEY_SUBCAT, 'all');
    } catch (e) {
      console.warn('LocalStorage write error', e);
    }
  };

  const selectSubCategory = (subId: string) => {
    setActiveSubCategory(subId);
    try {
      localStorage.setItem(CACHE_KEY_SUBCAT, subId);
    } catch (e) {
      console.warn('LocalStorage write error subcategory', e);
    }
  };

  const toggleThemeMode = () => {
    const newMode: ThemeMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeModeState(newMode);
    applyThemeModeToDom(newMode);
    try {
      localStorage.setItem(CACHE_KEY_MODE, newMode);
    } catch (e) {
      console.warn('LocalStorage write error mode', e);
    }
  };

  const activeConfig = DOMAIN_THEMES.find((t) => t.id === currentDomain) || DOMAIN_THEMES[0];

  return (
    <DomainContext.Provider
      value={{
        currentDomain,
        activeSubCategory,
        activeConfig,
        isModalOpen,
        themeMode,
        toggleThemeMode,
        selectDomain,
        selectSubCategory,
        closeDomainModal: () => setIsModalOpen(false),
      }}
    >
      {children}
    </DomainContext.Provider>
  );
};

export const useDomainTheme = () => {
  const context = useContext(DomainContext);
  if (!context) {
    throw new Error('useDomainTheme must be used within a DomainProvider');
  }
  return context;
};
