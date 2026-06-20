import { createClient } from "next-sanity";
import {
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
  sanityReadToken,
  sanityStudioUrl,
} from "@/lib/sanity/env";

export const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: true,
  perspective: "published",
  stega: {
    enabled: process.env.NEXT_PUBLIC_SANITY_VISUAL_EDITING === "true",
    studioUrl: sanityStudioUrl,
  },
});

export const sanityReadClient = sanityClient.withConfig({
  useCdn: false,
  token: sanityReadToken || undefined,
});
