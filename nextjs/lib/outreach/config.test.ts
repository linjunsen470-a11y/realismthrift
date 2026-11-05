import { afterEach, expect, it, vi } from "vitest";
import { GmailError, logOutreachError } from "./config";

afterEach(() => vi.restoreAllMocks());

it.each(["oauth_token", "gmail_api"] as const)("logs only safe diagnostics for %s", stage => {
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  const error = new GmailError(401, stage);
  error.message = "Bearer secret buyer@example.com";
  error.details = { response: "private email content" };
  logOutreachError("mcp_tool", error);
  expect(log).toHaveBeenCalledWith("Outreach operation failed", {
    operation: "mcp_tool", code: "gmail_request_failed", httpStatus: 401, stage,
  });
});
