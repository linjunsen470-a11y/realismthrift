"use client";

import React from "react";
import { productsData } from "@/data/siteData";
import { Section, ProductCard } from "@/components/CommonUI";
import { Search, Filter } from "lucide-react";

export default function UsedShoesPage() {
  return (
    <div className="pb-20">
      {/* Page Header */}
      <div className="bg-gray-50 border-b border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Used Shoes Collection
          </h1>
          <p className="text-xl text-gray-500 font-light max-w-2xl">
            Premium sorted second-hand shoes from China. Grade A quality for men, women, and children.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-28 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">
              <Filter size={16} /> Filter
            </button>
            <select className="flex-1 md:flex-none px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium bg-white focus:outline-none hover:bg-gray-50">
              <option>Sort by: Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {productsData.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              category={product.category}
              image={product.image}
              description={product.description}
            />
          ))}
          {/* Repeat for more items in a real app */}
          {productsData.map((product) => (
            <ProductCard
              key={product.id + "-copy"}
              title={product.title}
              category={product.category}
              image={product.image}
              description={product.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
