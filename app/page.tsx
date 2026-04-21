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
            className="object-cover" 
            priority
          />
          <div className="rt-hero-overlay absolute inset-0 z-10" />
        </div>

        <div className="rt-container relative z-20 py-20">
          <div className="max-w-[720px] space-y-6">
            <div className="rt-fade-in">
              <div className="inline-flex items-center gap-2 bg-brand-red/20 border border-brand-red/40 rounded-full px-4 py-1.5 text-brand-gold text-[0.8125rem] font-semibold font-montserrat mb-3">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-rt-pulse" />
                #1 Second Hand Clothes Supplier in China
              </div>
            </div>
            
            <h1 className="text-[clamp(2.25rem,5vw,3.75rem)] font-black text-white leading-[1.05] font-montserrat tracking-[-0.02em] rt-fade-in [animation-delay:200ms] drop-shadow-md">
              Direct Second Hand Brand Clothes, Shoes & Bags Factory
            </h1>
            
            <p className="text-[1.125rem] text-white/90 font-open-sans max-w-xl rt-fade-in [animation-delay:400ms]">
              Wholesale to 100+ Countries | A-Grade Quality | Fast Delivery
            </p>

            <div className="flex flex-wrap gap-2.5 mb-8 rt-fade-in [animation-delay:600ms]">
               {["❌ No Stains", "❌ No Tears", "❌ No Fading", "✅ A-Grade Quality"].map((tag) => (
                 <span key={tag} className="bg-white/10 border border-white/20 text-white/90 text-[0.8125rem] px-4 py-1.5 rounded-full font-open-sans backdrop-blur-sm">
                   {tag}
                 </span>
               ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4 rt-fade-in [animation-delay:800ms]">
              <Link href="#contact" className="rt-btn-primary !px-10 !py-[1.125rem]">
                GET LATEST WHOLESALE PRICE LIST
              </Link>
              <Link href="#products" className="rt-btn-outline !px-10 !py-[1.125rem]">
                VIEW PRODUCTS →
              </Link>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-4 gap-px bg-white/10 rounded-[4px] overflow-hidden max-w-[620px] mt-12 rt-fade-in [animation-delay:1000ms]">
              {[
                { val: "15,000m²", label: "Modern Factory" },
                { val: "100+", label: "Countries Served" },
                { val: "80%", label: "Reorder Rate" },
                { val: "A-Grade", label: "Quality Standard" },
              ].map((stat) => (
                <div key={stat.label} className="bg-black/40 p-5 text-center backdrop-blur-sm">
                  <div className="text-brand-gold text-[1.5rem] font-black font-montserrat leading-none mb-1.5">{stat.val}</div>
                  <div className="text-white/70 text-[0.6875rem] font-open-sans">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BANNER */}
      <div className="bg-[#1A1A1A] py-4 border-b border-white/5">
        <div className="rt-container">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-white/85 font-open-sans text-[0.8125rem]">
            <span className="flex items-center gap-2"><span className="text-brand-gold">✅</span> A-Grade Quality Guarantee</span>
            <span className="flex items-center gap-2"><span className="text-brand-gold">⚡</span> 12+ Years Experience</span>
            <span className="flex items-center gap-2"><span className="text-brand-gold">🚢</span> Fast 7-Day Loading</span>
            <span className="flex items-center gap-2"><span className="text-brand-gold">🔄</span> 80%+ Reorder Rate</span>
            <span className="flex items-center gap-2"><span className="text-brand-gold">🌍</span> 100+ Countries</span>
          </div>
        </div>
      </div>

      {/* 3. PRODUCT CATEGORIES */}
      <section id="products" className="py-20 bg-white">
        <div className="rt-container text-center">
          <div className="mb-8">
            <span className="rt-section-badge">WHOLESALE PRODUCTS</span>
            <h2 className="rt-section-title">SECOND HAND PRODUCT CATEGORIES</h2>
            <div className="rt-section-divider center" />
            <p className="text-[#666] max-w-[600px] mx-auto mt-0 mb-6 font-open-sans">
              Over 200 categories with A-Grade sorting. No stains, no tears, no fading — only fashionable, bright, and clean items.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {["❌ NO Stains or Dirt", "❌ NO Tears or Holes", "❌ NO Fading or Overuse", "✅ Fashionable & Clean"].map(txt => (
              <span key={txt} className="flex items-center gap-1.5 bg-[#f9f9f9] border border-gray-200 px-3.5 py-1.5 rounded-full text-[0.8125rem] text-[#555] font-open-sans">
                {txt}
              </span>
            ))}
          </div>

          {/* Product Cards — image-overlay style matching original */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
            {productsData.map((product) => (
              <Link
                key={product.id}
                href={product.href}
                className="group block relative overflow-hidden rounded-[6px] text-no-underline bg-[#1A1A1A]"
                style={{ textDecoration: "none" }}
              >
                <Image
                  src={product.image}
                  alt={product.title}
                  width={400}
                  height={260}
                  className="w-full object-cover block transition-transform duration-[400ms] group-hover:scale-105"
                  style={{ height: "260px" }}
                />
                {/* WHOLESALE badge */}
                <div className="absolute top-3 left-3 bg-[#C0392B] text-white font-montserrat text-[0.65rem] font-extrabold px-[0.6rem] py-[0.25rem] rounded-[2px] tracking-[0.08em]">
                  WHOLESALE
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-montserrat font-bold text-[0.875rem] border-2 border-white px-4 py-[0.4rem] rounded-[2px]">
                    View Details →
                  </span>
                </div>
                {/* Title at bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent text-white font-montserrat font-extrabold text-[0.9rem] pt-6 pb-3 px-4">
                  {product.title}
                </div>
              </Link>
            ))}
          </div>

          <a href="#contact" className="rt-btn-primary">
            GET WHOLESALE PRICE LIST →
          </a>
        </div>
      </section>

      {/* 4. ABOUT SECTION */}
      <section id="about" className="py-20 bg-[#F5F5F0]">
        <div className="rt-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="relative">
               <div className="relative h-[420px] rounded-[4px] overflow-hidden shadow-2xl">
                <Image src="/img/about-img.jpg" alt="RealismThrift Export Co., Ltd Factory" fill className="object-cover" />
               </div>
               <div className="absolute bottom-4 left-4 bg-brand-red text-white font-montserrat font-bold text-[0.875rem] px-4 py-2 rounded-[2px] shadow-lg">
                  15,000m² Modern Facility
               </div>
               <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-dark rounded-[4px] -z-10" />
               <div className="absolute -top-4 -left-4 w-16 h-16 bg-brand-red/20 rounded-[4px] -z-10" />
            </div>

            <div className="space-y-5">
              <div>
                <span className="rt-section-badge">ABOUT US</span>
                <h2 className="rt-section-title !mt-2 uppercase">WHY CHOOSE US</h2>
                <div className="rt-section-divider !w-20" />
              </div>
              
              <p className="text-[#888] font-open-sans text-[1rem] font-semibold italic">
                Your Most Reliable Partner in Used Clothing Export
              </p>

              <div className="space-y-4 text-[#555] font-open-sans leading-[1.7] text-[1rem]">
                <p>RealismThrift Export Co., Ltd is a world leader in recycling used fashion. We help businesses in Africa, Southeast Asia, the Middle East, and the Americas get the best second-hand clothes, shoes, and bags at wholesale prices.</p>
                <p>We operate from a 15,000-square-meter facility with 300+ dedicated staff members. Our strict quality control ensures long-term partnerships with clients in more than 100 countries.</p>
              </div>

              {/* 4-stat grid matching original */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                {[
                  { label: "Reorder Rate", val: "80%" },
                  { label: "Countries Served", val: "100+" },
                  { label: "Years Experience", val: "12+" },
                  { label: "Staff Members", val: "300+" },
                ].map(stat => (
                  <div key={stat.label} className="bg-white p-4 rounded-[4px] border border-gray-200 text-center">
                    <div className="text-[2rem] font-black text-brand-gold font-montserrat tracking-tight leading-none">{stat.val}</div>
                    <div className="text-[0.8125rem] text-gray-400 font-open-sans mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              <a href="#contact" className="rt-btn-primary inline-block">
                KNOW MORE →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US (FEATURES GRID) */}
      <section id="why-choose-us" className="py-20 bg-white">
        <div className="rt-container">
          <div className="text-center mb-12">
            <span className="rt-section-badge">OUR ADVANTAGES</span>
            <h2 className="rt-section-title">WHY CHOOSE REALISMTHRIFT EXPORT CO., LTD</h2>
            <div className="rt-section-divider center" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-[4px] p-6 border border-[#eeeeee] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:border-brand-red/30 hover:-translate-y-0.5 transition-all rt-fade-in group">
                <div className="w-12 h-12 bg-brand-red/10 rounded-[4px] flex items-center justify-center text-[1.25rem] text-brand-gold mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-montserrat font-bold text-[1rem] text-brand-dark mb-2">{feature.title}</h3>
                <p className="text-[0.875rem] text-[#666] leading-[1.6] font-open-sans">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. GLOBAL PARTNERS — 6 cards matching original */}
      <section id="partners" className="py-20 bg-brand-dark text-white">
        <div className="rt-container">
          <div className="text-center mb-10">
            <span className="rt-section-badge !border-white/20 !text-white/60">GLOBAL REACH</span>
            <h2 className="rt-section-title !text-white uppercase">OUR GLOBAL PARTNERS</h2>
            <div className="rt-section-divider center" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { r: "🌍", n: "Africa", c: "Nigeria, Ghana, Tanzania, Kenya, Uganda, Mozambique +5 more" },
              { r: "🌏", n: "Southeast Asia", c: "Philippines, Indonesia, Vietnam, Cambodia, Myanmar +4 more" },
              { r: "🌍", n: "Middle East", c: "UAE, Saudi Arabia, Jordan, Yemen, Iraq +4 more" },
              { r: "🌎", n: "Americas", c: "Brazil, Chile, Colombia, Ecuador, Peru +4 more" },
              { r: "🌍", n: "Europe", c: "Poland, Ukraine, Romania, Bulgaria +3 more" },
              { r: "🌏", n: "Oceania", c: "Papua New Guinea, Fiji, Solomon Islands +1 more" },
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
              🌐 100+ Countries Served Worldwide
            </span>
          </div>
        </div>
      </section>

      {/* 7. HOW TO ORDER */}
      <section id="how-to-order" className="py-20 bg-[#F5F5F0]">
        <div className="rt-container">
          <div className="text-center mb-12">
            <span className="rt-section-badge">SIMPLE PROCESS</span>
            <h2 className="rt-section-title">HOW TO ORDER</h2>
            <div className="rt-section-divider center" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {orderSteps.map((step, idx) => (
              <div key={idx} className="relative bg-white p-8 border border-[#eeeeee] rounded-[4px] border-b-[4px] border-b-transparent hover:border-b-brand-gold transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 group">
                <div className="text-[4rem] font-black text-gray-50 font-montserrat absolute -top-4 right-2 selection:bg-transparent pointer-events-none group-hover:text-brand-gold/10 transition-colors">
                  {step.num}
                </div>
                <div className="text-[2rem] mb-4 relative z-10 grayscale group-hover:grayscale-0 transition-all">{step.icon}</div>
                <h3 className="font-montserrat font-bold text-[1.125rem] text-brand-dark mb-3 relative z-10">{step.title}</h3>
                <p className="text-[0.875rem] text-[#666] leading-[1.6] font-open-sans relative z-10">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section id="faq" className="py-20 bg-white">
        <div className="rt-container max-w-[800px]">
          <div className="text-center mb-12">
            <span className="rt-section-badge">FAQ</span>
            <h2 className="rt-section-title">FREQUENTLY ASKED QUESTIONS</h2>
            <div className="rt-section-divider center" />
          </div>
          <div className="space-y-4">
            {[
              { q: "What is your monthly supply capacity?", a: "Our monthly supply capacity is 1,000+ containers (20ft and 40ft). We can handle large orders efficiently with our 15,000m² facility and 300+ staff." },
              { q: "What products do you offer?", a: "We offer 200+ categories including used summer/winter/women's/men's/brand clothes, used brand/mixed/washed shoes, and used bags (handbags, backpacks, shoulder bags)." },
              { q: "What is the minimum order quantity (MOQ)?", a: "Minimum order is 100 bales (approx. 4,500 kg) for clothes, or 2,000 pairs for shoes. We also accept mixed orders." },
              { q: "What are your payment methods?", a: "We accept T/T (Bank Transfer), L/C (Letter of Credit), and Western Union. Standard terms: 30% deposit, 70% before shipment." },
              { q: "How do you ensure quality?", a: "We use A-Grade sorting standards. Trained quality inspectors conduct random inspections on every batch. No stains, no tears, no holes, no fading." },
              { q: "Can I get a sample before placing a bulk order?", a: "Yes, we offer sample orders so you can verify quality before committing to a full container. Contact us for sample pricing." }
            ].map((faq, idx) => (
              <details key={idx} className="group bg-[#F5F5F0] border border-[#eeeeee] rounded-[4px] overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex justify-between items-center font-montserrat font-bold text-[1rem] text-brand-dark p-5 cursor-pointer select-none group-open:bg-brand-red group-open:text-white transition-colors">
                  {faq.q}
                  <span className="text-[1.25rem] transition-transform group-open:rotate-180">▾</span>
                </summary>
                <div className="p-5 text-[0.875rem] text-[#555] font-open-sans leading-[1.6] bg-white border-t border-[#eeeeee]">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CONTACT SECTION — matching original 2-col layout */}
      <section id="contact" className="py-20 bg-brand-dark text-white relative">
        <div className="rt-container relative z-10">
          <div className="text-center mb-12">
            <span className="rt-section-badge !border-white/20 !text-white/60">CONTACT US</span>
            <h2 className="rt-section-title !text-white">GET IN TOUCH</h2>
            <div className="rt-section-divider center" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Contact Info */}
            <div className="space-y-6">
              <h3 className="font-montserrat font-bold text-[1.25rem] text-white">
                Consult your used clothing export specialist
              </h3>

              {[
                { icon: "✉", label: "EMAIL", val: "sales@realismthrift.com", link: "mailto:sales@realismthrift.com" },
                { icon: "💬", label: "WHATSAPP", val: "+8618800000001", link: "https://wa.me/8618800000001" },
                { icon: "📞", label: "PHONE", val: "+86 188 0000 0001", link: "tel:+86 188 0000 0001" },
                { icon: "📍", label: "ADDRESS", val: "Guangzhou, Guangdong Province, China", link: null },
              ].map(item => (
                <div key={item.label} className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-brand-red rounded-[2px] flex items-center justify-center shrink-0 text-white text-[1.25rem] shadow-lg">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[0.6875rem] font-black text-brand-gold tracking-[0.2em] mb-1">{item.label}</div>
                    {item.link ? (
                      <a href={item.link} className="text-[1rem] font-bold hover:text-brand-gold font-montserrat transition-colors">
                        {item.val}
                      </a>
                    ) : (
                      <span className="text-[1rem] font-bold font-montserrat">{item.val}</span>
                    )}
                  </div>
                </div>
              ))}

              {/* Online Now block */}
              <div className="mt-6 p-4 bg-brand-red/15 rounded-[4px] border-l-[3px] border-brand-red">
                <p className="text-[0.8125rem] text-white/80 font-open-sans leading-[1.6]">
                  🟢 <strong className="text-brand-gold">Online Now</strong><br />
                  Our sales team replies within <strong className="text-brand-gold">12 hours</strong>.
                </p>
              </div>
            </div>

            {/* Right: Inquiry Form */}
            <div className="bg-white p-10 rounded-[4px] shadow-2xl relative">
              <div className="absolute top-0 right-0 w-10 h-10 bg-brand-gold rounded-bl-[30px]" />
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* 10. SEO CONTENT BLOCK — matching original */}
      <section className="py-16 bg-white">
        <div className="rt-container">
          <div className="max-w-[900px] mx-auto">
            <h2 className="font-montserrat font-extrabold text-[1.5rem] text-[#1A1A1A] mb-4">
              About RealismThrift Export Co., Ltd
            </h2>
            <p className="text-[#555] leading-[1.8] font-open-sans mb-4">
              RealismThrift Export Co., Ltd is a leading <strong>second hand clothes wholesale supplier</strong> based in Guangzhou, China. We specialize in exporting high-quality used clothes, used shoes, and used bags to wholesalers and importers worldwide. With over 12 years of experience in the <strong>used clothing export</strong> industry, we have built strong relationships with buyers in more than 100 countries across Africa, Southeast Asia, the Middle East, and the Americas.
            </p>
            <p className="text-[#555] leading-[1.8] font-open-sans">
              Contact us today to get our latest wholesale price list and start your profitable second-hand clothing business. Email:{" "}
              <a href="mailto:sales@realismthrift.com" className="text-[#C0392B]">sales@realismthrift.com</a>
            </p>
          </div>
        </div>
      </section>

      {/* 11. LATEST NEWS */}
      <section id="news" className="py-20 bg-[#F5F5F0]">
        <div className="rt-container">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <span className="rt-section-badge">BLOG &amp; RESOURCES</span>
              <h2 className="rt-section-title !mb-2">LATEST NEWS &amp; INSIGHTS</h2>
              <div className="rt-section-divider" />
              <p className="text-[#666] font-open-sans text-[0.9375rem] max-w-[520px] mt-3">
                Industry news, wholesale tips, and market insights for second-hand clothing importers worldwide.
              </p>
            </div>
            <Link href="/blog" className="border-2 border-brand-dark text-brand-dark px-6 py-2.5 rounded-[3px] font-montserrat font-bold text-[0.8125rem] uppercase tracking-[0.04em] hover:bg-brand-dark hover:text-white transition-all whitespace-nowrap">
              VIEW ALL (26) ARTICLES →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {blogPosts.map((post, idx) => (
              <article key={idx} className="bg-white rounded-[4px] overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.13)] hover:-translate-y-1 transition-all flex flex-col group">
                <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                  <div className="h-[210px] bg-gradient-to-br from-brand-dark to-brand-red flex items-center justify-center">
                    <span className="text-[2.5rem] opacity-60 group-hover:scale-110 transition-transform">📰</span>
                  </div>
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Link href="/category/uncategorized" className="bg-brand-red text-white text-[0.65rem] font-montserrat font-bold px-2 py-0.5 rounded-[2px] uppercase tracking-[0.05em]">
                      {post.category}
                    </Link>
                    <span className="text-[0.75rem] text-[#aaa] font-open-sans">{post.date}</span>
                  </div>
                  <h3 className="font-montserrat text-[1rem] font-black text-brand-dark mb-2.5 leading-[1.45]">
                    <Link href={`/blog/${post.slug}`} className="hover:text-brand-red transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-[0.8125rem] text-[#666] leading-[1.75] font-open-sans flex-1 mb-5">
                    {post.excerpt}
                  </p>
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5 text-brand-red font-montserrat font-bold text-[0.8rem] tracking-[0.04em] uppercase border-b-[1.5px] border-transparent hover:border-brand-red transition-colors w-fit pb-0.5">
                    READ MORE <span className="text-[0.9rem]">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12 pt-10 border-t border-[#e5e5e5]">
            <p className="font-open-sans text-[0.875rem] text-[#888] mb-5">Want to read more articles about the second-hand wholesale industry?</p>
            <Link href="/blog" className="inline-block bg-brand-dark text-white px-10 py-3.5 rounded-[3px] font-montserrat font-black text-[0.9375rem] tracking-[0.05em] uppercase hover:bg-brand-red hover:-translate-y-px transition-all shadow-sm">
              📰 VIEW ALL ARTICLES (26) →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
