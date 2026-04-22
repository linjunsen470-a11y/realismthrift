import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { sanityReadClient } from "@/lib/sanity/client";

export const { GET } = defineEnableDraftMode({
  client: sanityReadClient,
});
