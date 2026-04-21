import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";
import { BlogPostCard } from "@/types";
import { formatBlogDate } from "@/lib/blog";
import { hasUsableImageAsset, urlForImage } from "@/lib/sanity/image";

interface BlogCardProps {
  post: BlogPostCard;
  showAuthor?: boolean;
}

export function BlogCard({ post, showAuthor = false }: BlogCardProps) {
  const imageUrl = hasUsableImageAsset(post.coverImage)
    ? urlForImage(post.coverImage).width(720).height(420).fit("crop").url()
    : null;

  return (
    <article className="rt-news-card">
      <Link href={`/blog/${post.slug}`} className="rt-news-card-thumb">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.coverImage?.alt || post.title}
            width={720}
            height={420}
            className="rt-news-card-image"
          />
        ) : (
          <div className="rt-news-card-thumb-fallback">
            <ClipboardList size={36} strokeWidth={2.1} />
          </div>
        )}
      </Link>
      <div className="rt-news-card-body">
        <div className="rt-news-card-meta">
          <span className="rt-news-card-category">
            {post.category?.title || "Blog"}
          </span>
          <span className="rt-news-card-date">{formatBlogDate(post.publishedAt)}</span>
          {showAuthor && post.author?.name ? (
            <span className="rt-news-card-date">By {post.author.name}</span>
          ) : null}
        </div>
        <h2 className="rt-news-card-title">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="rt-news-card-excerpt">{post.excerpt}</p>
        <Link href={`/blog/${post.slug}`} className="rt-news-card-link">
          Read More <ArrowRight size={15} strokeWidth={2.25} />
        </Link>
      </div>
    </article>
  );
}
