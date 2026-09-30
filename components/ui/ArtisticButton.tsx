'use client';

import React, { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Loader2 } from 'lucide-react';

export type ArtisticButtonVariant = 'celestial' | 'frosted' | 'kinetic' | 'tactile';
export type ArtisticButtonSize = 'sm' | 'md' | 'lg';

export interface ArtisticButtonBaseProps {
  variant?: ArtisticButtonVariant;
  size?: ArtisticButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export type ArtisticButtonAsButton = ArtisticButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ArtisticButtonBaseProps> & {
    href?: undefined;
  };

export type ArtisticButtonAsAnchor = ArtisticButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ArtisticButtonBaseProps> & {
    href: string;
    target?: string;
    rel?: string;
  };

export type ArtisticButtonProps = ArtisticButtonAsButton | ArtisticButtonAsAnchor;

/**
 * ArtisticButton
 * Pixel-Perfect Master Button Component adhering to the 4 Artistic Variants:
 * 1. Celestial Shimmer: Primary CTA with obsidian gradient, hairline ring, and 45° shimmer sweep.
 * 2. Frosted Obsidian Glass: Secondary floating button with backdrop blur and kinetic icon slide.
 * 3. Editorial Kinetic Arrow: High-fashion ghost link with smooth expanding underline and diagonal arrow motion.
 * 4. Handcrafted Neo-Tactile: Organic asymmetric radius with mechanical press-down physics and hard ink shadow.
 */
export const ArtisticButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ArtisticButtonProps
>(function ArtisticButton(
  {
    variant = 'celestial',
    size = 'md',
    icon,
    iconPosition = 'right',
    isLoading = false,
    className = '',
    children,
    ...rest
  },
  ref
) {
  // WCAG 2.1 AA focus ring & base motion curve
  const baseFocusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-white transition-[transform,box-shadow,background-color,border-color,color] duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  // Sizing definitions per variant
  const sizeClasses = {
    celestial: {
      sm: 'px-5 py-2.5 text-xs font-semibold min-h-[40px]',
      md: 'px-7 py-3.5 text-sm font-semibold min-h-[48px]',
      lg: 'px-9 py-4 text-base font-bold min-h-[54px]',
    },
    frosted: {
      sm: 'px-4 py-2 text-xs font-medium min-h-[38px]',
      md: 'px-6 py-3 text-sm font-medium min-h-[46px]',
      lg: 'px-8 py-3.5 text-base font-semibold min-h-[52px]',
    },
    kinetic: {
      sm: 'py-1 text-[11px]',
      md: 'py-2 text-xs',
      lg: 'py-2.5 text-sm',
    },
    tactile: {
      sm: 'px-4 py-2 text-xs font-bold min-h-[40px]',
      md: 'px-6 py-3 text-sm font-bold min-h-[48px]',
      lg: 'px-8 py-3.5 text-base font-extrabold min-h-[54px]',
    },
  }[variant][size];

  // Specific visual styles for each variant
  let variantStyles = '';

  switch (variant) {
    case 'celestial':
      // 1. The Celestial Shimmer
      variantStyles =
        'relative inline-flex items-center justify-center rounded-full text-white font-sans ' +
        'bg-gradient-to-r from-zinc-950 via-neutral-900 to-stone-950 ' +
        'ring-1 ring-white/15 ring-inset ' +
        'shadow-[0_4px_16px_rgba(0,0,0,0.15)] ' +
        'hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)] ' +
        'active:scale-[0.98] active:shadow-[0_2px_10px_rgba(0,0,0,0.2)] ' +
        'overflow-hidden group';
      break;

    case 'frosted':
      // 2. Frosted Obsidian Glass
      variantStyles =
        'relative inline-flex items-center justify-center rounded-2xl font-sans ' +
        'bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl ' +
        'border border-zinc-200/80 dark:border-white/10 ' +
        'text-zinc-800 dark:text-zinc-200 ' +
        'hover:border-zinc-400 dark:hover:border-white/25 hover:text-black dark:hover:text-white ' +
        'hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] ' +
        'active:scale-[0.98] group';
      break;

    case 'kinetic':
      // 3. Editorial Kinetic Arrow
      variantStyles =
        'relative inline-flex items-center gap-1.5 bg-transparent font-sans ' +
        'tracking-[0.2em] font-semibold uppercase ' +
        'text-zinc-900 dark:text-zinc-100 ' +
        'hover:text-black dark:hover:text-white group';
      break;

    case 'tactile':
      // 4. Handcrafted Neo-Tactile
      variantStyles =
        'relative inline-flex items-center justify-center font-sans ' +
        'rounded-[14px_4px_16px_6px] ' +
        'bg-white text-zinc-950 ' +
        'border-2 border-zinc-900 ' +
        'shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] ' +
        'hover:shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] hover:-translate-x-[1px] hover:-translate-y-[1px] ' +
        'active:translate-x-[3px] active:translate-y-[3px] active:shadow-none ' +
        'transition-[transform,box-shadow] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] group';
      break;
  }

  // Icon handling
  const defaultIcon = variant === 'kinetic' ? <ArrowUpRight className="w-4 h-4" /> : null;
  const activeIcon = icon || defaultIcon;

  // Icon motion styling based on variant
  const iconWrapperClasses = {
    celestial: 'transition-transform duration-200 group-hover:scale-110',
    frosted: 'transition-transform duration-200 group-hover:translate-x-[2px]',
    kinetic:
      'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1',
    tactile: 'transition-transform duration-150 group-hover:rotate-6',
  }[variant];

  // Render Inner Content
  const content = (
    <>
      {/* Variant 1: Shimmer Sweep Light Beam Overlay */}
      {variant === 'celestial' && (
        <span
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-full"
          aria-hidden="true"
        >
          <span
            className="absolute -inset-full top-0 block w-[200%] h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.18) 50%, transparent 80%)',
              animation: 'shimmer-sweep 1.8s cubic-bezier(0.16, 1, 0.3, 1) infinite',
            }}
          />
        </span>
      )}

      {/* Loading state indicator */}
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </span>
      ) : (
        <span className="relative z-10 inline-flex items-center gap-2">
          {activeIcon && iconPosition === 'left' && (
            <span className={iconWrapperClasses}>{activeIcon}</span>
          )}
          <span>{children}</span>
          {activeIcon && iconPosition === 'right' && (
            <span className={iconWrapperClasses}>{activeIcon}</span>
          )}
        </span>
      )}

      {/* Variant 3: Kinetic Expanding Underline */}
      {variant === 'kinetic' && (
        <span
          className="absolute left-0 bottom-0 w-full h-[1.5px] bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          aria-hidden="true"
        />
      )}
    </>
  );

  const combinedClasses = `${baseFocusRing} ${sizeClasses} ${variantStyles} ${className}`.trim();

  // If href is provided, render Next.js Link
  if ('href' in rest && rest.href) {
    const { href, target, rel, ...anchorProps } = rest as ArtisticButtonAsAnchor;
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={combinedClasses}
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...anchorProps}
      >
        {content}
      </Link>
    );
  }

  // Otherwise render standard HTML Button
  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={buttonProps.type || 'button'}
      disabled={isLoading || buttonProps.disabled}
      className={combinedClasses}
      {...buttonProps}
    >
      {content}
    </button>
  );
});

ArtisticButton.displayName = 'ArtisticButton';
export default ArtisticButton;
