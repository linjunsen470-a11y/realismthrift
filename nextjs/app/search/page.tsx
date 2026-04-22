import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Search, SearchX } from "lucide-react";
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
          <div className="w-1 h-6 bg-brand-red rounded-full" />
          <h2 className="font-montserrat text-[1.25rem] font-black text-brand-dark uppercase tracking-tight">{title}</h2>
        </div>
        <span className="rounded-full bg-gray-100 border border-gray-200 px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-gray-500">
          {results.length} Found
        </span>
      </div>

      <div className="grid gap-4">
        {results.map((result) => (
          <Link
            key={result.id}
            href={result.href}
            className="group block relative rounded-[8px] border border-gray-100 bg-white px-6 py-5 transition-all hover:border-brand-red/10 hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="rounded-[2px] bg-brand-dark px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-white">
                {result.type}
              </span>
              <div className="h-px flex-1 bg-gray-100 group-hover:bg-brand-red/10 transition-colors" />
            </div>
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h3 className="font-montserrat text-[1.1rem] font-extrabold text-brand-dark mb-2 transition-colors group-hover:text-brand-red">
                  {result.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500 line-clamp-2">{result.description}</p>
              </div>
              <div className="shrink-0 w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 group-hover:border-brand-red/20 group-hover:text-brand-red transition-all">
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

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#1A1A1A_0%,#2a1515_60%,#C0392B_100%)]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/wholesale-inventory.webp"
            alt="RealismThrift wholesale inventory"
            fill
            priority
            className="object-cover opacity-[0.25]"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.34)_100%)]" />
        <div className="rt-container relative z-10 w-full py-14 text-center sm:py-16 lg:py-20">
          <span className="rt-section-badge light mb-3 inline-flex text-[10px] tracking-[0.2em] opacity-60 md:text-xs">
            SITE SEARCH
          </span>
          <h1 className="mb-5 font-montserrat text-[clamp(2.25rem,8vw,5rem)] font-light leading-[0.95] tracking-tight text-white sm:mb-6">
            Search <span className="font-black text-brand-gold italic">Results</span>
          </h1>
          {query && (
            <p className="mx-auto mb-8 max-w-[36rem] px-4 text-sm font-light leading-relaxed text-white/70 sm:text-base lg:text-lg">
              Displaying matches for <span className="font-bold text-white italic">&quot;{query}&quot;</span>.
            </p>
          )}
          <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3 px-4">
            {suggestedTerms.map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="rounded-[3px] border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-montserrat font-bold uppercase tracking-[0.12em] text-white transition-all hover:bg-white/25 sm:text-xs"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-20 -mt-4 sm:-mt-6 lg:-mt-8">
        <div className="rt-container">
          <div className="rounded-[4px] bg-[#b33528] px-5 py-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] sm:px-6 sm:py-7 md:py-9">
            <div className="grid grid-cols-2 items-center gap-y-8 text-center md:grid-cols-4 md:gap-x-12">
              <div className="border-r border-white/10 px-2 text-white md:border-r">
                <div className="mb-1 font-montserrat text-[1.5rem] font-black leading-none md:text-[2rem]">{grouped.products.length}</div>
                <div className="text-[9px] font-bold uppercase tracking-[0.15em] opacity-70 md:text-[0.7rem]">Inventory</div>
              </div>
              <div className="px-2 text-white md:border-r md:border-white/10">
                <div className="mb-1 font-montserrat text-[1.5rem] font-black leading-none md:text-[2rem]">{grouped.support.length}</div>
                <div className="text-[9px] font-bold uppercase tracking-[0.15em] opacity-70 md:text-[0.7rem]">Guidance</div>
              </div>
              <div className="border-r border-white/10 px-2 text-white md:border-r">
                <div className="mb-1 font-montserrat text-[1.5rem] font-black leading-none md:text-[2rem]">{grouped.blog.length}</div>
                <div className="text-[9px] font-bold uppercase tracking-[0.15em] opacity-70 md:text-[0.7rem]">Insights</div>
              </div>
              <div className="px-2 text-white">
                <div className="mb-1 font-montserrat text-[1.5rem] font-black leading-none md:text-[2rem]">{results.length}</div>
                <div className="text-[9px] font-bold uppercase tracking-[0.15em] opacity-70 md:text-[0.7rem]">Total Found</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-[#f7f3ea] py-12 sm:py-14 lg:py-16">
        <div className="rt-container">
          {!query ? (
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
              <section className="bg-white border border-[#eee] rounded-[8px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div className="rt-subsection-heading">
                  <h2>Try Popular Searches</h2>
                  <div className="rt-section-divider" />
                </div>
                <div className="flex flex-wrap gap-3">
                  {popularSearches.map((term) => (
                    <Link
                      key={term}
                      href={`/search?q=${encodeURIComponent(term)}`}
                      className="bg-[#F5F5F0] border border-[#e0e0e0] text-[#333] px-4 py-2 rounded-[3px] text-[0.78rem] font-montserrat font-semibold hover:border-brand-red/20 hover:text-brand-red transition-colors"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </section>

              <aside className="bg-brand-dark rounded-[8px] p-8 text-white shadow-[0_10px_34px_rgba(0,0,0,0.16)]">
                <div className="text-[0.72rem] text-brand-gold font-montserrat font-bold tracking-[0.14em] uppercase mb-3">
                  Need a direct answer?
                </div>
                <h2 className="font-montserrat text-[1.4rem] font-extrabold mb-4">
                  Send Your Requirements
                </h2>
                <p className="text-white/70 text-[0.9rem] leading-[1.8] mb-6">
                  If you already know what you need, contact our sales team directly for price lists,
                  shipping estimates, and recommended product categories.
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/#contact"
                    className="inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-dark px-5 py-3 rounded-[3px] text-[0.82rem] font-montserrat font-bold uppercase tracking-[0.08em] hover:bg-brand-gold-dark transition-colors"
                  >
                    Send Inquiry
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </Link>
                  <a
                    href="https://wa.me/8613367481710"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-[3px] text-[0.82rem] font-montserrat font-bold uppercase tracking-[0.08em] hover:bg-[#1da851] transition-colors"
                  >
                    <MessageCircle size={16} strokeWidth={2.5} />
                    WhatsApp
                  </a>
                </div>
              </aside>
            </div>
          ) : results.length ? (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
              <div className="grid gap-6">
                <ResultGroup title="Products" results={grouped.products} />
                <ResultGroup title="FAQ & Pages" results={grouped.support} />
                <ResultGroup title="Blog" results={grouped.blog} />
              </div>

              <aside className="space-y-6 lg:sticky lg:top-[88px]">
                <div className="bg-white border border-[#eee] rounded-[8px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                  <div className="text-[0.72rem] text-brand-red font-montserrat font-bold tracking-[0.14em] uppercase mb-2">
                    Search Summary
                  </div>
                  <h2 className="font-montserrat text-[1.05rem] font-extrabold text-brand-dark mb-3">
                    Current Query
                  </h2>
                  <div className="bg-[#F5F5F0] border border-[#e5e5e5] rounded-[6px] px-4 py-3 text-[0.95rem] font-semibold text-brand-dark">
                    {query}
                  </div>
                  <p className="text-[0.8rem] text-[#666] leading-[1.7] mt-4">
                    Results are filtered by exact term or close business synonym matches to keep the list relevant.
                  </p>
                </div>

                <div className="bg-brand-dark rounded-[8px] p-6 text-white shadow-[0_10px_34px_rgba(0,0,0,0.16)]">
                  <div className="text-[0.72rem] text-brand-gold font-montserrat font-bold tracking-[0.14em] uppercase mb-2">
                    Still not enough?
                  </div>
                  <h2 className="font-montserrat text-[1.15rem] font-extrabold mb-3">
                    Ask Our Sales Team
                  </h2>
                  <p className="text-white/70 text-[0.82rem] leading-[1.8] mb-5">
                    If you want a custom mix, current stock list, or a route-specific shipping quote,
                    send us your request directly.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/#contact"
                      className="inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-dark px-4 py-3 rounded-[3px] text-[0.78rem] font-montserrat font-bold uppercase tracking-[0.08em] hover:bg-brand-gold-dark transition-colors"
                    >
                      Get Price List
                    </Link>
                    <a
                      href="https://wa.me/8613367481710"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-[3px] text-[0.78rem] font-montserrat font-bold uppercase tracking-[0.08em] hover:bg-[#1da851] transition-colors"
                    >
                      <MessageCircle size={16} strokeWidth={2.5} />
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            <section className="rounded-[8px] border border-gray-100 bg-white px-6 py-12 text-center shadow-[0_10px_40px_rgba(0,0,0,0.03)] sm:px-8 sm:py-14 lg:px-10">
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-200">
                  <SearchX size={40} strokeWidth={1.5} />
                </div>
              </div>
              <h2 className="mb-4 font-montserrat text-[1.75rem] font-black text-brand-dark">No exact match found</h2>
              <p className="mx-auto mb-8 max-w-2xl text-[0.98rem] leading-relaxed text-gray-500 sm:mb-10 sm:text-[1rem]">
                We couldn&apos;t find an exact match for <span className="font-bold text-brand-dark">&quot;{query}&quot;</span>.
                Our sales team can help you find specific stocks, provide price lists, or calculate shipping costs manually.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/#contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-red px-8 py-4 rounded-[3px] text-[0.85rem] font-black uppercase tracking-wider text-white transition-all hover:bg-brand-red-dark hover:shadow-lg active:scale-[0.98]"
                >
                  Send Inquiry
                  <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
                <a
                  href="https://wa.me/8613367481710"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] px-8 py-4 rounded-[3px] text-[0.85rem] font-black uppercase tracking-wider text-white transition-all hover:bg-[#1da851] hover:shadow-lg active:scale-[0.98]"
                >
                  <MessageCircle size={18} strokeWidth={2.5} />
                  Chat on WhatsApp
                </a>
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
