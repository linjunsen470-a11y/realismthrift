"use client";

import React, { useState } from "react";

interface InquiryFormProps {
  variant?: "default" | "sidebar";
}

export const InquiryForm: React.FC<InquiryFormProps> = ({ variant = "default" }) => {
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
      <div className={`bg-green-50 border border-green-200 p-8 rounded-lg text-center ${isSidebar ? "p-4" : "p-8"}`}>
        <h3 className={`text-[#166534] font-montserrat font-bold mb-2 ${isSidebar ? "text-lg" : "text-xl"}`}>✅ Inquiry Sent!</h3>
        <p className="text-[#166534]/80 text-sm font-open-sans">We'll reply within 12 hours.</p>
      </div>
    );
  }

  return (
    <form className={isSidebar ? "space-y-3" : "space-y-6"} onSubmit={handleSubmit}>
      <div className={isSidebar ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
        <div className="space-y-1.5">
          <label className="text-[11px] font-[800] text-[#1A1A1A] font-montserrat uppercase tracking-[0.05rem]">Your Name *</label>
          <input 
            name="name" 
            required 
            placeholder="Name" 
            className={`w-full px-4 border-[1px] border-gray-200 rounded-sm focus:border-[#C0392B] outline-none text-sm transition-all font-open-sans ${isSidebar ? "py-2" : "py-3"}`}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-[800] text-[#1A1A1A] font-montserrat uppercase tracking-[0.05rem]">Your Email *</label>
          <input 
            name="email" 
            type="email" 
            required 
            placeholder="Email" 
            className={`w-full px-4 border-[1px] border-gray-200 rounded-sm focus:border-[#C0392B] outline-none text-sm transition-all font-open-sans ${isSidebar ? "py-2" : "py-3"}`}
          />
        </div>
      </div>

      <div className={isSidebar ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
        <div className="space-y-1.5">
          <label className="text-[11px] font-[800] text-[#1A1A1A] font-montserrat uppercase tracking-[0.05rem]">Your WhatsApp *</label>
          <input 
            name="whatsapp" 
            required 
            placeholder="+WhatsApp" 
            className={`w-full px-4 border-[1px] border-gray-200 rounded-sm focus:border-[#C0392B] outline-none text-sm transition-all font-open-sans ${isSidebar ? "py-2" : "py-3"}`}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-[800] text-[#1A1A1A] font-montserrat uppercase tracking-[0.05rem]">Your Country</label>
          <input 
            name="country" 
            placeholder="Country" 
            className={`w-full px-4 border-[1px] border-gray-200 rounded-sm focus:border-[#C0392B] outline-none text-sm transition-all font-open-sans ${isSidebar ? "py-2" : "py-3"}`}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-[800] text-[#1A1A1A] font-montserrat uppercase tracking-[0.05rem]">Product Interest</label>
        <select 
          name="product" 
          className={`w-full px-4 border-[1px] border-gray-200 rounded-sm focus:border-[#C0392B] outline-none text-sm bg-white font-open-sans ${isSidebar ? "py-2" : "py-3"}`}
        >
          <option value="">Select product...</option>
          <option value="Used Brand Clothes">Used Brand Clothes</option>
          <option value="Used Brand Shoes">Used Brand Shoes</option>
          <option value="Used Brand Bags">Used Brand Bags</option>
          <option value="Mixed Products">Mixed Products</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-[800] text-[#1A1A1A] font-montserrat uppercase tracking-[0.05rem]">Your Quantity</label>
        <select 
          name="quantity" 
          className={`w-full px-4 border-[1px] border-gray-200 rounded-sm focus:border-[#C0392B] outline-none text-sm bg-white font-open-sans ${isSidebar ? "py-2" : "py-3"}`}
        >
          <option value="">Select quantity...</option>
          <option value="100bales">≥100 bales (4,500kg / 2,000 Pairs)</option>
          <option value="20ft">≥One 20ft Container</option>
          <option value="40ft">≥One 40ft Container</option>
          <option value="2x40ft">≥Two 40ft Containers</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-[800] text-[#1A1A1A] font-montserrat uppercase tracking-[0.05rem]">Your Message</label>
        <textarea 
          name="message" 
          rows={isSidebar ? 3 : 4} 
          placeholder="Your requirements..." 
          className={`w-full px-4 border-[1px] border-gray-200 rounded-sm focus:border-[#C0392B] outline-none text-sm transition-all resize-none font-open-sans ${isSidebar ? "py-2" : "py-3"}`}
        />
      </div>

      <button 
        type="submit" 
        disabled={status === "loading"}
        className={`rt-btn-primary w-full shadow-md disabled:opacity-50 !tracking-[0.1em] ${isSidebar ? "!py-3 text-xs" : "!py-4"}`}
      >
        {status === "loading" ? "SENDING..." : "GET QUOTATION NOW"}
      </button>

      {status === "error" && (
        <p className="text-red-600 text-xs text-center font-open-sans">⚠️ Failed to send. Use WhatsApp instead.</p>
      )}

      {!isSidebar && (
        <p className="text-center text-[11px] text-gray-400 font-open-sans pt-2">
          ✓ Reply within 12 hours &nbsp;·&nbsp; ✓ Free consultation &nbsp;·&nbsp; ✓ No spam
        </p>
      )}
    </form>
  );
};
