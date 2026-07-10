import { describe, expect, it } from "vitest";
import { isWebhookVerificationError } from "./webhook-errors";

describe("Resend webhook error classification", () => {
  it("only classifies the SDK verification error as an invalid signature", () => {
    const verificationError = new Error("No matching signature found");
    verificationError.name = "WebhookVerificationError";

    expect(isWebhookVerificationError(verificationError)).toBe(true);
    expect(isWebhookVerificationError(new Error("Database unavailable"))).toBe(false);
    expect(isWebhookVerificationError({ name: "WebhookVerificationError" })).toBe(false);
  });
});

