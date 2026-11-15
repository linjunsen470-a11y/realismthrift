"use client";

import Image, { type ImageLoaderProps, type ImageProps } from "next/image";

function sanityLoader({ src, width, quality }: ImageLoaderProps) {
  const url = new URL(src);
  const sourceWidth = Number(url.searchParams.get("w"));
  const sourceHeight = Number(url.searchParams.get("h"));

  // Preserve the aspect ratio and crop already chosen by urlForImage.
  if (sourceWidth > 0 && sourceHeight > 0) {
    url.searchParams.set("h", String(Math.max(1, Math.round(width * sourceHeight / sourceWidth))));
  }
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  return url.toString();
}

export default function SanityImage({ alt, ...props }: ImageProps) {
  return (
    <Image
      {...props}
      alt={alt}
      loader={typeof props.src === "string" && props.src.startsWith("https://cdn.sanity.io/")
        ? sanityLoader
        : undefined}
    />
  );
}
