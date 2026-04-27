import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "@/lib/sanity/client";
import { SanityImage } from "@/types";

const builder = createImageUrlBuilder(sanityClient);

type SanityImageWithUsableAsset = SanityImage &
  ({ asset: { _ref: string } } | { asset: { url: string } });

export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}

export function hasUsableImageAsset(
  image: SanityImage | null | undefined,
): image is SanityImageWithUsableAsset {
  const asset = image?.asset;
  return Boolean(asset && (asset._ref || asset.url));
}
