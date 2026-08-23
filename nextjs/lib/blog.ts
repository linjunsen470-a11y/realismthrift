import { defineQuery } from "next-sanity";
import { BlogPostCard, BlogPostDetail } from "@/types";
import { sanityFetch } from "@/lib/sanity/live";

const latestPostsQuery = defineQuery(`*[
  _type == "post" && defined(slug.current) && defined(publishedAt) &&
  publishedAt <= now() && isArchived != true
] | order(publishedAt desc)[0...3] {
  _id, title, "slug": slug.current, excerpt, publishedAt, _updatedAt, coverImage,
  category->{_id, title, "slug": slug.current, description},
  author->{name, role, bio, avatar}
}`);

// A generous cap prevents an accidental unbounded CMS read without adding
// pagination infrastructure that this small site does not currently need.
const allPostsQuery = defineQuery(`*[
  _type == "post" && defined(slug.current) && defined(publishedAt) &&
  publishedAt <= now() && isArchived != true
] | order(publishedAt desc)[0...200] {
  _id, title, "slug": slug.current, excerpt, publishedAt, _updatedAt, coverImage,
  category->{_id, title, "slug": slug.current, description},
  author->{name, role, bio, avatar}
}`);

const postBySlugQuery = defineQuery(`*[
  _type == "post" && defined(slug.current) && defined(publishedAt) &&
  publishedAt <= now() && isArchived != true && slug.current == $slug
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
}`);

const postSlugsQuery = defineQuery(`*[
  _type == "post" && defined(slug.current) && defined(publishedAt) &&
  publishedAt <= now() && isArchived != true
].slug.current`);

const relatedPostsQuery = defineQuery(`*[
  _type == "post" && defined(slug.current) && defined(publishedAt) &&
  publishedAt <= now() && isArchived != true &&
  _id != $currentId && category._ref == $categoryId
] | order(publishedAt desc)[0...3] {
  _id, title, "slug": slug.current, excerpt, publishedAt, _updatedAt, coverImage,
  category->{_id, title, "slug": slug.current, description},
  author->{name, role, bio, avatar}
}`);

const prevNextQuery = defineQuery(`{
  "prev": *[
    _type == "post" && defined(slug.current) && defined(publishedAt) &&
    publishedAt <= now() && isArchived != true && publishedAt < $publishedAt
  ] | order(publishedAt desc)[0] {
    title,
    "slug": slug.current
  },
  "next": *[
    _type == "post" && defined(slug.current) && defined(publishedAt) &&
    publishedAt <= now() && isArchived != true && publishedAt > $publishedAt
  ] | order(publishedAt asc)[0] {
    title,
    "slug": slug.current
  }
}`);

export async function getLatestBlogPosts(): Promise<BlogPostCard[]> {
  const { data } = await sanityFetch({
    query: latestPostsQuery,
    tags: ["post"],
    requestTag: "blog.latest",
    stega: false,
  });

  return data;
}

export async function getAllBlogPosts(): Promise<BlogPostCard[]> {
  const { data } = await sanityFetch({
    query: allPostsQuery,
    tags: ["post"],
    requestTag: "blog.all",
    stega: false,
  });

  return data;
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
    stega: options?.stega,
  });

  return data ?? null;
}

export async function getBlogSlugs(): Promise<string[]> {
  const { data } = await sanityFetch({
    query: postSlugsQuery,
    tags: ["post"],
    requestTag: "blog.slugs",
    stega: false,
  });

  return data;
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
    stega: false,
  });

  return data;
}

export async function getPrevNextPosts(publishedAt: string): Promise<{
  prev: { title: string; slug: string } | null;
  next: { title: string; slug: string } | null;
}> {
  const { data } = await sanityFetch({
    query: prevNextQuery,
    params: { publishedAt },
    tags: ["post"],
    requestTag: "blog.prev-next",
    stega: false,
  });

  return data || { prev: null, next: null };
}

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
