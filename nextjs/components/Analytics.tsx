"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isUtilityPath } from "./SiteChrome";

const isAnalyticsEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim();

export default function Analytics() {
  const pathname = usePathname();
  const [initialized, setInitialized] = useState(false);
  const lastPagePath = useRef<string | null>(null);

  useEffect(() => {
    if (isUtilityPath(pathname) || !isAnalyticsEnabled || !GA_ID || !initialized || !window.gtag) return;
    if (lastPagePath.current === pathname) return;

    const pageLocation = `${window.location.origin}${window.location.pathname}`;
    // Keep subsequent lead/engagement events on the current public page, without query strings.
    window.gtag("set", { page_location: pageLocation });
    window.gtag("event", "page_view", {
      send_to: GA_ID,
      page_title: document.title,
      page_location: pageLocation,
      page_path: pathname,
    });
    lastPagePath.current = pathname;
  }, [pathname, initialized]);

  if (isUtilityPath(pathname) || !isAnalyticsEnabled || !GA_ID) return null;

  return (
    <>
      <Script id="google-analytics" strategy="afterInteractive" onReady={() => setInitialized(true)}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'granted',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });
          gtag('js', new Date());
          gtag('config', ${JSON.stringify(GA_ID)}, {
            send_page_view: false,
            allow_google_signals: false,
            allow_ad_personalization_signals: false,
            page_location: window.location.origin + window.location.pathname,
            page_referrer: document.referrer ? document.referrer.split(/[?#]/)[0] : ''
          });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}

/**
 * Send a deliberately limited, non-identifying event to GA4.
 * Never pass names, email addresses, phone numbers, company names, or free text.
 */
export function trackEvent(eventName: string, params?: Record<string, string>) {
  if (typeof window === "undefined" || !isAnalyticsEnabled || !GA_ID || !window.gtag) return;
  if (isUtilityPath(window.location.pathname)) return;
  window.gtag("event", eventName, { ...params, send_to: GA_ID });
}
