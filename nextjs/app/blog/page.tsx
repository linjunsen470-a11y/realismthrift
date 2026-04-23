import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogCard } from "@/components/blog/BlogCard";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Used Clothing Wholesale Industry Insights & News",
  description: "Get the latest market updates, profit strategies, and sourcing advice for the wholesale second-hand clothing, shoes, and bag industry from RealismThrift.",
  openGraph: {
    title: "RealismThrift Blog | Wholesale Industry Market News",
    description: "Expert insights into the global wholesale used clothing market. Sourcing tips, container loading guides, and market trends.",
    images: ['/img/blog-hero-wholesale.webp'],
  },
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div>
      <section
        className="rt-page-hero rt-blog-hero rt-blog-hero-index bg-[url('/img/blog-hero-wholesale.webp')]"
      >
        <div className="rt-page-hero-overlay" />
        <div className="rt-container relative z-10 text-center md:text-left">
          <div className="rt-fade-in">
            <nav className="rt-breadcrumb mb-5 justify-center md:justify-start">
              <Link href="/">Home</Link>
              <span>›</span>
              <span className="text-white/70">Blog</span>
            </nav>
            <div className="inline-block bg-brand-red text-white font-montserrat font-bold text-[0.65rem] tracking-[0.12em] px-[0.875rem] py-[0.3rem] rounded-[2px] mb-[1rem] uppercase">
              Industry Insights · Market News
            </div>
            <h1 className="rt-page-hero-title mb-5 text-[clamp(1.75rem,5vw,2.8rem)] leading-[1.1] max-w-[800px]">
              Used Branded Clothes, Shoes & Bags <br className="hidden md:block" /> Wholesale Market News
            </h1>
            <p className="rt-page-hero-sub max-w-[620px] mb-0 leading-[1.8] text-[1.05rem]">
              Stay updated with the latest trends, sourcing strategies, and market reports from China&apos;s leading wholesale export hub.
            </p>
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
