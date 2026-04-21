import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "@/lib/sanity/client";
import { SanityImage } from "@/types";

const builder = createImageUrlBuilder(sanityClient);

export function urlForImage(source: unknown) {
  return builder.image(source as never);
}

export function hasUsableImageAsset(image: SanityImage | null | undefined) {
  const asset = image?.asset;
  return Boolean(asset && (asset._ref || asset.url));
}
