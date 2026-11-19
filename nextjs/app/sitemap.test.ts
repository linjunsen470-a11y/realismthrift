import { expect, it, vi } from "vitest";
import {
  languageAlternates,
  locales,
  localizedPaths,
  localePath,
} from "@/lib/i18n/routing";

const { fetchPosts } = vi.hoisted(() => ({ fetchPosts: vi.fn().mockResolvedValue([]) }));
vi.mock("@/lib/sanity/client", () => ({
  sanityClient: { fetch: fetchPosts },
}));

import sitemap from "./sitemap";

it("lists each published translation with reciprocal alternates and its own publication date", async () => {
  const entries = await sitemap();
  for (const path of localizedPaths) {
    for (const locale of locales) {
      const url = `https://www.realismthrift.com${localePath(path, locale)}`;
      const entry = entries.find(
        (entry) => entry.url.replace(/\/$/, "") === url.replace(/\/$/, ""),
      );
      expect(entry, url).toBeDefined();
      expect(entry?.alternates?.languages).toEqual(languageAlternates(path));
      if (path === "/privacy-policy")
        expect(entry?.lastModified).toEqual(
          new Date(locale === "en" || locale === "id" ? "2026-11-18" : "2026-11-20"),
        );
    }
  }
  expect(new Set(entries.map((entry) => entry.url)).size).toBe(entries.length);
  expect(
    entries.some((entry) => /\/(?:es|fr|ar|vi|id)\/blog/.test(entry.url)),
  ).toBe(false);
});


it("records substantive translation corrections without advancing every page to today", async () => {
  const entries = await sitemap();
  const date = (path: string) => entries.find(entry => entry.url.endsWith(path))?.lastModified;
  expect(date("/fr/how-to-order")).toEqual(new Date("2026-11-20"));
  expect(date("/id")).toEqual(new Date("2026-11-20"));
  expect(date("/id/faq")).toEqual(new Date("2026-11-08"));
});

it("propagates CMS failures instead of publishing an incomplete sitemap", async () => {
  fetchPosts.mockRejectedValueOnce(new Error("CMS unavailable"));
  await expect(sitemap()).rejects.toThrow("CMS unavailable");
});

it("lists published posts and uses the latest article update for the blog index", async () => {
  fetchPosts.mockResolvedValueOnce([
    { slug: "packing-guide", publishedAt: "2026-11-01", _updatedAt: "2026-11-12" },
  ]);
  const entries = await sitemap();
  for (const path of ["/blog", "/blog/packing-guide"]) {
    expect(entries.find(entry => entry.url === `https://www.realismthrift.com${path}`)?.lastModified)
      .toEqual(new Date("2026-11-12"));
  }
});
