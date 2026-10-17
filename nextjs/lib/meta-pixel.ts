/** Production Meta Pixel. Public by design; override with NEXT_PUBLIC_FB_PIXEL_ID. */
export const PRODUCTION_FB_PIXEL_ID = "1640627937418258";

const PIXEL_ID_PATTERN = /^\d{10,20}$/;

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
  return `!function(f,b,e,v,n,t,s)
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
