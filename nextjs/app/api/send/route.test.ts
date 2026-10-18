import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InquiryConfigurationError } from "@/lib/inquiries/clients";
import { POST } from "./route";

const mocks = vi.hoisted(() => ({
  createInquiry: vi.fn(),
  processPendingEmailJobs: vi.fn(),
  sendMetaCapiLead: vi.fn(),
  after: vi.fn(),
}));

vi.mock("next/server", async (importOriginal) => ({
  ...await importOriginal<typeof import("next/server")>(),
  after: mocks.after,
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

vi.mock("@/lib/meta-capi", async (importOriginal) => ({
  ...await importOriginal<typeof import("@/lib/meta-capi")>(),
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
    vi.spyOn(console, "info").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.createInquiry.mockReset();
    mocks.createInquiry.mockResolvedValue({ id: "inquiry-db-id-should-not-leak", created: true });
    mocks.processPendingEmailJobs.mockReset();
    mocks.processPendingEmailJobs.mockResolvedValue(undefined);
    mocks.sendMetaCapiLead.mockReset();
    mocks.sendMetaCapiLead.mockResolvedValue({ status: "sent" });
    mocks.after.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the stable event id and sends no plaintext contact details", async () => {
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
    expect(body.event_id).toBe(inquiryBody.submissionId);
    expect(order).toEqual(["capi"]);
    expect(mocks.after).toHaveBeenCalledTimes(1);
    await mocks.after.mock.calls[0][0]();
    expect(order).toEqual(["capi", "email"]);
    expect(mocks.sendMetaCapiLead).toHaveBeenCalledTimes(1);

    const capiInput = mocks.sendMetaCapiLead.mock.calls[0][0] as Record<string, unknown>;
    expect(capiInput.eventId).toBe(body.event_id);
    expect(capiInput.productInterest).toBe("Used Brand Clothes");
    expect(capiInput.clientIpAddress).toBe(ip);
    expect(capiInput.emailHash).toMatch(/^[a-f0-9]{64}$/);
    expect(body).not.toHaveProperty("emailHash");
    expect(body).not.toHaveProperty("phoneHash");
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

  it("returns success before slow email processing finishes", async () => {
    let finishEmail!: () => void;
    mocks.processPendingEmailJobs.mockImplementation(() => new Promise<void>(resolve => {
      finishEmail = resolve;
    }));

    const response = await POST(inquiryRequest(inquiryBody));
    expect(response.status).toBe(200);
    expect((await response.json()).ok).toBe(true);
    expect(mocks.processPendingEmailJobs).not.toHaveBeenCalled();

    const backgroundWork = mocks.after.mock.calls[0][0]();
    expect(mocks.processPendingEmailJobs).toHaveBeenCalledWith({
      inquiryId: "inquiry-db-id-should-not-leak", limit: 2,
    });
    finishEmail();
    await backgroundWork;
  });

  it("logs background email failure without changing an accepted inquiry", async () => {
    mocks.processPendingEmailJobs.mockRejectedValue(new Error("mail unavailable"));
    const response = await POST(inquiryRequest(inquiryBody));
    await mocks.after.mock.calls[0][0]();
    expect(response.status).toBe(200);
    expect((await response.json()).ok).toBe(true);
    expect(errorSpy).toHaveBeenCalledWith("Immediate inquiry email processing failed", {
      inquiryId: "inquiry-db-id-should-not-leak", errorName: "Error",
    });
  });

  it("hashes a valid international WhatsApp number after storage while preserving the inquiry", async () => {
    const whatsapp = "+1 (650) 555-1212";
    const response = await POST(inquiryRequest({ ...inquiryBody, whatsapp }));
    expect(response.status).toBe(200);
    expect(mocks.createInquiry.mock.calls[0][0].whatsapp).toBe(whatsapp);
    const input = mocks.sendMetaCapiLead.mock.calls[0][0];
    expect(input.phoneHash).toBe("e323ec626319ca94ee8bff2e4c87cf613be6ea19919ed1364124e16807ab3176");
    expect(input).not.toHaveProperty("whatsapp");
    expect(JSON.stringify(input)).not.toContain("16505551212");
    expect(JSON.stringify(await response.json())).not.toContain(input.phoneHash);
  });

  it("keeps the inquiry and email matching when the WhatsApp number lacks a country code", async () => {
    const response = await POST(inquiryRequest({ ...inquiryBody, whatsapp: "08031234567", country: "Nigeria" }));
    expect(response.status).toBe(200);
    expect(mocks.createInquiry.mock.calls[0][0].whatsapp).toBe("08031234567");
    const input = mocks.sendMetaCapiLead.mock.calls[0][0];
    expect(input.phoneHash).toBeUndefined();
    expect(input.emailHash).toMatch(/^[a-f0-9]{64}$/);
    expect(mocks.sendMetaCapiLead).toHaveBeenCalledTimes(1);
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
    expect(mocks.after).not.toHaveBeenCalled();
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

  it("reuses the persisted submission key when an accepted inquiry is retried", async () => {
    const first = await (await POST(inquiryRequest(inquiryBody))).json();
    mocks.createInquiry.mockResolvedValue({ id: "inquiry-db-id-should-not-leak", created: false });
    const retry = await (await POST(inquiryRequest(inquiryBody))).json();
    expect(retry.event_id).toBe(first.event_id);
    expect(retry.event_id).toBe(inquiryBody.submissionId);
    expect(mocks.sendMetaCapiLead.mock.calls.map(call => call[0].eventId)).toEqual([first.event_id, first.event_id]);
  });

  it("passes matching cookies from the request without including contact fields", async () => {
    const request = inquiryRequest(inquiryBody);
    request.headers.set("Cookie", "_fbp=fb.1.1700000000000.123456");
    await POST(request);
    expect(mocks.sendMetaCapiLead.mock.calls[0][0]).toMatchObject({ fbp: "fb.1.1700000000000.123456" });
  });

  it("treats an intentional measurement disable as a normal skip", async () => {
    mocks.sendMetaCapiLead.mockResolvedValue({ status: "skipped", reason: "disabled" });
    expect((await POST(inquiryRequest(inquiryBody))).status).toBe(200);
    expect(errorSpy).not.toHaveBeenCalled();
  });
});
