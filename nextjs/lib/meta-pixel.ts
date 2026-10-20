/** Production Meta Pixel. Public by design; override with NEXT_PUBLIC_FB_PIXEL_ID. */
export const PRODUCTION_FB_PIXEL_ID = "1661409812003549";

const PIXEL_ID_PATTERN = /^\d{10,20}$/;

/** Meta measures production only. GA4 keeps its separate existing behavior. */
export function isMetaMeasurementEnabled(analyticsEnabled: string | undefined, environment: string | undefined): boolean {
  return analyticsEnabled !== "false" && environment === "production";
}

const LEAD_CATEGORIES = new Set([
  "Used Brand Clothes",
  "Used Brand Shoes",
  "Used Brand Bags",
  "Mixed Products",
]);

/**
 * A blank value uses the production pixel so a missing Vercel variable still measures.
 * Anything that is not a numeric pixel id disables the tag instead of being interpolated into the snippet.
 */
export function resolveFacebookPixelId(configured: string | undefined | null): string {
  const value = (configured ?? "").trim();
  if (!value) return PRODUCTION_FB_PIXEL_ID;
  return PIXEL_ID_PATTERN.test(value) ? value : "";
}

/**
 * Meta's manual installer looks for this base code in the initial HTML head.
 * autoConfig stays off so the pixel cannot read inquiry fields.
 * disablePushState stops fbevents.js from adding a second PageView on client navigations.
 * An invalid id returns an empty string so nothing unsafe is interpolated into the snippet.
 */
export function metaPixelBaseCode(pixelId: string): string {
  if (!PIXEL_ID_PATTERN.test(pixelId)) return "";
  // Capture the real click before loading the external SDK, including when that SDK is blocked.
  return `window.__rtCaptureMetaClick=function(){
var rtNow=Date.now(),rtCookies=[];
var rtPattern=/^fb\\.\\d+\\.(\\d{13})\\.([A-Za-z0-9_-]+)(?:\\.[A-Za-z0-9_-]+)?$/;
function rtValid(v){var m=typeof v==='string'&&v.length<=1200&&rtPattern.exec(v);return m&&+m[1]<=rtNow+300000&&+m[1]>0?m:null}
var rtFbc=rtValid(window.__rtMetaFbc)?window.__rtMetaFbc:undefined;
try{rtCookies=document.cookie.split(';').map(function(c){return c.trim()}).filter(function(c){return c.indexOf('_fbc=')===0}).map(function(c){return c.slice(5)})}catch(e){}
rtCookies.forEach(function(v){var m=rtValid(v);if(m&&(!rtFbc||+m[1]>=+rtValid(rtFbc)[1]))rtFbc=v});
var rtClickId=new URLSearchParams(location.search).get('fbclid');
if(rtClickId&&/^[A-Za-z0-9_-]{1,1000}$/.test(rtClickId)&&rtClickId!==window.__rtMetaClickId){
var rtPrevious=rtValid(rtFbc);
if(!rtPrevious||rtPrevious[2]!==rtClickId)rtFbc='fb.1.'+rtNow+'.'+rtClickId;
window.__rtMetaClickId=rtClickId;
}
window.__rtMetaFbc=rtFbc;
if(rtFbc&&rtCookies.indexOf(rtFbc)===-1){try{
document.cookie='_fbc='+rtFbc+'; Path=/; Max-Age=7776000; SameSite=Lax'+(location.protocol==='https:'?'; Secure':'');
}catch(e){}}
return rtFbc;
};
window.__rtCaptureMetaClick();
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];n.disablePushState=!0;t=b.createElement(e);t.async=!0;
t.id='meta-pixel-lib';t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
if(!window.__rtMetaPixelInit){window.__rtMetaPixelInit=true;
window.__rtMetaPixelDocumentPath=location.pathname;
fbq('set', 'autoConfig', false, '${pixelId}');
fbq('init', '${pixelId}');
fbq('track', 'PageView');}`;
}

/** Recheck SPA URLs and keep a request-only fallback if the cookie could not be saved. */
export function captureMetaFbc(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return window.__rtCaptureMetaClick?.();
  } catch {
    // Measurement must never prevent navigation or an inquiry.
    return undefined;
  }
}

export function metaPixelNoscriptSrc(pixelId: string): string {
  return `https://www.facebook.com/tr?id=${encodeURIComponent(pixelId)}&ev=PageView&noscript=1`;
}

/** Standard Lead parameters. Contact fields and free text are never accepted. */
export function metaLeadParams(productInterest: string | undefined): {
  content_name: "wholesale_inquiry";
  content_category: string;
} {
  const content_category = productInterest && LEAD_CATEGORIES.has(productInterest)
    ? productInterest
    : "not_specified";
  return { content_name: "wholesale_inquiry", content_category };
}

/** UUID shape shared by the server Conversions API event_id and the browser eventID. */
const EVENT_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isMetaEventId(value: string | undefined | null): boolean {
  return EVENT_ID_PATTERN.test((value ?? "").trim());
}

/**
 * Meta's browser pixel expects eventID (camelCase) in the fourth fbq argument.
 * The same value is sent to the Conversions API as event_id so the two Leads deduplicate.
 * Anything that is not a UUID is omitted; the caller can still record Lead without it.
 */
export function metaLeadEventOptions(eventId: string | undefined | null): { eventID: string } | undefined {
  const value = (eventId ?? "").trim();
  if (!EVENT_ID_PATTERN.test(value)) return undefined;
  return { eventID: value };
}
