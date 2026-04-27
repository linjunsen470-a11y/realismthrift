import "../internal-pages.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, SearchX } from "lucide-react";
import { getAllBlogPosts } from "@/lib/blog";
import { searchAllContent, type SearchResult } from "@/lib/search";

export const metadata: Metadata = {
  title: "Search | RealismThrift",
  description: "Search products, FAQs, order information, and blog content.",
  robots: {
    index: false,
    follow: false,
  },
};

const suggestedTerms = ["used shoes", "clothes", "price list", "shipping", "moq", "bags"];
const popularSearches = [
  "used brand clothes",
  "used shoes wholesale",
  "shipping to africa",
  "wholesale bags",
  "payment terms",
  "sample order",
];

function splitResults(results: SearchResult[]) {
  return {
    products: results.filter((result) => result.type === "product"),
    support: results.filter((result) =>
      result.type === "faq" || result.type === "page" || result.type === "contact"
    ),
    blog: results.filter((result) => result.type === "blog"),
  };
}

function SearchHero({
  query,
  showSuggestedTerms,
}: {
  query: string;
  showSuggestedTerms: boolean;
}) {
  return (
    <section className="rt-page-hero">
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/wholesale-inventory.webp"
          alt="RealismThrift Wholesale Inventory - Supplier of Sorted Second Hand Branded Clothes, Shoes, and Bags from China"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      </div>
      <div className="rt-page-hero-overlay" />
 
      <div className="rt-container relative z-10 text-center md:text-left">
        <div className="rt-fade-in">
          <nav className="rt-breadcrumb mb-5 justify-center md:justify-start">
            <Link href="/">Home</Link>
            <span>›</span>
            <span className="text-white/70">Search</span>
          </nav>
          <div className="inline-block bg-brand-red text-white font-montserrat font-bold text-[0.65rem] tracking-[0.12em] px-[0.875rem] py-[0.3rem] rounded-[2px] mb-[1rem] uppercase">
            Site Search · RealismThrift
          </div>
          <h1 className="rt-page-hero-title mb-5 text-[clamp(2rem,8vw,4rem)] leading-[1.1] tracking-tight">
            Search <span className="font-black text-brand-gold italic">Results</span>
          </h1>
          {query ? (
            <p className="rt-page-hero-sub max-w-[620px] mb-8 leading-relaxed text-[1.05rem]">
              Displaying matches for <span className="font-bold text-white italic">&quot;{query}&quot;</span>.
            </p>
          ) : (
            <p className="rt-page-hero-sub max-w-[620px] mb-8 leading-relaxed text-[1.05rem]">
              Search products, shipping guidance, pricing, payment terms, and blog insights.
            </p>
          )}

          {showSuggestedTerms ? (
            <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
              {suggestedTerms.map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="bg-white/10 border border-white/25 text-white px-4 py-2.5 rounded-[2px] font-montserrat font-bold text-[0.7rem] uppercase tracking-wider hover:bg-white/20 transition-all"
                >
                  {term}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ResultGroup({
  title,
  results,
}: {
  title: string;
  results: SearchResult[];
}) {
  if (!results.length) return null;

  return (
    <section className="rounded-[8px] border border-[#eee] bg-white p-6 shadow-[0_4px_18px_rgba(0,0,0,0.05)]">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1 rounded-full bg-brand-red" />
          <h2 className="font-montserrat text-[1.25rem] font-black uppercase tracking-tight text-brand-dark">
            {title}
          </h2>
        </div>
        <span className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-gray-500">
          {results.length} Found
        </span>
      </div>

      <div className="grid gap-4">
        {results.map((result) => (
          <Link
            key={result.id}
            href={result.href}
            className="group block rounded-[8px] border border-gray-100 bg-white px-6 py-5 transition-all hover:border-brand-red/10 hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="rounded-[2px] bg-brand-dark px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-white">
                {result.type}
              </span>
              <div className="h-px flex-1 bg-gray-100 transition-colors group-hover:bg-brand-red/10" />
            </div>
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h3 className="mb-2 font-montserrat text-[1.1rem] font-extrabold text-brand-dark transition-colors group-hover:text-brand-red">
                  {result.title}
                </h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">{result.description}</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-100 text-gray-300 transition-all group-hover:border-brand-red/20 group-hover:text-brand-red">
                <ArrowRight size={18} strokeWidth={2.5} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const posts = query ? await getAllBlogPosts() : [];
  const results = query ? searchAllContent(query, posts) : [];
  const grouped = splitResults(results);
  const hasQuery = Boolean(query);
  const hasResults = results.length > 0;

  return (
    <main className="bg-[#f7f3ea]">
      <SearchHero query={query} showSuggestedTerms={!hasQuery || hasResults} />

      {hasQuery && hasResults ? (
        <div className="border-b border-black/5 bg-white/75">
          <div className="rt-container py-5 sm:py-6">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { label: "Inventory", value: grouped.products.length },
                { label: "Guidance", value: grouped.support.length },
                { label: "Insights", value: grouped.blog.length },
                { label: "Total Found", value: results.length },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[6px] border border-[#e8dfd2] bg-white px-4 py-4 text-center shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
                >
                  <div className="mb-1 font-montserrat text-[1.35rem] font-black leading-none text-brand-red md:text-[1.75rem]">
                    {item.value}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8e7d70] md:text-[0.68rem]">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <section className="py-10 pb-24 sm:py-12 sm:pb-20 lg:py-14">
        <div className="rt-container">
          {!hasQuery ? (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <section className="rounded-[8px] border border-[#eee] bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div className="rt-subsection-heading">
                  <h2>Try Popular Searches</h2>
                  <div className="rt-section-divider" />
                </div>
                <div className="flex flex-wrap gap-3">
                  {popularSearches.map((term) => (
                    <Link
                      key={term}
                      href={`/search?q=${encodeURIComponent(term)}`}
                      className="rounded-[3px] border border-[#e0e0e0] bg-[#F5F5F0] px-4 py-2 text-[0.78rem] font-montserrat font-semibold text-[#333] transition-colors hover:border-brand-red/20 hover:text-brand-red"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </section>

              <aside className="rounded-[8px] bg-brand-dark p-8 text-white shadow-[0_10px_34px_rgba(0,0,0,0.16)]">
                <div className="mb-3 text-[0.72rem] font-montserrat font-bold uppercase tracking-[0.14em] text-brand-gold">
                  Need a direct answer?
                </div>
                <h2 className="mb-4 font-montserrat text-[1.4rem] font-extrabold">
                  Send Your Requirements
                </h2>
                <p className="mb-6 text-[0.9rem] leading-[1.8] text-white/70">
                  If you already know what you need, contact our sales team directly for price lists,
                  shipping estimates, and recommended product categories.
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/#contact"
                    className="inline-flex items-center justify-center gap-2 rounded-[3px] bg-brand-gold px-5 py-3 text-[0.82rem] font-montserrat font-bold uppercase tracking-[0.08em] text-brand-dark transition-colors hover:bg-brand-gold-dark"
                  >
                    Send Inquiry
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </Link>
                  <a
                    href="https://wa.me/8613367481710"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-[3px] bg-[#25D366] px-5 py-3 text-[0.82rem] font-montserrat font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#1da851]"
                  >
                    <MessageCircle size={16} strokeWidth={2.5} />
                    WhatsApp
                  </a>
                </div>
              </aside>
            </div>
          ) : hasResults ? (
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_320px]">
              <div className="grid gap-6">
                <ResultGroup title="Products" results={grouped.products} />
                <ResultGroup title="FAQ & Pages" results={grouped.support} />
                <ResultGroup title="Blog" results={grouped.blog} />
              </div>

              <aside className="space-y-6 lg:sticky lg:top-[88px]">
                <div className="rounded-[8px] border border-[#eee] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                  <div className="mb-2 text-[0.72rem] font-montserrat font-bold uppercase tracking-[0.14em] text-brand-red">
                    Search Summary
                  </div>
                  <h2 className="mb-3 font-montserrat text-[1.05rem] font-extrabold text-brand-dark">
                    Current Query
                  </h2>
                  <div className="rounded-[6px] border border-[#e5e5e5] bg-[#F5F5F0] px-4 py-3 text-[0.95rem] font-semibold text-brand-dark">
                    {query}
                  </div>
                  <p className="mt-4 text-[0.8rem] leading-[1.7] text-[#666]">
                    Results are filtered by exact term or close business synonym matches to keep the
                    list relevant.
                  </p>
                </div>

                <div className="rounded-[8px] bg-brand-dark p-6 text-white shadow-[0_10px_34px_rgba(0,0,0,0.16)]">
                  <div className="mb-2 text-[0.72rem] font-montserrat font-bold uppercase tracking-[0.14em] text-brand-gold">
                    Still not enough?
                  </div>
                  <h2 className="mb-3 font-montserrat text-[1.15rem] font-extrabold">
                    Ask Our Sales Team
                  </h2>
                  <p className="mb-5 text-[0.82rem] leading-[1.8] text-white/70">
                    If you want a custom mix, current stock list, or a route-specific shipping quote,
                    send us your request directly.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/#contact"
                      className="inline-flex items-center justify-center gap-2 rounded-[3px] bg-brand-gold px-4 py-3 text-[0.78rem] font-montserrat font-bold uppercase tracking-[0.08em] text-brand-dark transition-colors hover:bg-brand-gold-dark"
                    >
                      Get Price List
                    </Link>
                    <a
                      href="https://wa.me/8613367481710"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-[3px] bg-[#25D366] px-4 py-3 text-[0.78rem] font-montserrat font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#1da851]"
                    >
                      <MessageCircle size={16} strokeWidth={2.5} />
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            <section className="mx-auto max-w-4xl rounded-[10px] border border-[#eee4d7] bg-white px-6 py-8 shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:px-8 sm:py-10">
              <div className="mx-auto max-w-2xl text-center">
                <div className="mb-5 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#faf7f1] text-[#d7cfc5]">
                    <SearchX size={32} strokeWidth={1.75} />
                  </div>
                </div>
                <h2 className="mb-3 font-montserrat text-[1.85rem] font-black leading-tight text-brand-dark sm:text-[2.2rem]">
                  No exact match found
                </h2>
                <p className="mx-auto mb-7 max-w-xl text-[0.98rem] leading-relaxed text-gray-500 sm:text-[1rem]">
                  We couldn&apos;t find an exact match for <span className="font-bold text-brand-dark">&quot;{query}&quot;</span>.
                  Send your request directly and our team can recommend current stock, pricing, and
                  shipping options.
                </p>

                <div className="mb-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href="/#contact"
                    className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-[3px] bg-brand-red px-7 py-3.5 text-[0.82rem] font-black uppercase tracking-[0.1em] text-white transition-all hover:bg-brand-red-dark hover:shadow-lg active:scale-[0.98]"
                  >
                    Send Inquiry
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </Link>
                  <a
                    href="https://wa.me/8613367481710"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-[3px] bg-[#25D366] px-7 py-3.5 text-[0.82rem] font-black uppercase tracking-[0.1em] text-white transition-all hover:bg-[#1da851] hover:shadow-lg active:scale-[0.98]"
                  >
                    <MessageCircle size={18} strokeWidth={2.5} />
                    Chat on WhatsApp
                  </a>
                </div>

                <div className="rounded-[8px] border border-[#efe6db] bg-[#fbf8f3] px-5 py-5 text-left">
                  <div className="mb-3 text-center text-[0.72rem] font-montserrat font-bold uppercase tracking-[0.14em] text-[#8e7d70]">
                    Try These Searches Instead
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 sm:flex-nowrap sm:gap-3">
                    {suggestedTerms.map((term) => (
                      <Link
                        key={term}
                        href={`/search?q=${encodeURIComponent(term)}`}
                        className="whitespace-nowrap rounded-[3px] border border-[#dfd2c2] bg-white px-3 py-2 text-[0.74rem] font-montserrat font-bold uppercase tracking-[0.08em] text-brand-dark transition-colors hover:border-brand-red/25 hover:text-brand-red sm:px-4"
                      >
                        {term}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
