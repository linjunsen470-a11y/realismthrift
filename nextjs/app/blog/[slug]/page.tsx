import "../../internal-pages.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { ArrowLeft, ArrowRight, Mail, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import type { TypedObject } from "sanity";
import { portableTextComponents } from "@/components/blog/PortableTextComponents";
import { ReadingTime } from "@/components/blog/ReadingTime";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { InquiryForm } from "@/components/InquiryForm";
import { JsonLd, getArticleSchema } from "@/components/JsonLd";
import {
  formatBlogDate,
  getBlogPostBySlug,
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
    publisherName: "RealismThrift Export Co., Ltd.",
    publisherLogo: "https://www.realismthrift.com/logo.webp",
    url: `https://www.realismthrift.com/blog/${slug}`
  });

  return (
    <article>
      <JsonLd data={articleSchema} />
      <section className="rt-page-hero rt-blog-hero relative flex items-center">
        <Image
          src={heroImage}
          alt={post.title}
          fill
          className="object-cover z-0"
          priority
        />
        <div className="rt-page-hero-overlay relative z-1" />
        <div className="rt-container relative z-10 pt-8 md:pt-24">
          <div className="rt-fade-in max-w-4xl">
            <Link href="/blog" className="rt-blog-back-link mb-4 md:mb-8">
              <ArrowLeft size={14} strokeWidth={3} />
              Back to Blog
            </Link>
            <div className="rt-page-hero-meta mb-3 md:mb-4">
              <span className="rt-news-card-category bg-brand-red text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                {post.category?.title || "Industry Insights"}
              </span>
              <span className="rt-blog-meta-dot mx-2" />
              <span className="text-white/80">{formatBlogDate(post.publishedAt)}</span>
              <span className="rt-blog-meta-dot mx-2" />
              <ReadingTime content={post.body} />
            </div>
            <h1 className="rt-blog-title text-white font-black leading-tight mb-4 md:mb-6">
              {post.title}
            </h1>
            <div className="rt-breadcrumb flex items-center gap-2 text-white/60 text-sm">
              <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-brand-gold transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-white/40 truncate max-w-[200px] md:max-w-md">
                {post.title}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <section className="rt-home-section rt-blog-detail-section">
        <div className="rt-container">
          <div className="rt-blog-grid">
            {/* LEFT COLUMN: ARTICLE CONTENT */}
            <div className="rt-blog-article-shell">
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

              <div className="rt-blog-bottom-nav">
                <Link href="/blog" className="rt-news-view-all font-bold flex items-center gap-2">
                  <ArrowLeft size={16} strokeWidth={2.5} /> Back to All Articles
                </Link>
              </div>
            </div>

            {/* RIGHT COLUMN: SIDEBAR */}
            <aside className="rt-blog-sidebar">
              {/* INQUIRY FORM CARD */}
              <div className="rt-sidebar-card rt-sidebar-inquiry-card">
                <div className="rt-sidebar-card-header">
                  <h3>Get Wholesale Price List</h3>
                </div>
                <div className="rt-sidebar-card-body">
                  <p className="text-[0.875rem] text-gray-600 mb-6 leading-relaxed">
                    Consult our used clothing export specialists and get the latest
                    wholesale quotation within 12 hours.
                  </p>
                  <InquiryForm variant="sidebar" />
                </div>
              </div>

              {/* RELATED POSTS CARD */}
              {relatedPosts.length > 0 && (
                <div className="rt-sidebar-card">
                  <div className="rt-sidebar-card-header">
                    <h3>Related Articles</h3>
                  </div>
                  <div className="rt-sidebar-card-body">
                    <div className="rt-related-post-list">
                      {relatedPosts.map((rPost) => (
                        <Link
                          key={rPost._id}
                          href={`/blog/${rPost.slug}`}
                          className="rt-related-post-item"
                        >
                          <div className="rt-related-post-thumb">
                            {hasUsableImageAsset(rPost.coverImage) ? (
                              <Image
                                src={urlForImage(rPost.coverImage)
                                  .width(180)
                                  .height(140)
                                  .fit("crop")
                                  .url()}
                                alt={rPost.title}
                                fill
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <span className="text-[10px] text-gray-400 uppercase font-bold">
                                  No Image
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="rt-related-post-info">
                            <h4 className="rt-related-post-title">
                              {rPost.title}
                            </h4>
                            <div className="rt-related-post-date">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                              {formatBlogDate(rPost.publishedAt)}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CONTACT CARD */}
              <div className="rt-sidebar-card">
                <div className="rt-sidebar-card-header">
                  <h3>Direct Contact</h3>
                </div>
                <div className="rt-sidebar-card-body">
                  <div className="flex flex-col gap-4">
                    <a
                      href="https://wa.me/8613367481710"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all group"
                    >
                      <div className="w-12 h-12 bg-[#25D366] text-white flex items-center justify-center rounded-full shadow-lg shadow-[#25D366]/20">
                        <MessageCircle size={22} />
                      </div>
                      <div>
                        <div className="text-[0.7rem] text-[#25D366] font-extrabold uppercase tracking-widest mb-0.5">
                          WhatsApp
                        </div>
                        <div className="text-[0.95rem] font-extrabold text-brand-dark">
                          +86 133 6748 1710
                        </div>
                      </div>
                    </a>
                    <a
                      href="mailto:sales@realismthrift.com"
                      className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-brand-red hover:bg-brand-red/5 transition-all group"
                    >
                      <div className="w-12 h-12 bg-brand-red text-white flex items-center justify-center rounded-full shadow-lg shadow-brand-red/20">
                        <Mail size={22} />
                      </div>
                      <div>
                        <div className="text-[0.7rem] text-brand-red font-extrabold uppercase tracking-widest mb-0.5">
                          Email Us
                        </div>
                        <div className="text-[0.95rem] font-extrabold text-brand-dark">
                          sales@realismthrift.com
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </article>
  );
}
