"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, MessageCircle, TriangleAlert } from "lucide-react";

interface InquiryFormProps {
  variant?: "default" | "sidebar";
  showWhatsApp?: boolean;
}

export function InquiryForm({
  variant = "default",
  showWhatsApp = false,
}: InquiryFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const isSidebar = variant === "sidebar";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={`rt-form-state rt-form-state-success${isSidebar ? " is-sidebar" : ""}`}>
        <CheckCircle2 size={24} strokeWidth={2.2} />
        <h3>Inquiry Sent Successfully!</h3>
        <p>
          Our sales team will reply to your email or WhatsApp within 12 hours.
        </p>
      </div>
    );
  }

  return (
    <form
      className={`rt-inquiry-form${isSidebar ? " is-sidebar" : ""}`}
      onSubmit={handleSubmit}
    >
      <div className="rt-form-grid">
        <div className="rt-form-group">
          <label htmlFor={`${variant}-name`}>Your Name *</label>
          <input
            id={`${variant}-name`}
            name="name"
            type="text"
            required
            placeholder="John Smith"
          />
        </div>

        <div className="rt-form-group">
          <label htmlFor={`${variant}-email`}>Your Email *</label>
          <input
            id={`${variant}-email`}
            name="email"
            type="email"
            required
            placeholder="john@company.com"
          />
        </div>

        <div className="rt-form-group">
          <label htmlFor={`${variant}-whatsapp`}>Your WhatsApp *</label>
          <input
            id={`${variant}-whatsapp`}
            name="whatsapp"
            type="text"
            required
            placeholder="+1 234 567 8900"
          />
        </div>

        <div className="rt-form-group">
          <label htmlFor={`${variant}-country`}>Your Country</label>
          <input
            id={`${variant}-country`}
            name="country"
            type="text"
            placeholder="Nigeria, Philippines..."
          />
        </div>
      </div>

      <div className="rt-form-group">
        <label htmlFor={`${variant}-product`}>Product Interest</label>
        <select id={`${variant}-product`} name="product">
          <option value="">Select product...</option>
          <option value="Used Brand Clothes">Used Brand Clothes</option>
          <option value="Used Brand Shoes">Used Brand Shoes</option>
          <option value="Used Brand Bags">Used Brand Bags</option>
          <option value="Mixed Products">Mixed Products</option>
        </select>
      </div>

      <div className="rt-form-group">
        <label htmlFor={`${variant}-quantity`}>Your Quantity</label>
        <select id={`${variant}-quantity`} name="quantity">
          <option value="">Select quantity...</option>
          <option value="100bales">≥100 bales (4,500kg / 2,000 pairs)</option>
          <option value="20ft">≥One 20ft Container</option>
          <option value="40ft">≥One 40ft Container</option>
          <option value="2x40ft">≥Two 40ft Containers</option>
        </select>
      </div>

      <div className="rt-form-group">
        <label htmlFor={`${variant}-message`}>Your Message</label>
        <textarea
          id={`${variant}-message`}
          name="message"
          rows={isSidebar ? 4 : 5}
          placeholder="Tell us about your requirements, target market, quantity needed..."
        />
      </div>

      <div className={`rt-form-actions${isSidebar ? " is-sidebar" : ""}`}>
        <button type="submit" className="rt-form-submit" disabled={status === "loading"}>
          {status === "loading" ? "SENDING..." : "SEND INQUIRY NOW"}
          {status !== "loading" && <ArrowRight size={16} strokeWidth={2.25} />}
        </button>

        {showWhatsApp && !isSidebar ? (
          <a
            href="https://wa.me/8618800000001?text=Hi%2C+I+want+to+place+a+wholesale+order"
            target="_blank"
            rel="noreferrer"
            className="rt-form-whatsapp"
          >
            <MessageCircle size={18} strokeWidth={2.2} />
            WhatsApp
          </a>
        ) : null}
      </div>

      {!isSidebar ? (
        <p className="rt-form-note">Reply within 12 hours | Free consultation | No spam</p>
      ) : null}

      {status === "error" ? (
        <div className="rt-form-state rt-form-state-error">
          <TriangleAlert size={18} strokeWidth={2.2} />
          <p>Failed to send. Please contact us via WhatsApp or Email directly.</p>
        </div>
      ) : null}
    </form>
  );
}
