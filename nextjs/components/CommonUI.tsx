"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface HeroProps {
  title: string;
  subtitle: string;
  cta: string;
  image: string;
}

export const Hero: React.FC<HeroProps> = ({ title, subtitle, cta, image }) => {
  return (
    <section className="relative h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover brightness-50"
          priority
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl text-white"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed font-light">
            {subtitle}
          </p>
          <Link
            href="/used-shoes"
            className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all hover:gap-4 shadow-xl"
          >
            {cta}
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ title, subtitle, children, dark, className }) => {
  return (
    <section className={`py-20 ${dark ? "bg-gray-50" : "bg-white"} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

interface ProductCardProps {
  title: string;
  category: string;
  image: string;
  description?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ title, category, image, description }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-blue-600">
          {category}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 line-clamp-2 font-light">{description}</p>
        )}
      </div>
    </motion.div>
  );
};
