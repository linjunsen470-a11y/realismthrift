"use client";

import React, { useState } from "react";

export const InquiryForm: React.FC = () => {
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

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 p-8 rounded-lg text-center">
        <h3 className="text-[#166534] font-montserrat font-bold text-xl mb-2">✅ Inquiry Sent Successfully!</h3>
        <p className="text-[#166534]/80 text-sm font-open-sans">Our sales team will reply to your email / WhatsApp within 12 hours.</p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1A1A1A] font-montserrat uppercase tracking-wider">Your Name *</label>
          <input 
            name="name" 
            required 
            placeholder="John Smith" 
            className="w-full px-4 py-3 border-2 border-gray-100 rounded-sm focus:border-[#C0392B] outline-none text-sm transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1A1A1A] font-montserrat uppercase tracking-wider">Your Email *</label>
          <input 
            name="email" 
            type="email" 
            required 
            placeholder="john@company.com" 
            className="w-full px-4 py-3 border-2 border-gray-100 rounded-sm focus:border-[#C0392B] outline-none text-sm transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1A1A1A] font-montserrat uppercase tracking-wider">Your WhatsApp *</label>
          <input 
            name="whatsapp" 
            required 
            placeholder="+1 234 567 8900" 
            className="w-full px-4 py-3 border-2 border-gray-100 rounded-sm focus:border-[#C0392B] outline-none text-sm transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1A1A1A] font-montserrat uppercase tracking-wider">Your Country</label>
          <input 
            name="country" 
            placeholder="Nigeria, Philippines..." 
            className="w-full px-4 py-3 border-2 border-gray-100 rounded-sm focus:border-[#C0392B] outline-none text-sm transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-[#1A1A1A] font-montserrat uppercase tracking-wider">Product Interest</label>
        <select 
          name="product" 
          className="w-full px-4 py-3 border-2 border-gray-100 rounded-sm focus:border-[#C0392B] outline-none text-sm bg-white"
        >
          <option value="">Select product...</option>
          <option value="Used Brand Clothes">Used Brand Clothes</option>
          <option value="Used Brand Shoes">Used Brand Shoes</option>
          <option value="Used Brand Bags">Used Brand Bags</option>
          <option value="Mixed Products">Mixed Products</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-[#1A1A1A] font-montserrat uppercase tracking-wider">Your Quantity</label>
        <select 
          name="quantity" 
          className="w-full px-4 py-3 border-2 border-gray-100 rounded-sm focus:border-[#C0392B] outline-none text-sm bg-white"
        >
          <option value="">Select quantity...</option>
          <option value="100bales">≥100 bales (4,500kg / 2,000 Pairs)</option>
          <option value="20ft">≥One 20ft Container</option>
          <option value="40ft">≥One 40ft Container</option>
          <option value="2x40ft">≥Two 40ft Containers</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-[#1A1A1A] font-montserrat uppercase tracking-wider">Your Message</label>
        <textarea 
          name="message" 
          rows={4} 
          placeholder="Tell us about your requirements, target market..." 
          className="w-full px-4 py-3 border-2 border-gray-100 rounded-sm focus:border-[#C0392B] outline-none text-sm transition-all resize-none"
        />
      </div>

      <button 
        type="submit" 
        disabled={status === "loading"}
        className="w-full bg-[#C0392B] text-white font-montserrat font-black text-sm py-4 rounded-sm hover:bg-[#A93226] transition-all disabled:opacity-50"
      >
        {status === "loading" ? "SENDING..." : "SEND INQUIRY NOW"}
      </button>

      {status === "error" && (
        <p className="text-red-600 text-xs text-center">⚠️ Failed to send. Please contact us via WhatsApp directly.</p>
      )}

      <p className="text-center text-[10px] text-gray-400 font-open-sans">
        ✓ Reply within 12 hours &nbsp;·&nbsp; ✓ Free consultation &nbsp;·&nbsp; ✓ No spam
      </p>
    </form>
  );
};
