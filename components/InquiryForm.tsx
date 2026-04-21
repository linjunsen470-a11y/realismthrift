"use client";

import React, { useState } from "react";

interface InquiryFormProps {
  variant?: "default" | "sidebar";
  showWhatsApp?: boolean;
}

export const InquiryForm: React.FC<InquiryFormProps> = ({ 
  variant = "default",
  showWhatsApp = false
}) => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  const isSidebar = variant === "sidebar";

  if (status === "success") {
    return (
      <div className={`bg-[#f0f9f1] border border-[#c6efce] p-8 rounded-lg text-center ${isSidebar ? "p-4" : "p-8"}`}>
        <h3 className={`text-[#006100] font-montserrat font-bold mb-2 ${isSidebar ? "text-lg" : "text-xl"}`}>✅ Inquiry Sent Successfully!</h3>
        <p className="text-[#006100]/80 text-sm font-open-sans">Our sales team will reply within 12 hours.</p>
      </div>
    );
  }

  const labelStyle = "text-[0.8rem] font-[700] text-[#1A1A1A] font-montserrat block mb-1.5";
  const inputBaseStyle = "w-full border-[1.5px] border-[#ddd] rounded-[4px] focus:border-[#C0392B] outline-none transition-all font-open-sans bg-white box-border";
  const inputStyle = `${inputBaseStyle} px-4 py-3 text-[0.9rem]`;
  const sidebarInputStyle = `${inputBaseStyle} px-3 py-2 text-sm`;

  return (
    <form className={isSidebar ? "space-y-3" : "space-y-5"} onSubmit={handleSubmit}>
      <div className={isSidebar ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5"}>
        <div className="space-y-0.5">
          <label className={labelStyle}>Your Name *</label>
          <input 
            name="name" 
            required 
            placeholder="Full Name" 
            className={isSidebar ? sidebarInputStyle : inputStyle}
          />
        </div>

        <div className="space-y-0.5">
          <label className={labelStyle}>WhatsApp / Phone *</label>
          <input 
            name="whatsapp" 
            required 
            placeholder="+1 234 567 8900" 
            className={isSidebar ? sidebarInputStyle : inputStyle}
          />
        </div>

        <div className="space-y-0.5">
          <label className={labelStyle}>Email Address</label>
          <input 
            name="email" 
            type="email" 
            placeholder="your@email.com" 
            className={isSidebar ? sidebarInputStyle : inputStyle}
          />
        </div>

        <div className="space-y-0.5">
          <label className={labelStyle}>Your Country *</label>
          <input 
            name="country" 
            required
            placeholder="e.g. Nigeria, Kenya, Ghana..." 
            className={isSidebar ? sidebarInputStyle : inputStyle}
          />
        </div>

        <div className="space-y-0.5">
          <label className={labelStyle}>Product Interest</label>
          <select 
            name="product" 
            className={isSidebar ? sidebarInputStyle : inputStyle}
          >
            <option value="">Select product...</option>
            <option value="Used Brand Clothes">Used Brand Clothes</option>
            <option value="Used Brand Shoes">Used Brand Shoes</option>
            <option value="Used Brand Bags">Used Brand Bags</option>
            <option value="Mixed Products">Mixed (Clothes + Shoes)</option>
            <option value="Full Container">Full Container Mixed</option>
          </select>
        </div>

        <div className="space-y-0.5">
          <label className={labelStyle}>Order Quantity</label>
          <select 
            name="quantity" 
            className={isSidebar ? sidebarInputStyle : inputStyle}
          >
            <option value="">Select quantity...</option>
            <option value="100bales">≥100 bales (4,500 kg)</option>
            <option value="20ft">≥1 × 20ft Container (~13,000 kg)</option>
            <option value="40ft">≥1 × 40ft Container (~28,000 kg)</option>
            <option value="2x40ft">≥2 × 40ft Containers (~56,000 kg)</option>
          </select>
        </div>
      </div>

      <div className="space-y-0.5">
        <label className={labelStyle}>Message</label>
        <textarea 
          name="message" 
          rows={isSidebar ? 3 : 4} 
          placeholder="Tell us about your business, target market, or any questions..." 
          className={isSidebar ? `${sidebarInputStyle} resize-none` : `${inputStyle} resize-y min-h-[100px]`}
        />
      </div>

      <div className={isSidebar ? "space-y-2" : "flex flex-wrap items-center gap-4 pt-2"}>
        <button 
          type="submit" 
          disabled={status === "loading"}
          className={`bg-[#C0392B] hover:bg-[#a93226] text-white px-8 py-3.5 rounded-[4px] font-montserrat font-bold text-[0.9375rem] uppercase tracking-[0.03em] transition-all disabled:opacity-50 cursor-pointer ${isSidebar ? "w-full" : ""}`}
        >
          {status === "loading" ? "SENDING..." : "GET PRICE NOW →"}
        </button>

        {showWhatsApp && !isSidebar && (
          <a 
            href="https://wa.me/8618800000001?text=Hi%2C+I+want+to+place+a+wholesale+order" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#1da851] text-white px-6 py-3.5 rounded-[4px] font-montserrat font-bold text-[0.9375rem] inline-flex items-center gap-2 transition-all shadow-sm"
          >
            💬 WhatsApp
          </a>
        )}

        {!isSidebar && (
          <span className="text-[0.8rem] text-gray-500 font-open-sans">Reply within 12 hours</span>
        )}
      </div>

      {status === "error" && (
        <p className="text-red-600 text-xs text-center font-open-sans mt-2">⚠️ Failed to send. Please contact us via WhatsApp instead.</p>
      )}
    </form>
  );
};
