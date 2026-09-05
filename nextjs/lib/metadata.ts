import type { Metadata } from "next";

export const siteUrl = "https://www.realismthrift.com";
export const defaultSocialImage = "/img/og-realismthrift.webp";

/** Keep social previews aligned with each page instead of inheriting the homepage. */
export function createPageMetadata(metadata: Metadata): Metadata {
  const title = typeof metadata.title === "string" ? metadata.title : undefined;
  const canonical = metadata.alternates?.canonical;
  const images = metadata.openGraph?.images ?? [defaultSocialImage];

  return {
    ...metadata,
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
