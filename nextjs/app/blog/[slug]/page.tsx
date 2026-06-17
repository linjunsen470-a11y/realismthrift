import "../../internal-pages.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import type { TypedObject } from "sanity";
import { portableTextComponents } from "@/components/blog/PortableTextComponents";
import { ReadingTime } from "@/components/blog/ReadingTime";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { JsonLd, getArticleSchema, getBreadcrumbSchema } from "@/components/JsonLd";
import {
  formatBlogDate,
  getBlogPostBySlug,
  getPrevNextPosts,
  getRelatedBlogPosts,
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
  const post = await getBlogPostBySlug(slug, { stega: false });

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
      publishedTime: post.publishedAt,
      authors: [post.author?.name || 'RealismThrift'],
      section: post.category?.title,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
    alternates: {
      canonical: `/blog/${slug}`,
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

  const relatedPosts = await getRelatedBlogPosts(post._id, post.category?._id || "");
  const { prev: prevPost, next: nextPost } = await getPrevNextPosts(post.publishedAt);

  const heroImage = hasUsableImageAsset(post.coverImage)
    ? urlForImage(post.coverImage).width(1600).height(700).fit("crop").url()
    : "/img/blog-inner.webp";
  const authorImage = post.author?.avatar;
  const authorAvatar = hasUsableImageAsset(authorImage)
    ? urlForImage(authorImage).width(120).height(120).fit("crop").url()
    : null;

  const articleSchema = getArticleSchema({
    title: post.title,
    description: post.excerpt,
    image: heroImage.startsWith("/") ? `https://www.realismthrift.com${heroImage}` : heroImage,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt,
    authorName: post.author?.name || "RealismThrift",
    publisherName: "Dongguan Huihe Realismthrift Trading Co., Ltd.",
    publisherLogo: "https://www.realismthrift.com/img/logo.webp",
    url: `https://www.realismthrift.com/blog/${slug}`
  });
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://www.realismthrift.com" },
    { name: "Blog", url: "https://www.realismthrift.com/blog" },
    { name: post.title, url: `https://www.realismthrift.com/blog/${slug}` },
  ]);

  return (
    <article className="bg-[#fcfcf9] min-h-screen">
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      
      <section className="pt-8 md:pt-16 pb-16">
        <div className="rt-container max-w-4xl mx-auto px-4">
          {/* Back to Blog Button */}
          <div className="mb-6">
            <Link href="/blog" className="rt-blog-back-link inline-flex items-center gap-2">
              <ArrowLeft size={14} strokeWidth={3} />
              Back to Blog
            </Link>
          </div>

          {/* Meta Information */}
          <div className="flex items-center flex-wrap gap-2 text-sm text-gray-500 mb-4 font-semibold uppercase tracking-wider">
            <span className="bg-brand-red text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
              {post.category?.title || "Industry Insights"}
            </span>
            <span className="mx-1">•</span>
            <span>{formatBlogDate(post.publishedAt)}</span>
            <span className="mx-1">•</span>
            <ReadingTime content={post.body} />
          </div>

          {/* Blog Title */}
          <h1 className="text-3xl md:text-5xl font-black text-brand-dark leading-tight mb-6">
            {post.title}
          </h1>

          {/* Breadcrumbs */}
          <div className="rt-blog-breadcrumb flex items-center gap-2 text-gray-500 text-sm mb-8">
            <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-brand-gold transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-gray-400 truncate max-w-[200px] md:max-w-md">
              {post.title}
            </span>
          </div>

          {/* Featured Image */}
          <div className="relative w-full h-[240px] sm:h-[380px] md:h-[480px] rounded-2xl overflow-hidden mb-10 shadow-md">
            <Image
              src={heroImage}
              alt={post.coverImage?.alt || post.title}
              fill
              sizes="(max-w-768px) 100vw, 960px"
              className="object-cover"
              priority
            />
          </div>

          {/* Main Article Container */}
          <div className="rt-blog-article-shell no-sidebar">
            <p className="rt-blog-excerpt">{post.excerpt}</p>

            <div className="rt-prose">
              <PortableText
                value={post.body as TypedObject[]}
                components={portableTextComponents}
              />
            </div>

            <ShareButtons title={post.title} />

            {post.author?.name ? (
              <div className="rt-blog-author-card">
                <div className="flex items-center gap-4 mb-4">
                  {authorAvatar ? (
                    <Image
                      src={authorAvatar}
                      alt={post.author.avatar?.alt || post.author.name}
                      width={64}
                      height={64}
                      className="rt-blog-author-avatar shadow-sm"
                    />
                  ) : (
                    <div className="rt-blog-author-avatar rt-blog-author-avatar-fallback shadow-sm">
                      {post.author.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="rt-blog-author-name font-bold">{post.author.name}</div>
                    {post.author.role ? (
                      <div className="rt-blog-author-role text-brand-red font-bold uppercase tracking-wider">
                        {post.author.role}
                      </div>
                    ) : null}
                  </div>
                </div>
                {post.author.bio ? (
                  <p className="rt-blog-author-bio italic text-gray-600 border-t pt-4 mt-2">
                    {post.author.bio}
                  </p>
                ) : null}
              </div>
            ) : null}

            {/* Bottom Nav Links */}
            <div className="rt-blog-bottom-nav flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-6">
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="rt-blog-nav-btn group text-left flex items-center"
                >
                  <ArrowLeft size={20} className="text-gray-400 group-hover:-translate-x-1 group-hover:text-brand-red transition-all flex-shrink-0" />
                  <div className="ml-2">
                    <span className="rt-blog-nav-label">Previous Post</span>
                    <span className="rt-blog-nav-title line-clamp-1">{prevPost.title}</span>
                  </div>
                </Link>
              ) : (
                <div className="hidden sm:block w-[280px]" />
              )}

              <Link href="/blog" className="rt-news-view-all font-bold flex items-center justify-center gap-2 self-center">
                Back to Blog
              </Link>

              {nextPost ? (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="rt-blog-nav-btn group text-right flex items-center justify-end"
                >
                  <div className="mr-2">
                    <span className="rt-blog-nav-label">Next Post</span>
                    <span className="rt-blog-nav-title line-clamp-1">{nextPost.title}</span>
                  </div>
                  <ArrowRight size={20} className="text-gray-400 group-hover:translate-x-1 group-hover:text-brand-red transition-all flex-shrink-0" />
                </Link>
              ) : (
                <div className="hidden sm:block w-[280px]" />
              )}
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
