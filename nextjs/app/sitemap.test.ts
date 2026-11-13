import { expect, it, vi } from "vitest";
import {
  languageAlternates,
  locales,
  localizedPaths,
  localePath,
} from "@/lib/i18n/routing";

vi.mock("@/lib/blog", () => ({
  getAllBlogPosts: vi.fn().mockResolvedValue([]),
}));

import sitemap from "./sitemap";
import { getAllBlogPosts } from "@/lib/blog";

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
  expect(date("/fr/how-to-order")).toEqual(new Date("2026-11-13"));
  expect(date("/id")).toEqual(new Date("2026-11-13"));
  expect(date("/id/how-to-order")).toEqual(new Date("2026-11-08"));
});

it("propagates CMS failures instead of publishing an incomplete sitemap", async () => {
  vi.mocked(getAllBlogPosts).mockRejectedValueOnce(new Error("CMS unavailable"));
  await expect(sitemap()).rejects.toThrow("CMS unavailable");
});
