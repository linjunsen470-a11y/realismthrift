"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data/siteData";
import { Section } from "@/components/CommonUI";
import { Calendar, User, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function BlogPage() {
  return (
    <div className="pb-20">
      <div className="bg-gray-50 border-b border-gray-200 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-gray-900">Industry Insights</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
            Stay updated with the latest trends, guides, and news from the global used goods market.
          </p>
        </div>
      </div>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {blogPosts.map((post, idx) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group"
            >
              <Link href={`/blog/${post.slug}`} className="block relative h-64 overflow-hidden bg-gray-900 flex items-center justify-center">
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-6xl opacity-20 filter grayscale transform hover:scale-110 transition-transform">📰</div>
                )}
              </Link>
              <div className="p-8">
                <div className="flex items-center gap-6 text-xs text-gray-500 mb-4 uppercase tracking-widest font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} /> {post.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={14} /> Admin
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-gray-600 font-light mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-4 transition-all"
                >
                  Read Full Article <ArrowRight size={18} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </Section>
    </div>
  );
}
