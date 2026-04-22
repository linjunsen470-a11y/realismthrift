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
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-montserrat text-[1.35rem] font-extrabold text-brand-dark">{title}</h2>
        <span className="rounded-[3px] bg-brand-gold px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brand-dark">
          {results.length} Results
        </span>
      </div>

      <div className="grid gap-4">
        {results.map((result) => (
          <Link
            key={result.id}
            href={result.href}
            className="group rounded-[6px] border border-[#eee] bg-[#faf9f4] px-5 py-4 transition-all hover:border-brand-red/20 hover:shadow-[0_6px_18px_rgba(0,0,0,0.06)]"
          >
            <div className="mb-2 flex items-center gap-3">
              <span className="rounded-[3px] bg-brand-dark px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                {result.type}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-black/45">
                {result.source === "blog" ? "Sanity Blog" : "Site Content"}
              </span>
            </div>
            <div className="mb-2 flex items-start justify-between gap-4">
              <h3 className="font-montserrat text-[1rem] font-bold text-brand-dark transition-colors group-hover:text-brand-red">
                {result.title}
              </h3>
              <ArrowRight
                className="shrink-0 text-brand-red transition-transform group-hover:translate-x-1"
                size={18}
                strokeWidth={2.5}
              />
            </div>
            <p className="text-sm leading-7 text-black/65">{result.description}</p>
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
      <section className="rt-page-hero bg-[linear-gradient(135deg,#1A1A1A_0%,#2a1515_60%,#C0392B_100%)]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/order/order-hero.jpg"
            alt="Search page background"
            fill
            priority
            className="object-cover opacity-[0.2]"
          />
        </div>
        <div className="rt-container relative z-10 text-center pb-12 w-full pt-16">
          <span className="rt-section-badge light inline-block mb-4">SITE SEARCH</span>
          <h1 className="rt-page-hero-title mb-4">
            Search <span className="text-brand-gold">Results</span>
          </h1>
          {query ? (
            <p className="rt-page-hero-sub max-w-[680px] mx-auto mb-7 leading-[1.7]">
              Showing results for <span className="font-bold text-brand-gold">&quot;{query}&quot;</span>.
              Search covers products, FAQ topics, ordering information, contact paths, and blog posts.
            </p>
          ) : (
            <p className="rt-page-hero-sub max-w-[680px] mx-auto mb-7 leading-[1.7]">
              Search for products, shipping questions, pricing, payment terms, samples, or blog topics.
            </p>
          )}
          <div className="flex justify-center gap-3 flex-wrap">
            {["used shoes", "price list", "shipping", "moq", "bags", "sample"].map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-[3px] text-[0.75rem] font-montserrat font-semibold uppercase tracking-[0.08em] hover:bg-white/18 transition-colors"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-brand-red py-7">
        <div className="rt-container max-w-[1280px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="text-white">
              <div className="font-montserrat text-[1.4rem] font-extrabold leading-none">{grouped.products.length}</div>
              <div className="text-[0.72rem] opacity-85 mt-1.5 tracking-wider uppercase">Products</div>
            </div>
            <div className="text-white">
              <div className="font-montserrat text-[1.4rem] font-extrabold leading-none">{grouped.support.length}</div>
              <div className="text-[0.72rem] opacity-85 mt-1.5 tracking-wider uppercase">FAQ & Pages</div>
            </div>
            <div className="text-white">
              <div className="font-montserrat text-[1.4rem] font-extrabold leading-none">{grouped.blog.length}</div>
              <div className="text-[0.72rem] opacity-85 mt-1.5 tracking-wider uppercase">Blog Posts</div>
            </div>
            <div className="text-white">
              <div className="font-montserrat text-[1.4rem] font-extrabold leading-none">{results.length}</div>
              <div className="text-[0.72rem] opacity-85 mt-1.5 tracking-wider uppercase">Total Matches</div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-[#f7f3ea] py-16">
        <div className="rt-container">
          {!query ? (
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
              <section className="bg-white border border-[#eee] rounded-[8px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div className="rt-subsection-heading">
                  <h2>Try Popular Searches</h2>
                  <div className="rt-section-divider" />
                </div>
                <div className="flex flex-wrap gap-3">
                  {["used brand clothes", "used shoes wholesale", "shipping to africa", "wholesale bags", "payment terms", "sample order"].map((term) => (
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
                    href="https://wa.me/8618800000001"
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
                      href="https://wa.me/8618800000001"
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
            <section className="bg-white border border-[#eee] rounded-[8px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <div className="mb-4 flex items-center gap-3 text-brand-red">
                <SearchX size={26} strokeWidth={2.4} />
                <h2 className="font-montserrat text-[1.5rem] font-extrabold text-brand-dark">No exact match found</h2>
              </div>
              <p className="max-w-3xl text-[0.95rem] leading-[1.9] text-black/65">
                We could not find an exact match for <span className="font-bold">&quot;{query}&quot;</span>.
                If you need a price list, shipping estimate, or a custom product mix, send your
                requirements directly and our sales team will reply within 12 hours.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 bg-brand-red px-5 py-3 rounded-[3px] text-[0.82rem] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#a52e23]"
                >
                  Send Inquiry
                  <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
                <a
                  href="https://wa.me/8618800000001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] px-5 py-3 rounded-[3px] text-[0.82rem] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#1da851]"
                >
                  <MessageCircle size={16} strokeWidth={2.5} />
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
