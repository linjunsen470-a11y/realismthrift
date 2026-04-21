import Image from "next/image";
import { InquiryForm } from "@/components/InquiryForm";
import { QualityStandards } from "@/components/product/QualityStandards";
import { ProductTrustSections } from "@/components/product/ProductTrustSections";
import { ProductCTA } from "@/components/product/ProductCTA";
import { companyStats } from "@/data/siteData";

const shoeStandards = [
  { icon: '❌', title: 'No Glue Damage', desc: 'No sticky parts coming loose from sole or upper', isNegative: true },
  { icon: '❌', title: 'No Cracking', desc: 'Surface stays smooth, no layers peeling or cracking', isNegative: true },
  { icon: '❌', title: 'No Missing Pieces', desc: 'All parts present — laces, insoles, tongue included', isNegative: true },
  { icon: '❌', title: 'No Heavy Odor', desc: 'Cleaned and deodorized, no persistent smell', isNegative: true },
  { icon: '❌', title: 'No Broken Soles', desc: 'Bottom part fully solid, no separation from upper', isNegative: true },
  { icon: '❌', title: 'No Structural Damage', desc: 'Shape maintained, no crushing or deformation', isNegative: true },
  { icon: '✅', title: 'Complete Pairs Only', desc: 'Every sack contains 100% matched pairs', isNegative: false },
  { icon: '✅', title: 'Brand Label Intact', desc: 'Original brand label clearly visible on tongue/sole', isNegative: false },
  { icon: '✅', title: 'Wearable Condition', desc: 'All items are immediately wearable upon receipt', isNegative: false }
];

const shoeFeatures = [
  { icon: '👟', title: 'Precise Pairing', desc: '100% manual check ensures no single shoes or mismatched pairs.' },
  { icon: '🧼', title: 'Professional Sterilization', desc: 'Cleaned, deodorized, and UV sterilized for international health standards.' },
  { icon: '📦', title: 'Secure Sacking', desc: 'Hydraulic compressed packing to maximize container space and protect shoes.' },
  { icon: '🌍', title: `${companyStats.countriesCount} Export Ports`, desc: 'Direct shipping to major ports in Africa, Middle East, and Southeast Asia.' }
];

const shoeFaqs = [
  { q: 'How many pairs fit in a 40HQ container?', a: 'A 40HQ container typically fits around 20,000 to 22,000 pairs of shoes depending on the mix of boots and sneakers.' },
  { q: 'Can I order just Nike or Adidas?', a: 'Yes, we offer brand-specific sorting. Premium brands like Nike/Adidas have a separate pricing tier and specific MOQ.' },
  { q: 'Do you provide the shoes in boxes?', a: 'To maximize shipping efficiency and lower your costs, we typically pack shoes in woven sacks. Box packing is available upon request for premium orders.' }
];

export const metadata = {
  title: "Used Brand Shoes | RealismThrift Wholesale",
  description: `Wholesale second-hand branded shoes — Nike, Adidas, Jordan, and 30+ brands. Sold by the sack. Exported to ${companyStats.countriesCount} countries.`,
};

export default function UsedBrandShoesPage() {
  return (
    <main className="bg-white">
      {/* PAGE HERO */}
      <section className="relative px-0 py-14 overflow-hidden bg-[linear-gradient(135deg,#1A1A1A_0%,#1a1a2e_50%,#16213e_100%)]">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/reconstructed/1542291026-7eec264c27ff.jpg" 
            alt="Used Shoes background" 
            fill 
            className="object-cover opacity-[0.1]" 
            priority 
          />
        </div>
        <div className="rt-container relative z-10">
          <nav className="text-[0.8rem] text-white/55 mb-3.5 flex items-center gap-1.5">
            <a href="/" className="text-white/55 hover:text-white transition-colors">Home</a>
            <span>›</span>
            <span className="text-brand-gold">Used Brand Shoes</span>
          </nav>
          <h1 className="font-montserrat text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold text-white mb-3.5 leading-[1.2]">
            Used Brand Shoes <span className="text-brand-gold">Wholesale</span>
          </h1>
          <p className="text-white/75 text-[1rem] max-w-[620px] leading-[1.7] mb-6">
            Wholesale second-hand branded shoes — Nike, Adidas, Jordan, New Balance, Puma and 30+ top brands. Sold by the pair or by the sack. Strict cleaning and grading process. Exported to {companyStats.countriesCount} countries.
          </p>
          <div className="flex gap-3.5 flex-wrap">
            <a href="#inquiry" className="bg-brand-gold text-brand-dark px-6 py-3 rounded-[3px] font-bold font-montserrat text-[0.85rem] hover:bg-brand-gold-dark transition-colors">
              Get Price Now →
            </a>
            <a href="https://wa.me/8618800000001" target="_blank" rel="noopener noreferrer" className="bg-white/10 border border-white/30 text-white px-6 py-3 rounded-[3px] font-semibold font-montserrat text-[0.85rem] hover:bg-white/20 transition-colors">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* KEY STATS BAR */}
      <div className="bg-brand-dark py-3.5">
        <div className="max-w-[1280px] mx-auto px-6 flex gap-8 flex-wrap justify-center">
          {[
            { num: "30+", label: "Shoe Brands" },
            { num: "A-Grade", label: "Quality Standard" },
            { num: "25–30kg", label: "Per Sack" },
            { num: "8,000+", label: "Pairs/20ft" },
            { num: "Cleaned", label: "Before Packing" }
          ].map((stat) => (
            <div key={stat.num} className="text-center text-white">
              <div className="font-montserrat text-[1.1rem] font-extrabold text-brand-gold">{stat.num}</div>
              <div className="text-[0.7rem] opacity-70 tracking-[0.05em]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-[1280px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10 items-start">
        
        <div className="order-2 md:order-1">
          {/* BRAND LIST */}
          <section className="mb-12">
            <h2 className="font-montserrat text-[1.4rem] font-extrabold text-brand-dark border-l-4 border-brand-red pl-3.5 mb-5">
              Available Shoe Brands
            </h2>
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
            <h2 className="font-montserrat text-[1.4rem] font-extrabold text-brand-dark border-l-4 border-brand-red pl-3.5 mb-5">
              Product Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { title: 'Used Nike Shoes', img: '1542291026-7eec264c27ff', desc: 'Nike Air, Force 1, Jordan', spec: '25kg/sack (~40 pairs)' },
                { title: 'Used Adidas Shoes', img: '1608231387042-66d1773070a5', desc: 'Ultraboost, Stan Smith, NMD', spec: '25kg/sack (~40 pairs)' },
                { title: 'Used Brand Sneakers', img: '1600185365926-3a2ce3cdb9eb', desc: 'Mixed premium brands', spec: '28kg/sack (~40 pairs)' },
                { title: 'Used Brand Boots', img: '1520639888713-7851133b1ed0', desc: 'Timberland, Dr. Martens', spec: '30kg/sack (~25 pairs)' },
                { title: 'Used Brand Sandals', img: '1603487742131-4160ec999306', desc: 'Birkenstock, Teva, UGG', spec: '20kg/sack (~50 pairs)' },
                { title: 'Used Mixed Shoes', img: '1542291026-7eec264c27ff', desc: 'All brands mixed', spec: '25kg/sack (~40 pairs)' }
              ].map(prod => (
                <div key={prod.title} className="bg-white border border-[#eee] rounded-[6px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <div className="relative overflow-hidden h-[180px]">
                    <Image src={`/images/reconstructed/${prod.img}.jpg`} alt={prod.title} fill className="object-cover" />
                    <div className="absolute top-2 left-2 bg-brand-dark text-brand-gold text-[0.65rem] font-bold px-2 py-1 rounded-[2px] font-montserrat">
                      A-GRADE
                    </div>
                  </div>
                  <div className="p-3.5">
                    <h3 className="font-montserrat text-[0.875rem] font-bold text-brand-dark mb-1">{prod.title}</h3>
                    <p className="text-[0.75rem] text-[#888] mb-2">{prod.desc}</p>
                    <div className="flex justify-between items-center break-all gap-1">
                      <span className="text-[0.7rem] text-brand-red font-bold flex-1">{prod.spec}</span>
                      <a href="#inquiry" className="bg-brand-dark text-white text-[0.7rem] px-3 py-1.5 rounded-[2px] font-semibold font-montserrat shrink-0 hover:bg-brand-red transition-colors">Inquire</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SHOE SORTING PROCESS */}
          <section className="mb-12">
            <h2 className="font-montserrat text-[1.4rem] font-extrabold text-brand-dark border-l-4 border-brand-red pl-3.5 mb-6">
              Shoe Sorting & Cleaning Process
            </h2>
            <p className="text-[0.9375rem] text-[#555] leading-[1.75] mb-7">
              Used brand shoes require a more detailed sorting process than clothing. Our dedicated shoe sorting team handles each pair individually to ensure quality and pairing accuracy.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { step: '01', title: 'Collection & Pairing Check', img: '1542291026-7eec264c27ff', desc: 'All incoming shoes are first checked for pairs. Unpaired shoes are immediately separated. We only export complete pairs. Each pair is tagged with a temporary ID for tracking through the sorting process.' },
                { step: '02', title: 'Brand Identification', img: '1600185365926-3a2ce3cdb9eb', desc: 'Trained sorters identify each brand and model. Nike, Adidas, Jordan, and other premium brands are sorted into dedicated lots. Brand labels, tongue tags, and sole markings are all verified before grading.' },
                { step: '03', title: 'Cleaning & Deodorizing', img: '1608231387042-66d1773070a5', desc: 'All shoes are cleaned using professional equipment. Soles are scrubbed, uppers are wiped down, and interiors are deodorized. Shoes with persistent odors or mold are rejected regardless of brand.' },
                { step: '04', title: 'Quality Grading', img: '1520639888713-7851133b1ed0', desc: 'Each pair is graded A, B, or C based on 8 quality criteria: sole condition, upper condition, lining integrity, zipper/lace completeness, odor level, structural shape, brand label clarity, and overall wearability. We export A-grade only.' },
              ].map(process => (
                <div key={process.step} className="bg-white border border-[#eee] rounded-[6px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <div className="relative h-[160px]">
                    <Image src={`/images/reconstructed/${process.img}.jpg`} alt={process.title} fill className="object-cover" />
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
                   <Image src="/images/reconstructed/1578575437130-527eed3abbec.jpg" alt="Packing by Category" fill className="object-cover" />
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
            <h2 className="font-montserrat text-[1.4rem] font-extrabold text-brand-dark border-l-4 border-brand-red pl-3.5 mb-5">
              Product Specifications
            </h2>
            <div className="overflow-x-auto rounded-[6px] shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
              <table className="w-full border-collapse text-[0.8125rem] bg-white">
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
                    { cat: 'Jordan / Premium Brand', w: '28–30 kg', p: '~35 pairs', moq: '≥100 pairs', l20: '~7,500 pairs', l40: '~17,000 pairs' }
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
        <aside className="order-1 md:order-2 sticky top-[80px]">
          <div id="inquiry" className="rt-sidebar-card">
            <div className="rt-sidebar-card-title">
              <h3 className="text-[1rem] font-extrabold m-0 uppercase tracking-wider">Get Shoe Price Now</h3>
              <p className="text-[0.7rem] opacity-80 m-0 mt-0.5 font-open-sans normal-case tracking-normal">Reply within 12 hours · Samples available</p>
            </div>
            
            <div className="p-5">
              {/* INQUIRY FORM */}
              <InquiryForm variant="sidebar" />

              <div className="mt-4 pt-4 border-t border-gray-100">
                <a href="https://wa.me/8618800000001" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-[3px] font-montserrat font-bold text-[0.8125rem] uppercase tracking-wider hover:bg-[#1da851] transition-all shadow-sm">
                  💬 WhatsApp Us Directly
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
              <span className="font-semibold">A-Grade only</span>
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
