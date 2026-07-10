import { describe, expect, it } from "vitest";
import { validateInquiryPayload } from "./validation";

const validPayload = {
  submissionId: "9f74ef80-02ec-4f5c-9009-dfe01a6bf9d8",
  name: "Buyer Name",
  email: "BUYER@example.com",
  whatsapp: "+1 555 0100",
  country: "Nigeria",
  product: "Used Brand Clothes",
  quantity: "20ft",
  message: "Please send a price list.",
  sourcePath: "/contact-us?campaign=private",
  website: "",
};

describe("validateInquiryPayload", () => {
  it("normalizes a valid inquiry and keeps only the source pathname", () => {
    const result = validateInquiryPayload(validPayload);

    expect(result.data).toMatchObject({
      email: "buyer@example.com",
      sourcePath: "/contact-us",
    });
  });

  it("rejects missing required contact fields", () => {
    const result = validateInquiryPayload({ ...validPayload, whatsapp: "" });
    expect(result).toEqual({ error: "Missing required fields." });
  });

  it("rejects the honeypot field", () => {
    const result = validateInquiryPayload({ ...validPayload, website: "spam.example" });
    expect(result).toEqual({ error: "Invalid request payload." });
  });

  it("rejects invalid submission identifiers", () => {
    const result = validateInquiryPayload({ ...validPayload, submissionId: "not-a-uuid" });
    expect(result).toEqual({ error: "Invalid submission identifier." });
  });

  it("does not accept an external URL as a source path", () => {
    const result = validateInquiryPayload({ ...validPayload, sourcePath: "https://evil.example/x" });
    expect(result.data?.sourcePath).toBe("/");
  });
});

