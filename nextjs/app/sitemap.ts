import { MetadataRoute } from "next";
import { sanityClient } from "@/lib/sanity/client";
import type { BlogPostCard } from "@/types";
import {
  languageAlternates,
  localePath,
  localizedPaths,
  translatedLocales,
} from "@/lib/i18n/routing";

// Generate the XML on request so a CMS outage cannot block the build.
export const revalidate = 0;

type SitemapPost = Pick<BlogPostCard, "slug" | "publishedAt" | "_updatedAt">;

const sitemapPostsQuery = `*[
  _type == "post" && defined(slug.current) && defined(publishedAt) &&
  publishedAt <= now() && isArchived != true
] | order(publishedAt desc)[0...200] { "slug": slug.current, publishedAt, _updatedAt }`;

const baseUrl = "https://www.realismthrift.com";
// Shared translated copy was reviewed on November 8. Track later page edits explicitly.
const translationReviewedAt = new Date("2026-11-08");
const correctedPaths: Record<string, readonly string[]> = {
  es: ["/", "/about-us", "/used-brand-clothes", "/used-brand-shoes", "/used-brand-bag", "/how-to-order", "/contact-us", "/privacy-policy", "/terms-of-service"],
  fr: ["/", "/about-us", "/used-brand-clothes", "/used-brand-shoes", "/used-brand-bag", "/how-to-order", "/privacy-policy", "/terms-of-service"],
  ar: ["/", "/about-us", "/used-brand-clothes", "/used-brand-shoes", "/used-brand-bag", "/how-to-order", "/faq", "/contact-us", "/privacy-policy", "/terms-of-service"],
  vi: ["/", "/about-us", "/used-brand-clothes", "/used-brand-shoes", "/used-brand-bag", "/how-to-order", "/faq", "/privacy-policy", "/terms-of-service"],
  id: ["/", "/about-us", "/used-brand-clothes", "/used-brand-shoes", "/used-brand-bag", "/how-to-order", "/contact-us", "/terms-of-service"],
};
const translationCorrectedAt = new Date("2026-11-20");

type StaticPageConfig = {
  path: string;
  lastModified: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

// Dates audited against substantive content changes on 2026-10-29.
// Update affected entries when copy, contact details, or product information changes.
// Do not advance dates for deployments, tracking, or visual-only changes.
const staticPages: StaticPageConfig[] = [
  {
    path: "/",
    lastModified: "2026-10-17",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    path: "/used-brand-clothes",
    lastModified: "2026-10-28",
    changeFrequency: "weekly",
    priority: 0.95,
  },
  {
    path: "/used-brand-shoes",
    lastModified: "2026-10-17",
    changeFrequency: "weekly",
    priority: 0.95,
  },
  {
    path: "/used-brand-bag",
    lastModified: "2026-10-17",
    changeFrequency: "weekly",
    priority: 0.95,
  },
  {
    path: "/how-to-order",
    lastModified: "2026-10-17",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/contact-us",
    lastModified: "2026-11-01",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/about-us",
    lastModified: "2026-10-17",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/faq",
    lastModified: "2026-10-17",
    changeFrequency: "monthly",
    priority: 0.75,
  },
  {
    path: "/blog",
    lastModified: "2026-09-05",
    changeFrequency: "weekly",
    priority: 0.75,
  },
  {
    path: "/privacy-policy",
    lastModified: "2026-11-18",
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    path: "/terms-of-service",
    lastModified: "2026-09-05",
    changeFrequency: "yearly",
    priority: 0.3,
  },
];

function resolveLatestPostDate(
  posts: SitemapPost[],
  fallback: string,
): Date {
  const timestamps = posts
    .map((post) => post._updatedAt || post.publishedAt)
    .filter(Boolean)
    .map((value) => new Date(value).getTime())
    .filter((value) => !Number.isNaN(value));

  return timestamps.length
    ? new Date(Math.max(...timestamps))
    : new Date(fallback);
}

function buildStaticRoutes(blogLastModified: Date): MetadataRoute.Sitemap {
  return staticPages.flatMap((page) => {
    const translated = localizedPaths.includes(
      page.path as (typeof localizedPaths)[number],
    );
    const languages = translated ? languageAlternates(page.path) : undefined;
    const entry = {
      url: page.path === "/" ? baseUrl : `${baseUrl}${page.path}`,
      lastModified:
        page.path === "/blog" ? blogLastModified : new Date(page.lastModified),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      ...(languages ? { alternates: { languages } } : {}),
    };
    return [
      entry,
      ...(translated
        ? translatedLocales.map((locale) => ({
            ...entry,
            url: `${baseUrl}${localePath(page.path, locale)}`,
            lastModified: new Date(
              Math.max(
                entry.lastModified.getTime(),
                (correctedPaths[locale].includes(page.path)
                  ? translationCorrectedAt : translationReviewedAt).getTime(),
              ),
            ),
          }))
        : []),
    ];
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Do not replace a valid sitemap with an incomplete success response on CMS failure.
  const posts = await sanityClient.fetch<SitemapPost[]>(sitemapPostsQuery, {}, {
    perspective: "published",
    stega: false,
    next: { revalidate: 86400, tags: ["post"] },
  });
  const blogLastModified = resolveLatestPostDate(posts, "2026-04-27");
  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt || post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  return [...buildStaticRoutes(blogLastModified), ...blogRoutes];
}
