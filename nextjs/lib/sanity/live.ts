import { defineLive } from "next-sanity/live";
import { sanityReadToken } from "@/lib/sanity/env";
import { sanityClient } from "@/lib/sanity/client";

export const { sanityFetch, SanityLive } = defineLive({
  client: sanityClient,
  serverToken: sanityReadToken || false,
  browserToken: false,
  // Publishing still invalidates the post tag via /api/revalidate. Keep an
  // hourly fallback for missed webhooks and future publishedAt dates.
  fetchOptions: { revalidate: 3600 },
});
