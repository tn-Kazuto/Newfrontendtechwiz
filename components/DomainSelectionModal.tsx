'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useDomainTheme, DOMAIN_THEMES, DomainThemeId } from '../context/DomainContext';
import {
  Music,
  Laptop,
  Palette,
  Activity,
  Heart,
  Layers,
  Check,
  ArrowRight,
} from 'lucide-react';

export const DomainSelectionModal: React.FC = () => {
  const pathname = usePathname();
  const {
    currentDomain,
    activeSubCategory,
    isModalOpen,
    closeDomainModal,
    selectDomain,
    selectSubCategory,
  } = useDomainTheme();

  const [selectedDomainTemp, setSelectedDomainTemp] = useState<DomainThemeId>(currentDomain);
  const [selectedSubTemp, setSelectedSubTemp] = useState<string>(activeSubCategory || 'all');

  if (!isModalOpen || pathname?.startsWith('/admin')) return null;

  const activeThemeConfig = DOMAIN_THEMES.find((t) => t.id === selectedDomainTemp) || DOMAIN_THEMES[0];

  const handleDomainClick = (id: DomainThemeId) => {
    setSelectedDomainTemp(id);
    setSelectedSubTemp('all');
  };

  const handleConfirm = () => {
    selectDomain(selectedDomainTemp);
    selectSubCategory(selectedSubTemp);
    closeDomainModal();
  };

  const getCategoryIcon = (iconType: string) => {
    switch (iconType) {
      case 'music':
        return <Music className="w-4 h-4" />;
      case 'tech':
        return <Laptop className="w-4 h-4" />;
      case 'art':
        return <Palette className="w-4 h-4" />;
      case 'sports':
        return <Activity className="w-4 h-4" />;
      case 'fandom':
        return <Heart className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        animation: 'fadeIn 0.15s ease-out',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#ffffff',
          color: '#0f172a',
          borderRadius: '8px',
          border: '1.5px solid #000000',
          boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '94vh',
        }}
      >
        {/* Compact Clean Header */}
        <div className="p-3.5 sm:p-5 bg-white border-b border-slate-200">
          <h3
            style={{
              fontSize: '15px',
              fontWeight: 900,
              color: '#000000',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            SELECT YOUR INTERESTED DOMAIN
          </h3>
          <p
            style={{
              fontSize: '12px',
              color: '#64748b',
              margin: '4px 0 0 0',
              lineHeight: 1.4,
            }}
          >
            Select your favorite domain &amp; genre to customize interface, typography, and content.
          </p>
        </div>

        {/* Category Grid - 1 column on mobile to prevent overflow, 2 columns on tablet/desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 p-3 sm:p-4 bg-slate-50 overflow-y-auto max-h-[50vh] sm:max-h-none">
          {DOMAIN_THEMES.map((theme) => {
            const isSelected = selectedDomainTemp === theme.id;

            return (
              <div
                key={theme.id}
                onClick={() => handleDomainClick(theme.id)}
                style={{
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                  backgroundColor: '#ffffff',
                  border: isSelected ? '2px solid #000000' : '1px solid #e2e8f0',
                  boxShadow: isSelected ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                }}
                className="p-2.5 sm:p-3 flex items-center justify-between gap-2.5 hover:border-slate-400"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div
                    style={{
                      borderRadius: '4px',
                      backgroundColor: isSelected ? '#000000' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#334155',
                    }}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0"
                  >
                    {getCategoryIcon(theme.iconType)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div
                      style={{
                        fontWeight: 800,
                        color: '#000000',
                        lineHeight: 1.25,
                      }}
                      className="text-xs sm:text-[13px] truncate"
                    >
                      {theme.name}
                    </div>
                    <div
                      style={{
                        color: '#64748b',
                        fontFamily: theme.fontFamily,
                      }}
                      className="text-[10px] sm:text-[11px] truncate mt-0.5"
                    >
                      Font: {theme.fontDisplayName}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sub-Category Pills for Selected Domain */}
        {activeThemeConfig && activeThemeConfig.subCategories && activeThemeConfig.subCategories.length > 0 && (
          <div className="p-3 sm:p-4 bg-white border-t border-slate-100">
            <div className="text-[10px] sm:text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">
              GENRES IN {activeThemeConfig.name.toUpperCase()}:
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {activeThemeConfig.subCategories.map((sub) => {
                const isSubSelected = selectedSubTemp === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedSubTemp(sub.id)}
                    style={{
                      fontFamily: activeThemeConfig.fontFamily,
                    }}
                    className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold rounded border transition-all cursor-pointer ${
                      isSubSelected
                        ? 'bg-black text-white border-black'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:border-black'
                    }`}
                  >
                    {sub.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Action Button */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <button
            onClick={handleConfirm}
            className="w-full py-2.5 sm:py-3 px-4 rounded bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-black uppercase tracking-wider cursor-pointer border-0 flex items-center justify-center gap-2 transition-colors shadow-xs"
            type="button"
          >
            <span>Start Exploring</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
