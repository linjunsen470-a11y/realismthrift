import React from "react";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data/siteData";
import { Calendar, User, ChevronLeft, Share2 } from "lucide-react";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="pb-20">
      {/* Article Header */}
      <div className="bg-gray-900 py-32 relative text-white">
        <div className="absolute inset-0 opacity-40">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#C0392B]" />
          )}
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
          >
            <ChevronLeft size={20} /> Back to Blog
          </Link>
          <div className="flex items-center gap-6 text-sm text-white/70 mb-6 uppercase tracking-widest font-medium">
            <div className="flex items-center gap-2">
              <Calendar size={16} /> {post.date}
            </div>
            <div className="flex items-center gap-2">
              <User size={16} /> Admin
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white p-8 md:p-16 rounded-3xl shadow-xl border border-gray-100">
          <div className="prose prose-lg max-w-none prose-blue">
            <p className="text-xl text-gray-600 mb-8 font-light leading-relaxed italic border-l-4 border-blue-500 pl-6">
              {post.excerpt}
            </p>
            <div className="text-gray-800 space-y-6 font-light leading-relaxed">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <h2 className="text-2xl font-bold text-gray-900 pt-4">Sustainable Fashion Growth</h2>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <Image 
                src="/img/blog-inner.jpg" 
                alt="Content" 
                width={800} 
                height={500} 
                className="rounded-2xl shadow-md my-10"
                referrerPolicy="no-referrer"
              />
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
            </div>
          </div>

          {/* Footer of Article */}
          <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex gap-4">
              <span className="text-sm font-bold text-gray-900">Share:</span>
              <button className="text-gray-400 hover:text-blue-600 transition-colors"><Share2 size={20} /></button>
            </div>
            <div className="flex gap-2">
              {["Market", "Sustainability", "Guangzhou"].map(tag => (
                <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-500 font-medium">#{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
