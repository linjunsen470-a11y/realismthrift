import { translatedLocales } from "@/lib/i18n/routing";
import { getTranslator } from "@/lib/i18n/server";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  CustomerAcknowledgementEmail,
  customerAcknowledgementText,
} from "./CustomerAcknowledgementEmail";
import { SalesInquiryEmail, salesInquiryText } from "./SalesInquiryEmail";

describe("inquiry email templates", () => {
  it("renders the complete sales notification", () => {
    const props = {
      inquiryId: "c8085331-9da0-4eb2-9280-01d690bf2c46",
      submittedAt: "2026-07-10T08:00:00.000Z",
      name: "Amina Buyer",
      email: "amina@example.com",
      whatsapp: "+234 123 4567",
      country: "Nigeria",
      product: "Used Brand Clothes",
      quantity: "20ft",
      message: "Please share your latest price list.",
      sourcePath: "/contact-us",
    };

    const html = renderToStaticMarkup(<SalesInquiryEmail {...props} />);
    expect(html).toContain("New wholesale inquiry");
    expect(html).toContain("Amina Buyer");
    expect(salesInquiryText(props)).toContain("Inquiry ID");
  });

  it("renders a concise automated customer acknowledgement", () => {
    const props = {
      name: "Amina Buyer",
      country: "Nigeria",
      product: "Used Brand Clothes",
      quantity: "20ft",
    };

    const html = renderToStaticMarkup(<CustomerAcknowledgementEmail {...props} />);
    expect(html).toContain("AUTOMATED CONFIRMATION");
    expect(html).toContain("within 12 hours");
    expect(customerAcknowledgementText(props)).toContain("sales@realismthrift.com");
  });
});



it("localizes customer email body and summary in all published languages, preserving user text", () => {
  for (const locale of translatedLocales) {
    const props = { locale, name: "Buyer <script>", country: "Buyer country", product: "Used Brand Clothes", quantity: "20ft" };
    const html = renderToStaticMarkup(<CustomerAcknowledgementEmail {...props} />);
    const text = customerAcknowledgementText(props);
    expect(html).toContain(`lang="${locale}"`);
    expect(html).toContain(`dir="${locale === "ar" ? "rtl" : "ltr"}"`);
    expect(html).not.toContain("<script>");
    expect(text).toContain(getTranslator(locale)("Used Brand Clothes"));
    expect(text).toContain(getTranslator(locale)("One 20ft container"));
    expect(text).toContain("Buyer country");
    expect(text).not.toContain("AUTOMATED CONFIRMATION");
    expect(text).not.toMatch(/\{name\}/);
  }
});
