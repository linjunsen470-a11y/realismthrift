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
