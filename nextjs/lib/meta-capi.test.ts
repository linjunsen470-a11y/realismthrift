import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildMetaCapiLeadEvent,
  hashMetaEmail,
  hashMetaPhone,
  metaCapiEventsUrl,
  metaCapiCookies,
  sendMetaCapiLead,
  type MetaCapiLeadEvent,
} from "./meta-capi";
import { metaLeadParams, PRODUCTION_FB_PIXEL_ID } from "./meta-pixel";

const EVENT_ID = "6f1e2c3a-4b5d-4e6f-8a7b-9c0d1e2f3a4b";
const FAKE_TOKEN = "test-capi-token";
const EXAMPLE_PHONE_HASH = "e323ec626319ca94ee8bff2e4c87cf613be6ea19919ed1364124e16807ab3176";

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
  it("accepts only phone hashes and omits ph when the phone is unusable", () => {
    const event = buildMetaCapiLeadEvent({ ...baseInput(), phoneHash: hashMetaPhone("+1 (650) 555-1212") });
    expect(event.user_data.ph).toEqual([EXAMPLE_PHONE_HASH]);
    expect(event.custom_data).not.toHaveProperty("ph");
    for (const phoneHash of [undefined, "+16505551212", "x".repeat(64), ""]) {
      expect(buildMetaCapiLeadEvent({ ...baseInput(), phoneHash }).user_data).not.toHaveProperty("ph");
    }
  });
  it("normalizes an email using Meta's published SHA-256 example and accepts only the hash", () => {
    const hash = hashMetaEmail("  John_Smith@GMAIL.COM  ");
    expect(hash).toBe("62a14e44f765419d10fea99367361a727c12365e2520f32218d505ed9aa0f62f");
    const event = buildMetaCapiLeadEvent({ ...baseInput(), emailHash: hash });
    expect(event.user_data.em).toEqual([hash]);
    expect(JSON.stringify(event)).not.toContain("gmail.com");
    expect(event.custom_data).not.toHaveProperty("em");
    for (const invalid of ["john@example.com", "x".repeat(64), "123"]) {
      expect(buildMetaCapiLeadEvent({ ...baseInput(), emailHash: invalid }).user_data).not.toHaveProperty("em");
    }
  });
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

describe("hashMetaPhone", () => {
  it("normalizes explicit international formats to Meta's published SHA-256 example", () => {
    for (const phone of ["+16505551212", "  +1 (650) 555-1212  ", "0016505551212", "00 1 650 555 1212"]) {
      expect(hashMetaPhone(phone)).toBe(EXAMPLE_PHONE_HASH);
    }
  });
  it("preserves significant national zeros", () => {
    // Italy's leading national zero remains part of the international number.
    expect(hashMetaPhone("+39 06 6988 3229")).toBe("7539878d470b756eeecf24d0830f65d976bf89bc19226fadfa8e13a1ab346b3c");
  });
  it("omits missing country codes, invalid numbering plans, extensions, and multiple numbers", () => {
    for (const phone of ["", "08031234567", "8613800138000", "+999123456789", "+11234567890", "+12", "+165055512123456789",
      "Call +16505551212", "+16505551212 ext 123", "+16505551212;ext=123", "+16505551212 / +442079460958"]) {
      expect(hashMetaPhone(phone), phone).toBeUndefined();
    }
  });
});

describe("sendMetaCapiLead", () => {
  beforeEach(() => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_ENABLED", "true");
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("serializes only email and phone hashes into their matching fields", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response('{"events_received":1}'));
    const emailHash = hashMetaEmail(" Ada@Example.com ");
    await sendMetaCapiLead({ ...baseInput(), emailHash, phoneHash: hashMetaPhone("+1 (650) 555-1212") }, { accessToken: FAKE_TOKEN, fetchImpl });
    const body = String(fetchImpl.mock.calls[0][1]?.body);
    expect(JSON.parse(body).data[0].user_data.em).toEqual([emailHash]);
    expect(JSON.parse(body).data[0].user_data.ph).toEqual([EXAMPLE_PHONE_HASH]);
    expect(body.toLowerCase()).not.toContain("ada@example.com");
    expect(body).not.toContain("16505551212");
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
    })).resolves.toEqual({ status: "failed", errorName: "HttpError", httpStatus: 400, errorCode: 100 });
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

describe("Meta matching cookies", () => {
  it("reads only existing, valid cookies and forwards their raw values", () => {
    const fbp = "fb.1.1700000000000.123456";
    const fbc = "fb.1.1700000000000.Real-Ad_Click";
    const cookies = metaCapiCookies(`session=private; _fbp=${fbp}; _fbc=${fbc}`);
    expect(cookies).toEqual({ fbp, fbc });
    expect(buildMetaCapiLeadEvent({ ...baseInput(), ...cookies }).user_data).toMatchObject({ fbp, fbc });
    expect(metaCapiCookies(null)).toEqual({});
    expect(metaCapiCookies(`_fbp=${fbp}`)).toEqual({ fbp });
  });
  it("drops malformed values, contact text, and oversized cookies", () => {
    for (const value of ["buyer@example.com", "fb.1.123.bad", "fb.1.1700000000000.bad value", "x".repeat(1201)]) {
      expect(metaCapiCookies(`_fbp=${value}; _fbc=${value}`)).toEqual({});
    }
    expect(buildMetaCapiLeadEvent({ ...baseInput(), fbp: "invalid", fbc: "buyer@example.com" }).user_data).not.toHaveProperty("fbc");
  });
});

describe("CAPI delivery safeguards", () => {
  beforeEach(() => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_ENABLED", "true");
  });
  afterEach(() => vi.unstubAllEnvs());
  const options = (fetchImpl: typeof fetch) => ({ accessToken: FAKE_TOKEN, fetchImpl });

  it("stops all server transport when disabled or outside production", async () => {
    const fetchImpl = vi.fn<typeof fetch>();
    for (const env of ["preview", "development", ""]) {
      vi.stubEnv("VERCEL_ENV", env);
      expect(await sendMetaCapiLead(baseInput(), options(fetchImpl))).toEqual({ status: "skipped", reason: "disabled" });
    }
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_ENABLED", "false");
    expect(await sendMetaCapiLead(baseInput(), options(fetchImpl))).toEqual({ status: "skipped", reason: "disabled" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });
  it("retries a temporary failure once with an identical event id, time, and payload", async () => {
    const fetchImpl = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(new Response("{}", { status: 503 }))
      .mockResolvedValueOnce(new Response('{"events_received":1}'));
    expect(await sendMetaCapiLead(baseInput(), options(fetchImpl))).toEqual({ status: "sent" });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(fetchImpl.mock.calls[0][1]?.body).toBe(fetchImpl.mock.calls[1][1]?.body);
  });
  it("retries a network timeout once", async () => {
    const fetchImpl = vi.fn<typeof fetch>()
      .mockRejectedValueOnce(new DOMException("timeout", "TimeoutError"))
      .mockResolvedValueOnce(new Response('{"events_received":1}'));
    expect(await sendMetaCapiLead(baseInput(), options(fetchImpl))).toEqual({ status: "sent" });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });
  it("caps temporary failures at two attempts", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockImplementation(async () => new Response("{}", { status: 502 }));
    expect(await sendMetaCapiLead(baseInput(), options(fetchImpl))).toMatchObject({ status: "failed", httpStatus: 502 });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });
  it("retries an interrupted response body", async () => {
    const interrupted = new Response("{}");
    vi.spyOn(interrupted, "json").mockRejectedValue(new TypeError("terminated"));
    const fetchImpl = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(interrupted)
      .mockResolvedValueOnce(new Response('{"events_received":1}'));
    expect(await sendMetaCapiLead(baseInput(), options(fetchImpl))).toEqual({ status: "sent" });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });
  it("retries a short 429 once", async () => {
    const fetchImpl = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(new Response("{}", { status: 429, headers: { "Retry-After": "0" } }))
      .mockResolvedValueOnce(new Response('{"events_received":1}'));
    expect(await sendMetaCapiLead(baseInput(), options(fetchImpl))).toEqual({ status: "sent" });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });
  it("honors throttling backoff without exceeding the request budget", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response("{}", { status: 429, headers: { "Retry-After": "30" } }));
    expect(await sendMetaCapiLead(baseInput(), { ...options(fetchImpl), timeoutMs: 1000 })).toMatchObject({ status: "failed", httpStatus: 429 });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
  it("does not retry parameter or token errors and returns safe diagnostic fields only", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockImplementation(async () => new Response(JSON.stringify({
      error: { code: 190, fbtrace_id: "Safe_trace-123", message: "secret payload" },
    }), { status: 400 }));
    expect(await sendMetaCapiLead(baseInput(), options(fetchImpl))).toEqual({
      status: "failed", errorName: "HttpError", httpStatus: 400, errorCode: 190, traceId: "Safe_trace-123",
    });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
  it("rejects zero accepted events and malformed successful responses", async () => {
    for (const body of ['{"events_received":0}', "{}", "null", "not json"]) {
      const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response(body));
      expect(await sendMetaCapiLead(baseInput(), options(fetchImpl))).toEqual({ status: "failed", errorName: "InvalidResponse", httpStatus: 200 });
      expect(fetchImpl).toHaveBeenCalledTimes(1);
    }
  });
});
