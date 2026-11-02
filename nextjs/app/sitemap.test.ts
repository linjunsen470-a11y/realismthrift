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
      if (locale === "id")
        expect(entry?.lastModified).toEqual(new Date("2026-11-02"));
      if (locale === "fr")
        expect(entry?.lastModified).toEqual(new Date("2026-11-01"));
    }
  }
  expect(new Set(entries.map((entry) => entry.url)).size).toBe(entries.length);
  expect(
    entries.some((entry) => /\/(?:es|fr|ar|vi|id)\/blog/.test(entry.url)),
  ).toBe(false);
});
