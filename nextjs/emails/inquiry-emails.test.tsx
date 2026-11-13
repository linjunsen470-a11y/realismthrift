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

