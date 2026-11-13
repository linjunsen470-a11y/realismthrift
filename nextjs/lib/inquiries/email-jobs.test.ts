import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { locales, localePath } from "@/lib/i18n/routing";
import type { ClaimedEmailJob } from "./types";

const mocks = vi.hoisted(() => ({
  send: vi.fn(),
  claim: vi.fn(),
  accept: vi.fn(),
  fail: vi.fn(),
}));

vi.mock("./clients", () => ({ getResend: () => ({ emails: { send: mocks.send } }) }));
vi.mock("./repository", () => ({
  claimEmailJobs: mocks.claim,
  markEmailJobAccepted: mocks.accept,
  markEmailJobFailed: mocks.fail,
}));

import { processPendingEmailJobs } from "./email-jobs";

const job: ClaimedEmailJob = {
  job_id: "job-1", inquiry_id: "inquiry-1", kind: "sales_notification", attempt_count: 5,
  from_email: "sales@example.test", to_email: "team@example.test", reply_to_email: "buyer@example.test",
  subject: "Inquiry", template_version: "v1", idempotency_key: "stable-email-key",
  name: "Buyer", email: "buyer@example.test", whatsapp: "+12025550123", country: "Nigeria",
  product: "Used Brand Clothes", quantity: "20ft", message: "Please send a price list.",
  source_path: "/contact-us", inquiry_created_at: "2026-11-01T00:00:00.000Z",
};

describe("email outbox storage failures", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.claim.mockResolvedValue([job]);
    mocks.send.mockResolvedValue({ data: { id: "resend-1" }, error: null });
    mocks.accept.mockResolvedValue(undefined);
    mocks.fail.mockResolvedValue(undefined);
  });

  it("leaves the lease recoverable when Resend accepted but storing acceptance fails", async () => {
    mocks.accept.mockRejectedValueOnce(new Error("PostgREST unavailable"));
    await expect(processPendingEmailJobs()).rejects.toThrow("PostgREST unavailable");
    expect(mocks.send).toHaveBeenCalledTimes(1);
    expect(mocks.send.mock.calls[0][1]).toEqual({ idempotencyKey: "stable-email-key" });
    expect(mocks.accept).toHaveBeenCalledWith("job-1", "resend-1");
    expect(mocks.fail).not.toHaveBeenCalled();

    // The scheduled worker can reclaim the expired lease with the same payload/key.
    expect(await processPendingEmailJobs()).toEqual({ claimed: 1, accepted: 1, deferred: 0, dead: 0 });
    expect(mocks.send).toHaveBeenCalledTimes(2);
    expect(mocks.send.mock.calls[1]).toEqual(mocks.send.mock.calls[0]);
    expect(mocks.fail).not.toHaveBeenCalled();
  });

  it("still schedules a retry when Resend itself fails transiently", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.claim.mockResolvedValue([{ ...job, attempt_count: 1 }]);
    mocks.send.mockResolvedValue({ data: null, error: { name: "rate_limit_exceeded", statusCode: 429, message: "Slow down" } });
    expect(await processPendingEmailJobs()).toEqual({ claimed: 1, accepted: 0, deferred: 1, dead: 0 });
    expect(mocks.accept).not.toHaveBeenCalled();
    expect(mocks.fail).toHaveBeenCalledWith("job-1", expect.objectContaining({ status: "failed", code: "rate_limit_exceeded" }));
    vi.restoreAllMocks();
  });

  it.each(locales)("sends the English v1 acknowledgement on first send and retry from %s", async (locale) => {
    const receipt = {
      ...job,
      kind: "customer_ack",
      subject: "Thank you for your inquiry, Buyer — RealismThrift",
      source_path: localePath("/contact-us", locale),
      country: "Côte d’Ivoire",
    };
    mocks.claim.mockResolvedValueOnce([{ ...receipt, attempt_count: 1 }])
      .mockResolvedValueOnce([{ ...receipt, attempt_count: 2 }]);
    mocks.accept.mockRejectedValueOnce(new Error("PostgREST unavailable"));

    await expect(processPendingEmailJobs()).rejects.toThrow("PostgREST unavailable");
    expect((await processPendingEmailJobs()).accepted).toBe(1);
    const [firstSend, retry] = mocks.send.mock.calls;
    expect(retry).toEqual(firstSend);
    const [payload, options] = retry;
    expect(options.idempotencyKey).toBe(receipt.idempotency_key);
    expect(payload.subject).toBe(receipt.subject);
    expect(payload.text).toContain("This is an automated confirmation that we received your wholesale inquiry.");
    expect(payload.text).toContain("Country: Côte d’Ivoire");
    const html = renderToStaticMarkup(payload.react);
    expect(html).toContain('lang="en"');
    expect(html).toContain("We have received your wholesale inquiry.");
  });
});
