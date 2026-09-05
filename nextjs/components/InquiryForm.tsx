"use client";

import { FormEvent, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LoaderCircle, MessageCircle, TriangleAlert } from "lucide-react";
import { trackEvent } from "./Analytics";

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
  const submissionAttemptRef = useRef<{ id: string; fingerprint: string } | null>(null);
  const isSubmittingRef = useRef(false);
  const formId = useId();
  const isSidebar = variant === "sidebar";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setSubmission({ status: "loading" });

    const form = event.currentTarget;
    try {
      const formData = new FormData(form);
      const formValues = Object.fromEntries(formData.entries()) as Record<string, string>;
      const fingerprint = JSON.stringify(formValues);

      if (submissionAttemptRef.current?.fingerprint !== fingerprint) {
        submissionAttemptRef.current = {
          id: crypto.randomUUID(),
          fingerprint,
        };
      }

      const payload = {
        ...formValues,
        submissionId: submissionAttemptRef.current.id,
        sourcePath: window.location.pathname,
      };

      const response = await fetch("/api/send", {
        signal: AbortSignal.timeout(30_000),
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
        submissionAttemptRef.current = null;
        setSubmission({
          status: "success",
          message: result.message ?? "Inquiry received. Our sales team aims to reply within 12 hours.",
        });

        // Track only non-identifying lead metadata. Never send contact details or free text to GA4.
        try {
          trackEvent("generate_lead", {
            form_name: "wholesale_inquiry",
            product_interest: formValues.product || "not_specified",
            quantity: formValues.quantity || "not_specified",
            country: formValues.country || "not_specified",
            page_path: window.location.pathname,
          });
        } catch {
          // Analytics must not turn an accepted inquiry into a displayed error.
        }

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
    } finally {
      isSubmittingRef.current = false;
    }
  }

  if (submission.status === "success") {
    return (
      <div className={`rt-form-state rt-form-state-success${isSidebar ? " is-sidebar" : ""}`} role="status" aria-live="polite">
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
      aria-busy={submission.status === "loading" ? "true" : "false"}
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
          <label htmlFor={`${formId}-name`}>Your Name *</label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name" maxLength={80}
            required
            placeholder="John Smith"
          />
        </div>

        <div className="rt-form-group">
          <label htmlFor={`${formId}-email`}>Your Email *</label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email" maxLength={120} spellCheck={false}
            inputMode="email"
            required
            placeholder="john@company.com"
          />
        </div>

        <div className="rt-form-group">
          <label htmlFor={`${formId}-whatsapp`}>Your WhatsApp *</label>
          <input
            id={`${formId}-whatsapp`}
            name="whatsapp"
            type="tel"
            autoComplete="tel" maxLength={32}
            inputMode="tel"
            required
            placeholder="+1 234 567 8900"
          />
        </div>

        <div className="rt-form-group">
          <label htmlFor={`${formId}-country`}>Your Country</label>
          <input
            id={`${formId}-country`}
            name="country"
            type="text"
            autoComplete="country-name" maxLength={80}
            placeholder="Nigeria, Philippines..."
          />
        </div>
      </div>

      <div className="rt-form-group">
        <label htmlFor={`${formId}-product`}>Product Interest</label>
        <select id={`${formId}-product`} name="product">
          <option value="">Select product...</option>
          <option value="Used Brand Clothes">Used Brand Clothes</option>
          <option value="Used Brand Shoes">Used Brand Shoes</option>
          <option value="Used Brand Bags">Used Brand Bags</option>
          <option value="Mixed Products">Mixed Products</option>
        </select>
      </div>

      <div className="rt-form-group">
        <label htmlFor={`${formId}-quantity`}>Your Quantity</label>
        <select id={`${formId}-quantity`} name="quantity">
          <option value="">Select quantity...</option>
          <option value="100bales">100+ bales of clothes</option>
          <option value="shoes">Shoes — specify pairs below</option>
          <option value="bags">Bags — specify pieces below</option>
          <option value="trial">Trial order — confirm minimum</option>
          <option value="20ft">One 20ft container</option>
          <option value="40ft">One 40ft container</option>
          <option value="2x40ft">Two 40ft containers</option>
        </select>
      </div>

      <div className="rt-form-group">
        <label htmlFor={`${formId}-message`}>Your Message</label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={isSidebar ? 4 : 5}
          spellCheck={true} maxLength={2000}
          placeholder="Tell us about your requirements, target market, quantity needed..."
        />
      </div>

      <div className={`rt-form-actions${isSidebar ? " is-sidebar" : ""}`}>
        <button
          type="submit"
          className="rt-form-submit"
          disabled={submission.status === "loading"}
        >
          {submission.status === "loading" ? "SENDING…" : "SEND INQUIRY NOW"}
          {submission.status === "loading" ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : null}
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
        <p className="rt-form-note">We aim to reply within 12 hours. Free consultation.</p>
      ) : null}

      <p className="rt-form-note">
        We use your details to respond to your inquiry. <Link href="/privacy-policy" className="underline">Privacy Policy</Link>
      </p>

      {submission.status === "error" ? (
        <div className="rt-form-state rt-form-state-error" role="alert" aria-live="polite">
          <TriangleAlert size={18} strokeWidth={2.2} />
          <p>{submission.message}</p>
          <a href="https://wa.me/8613367481710" target="_blank" rel="noopener noreferrer" className="underline">Contact us on WhatsApp</a>
        </div>
      ) : null}
    </form>
  );
}
