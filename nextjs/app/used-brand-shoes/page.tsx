import "../internal-pages.css";
import Image from "next/image";
import Link from "next/link";
import { InquiryForm } from "@/components/InquiryForm";
import { QualityStandards } from "@/components/product/QualityStandards";
import { ProductTrustSections } from "@/components/product/ProductTrustSections";
import { ProductCTA } from "@/components/product/ProductCTA";
import { companyStats } from "@/data/siteData";
import { XCircle, CheckCircle2, Footprints, Sparkles, Package, Globe2, ShoppingBag, ClipboardList, Mail } from "lucide-react";
import { JsonLd, getProductSchema, getFaqSchema } from "@/components/JsonLd";

const shoeStandards = [
  { icon: <XCircle className="w-5 h-5 text-brand-red" />, title: 'Strict Glue Inspection', desc: 'Soles and uppers are checked for bonding integrity', isNegative: true },
  { icon: <XCircle className="w-5 h-5 text-brand-red" />, title: 'Surface Integrity', desc: 'Inspected for layers peeling or major cracking', isNegative: true },
  { icon: <XCircle className="w-5 h-5 text-brand-red" />, title: 'Complete Parts Check', desc: 'Ensuring laces, insoles, and tongues are present', isNegative: true },
  { icon: <XCircle className="w-5 h-5 text-brand-red" />, title: 'Deodorized & Sterilized', desc: 'Professional cleaning and UV treatment', isNegative: true },
  { icon: <XCircle className="w-5 h-5 text-brand-red" />, title: 'Sole Integrity', desc: 'Checked for breakage or separation', isNegative: true },
  { icon: <XCircle className="w-5 h-5 text-brand-red" />, title: 'Shape Maintenance', desc: 'Checking for crushing or major deformation', isNegative: true },
  { icon: <CheckCircle2 className="w-5 h-5 text-[#27AE60]" />, title: 'Carefully Paired', desc: 'Every sack contains matched pairs', isNegative: false },
  { icon: <CheckCircle2 className="w-5 h-5 text-[#27AE60]" />, title: 'Visible Branding', desc: 'Original brand label is clearly visible', isNegative: false },
  { icon: <CheckCircle2 className="w-5 h-5 text-[#27AE60]" />, title: 'Ready to Wear', desc: 'Items are sorted to be immediately wearable', isNegative: false }
];

const shoeFeatures = [
  { icon: <Footprints className="w-6 h-6 text-brand-gold" />, title: 'Rigorous Pairing', desc: 'Manual checking minimizes the risk of mismatched pairs.' },
  { icon: <Sparkles className="w-6 h-6 text-brand-gold" />, title: 'Professional Sterilization', desc: 'Cleaned, deodorized, and UV sterilized for international health standards.' },
  { icon: <Package className="w-6 h-6 text-brand-gold" />, title: 'Secure Sacking', desc: 'Hydraulic compressed packing to maximize container space and protect shoes.' },
  { icon: <Globe2 className="w-6 h-6 text-brand-gold" />, title: `${companyStats.countriesCount} Export Ports`, desc: 'Direct shipping to major ports in Africa, Middle East, and Southeast Asia.' }
];

const shoeFaqs = [
  { q: 'How many pairs fit in a 40HQ container?', a: 'A 40HQ container typically fits around 20,000 to 22,000 pairs of shoes depending on the mix of boots and sneakers.' },
  { q: 'Can I order just Nike or Adidas?', a: 'Yes, we offer brand-specific sorting. Brands like Nike/Adidas have a separate pricing tier and specific MOQ.' },
  { q: 'Do you provide the shoes in boxes?', a: 'To maximize shipping efficiency and lower your costs, we typically pack shoes in woven sacks. Box packing is available upon request for selected orders.' }
];

export const metadata = {
  title: "Used Brand Shoes Wholesale | Nike, Adidas, Jordan Supplier",
  description: `Wholesale supplier of sorted second-hand branded shoes. Nike, Adidas, Jordan, and 30+ brands. Paired, cleaned, graded, and packed for export.`,
  openGraph: {
    title: "Used Brand Shoes Wholesale | Sorted Export Supplier",
    description: "Sorted second-hand branded shoes from China. Nike, Adidas, and more. Manual checks for pairing, condition, and packing.",
    images: ['/images/shoes/wholesale-sneakers-assorted-styles-grid.webp'],
  },
  alternates: {
    canonical: "/used-brand-shoes",
  },
};

export default function UsedBrandShoesPage() {
  const productSchema = getProductSchema({
    name: "Used Brand Shoes Wholesale",
    description: "Wholesale supplier of sorted second-hand branded shoes from China. Nike, Adidas, Jordan, and 30+ brands.",
    image: "https://www.realismthrift.com/images/shoes/wholesale-sneakers-assorted-styles-grid.webp",
    url: "https://www.realismthrift.com/used-brand-shoes",
    lowPrice: "0.8",
    highPrice: "6.0",
    offerCount: 5,
  });

  const faqSchema = getFaqSchema(shoeFaqs);

  return (
    <main className="bg-white">
      <JsonLd data={productSchema} />
      <JsonLd data={faqSchema} />
      {/* PAGE HERO */}
      <section className="rt-page-hero">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/shoes/wholesale-sneakers-assorted-styles-grid.webp" 
            alt="RealismThrift Shoe Export Hub - Industrial Scale Wholesale Branded Sneakers and Nike Adidas Jordan Supplier in China" 
            fill 
            sizes="100vw"
            className="object-cover" 
            priority 
          />
        </div>
        <div className="rt-page-hero-overlay" />
        <div className="rt-container relative z-10 text-center md:text-left">
          <div className="rt-fade-in">
            <nav className="rt-breadcrumb mb-5 justify-center md:justify-start">
              <Link href="/">Home</Link>
              <span>›</span>
              <span className="text-white/70">Used Brand Shoes</span>
            </nav>
            <div className="inline-block bg-brand-red text-white font-montserrat font-bold text-[0.65rem] tracking-[0.12em] px-[0.875rem] py-[0.3rem] rounded-[2px] mb-[1rem] uppercase">
              Nike · Adidas · A-Grade Quality
            </div>
            <h1 className="rt-page-hero-title mb-5 text-[clamp(1.75rem,5vw,2.75rem)] leading-[1.1]">
              Used Brand Shoes <span className="text-brand-gold">Wholesale</span>
            </h1>
            <p className="rt-page-hero-sub max-w-[620px] mb-9 leading-[1.8] text-[1.05rem]">
              Wholesale second-hand branded shoes — Nike, Adidas, Jordan, and 30+ brands. Cleaning, pairing, grading, and export packing support.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <a href="#inquiry" className="bg-brand-gold text-brand-dark px-6 md:px-10 py-3 md:py-4 rounded-[3px] font-bold font-montserrat text-[0.9rem] hover:bg-brand-gold-dark transition-all shadow-[0_10px_20px_rgba(240,180,41,0.2)] whitespace-nowrap">
                Get Price Now →
              </a>
              <a href="https://wa.me/8613367481710" target="_blank" rel="noopener noreferrer" className="bg-white/10 border border-white/30 text-white px-6 md:px-10 py-3 md:py-4 rounded-[3px] font-semibold font-montserrat text-[0.9rem] hover:bg-white/20 transition-all whitespace-nowrap">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* KEY STATS BAR */}
      <div className="bg-brand-dark py-4">
        <div className="max-w-[1280px] mx-auto px-8 flex flex-wrap gap-6 justify-around items-center">
          {[
            { num: "30+", label: "Shoe Brands" },
            { num: "A-Grade", label: "Quality Standard" },
            { num: "25–30kg", label: "Per Sack" },
            { num: "8,000+", label: "Pairs/20ft" },
            { num: "Cleaned", label: "Before Packing" }
          ].map((stat) => (
            <div key={stat.num} className="text-center text-white">
              <div className="font-montserrat font-black text-[1.25rem] text-brand-gold">{stat.num}</div>
              <div className="text-[0.65rem] opacity-85 uppercase tracking-[0.07em] mt-[0.15rem]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-[1280px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">
        
        <div className="min-w-0">
          {/* BRAND LIST */}
          <section className="mb-12">
            <div className="rt-subsection-heading">
              <h2>Available Shoe Brands</h2>
              <div className="rt-section-divider" />
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {['Nike', 'Adidas', 'Jordan', 'New Balance', 'Puma', 'Reebok', 'Converse', 'Vans', 'Timberland', 'Under Armour', 'Skechers', 'ASICS', 'Salomon', 'Merrell', 'Clarks', 'Dr. Martens', 'UGG', 'Birkenstock', 'Steve Madden', 'Cole Haan', 'Guess', 'Lacoste', 'Polo Ralph Lauren', 'Tommy Hilfiger', 'Calvin Klein', 'Fila', 'Champion', 'Kappa', 'Ellesse', 'Lotto'].map(brand => (
                <span key={brand} className="bg-[#F5F5F0] border border-[#e0e0e0] text-[#333] px-3.5 py-1.5 rounded-[2px] text-[0.8rem] font-montserrat font-semibold">
                  {brand}
                </span>
              ))}
            </div>
          </section>

          {/* PRODUCT SHOWCASE */}
          <section className="mb-12">
            <div className="rt-subsection-heading">
              <h2>Product Categories</h2>
              <div className="rt-section-divider" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { title: 'Used Nike Shoes', img: '/images/shoes/nike-air-jordan-1-high-mint-green-white.webp', desc: 'Nike Air, Force 1, Jordan', spec: '25kg/sack (~40 pairs)' },
                { title: 'Used Adidas Shoes', img: '/images/shoes/adidas-retropy-grey-white-classic-sneakers.webp', desc: 'Ultraboost, Stan Smith, NMD', spec: '25kg/sack (~40 pairs)' },
                { title: 'Used Brand Sneakers', img: '/images/shoes/designer-sneakers-assorted-wholesale-display.webp', desc: 'Mixed branded shoes', spec: '28kg/sack (~40 pairs)' },
                { title: 'Used Brand Boots', img: '/images/shoes/timberland-6-inch-premium-wheat-boots.webp', desc: 'Timberland, Dr. Martens', spec: '30kg/sack (~25 pairs)' },
                { title: 'Used Brand Sandals', img: '/images/shoes/cat-leather-sandals-brown-rugged-sole.webp', desc: 'Birkenstock, Teva, UGG', spec: '20kg/sack (~50 pairs)' },
                { title: 'Used Mixed Shoes', img: '/images/shoes/mixed-sports-shoes-nike-puma-display.webp', desc: 'All brands mixed', spec: '25kg/sack (~40 pairs)' }
              ].map(prod => (
                <div key={prod.title} className="bg-white border border-[#eee] rounded-[6px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <div className="relative overflow-hidden h-[180px]">
                    <Image src={prod.img} alt={`RealismThrift Wholesale ${prod.title} - Sorted Branded Second-Hand Shoes Bulk Inventory from China Factory`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                    <div className="absolute top-2 left-2 bg-brand-dark text-brand-gold text-[0.65rem] font-bold px-2 py-1 rounded-[2px] font-montserrat">
                      A-GRADE
                    </div>
                  </div>
                  <div className="p-3.5">
                    <h3 className="font-montserrat text-[0.875rem] font-bold text-brand-dark mb-1">{prod.title}</h3>
                    <p className="text-[0.75rem] text-[#888] mb-2">{prod.desc}</p>
                    <div className="flex justify-between items-center break-all gap-1">
                      <span className="text-[0.7rem] text-brand-red font-bold flex-1">{prod.spec}</span>
                      <a 
                        href="#inquiry" 
                        className="bg-brand-dark text-white text-[0.7rem] px-3 py-1.5 rounded-[2px] font-semibold font-montserrat shrink-0 hover:bg-brand-red transition-colors"
                        aria-label={`Inquire about ${prod.title}`}
                      >
                        Inquire
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SHOE SORTING PROCESS */}
          <section className="mb-12">
            <div className="rt-subsection-heading">
              <h2>Shoe Sorting & Cleaning Process</h2>
              <div className="rt-section-divider" />
            </div>
            <p className="text-[0.9375rem] text-[#555] leading-[1.75] mb-7">
              Used brand shoes require a more detailed sorting process than clothing. Our dedicated shoe sorting team handles each pair individually to ensure quality and pairing accuracy.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { step: '01', title: 'Collection & Pairing Check', img: '/images/shoes/nike-dunk-low-assorted-colors-batch.webp', desc: 'All incoming shoes are first checked for pairs. Unpaired shoes are immediately separated. We only export complete pairs. Each pair is tagged with a temporary ID for tracking through the sorting process.' },
                { step: '02', title: 'Brand Identification', img: '/images/shoes/mixed-premium-sneakers-grid-display.webp', desc: 'Trained sorters identify each brand and model. Nike, Adidas, Jordan, and other brands are sorted into dedicated lots. Brand labels, tongue tags, and sole markings are checked before grading.' },
                { step: '03', title: 'Cleaning & Deodorizing', img: '/images/shoes/nike-air-max-dunk-low-white-black-display.webp', desc: 'All shoes are cleaned using professional equipment. Soles are scrubbed, uppers are wiped down, and interiors are deodorized. Shoes with persistent odors or mold are rejected regardless of brand.' },
                { step: '04', title: 'Quality Grading', img: '/images/shoes/nike-revolution-black-white-running-shoe-top.webp', desc: 'Each pair is graded A, B, or C based on 8 quality criteria: sole condition, upper condition, lining integrity, zipper/lace completeness, odor level, structural shape, brand label clarity, and overall wearability.' },
              ].map(process => (
                <div key={process.step} className="bg-white border border-[#eee] rounded-[6px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <div className="relative h-[160px]">
                    <Image src={process.img} alt={`RealismThrift Shoe Quality Control Step ${process.step} - ${process.title} for Professional Bulk Branded Sneakers Export`} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <span className="bg-brand-dark text-brand-gold font-montserrat text-[0.75rem] font-extrabold px-2.5 py-1 rounded-[2px]">STEP {process.step}</span>
                      <h3 className="font-montserrat text-[0.9375rem] font-bold text-brand-dark m-0">{process.title}</h3>
                    </div>
                    <p className="text-[0.8125rem] text-[#666] leading-[1.7] m-0">{process.desc}</p>
                  </div>
                </div>
              ))}
              <div className="sm:col-span-2 bg-white border border-[#eee] rounded-[6px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)] flex flex-col md:flex-row">
                <div className="relative md:w-[300px] h-[200px] md:h-auto shrink-0">
                   <Image src="/images/shoes/timberland-6-inch-premium-wheat-boots-batch.webp" alt="RealismThrift Export Logistics - Final Sorting and Labeling of Branded Shoes for Global Wholesale Distribution" fill sizes="(min-width: 768px) 300px, 100vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <span className="bg-brand-dark text-brand-gold font-montserrat text-[0.75rem] font-extrabold px-2.5 py-1 rounded-[2px]">STEP 05</span>
                    <h3 className="font-montserrat text-[0.9375rem] font-bold text-brand-dark m-0">Packing by Category</h3>
                  </div>
                  <p className="text-[0.8125rem] text-[#666] leading-[1.7] m-0">Graded shoes are packed by brand category into woven sacks. Each sack is labeled with brand, grade, weight, and pair count. Sacks are sealed and weighed to exact specifications before container loading.</p>
                </div>
              </div>
            </div>
          </section>

          {/* QUALITY STANDARDS */}
          <QualityStandards title="A-Grade Shoe Quality Standards" standards={shoeStandards} />

          {/* TRUST SECTIONS */}
          <ProductTrustSections features={shoeFeatures} faqs={shoeFaqs} />

          {/* SPECS TABLE */}
          <section className="scroll-mt-24 mb-12">
            <div className="rt-subsection-heading">
              <h2>Product Specifications</h2>
              <div className="rt-section-divider" />
            </div>
            <div className="rt-table-wrap overflow-x-auto rounded-[6px] shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
              <table className="w-full border-collapse text-[0.8125rem] bg-white min-w-[650px]">
                <thead>
                  <tr className="bg-brand-dark text-white text-left font-montserrat">
                    <th className="p-3.5 px-4 font-semibold">Category</th>
                    <th className="p-3.5 px-4 font-semibold">Sack Weight</th>
                    <th className="p-3.5 px-4 font-semibold">Pairs/Sack</th>
                    <th className="p-3.5 px-4 font-semibold">MOQ</th>
                    <th className="p-3.5 px-4 font-semibold">20ft Load</th>
                    <th className="p-3.5 px-4 font-semibold">40ft Load</th>
                  </tr>
                </thead>
                <tbody className="font-open-sans">
                  {[
                    { cat: 'Brand Sneakers (Nike/Adidas)', w: '25–28 kg', p: '~40 pairs', moq: '≥200 pairs', l20: '~8,000 pairs', l40: '~20,000 pairs' },
                    { cat: 'Brand Boots', w: '28–30 kg', p: '~25 pairs', moq: '≥100 pairs', l20: '~6,000 pairs', l40: '~14,000 pairs' },
                    { cat: 'Brand Sandals / Slippers', w: '20–22 kg', p: '~50 pairs', moq: '≥200 pairs', l20: '~10,000 pairs', l40: '~22,000 pairs' },
                    { cat: 'Mixed Brand Shoes', w: '25 kg', p: '~40 pairs', moq: '≥500 pairs', l20: '~8,500 pairs', l40: '~19,000 pairs' },
                    { cat: 'Jordan / Selected Brand', w: '28–30 kg', p: '~35 pairs', moq: '≥100 pairs', l20: '~7,500 pairs', l40: '~17,000 pairs' }
                  ].map((row, i) => (
                    <tr key={row.cat} className={`${i % 2 === 1 ? 'bg-[#fafafa]' : 'bg-white'} border-b border-[#f0f0f0]`}>
                      <td className="p-3 px-4 font-semibold text-brand-dark">{row.cat}</td>
                      <td className="p-3 px-4 text-[#555]">{row.w}</td>
                      <td className="p-3 px-4 text-[#555]">{row.p}</td>
                      <td className="p-3 px-4">
                        <span className="bg-brand-gold text-brand-dark px-2 py-0.5 rounded-[2px] text-[0.7rem] font-bold font-montserrat">{row.moq}</span>
                      </td>
                      <td className="p-3 px-4 text-[#555]">{row.l20}</td>
                      <td className="p-3 px-4 text-[#555]">{row.l40}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <aside>
          <div id="inquiry" className="sticky top-[100px] rt-sidebar-card rt-shoes-inquiry-card">
            <div className="rt-sidebar-card-title">
              <h3 className="text-[1rem] font-extrabold m-0 uppercase tracking-wider">Get Shoe Price Now</h3>
              <p className="text-[0.7rem] opacity-80 m-0 mt-0.5 font-open-sans normal-case tracking-normal">Reply within 12 hours · Samples available</p>
            </div>
            
            <div className="p-5">
              {/* INQUIRY FORM */}
              <InquiryForm variant="sidebar" />

              <div className="mt-4 pt-4">
                <a href="https://wa.me/8613367481710" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-[3px] font-montserrat font-bold text-[0.8125rem] uppercase tracking-wider hover:bg-[#1da851] transition-all shadow-sm">
                  WhatsApp Us Directly
                </a>
              </div>
            </div>
          </div>

          {/* QUICK SPECS BOX */}
          <div className="bg-brand-dark rounded-[8px] p-6 mt-6 text-white font-open-sans">
            <h4 className="font-montserrat text-[0.9rem] font-extrabold m-0 mb-4 text-brand-gold">Quick Specs</h4>
            <div className="flex justify-between py-2 border-b border-white/10 text-[0.8rem]">
              <span className="text-white/60">MOQ</span>
              <span className="font-semibold">200 pairs</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10 text-[0.8rem]">
              <span className="text-white/60">Sack Weight</span>
              <span className="font-semibold">25–30 kg</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10 text-[0.8rem]">
              <span className="text-white/60">Pairs/Sack</span>
              <span className="font-semibold">~40 pairs</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10 text-[0.8rem]">
              <span className="text-white/60">Quality</span>
              <span className="font-semibold">A/B Grade</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10 text-[0.8rem]">
              <span className="text-white/60">Lead Time</span>
              <span className="font-semibold">7–14 days</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10 text-[0.8rem]">
              <span className="text-white/60">Shipping</span>
              <span className="font-semibold">FOB Guangzhou</span>
            </div>
          </div>
        </aside>

      </div>

      {/* CTA BLOCK */}
      <ProductCTA 
        title="Ready to Order Used Brand Shoes?"
        description="Get a free price quotation within 12 hours. Minimum order 200 pairs. Worldwide shipping available."
        whatsappMessage="Hi, I want to wholesale used brand shoes. Can I get a price list?"
      />
    </main>
  );
}
