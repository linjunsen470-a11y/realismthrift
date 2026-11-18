"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { captureMetaFbc, isMetaMeasurementEnabled, metaLeadEventOptions, metaLeadParams, metaPixelBaseCode, metaPixelNoscriptSrc, resolveFacebookPixelId } from "@/lib/meta-pixel";
import { isUtilityPath } from "./SiteChrome";
import { campaignParameters, googlePageLocation } from "@/lib/analytics-campaign";
import { measurementConsent, optInRegions, savedMeasurementChoice, type MeasurementChoice } from "@/lib/google-consent";
import { splitLocale } from "@/lib/i18n/routing";

const isAnalyticsEnabled = isMetaMeasurementEnabled(process.env.NEXT_PUBLIC_ANALYTICS_ENABLED, process.env.NEXT_PUBLIC_META_ENVIRONMENT);
const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() || "G-854G1RXBJM";
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() || "AW-18518055702";
const FB_PIXEL_ID = resolveFacebookPixelId(process.env.NEXT_PUBLIC_FB_PIXEL_ID);

function metaPixelActive(pathname: string) {
  return isAnalyticsEnabled && Boolean(FB_PIXEL_ID) && !isUtilityPath(pathname);
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

type ConsentCopy = { title: string; description: string; allow: string; decline: string };

export default function Analytics({ consentCopy }: { consentCopy: ConsentCopy }) {
  const pathname = usePathname();
  if (isUtilityPath(pathname) || !isAnalyticsEnabled) return null;

  return (
    <>
      <Suspense fallback={null}>
        <GoogleTag pathname={pathname} consentCopy={consentCopy} />
        <ContactClickEvents />
      </Suspense>
      {FB_PIXEL_ID ? (
        <Suspense fallback={null}><MetaPixelPageViews pathname={pathname} /></Suspense>
      ) : null}
    </>
  );
}

function GoogleTag({ pathname, consentCopy }: { pathname: string; consentCopy: ConsentCopy }) {
  const searchParams = useSearchParams();
  const [initialized, setInitialized] = useState(false);
  const [choice, setChoice] = useState<MeasurementChoice | null>(null);
  const lastPagePath = useRef<string | null>(null);

  useEffect(() => {
    if (!initialized || !window.gtag) return;
    const campaign = campaignParameters(searchParams.toString());
    if (Object.keys(campaign).length) window.gtag("set", campaign);
    const pageLocation = googlePageLocation(window.location.href);
    window.gtag("set", { page_location: pageLocation });
    if (lastPagePath.current === pathname) return;
    lastPagePath.current = pathname;
    window.gtag("event", "page_view", {
      send_to: GA_ID,
      page_title: document.title,
      page_location: pageLocation,
      page_path: pathname,
    });
  }, [pathname, searchParams, initialized]);

  return (
    <>
      <Script id="google-analytics" strategy="afterInteractive" onReady={() => {
        setChoice(savedMeasurementChoice());
        setInitialized(true);
      }}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', ${JSON.stringify({ ...measurementConsent("denied"), region: optInRegions })});
          gtag('consent', 'default', ${JSON.stringify(measurementConsent("granted"))});
          var savedChoice = (${savedMeasurementChoice.toString()})();
          if (savedChoice) gtag('consent', 'update', (${measurementConsent.toString()})(savedChoice));
          gtag('js', new Date());
          gtag('set', 'url_passthrough', true);
          gtag('set', 'ads_data_redaction', true);
          gtag('set', {
            page_location: (${googlePageLocation.toString()})(window.location.href),
            page_referrer: document.referrer ? document.referrer.split(/[?#]/)[0] : ''
          });
          gtag('set', (${campaignParameters.toString()})(window.location.search));
          gtag('config', ${JSON.stringify(GA_ID)}, {
            send_page_view: false,
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
          gtag('config', ${JSON.stringify(GOOGLE_ADS_ID)});
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      {initialized && (!choice || splitLocale(pathname).path === "/privacy-policy") && (
        <section id="google-measurement" aria-labelledby="google-measurement-title" className="bg-[#f4f3ec] px-5 py-3 text-sm">
          <div className="rt-container flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold" id="google-measurement-title">{consentCopy.title}</h2>
              <p>{consentCopy.description}</p>
            </div>
            <div className="flex max-w-full flex-wrap gap-2">
              {(["granted", "denied"] as const).map(value => (
                <button key={value} type="button" aria-pressed={choice === value}
                  className="rounded border border-current px-4 py-2 font-semibold aria-pressed:bg-black aria-pressed:text-white"
                  onClick={() => {
                    window.gtag?.("consent", "update", measurementConsent(value));
                    setChoice(value);
                    try { localStorage.setItem("rt-google-measurement", value); } catch { /* Current page still honors the choice. */ }
                  }}>
                  {value === "granted" ? consentCopy.allow : consentCopy.decline}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
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
  if (typeof window === "undefined" || !isAnalyticsEnabled || !window.gtag) return;
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
  if (typeof window === "undefined" || !isAnalyticsEnabled || !FB_PIXEL_ID || typeof window.fbq !== "function") return;
  if (isUtilityPath(window.location.pathname)) return;
  const params = metaLeadParams(productInterest);
  const options = metaLeadEventOptions(eventId);
  if (options) {
    window.fbq("track", "Lead", params, options);
    return;
  }
  window.fbq("track", "Lead", params);
}
