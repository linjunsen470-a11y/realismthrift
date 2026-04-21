import { groq } from "next-sanity";
import { BlogPostCard, BlogPostDetail } from "@/types";
import { sanityClient } from "@/lib/sanity/client";

const POST_CARD_PROJECTION = groq`{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  coverImage,
  category->{
    title,
    "slug": slug.current,
    description
  },
  author->{
    name,
    role,
    bio,
    avatar
  }
}`;

const ACTIVE_POST_FILTER =
  `_type == "post" && defined(slug.current) && defined(publishedAt) && isArchived != true`;

const latestPostsQuery = groq`*[
  ${ACTIVE_POST_FILTER}
] | order(publishedAt desc)[0...3] ${POST_CARD_PROJECTION}`;

const allPostsQuery = groq`*[
  ${ACTIVE_POST_FILTER}
] | order(publishedAt desc) ${POST_CARD_PROJECTION}`;

const postBySlugQuery = groq`*[
  ${ACTIVE_POST_FILTER} && slug.current == $slug
][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  coverImage,
  category->{
    title,
    "slug": slug.current,
    description
  },
  author->{
    name,
    role,
    bio,
    avatar
  },
  body,
  seo{
    metaTitle,
    metaDescription,
    ogImage
  }
}`;

const postSlugsQuery = groq`*[
  ${ACTIVE_POST_FILTER}
].slug.current`;

export async function getLatestBlogPosts(): Promise<BlogPostCard[]> {
  return sanityClient.fetch<BlogPostCard[]>(latestPostsQuery);
}

export async function getAllBlogPosts(): Promise<BlogPostCard[]> {
  return sanityClient.fetch<BlogPostCard[]>(allPostsQuery);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  return sanityClient.fetch<BlogPostDetail | null>(postBySlugQuery, { slug });
}

export async function getBlogSlugs(): Promise<string[]> {
  return sanityClient.fetch<string[]>(postSlugsQuery);
}

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
