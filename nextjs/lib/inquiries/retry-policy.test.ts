import { describe, expect, it } from "vitest";
import { classifyEmailError, getRetryDelayMinutes } from "./retry-policy";

describe("inquiry email retry policy", () => {
  it("uses the planned retry schedule", () => {
    expect([1, 2, 3, 4, 5].map(getRetryDelayMinutes)).toEqual([5, 15, 60, 360, 360]);
  });

  it("retries rate limits and server errors", () => {
    expect(classifyEmailError({
      name: "rate_limit_exceeded",
      message: "Slow down",
      statusCode: 429,
    }).transient).toBe(true);

    expect(classifyEmailError({
      name: "internal_server_error",
      message: "Try again",
      statusCode: 500,
    }).transient).toBe(true);
  });

  it("does not retry permanent configuration errors", () => {
    expect(classifyEmailError({
      name: "invalid_api_key",
      message: "Invalid key",
      statusCode: 403,
    }).transient).toBe(false);

    expect(classifyEmailError(new Error("Missing runtime configuration")).transient).toBe(true);
    expect(classifyEmailError({
      name: "InquiryConfigurationError",
      message: "Missing RESEND_API_KEY",
    }).transient).toBe(false);
  });

  it("redacts email addresses from stored provider errors", () => {
    const failure = classifyEmailError({
      name: "validation_error",
      message: "buyer@example.com is invalid",
      statusCode: 422,
    });

    expect(failure.message).toBe("[email redacted] is invalid");
  });
});
