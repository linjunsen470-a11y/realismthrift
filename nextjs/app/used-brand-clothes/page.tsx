import Image from "next/image";
import Link from "next/link";
import { InquiryForm } from "@/components/InquiryForm";
import { QualityStandards } from "@/components/product/QualityStandards";
import { ProductTrustSections } from "@/components/product/ProductTrustSections";
import { ProductCTA } from "@/components/product/ProductCTA";
import { companyStats } from "@/data/siteData";

const clothesStandards = [
  { icon: '❌', title: 'No Stains or Dirt', desc: 'No dirty patches or discoloration on fabric surface', isNegative: true },
  { icon: '❌', title: 'No Tears or Holes', desc: 'No cuts, rips, or openings anywhere on the garment', isNegative: true },
  { icon: '❌', title: 'No Heavy Fading', desc: 'Colors remain vibrant, not washed out or bleached', isNegative: true },
  { icon: '❌', title: 'No Pilling', desc: 'No fuzzy balls or fiber lumps on the fabric surface', isNegative: true },
  { icon: '❌', title: 'No Heavy Wear', desc: 'No signs of excessive use or structural damage', isNegative: true },
  { icon: '❌', title: 'No Missing Closures', desc: 'All buttons, zippers, and snaps fully functional', isNegative: true },
  { icon: '✅', title: 'Brand Label Intact', desc: 'Original brand label clearly visible and attached', isNegative: false },
  { icon: '✅', title: 'Clean & Odor-Free', desc: 'Washed and deodorized before packing', isNegative: false },
  { icon: '✅', title: 'Photo Verified', desc: 'Pre-shipment photos sent to buyer for approval', isNegative: false }
];

const clothesFeatures = [
  { icon: '🏭', title: 'Direct Factory Source', desc: '15,000m² facility. No middlemen — you buy directly from the source.' },
  { icon: '📦', title: 'Consistent Grading', desc: 'Standardized grading across all batches. What you see is what you get.' },
  { icon: '🚢', title: 'Global Export', desc: `12+ years experience exporting to ${companyStats.countriesCount} countries with full documentation.` },
  { icon: '⚡', title: 'Fast Lead Time', desc: 'Orders ready in 7–14 days. Large ready-stock inventory for immediate dispatch.' }
];

const clothesFaqs = [
  { q: 'What is the minimum order quantity?', a: 'Our minimum order is 100 bales (approximately 4,500 kg). For brand-specific orders, the MOQ is 200 bales.' },
  { q: 'Can I request a specific brand mix?', a: 'Yes. We offer custom brand mix orders for orders above 500 bales. A small custom sorting fee applies.' },
  { q: 'Do you provide samples?', a: 'Yes. We can send a 1–2 bale sample for a fee (deducted from your first bulk order).' },
  { q: 'What payment methods do you accept?', a: 'We accept T/T (30% deposit), Western Union, and L/C for large orders.' }
];

export const metadata = {
  title: "Used Brand Clothes | RealismThrift Wholesale",
  description: `China's top exporter of sorted, graded second-hand branded clothing. Nike, Adidas, H&M, Zara and 200+ brands. Strict 5-step sorting. MOQ 100 bales. Ships to ${companyStats.countriesCount} countries.`,
};

export default function UsedBrandClothesPage() {
  return (
    <main className="bg-white">
      {/* ═══════════════════════════════════════════════════════
          HERO — Full-width AI sorting facility photo
          ═══════════════════════════════════════════════════════ */}
      <section className="relative h-[520px] overflow-hidden">
        <Image 
          src="/images/used-brand-clothes/hero.jpg"
          alt="RealismThrift used brand clothes sorting facility"
          fill
          priority
          className="object-cover object-[center_30%] w-full h-full block"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/90 to-[#1A1A1A]/25" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1280px] mx-auto px-8 w-full">
            <nav className="text-[0.75rem] text-white/45 mb-4 flex gap-[0.4rem] items-center flex-wrap">
              <Link href="/" className="text-white/45 no-underline hover:text-white/60 transition-colors">Home</Link>
              <span>›</span>
              <span className="text-white/70">Used Brand Clothes</span>
            </nav>
            <div className="inline-block bg-[#C0392B] text-white font-montserrat font-bold text-[0.65rem] tracking-[0.12em] px-[0.875rem] py-[0.3rem] rounded-[2px] mb-[0.875rem] uppercase">
              Wholesale · B2B Export · China Supplier
            </div>
            <h1 className="font-montserrat font-black text-[clamp(1.8rem,4vw,3rem)] text-white m-0 mb-4 leading-[1.15] max-w-[580px]">
              Used Brand Clothes<br /><span className="text-[#F0B429]">Wholesale Supplier</span>
            </h1>
            <p className="text-[0.9375rem] text-white/80 font-open-sans max-w-[500px] leading-[1.75] m-0 mb-[1.75rem]">
              China&apos;s top exporter of sorted, graded second-hand branded clothing. Nike, Adidas, H&M, Zara and 200+ brands. Strict 5-step sorting. MOQ 100 bales. Ships to {companyStats.countriesCount} countries.
            </p>
            <div className="flex gap-[0.875rem] flex-wrap">
              <a href="#inquiry" className="bg-[#F0B429] text-[#1A1A1A] font-montserrat font-extrabold text-[0.875rem] px-[2rem] py-[0.875rem] rounded-[3px] no-underline tracking-[0.03em] hover:bg-[#d4a017] transition-colors">GET PRICE NOW →</a>
              <a href="https://wa.me/8613367481710?text=Hi%2C+I+want+to+wholesale+used+brand+clothes" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white font-montserrat font-bold text-[0.875rem] px-[2rem] py-[0.875rem] rounded-[3px] no-underline hover:bg-[#1da851] transition-colors">💬 WhatsApp Now</a>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="bg-[#C0392B] py-4">
        <div className="max-w-[1280px] mx-auto px-8 flex flex-wrap gap-6 justify-around items-center">
          {[
            { num: '200+', label: 'Brands Available' },
            { num: 'A/B/C', label: 'Quality Grades' },
            { num: '100 bales', label: 'Min. Order' },
            { num: '7–14 days', label: 'Lead Time' },
            { num: companyStats.countriesCount, label: 'Export Countries' },
            { num: '12 yrs', label: 'Experience' },
          ].map((stat, i) => (
            <div key={i} className="text-center text-white">
              <div className="font-montserrat font-black text-[1.25rem]">{stat.num}</div>
              <div className="text-[0.65rem] opacity-85 uppercase tracking-[0.07em] mt-[0.15rem]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN LAYOUT: Left Content + Right Sidebar */}
      <div className="max-w-[1280px] mx-auto py-[3.5rem] px-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-[3rem] items-start">

        {/* ─── LEFT CONTENT ─── */}
        <div className="min-w-0">
          {/* INTRO */}
          <section className="mb-[3rem]">
            <div className="flex items-center gap-[0.75rem] mb-[1rem]">
              <div className="w-[4px] h-[26px] bg-[#C0392B] rounded-[2px] shrink-0" />
              <h2 className="font-montserrat font-extrabold text-[1.4rem] text-[#1A1A1A] m-0">What We Supply</h2>
            </div>
            <p className="font-open-sans text-[0.9375rem] text-[#555] leading-[1.8] m-0 mb-4">RealismThrift Export is a direct-source wholesale supplier of used branded clothing based in Huizhou, China. We operate a 15,000m² sorting facility with 200+ trained staff who process and grade second-hand garments from first-tier Chinese cities daily. Every bale we export has been through our standardized 5-step sorting and quality-control process — ensuring you receive consistent, accurately graded merchandise every time.</p>
            <p className="font-open-sans text-[0.9375rem] text-[#555] leading-[1.8] m-0">We supply wholesale buyers, thrift store chains, market traders, and NGOs across Africa, Southeast Asia, the Middle East, Latin America, and Europe. Whether you need a 100-bale trial order or a full 40HQ container, we handle everything from sorting to door-to-door delivery.</p>
          </section>

          {/* BRAND SHOWCASE */}
          <section className="mb-[3rem]">
            <div className="flex items-center gap-[0.75rem] mb-[1.25rem]">
              <div className="w-[4px] h-[26px] bg-[#C0392B] rounded-[2px] shrink-0" />
              <h2 className="font-montserrat font-extrabold text-[1.4rem] text-[#1A1A1A] m-0">Brands in Our Stock</h2>
            </div>
            
            {[
              { title: 'Sportswear', colorClass: 'bg-brand-red', brands: ['Nike', 'Adidas', 'Puma', 'Under Armour', 'New Balance', 'Reebok', 'Champion', 'Fila', 'Lululemon', 'Columbia', 'The North Face', 'Patagonia'] },
              { title: 'Fast Fashion', colorClass: 'bg-brand-dark', brands: ['H&M', 'Zara', 'Uniqlo', 'Mango', 'Gap', 'Old Navy', 'Forever 21', 'Primark', 'Topshop', 'ASOS', 'Shein', 'Next'] },
              { title: 'Premium / Luxury', colorClass: 'bg-[#8B6914]', brands: ['Ralph Lauren', 'Tommy Hilfiger', 'Calvin Klein', 'Lacoste', 'Hugo Boss', 'Armani', 'Burberry', 'Guess', 'Michael Kors', 'Coach'] },
              { title: 'Denim & Casual', colorClass: 'bg-[#2C5F8A]', brands: ["Levi's", 'Wrangler', 'Lee', 'Diesel', 'G-Star Raw', 'True Religion', 'Hollister', 'American Eagle', 'Banana Republic', 'J.Crew'] }
            ].map(group => (
               <div key={group.title} className="mb-[1rem] border border-[#eee] rounded-[4px] overflow-hidden">
                 <div className={`px-[1.25rem] py-[0.5rem] ${group.colorClass}`}>
                   <span className="font-montserrat font-bold text-[0.75rem] text-white tracking-[0.08em] uppercase">{group.title}</span>
                 </div>
                 <div className="p-[0.875rem_1.25rem] flex flex-wrap gap-[0.4rem] bg-white">
                   {group.brands.map(b => (
                     <span key={b} className="bg-[#F5F5F0] border border-[#e5e5e5] text-[#444] font-open-sans text-[0.8rem] px-[0.75rem] py-[0.25rem] rounded-[2px] font-semibold">{b}</span>
                   ))}
                 </div>
               </div>
            ))}
            <p className="text-[0.8rem] text-[#aaa] font-open-sans italic mt-2">* Brand availability varies by season and batch. Contact us for current stock list and photos.</p>
          </section>

          {/* ═══ SORTING PROCESS — CORE SECTION ═══ */}
          <section className="mb-[3.5rem]">
            <div className="flex items-center gap-[0.75rem] mb-[0.5rem]">
              <div className="w-[4px] h-[26px] bg-[#C0392B] rounded-[2px] shrink-0" />
              <h2 className="font-montserrat font-extrabold text-[1.4rem] text-[#1A1A1A] m-0">Our 5-Step Sorting Process</h2>
            </div>
            <p className="font-open-sans text-[0.9375rem] text-[#555] leading-[1.8] m-0 mb-[2.5rem]">This is what separates RealismThrift Export from ordinary second-hand dealers. We don&apos;t just ship mixed bags — we deliver professionally sorted, consistently graded merchandise that your customers will trust. Every single bale passes through all five steps before it leaves our facility.</p>

            {/* STEP 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[2rem] items-center mb-[3rem]">
              <div>
                <div className="flex items-center gap-[0.875rem] mb-[1rem]">
                  <div className="w-[52px] h-[52px] bg-[#C0392B] rounded-full flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(192,57,43,0.35)]">
                    <span className="font-montserrat font-black text-[1.25rem] text-white">1</span>
                  </div>
                  <div>
                    <div className="text-[0.7rem] text-[#C0392B] font-montserrat font-bold tracking-[0.08em] uppercase mb-[0.2rem]">Step 01</div>
                    <h3 className="font-montserrat font-extrabold text-[1.1rem] text-[#1A1A1A] m-0">Raw Material Collection & Initial Separation</h3>
                  </div>
                </div>
                <p className="font-open-sans text-[0.9rem] text-[#555] leading-[1.8] m-0 mb-[1rem]">Raw second-hand clothing arrives daily at our Huizhou facility from collection networks across Beijing, Shanghai, Shenzhen, and other first-tier cities. Upon arrival, all items are immediately separated by garment type — tops, bottoms, outerwear, sportswear, and accessories — before any further processing begins.</p>
                <div className="bg-[#F5F5F0] rounded-[4px] p-[1rem]">
                  <div className="font-montserrat font-bold text-[0.8rem] text-[#1A1A1A] mb-[0.625rem]">What happens at this stage:</div>
                  <ul className="m-0 pl-[1.25rem] font-open-sans text-[0.8125rem] text-[#555] leading-[1.9] list-disc">
                    <li>Separated by type: tops / bottoms / outerwear / sportswear / accessories</li>
                    <li>Immediate removal of non-clothing items, heavily soiled pieces, and non-exportable waste</li>
                    <li>Initial rejection rate: 8–12% of incoming volume</li>
                    <li>Daily processing capacity: 15–20 tons of raw material</li>
                  </ul>
                </div>
              </div>
              <div className="rounded-[8px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.14)] relative h-[280px]">
                <Image src="/images/used-brand-clothes/hero.jpg" alt="Sorting facility overview" fill className="object-cover" />
              </div>
            </div>

            {/* STEP 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[2rem] items-center mb-[3rem]">
              <div className="rounded-[8px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.14)] relative h-[280px] order-2 md:order-1">
                <Image src="/images/used-brand-clothes/step-inspect.jpg" alt="Brand label inspection" fill className="object-cover" />
              </div>
              <div className="order-1 md:order-2">
                <div className="flex items-center gap-[0.875rem] mb-[1rem]">
                  <div className="w-[52px] h-[52px] bg-[#C0392B] rounded-full flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(192,57,43,0.35)]">
                    <span className="font-montserrat font-black text-[1.25rem] text-white">2</span>
                  </div>
                  <div>
                    <div className="text-[0.7rem] text-[#C0392B] font-montserrat font-bold tracking-[0.08em] uppercase mb-[0.2rem]">Step 02</div>
                    <h3 className="font-montserrat font-extrabold text-[1.1rem] text-[#1A1A1A] m-0">Brand Identification & Authentication</h3>
                  </div>
                </div>
                <p className="font-open-sans text-[0.9rem] text-[#555] leading-[1.8] m-0 mb-[1rem]">Our trained sorters examine every garment&apos;s brand label, care label, and stitching quality under magnified lighting. The team has memorized the label characteristics of 200+ brands and can quickly identify authentic branded items from generic ones. Items are grouped into brand-specific bins for downstream processing.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[0.625rem]">
                  {[
                    'Label verification (brand, origin, fabric)',
                    'Stitching & seam integrity check',
                    'Zipper and button function test',
                    'Brand-specific bin sorting',
                    'Logo authenticity verification',
                    'Counterfeit rejection protocol'
                  ].map(chk => (
                    <div key={chk} className="flex items-start gap-[0.4rem] font-open-sans text-[0.8rem] text-[#555]">
                      <span className="text-[#27AE60] text-[0.875rem] shrink-0 mt-[0.05rem]">✓</span>
                      <span>{chk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[2rem] items-center mb-[3rem]">
              <div>
                <div className="flex items-center gap-[0.875rem] mb-[1rem]">
                  <div className="w-[52px] h-[52px] bg-[#C0392B] rounded-full flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(192,57,43,0.35)]">
                    <span className="font-montserrat font-black text-[1.25rem] text-white">3</span>
                  </div>
                  <div>
                    <div className="text-[0.7rem] text-[#C0392B] font-montserrat font-bold tracking-[0.08em] uppercase mb-[0.2rem]">Step 03</div>
                    <h3 className="font-montserrat font-extrabold text-[1.1rem] text-[#1A1A1A] m-0">Quality Grading: A / B / C</h3>
                  </div>
                </div>
                <p className="font-open-sans text-[0.9rem] text-[#555] leading-[1.8] m-0 mb-[1.25rem]">Each garment is assessed against our standardized 3-tier grading system. Graders evaluate fabric condition, color fastness, stain presence, pilling, and overall wearability using a 6-point checklist. This grading system is consistent across all batches — so buyers always know exactly what they&apos;re receiving.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-[0.75rem]">
                  <div className="border-2 border-[#27AE60] rounded-[4px] p-[0.875rem] text-center">
                    <div className="font-montserrat font-extrabold text-[0.875rem] text-[#27AE60] mb-[0.4rem]">Grade A</div>
                    <p className="text-[0.75rem] text-[#666] font-open-sans leading-[1.6] m-0">Like-new. No stains, tears or fading. Minimal wear. Premium resale quality.</p>
                  </div>
                  <div className="border-2 border-[#F0B429] rounded-[4px] p-[0.875rem] text-center">
                    <div className="font-montserrat font-extrabold text-[0.875rem] text-[#F0B429] mb-[0.4rem]">Grade B</div>
                    <p className="text-[0.75rem] text-[#666] font-open-sans leading-[1.6] m-0">Good condition. Minor signs of wear. Light marks. Regular resale quality.</p>
                  </div>
                  <div className="border-2 border-[#C0392B] rounded-[4px] p-[0.875rem] text-center">
                    <div className="font-montserrat font-extrabold text-[0.875rem] text-[#C0392B] mb-[0.4rem]">Grade C</div>
                    <p className="text-[0.75rem] text-[#666] font-open-sans leading-[1.6] m-0">Wearable. Visible wear or minor stains. Budget markets or upcycling.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[8px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.14)] relative h-[300px]">
                <Image src="/images/used-brand-clothes/step-grade.jpg" alt="Quality grading A B C" fill className="object-cover" />
              </div>
            </div>

            {/* STEP 4 */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2d2020] rounded-[8px] p-8 mb-[2rem] grid grid-cols-[auto_1fr] gap-[1.5rem] items-start">
              <div className="w-[52px] h-[52px] bg-[#C0392B] rounded-full flex items-center justify-center shrink-0">
                <span className="font-montserrat font-black text-[1.25rem] text-white">4</span>
              </div>
              <div>
                <div className="text-[0.7rem] text-[#F0B429] font-montserrat font-bold tracking-[0.08em] uppercase mb-[0.3rem]">Step 04</div>
                <h3 className="font-montserrat font-extrabold text-[1.1rem] text-white m-0 mb-[0.75rem]">Cleaning, Deodorizing & Steam Pressing</h3>
                <p className="font-open-sans text-[0.9rem] text-white/70 leading-[1.8] m-0 mb-[1.25rem]">All Grade A garments undergo industrial cleaning and deodorizing before packing. Steam pressing restores the garment&apos;s original shape. This step ensures your customers receive merchandise that looks and smells fresh — a critical factor for retail resale success.</p>
                <div className="flex flex-wrap gap-[0.625rem]">
                  {[
                    'Industrial steam cleaning',
                    'Eco-friendly deodorizing spray',
                    'UV sterilization treatment',
                    'Steam pressing & reshaping',
                    'Final visual re-inspection'
                  ].map(feat => (
                    <span key={feat} className="bg-[#F0B429]/10 border border-[#F0B429]/25 text-[#F0B429] font-open-sans text-[0.8rem] px-[0.75rem] py-[0.3rem] rounded-[2px]">
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 5 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[2rem] items-center mb-[2rem]">
              <div className="rounded-[8px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.14)] relative h-[280px] order-2 md:order-1">
                <Image src="/images/used-brand-clothes/step-pack.jpg" alt="Packing process" fill className="object-cover" />
              </div>
              <div className="order-1 md:order-2">
                <div className="flex items-center gap-[0.875rem] mb-[1rem]">
                  <div className="w-[52px] h-[52px] bg-[#C0392B] rounded-full flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(192,57,43,0.35)]">
                    <span className="font-montserrat font-black text-[1.25rem] text-white">5</span>
                  </div>
                  <div>
                    <div className="text-[0.7rem] text-[#C0392B] font-montserrat font-bold tracking-[0.08em] uppercase mb-[0.2rem]">Step 05</div>
                    <h3 className="font-montserrat font-extrabold text-[1.1rem] text-[#1A1A1A] m-0">Weighing, Compression Packing & Export QC</h3>
                  </div>
                </div>
                <p className="font-open-sans text-[0.9rem] text-[#555] leading-[1.8] m-0 mb-[1rem]">Sorted garments are hydraulically compressed and packed into PP woven bales at precise weights. Each bale is labeled with grade, weight, content, and destination. Before container loading, a senior QC inspector performs a final 5% random sampling check. Photos and videos of your specific order are sent to you for approval before shipment.</p>
                <div className="bg-[#F5F5F0] rounded-[4px] p-[1rem]">
                  <div className="font-montserrat font-bold text-[0.8rem] text-[#1A1A1A] mb-[0.625rem]">Standard Packing Specs</div>
                  <table className="w-full border-collapse font-open-sans text-[0.8rem]">
                    <tbody>
                      {[
                        ['Bale weight', '25 / 45 / 70 kg options'],
                        ['Bale size', '75×40×35 cm (standard)'],
                        ['20GP capacity', '~280 bales (~13 tons)'],
                        ['40HQ capacity', '~580 bales (~28 tons)'],
                        ['Custom packing', 'Available on request'],
                      ].map(([label, val], i) => (
                        <tr key={label} className="border-b border-[#e8e8e8]">
                          <td className="py-[0.375rem] px-[0.5rem] text-[#888]">{label}</td>
                          <td className="py-[0.375rem] px-[0.5rem] text-[#333] font-semibold">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* BALE CONTENTS */}
          <section className="mb-[3rem]">
            <div className="flex items-center gap-[0.75rem] mb-[1.25rem]">
              <div className="w-[4px] h-[26px] bg-[#C0392B] rounded-[2px] shrink-0" />
              <h2 className="font-montserrat font-extrabold text-[1.4rem] text-[#1A1A1A] m-0">What&apos;s Inside a Typical Bale</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[2rem] items-center">
              <div className="rounded-[8px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12)] relative h-[320px]">
                <Image src="/images/used-brand-clothes/bale-display.jpg" alt="Mix bale clothes" fill className="object-cover" />
              </div>
              <div>
                <p className="font-open-sans text-[0.9rem] text-[#555] leading-[1.8] m-0 mb-[1.25rem]">A typical Grade A Mixed Brand bale (45kg) contains approximately 120–180 individual garments across multiple categories and brands. The exact composition varies by batch, but our standard mix ratio ensures a balanced assortment that appeals to a wide customer base.</p>
                <table className="w-full border-collapse font-open-sans text-[0.8125rem]">
                  <thead>
                    <tr className="bg-[#1A1A1A]">
                      <th className="p-[0.625rem_0.875rem] text-left text-[#F0B429] font-montserrat font-bold text-[0.75rem]">Category</th>
                      <th className="p-[0.625rem_0.875rem] text-center text-[#F0B429] font-montserrat font-bold text-[0.75rem]">% of Bale</th>
                      <th className="p-[0.625rem_0.875rem] text-center text-[#F0B429] font-montserrat font-bold text-[0.75rem]">Approx. Pieces</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['T-Shirts & Polo Shirts', '30%', '36–54 pcs', 'bg-white'],
                      ['Hoodies & Sweatshirts', '20%', '24–36 pcs', 'bg-[#F5F5F0]'],
                      ['Jeans & Trousers', '20%', '24–36 pcs', 'bg-white'],
                      ['Jackets & Coats', '15%', '18–27 pcs', 'bg-[#F5F5F0]'],
                      ['Dresses & Skirts', '10%', '12–18 pcs', 'bg-white'],
                      ['Sportswear Sets', '5%', '6–9 pcs', 'bg-[#F5F5F0]']
                    ].map(([cat, pct, pcs, bg]) => (
                      <tr key={cat} className={`${bg} border-b border-[#eee]`}>
                        <td className="p-[0.5rem_0.875rem] text-[#444]">{cat}</td>
                        <td className="p-[0.5rem_0.875rem] text-center text-[#C0392B] font-bold">{pct}</td>
                        <td className="p-[0.5rem_0.875rem] text-center text-[#555]">{pcs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* PRODUCT GRID */}
          <section className="mb-[3rem]">
            <div className="flex items-center gap-[0.75rem] mb-[1.25rem]">
              <div className="w-[4px] h-[26px] bg-[#C0392B] rounded-[2px] shrink-0" />
              <h2 className="font-montserrat font-extrabold text-[1.4rem] text-[#1A1A1A] m-0">Product Categories Available</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[1.25rem]">
              {[
                { title: 'Used Brand T-Shirts', img: '/images/used-brand-clothes/cat-tshirt.jpg', desc: 'Nike, Adidas, Puma mix', spec: '25kg/bale' },
                { title: 'Used Brand Jeans', img: '/images/used-brand-clothes/cat-jeans.jpg', desc: "Levi's, Gap, Zara mix", spec: '45kg/bale' },
                { title: 'Used Brand Jackets', img: '/images/used-brand-clothes/cat-jacket.jpg', desc: 'North Face, Nike, Adidas', spec: '30kg/bale' },
                { title: 'Used Brand Dresses', img: '/images/used-brand-clothes/cat-dress.jpg', desc: 'Zara, H&M, Mango mix', spec: '25kg/bale' },
                { title: 'Used Brand Hoodies', img: '/images/used-brand-clothes/cat-hoodie.jpg', desc: 'Champion, Nike, Adidas', spec: '35kg/bale' },
                { title: 'Used Brand Sportswear', img: '/images/used-brand-clothes/cat-sportswear.jpg', desc: 'Nike, Adidas, Under Armour', spec: '30kg/bale' }
              ].map(prod => (
                <div key={prod.title} className="bg-white border border-[#eee] rounded-[6px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <div className="relative h-[170px]">
                    <Image src={prod.img} alt={prod.title} fill className="object-cover" />
                    <div className="absolute top-2 left-2 bg-[#C0392B] text-white text-[0.6rem] font-bold px-2 py-1 rounded-[2px] font-montserrat">A-GRADE</div>
                  </div>
                  <div className="p-[0.875rem]">
                    <h3 className="font-montserrat text-[0.875rem] font-bold text-[#1A1A1A] m-0 mb-[0.3rem]">{prod.title}</h3>
                    <p className="text-[0.75rem] text-[#888] m-0 mb-[0.5rem]">{prod.desc}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[0.75rem] text-[#C0392B] font-bold">{prod.spec}</span>
                      <a href="#inquiry" className="bg-[#1A1A1A] text-white text-[0.7rem] px-[0.75rem] py-[0.3rem] rounded-[2px] no-underline font-montserrat font-semibold">Inquire</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SPECS TABLE */}
          <section className="mb-[3rem]">
            <div className="flex items-center gap-[0.75rem] mb-[1.25rem]">
              <div className="w-[4px] h-[26px] bg-[#C0392B] rounded-[2px] shrink-0" />
              <h2 className="font-montserrat font-extrabold text-[1.4rem] text-[#1A1A1A] m-0">Product Specifications & Pricing</h2>
            </div>
            <div className="rt-table-wrap overflow-x-auto rounded-[6px] shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
              <table className="w-full border-collapse text-[0.8125rem] bg-white min-w-[700px]">
                <thead>
                  <tr className="bg-[#1A1A1A]">
                    <th className="p-[0.875rem_1rem] text-left text-[#F0B429] font-montserrat font-bold">Category</th>
                    <th className="p-[0.875rem_1rem] text-center text-[#F0B429] font-montserrat font-bold">Grade</th>
                    <th className="p-[0.875rem_1rem] text-center text-[#F0B429] font-montserrat font-bold">Bale Weight</th>
                    <th className="p-[0.875rem_1rem] text-center text-[#F0B429] font-montserrat font-bold">MOQ</th>
                    <th className="p-[0.875rem_1rem] text-center text-[#F0B429] font-montserrat font-bold">Price Range</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Mixed Brand Clothes', {label: 'A', bg: 'bg-[#27AE60]'}, '45 kg', '100 bales', '$1.8–$2.5/kg', 'bg-white'],
                    ['Nike / Adidas Specific', {label: 'A', bg: 'bg-[#27AE60]'}, '45 kg', '200 bales', '$3.5–$5.0/kg', 'bg-[#FAFAFA]'],
                    ['Denim & Jeans Mix', {label: 'A', bg: 'bg-[#27AE60]'}, '45 kg', '100 bales', '$2.0–$3.0/kg', 'bg-white'],
                    ['Jackets & Coats Mix', {label: 'A/B', bg: 'bg-[#C0392B]'}, '30 kg', '100 bales', '$2.5–$4.0/kg', 'bg-[#FAFAFA]'],
                    ["Children's Clothes Mix", {label: 'A', bg: 'bg-[#27AE60]'}, '25 kg', '100 bales', '$1.5–$2.2/kg', 'bg-white'],
                    ['Mixed Brand (B-Grade)', {label: 'B', bg: 'bg-[#F0B429]'}, '45 kg', '100 bales', '$0.8–$1.2/kg', 'bg-[#FAFAFA]'],
                    ['Bulk Mixed (C-Grade)', {label: 'C', bg: 'bg-[#C0392B]'}, '45 kg', '500 bales', '$0.3–$0.6/kg', 'bg-white'],
                  ].map(([cat, grade, w, moq, price, rowBg]) => (
                    <tr key={cat as string} className={`${rowBg} border-b border-[#f0f0f0]`}>
                      <td className="p-[0.75rem_1rem] font-semibold text-[#1A1A1A]">{cat as string}</td>
                      <td className="p-[0.75rem_1rem] text-center">
                        <span className={`${(grade as any).bg} text-white text-[0.65rem] font-montserrat font-bold p-[0.2rem_0.5rem] rounded-[2px]`}>{(grade as any).label}</span>
                      </td>
                      <td className="p-[0.75rem_1rem] text-center text-[#555]">{w as string}</td>
                      <td className="p-[0.75rem_1rem] text-center">
                        <span className="bg-[#F0B429] text-[#1A1A1A] text-[0.7rem] font-montserrat font-bold p-[0.2rem_0.5rem] rounded-[2px]">{moq as string}</span>
                      </td>
                      <td className="p-[0.75rem_1rem] text-center text-[#C0392B] font-bold">{price as string}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[0.75rem] text-[#aaa] font-open-sans italic mt-[0.625rem]">* Prices are indicative. Contact us for a current quote. Volume discounts for orders above 1,000 bales.</p>
          </section>

          {/* QUALITY STANDARDS */}
          <QualityStandards standards={clothesStandards} />

          {/* TRUST SECTIONS (Why Choose Us & FAQ) */}
          <ProductTrustSections features={clothesFeatures} faqs={clothesFaqs} />

        </div>{/* END LEFT CONTENT */}

        {/* ─── RIGHT SIDEBAR ─── */}
        <aside>
          <div className="sticky top-[90px]">

            {/* Sticky Inquiry CTA */}
            {/* Sticky Inquiry CTA */}
            <div id="inquiry" className="bg-white border border-[#eee] rounded-[8px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden mb-[1.5rem]">
              <div className="bg-[#C0392B] p-[1.25rem_1.5rem]">
                <h3 className="font-montserrat text-[1rem] font-extrabold text-white m-0 mb-[0.25rem]">Get Wholesale Price</h3>
                <p className="text-[0.75rem] text-white/80 m-0">Reply within 12 hours · Free samples available</p>
              </div>
              <div className="p-[1.5rem]">
                 <InquiryForm variant="sidebar" />
                 <a href="https://wa.me/8613367481710?text=Hi%2C+I+want+used+brand+clothes+wholesale+price" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-[0.5rem] bg-[#25D366] text-white p-[0.625rem] rounded-[3px] no-underline font-montserrat font-bold text-[0.8125rem] mt-[0.75rem] hover:bg-[#1da851] transition-colors">
                   💬 Chat on WhatsApp
                 </a>
               </div>
            </div>

            {/* Quick Specs */}
            <div className="bg-[#1A1A1A] rounded-[8px] p-[1.5rem] mb-[1.5rem]">
              <h4 className="font-montserrat text-[0.875rem] font-extrabold text-[#F0B429] m-0 mb-[1rem]">Quick Specs</h4>
              {[
                ['MOQ', '100 bales (4,500 kg)'],
                ['Bale Weight', '25–70 kg/bale'],
                ['Quality', 'A / B / C Grade'],
                ['Lead Time', '7–14 days'],
                ['Payment', 'T/T, Western Union'],
                ['Shipping', 'FOB Guangzhou / CIF'],
                ['Quality Check', '6-Point Inspection']
              ].map(([key, val]) => (
                <div key={key} className="flex justify-between py-[0.4rem] border-b border-white/5 text-[0.8rem]">
                  <span className="text-white/55">{key}</span>
                  <span className="text-white font-semibold">{val}</span>
                </div>
              ))}
            </div>

            {/* Related Products */}
            <div className="bg-white border border-[#eee] rounded-[8px] p-[1.5rem]">
              <h4 className="font-montserrat text-[0.875rem] font-extrabold text-[#1A1A1A] m-0 mb-[1rem]">Also Available</h4>
              {[
                { icon: '👟', title: 'Used Brand Shoes', href: '/used-brand-shoes' },
                { icon: '👜', title: 'Used Brand Bags', href: '/used-brand-bags' },
                { icon: '📋', title: 'How To Order', href: '/how-to-order' },
                { icon: '📧', title: 'Contact Us', href: '/contact-us' }
              ].map(rel => (
                <Link key={rel.title} href={rel.href} className="flex items-center gap-[0.75rem] py-[0.625rem] border-b border-[#f5f5f5] no-underline group">
                  <span className="text-[1.25rem]">{rel.icon}</span>
                  <span className="font-open-sans text-[0.8125rem] text-[#333] font-semibold group-hover:text-[#C0392B] transition-colors">{rel.title}</span>
                  <span className="text-[#C0392B] text-[0.75rem] ml-auto group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              ))}
            </div>

          </div>
        </aside>

      </div>{/* END MAIN GRID */}

      {/* BOTTOM CTA BANNER */}
      <ProductCTA 
        title="Ready to Order Used Brand Clothes?"
        description="Get a free price quotation within 12 hours. Our sales team speaks English, French, Spanish, and Arabic."
        whatsappMessage="Hi, I want to wholesale used brand clothes. Can I get a price list?"
      />

    </main>
  );
}
