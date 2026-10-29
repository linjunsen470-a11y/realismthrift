"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { captureMetaFbc, isMetaMeasurementEnabled, metaLeadEventOptions, metaLeadParams, metaPixelBaseCode, metaPixelNoscriptSrc, resolveFacebookPixelId } from "@/lib/meta-pixel";
import { isUtilityPath } from "./SiteChrome";
import { campaignParameters } from "@/lib/analytics-campaign";

const isAnalyticsEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false";
const isMetaEnabled = isMetaMeasurementEnabled(process.env.NEXT_PUBLIC_ANALYTICS_ENABLED, process.env.NEXT_PUBLIC_META_ENVIRONMENT);
const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim();
const FB_PIXEL_ID = resolveFacebookPixelId(process.env.NEXT_PUBLIC_FB_PIXEL_ID);

function metaPixelActive(pathname: string) {
  return isMetaEnabled && Boolean(FB_PIXEL_ID) && !isUtilityPath(pathname);
}

/**
 * Official Meta base code in the document head.
 * Rendered during SSR for each URL, so Events Manager can see fbq without waiting for hydration.
 * next/script beforeInteractive only queues the snippet inside __next_s, which the installer misses.
 */
export function MetaPixelHead() {
  const pathname = usePathname();
  if (!metaPixelActive(pathname) || !FB_PIXEL_ID) return null;
  const code = metaPixelBaseCode(FB_PIXEL_ID);
  if (!code) return null;

  return (
    <>
      <script id="meta-pixel" dangerouslySetInnerHTML={{ __html: code }} />
      <noscript>
        {/* 1x1 Meta fallback for browsers with JavaScript disabled. next/image cannot sit inside noscript. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          height={1}
          width={1}
          style={{ display: "none" }}
          src={metaPixelNoscriptSrc(FB_PIXEL_ID)}
        />
      </noscript>
    </>
  );
}

export default function Analytics() {
  const pathname = usePathname();
  if (isUtilityPath(pathname) || !isAnalyticsEnabled) return null;

  return (
    <>
      {GA_ID ? <Suspense fallback={null}><GoogleAnalytics pathname={pathname} /><ContactClickEvents /></Suspense> : null}
      {isMetaEnabled && FB_PIXEL_ID ? (
        <Suspense fallback={null}><MetaPixelPageViews pathname={pathname} /></Suspense>
      ) : null}
    </>
  );
}

function GoogleAnalytics({ pathname }: { pathname: string }) {
  const searchParams = useSearchParams();
  const [initialized, setInitialized] = useState(false);
  const lastPagePath = useRef<string | null>(null);

  useEffect(() => {
    if (!isAnalyticsEnabled || !GA_ID || !initialized || !window.gtag) return;
    const campaign = campaignParameters(searchParams.toString());
    if (Object.keys(campaign).length) window.gtag("set", campaign);
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
  }, [pathname, searchParams, initialized]);

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
          gtag('set', (${campaignParameters.toString()})(window.location.search));
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

function MetaPixelPageViews({ pathname }: { pathname: string }) {
  const searchParams = useSearchParams();
  const trackedPath = useRef<string | null>(null);

  useEffect(() => {
    captureMetaFbc();
  }, [pathname, searchParams]);

  useEffect(() => {
    if (trackedPath.current === pathname) return;
    // The head snippet already queued PageView for the document that was loaded.
    const skipInitial = trackedPath.current === null && pathname === window.__rtMetaPixelDocumentPath;
    trackedPath.current = pathname;
    if (skipInitial || typeof window.fbq !== "function") return;
    window.fbq("track", "PageView");
  }, [pathname]);

  return null;
}

/**
 * Send a deliberately limited, non-identifying event to GA4.
 * Never pass names, email addresses, phone numbers, company names, or free text.
 */
export function trackEvent(eventName: string, params?: Record<string, string>) {
  if (typeof window === "undefined" || !isAnalyticsEnabled || !GA_ID || !window.gtag) return;
  if (isUtilityPath(window.location.pathname)) return;
  try {
    window.gtag("event", eventName, { ...params, send_to: GA_ID });
  } catch {
    // Measurement must never prevent navigation or form interaction.
  }
}

/** Delegate native link activation so server-rendered contact links stay lightweight.
 * Match business destinations only, excluding article-share links and privacy contacts.
 */
function ContactClickEvents() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.type === "auxclick" && event.button !== 1) return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!link) return;
      const url = new URL(link.getAttribute("href")!, window.location.href);
      const eventName = url.hostname === "wa.me" && url.pathname === "/8617279444062"
        ? "whatsapp_click"
        : url.protocol === "mailto:" && url.pathname === "sales@realismthrift.com"
          ? "email_click"
          : url.protocol === "tel:" && url.pathname === "+8617279444062" ? "phone_click" : null;
      if (!eventName) return;
      const placement = link.closest(".rt-floating-actions") ? "floating"
        : link.closest(".rt-form-state-error") ? "inquiry_error"
        : link.closest(".rt-inquiry-form") ? "inquiry_form"
        : link.closest("footer") ? "footer"
        : link.closest("header") ? "header" : "page_content";
      trackEvent(eventName, { placement, page_path: window.location.pathname });
    }
    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onClick, true);
    };
  }, []);
  return null;
}

/**
 * Meta standard Lead for one successful inquiry.
 * Automatic configuration stays off so the pixel cannot read form fields.
 * Never pass names, email addresses, phone numbers, WhatsApp numbers, or free text.
 * eventId matches the Conversions API event_id. The browser API name is eventID.
 */
export function trackMetaLead(productInterest?: string, eventId?: string) {
  if (typeof window === "undefined" || !isMetaEnabled || !FB_PIXEL_ID || typeof window.fbq !== "function") return;
  if (isUtilityPath(window.location.pathname)) return;
  const params = metaLeadParams(productInterest);
  const options = metaLeadEventOptions(eventId);
  if (options) {
    window.fbq("track", "Lead", params, options);
    return;
  }
  window.fbq("track", "Lead", params);
}
