import { describe, expect, it } from "vitest";
import { createPageMetadata, defaultSocialImage } from "./metadata";

describe("page social metadata", () => {
  it("uses the current page URL, title, description, and fallback image", () => {
    const metadata = createPageMetadata({ title: "FAQ", description: "Buying help", alternates: { canonical: "/faq" } });
    expect(metadata.openGraph).toMatchObject({ url: "/faq", title: "FAQ", images: [defaultSocialImage] });
    expect(metadata.twitter).toMatchObject({ title: "FAQ", description: "Buying help", images: [defaultSocialImage] });
  });

  it("keeps a category-specific image for both sharing platforms", () => {
    const metadata = createPageMetadata({ title: "Used Shoes", openGraph: { images: ["/shoes.webp"] } });
    expect(metadata.twitter).toMatchObject({ images: ["/shoes.webp"] });
  });
});
