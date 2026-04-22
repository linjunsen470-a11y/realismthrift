import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogCard } from "@/components/blog/BlogCard";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | RealismThrift Export Co., Ltd",
  description:
    "Wholesale market insights, sourcing advice, and second-hand clothing industry updates from RealismThrift.",
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div>
      <section
        className="rt-page-hero rt-blog-hero rt-blog-hero-index"
        style={{ backgroundImage: "url('/img/blog-hero-wholesale.webp')" }}
      >
        <div className="rt-page-hero-overlay" />
        <div className="rt-container">
          <div className="rt-fade-in">
            <span className="rt-hero-badge">Industry Insights</span>
            <h1 className="rt-page-hero-title" style={{ fontSize: 'clamp(1.75rem, 4.5vw, 2.6rem)', lineHeight: 1.2, marginBottom: '1.25rem' }}>
              Used Branded Clothes, Shoes & Bags <br className="hidden md:block" /> Wholesale Market News
            </h1>
            <div className="rt-breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <span>Blog</span>
            </div>
          </div>
        </div>
      </section>

      <section className="rt-home-section rt-blog-index">
        <div className="rt-container">
          <div className="rt-section-header center">
            <span className="rt-section-badge">LATEST ARTICLES</span>
            <h2 className="rt-section-title">USED CLOTHING BUSINESS KNOWLEDGE</h2>
            <div className="rt-section-divider center" />
            <p className="rt-section-copy">
              Stay current with sourcing tips, profit strategies, and wholesale market
              updates for second-hand clothes, shoes, and bags.
            </p>
          </div>

          {posts.length ? (
            <div className="rt-news-grid">
              {posts.map((post) => (
                <BlogCard key={post._id} post={post} showAuthor />
              ))}
            </div>
          ) : (
            <div className="rt-empty-state">
              <h3>No published articles yet</h3>
              <p>
                The blog is connected to Sanity and ready. Publish your first post in the
                Studio to populate this page.
              </p>
              <Link href="/" className="rt-news-footer-link">
                Return Home <ArrowRight size={16} strokeWidth={2.25} />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
