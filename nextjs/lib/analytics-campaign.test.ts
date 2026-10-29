import { describe, expect, it } from "vitest";
import { campaignParameters } from "./analytics-campaign";

describe("campaign attribution privacy boundary", () => {
  it("maps marketing slugs without retaining unrelated query values", () => {
    expect(campaignParameters("?utm_source=facebook&utm_medium=paid_social&utm_campaign=october-bags&utm_content=video_1&email=buyer@example.com&token=secret&fbclid=click")).toEqual({
      campaign_source: "facebook", campaign_medium: "paid_social", campaign_name: "october-bags", campaign_content: "video_1", campaign_id: "",
    });
  });
  it("rejects duplicate, free-text, email, phone and oversized labels", () => {
    for (const value of ["buyer@example.com", "+8617279444062", "buyer-17279444062", "John Smith", "https://example.com", "a".repeat(101)]) {
      expect(campaignParameters(`?utm_campaign=${encodeURIComponent(value)}`)).toEqual({});
    }
    expect(campaignParameters("?utm_source=a&utm_source=b&utm_term=private%20message")).toEqual({});
  });
  it("works as an independent inline bootstrap function", () => {
    const inline = new Function("search", `return (${campaignParameters.toString()})(search)`);
    expect(inline("?utm_source=google&utm_medium=cpc")).toEqual({ campaign_source: "google", campaign_medium: "cpc", campaign_name: "", campaign_id: "", campaign_content: "" });
  });
});
