import { defineLive } from "next-sanity/live";
import { sanityReadToken } from "@/lib/sanity/env";
import { sanityClient } from "@/lib/sanity/client";

export const { sanityFetch, SanityLive } = defineLive({
  client: sanityClient,
  serverToken: sanityReadToken || false,
  browserToken: false,
  stega: true,
});
