"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { metaLeadParams, resolveFacebookPixelId } from "@/lib/meta-pixel";
import { isUtilityPath } from "./SiteChrome";

const isAnalyticsEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim();
const FB_PIXEL_ID = resolveFacebookPixelId(process.env.NEXT_PUBLIC_FB_PIXEL_ID);

export default function Analytics() {
  const pathname = usePathname();
  if (isUtilityPath(pathname) || !isAnalyticsEnabled) return null;

  return (
    <>
      {GA_ID ? <GoogleAnalytics pathname={pathname} /> : null}
      {FB_PIXEL_ID ? <MetaPixel pathname={pathname} pixelId={FB_PIXEL_ID} /> : null}
    </>
  );
}

function GoogleAnalytics({ pathname }: { pathname: string }) {
  const [initialized, setInitialized] = useState(false);
  const lastPagePath = useRef<string | null>(null);

  useEffect(() => {
    if (!isAnalyticsEnabled || !GA_ID || !initialized || !window.gtag) return;
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

function MetaPixel({ pathname, pixelId }: { pathname: string; pixelId: string }) {
  const [ready, setReady] = useState(false);
  const lastPagePath = useRef<string | null>(null);

  useEffect(() => {
    if (!ready || typeof window.fbq !== "function") return;
    if (lastPagePath.current === pathname) return;
    window.fbq("track", "PageView");
    lastPagePath.current = pathname;
  }, [pathname, ready]);

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive" onReady={() => setReady(true)}>
        {`
          !function(f,b,e,v,n,t,s){
            if(f.fbq)return;
            n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;
            n.push=n;
            n.loaded=!0;
            n.version='2.0';
            n.queue=[];
            n.disablePushState=!0;
            t=b.createElement(e);
            t.async=!0;
            t.id='meta-pixel-lib';
            t.src=v;
            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s);
          }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
          if (!window.__rtMetaPixelInit) {
            window.__rtMetaPixelInit = true;
            window.fbq('set', 'autoConfig', false, ${JSON.stringify(pixelId)});
            window.fbq('init', ${JSON.stringify(pixelId)});
          }
        `}
      </Script>
      <noscript>
        {/* 1x1 Meta fallback for browsers with JavaScript disabled. next/image cannot sit inside noscript. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          height={1}
          width={1}
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${encodeURIComponent(pixelId)}&ev=PageView&noscript=1`}
        />
      </noscript>
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

/**
 * Meta standard Lead for one successful inquiry.
 * Automatic configuration stays off so the pixel cannot read form fields.
 * Never pass names, email addresses, phone numbers, WhatsApp numbers, or free text.
 */
export function trackMetaLead(productInterest?: string) {
  if (typeof window === "undefined" || !isAnalyticsEnabled || !FB_PIXEL_ID || typeof window.fbq !== "function") return;
  if (isUtilityPath(window.location.pathname)) return;
  window.fbq("track", "Lead", metaLeadParams(productInterest));
}
