import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildMetaCapiLeadEvent,
  metaCapiEventsUrl,
  sendMetaCapiLead,
  type MetaCapiLeadEvent,
} from "./meta-capi";
import { metaLeadParams, PRODUCTION_FB_PIXEL_ID } from "./meta-pixel";

const EVENT_ID = "6f1e2c3a-4b5d-4e6f-8a7b-9c0d1e2f3a4b";
const FAKE_TOKEN = "test-capi-token";

const CONTACT_PII = [
  "Ada Buyer",
  "ada@example.com",
  "+1 555 0199",
  "Acme Co",
  "please call me about a private order",
  "Nigeria",
];

function containsLiveAccessToken(value: string) {
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  return typeof token === "string" && token.length > 0 && value.includes(token);
}

function baseInput() {
  return {
    eventId: EVENT_ID,
    productInterest: "Used Brand Shoes",
    eventSourceUrl: "https://www.realismthrift.com/contact-us",
    clientIpAddress: "203.0.113.10",
    clientUserAgent: "Mozilla/5.0",
    eventTimeSeconds: 1_700_000_000,
  };
}

describe("buildMetaCapiLeadEvent", () => {
  it("builds a Lead with the shared event id and non-PII custom data", () => {
    const event = buildMetaCapiLeadEvent(baseInput());

    expect(event).toEqual({
      event_name: "Lead",
      event_time: 1_700_000_000,
      event_id: EVENT_ID,
      action_source: "website",
      event_source_url: "https://www.realismthrift.com/contact-us",
      user_data: {
        client_ip_address: "203.0.113.10",
        client_user_agent: "Mozilla/5.0",
      },
      custom_data: metaLeadParams("Used Brand Shoes"),
    });
    expect(event.custom_data).toEqual({
      content_name: "wholesale_inquiry",
      content_category: "Used Brand Shoes",
    });
  });

  it("drops contact fields, query strings, and unsafe technical values", () => {
    const event = buildMetaCapiLeadEvent({
      eventId: `  ${EVENT_ID}  `,
      productInterest: "ada@example.com +1 555 0199",
      eventSourceUrl: "https://www.realismthrift.com/used-brand-shoes?email=ada@example.com&phone=+1%20555%200199#private",
      clientIpAddress: "ada@example.com",
      clientUserAgent: "Mozilla/5.0 ada@example.com",
      eventTimeSeconds: 1_700_000_000,
      ...({
        name: "Ada Buyer",
        email: "ada@example.com",
        phone: "+1 555 0199",
        whatsapp: "+1 555 0199",
        company: "Acme Co",
        country: "Nigeria",
        message: "please call me about a private order",
      } as object),
    });

    expect(event.event_id).toBe(EVENT_ID);
    expect(event.event_source_url).toBe("https://www.realismthrift.com/used-brand-shoes");
    expect(event.user_data).toEqual({});
    expect(event.custom_data).toEqual(metaLeadParams(undefined));
    const serialized = JSON.stringify(event);
    for (const secret of CONTACT_PII) {
      expect(serialized).not.toContain(secret);
    }
    expect(Object.keys(event.user_data)).toEqual([]);
    expect(event).not.toHaveProperty("email");
    expect(event).not.toHaveProperty("name");
    expect(event).not.toHaveProperty("whatsapp");
    expect(event).not.toHaveProperty("phone");
    expect(event).not.toHaveProperty("message");
    expect(event).not.toHaveProperty("company");
  });

  it("keeps a public IPv6 address and rejects non-http page URLs", () => {
    const event = buildMetaCapiLeadEvent({
      eventId: EVENT_ID,
      clientIpAddress: "2001:db8::10",
      eventSourceUrl: "javascript:alert(1)",
      eventTimeSeconds: 1_700_000_000,
    });

    expect(event.user_data).toEqual({ client_ip_address: "2001:db8::10" });
    expect(event.event_source_url).toBeUndefined();
  });

  it("drops credentials in the page URL", () => {
    const event = buildMetaCapiLeadEvent({
      eventId: EVENT_ID,
      eventSourceUrl: "https://user:secret@www.realismthrift.com/contact-us",
      eventTimeSeconds: 1_700_000_000,
    });
    expect(event.event_source_url).toBeUndefined();
  });
});

describe("sendMetaCapiLead", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not call fetch when the token is missing", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => {
      throw new Error("fetch should not run");
    });

    await expect(sendMetaCapiLead(baseInput(), {
      accessToken: "",
      pixelId: PRODUCTION_FB_PIXEL_ID,
      fetchImpl,
    })).resolves.toEqual({ status: "skipped", reason: "missing_token" });

    await expect(sendMetaCapiLead(baseInput(), {
      accessToken: "   ",
      pixelId: PRODUCTION_FB_PIXEL_ID,
      fetchImpl,
    })).resolves.toEqual({ status: "skipped", reason: "missing_token" });

    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("does not call fetch when the pixel id does not resolve", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => {
      throw new Error("fetch should not run");
    });

    await expect(sendMetaCapiLead(baseInput(), {
      accessToken: FAKE_TOKEN,
      pixelId: "not-a-pixel",
      fetchImpl,
    })).resolves.toEqual({ status: "skipped", reason: "missing_pixel" });

    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("does not call fetch when the event id is not a UUID", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => {
      throw new Error("fetch should not run");
    });

    await expect(sendMetaCapiLead({ ...baseInput(), eventId: "lead-1" }, {
      accessToken: FAKE_TOKEN,
      pixelId: PRODUCTION_FB_PIXEL_ID,
      fetchImpl,
    })).resolves.toEqual({ status: "skipped", reason: "invalid_event_id" });

    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("posts a Lead to Graph and keeps the token out of the URL", async () => {
    let liveTokenSeen = false;
    const captured: { url: string; body: string; redirect?: RequestRedirect }[] = [];
    const fetchImpl: typeof fetch = async (input, init) => {
      const url = String(input);
      const body = typeof init?.body === "string" ? init.body : "";
      if (containsLiveAccessToken(url) || containsLiveAccessToken(body)) {
        liveTokenSeen = true;
        return new Response("{}", { status: 599 });
      }
      captured.push({ url, body, redirect: init?.redirect });
      return new Response(JSON.stringify({ events_received: 1 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };

    const result = await sendMetaCapiLead(baseInput(), {
      accessToken: FAKE_TOKEN,
      pixelId: PRODUCTION_FB_PIXEL_ID,
      fetchImpl,
      now: () => new Date("2020-01-01T00:00:00.000Z"),
    });

    expect(liveTokenSeen).toBe(false);
    expect(result).toEqual({ status: "sent" });
    expect(captured).toHaveLength(1);
    expect(captured[0].url).toBe(metaCapiEventsUrl(PRODUCTION_FB_PIXEL_ID));
    expect(captured[0].url).not.toContain("access_token");
    expect(captured[0].url).not.toContain(FAKE_TOKEN);
    expect(captured[0].redirect).toBe("error");

    const parsed = JSON.parse(captured[0].body) as { data: MetaCapiLeadEvent[]; access_token: string };
    expect(parsed.access_token).toBe(FAKE_TOKEN);
    expect(parsed.data).toHaveLength(1);
    expect(JSON.stringify(parsed.data)).not.toContain(FAKE_TOKEN);
    expect(parsed.data[0]).toEqual(buildMetaCapiLeadEvent(baseInput()));
    for (const secret of CONTACT_PII) {
      expect(captured[0].body).not.toContain(secret);
    }
  });

  it("returns a soft failure when Graph rejects the event", async () => {
    const fetchImpl: typeof fetch = async () => new Response(JSON.stringify({
      error: { message: "Invalid parameter", code: 100 },
    }), { status: 400 });

    await expect(sendMetaCapiLead(baseInput(), {
      accessToken: FAKE_TOKEN,
      pixelId: PRODUCTION_FB_PIXEL_ID,
      fetchImpl,
    })).resolves.toEqual({ status: "failed", errorName: "HttpError", httpStatus: 400 });
  });

  it("returns a soft failure when the network call throws", async () => {
    const fetchImpl: typeof fetch = async () => {
      throw new TypeError("network down");
    };

    await expect(sendMetaCapiLead(baseInput(), {
      accessToken: FAKE_TOKEN,
      pixelId: PRODUCTION_FB_PIXEL_ID,
      fetchImpl,
    })).resolves.toEqual({ status: "failed", errorName: "TypeError" });
  });

  it("returns a soft failure when the Graph call times out", async () => {
    const fetchImpl: typeof fetch = (_input, init) => new Promise((_resolve, reject) => {
      const signal = init?.signal;
      if (!signal) {
        reject(new Error("missing abort signal"));
        return;
      }
      signal.addEventListener("abort", () => {
        const error = new Error("aborted");
        error.name = "TimeoutError";
        reject(error);
      });
    });

    await expect(sendMetaCapiLead(baseInput(), {
      accessToken: FAKE_TOKEN,
      pixelId: PRODUCTION_FB_PIXEL_ID,
      fetchImpl,
      timeoutMs: 20,
    })).resolves.toEqual({ status: "failed", errorName: "TimeoutError" });
  });
});
