"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, MessageCircle, TriangleAlert } from "lucide-react";

interface InquiryFormProps {
  variant?: "default" | "sidebar";
  showWhatsApp?: boolean;
}

type SubmissionState =
  | { status: "idle" | "loading" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export function InquiryForm({
  variant = "default",
  showWhatsApp = false,
}: InquiryFormProps) {
  const [submission, setSubmission] = useState<SubmissionState>({ status: "idle" });
  const isSidebar = variant === "sidebar";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmission({ status: "loading" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as
        | { ok?: boolean; message?: string }
        | null;

      if (response.ok && result?.ok) {
        form.reset();
        setSubmission({
          status: "success",
          message: result.message ?? "Inquiry received. Our sales team will contact you within 12 hours.",
        });
        return;
      }

      setSubmission({
        status: "error",
        message:
          result?.message ??
          "We could not send your inquiry right now. Please try again or contact us via WhatsApp.",
      });
    } catch {
      setSubmission({
        status: "error",
        message: "Network error. Please try again or contact us via WhatsApp.",
      });
    }
  }

  if (submission.status === "success") {
    return (
      <div className={`rt-form-state rt-form-state-success${isSidebar ? " is-sidebar" : ""}`}>
        <CheckCircle2 size={24} strokeWidth={2.2} />
        <h3>Inquiry Received</h3>
        <p>{submission.message}</p>
      </div>
    );
  }

  return (
    <form
      className={`rt-inquiry-form${isSidebar ? " is-sidebar" : ""}`}
      onSubmit={handleSubmit}
    >
      <div className="rt-form-grid">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="new-password"
          className="hidden"
          aria-hidden="true"
          data-lpignore="true"
        />

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
          <option value="100bales">100+ bales (4,500 kg / 2,000 pairs)</option>
          <option value="20ft">One 20ft container</option>
          <option value="40ft">One 40ft container</option>
          <option value="2x40ft">Two 40ft containers</option>
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
        <button
          type="submit"
          className="rt-form-submit"
          disabled={submission.status === "loading"}
        >
          {submission.status === "loading" ? "SENDING..." : "SEND INQUIRY NOW"}
          {submission.status !== "loading" && <ArrowRight size={16} strokeWidth={2.25} />}
        </button>

        {showWhatsApp && !isSidebar ? (
          <a
            href="https://wa.me/8613367481710?text=Hi%2C+I+want+to+place+a+wholesale+order"
            target="_blank"
            rel="noopener noreferrer"
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

      {submission.status === "error" ? (
        <div className="rt-form-state rt-form-state-error">
          <TriangleAlert size={18} strokeWidth={2.2} />
          <p>{submission.message}</p>
        </div>
      ) : null}
    </form>
  );
}
