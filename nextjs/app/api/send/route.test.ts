import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InquiryConfigurationError } from "@/lib/inquiries/clients";
import { POST } from "./route";

const mocks = vi.hoisted(() => ({
  createInquiry: vi.fn(),
  processPendingEmailJobs: vi.fn(),
  sendMetaCapiLead: vi.fn(),
}));

vi.mock("@/lib/inquiries/repository", () => ({
  createInquiry: mocks.createInquiry,
  InquiryStorageError: class InquiryStorageError extends Error {
    operation = "insert";
  },
}));

vi.mock("@/lib/inquiries/email-jobs", () => ({
  processPendingEmailJobs: mocks.processPendingEmailJobs,
}));

vi.mock("@/lib/meta-capi", () => ({
  sendMetaCapiLead: mocks.sendMetaCapiLead,
}));

const inquiryBody = {
  submissionId: "9f74ef80-02ec-4f5c-9009-dfe01a6bf9d8",
  name: "Buyer Name",
  email: "buyer@example.com",
  whatsapp: "+1 555 0100",
  country: "Nigeria",
  product: "Used Brand Clothes",
  quantity: "20ft",
  message: "Please send a price list.",
  sourcePath: "/contact-us?email=buyer@example.com",
  website: "",
};

const CONTACT_TEXT = [
  "Buyer Name",
  "buyer@example.com",
  "+1 555 0100",
  "Nigeria",
  "20ft",
  "Please send a price list.",
  "inquiry-db-id-should-not-leak",
];

let ipCounter = 10;
let errorSpy: ReturnType<typeof vi.spyOn>;

function nextIp() {
  ipCounter += 1;
  return `203.0.113.${ipCounter}`;
}

function inquiryRequest(body: unknown, ip = nextIp()) {
  return new Request("https://www.realismthrift.com/api/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://www.realismthrift.com",
      "User-Agent": "Mozilla/5.0 (compatible; RealismthriftTest/1.0)",
      "X-Forwarded-For": ip,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/send Meta Lead", () => {
  beforeEach(() => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.createInquiry.mockReset();
    mocks.createInquiry.mockResolvedValue({ id: "inquiry-db-id-should-not-leak", created: true });
    mocks.processPendingEmailJobs.mockReset();
    mocks.processPendingEmailJobs.mockResolvedValue(undefined);
    mocks.sendMetaCapiLead.mockReset();
    mocks.sendMetaCapiLead.mockResolvedValue({ status: "sent" });
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it("returns the server event id and sends a non-PII Conversions API Lead", async () => {
    const order: string[] = [];
    mocks.processPendingEmailJobs.mockImplementation(async () => {
      order.push("email");
    });
    mocks.sendMetaCapiLead.mockImplementation(async () => {
      order.push("capi");
      return { status: "sent" };
    });

    const ip = "203.0.113.40";
    const response = await POST(inquiryRequest(inquiryBody, ip));
    expect(response.status).toBe(200);
    const body = await response.json();

    expect(body.ok).toBe(true);
    expect(body.message).toBe("Inquiry received. Our sales team aims to reply within 12 hours.");
    expect(body.event_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    expect(order).toEqual(["email", "capi"]);
    expect(mocks.sendMetaCapiLead).toHaveBeenCalledTimes(1);

    const capiInput = mocks.sendMetaCapiLead.mock.calls[0][0] as Record<string, unknown>;
    expect(capiInput.eventId).toBe(body.event_id);
    expect(capiInput.productInterest).toBe("Used Brand Clothes");
    expect(capiInput.clientIpAddress).toBe(ip);
    expect(capiInput.clientUserAgent).toBe("Mozilla/5.0 (compatible; RealismthriftTest/1.0)");
    expect(capiInput).not.toHaveProperty("email");
    expect(capiInput).not.toHaveProperty("name");
    expect(capiInput).not.toHaveProperty("whatsapp");
    expect(capiInput).not.toHaveProperty("message");
    expect(capiInput).not.toHaveProperty("country");

    const eventSourceUrl = String(capiInput.eventSourceUrl);
    const source = new URL(eventSourceUrl);
    expect(source.pathname).toBe("/contact-us");
    expect(source.search).toBe("");
    const serialized = JSON.stringify(capiInput);
    for (const secret of CONTACT_TEXT) {
      expect(serialized).not.toContain(secret);
    }
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("still accepts the inquiry when the Conversions API call fails", async () => {
    mocks.sendMetaCapiLead.mockResolvedValue({ status: "failed", errorName: "HttpError", httpStatus: 502 });

    const response = await POST(inquiryRequest(inquiryBody));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.event_id).toMatch(/^[0-9a-f-]{36}$/);
    expect(errorSpy).toHaveBeenCalledWith("Meta CAPI Lead failed", { errorName: "HttpError", status: 502 });
  });

  it("still accepts the inquiry when the Conversions API token is missing", async () => {
    mocks.sendMetaCapiLead.mockResolvedValue({ status: "skipped", reason: "missing_token" });

    const response = await POST(inquiryRequest(inquiryBody));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.event_id).toBeTruthy();
    expect(errorSpy).toHaveBeenCalledWith("Meta CAPI Lead skipped", { errorName: "missing_token" });
  });

  it("still returns event_id when the Conversions API helper throws", async () => {
    mocks.sendMetaCapiLead.mockRejectedValue(new Error("boom"));

    const response = await POST(inquiryRequest(inquiryBody));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.event_id).toBeTruthy();
    expect(errorSpy).toHaveBeenCalledWith("Meta CAPI Lead failed", { errorName: "Error" });
    const logged = JSON.stringify(errorSpy.mock.calls);
    expect(logged).not.toContain("boom");
  });

  it("does not send a Lead when the inquiry is not stored", async () => {
    mocks.createInquiry.mockRejectedValue(new Error("db down"));

    const response = await POST(inquiryRequest(inquiryBody));
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.ok).toBe(false);
    expect(body.event_id).toBeUndefined();
    expect(mocks.sendMetaCapiLead).not.toHaveBeenCalled();
  });

  it("does not send a Lead when inquiry configuration is missing", async () => {
    mocks.createInquiry.mockRejectedValue(new InquiryConfigurationError("missing"));

    const response = await POST(inquiryRequest(inquiryBody));
    expect(response.status).toBe(500);
    expect(mocks.sendMetaCapiLead).not.toHaveBeenCalled();
  });

  it("does not send a Lead when validation fails", async () => {
    const response = await POST(inquiryRequest({ ...inquiryBody, email: "not-an-email" }));
    expect(response.status).toBe(400);
    expect(mocks.sendMetaCapiLead).not.toHaveBeenCalled();
    expect(mocks.createInquiry).not.toHaveBeenCalled();
  });
});
