import Image from "next/image";
import { InquiryForm } from "@/components/InquiryForm";

export const metadata = {
  title: "Contact Us | RealismThrift Wholesale",
  description: "Get in touch with RealismThrift for wholesale inquiries, price quotes, and export information.",
};

export default function ContactUsPage() {
  return (
    <main className="bg-white">
      {/* PAGE HERO */}
      <section className="rt-page-hero" style={{ background: "linear-gradient(135deg, #1A1A1A 0%, #2a1515 60%, #C0392B 100%)" }}>
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/reconstructed/1578575437130-527eed3abbec.jpg" 
            alt="Contact background" 
            fill 
            className="object-cover opacity-[0.08]" 
            priority 
          />
        </div>
        <div className="rt-container relative z-10 text-center pb-10 w-full pt-16">
          <h1 className="rt-page-hero-title mb-4">
            Contact <span className="text-brand-gold">Us</span>
          </h1>
          <p className="rt-page-hero-sub max-w-[600px] mx-auto mb-7">
            Have questions about our used clothing wholesale process? Ready for a price quote? Fill out the form below or contact our sales team directly.
          </p>
        </div>
      </section>

      {/* CONTACT GRID */}
      <section className="bg-white py-16">
        <div className="rt-container max-w-[1280px]">
          <div className="rt-contact-page-grid">
            
            {/* FORM COLUMN */}
            <div className="bg-[#fcfcfc] border border-[#f0f0f0] p-8 md:p-10 rounded-[8px] shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
              <h2 className="font-montserrat text-[1.5rem] font-extrabold text-brand-dark mb-4">Send an Inquiry</h2>
              <p className="text-[0.9375rem] text-[#666] mb-8 leading-[1.6]">
                Provide your WhatsApp number and target product type. Our sales team typically replies within 12 hours with a detailed quotation.
              </p>
              
              {/* Inheriting the exact styling from the user's inquiry system, wrapping it for spacing */}
              <div className="rt-contact-form-wrapper">
                 <InquiryForm />
              </div>
            </div>

            {/* INFO COLUMN */}
            <div>
              <h2 className="font-montserrat text-[1.5rem] font-extrabold text-brand-dark mb-6">Contact Information</h2>
              
              <div className="rt-contact-info-card">
                <div className="rt-contact-info-item">
                  <div className="rt-contact-info-icon text-brand-red">📍</div>
                  <div>
                    <div className="rt-contact-info-label">Factory Address</div>
                    <div className="rt-contact-info-value mt-1 leading-[1.5]">
                      Baiyun District, Guangzhou City, <br /> Guangdong Province, China
                    </div>
                  </div>
                </div>
                
                <div className="rt-contact-info-item">
                  <div className="rt-contact-info-icon text-[#25D366]">📱</div>
                  <div>
                    <div className="rt-contact-info-label">WhatsApp / Phone</div>
                    <a href="https://wa.me/8618800000001" target="_blank" rel="noopener noreferrer" className="rt-contact-info-value mt-1 block font-semibold text-[#25D366]">
                      +86 188 0000 0001
                    </a>
                  </div>
                </div>

                <div className="rt-contact-info-item">
                  <div className="rt-contact-info-icon text-brand-gold">✉️</div>
                  <div>
                    <div className="rt-contact-info-label">Email Address</div>
                    <a href="mailto:sales@realismthrift.com" className="rt-contact-info-value mt-1 block">
                      sales@realismthrift.com
                    </a>
                  </div>
                </div>

                <div className="rt-contact-info-item">
                  <div className="rt-contact-info-icon text-brand-dark">🕒</div>
                  <div>
                    <div className="rt-contact-info-label">Business Hours</div>
                    <div className="rt-contact-info-value mt-1">
                      Monday - Saturday: 9:00 AM - 6:00 PM (GMT+8)
                    </div>
                  </div>
                </div>
              </div>

              {/* FACTORY EMBED (Using placeholder gray box to maintain fidelity of layout without loading iframe if not strictly necessary, or generic iframe) */}
              <h2 className="font-montserrat text-[1.2rem] font-extrabold text-brand-dark mt-8 mb-4">Our Location</h2>
              <div className="w-full h-[250px] bg-brand-light rounded-[4px] overflow-hidden border border-[#eee] relative flex items-center justify-center">
                 {/* Usually an iframe goes here. Represent it fully responsive */}
                 <iframe 
                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117565.17833008985!2d113.19792556519213!3d23.136269931818274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3402f8c47f711f11%3A0xc3b8dc0a45bdada1!2sGuangzhou%2C%20Guangdong%20Province%2C%20China!5e0!3m2!1sen!2sus!4v1713500000000!5m2!1sen!2sus" 
                   width="100%" 
                   height="100%" 
                   style={{border:0}} 
                   allowFullScreen={true} 
                   loading="lazy" 
                   referrerPolicy="no-referrer-when-downgrade"
                   className="absolute inset-0"
                 ></iframe>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
