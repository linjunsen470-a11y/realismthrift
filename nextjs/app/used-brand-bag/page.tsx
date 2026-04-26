import "../internal-pages.css";
import Image from "next/image";
import Link from "next/link";
import { InquiryForm } from "@/components/InquiryForm";
import { QualityStandards } from "@/components/product/QualityStandards";
import { ProductTrustSections } from "@/components/product/ProductTrustSections";
import { ProductCTA } from "@/components/product/ProductCTA";
import { companyStats } from "@/data/siteData";
import { XCircle, CheckCircle2, ShieldCheck, Sparkles, Globe2, Camera, Footprints, ShoppingBag, ClipboardList, Mail } from "lucide-react";
import { JsonLd, getProductSchema, getFaqSchema } from "@/components/JsonLd";

const bagStandards = [
  { icon: <XCircle className="w-5 h-5 text-[#C0392B]" />, title: 'No Broken Zippers', desc: 'All zippers open and close smoothly without snagging', isNegative: true },
  { icon: <XCircle className="w-5 h-5 text-[#C0392B]" />, title: 'No Torn Straps', desc: 'Handles and straps fully intact, no fraying or tears', isNegative: true },
  { icon: <XCircle className="w-5 h-5 text-[#C0392B]" />, title: 'No Heavy Stains', desc: 'Interior and exterior cleaned, no permanent discoloration', isNegative: true },
  { icon: <XCircle className="w-5 h-5 text-[#C0392B]" />, title: 'No Broken Hardware', desc: 'All buckles, clasps, and rings fully functional', isNegative: true },
  { icon: <XCircle className="w-5 h-5 text-[#C0392B]" />, title: 'No Peeling Lining', desc: 'Interior lining intact, no separation or peeling', isNegative: true },
  { icon: <XCircle className="w-5 h-5 text-[#C0392B]" />, title: 'No Structural Damage', desc: 'Bag holds its shape, no crushing or deformation', isNegative: true },
  { icon: <CheckCircle2 className="w-5 h-5 text-[#27AE60]" />, title: 'Complete Accessories', desc: 'Dust bags, straps, and original accessories included where available', isNegative: false },
  { icon: <CheckCircle2 className="w-5 h-5 text-[#27AE60]" />, title: 'Brand Label Visible', desc: 'Original brand label or embossing clearly present', isNegative: false },
  { icon: <CheckCircle2 className="w-5 h-5 text-[#27AE60]" />, title: 'Individually Wrapped', desc: 'Each bag wrapped in plastic before packing', isNegative: false }
];

const bagFeatures = [
  { icon: <ShieldCheck className="w-6 h-6 text-brand-gold" />, title: '6-Pt Hardware Check', desc: 'Every zipper, clasp, and ring is tested 3 times for 100% functionality.' },
  { icon: <Sparkles className="w-6 h-6 text-brand-gold" />, title: 'Deep Interior Cleaning', desc: 'Specialized cleaning for leather, canvas and nylon. Deodorized interiors.' },
  { icon: <Globe2 className="w-6 h-6 text-brand-gold" />, title: 'Worldwide Export', desc: `12+ years experience in global logistics and exporting to ${companyStats.countriesCount} countries.` },
  { icon: <Camera className="w-6 h-6 text-brand-gold" />, title: 'Photo Verification', desc: 'Live photos and videos of your specific order sent before shipment.' }
];

const bagFaqs = [
  { q: 'What is the minimum order quantity for bags?', a: 'Minimum order is 100 pieces for sorted brand categories, or 200 pieces for mixed lots.' },
  { q: 'Can I pick specific models or sizes?', a: 'You can specify categories (Handbags, Backpacks, etc.). For specific high-demand models, we offer premium sorting at custom rates.' },
  { q: 'How are the bags packed?', a: 'Each bag is individually wrapped in plastic to prevent scratching, then packed in woven sacks or cartons.' }
];

export const metadata = {
  title: "Used Brand Bags Wholesale | Coach, MK, Kate Spade Supplier",
  description: `China's premium wholesale exporter of second-hand branded handbags, backpacks, and luggage. Coach, Michael Kors, Kate Spade, and more. 6-point inspection, individually wrapped. Exporting to ${companyStats.countriesCount} countries.`,
  openGraph: {
    title: "Used Brand Bags Wholesale | China's Leading Exporter",
    description: "Premium second-hand branded bags. 6-point quality check. Individually wrapped for protection. Global shipping.",
    images: ['/images/bags/loewe-puzzle-bag-assorted-colors-display.webp'],
  },
  alternates: {
    canonical: "/used-brand-bag",
  },
};

export default function UsedBrandBagPage() {
  const productSchema = getProductSchema({
    name: "Used Brand Bags Wholesale",
    description: "China's premium wholesale exporter of second-hand branded handbags, backpacks, and luggage. Coach, Michael Kors, Kate Spade, and more.",
    image: "https://www.realismthrift.com/images/bags/loewe-puzzle-bag-assorted-colors-display.webp",
    url: "https://www.realismthrift.com/used-brand-bag"
  });

  const faqSchema = getFaqSchema(bagFaqs);

  return (
    <main className="bg-white">
      <JsonLd data={productSchema} />
      <JsonLd data={faqSchema} />
      {/* PAGE HERO */}
      <section className="rt-page-hero">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/bags/loewe-puzzle-bag-assorted-colors-display.webp" 
            alt="RealismThrift Designer Bag Warehouse - Premium Wholesale Used Branded Handbags and Backpacks Export from China" 
            fill 
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
              <span className="text-white/70">Used Brand Bags</span>
            </nav>
            <div className="inline-block bg-brand-red text-white font-montserrat font-bold text-[0.65rem] tracking-[0.12em] px-[0.875rem] py-[0.3rem] rounded-[2px] mb-[1rem] uppercase">
              Coach · Michael Kors · Kate Spade
            </div>
            <h1 className="rt-page-hero-title mb-5 text-[clamp(1.75rem,5vw,2.75rem)] leading-[1.1]">
              Used Brand Bags <span className="text-brand-gold">Wholesale</span>
            </h1>
            <p className="rt-page-hero-sub max-w-[620px] mb-9 leading-[1.8] text-[1.05rem]">
              Premium second-hand branded handbags, backpacks, and luggage — Coach, Michael Kors, Kate Spade, and 20+ international brands.
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

      {/* STATS BAR — gold/brown brand color */}
      <div className="bg-[#8B6914] py-4">
        <div className="max-w-[1280px] mx-auto px-8 flex flex-wrap gap-6 justify-around items-center">
          {[
            { num: "20+", label: "Bag Brands" },
            { num: "A-Grade", label: "Quality Standard" },
            { num: "38kg", label: "Per Sack" },
            { num: "100 PCS", label: "MOQ" },
            { num: "Cleaned", label: "Before Packing" },
          ].map((stat) => (
            <div key={stat.num} className="text-center text-white">
              <div className="font-montserrat font-black text-[1.25rem]">{stat.num}</div>
              <div className="text-[0.65rem] opacity-85 uppercase tracking-[0.07em] mt-[0.15rem]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT: Left + Right Sidebar */}
      <div className="max-w-[1280px] mx-auto px-6 py-[3rem] grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-[2.5rem] items-start">

        {/* ─── LEFT CONTENT ─── */}
        <div className="min-w-0">

          {/* BRAND LIST */}
          <section className="mb-[3rem]">
            <h2 className="font-montserrat text-[1.4rem] font-extrabold text-[#1A1A1A] border-l-4 border-[#C0392B] pl-[0.875rem] m-0 mb-[1.25rem]">
              Available Bag Brands
            </h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                'Coach', 'Michael Kors', 'Kate Spade', 'Longchamp', 'Tory Burch', 'Guess',
                'Calvin Klein', 'Tommy Hilfiger', 'Ralph Lauren', 'DKNY', 'Fossil', 'Kipling',
                'Samsonite', 'Herschel', 'JanSport', 'Eastpak', 'The North Face', 'Fjällräven',
                'Tumi', 'Vera Bradley'
              ].map(brand => (
                <span
                  key={brand}
                  className="bg-[#F5F5F0] border border-[#e0e0e0] text-[#333] px-[0.875rem] py-[0.35rem] rounded-[2px] text-[0.8rem] font-montserrat font-semibold"
                >
                  {brand}
                </span>
              ))}
            </div>
          </section>

          {/* PRODUCT SHOWCASE */}
          <section className="mb-[3rem]">
            <h2 className="font-montserrat text-[1.4rem] font-extrabold text-[#1A1A1A] border-l-4 border-[#C0392B] pl-[0.875rem] m-0 mb-[1.25rem]">
              Product Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[1.25rem]">
              {[
                { title: 'Used Brand Handbags', img: '/images/bags/abags.webp', desc: 'Coach, MK, Kate Spade', spec: '38kg/sack (~50 pcs)' },
                { title: 'Used Brand Backpacks', img: '/images/bags/bbags.webp', desc: 'Herschel, JanSport, NF', spec: '35kg/sack (~40 pcs)' },
                { title: 'Used Brand Shoulder Bags', img: '/images/bags/luxury-handbags-assorted-collection-display-1.webp', desc: 'Longchamp, Tory Burch', spec: '38kg/sack (~45 pcs)' },
                { title: 'Used Brand Crossbody Bags', img: '/images/bags/louis-vuitton-essential-trunk-black-monogram.webp', desc: 'Calvin Klein, DKNY', spec: '35kg/sack (~55 pcs)' },
                { title: 'Used Brand Luggage', img: '/images/bags/wholesale-luxury-bags-assorted-brands-pile.webp', desc: 'Samsonite, Tumi', spec: '40kg/sack (~15 pcs)' },
                { title: 'Mixed Brand Bags', img: '/images/bags/second-hand-designer-bags-warehouse-inventory-pile.webp', desc: 'All brands mixed', spec: '38kg/sack (~50 pcs)' },
              ].map(prod => (
                <div key={prod.title} className="bg-white border border-[#eee] rounded-[6px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <div className="relative overflow-hidden h-[180px]">
                    <Image src={prod.img} alt={`RealismThrift Wholesale ${prod.title} - Luxury Branded Second-Hand Bags Bulk Inventory`} fill className="object-cover" />
                    <div className="absolute top-2 left-2 bg-brand-dark text-brand-gold text-[0.65rem] font-bold px-2 py-1 rounded-[2px] font-montserrat uppercase tracking-wider">
                      Grade A
                    </div>
                  </div>
                  <div className="p-[0.875rem]">
                    <h3 className="font-montserrat text-[0.875rem] font-bold text-[#1A1A1A] m-0 mb-[0.35rem]">{prod.title}</h3>
                    <p className="text-[0.75rem] text-[#888] m-0 mb-2">{prod.desc}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[0.75rem] text-[#C0392B] font-bold">{prod.spec}</span>
                      <a 
                        href="#inquiry" 
                        className="bg-[#1A1A1A] text-white text-[0.7rem] px-[0.75rem] py-[0.3rem] rounded-[2px] no-underline font-montserrat font-semibold"
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

          {/* BAG INSPECTION & SORTING PROCESS */}
          <section className="mb-[3rem]">
            <h2 className="font-montserrat text-[1.4rem] font-extrabold text-[#1A1A1A] border-l-4 border-[#C0392B] pl-[0.875rem] m-0 mb-6">
              Bag Inspection & Sorting Process
            </h2>
            <p className="text-[0.9375rem] text-[#555] leading-[1.75] mb-[1.75rem]">
              Bags require the most detailed inspection of all our product categories. Our dedicated bag sorting team checks every zipper, strap, clasp, and lining before grading. Only fully functional bags pass our A-grade standard.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1.25rem]">
              {[
                {
                  step: '01',
                  title: 'Initial Sorting by Type',
                  img: '/images/bags/mixed-designer-handbags-wholesale-batch-display.webp',
                  desc: 'Incoming bags are sorted by type: handbags, backpacks, shoulder bags, crossbody bags, and luggage. Each type follows a different inspection protocol. Brand identification happens simultaneously during this stage.'
                },
                {
                  step: '02',
                  title: 'Hardware Inspection',
                  img: '/images/bags/designer-bags-collection-display-dior-chanel-gucci.webp',
                  desc: 'Every zipper is opened and closed 3 times. All clasps, buckles, magnetic closures, and rings are tested for functionality. Any bag with broken or stuck hardware is immediately downgraded. Chain straps are checked link by link.'
                },
                {
                  step: '03',
                  title: 'Interior & Exterior Cleaning',
                  img: '/images/bags/premium-handbags-collection-mixed-brands-display.webp',
                  desc: 'Bags are cleaned inside and out using appropriate methods for each material type (leather, canvas, nylon, synthetic). Stubborn stains are treated. Bags with permanent staining or mold are rejected. Interiors are deodorized.'
                },
                {
                  step: '04',
                  title: 'Structural Integrity Check',
                  img: '/images/bags/designer-bags-collection-dior-mcm-coach-celine.webp',
                  desc: 'Straps are tested for strength and attachment points. Lining integrity is checked — no peeling, tearing, or separation allowed. The bag must hold its shape when loaded. Base corners are checked for wear-through.'
                },
              ].map(process => (
                <div key={process.step} className="bg-white border border-[#eee] rounded-[6px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <div className="relative h-[160px]">
                    <Image src={process.img} alt={`RealismThrift Bag Quality Inspection Step ${process.step} - ${process.title} for Global Wholesale Branded Bags`} fill className="object-cover" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <span className="w-6 h-6 bg-brand-red text-white text-[0.75rem] font-bold flex items-center justify-center rounded-full shrink-0">{process.step}</span>
                      <h3 className="font-montserrat text-[0.875rem] font-bold text-brand-dark m-0">{process.title}</h3>
                    </div>
                    <p className="text-[0.75rem] text-[#666] leading-relaxed m-0">{process.desc}</p>
                  </div>
                </div>
              ))}

              {/* STEP 05 — full width */}
              <div className="sm:col-span-2 bg-white border border-[#eee] rounded-[6px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)] grid grid-cols-1 md:grid-cols-[300px_1fr]">
                <div className="relative h-[200px] md:h-auto">
                  <Image src="/images/bags/gucci-handbags-collection-marmont-dionysus-ophidia.webp" alt="RealismThrift Final QC and Packing - Branded Second-Hand Bags Ready for Professional Export Shipment" fill className="object-cover" />
                </div>
                <div className="p-[1.25rem]">
                  <div className="flex items-center gap-[0.625rem] mb-[0.625rem]">
                    <span className="bg-[#8B6914] text-white font-montserrat text-[0.75rem] font-extrabold px-[0.625rem] py-[0.25rem] rounded-[2px]">
                      STEP 05
                    </span>
                    <h3 className="font-montserrat text-[0.9375rem] font-bold text-[#1A1A1A] m-0">Brand Verification & Packing</h3>
                  </div>
                  <p className="text-[0.8125rem] text-[#666] leading-[1.7] m-0">
                    Brand labels, serial numbers, and authenticity markers are verified. Each bag is individually wrapped in plastic before being packed into woven sacks. Sacks are labeled with brand, type, grade, and piece count.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* QUALITY STANDARDS */}
          <QualityStandards title="A-Grade Bag Quality Standards" standards={bagStandards} />

          {/* TRUST SECTIONS */}
          <ProductTrustSections features={bagFeatures} faqs={bagFaqs} />

          {/* SPECS TABLE */}
          <section className="mb-[3rem]">
            <h2 className="font-montserrat text-[1.4rem] font-extrabold text-[#1A1A1A] border-l-4 border-[#C0392B] pl-[0.875rem] m-0 mb-[1.25rem]">
              Product Specifications
            </h2>
            <div className="rt-table-wrap overflow-x-auto rounded-[6px] shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
              <table className="w-full border-collapse text-[0.8125rem] bg-white min-w-[650px]">
                <thead>
                  <tr className="bg-[#1A1A1A] text-white">
                    <th className="p-[0.875rem_1rem] text-left font-montserrat">Category</th>
                    <th className="p-[0.875rem_1rem] text-left font-montserrat">Sack Weight</th>
                    <th className="p-[0.875rem_1rem] text-left font-montserrat">PCS/Sack</th>
                    <th className="p-[0.875rem_1rem] text-left font-montserrat">MOQ</th>
                    <th className="p-[0.875rem_1rem] text-left font-montserrat">20ft Load</th>
                    <th className="p-[0.875rem_1rem] text-left font-montserrat">40ft Load</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cat: 'Brand Handbags', w: '38 kg', pcs: '~50 pcs', moq: '≥100 pcs', c20: '~6,000 pcs', c40: '~14,000 pcs', bg: 'bg-white' },
                    { cat: 'Brand Backpacks', w: '35 kg', pcs: '~40 pcs', moq: '≥100 pcs', c20: '~5,500 pcs', c40: '~12,000 pcs', bg: 'bg-[#fafafa]' },
                    { cat: 'Brand Shoulder Bags', w: '38 kg', pcs: '~45 pcs', moq: '≥100 pcs', c20: '~6,000 pcs', c40: '~13,000 pcs', bg: 'bg-white' },
                    { cat: 'Brand Crossbody Bags', w: '35 kg', pcs: '~55 pcs', moq: '≥100 pcs', c20: '~6,500 pcs', c40: '~14,500 pcs', bg: 'bg-[#fafafa]' },
                    { cat: 'Mixed Brand Bags', w: '38 kg', pcs: '~50 pcs', moq: '≥200 pcs', c20: '~6,000 pcs', c40: '~14,000 pcs', bg: 'bg-white' },
                  ].map(row => (
                    <tr key={row.cat} className={`${row.bg} border-b border-[#f0f0f0]`}>
                      <td className="p-[0.75rem_1rem] font-semibold text-[#1A1A1A]">{row.cat}</td>
                      <td className="p-[0.75rem_1rem] text-[#555]">{row.w}</td>
                      <td className="p-[0.75rem_1rem] text-[#555]">{row.pcs}</td>
                      <td className="p-[0.75rem_1rem]">
                        <span className="bg-[#F0B429] text-[#1A1A1A] px-2 py-[0.15rem] rounded-[2px] text-[0.7rem] font-bold">{row.moq}</span>
                      </td>
                      <td className="p-[0.75rem_1rem] text-[#555]">{row.c20}</td>
                      <td className="p-[0.75rem_1rem] text-[#555]">{row.c40}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>{/* END LEFT CONTENT */}

        {/* ─── SIDEBAR ─── */}
        <aside>
          <div
            id="inquiry"
            className="bg-white border border-[#eee] rounded-[8px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-[1.75rem] sticky top-[80px]"
          >
            {/* Sidebar header — gold/brown */}
            <div className="bg-[#8B6914] text-white -mx-[1.75rem] -mt-[1.75rem] px-[1.75rem] py-[1.25rem] rounded-t-[8px] mb-6">
              <h3 className="font-montserrat text-[1rem] font-extrabold m-0 mb-[0.25rem]">Get Bag Price Now</h3>
              <p className="text-[0.75rem] opacity-85 m-0">Reply within 12 hours · Free samples available</p>
            </div>

            <InquiryForm variant="sidebar" />

            <div className="mt-[1.25rem]">
              <a
                href="https://wa.me/8613367481710?text=Hi%2C+I+want+used+brand+bags+wholesale+price"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-[3px] no-underline font-montserrat font-bold text-[0.875rem] hover:bg-[#1da851] transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </aside>

      </div>{/* END MAIN GRID */}

      {/* CTA BLOCK */}
      <ProductCTA 
        title="Ready to Order Used Brand Bags?"
        description="Minimum 100 pieces. Free pre-shipment photos and videos. Worldwide shipping available."
        whatsappMessage="Hi, I want to wholesale used brand bags. Can I get a price list?"
      />

    </main>
  );
}
