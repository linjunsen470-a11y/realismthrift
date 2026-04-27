import "../internal-pages.css";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogCard } from "@/components/blog/BlogCard";
import { JsonLd, getCollectionPageSchema } from "@/components/JsonLd";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Used Goods Wholesale Buying Guides & Export Notes",
  description:
    "Practical buying guides for used clothes, shoes, and bags wholesale, covering sourcing, grading, mixed lots, container orders, and export preparation.",
  openGraph: {
    title: "RealismThrift Blog | Used Goods Wholesale Buying Guides",
    description:
      "Practical notes on sourcing, grading, packing, and exporting used clothes, shoes, and bags from China.",
    images: ["/img/wholesale-inventory.webp"],
  },
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();
  const blogSchema = getCollectionPageSchema({
    name: "Used Goods Wholesale Buying Guides",
    description:
      "Practical buying guides for used clothes, shoes, and bags wholesale, covering sourcing, grading, mixed lots, container orders, and export preparation.",
    url: "https://www.realismthrift.com/blog",
    items: posts.map((post) => ({
      name: post.title,
      url: `https://www.realismthrift.com/blog/${post.slug}`,
      datePublished: post.publishedAt,
    })),
  });

  return (
    <div>
      <JsonLd data={blogSchema} />
      <section className="rt-page-hero rt-blog-hero rt-blog-hero-index bg-[url('/img/wholesale-inventory.webp')]">
        <div className="rt-page-hero-overlay" />
        <div className="rt-container relative z-10 text-center md:text-left">
          <div className="rt-fade-in">
            <nav className="rt-breadcrumb mb-5 justify-center md:justify-start">
              <Link href="/">Home</Link>
              <span>/</span>
              <span className="text-white/70">Blog</span>
            </nav>
            <div className="inline-block bg-brand-red text-white font-montserrat font-bold text-[0.65rem] tracking-[0.12em] px-[0.875rem] py-[0.3rem] rounded-[2px] mb-[1rem] uppercase">
              Buying Guides / Export Notes
            </div>
            <h1 className="rt-page-hero-title mb-5 text-[clamp(1.75rem,5vw,2.8rem)] leading-[1.1] max-w-[800px]">
              Used Clothes, Shoes & Bags <br className="hidden md:block" /> Wholesale Buying
              Guides
            </h1>
            <p className="rt-page-hero-sub max-w-[620px] mb-0 leading-[1.8] text-[1.05rem]">
              Practical sourcing, grading, packing, and container order notes for overseas
              buyers working with China&apos;s used goods export sector.
            </p>
          </div>
        </div>
      </section>

      <section className="rt-home-section rt-blog-index">
        <div className="rt-container">
          <div className="rt-section-header center">
            <span className="rt-section-badge">LATEST ARTICLES</span>
            <h2 className="rt-section-title">USED GOODS WHOLESALE NOTES</h2>
            <div className="rt-section-divider center" />
            <p className="rt-section-copy">
              Read practical notes on source quality, sellable grading, mixed lots, packing
              decisions, and export preparation for used clothes, shoes, and bags.
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
