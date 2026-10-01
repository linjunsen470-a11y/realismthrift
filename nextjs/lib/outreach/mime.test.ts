import { generateKeyPairSync, createHash, verify } from "node:crypto";
import { describe, expect, it, afterEach, vi } from "vitest";
import { addOutreachHeaders, mimeFingerprint, reviewMime, splitMime, unsubscribeFooter } from "./mime";
import { newPreferenceToken } from "./tokens";
import { encryptCredential, decryptCredential } from "./gmail";

afterEach(() => vi.unstubAllEnvs());
function message(body: string, extra = "") {
  return Buffer.from(`From: Jason <jason@realismthriftglobal.com>\r\nTo: buyer@example.com\r\nSubject: Wholesale clothes\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=utf-8\r\n${extra}\r\n${body}`);
}
describe("approved MIME", () => {
  it("checks recipient identity and the reviewed footer", async () => {
    const footer = unsubscribeFooter(newPreferenceToken());
    expect((await reviewMime(message(`Hello\r\n${footer}`), "buyer@example.com", footer)).to).toBe("buyer@example.com");
    await expect(reviewMime(message("Hello"), "buyer@example.com", footer)).rejects.toMatchObject({ code: "unsubscribe_footer_missing" });
    await expect(reviewMime(message(`Hello\r\n${footer}`), "other@example.com", footer)).rejects.toMatchObject({ code: "recipient_or_sender_changed" });
  });
  it("rejects CC and duplicate From headers", async () => {
    await expect(reviewMime(message("Hello", "Cc: another@example.com\r\n"), "buyer@example.com", null)).rejects.toMatchObject({ code: "single_recipient_required" });
    await expect(reviewMime(message("Hello", "From: another@example.com\r\n"), "buyer@example.com", null)).rejects.toMatchObject({ code: "ambiguous_headers" });
  });
  it("replaces list headers without changing approved body bytes", async () => {
    vi.stubEnv("OUTREACH_DKIM_MODE", "google");
    const raw = message("Hello\r\nUTF-8: 衣服\r\n", "List-Unsubscribe: <https://wrong.example/>\r\nList-Unsubscribe-Post: wrong\r\n");
    const signed = await addOutreachHeaders(raw, "outreach-test", newPreferenceToken());
    expect(splitMime(signed).body.equals(splitMime(raw).body)).toBe(true);
    expect(signed.toString().match(/List-Unsubscribe:/g)).toHaveLength(1);
    expect(signed.toString()).toContain("List-Unsubscribe-Post: List-Unsubscribe=One-Click");
    expect(mimeFingerprint(signed)).not.toBe(mimeFingerprint(raw));
  });
  it("creates a verifiable DKIM signature covering both unsubscribe headers", async () => {
    const keys = generateKeyPairSync("rsa", { modulusLength: 2048 });
    vi.stubEnv("OUTREACH_DKIM_MODE", "own");
    vi.stubEnv("OUTREACH_DKIM_PRIVATE_KEY", keys.privateKey.export({ type: "pkcs8", format: "pem" }).toString());
    const signed = await addOutreachHeaders(message("Hello\r\n"), "test-id", newPreferenceToken());
    const { fields, body } = splitMime(signed);
    const signature = fields.find(field => /^DKIM-Signature:/i.test(field))!;
    const tags = Object.fromEntries(signature.replace(/^DKIM-Signature:/i, "").split(";").map(field => field.trim().split(/=([\s\S]*)/).slice(0, 2)));
    const headers = tags.h.replace(/\s/g, "").split(":");
    expect(headers).toContain("list-unsubscribe");
    expect(headers).toContain("list-unsubscribe-post");
    function relaxedHeader(value: string) { const colon = value.indexOf(":"); return `${value.slice(0, colon).toLowerCase()}:${value.slice(colon + 1).replace(/\r\n[ \t]+/g, " ").replace(/[ \t]+/g, " ").trim()}`; }
    const canonical = headers.map((name: string) => relaxedHeader(fields.filter(field => field.slice(0, field.indexOf(":")).toLowerCase() === name).at(-1)!)).join("\r\n") + "\r\n" + relaxedHeader(signature.replace(/\bb=[\s\S]*$/, "b="));
    expect(verify("RSA-SHA256", Buffer.from(canonical), keys.publicKey, Buffer.from(tags.b.replace(/\s/g, ""), "base64"))).toBe(true);
    const bodyCanonical = body.toString().replace(/[ \t]+\r\n/g, "\r\n").replace(/[ \t]+/g, " ").replace(/(\r\n)*$/, "\r\n");
    expect(createHash("sha256").update(bodyCanonical).digest("base64")).toBe(tags.bh);
    expect(splitMime(signed).body.toString()).toBe("Hello\r\n");
  });
  it("encrypts refresh credentials and rejects modified ciphertext", () => {
    vi.stubEnv("OUTREACH_CREDENTIAL_KEY", Buffer.alloc(32, 42).toString("base64"));
    const ciphertext = encryptCredential("private-refresh-token");
    expect(ciphertext).not.toContain("private-refresh-token");
    expect(decryptCredential(ciphertext)).toBe("private-refresh-token");
    const modified = Buffer.from(ciphertext, "base64"); modified[15] ^= 1;
    expect(() => decryptCredential(modified.toString("base64"))).toThrow();
  });
});
