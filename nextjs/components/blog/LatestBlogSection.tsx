import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogPostCard } from "@/types";
import { BlogCard } from "@/components/blog/BlogCard";
import { localePath, type Locale } from "@/lib/i18n/routing";
import { getTranslator } from "@/lib/i18n/server";

interface LatestBlogSectionProps {
  locale?: Locale;
  posts: BlogPostCard[];
}

export function LatestBlogSection({
  locale = "en",
  posts,
}: LatestBlogSectionProps) {
  const t = getTranslator(locale);
  return (
    <section className="rt-home-section rt-news" id="news">
      <div className="rt-container">
        <div className="rt-news-header">
          <div>
            <span className="rt-section-badge">{t("BLOG & RESOURCES")}</span>
            <h2 className="rt-section-title">{t("LATEST NEWS & INSIGHTS")}</h2>
            <div className="rt-section-divider" />
            <p className="rt-news-copy">
              {t(
                "Industry news, wholesale tips, and market insights for second-hand clothing importers worldwide.",
              )}
            </p>
            {locale !== "en" ? (
              <p className="rt-news-copy">
                {t("Articles are available in English.")}
              </p>
            ) : null}
          </div>

          <Link href={localePath("/blog", locale)} className="rt-news-view-all">
            {t("View All Articles ")}
            <span className="rt-sr-only">{t("and industry insights")}</span>
            <ArrowRight size={16} strokeWidth={2.25} />
          </Link>
        </div>

        {posts.length ? (
          <>
            <div className="rt-news-grid">
              {posts.map((post) => (
                <div key={post._id} lang="en" dir="ltr">
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="rt-empty-state">
            <h3>{t("Articles coming soon")}</h3>
            <p>
              {t(
                "We are preparing fresh wholesale insights, sourcing guides, and market updates for global buyers.",
              )}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
