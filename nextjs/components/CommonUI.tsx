"use client";

import React from "react";

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}

/**
 * A generic layout section wrapper used across the site.
 */
export const Section: React.FC<SectionProps> = ({ 
  title, 
  subtitle, 
  children, 
  dark, 
  className = "" 
}) => {
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

