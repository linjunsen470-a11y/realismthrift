import { groq } from "next-sanity";
import { BlogPostCard, BlogPostDetail } from "@/types";
import { sanityFetch } from "@/lib/sanity/live";

const POST_CARD_PROJECTION = groq`{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  _updatedAt,
  coverImage,
  category->{
    _id,
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

// Public blog routes only expose posts that are actually ready for the site.
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
  _updatedAt,
  coverImage,
  category->{
    _id,
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

const relatedPostsQuery = groq`*[
  ${ACTIVE_POST_FILTER} && _id != $currentId && category._ref == $categoryId
] | order(publishedAt desc)[0...3] ${POST_CARD_PROJECTION}`;

export async function getLatestBlogPosts(): Promise<BlogPostCard[]> {
  const { data } = await sanityFetch({
    query: latestPostsQuery,
    tags: ["post"],
    requestTag: "blog.latest",
  });

  return data as BlogPostCard[];
}

export async function getAllBlogPosts(): Promise<BlogPostCard[]> {
  const { data } = await sanityFetch({
    query: allPostsQuery,
    tags: ["post"],
    requestTag: "blog.all",
  });

  return data as BlogPostCard[];
}

export async function getBlogPostBySlug(
  slug: string,
  options?: { stega?: boolean }
): Promise<BlogPostDetail | null> {
  const { data } = await sanityFetch({
    query: postBySlugQuery,
    params: { slug },
    tags: ["post"],
    requestTag: "blog.by-slug",
    stega: options?.stega ?? true,
  });

  return (data as BlogPostDetail | null) ?? null;
}

export async function getBlogSlugs(): Promise<string[]> {
  const { data } = await sanityFetch({
    query: postSlugsQuery,
    tags: ["post"],
    requestTag: "blog.slugs",
    stega: false,
  });

  return data as string[];
}

export async function getRelatedBlogPosts(
  currentId: string,
  categoryId: string
): Promise<BlogPostCard[]> {
  if (!categoryId) return [];

  const { data } = await sanityFetch({
    query: relatedPostsQuery,
    params: {
      currentId,
      categoryId,
    },
    tags: ["post", "category"],
    requestTag: "blog.related",
  });

  return data as BlogPostCard[];
}

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
