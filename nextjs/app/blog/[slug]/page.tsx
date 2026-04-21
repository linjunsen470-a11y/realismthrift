import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import type { TypedObject } from "sanity";
import { portableTextComponents } from "@/components/blog/PortableTextComponents";
import {
  formatBlogDate,
  getBlogPostBySlug,
} from "@/lib/blog";
import { hasUsableImageAsset, urlForImage } from "@/lib/sanity/image";

function resolveSeoImage(post: Awaited<ReturnType<typeof getBlogPostBySlug>>) {
  if (!post) {
    return undefined;
  }

  const image = post.seo?.ogImage || post.coverImage;
  return hasUsableImageAsset(image)
    ? urlForImage(image).width(1200).height(630).fit("crop").url()
    : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | RealismThrift",
    };
  }

  const title = post.seo?.metaTitle || `${post.title} | RealismThrift Blog`;
  const description = post.seo?.metaDescription || post.excerpt;
  const image = resolveSeoImage(post);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const heroImage = hasUsableImageAsset(post.coverImage)
    ? urlForImage(post.coverImage).width(1600).height(700).fit("crop").url()
    : "/img/blog-inner.jpg";
  const authorImage = post.author?.avatar;
  const authorAvatar = hasUsableImageAsset(authorImage)
    ? urlForImage(authorImage).width(120).height(120).fit("crop").url()
    : null;

  return (
    <article>
      <section
        className="rt-page-hero rt-blog-hero"
        style={{ backgroundImage: `url("${heroImage}")` }}
      >
        <div className="rt-page-hero-overlay" />
        <div className="rt-container">
          <Link href="/blog" className="rt-blog-back-link">
            <ArrowLeft size={16} strokeWidth={2.2} />
            Back to Blog
          </Link>
          <p className="rt-page-hero-sub">
            {post.category?.title || "Blog"} • {formatBlogDate(post.publishedAt)}
          </p>
          <h1 className="rt-page-hero-title rt-blog-title">{post.title}</h1>
          <div className="rt-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/blog">Blog</Link>
            <span>/</span>
            <span>{post.title}</span>
          </div>
        </div>
      </section>

      <section className="rt-home-section rt-blog-detail-section">
        <div className="rt-container">
          <div className="rt-blog-article-shell">
            <div className="rt-blog-meta-row">
              <span className="rt-news-card-category">
                {post.category?.title || "Blog"}
              </span>
              <span className="rt-blog-meta-item">{formatBlogDate(post.publishedAt)}</span>
              {post.author?.name ? (
                <span className="rt-blog-meta-item">By {post.author.name}</span>
              ) : null}
            </div>

            <p className="rt-blog-excerpt">{post.excerpt}</p>

            {post.author?.name ? (
              <div className="rt-blog-author-card">
                {authorAvatar ? (
                  <Image
                    src={authorAvatar}
                    alt={post.author.avatar?.alt || post.author.name}
                    width={72}
                    height={72}
                    className="rt-blog-author-avatar"
                  />
                ) : (
                  <div className="rt-blog-author-avatar rt-blog-author-avatar-fallback">
                    {post.author.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="rt-blog-author-name">{post.author.name}</div>
                  {post.author.role ? (
                    <div className="rt-blog-author-role">{post.author.role}</div>
                  ) : null}
                  {post.author.bio ? (
                    <p className="rt-blog-author-bio">{post.author.bio}</p>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="rt-prose">
              <PortableText
                value={post.body as TypedObject[]}
                components={portableTextComponents}
              />
            </div>

            <div className="rt-blog-bottom-nav">
              <Link href="/blog" className="rt-news-view-all">
                All Articles <ArrowRight size={16} strokeWidth={2.25} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
