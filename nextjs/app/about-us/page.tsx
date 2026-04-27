import "../internal-pages.css";
import Image from "next/image";
import Link from "next/link";
import { InquiryForm } from "@/components/InquiryForm";
import { companyStats } from "@/data/siteData";
import { Building2, Search, CheckCircle2, Brush, Box, Ship, Globe2 } from "lucide-react";

export const metadata = {
  title: "About Us | Leading Used Clothes & Shoes Exporter in China",
  description: "RealismThrift Export Co., Ltd is a professional wholesale supplier of second-hand clothes, shoes, and bags based in Huizhou, China. 15,000m² facility, ISO certified, and GRS compliant.",
  openGraph: {
    title: "About RealismThrift | Professional Wholesale Exporter",
    description: "Learn about China's top wholesale supplier of premium second-hand goods. High-quality A-Grade sorting and global export experience.",
    images: ['/images/about/hero-bg.webp'],
  },
  alternates: {
    canonical: "/about-us",
  },
};

export default function AboutUsPage() {
  return (
    <main className="bg-white">
      <section className="rt-page-hero">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-main.webp"
            alt="RealismThrift Professional Team and 15,000m² Facility in Huizhou China - Leading Wholesale Exporter of Used Brand Fashion"
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
              <span className="text-white/70">About Us</span>
            </nav>
            <div className="inline-block bg-brand-red text-white font-montserrat font-bold text-[0.65rem] tracking-[0.12em] px-[0.875rem] py-[0.3rem] rounded-[2px] mb-[1rem] uppercase">
              China Supplier · ISO Certified · {companyStats.foundedYear}
            </div>
            <h1 className="rt-page-hero-title mb-5 text-[clamp(2rem,5.5vw,3rem)] leading-[1.1]">
              About <span className="text-brand-gold">RealismThrift</span>
            </h1>
            <p className="rt-page-hero-sub max-w-[700px] mb-9 leading-[1.8] text-[1.0625rem]">
              A premier wholesale exporter of used brand clothes, shoes, and bags. Over 10 years of experience. {companyStats.facilitySize} sorting facility. Trusted by {companyStats.buyersCount} wholesale buyers in {companyStats.countriesCount} countries.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Link href="/contact-us" className="bg-brand-gold text-brand-dark px-6 md:px-10 py-3 md:py-4 rounded-[3px] font-bold font-montserrat text-[0.9rem] hover:bg-brand-gold-dark transition-all shadow-[0_10px_20px_rgba(240,180,41,0.2)] whitespace-nowrap">
                Contact Our Team
              </Link>
              <a href="https://wa.me/8613367481710" target="_blank" rel="noopener noreferrer" className="bg-white/10 border border-white/30 text-white px-6 md:px-10 py-3 md:py-4 rounded-[3px] font-semibold font-montserrat text-[0.9rem] hover:bg-white/20 transition-all whitespace-nowrap">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* KEY STATS */}
      <div className="bg-brand-red py-8">
        <div className="rt-container max-w-[1280px]">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="text-white">
              <div className="font-montserrat text-[1.75rem] font-extrabold leading-none">10+</div>
              <div className="text-[0.75rem] opacity-85 mt-1.5 tracking-wider uppercase">Years Experience</div>
            </div>
            <div className="text-white">
              <div className="font-montserrat text-[1.75rem] font-extrabold leading-none">{companyStats.facilitySize}</div>
              <div className="text-[0.75rem] opacity-85 mt-1.5 tracking-wider uppercase">Sorting Facility</div>
            </div>
            <div className="text-white">
              <div className="font-montserrat text-[1.75rem] font-extrabold leading-none">{companyStats.buyersCount}</div>
              <div className="text-[0.75rem] opacity-85 mt-1.5 tracking-wider uppercase">Wholesale Buyers</div>
            </div>
            <div className="text-white">
              <div className="font-montserrat text-[1.75rem] font-extrabold leading-none">{companyStats.countriesCount}</div>
              <div className="text-[0.75rem] opacity-85 mt-1.5 tracking-wider uppercase">Export Countries</div>
            </div>
            <div className="text-white">
              <div className="font-montserrat text-[1.75rem] font-extrabold leading-none">80%</div>
              <div className="text-[0.75rem] opacity-85 mt-1.5 tracking-wider uppercase">Repeat Order Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* COMPANY STORY */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-montserrat text-[1.75rem] font-extrabold text-brand-dark mb-5 leading-[1.3]">
              Our Story: <span className="text-brand-red">From Guangzhou to the World</span>
            </h2>
            <p className="text-[0.9375rem] text-[#555] leading-[1.85] mb-5">
              RealismThrift was founded in Guangzhou, China — the world&apos;s largest hub for used clothing trade. What began as a small sorting operation in {companyStats.foundedYear} &nbsp;has grown into one of China&apos;s most trusted wholesale exporters of second-hand branded fashion.
            </p>
            <p className="text-[0.9375rem] text-[#555] leading-[1.85] mb-5">
              Our founders recognized a critical gap in the market: overseas wholesale buyers needed a reliable Chinese supplier who could consistently deliver A-grade branded merchandise with transparent quality standards and professional export documentation. RealismThrift was built to fill that gap.
            </p>
            <p className="text-[0.9375rem] text-[#555] leading-[1.85] mb-7">
              Today, our {companyStats.facilitySize} facility in Huizhou processes over {companyStats.monthlyCapacity} of used branded clothing, shoes, and bags every month. Our {companyStats.staffCount} trained staff sort, grade, clean, and pack merchandise destined for wholesale markets across Africa, Southeast Asia, the Middle East, Europe, and the Americas.
            </p>
            <div className="flex gap-6 flex-wrap">
              <div className="text-center px-6 py-4 bg-[#F5F5F0] rounded-[6px]">
                <div className="font-montserrat text-[1.5rem] font-extrabold text-brand-red">200t</div>
                <div className="text-[0.75rem] text-[#666] mt-1 uppercase font-semibold">Monthly Processing</div>
              </div>
              <div className="text-center px-6 py-4 bg-[#F5F5F0] rounded-[6px]">
                <div className="font-montserrat text-[1.5rem] font-extrabold text-brand-red">80+</div>
                <div className="text-[0.75rem] text-[#666] mt-1 uppercase font-semibold">Staff Members</div>
              </div>
              <div className="text-center px-6 py-4 bg-[#F5F5F0] rounded-[6px]">
                <div className="font-montserrat text-[1.5rem] font-extrabold text-brand-red">50+</div>
                <div className="text-[0.75rem] text-[#666] mt-1 uppercase font-semibold">Brand Types</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="relative h-[200px] w-full rounded-[6px] overflow-hidden">
              <Image src="/images/about/story-1.webp" alt="RealismThrift Modern Facility Exterior - China's Trusted Wholesale Supplier of Bulk Second Hand Clothes and Shoes" fill className="object-cover" />
            </div>
            <div className="relative h-[200px] w-full rounded-[6px] overflow-hidden">
              <Image src="/images/about/story-2.webp" alt="RealismThrift Precision Sorting Process - Expert Hand-Inspected Branded Used Clothing for A-Grade Quality Export" fill className="object-cover" />
            </div>
            <div className="relative h-[200px] w-full col-span-2 rounded-[6px] overflow-hidden">
              <Image src="/images/about/story-3-clear.webp" alt="RealismThrift Professional Baling and Packing - Compressed Bales of Second Hand Clothes Ready for Global Wholesale Shipping" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* TEAM PHOTO SECTION */}
      <section className="bg-brand-dark py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-montserrat text-[1.75rem] font-extrabold text-white mb-3.5">Meet Our Team</h2>
            <div className="rt-section-divider center mb-4" />
            <p className="text-white/65 text-[0.9375rem] max-w-[600px] mx-auto">
              Our professional team is dedicated to delivering the highest quality used branded merchandise to wholesale buyers worldwide.
            </p>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { img: "team-sorting-new.webp", title: "Sorting Team", desc: "Specialized team for category-based sorting of clothes, shoes, and bags to ensure quality." },
              { img: "qc-inspector-premium.webp", title: "Quality Control", desc: "Dedicated inspectors performing thorough checks on every item to maintain standards." },
              { img: "team-sales-new.webp", title: "Sales Team", desc: "Multilingual sales consultants providing professional export guidance and support." },
              { img: "team-logistics-new.webp", title: "Logistics Team", desc: "Logistics specialists managing export documentation and global freight coordination." }
            ].map(team => (
              <div key={team.title} className="bg-white/5 border border-white/10 rounded-[8px] overflow-hidden">
                <div className="relative h-[140px] w-full">
                  <Image src={`/images/about/${team.img}`} alt={`RealismThrift ${team.title} - Experts in Bulk Second Hand ${team.title.split(' ')[0]}`} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <div className="font-montserrat text-[0.875rem] font-bold text-brand-gold mb-2">{team.title}</div>
                  <div className="text-[0.75rem] text-white/60 leading-[1.6]">{team.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FACTORY PHOTOS */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="rt-subsection-heading">
          <h2>Our Facility</h2>
          <div className="rt-section-divider" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-rows-2 gap-3.5 md:h-[400px]">
          <div className="relative rounded-[8px] overflow-hidden lg:col-span-2 row-span-2 min-h-[200px]">
            <Image src="/images/about/factory-hall.webp" alt="RealismThrift Main Sorting Hall - 15,000m² State-of-the-Art Used Clothing Facility" fill className="object-cover" />
          </div>
          <div className="relative rounded-[8px] overflow-hidden min-h-[190px]">
            <Image src="/images/about/packing-area-premium.webp" alt="RealismThrift Industrial Packing Area - Professional Baling and Logistics for Worldwide Used Clothes Wholesale Export" fill className="object-cover" />
          </div>
          <div className="relative rounded-[8px] overflow-hidden min-h-[190px]">
            <Image src="/images/about/loading-dock-premium.webp" alt="RealismThrift Efficient Loading Dock - Fast 7-Day Container Shipment and Export Logistics of Second Hand Goods to Global Ports" fill className="object-cover" />
          </div>
          <div className="relative rounded-[8px] overflow-hidden min-h-[190px]">
            <Image src="/images/about/sorting-process.webp" alt="RealismThrift Branded Shoe Sorting Station - Strict Grade A Quality Control for Export Sneakers and Footwear" fill className="object-cover" />
          </div>
          <div className="relative rounded-[8px] overflow-hidden min-h-[190px]">
            <Image src="/images/about/bag-inspection.webp" alt="RealismThrift Designer Bag Inspection Room - Professional Quality Verification for Wholesale Used Handbags and Backpacks" fill className="object-cover" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          <div className="bg-brand-light rounded-[6px] p-5">
            <div className="font-montserrat text-[0.875rem] font-bold text-brand-dark mb-1.5">Main Sorting Hall</div>
            <div className="text-[0.75rem] text-[#666] leading-[1.6]">15,000 m² dedicated sorting space optimized for large-scale operations.</div>
          </div>
          <div className="bg-brand-light rounded-[6px] p-5">
            <div className="font-montserrat text-[0.875rem] font-bold text-brand-dark mb-1.5">Packing Area</div>
            <div className="text-[0.75rem] text-[#666] leading-[1.6]">Industrial packing area equipped for secure baling and weight control.</div>
          </div>
          <div className="bg-brand-light rounded-[6px] p-5">
            <div className="font-montserrat text-[0.875rem] font-bold text-brand-dark mb-1.5">Loading Dock</div>
            <div className="text-[0.75rem] text-[#666] leading-[1.6]">Integrated loading area designed for efficient container dispatch.</div>
          </div>
          <div className="bg-brand-light rounded-[6px] p-5">
            <div className="font-montserrat text-[0.875rem] font-bold text-brand-dark mb-1.5">Quality Control Station</div>
            <div className="text-[0.75rem] text-[#666] leading-[1.6]">Dedicated inspection station providing professional lighting for accurate grading.</div>
          </div>
        </div>
      </section>

      {/* PRODUCTION PROCESS */}
      <section className="bg-brand-light py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-montserrat text-[1.5rem] font-extrabold text-brand-dark mb-3.5">Our Production Process</h2>
            <div className="rt-section-divider center mb-4" />
            <p className="text-[#666] text-[0.9375rem] max-w-[600px] mx-auto">From raw material collection to container loading — every step is managed by our dedicated team.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-10 relative">
            <div className="hidden lg:block absolute top-[2rem] left-[8.33%] right-[8.33%] h-[2px] bg-gradient-to-r from-brand-red to-brand-gold z-0"></div>
            {[
              { icon: <Building2 className="w-6 h-6 text-white" />, bg: 'bg-brand-red', title: 'Source Collection', desc: 'First-tier cities: Beijing, Shanghai, Guangzhou' },
              { icon: <Search className="w-6 h-6 text-white" />, bg: 'bg-brand-dark', title: 'Initial Sort', desc: 'Separate by type: clothes, shoes, bags' },
              { icon: <CheckCircle2 className="w-6 h-6 text-white" />, bg: 'bg-brand-red', title: 'Quality Grade', desc: 'A/B/C grading by trained inspectors' },
              { icon: <Brush className="w-6 h-6 text-white" />, bg: 'bg-brand-dark', title: 'Prep & Quality Check', desc: 'Pre-packing preparation and final quality inspection' },
              { icon: <Box className="w-6 h-6 text-white" />, bg: 'bg-brand-red', title: 'Pack & Weigh', desc: 'Secure compression and accurate weight labeling' },
              { icon: <Ship className="w-6 h-6 text-white" />, bg: 'bg-brand-dark', title: 'Load & Export', desc: 'Container loading with full documentation' },
            ].map(step => (
              <div key={step.title} className="text-center px-2 relative z-10 w-full group">
                <div className={`w-16 h-16 ${step.bg} rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-brand-light shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                  {step.icon}
                </div>
                <div className="font-montserrat text-[0.8rem] font-bold text-brand-dark mb-1.5">{step.title}</div>
                <div className="text-[0.7rem] text-[#888] leading-[1.5] max-w-[150px] mx-auto">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS & TRUST */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="rt-subsection-heading">
              <h2>Certifications &amp; Trust Signals</h2>
              <div className="rt-section-divider" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Export License', desc: 'Official Chinese export license for used textile products.' },
                { title: '12+ Years', desc: `Established ${companyStats.foundedYear}. Over a decade of trusted wholesale operations.` },
                { title: `${companyStats.buyersCount} Buyers`, desc: `Active wholesale buyers across ${companyStats.countriesCount} countries worldwide.` },
                { title: 'Quality Inspection', desc: 'Every item passes rigorous quality inspection before packing to ensure A-Grade quality.' },
                { title: 'Secure Payment', desc: 'Standard 30% deposit and 70% balance payment terms via T/T or Western Union.' },
                { title: 'Fast Loading', desc: 'Container loading in as fast as 7 days after order confirmation.' }
              ].map(cert => (
                <div key={cert.title} className="bg-brand-light rounded-[6px] p-4 border-l-[3px] border-brand-red">
                  <div className="font-montserrat text-[0.875rem] font-bold text-brand-dark mb-1.5">{cert.title}</div>
                  <div className="text-[0.75rem] text-[#666] leading-[1.5]">{cert.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="rt-subsection-heading">
              <h2>What Our Buyers Say</h2>
              <div className="rt-section-divider" />
            </div>
            {[
              {
                name: 'Emmanuel Osei',
                country: 'Ghana',
                quote: "We've been importing summer clothes from RealismThrift for 3 years. The sorting is very clean compared to other factories we've tried. Very few 'waste' items in the bales, which really helps our profit margins."
              },
              {
                name: 'Fatima Al-Hassan',
                country: 'Nigeria',
                quote: "The used shoes and bags are always in high demand. I appreciate that they send photos of the actual container loading process. Their documentation is professional, making customs clearance in Lagos much smoother."
              },
              {
                name: 'Nguyen Van Minh',
                country: 'Vietnam',
                quote: "Consistent A-grade quality. Mostly brand name items with very little wear. It's hard to find a supplier in China who stays this reliable month after month. Good communication from the sales team."
              }
            ].map(buyer => (
              <div key={buyer.name} className="bg-white border border-[#eee] rounded-[8px] p-5 mb-4 shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
                <div className="text-[0.875rem] mb-2 text-brand-gold">★★★★★</div>
                <p className="text-[0.8125rem] text-[#555] leading-[1.7] italic mb-3">&quot;{buyer.quote}&quot;</p>
                <div className="flex justify-between items-center">
                  <div className="font-montserrat text-[0.8rem] font-bold text-brand-dark">{buyer.name}</div>
                  <div className="text-[0.75rem] text-[#888]">{buyer.country}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 text-center bg-gradient-to-br from-brand-dark to-[#2a1515]">
        <div className="max-w-[700px] mx-auto px-6">
          <h2 className="font-montserrat text-[1.75rem] font-extrabold text-white mb-4">Ready to Partner with RealismThrift?</h2>
          <p className="text-white/70 text-[0.9375rem] leading-[1.7] mb-8">Join {companyStats.buyersCount} wholesale buyers worldwide. Get a free price quotation within 12 hours.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/contact-us" className="bg-brand-gold text-brand-dark px-8 py-3.5 rounded-[3px] font-bold font-montserrat text-[0.9rem] hover:bg-brand-gold-dark transition-colors">
              Contact Us Now
            </Link>
            <a href="https://wa.me/8613367481710" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-8 py-3.5 rounded-[3px] font-bold font-montserrat text-[0.9rem] hover:bg-[#1da851] transition-colors">
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
