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
  CheckCircle2, 
  ArrowRight, 
  Search, 
  Calendar, 
  User, 
  MapPin, 
  MessageCircle, 
  Mail,
  ChevronRight,
  Phone
} from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#1A1A1A]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/img/hero-bg.png" 
            alt="RealismThrift Factory" 
            fill 
            className="object-cover opacity-60 brightness-75" 
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/40 to-transparent" />
          {/* Accent Line */}
          <div className="absolute top-0 left-0 w-full h-[6px] bg-[#C0392B]" />
        </div>

        <div className="rt-container relative z-10 py-20">
          <div className="max-w-3xl space-y-8 rt-fade-in">
            <div className="inline-block bg-[#C0392B] text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-sm italic">
              #1 Second Hand Clothes Supplier in China
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black text-white leading-tight font-montserrat uppercase">
              Direct Second Hand Brand Clothes, Shoes & Bags Factory
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 font-open-sans font-light">
              Wholesale to 100+ Countries | A-Grade Quality | Fast Delivery
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-bold text-white font-montserrat uppercase tracking-wider">
              <span className="flex items-center gap-2"><span className="text-[#C0392B]">❌</span> No Stains</span>
              <span className="flex items-center gap-2"><span className="text-[#C0392B]">❌</span> No Tears</span>
              <span className="flex items-center gap-2"><span className="text-[#C0392B]">❌</span> No Fading</span>
              <span className="flex items-center gap-2"><span className="text-[#F0B429]">✅</span> A-Grade Quality</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Link 
                href="#contact" 
                className="bg-[#C0392B] text-white px-8 py-5 rounded-sm font-montserrat font-black text-sm tracking-wider hover:bg-[#A93226] transition-all text-center shadow-lg"
              >
                GET LATEST WHOLESALE PRICE LIST
              </Link>
              <Link 
                href="#products" 
                className="border-2 border-white text-white px-8 py-5 rounded-sm font-montserrat font-black text-sm tracking-wider hover:bg-white hover:text-[#1A1A1A] transition-all text-center"
              >
                View Products →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-white/20">
              {[
                { val: "15,000m²", label: "Modern Factory" },
                { val: "100+", label: "Countries Served" },
                { val: "80%", label: "Reorder Rate" },
                { val: "A-Grade", label: "Quality Standard" },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <div className="text-[#F0B429] text-2xl font-black font-montserrat">{stat.val}</div>
                  <div className="text-white/60 text-[10px] uppercase font-bold tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BANNER */}
      <div className="bg-[#F0B429] py-6 shadow-md relative z-20">
        <div className="rt-container">
          <div className="flex flex-wrap justify-between gap-6 text-[#1A1A1A] font-montserrat font-black text-[11px] tracking-widest uppercase">
            <span className="flex items-center gap-2"><span>✅</span> A-Grade Quality Guarantee</span>
            <span className="flex items-center gap-2"><span>⚡</span> 12+ Years Experience</span>
            <span className="flex items-center gap-2"><span>🚢</span> Fast 7-Day Loading</span>
            <span className="flex items-center gap-2"><span>🔄</span> 80%+ Reorder Rate</span>
            <span className="flex items-center gap-2"><span>🌍</span> 100+ Countries</span>
          </div>
        </div>
      </div>

      {/* 3. PRODUCT CATEGORIES */}
      <section id="products" className="py-24 bg-white">
        <div className="rt-container">
          <div className="text-center space-y-4 mb-20">
            <span className="text-[#C0392B] text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-[#C0392B] pb-1">WHOLESALE PRODUCTS</span>
            <h2 className="text-3xl md:text-5xl font-black text-[#1A1A1A] font-montserrat uppercase">SECOND HAND PRODUCT CATEGORIES</h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-open-sans">
              Over 200 categories with A-Grade sorting. No stains, no tears, no fading — only fashionable, bright, and clean items.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-6 text-[10px] font-black font-montserrat uppercase tracking-wider">
              <span className="bg-gray-100 px-4 py-2 rounded-full text-gray-500">❌ NO Stains or Dirt</span>
              <span className="bg-gray-100 px-4 py-2 rounded-full text-gray-500">❌ NO Tears or Holes</span>
              <span className="bg-gray-100 px-4 py-2 rounded-full text-gray-500">❌ NO Fading or Overuse</span>
              <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full">✅ Fashionable & Clean</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productsData.map((product) => (
              <Link 
                key={product.id} 
                href={product.href} 
                className="group relative h-[320px] overflow-hidden rounded-md bg-[#1A1A1A]"
              >
                <Image 
                  src={product.image} 
                  alt={product.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-70" 
                />
                <div className="absolute top-4 left-4 bg-[#C0392B] text-white text-[9px] font-black uppercase px-2 py-1 tracking-widest rounded-sm">
                  {product.category}
                </div>
                {/* Overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white border-2 border-white px-4 py-2 font-montserrat font-bold text-xs uppercase tracking-widest backdrop-blur-sm">
                    View Details →
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/40 to-transparent">
                  <h3 className="text-white font-montserrat font-black text-lg uppercase tracking-tight">{product.title}</h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link 
              href="#contact" 
              className="inline-flex items-center gap-2 bg-[#C0392B] text-white px-10 py-5 rounded-sm font-montserrat font-black text-sm tracking-wider hover:bg-[#A93226] transition-all"
            >
              GET WHOLESALE PRICE LIST →
            </Link>
          </div>
        </div>
      </section>

      {/* 4. ABOUT SECTION (WHY CHOOSE US) */}
      <section id="about" className="py-24 bg-[#F5F5F0]">
        <div className="rt-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative group">
               <div className="relative h-[550px] rounded-sm overflow-hidden shadow-2xl">
                <Image 
                  src="/img/about-img.jpg" 
                  alt="Warehouse" 
                  fill 
                  className="object-cover"
                />
               </div>
               <div className="absolute -bottom-6 -right-6 bg-[#C0392B] text-white p-8 rounded-sm shadow-xl hidden md:block">
                  <div className="text-3xl font-black font-montserrat">15,000m²</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Modern Facility</div>
               </div>
               {/* Deco elements */}
               <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-[#F0B429] -z-10" />
            </div>

            <div className="space-y-8">
              <span className="text-[#C0392B] text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-[#C0392B] pb-1">ABOUT US</span>
              <h2 className="text-4xl font-black text-[#1A1A1A] font-montserrat uppercase">WHY CHOOSE US</h2>
              <p className="text-xl font-bold text-gray-700 italic border-l-4 border-[#F0B429] pl-6 font-open-sans">
                Your Most Reliable Partner in Used Clothing Export
              </p>
              <div className="space-y-4 text-gray-600 font-open-sans leading-relaxed">
                <p>
                  RealismThrift Export Co., Ltd is a world leader in recycling used fashion. We help businesses in Africa, Southeast Asia, the Middle East, and the Americas get the best second-hand clothes, shoes, and bags at wholesale prices.
                </p>
                <p>
                  We operate from a 15,000-square-meter facility with 300+ dedicated staff members. Our strict quality control ensures long-term partnerships with clients in more than 100 countries.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4">
                {[
                  { label: "Reorder Rate", val: "80%" },
                  { label: "Countries Served", val: "100+" },
                  { label: "Years Experience", val: "12+" },
                  { label: "Staff Members", val: "300+" },
                ].map(stat => (
                  <div key={stat.label} className="bg-white p-6 rounded-sm border border-gray-100 text-center shadow-sm">
                    <div className="text-2xl font-black text-[#C0392B] font-montserrat">{stat.val}</div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>

              <Link 
                href="#contact" 
                className="inline-block bg-[#C0392B] text-white px-10 py-5 rounded-sm font-montserrat font-black text-sm tracking-wider hover:bg-[#A93226] transition-all"
              >
                KNOW MORE →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROCESS SECTION */}
      <section id="how-to-order" className="py-24 bg-white">
        <div className="rt-container">
          <div className="text-center mb-20">
             <span className="text-[#C0392B] text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-[#C0392B] pb-1">SIMPLE PROCESS</span>
             <h2 className="text-3xl md:text-5xl font-black text-[#1A1A1A] font-montserrat uppercase mt-4">HOW TO ORDER</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {orderSteps.map((step, idx) => (
              <div key={step.num} className="relative group p-8 bg-gray-50 rounded-sm border-b-4 border-transparent hover:border-[#F0B429] transition-all shadow-sm">
                <div className="text-6xl font-black text-gray-200 font-montserrat mb-4 group-hover:text-[#F0B429]/20 transition-colors">
                  {step.num}
                </div>
                <div className="text-4xl mb-6">{step.icon}</div>
                <h3 className="text-xl font-black font-montserrat mb-4 uppercase">{step.title}</h3>
                <p className="text-sm text-gray-500 font-open-sans leading-relaxed">
                  {step.description}
                </p>
                {idx < orderSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-[20%] -right-4 translate-x-1/2 z-10 text-gray-200">
                    <ChevronRight size={40} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CONTACT SECTION */}
      <section id="contact" className="py-24 bg-[#1A1A1A] text-white relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#C0392B]/5 skew-x-[-15deg] translate-x-1/2" />
        
        <div className="rt-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Contact Info */}
            <div className="space-y-12">
              <div className="space-y-4">
                <span className="text-[#F0B429] text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-[#F0B429] pb-1">GET IN TOUCH</span>
                <h2 className="text-3xl md:text-5xl font-black font-montserrat uppercase">GET WHOLESALE PRICE NOW</h2>
                <p className="text-gray-400 font-open-sans max-w-md">
                  Consult your used clothing export specialist. We reply within 12 hours with a full catalog.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { icon: Mail, label: "EMAIL", val: "sales@realismthrift.com", link: "mailto:sales@realismthrift.com" },
                  { icon: MessageCircle, label: "WHATSAPP", val: "+86 188 0000 0001", link: "https://wa.me/8618800000001" },
                  { icon: Phone, label: "PHONE", val: "+86 188 0000 0001", link: "tel:+86 188 0000 0001" },
                  { icon: MapPin, label: "ADDRESS", val: "Guangzhou, China", link: "#" },
                ].map(item => (
                  <div key={item.label} className="flex gap-4">
                    <div className="w-10 h-10 bg-[#C0392B] rounded-sm flex items-center justify-center shrink-0">
                      <item.icon size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-[#F0B429] tracking-widest mb-1">{item.label}</div>
                      <a href={item.link} className="text-sm font-bold hover:text-[#F0B429] transition-colors">{item.val}</a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-[#C0392B]/10 border-l-4 border-[#F0B429] rounded-r-lg max-w-sm">
                <div className="flex items-start gap-4">
                  <div className="text-green-500 animate-pulse">●</div>
                  <div>
                    <h4 className="text-[#F0B429] font-bold text-sm font-montserrat mb-1 uppercase tracking-tight">Online Now</h4>
                    <p className="text-xs text-gray-400">Our export team is currently active and ready to assist.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white p-10 rounded-sm shadow-2xl relative">
              <div className="absolute top-0 right-0 w-8 h-8 bg-[#F0B429] rounded-bl-3xl" />
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* 7. RECENT NEWS */}
      <section className="py-24 bg-[#F5F5F0]">
        <div className="rt-container">
           <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
              <div className="space-y-4">
                <span className="text-[#C0392B] text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-[#C0392B] pb-1">BLOG & RESOURCES</span>
                <h2 className="text-3xl md:text-4xl font-black text-[#1A1A1A] font-montserrat uppercase">LATEST NEWS & INSIGHTS</h2>
                <p className="text-gray-500 font-open-sans">Industry news, wholesale tips, and market insights.</p>
              </div>
              <Link 
                href="/blog" 
                className="border-2 border-[#1A1A1A] text-[#1A1A1A] px-8 py-3 rounded-sm font-montserrat font-bold text-xs uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all"
              >
                VIEW ALL ARTICLES →
              </Link>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map(post => (
              <article key={post.slug} className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                <div className="relative h-56 bg-[#1A1A1A]/90 flex items-center justify-center">
                  <div className="text-6xl opacity-20 group-hover:scale-110 transition-transform">📰</div>
                   <div className="absolute top-4 left-4">
                    <span className="bg-[#C0392B] text-white text-[9px] font-bold px-3 py-1 rounded-sm uppercase tracking-widest">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{post.date}</div>
                  <h3 className="text-lg font-black font-montserrat uppercase leading-tight group-hover:text-[#C0392B] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-3 font-open-sans">
                    {post.excerpt}
                  </p>
                  <Link 
                    href={`/blog/${post.slug}`} 
                    className="inline-flex items-center gap-2 text-[#C0392B] font-montserrat font-black text-xs uppercase tracking-widest pt-2 border-b-2 border-transparent hover:border-[#C0392B] transition-all"
                  >
                    READ MORE →
                  </Link>
                </div>
              </article>
            ))}
           </div>
        </div>
      </section>
    </div>
  );
}
