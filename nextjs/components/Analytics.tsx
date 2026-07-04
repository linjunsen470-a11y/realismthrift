"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const isAnalyticsEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false";

export default function Analytics() {
  const pathname = usePathname();
  
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

  useEffect(() => {
    // Track page views for FB Pixel manually since it's a SPA-like navigation in Next.js
    if (isAnalyticsEnabled && FB_PIXEL_ID && window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname, FB_PIXEL_ID]);

  useEffect(() => {
    if (!isAnalyticsEnabled) return;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";

      // Track WhatsApp link clicks
      if (href.includes("wa.me") || href.includes("whatsapp.com")) {
        trackEvent("Contact_WhatsApp", {
          link_url: href,
          page_path: window.location.pathname,
        });
      }

      // Track Email link clicks
      if (href.startsWith("mailto:")) {
        const email = href.replace(/^mailto:/i, "").trim();
        trackEvent("Contact_Email", {
          email_address: email,
          page_path: window.location.pathname,
        });
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  if (!isAnalyticsEnabled || (!GA_ID && !FB_PIXEL_ID)) return null;

  return (
    <>
      {/* Google Analytics (GA4) */}
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="lazyOnload"
          />
          <Script id="google-analytics" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}

      {/* Facebook Pixel */}
      {FB_PIXEL_ID && (
        <>
          <Script id="fb-pixel" strategy="lazyOnload">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              className="hidden"
              src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
    </>
  );
}

/**
 * Utility function to track custom events (like inquiry submissions)
 */
export const trackEvent = (eventName: string, params?: object) => {
  if (typeof window === "undefined") return;
  if (!isAnalyticsEnabled) return;

  // Track in GA4
  if (window.gtag) {
    window.gtag("event", eventName, params);
  }

  // Track in FB Pixel
  if (window.fbq) {
    window.fbq("track", eventName, params);
  }
};
