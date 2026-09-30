'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getAccessToken } from '../utils/authUtils';

export interface TelemetryEvent {
  event_type: string;
  target_id?: string;
  session_id?: string;
  user_id?: string;
  metadata?: string;
  timestamp?: string;
}

/**
 * Global helper function to manually track user action / clicks from anywhere in the UI
 */
export async function trackAnalyticsEvent(
  eventType: string,
  targetId?: string,
  metadata?: Record<string, any>
) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_ANALYTICS_SERVICE_URL;
    if (!apiBase) return;
    const token = getAccessToken();

    let userId: string | undefined = undefined;
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        if (payloadBase64) {
          const decoded = JSON.parse(atob(payloadBase64));
          userId = decoded.sub || decoded.nameid || decoded.id;
        }
      } catch {
        // Ignore token parse error
      }
    }

    const payload = {
      events: [
        {
          event_type: eventType,
          target_id: targetId,
          user_id: userId,
          metadata: metadata ? JSON.stringify(metadata) : undefined,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    await fetch(`${apiBase}/api/v1/analytics/telemetry/collect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Fail silently to avoid breaking UX
  }
}

/**
 * Global Telemetry Component automatically tracking page navigation
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPathRef = useRef('');

  useEffect(() => {
    if (!pathname) return;

    const fullPath = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    if (fullPath === lastPathRef.current) return;
    lastPathRef.current = fullPath;

    // Detect category if browsing specific fandom
    let category: string | undefined = undefined;
    if (pathname.includes('/kpop')) category = 'K-Pop';
    else if (pathname.includes('/manga')) category = 'Manga & Anime';
    else if (pathname.includes('/events') || pathname.includes('/event'))
      category = 'Events';

    trackAnalyticsEvent('page_view', fullPath, {
      category,
      referrer: typeof document !== 'undefined' ? document.referrer : '',
    });

    if (category) {
      trackAnalyticsEvent('category_view', category, { path: fullPath });
    }
  }, [pathname, searchParams]);

  return null;
}
