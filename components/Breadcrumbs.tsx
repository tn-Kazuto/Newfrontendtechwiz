'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs text-slate-500 font-medium py-3 px-4 sm:px-8 max-w-[1440px] mx-auto w-full ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1 sm:gap-2">
        {/* Home */}
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-950 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold">Home</span>
          </Link>
        </li>

        {/* Separator & Dynamic Path Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.isActive;
          return (
            <li key={index} className="flex items-center gap-1 sm:gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {isLast || !item.href ? (
                <span
                  className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[200px] sm:max-w-none"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-slate-600 hover:text-slate-950 transition-colors truncate max-w-[150px] sm:max-w-none"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
