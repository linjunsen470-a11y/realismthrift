import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  productsData, 
  features, 
  orderSteps, 
  blogPosts 
} from "@/data/siteData";
import { InquiryForm } from "@/components/InquiryForm";
import { 
  Globe
} from "lucide-react";

export default function Home() {
  return (
    <div className="bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#1A1A1A]">
        {/* Accent Line */}
        <div className="rt-hero-accent-line" />
        
        {/* Background Image with Precise Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/img/hero-bg.png" 
            alt="RealismThrift Factory" 
            fill 
            className="object-cover opacity-60 brightness-[0.4]" 
            priority
          />
          <div className="rt-hero-overlay absolute inset-0 z-10" />
        </div>

        <div className="rt-container relative z-20 py-20">
          <div className="max-w-[680px] space-y-6">
            <div className="rt-fade-in">
              <div className="inline-flex items-center gap-2 bg-brand-red/20 border border-brand-red/40 rounded-full px-4 py-1.5 text-brand-gold text-[0.8125rem] font-semibold font-montserrat mb-6">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-rt-pulse" />
                #1 Second Hand Clothes Supplier in China
              </div>
            </div>
            
            <h1 className="text-hero-title font-black !text-white leading-[1.1] font-montserrat uppercase tracking-[-0.02em] rt-fade-in [animation-delay:200ms]">
              Direct Second Hand Brand Clothes, Shoes & Bags Factory
            </h1>
            
            <p className="text-[1rem] text-white/80 font-open-sans max-w-xl rt-fade-in [animation-delay:400ms]">
              RealismThrift: Leading wholesale supplier of second-hand garments. We export A-Grade quality to 100+ countries with 12+ years of industry experience.
            </p>

            <div className="flex flex-wrap gap-2 mb-8 rt-fade-in [animation-delay:600ms]">
               {["NO STAINS", "NO TEARS", "NO FADING", "A-GRADE QUALITY"].map((tag, idx) => (
                 <span key={tag} className="bg-white/10 border border-white/20 text-white/90 text-[0.8125rem] px-3.5 py-1.5 rounded-full font-open-sans">
                   {idx === 3 ? "✅ " : ""} {tag}
                 </span>
               ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4 rt-fade-in [animation-delay:800ms]">
              <Link href="#contact" className="rt-btn-primary">
                GET WHOLESALE PRICE LIST
              </Link>
              <Link href="#products" className="rt-btn-outline">
                VIEW PRODUCTS →
              </Link>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-4 gap-px bg-white/10 rounded-[4px] overflow-hidden max-w-[600px] mt-12 rt-fade-in [animation-delay:1000ms]">
              {[
                { val: "15,000m²", label: "Factory" },
                { val: "100+", label: "Countries" },
                { val: "80%", label: "Reorder" },
                { val: "A-Grade", label: "Quality" },
              ].map((stat) => (
                <div key={stat.label} className="bg-black/40 p-4 text-center">
                  <div className="text-brand-gold text-[1.5rem] font-black font-montserrat">{stat.val}</div>
                  <div className="text-white/70 text-[0.6875rem] uppercase font-open-sans mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BANNER */}
      <div className="bg-[#1A1A1A] py-4 border-b border-white/5">
        <div className="rt-container">
          <div className="flex flex-wrap items-center justify-center gap-8 text-white/85 font-open-sans text-[0.8125rem]">
            <span className="flex items-center gap-2"><span className="text-brand-gold">★</span> A-Grade Quality Guarantee</span>
            <span className="flex items-center gap-2"><span className="text-brand-gold">⚡</span> 12+ Years Experience</span>
            <span className="flex items-center gap-2"><span className="text-brand-gold">🚢</span> Fast 7-Day Loading</span>
            <span className="flex items-center gap-2"><span className="text-brand-gold">🔄</span> 80%+ Reorder Rate</span>
          </div>
        </div>
      </div>

      {/* 3. PRODUCT CATEGORIES */}
      <section id="products" className="py-20 bg-white">
        <div className="rt-container text-center">
          <div className="mb-12">
            <span className="rt-section-badge">WHOLESALE PRODUCTS</span>
            <h2 className="rt-section-title">PRODUCT CATEGORIES</h2>
            <div className="rt-section-divider center" />
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[ "NO Stains or Dirt", "NO Tears or Holes", "NO Fading or Overuse"].map(txt => (
              <span key={txt} className="flex items-center gap-1.5 bg-[#f9f9f9] border border-gray-200 px-3.5 py-1.5 rounded-full text-[0.8125rem] text-[#555] font-open-sans">
                <span className="text-brand-red font-black text-xs">×</span> {txt}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
            {productsData.map((product) => (
              <Link key={product.id} href={product.href} className="rt-product-card group relative rounded-[4px] shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden">
                <div className="relative h-[200px] overflow-hidden">
                  <Image 
                    src={product.image} 
                    alt={product.title} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute top-2.5 left-2.5 bg-brand-dark text-white text-[10px] font-bold font-montserrat px-2 py-[0.2rem] rounded-[2px] tracking-wider z-10">
                    WHOLESALE
                  </div>
                  <div className="absolute inset-0 bg-brand-red/85 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <span className="text-white font-montserrat font-bold text-sm tracking-widest px-4 py-2 border-2 border-white">EXPLORE →</span>
                  </div>
                </div>
                <div className="bg-white py-3 px-4 relative z-10 border-t border-gray-50">
                  <h3 className="text-brand-dark font-montserrat font-bold text-[0.875rem] text-center uppercase tracking-tight">{product.title}</h3>
                </div>
              </Link>
            ))}
          </div>

          <Link href="#contact" className="rt-btn-primary mt-10">
            GET WHOLESALE PRICE LIST →
          </Link>
        </div>
      </section>

      {/* 4. ABOUT SECTION */}
      <section id="about" className="py-20 bg-[#F5F5F0]">
        <div className="rt-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="relative">
               <div className="relative h-[420px] rounded-[4px] overflow-hidden shadow-2xl">
                <Image src="/img/about-img.jpg" alt="Warehouse" fill className="object-cover" />
               </div>
               <div className="absolute bottom-4 left-4 bg-brand-red text-white font-montserrat font-bold text-[0.875rem] px-4 py-2 rounded-[2px] shadow-lg">
                  Quality Control Since 2012
               </div>
               <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-dark rounded-[4px] -z-10" />
               <div className="absolute -top-4 -left-4 w-16 h-16 bg-brand-red/20 rounded-[4px] -z-10" />
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-brand-gold font-bold font-montserrat text-[1rem] block mb-2 tracking-tight">Reliable Wholesale Partner</span>
                <h2 className="rt-section-title !mt-0 uppercase">WHY CHOOSE US</h2>
                <div className="rt-section-divider !w-20" />
              </div>
              
              <div className="space-y-4 text-[#555] font-open-sans leading-[1.7] text-[1rem]">
                <p>RealismThrift Export Co., Ltd is a world leader in recycling used fashion. We help businesses in Africa, Southeast Asia, the Middle East, and the Americas get the best second-hand clothes, shoes, and bags at wholesale prices.</p>
                <p>We operate from a 15,000-square-meter facility with 300+ dedicated staff members. Our strict quality control ensures long-term partnerships with clients in more than 100 countries.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  { label: "Reorder Rate", val: "80%" },
                  { label: "Countries Served", val: "100+" },
                ].map(stat => (
                  <div key={stat.label} className="bg-white p-4 rounded-[4px] border border-gray-200 text-center">
                    <div className="text-[2rem] font-black text-brand-gold font-montserrat tracking-tight leading-none">{stat.val}</div>
                    <div className="text-[0.8125rem] text-gray-400 font-open-sans mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PARTNERS SECTION */}
      <section className="py-20 bg-brand-dark text-white">
        <div className="rt-container">
          <div className="text-center mb-10">
            <h2 className="rt-section-title !text-white uppercase">OUR GLOBAL PARTNERS</h2>
            <div className="rt-section-divider center" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { r: "🌍", n: "AFRICA", c: "Nigeria, Ghana, Tanzania, Kenya, Uganda +5 more" },
              { r: "🌏", n: "SOUTHEAST ASIA", c: "Philippines, Indonesia, Vietnam, Cambodia +4 more" },
              { r: "🌍", n: "MIDDLE EAST", c: "UAE, Saudi Arabia, Jordan, Yemen, Iraq +4 more" }
            ].map(item => (
              <div key={item.n} className="bg-white/10 border border-white/10 rounded-[4px] p-5 hover:bg-white/15 transition-colors">
                <div className="text-[1.5rem] mb-2">{item.r}</div>
                <h3 className="font-montserrat font-bold text-brand-gold text-[1rem] mb-1">{item.n}</h3>
                <p className="text-[0.8125rem] text-white/60 font-open-sans">{item.c}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <span className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full font-montserrat font-bold text-[0.8125rem] tracking-widest uppercase">
              <Globe size={18} className="text-brand-red" /> 100+ Countries Served Worldwide
            </span>
          </div>
        </div>
      </section>

      {/* 6. CONTACT SECTION */}
      <section id="contact" className="py-20 bg-brand-dark text-white relative">
        <div className="rt-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-12">
              <div className="space-y-4">
                <span className="rt-section-badge !text-brand-gold !border-brand-gold">GET IN TOUCH</span>
                <h2 className="text-[2.25rem] md:text-[3rem] font-black font-montserrat uppercase leading-[1.1] tracking-tight">GET WHOLESALE PRICE NOW</h2>
                <p className="text-white/60 font-open-sans text-[1.125rem]">Consult your used clothing export specialist. We reply within 12 hours with a full catalog.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { icon: "✉", label: "EMAIL US", val: "sales@realismthrift.com", link: "mailto:sales@realismthrift.com" },
                  { icon: "💬", label: "WHATSAPP", val: "+86 188 0000 0001", link: "https://wa.me/8618800000001" },
                ].map(item => (
                  <div key={item.label} className="flex gap-4">
                    <div className="w-12 h-12 bg-brand-red rounded-[2px] flex items-center justify-center shrink-0 text-white text-[1.5rem] shadow-lg">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-[0.6875rem] font-black text-brand-gold tracking-[0.2em] mb-1">{item.label}</div>
                      <a href={item.link} className="text-[1rem] font-bold hover:text-brand-gold font-montserrat">{item.val}</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-10 rounded-[4px] shadow-2xl relative">
              <div className="absolute top-0 right-0 w-10 h-10 bg-brand-gold rounded-bl-[30px]" />
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
