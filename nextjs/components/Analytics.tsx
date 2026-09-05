"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const isAnalyticsEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isAnalyticsEnabled || !GA_ID || !window.gtag) return;

    const pageLocation = `${window.location.origin}${window.location.pathname}`;
    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: pageLocation,
      page_path: pathname,
    });
  }, [pathname]);

  if (!isAnalyticsEnabled || !GA_ID) return null;

  return (
    <>
      <Script id="google-analytics-consent" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}

/**
 * Send a deliberately limited, non-identifying event to GA4.
 * Never pass names, email addresses, phone numbers, company names, or free text.
 */
export function trackEvent(eventName: string, params?: Record<string, string>) {
  if (typeof window === "undefined" || !isAnalyticsEnabled || !window.gtag) return;
  window.gtag("event", eventName, params);
}
