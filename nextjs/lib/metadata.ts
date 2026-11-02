import type { Metadata } from "next";
import { languageAlternates, localizedPaths } from './i18n/routing';

export const siteUrl = "https://www.realismthrift.com";
export const defaultSocialImage = "/img/og-realismthrift.webp";

/** Keep social previews aligned with each page instead of inheriting the homepage. */
export function createPageMetadata(metadata: Metadata): Metadata {
  const title = typeof metadata.title === "string" ? metadata.title : undefined;
  const canonical = metadata.alternates?.canonical;
  const images = metadata.openGraph?.images ?? [defaultSocialImage];

  return {
    ...metadata,
    ...(typeof canonical === 'string' && localizedPaths.includes(canonical as (typeof localizedPaths)[number])
      ? { alternates: { ...metadata.alternates, languages: languageAlternates(canonical) } }
      : {}),
    openGraph: {
      type: "website",
      siteName: "RealismThrift",
      locale: "en_US",
      title,
      description: metadata.description ?? undefined,
      ...metadata.openGraph,
      ...(typeof canonical === "string" ? { url: canonical } : {}),
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: metadata.description ?? undefined,
      images,
      ...metadata.twitter,
    },
  };
}
