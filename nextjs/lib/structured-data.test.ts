import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "./structured-data";

describe("JSON-LD embedded in HTML", () => {
  it("preserves CMS text without allowing it to close the script tag", () => {
    const data = { headline: '</script><script>alert("x")</script>', description: 'A < B & "C"' };
    const serialized = serializeJsonLd(data);
    expect(serialized).not.toContain("<");
    expect(JSON.parse(serialized)).toEqual(data);
  });
});
