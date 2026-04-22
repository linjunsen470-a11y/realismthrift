import Image from "next/image";
import Link from "next/link";
import { InquiryForm } from "@/components/InquiryForm";

export const metadata = {
  title: "How to Order | RealismThrift Wholesale",
  description: "Simple 7-step process to wholesale used brand clothes, shoes and bags from RealismThrift.",
};

export default function HowToOrderPage() {
  return (
    <main className="bg-white">
      {/* PAGE HERO */}
      <section className="rt-page-hero bg-[linear-gradient(135deg,#1A1A1A_0%,#2a1515_60%,#C0392B_100%)]">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/img/order/order-hero.jpg" 
            alt="How to order background" 
            fill 
            className="object-cover opacity-[0.4]" 
            priority 
          />
        </div>
        <div className="rt-container relative z-10 text-center pb-12 w-full pt-16">
          <h1 className="rt-page-hero-title mb-4">
            How To <span className="text-brand-gold">Order</span>
          </h1>
          <p className="rt-page-hero-sub max-w-[600px] mx-auto mb-7 leading-[1.7]">
            Simple 7-step process to wholesale used brand clothes, shoes and bags from RealismThrift. From inquiry to delivery — we guide you every step of the way.
          </p>
          <Link href="#inquiry-form" className="bg-brand-gold text-brand-dark px-10 py-3.5 rounded-[3px] font-bold font-montserrat text-[0.9rem] inline-block hover:transform hover:-translate-y-0.5 transition-all">
            Start Your Order →
          </Link>
        </div>
      </section>

      {/* PROCESS STEPS */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-montserrat text-[1.75rem] font-extrabold text-brand-dark mb-3.5">7-Step Wholesale Process</h2>
          <div className="rt-section-divider center mb-4" />
          <p className="text-[#666] text-[0.9375rem] max-w-[600px] mx-auto leading-[1.7]">
            Follow these simple steps to place your wholesale order. Our sales team will support you throughout the entire process.
          </p>
        </div>

        {/* Step 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-t-[8px] overflow-hidden border border-[#eee] border-b-0">
          <div className="bg-white p-12 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-5">
              <div className="bg-brand-red text-white font-montserrat text-[1.5rem] font-extrabold w-12 h-12 rounded-full flex items-center justify-center shrink-0">01</div>
              <h3 className="font-montserrat text-[1.2rem] font-extrabold text-brand-dark m-0">Confirm Product Categories</h3>
            </div>
            <p className="text-[0.9375rem] text-[#555] leading-[1.8] mb-6">
              Choose from our three main product lines: Used Brand Clothes, Used Brand Shoes, or Used Brand Bags. You can also mix categories in a single container order. Tell us your target market and we will recommend the most suitable product mix for your region.
            </p>
            <div className="flex gap-2.5 flex-wrap">
              <span className="bg-[#F5F5F0] border border-[#e0e0e0] text-[#333] px-3 py-1.5 rounded-sm text-[0.75rem] font-montserrat font-semibold">Used Brand Clothes</span>
              <span className="bg-[#F5F5F0] border border-[#e0e0e0] text-[#333] px-3 py-1.5 rounded-sm text-[0.75rem] font-montserrat font-semibold">Used Brand Shoes</span>
              <span className="bg-[#F5F5F0] border border-[#e0e0e0] text-[#333] px-3 py-1.5 rounded-sm text-[0.75rem] font-montserrat font-semibold">Used Brand Bags</span>
            </div>
          </div>
          <div className="relative min-h-[280px]">
            <Image src="/img/order/step-categories.webp" alt="Confirm Categories" fill className="object-cover" />
          </div>
        </div>

        {/* Step 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 border border-[#eee] border-b-0">
          <div className="relative min-h-[280px] order-2 md:order-1">
            <Image src="/img/order/step-quantity.jpg" alt="Confirm Quantity" fill className="object-cover" />
          </div>
          <div className="bg-[#F5F5F0] p-12 flex flex-col justify-center order-1 md:order-2">
            <div className="flex items-center gap-4 mb-5">
              <div className="bg-brand-dark text-brand-gold font-montserrat text-[1.5rem] font-extrabold w-12 h-12 rounded-full flex items-center justify-center shrink-0">02</div>
              <h3 className="font-montserrat text-[1.2rem] font-extrabold text-brand-dark m-0">Confirm Your Order Quantity</h3>
            </div>
            <p className="text-[0.9375rem] text-[#555] leading-[1.8] mb-6">
              We accept orders from small lots (100+ bales) up to multiple full containers. The larger your order, the better the unit price. Our sales team will provide a detailed price list based on your confirmed quantity. Minimum order quantities vary by product type.
            </p>
            <div className="flex gap-2.5 flex-wrap">
              <span className="bg-white border border-[#e0e0e0] text-[#333] px-3 py-1.5 rounded-sm text-[0.75rem] font-montserrat font-semibold">≥100 Bales</span>
              <span className="bg-white border border-[#e0e0e0] text-[#333] px-3 py-1.5 rounded-sm text-[0.75rem] font-montserrat font-semibold">1 × 20ft Container</span>
              <span className="bg-white border border-[#e0e0e0] text-[#333] px-3 py-1.5 rounded-sm text-[0.75rem] font-montserrat font-semibold">1 × 40ft Container</span>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 border border-[#eee] border-b-0">
          <div className="bg-white p-12 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-5">
              <div className="bg-brand-red text-white font-montserrat text-[1.5rem] font-extrabold w-12 h-12 rounded-full flex items-center justify-center shrink-0">03</div>
              <h3 className="font-montserrat text-[1.2rem] font-extrabold text-brand-dark m-0">Discuss Prices & Discounts</h3>
            </div>
            <p className="text-[0.9375rem] text-[#555] leading-[1.8] mb-6">
              Our professional sales team will provide you with a detailed price quotation within 12 hours. Prices are based on product category, grade, quantity, and destination port. Long-term partners enjoy additional discounts, priority loading, and dedicated account management.
            </p>
            <div className="flex gap-2.5 flex-wrap">
              <span className="bg-[#F5F5F0] border border-[#e0e0e0] text-[#333] px-3 py-1.5 rounded-sm text-[0.75rem] font-montserrat font-semibold">Price Quotation</span>
              <span className="bg-[#F5F5F0] border border-[#e0e0e0] text-[#333] px-3 py-1.5 rounded-sm text-[0.75rem] font-montserrat font-semibold">Volume Discounts</span>
              <span className="bg-[#F5F5F0] border border-[#e0e0e0] text-[#333] px-3 py-1.5 rounded-sm text-[0.75rem] font-montserrat font-semibold">Free Samples</span>
            </div>
          </div>
          <div className="relative min-h-[280px]">
             <Image src="/img/order/step-prices.jpg" alt="Discuss Prices" fill className="object-cover" />
          </div>
        </div>

        {/* Step 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 border border-[#eee] border-b-0">
          <div className="relative min-h-[280px] order-2 md:order-1">
             <Image src="/img/order/step-quality.webp" alt="Confirm Grade" fill className="object-cover" />
          </div>
          <div className="bg-[#F5F5F0] p-12 flex flex-col justify-center order-1 md:order-2">
            <div className="flex items-center gap-4 mb-5">
              <div className="bg-brand-dark text-brand-gold font-montserrat text-[1.5rem] font-extrabold w-12 h-12 rounded-full flex items-center justify-center shrink-0">04</div>
              <h3 className="font-montserrat text-[1.2rem] font-extrabold text-brand-dark m-0">Confirm Quality Grade</h3>
            </div>
            <p className="text-[0.9375rem] text-[#555] leading-[1.8] mb-6">
              We offer A-grade and B-grade products. A-grade items are the highest quality — no stains, no tears, no broken hardware. B-grade items may have minor imperfections but remain fully wearable. All grades are clearly labeled and priced accordingly. We send you sample photos before you confirm.
            </p>
            <div className="flex gap-2.5 flex-wrap">
              <span className="bg-white border border-[#e0e0e0] text-[#333] px-3 py-1.5 rounded-sm text-[0.75rem] font-montserrat font-semibold">A-Grade Premium</span>
              <span className="bg-white border border-[#e0e0e0] text-[#333] px-3 py-1.5 rounded-sm text-[0.75rem] font-montserrat font-semibold">B-Grade Value</span>
              <span className="bg-white border border-[#e0e0e0] text-[#333] px-3 py-1.5 rounded-sm text-[0.75rem] font-montserrat font-semibold">Photo Verification</span>
            </div>
          </div>
        </div>

        {/* Step 5 */}
        <div className="grid grid-cols-1 md:grid-cols-2 border border-[#eee] border-b-0">
          <div className="bg-white p-12 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-5">
              <div className="bg-brand-red text-white font-montserrat text-[1.5rem] font-extrabold w-12 h-12 rounded-full flex items-center justify-center shrink-0">05</div>
              <h3 className="font-montserrat text-[1.2rem] font-extrabold text-brand-dark m-0">Confirm PI & Payment</h3>
            </div>
            <p className="text-[0.9375rem] text-[#555] leading-[1.8] mb-6">
              Once you confirm the product details, quantity, and price, we issue a Proforma Invoice (PI). We accept T/T bank transfer, Western Union, and other major payment methods. A 30% deposit is required to begin production. The remaining 70% is paid before shipment.
            </p>
            <div className="flex gap-2.5 flex-wrap">
              <span className="bg-[#F5F5F0] border border-[#e0e0e0] text-[#333] px-3 py-1.5 rounded-sm text-[0.75rem] font-montserrat font-semibold">T/T Bank Transfer</span>
              <span className="bg-[#F5F5F0] border border-[#e0e0e0] text-[#333] px-3 py-1.5 rounded-sm text-[0.75rem] font-montserrat font-semibold">Western Union</span>
              <span className="bg-[#F5F5F0] border border-[#e0e0e0] text-[#333] px-3 py-1.5 rounded-sm text-[0.75rem] font-montserrat font-semibold">30% Deposit</span>
            </div>
          </div>
          <div className="relative min-h-[280px]">
             <Image src="/img/order/step-payment.jpg" alt="Confirm Payment" fill className="object-cover" />
          </div>
        </div>

        {/* Step 6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 border border-[#eee] border-b-0">
          <div className="relative min-h-[280px] order-2 md:order-1">
             <Image src="/img/order/step-production-inspection.jpg" alt="Production & Inspection" fill className="object-cover" />
          </div>
          <div className="bg-[#F5F5F0] p-12 flex flex-col justify-center order-1 md:order-2">
            <div className="flex items-center gap-4 mb-5">
              <div className="bg-brand-dark text-brand-gold font-montserrat text-[1.5rem] font-extrabold w-12 h-12 rounded-full flex items-center justify-center shrink-0">06</div>
              <h3 className="font-montserrat text-[1.2rem] font-extrabold text-brand-dark m-0">Production & Inspection</h3>
            </div>
            <p className="text-[0.9375rem] text-[#555] leading-[1.8] mb-6">
              After payment confirmation, we begin sorting, grading, and packing your specific order. This typically takes 7–14 days. Before container loading, we send you detailed photos and videos of your packed bales/sacks for your approval.
            </p>
            <div className="flex gap-2.5 flex-wrap">
              <span className="bg-white border border-[#e0e0e0] text-[#333] px-3 py-1.5 rounded-sm text-[0.75rem] font-montserrat font-semibold">7-14 Day Lead Time</span>
              <span className="bg-white border border-[#e0e0e0] text-[#333] px-3 py-1.5 rounded-sm text-[0.75rem] font-montserrat font-semibold">Photo & Video Proof</span>
            </div>
          </div>
        </div>

        {/* Step 7 */}
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-b-[8px] border border-[#eee] overflow-hidden">
          <div className="bg-white p-12 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-5">
              <div className="bg-brand-red text-white font-montserrat text-[1.5rem] font-extrabold w-12 h-12 rounded-full flex items-center justify-center shrink-0">07</div>
              <h3 className="font-montserrat text-[1.2rem] font-extrabold text-brand-dark m-0">Shipment & After-Sales</h3>
            </div>
            <p className="text-[0.9375rem] text-[#555] leading-[1.8] mb-6">
              We handle all export documentation including commercial invoice, packing list, bill of lading, and certificate of origin. After delivery, our team is available to handle any quality concerns through fair negotiation and compensation.
            </p>
            <div className="flex gap-2.5 flex-wrap">
              <span className="bg-[#F5F5F0] border border-[#e0e0e0] text-[#333] px-3 py-1.5 rounded-sm text-[0.75rem] font-montserrat font-semibold">Export Documentation</span>
              <span className="bg-[#F5F5F0] border border-[#e0e0e0] text-[#333] px-3 py-1.5 rounded-sm text-[0.75rem] font-montserrat font-semibold">Flexible Compensation</span>
            </div>
          </div>
          <div className="relative h-[260px] md:h-auto md:min-h-[280px]">
             <Image
               src="/images/reconstructed/1494412574643-ff11b0a5c1c3.jpg"
               alt="Shipment and after-sales support at the destination port"
               fill
               sizes="(min-width: 768px) 50vw, 100vw"
               className="object-cover object-[58%_52%] md:object-center"
               priority
             />
          </div>
        </div>
      </section>

      {/* CONTAINER SPECS */}
      <section className="bg-brand-dark py-16">
        <div className="rt-container max-w-[1280px]">
          <div className="text-center mb-10">
            <h2 className="font-montserrat text-[1.75rem] font-extrabold text-white mb-3.5">Container Loading Reference</h2>
            <div className="rt-section-divider center mb-4" />
            <p className="text-white/65 text-[0.9375rem] max-w-[600px] mx-auto">Use this guide to plan your order quantity. Contact us for exact loading plans based on your specific product mix.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-[8px] p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-brand-red text-white font-montserrat text-[1.1rem] font-extrabold px-4 py-2 rounded-[3px]">20ft Container</div>
                <span className="text-white/60 text-[0.875rem]">~13,000 kg capacity</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70 text-[0.875rem]">Used Clothes (45kg bales)</span>
                  <span className="text-brand-gold font-montserrat font-bold text-[0.875rem]">≥320 bales</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70 text-[0.875rem]">Used Shoes (25kg sacks)</span>
                  <span className="text-brand-gold font-montserrat font-bold text-[0.875rem]">≥480 sacks</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70 text-[0.875rem]">Brand Shoes (pairs)</span>
                  <span className="text-brand-gold font-montserrat font-bold text-[0.875rem]">≥8,000 pairs</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70 text-[0.875rem]">Used Bags (38kg sacks)</span>
                  <span className="text-brand-gold font-montserrat font-bold text-[0.875rem]">≥300 sacks</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-[8px] p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-brand-gold text-brand-dark font-montserrat text-[1.1rem] font-extrabold px-4 py-2 rounded-[3px]">40ft Container</div>
                <span className="text-white/60 text-[0.875rem]">~28,000 kg capacity</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70 text-[0.875rem]">Used Clothes (45kg bales)</span>
                  <span className="text-brand-gold font-montserrat font-bold text-[0.875rem]">≥630 bales</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70 text-[0.875rem]">Used Shoes (25kg sacks)</span>
                  <span className="text-brand-gold font-montserrat font-bold text-[0.875rem]">≥1,000 sacks</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70 text-[0.875rem]">Brand Shoes (pairs)</span>
                  <span className="text-brand-gold font-montserrat font-bold text-[0.875rem]">≥20,000 pairs</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70 text-[0.875rem]">Used Bags (38kg sacks)</span>
                  <span className="text-brand-gold font-montserrat font-bold text-[0.875rem]">≥650 sacks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BALE SIZE TABLE */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="rt-subsection-heading">
          <h2>Bale &amp; Sack Size Reference</h2>
          <div className="rt-section-divider" />
        </div>
        <div className="overflow-x-auto rounded-[6px] shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
          <table className="w-full border-collapse text-[0.8125rem] bg-white text-left font-open-sans">
            <thead>
              <tr className="bg-brand-dark text-white">
                <th className="p-3.5 px-4 font-montserrat font-semibold">Product</th>
                <th className="p-3.5 px-4 font-montserrat font-semibold">Weight (kg)</th>
                <th className="p-3.5 px-4 font-montserrat font-semibold">Length (cm)</th>
                <th className="p-3.5 px-4 font-montserrat font-semibold">Width (cm)</th>
                <th className="p-3.5 px-4 font-montserrat font-semibold">Height (cm)</th>
                <th className="p-3.5 px-4 font-montserrat font-semibold">Volume (m³)</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1 */}
              <tr className="border-b border-[#f0f0f0] bg-white">
                <td className="p-3 px-4 font-semibold text-brand-dark">Clothes (standard)</td>
                <td className="p-3 px-4 text-[#555]">45</td>
                <td className="p-3 px-4 text-[#555]">75</td>
                <td className="p-3 px-4 text-[#555]">40</td>
                <td className="p-3 px-4 text-[#555]">40</td>
                <td className="p-3 px-4 text-[#555]">0.120</td>
              </tr>
              {/* Row 2 */}
              <tr className="border-b border-[#f0f0f0] bg-[#fafafa]">
                <td className="p-3 px-4 font-semibold text-brand-dark">Clothes (small)</td>
                <td className="p-3 px-4 text-[#555]">25</td>
                <td className="p-3 px-4 text-[#555]">75</td>
                <td className="p-3 px-4 text-[#555]">35</td>
                <td className="p-3 px-4 text-[#555]">35</td>
                <td className="p-3 px-4 text-[#555]">0.092</td>
              </tr>
              {/* Row 3 */}
              <tr className="border-b border-[#f0f0f0] bg-white">
                <td className="p-3 px-4 font-semibold text-brand-dark">Clothes (large)</td>
                <td className="p-3 px-4 text-[#555]">70</td>
                <td className="p-3 px-4 text-[#555]">75</td>
                <td className="p-3 px-4 text-[#555]">47</td>
                <td className="p-3 px-4 text-[#555]">55</td>
                <td className="p-3 px-4 text-[#555]">0.194</td>
              </tr>
              {/* Row 4 */}
              <tr className="border-b border-[#f0f0f0] bg-[#fafafa]">
                <td className="p-3 px-4 font-semibold text-brand-dark">Shoes (mixed)</td>
                <td className="p-3 px-4 text-[#555]">25</td>
                <td className="p-3 px-4 text-[#555]">73</td>
                <td className="p-3 px-4 text-[#555]">60</td>
                <td className="p-3 px-4 text-[#555]">32</td>
                <td className="p-3 px-4 text-[#555]">0.140</td>
              </tr>
              {/* Row 5 */}
              <tr className="border-b border-[#f0f0f0] bg-white">
                <td className="p-3 px-4 font-semibold text-brand-dark">Brand Shoes (40 pairs)</td>
                <td className="p-3 px-4 text-[#555]">28–30</td>
                <td className="p-3 px-4 text-[#555]">90</td>
                <td className="p-3 px-4 text-[#555]">60</td>
                <td className="p-3 px-4 text-[#555]">30</td>
                <td className="p-3 px-4 text-[#555]">0.162</td>
              </tr>
              {/* Row 6 */}
              <tr className="border-b border-[#f0f0f0] bg-[#fafafa]">
                <td className="p-3 px-4 font-semibold text-brand-dark">Bags (mixed)</td>
                <td className="p-3 px-4 text-[#555]">38</td>
                <td className="p-3 px-4 text-[#555]">112</td>
                <td className="p-3 px-4 text-[#555]">68</td>
                <td className="p-3 px-4 text-[#555]">30</td>
                <td className="p-3 px-4 text-[#555]">0.228</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* PAYMENT & SHIPPING */}
      <section className="bg-brand-light py-16">
        <div className="rt-container max-w-[1280px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="rt-subsection-heading">
                <h2>Payment Methods</h2>
                <div className="rt-section-divider" />
              </div>
              <div className="bg-white rounded-[6px] p-5 mb-3.5 flex gap-4 items-start shadow-sm mix-blend-luminosity hover:mix-blend-normal transition-all">
                <span className="text-[1.5rem] shrink-0">🏦</span>
                <div>
                  <div className="font-montserrat text-[0.875rem] font-bold text-brand-dark mb-1">T/T Bank Transfer</div>
                  <div className="text-[0.8rem] text-[#666] leading-relaxed">Most common method. 30% deposit before production, 70% balance before shipment. Bank details provided in PI.</div>
                </div>
              </div>
              <div className="bg-white rounded-[6px] p-5 mb-3.5 flex gap-4 items-start shadow-sm mix-blend-luminosity hover:mix-blend-normal transition-all">
                <span className="text-[1.5rem] shrink-0">💸</span>
                <div>
                  <div className="font-montserrat text-[0.875rem] font-bold text-brand-dark mb-1">Western Union</div>
                  <div className="text-[0.8rem] text-[#666] leading-relaxed">Available for smaller orders. Suitable for first-time buyers who prefer quick transfers.</div>
                </div>
              </div>
              <div className="bg-white rounded-[6px] p-5 mb-3.5 flex gap-4 items-start shadow-sm mix-blend-luminosity hover:mix-blend-normal transition-all">
                <span className="text-[1.5rem] shrink-0">💳</span>
                <div>
                  <div className="font-montserrat text-[0.875rem] font-bold text-brand-dark mb-1">Other Methods</div>
                  <div className="text-[0.8rem] text-[#666] leading-relaxed">Contact our sales team to discuss alternative payment arrangements for large volume orders.</div>
                </div>
              </div>
            </div>
            <div>
              <div className="rt-subsection-heading">
                <h2>Shipping Options</h2>
                <div className="rt-section-divider" />
              </div>
              <div className="bg-white rounded-[6px] p-5 mb-3.5 flex gap-4 items-start shadow-sm mix-blend-luminosity hover:mix-blend-normal transition-all">
                <span className="text-[1.5rem] shrink-0">🚢</span>
                <div>
                  <div className="font-montserrat text-[0.875rem] font-bold text-brand-dark mb-1">FCL (Full Container Load)</div>
                  <div className="text-[0.8rem] text-[#666] leading-relaxed">20ft or 40ft containers. Best price per kg. Suitable for large orders. We handle all export documentation.</div>
                </div>
              </div>
              <div className="bg-white rounded-[6px] p-5 mb-3.5 flex gap-4 items-start shadow-sm mix-blend-luminosity hover:mix-blend-normal transition-all">
                <span className="text-[1.5rem] shrink-0">📦</span>
                <div>
                  <div className="font-montserrat text-[0.875rem] font-bold text-brand-dark mb-1">LCL (Less than Container)</div>
                  <div className="text-[0.8rem] text-[#666] leading-relaxed">Share a container with other buyers. Suitable for smaller orders. Higher cost per kg but lower minimum.</div>
                </div>
              </div>
              <div className="bg-white rounded-[6px] p-5 mb-3.5 flex gap-4 items-start shadow-sm mix-blend-luminosity hover:mix-blend-normal transition-all">
                <span className="text-[1.5rem] shrink-0">✈️</span>
                <div>
                  <div className="font-montserrat text-[0.875rem] font-bold text-brand-dark mb-1">Air Freight</div>
                  <div className="text-[0.8rem] text-[#666] leading-relaxed">Available for urgent small orders. Significantly higher cost. Contact us for air freight quotation.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INQUIRY SECTION */}
      <section id="inquiry-form" className="py-20 bg-[#f9f9f9]">
        <div className="max-w-[900px] mx-auto px-4">
          <div className="bg-white border border-[#eee] rounded-[12px] shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="bg-gradient-to-br from-[#C0392B] to-[#1A1A1A] p-10 text-center">
              <h2 className="font-montserrat text-[1.6rem] font-extrabold text-white mb-2.5">Send Us Your Inquiry</h2>
              <p className="text-white/75 text-[0.9375rem] font-open-sans">Get a price quotation within 12 hours. Our team speaks English, French, Spanish, and Arabic.</p>
            </div>
            <div className="p-10">
              <InquiryForm showWhatsApp />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-[800px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-montserrat text-[2rem] md:text-[2.5rem] font-black text-brand-dark uppercase">FREQUENTLY ASKED QUESTIONS</h2>
            <div className="rt-section-divider center" />
          </div>
          <div className="space-y-4">
            {[
              {
                q: "What is the minimum order quantity?",
                a: "For used clothes, the minimum is 100 bales (approximately 4,500 kg). For used shoes, the minimum is 200 pairs. For used bags, the minimum is 100 pieces. Container orders receive better pricing."
              },
              {
                q: "How long does it take to receive my order?",
                a: "Production and packing takes 7–14 days. Sea freight to Africa takes 20–35 days, Southeast Asia 15–25 days, Middle East 20–30 days. Air freight is available for urgent orders."
              },
              {
                q: "Can I see the products before paying?",
                a: "Yes. We send detailed photos and videos of your specific order before you pay the balance. For first-time buyers, we can also send physical samples (shipping cost covered by buyer)."
              },
              {
                q: "What quality grades do you offer?",
                a: "We primarily offer A-grade (highest quality, no visible defects) and B-grade (minor imperfections, fully wearable). All grades are clearly labeled and priced accordingly."
              },
              {
                q: "Do you handle customs clearance?",
                a: "We provide all export documentation (commercial invoice, packing list, bill of lading, certificate of origin). Import customs clearance in your country is the buyer's responsibility. We can recommend experienced customs brokers in major markets."
              },
              {
                q: "What happens if there is a quality issue?",
                a: "If you receive items that do not match the agreed grade, please send us photos and videos of the issue. Our team will review the claim and arrange fair compensation or replacement in your subsequent order."
              }
            ].map((faq, idx) => (
              <details key={idx} className="group bg-white border border-[#eee] rounded-[6px] shadow-[0_2px_6px_rgba(0,0,0,0.04)] overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex justify-between items-center p-5 px-6 font-montserrat font-bold text-[0.9375rem] text-brand-dark cursor-pointer select-none transition-all hover:bg-[#f9f9f9]">
                  {faq.q}
                  <span className="text-brand-red font-light text-[1.5rem] group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="p-5 px-6 pt-0 text-[0.875rem] text-[#555] font-open-sans leading-[1.75] border-t border-[#f0f0f0] mt-[-1px]">
                  <div className="pt-4">
                    {faq.a}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
