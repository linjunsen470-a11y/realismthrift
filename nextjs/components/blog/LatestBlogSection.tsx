import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogPostCard } from "@/types";
import { BlogCard } from "@/components/blog/BlogCard";

interface LatestBlogSectionProps {
  posts: BlogPostCard[];
}

export function LatestBlogSection({ posts }: LatestBlogSectionProps) {
  return (
    <section className="rt-home-section rt-news" id="news">
      <div className="rt-container">
        <div className="rt-news-header">
          <div>
            <span className="rt-section-badge">BLOG &amp; RESOURCES</span>
            <h2 className="rt-section-title">LATEST NEWS &amp; INSIGHTS</h2>
            <div className="rt-section-divider" />
            <p className="rt-news-copy">
              Industry news, wholesale tips, and market insights for second-hand
              clothing importers worldwide.
            </p>
          </div>

          <Link href="/blog" className="rt-news-view-all">
            View All Articles <ArrowRight size={16} strokeWidth={2.25} />
          </Link>
        </div>

        {posts.length ? (
          <>
            <div className="rt-news-grid">
              {posts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>

            <div className="rt-news-footer">
              <p>
                Want to read more articles about the second-hand wholesale industry?
              </p>
              <Link href="/blog" className="rt-news-footer-link">
                View All Articles <ArrowRight size={16} strokeWidth={2.25} />
              </Link>
            </div>
          </>
        ) : (
          <div className="rt-empty-state">
            <h3>Articles coming soon</h3>
            <p>
              We are preparing fresh wholesale insights, sourcing guides, and market
              updates for global buyers.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
