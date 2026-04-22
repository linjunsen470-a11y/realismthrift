import Image from "next/image";
import { InquiryForm } from "@/components/InquiryForm";
import { companyStats } from "@/data/siteData";

export const metadata = {
  title: "Contact Us | RealismThrift Wholesale",
  description: `Get in touch with RealismThrift for wholesale inquiries, price quotes, and export information. Professional sales support in English, French, Spanish, and Arabic.`,
};

export default function ContactUsPage() {
  return (
    <main className="bg-white">
      {/* 1. PAGE HERO */}
      <section className="relative py-16 md:py-24 bg-[#1A1A1A] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/reconstructed/1578575437130-527eed3abbec.jpg" 
            alt="Contact background" 
            fill 
            className="object-cover opacity-[0.08]" 
            priority 
          />
        </div>
        <div className="rt-container relative z-10 text-center">
          <h1 className="font-montserrat text-[clamp(2.5rem,5vw,3rem)] font-extrabold text-white mb-4">
            Contact <span className="text-brand-gold">Us</span>
          </h1>
          <p className="text-white/80 text-[1.0625rem] max-w-[600px] mx-auto mb-10 font-open-sans leading-[1.7]">
            Our sales team is available during business hours to answer your questions and provide price quotations. We speak English, French, Spanish, and Arabic.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:sales@realismthrift.com" className="bg-brand-gold text-brand-dark px-10 py-3 rounded-[3px] font-montserrat font-bold text-[0.875rem] transition-all hover:bg-brand-gold-dark hover:-translate-y-0.5 shadow-lg active:scale-95">
              📧 Email Us
            </a>
            <a href="https://wa.me/8618800000001" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-10 py-3 rounded-[3px] font-montserrat font-bold text-[0.875rem] transition-all hover:bg-[#1da851] hover:-translate-y-0.5 shadow-lg active:scale-95">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* 2. CONTACT INFO CARDS - GRID OF 4 */}
      <div className="-mt-10 relative z-20 mb-12">
        <div className="rt-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { i: "📧", t: "Email", s: "Send us an email", v: "sales@realismthrift.com", l: "mailto:sales@realismthrift.com" },
              { i: "💬", t: "WhatsApp", s: "Chat with us now", v: "+8618800000001", l: "https://wa.me/8618800000001" },
              { i: "📞", t: "Phone", s: "Call our sales team", v: "+86 188 0000 0001", l: "tel:+8618800000001" },
              { i: "📍", t: "Address", s: "Visit our factory", v: "Guangzhou, China", l: "#" },
            ].map((item) => (
              <div key={item.t} className="bg-white border border-[#eee] rounded-[8px] p-7 text-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-all transform hover:-translate-y-1">
                <div className="text-[2.25rem] mb-4">{item.i}</div>
                <div className="font-montserrat text-[0.875rem] font-extrabold text-brand-dark mb-1">{item.t}</div>
                <div className="text-[0.75rem] text-[#888] mb-4">{item.s}</div>
                <a href={item.l} className="text-brand-red text-[0.85rem] font-bold font-montserrat hover:underline break-all block">
                  {item.v}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT: Form + Sidebar Section */}
      <section className="pb-20 pt-8 bg-white">
        <div className="rt-container">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
            
            {/* INQUIRY FORM COLUMN */}
            <div>
              <div className="rt-subsection-heading">
                <h2>Send Us an Inquiry</h2>
                <div className="rt-section-divider" />
              </div>
              <div className="bg-white border border-[#eee] rounded-[12px] p-8 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
                 <InquiryForm />
                 <p className="text-center text-[0.75rem] text-gray-400 font-open-sans mt-5">
                   Reply within 12 hours · Detailed price quotation · Private & Confidential
                 </p>
              </div>
            </div>

            {/* SIDEBAR */}
            <aside className="space-y-10">
              {/* FACTORY COMPANY INFO CARD */}
              <div className="bg-brand-dark rounded-[10px] p-7 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-red/10 rounded-bl-full -mr-12 -mt-12" />
                <h4 className="font-montserrat text-[0.9375rem] font-black text-brand-gold mb-6 uppercase tracking-[0.1em]">Company Profile</h4>
                <div className="space-y-5">
                  {[
                    { i: "🏢", l: "Full Name", v: "RealismThrift Export Co., Ltd." },
                    { i: "📍", l: "Location", v: "Guangzhou, Guangdong, China" },
                    { i: "✉️", l: "Official Email", v: "sales@realismthrift.com" },
                    { i: "📞", l: "Sales Hotline", v: "+86 188 0000 0001" },
                    { i: "🕒", l: "Business Hours", v: "Mon–Sat 8:00–20:00 (GMT+8)" },
                  ].map((item) => (
                    <div key={item.l} className="flex gap-4 text-[0.8125rem] border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <span className="shrink-0 text-lg opacity-80">{item.i}</span>
                      <div>
                        <div className="text-white/40 text-[0.65rem] font-bold uppercase tracking-widest mb-1">{item.l}</div>
                        <div className="font-semibold text-white/95 leading-relaxed">{item.v}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 4. GLOBAL EXPORT MARKETS SECTION */}
      <section className="bg-brand-light py-20">
        <div className="rt-container">
          <div className="text-center mb-14">
            <span className="rt-section-badge" style={{display:'inline-block'}}>Global Reach</span>
            <h2 className="font-montserrat text-[1.75rem] font-black text-brand-dark mb-3">WE EXPORT TO {companyStats.countriesCount} COUNTRIES</h2>
            <div className="rt-section-divider center mb-6" />
            <p className="text-[#666] text-[0.9375rem] max-w-[640px] mx-auto font-open-sans italic">
              Our products reach buyers across 6 continents. Find your regional sales expertise below for localized wholesale solutions.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { r: "🌍 Africa", c: "Nigeria, Ghana, Kenya, Tanzania, Ethiopia, Senegal, Ivory Coast, Cameroon, Uganda, Mozambique" },
              { r: "🌏 Southeast Asia", c: "Vietnam, Thailand, Philippines, Indonesia, Malaysia, Cambodia, Myanmar, Laos" },
              { r: "🌍 Middle East", c: "UAE, Saudi Arabia, Jordan, Lebanon, Egypt, Morocco, Tunisia, Algeria" },
              { r: "🌎 Americas", c: "USA, Canada, Mexico, Brazil, Colombia, Peru, Chile, Ecuador" },
              { r: "🌍 Europe", c: "UK, France, Germany, Poland, Romania, Ukraine, Bulgaria, Hungary" },
              { r: "🌏 Oceania", c: "Australia, New Zealand, Kazakhstan, Uzbekistan, Pakistan, Bangladesh" },
            ].map((market) => (
              <div key={market.r} className="bg-white p-7 rounded-[8px] shadow-sm hover:shadow-md transition-shadow border border-white hover:border-brand-red/10 group">
                <div className="font-montserrat text-[1rem] font-black text-brand-dark mb-4 border-b border-brand-light pb-3 group-hover:text-brand-red transition-colors">
                  {market.r}
                </div>
                <p className="text-[0.8rem] text-[#666] leading-relaxed font-open-sans">
                  {market.c}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MAP SECTION */}
      <section className="py-20 bg-white">
        <div className="rt-container">
          <div className="max-w-[1000px] mx-auto">
            <div className="rt-subsection-heading">
              <h2>Our Factory Location</h2>
              <div className="rt-section-divider" />
            </div>
            <div className="w-full h-[450px] rounded-[16px] overflow-hidden border border-[#eee] shadow-2xl relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117565.17833008985!2d113.19792556519213!3d23.136269931818274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3402f8c47f711f11%3A0xc3b8dc0a45bdada1!2sGuangzhou%2C%20Guangdong%20Province%2C%20China!5e0!3m2!1sen!2sus!4v1713500000000!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  title="Google Maps location of RealismThrift in Guangzhou, China"
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 border-0"
                ></iframe>
            </div>
            <div className="mt-8 p-6 bg-brand-light rounded-[10px] border-l-4 border-brand-gold">
              <p className="text-[0.875rem] text-[#555] font-open-sans leading-relaxed">
                <strong className="text-brand-dark">Visiting our factory?</strong> We welcome international buyers to visit our {companyStats.facilitySize} facility. Please contact your regional sales agent to schedule a tour and arrange airport pickup in Guangzhou.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
