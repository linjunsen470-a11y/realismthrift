import { beforeEach, expect, it, vi } from "vitest";
import { GET } from "./route";

const mocks = vi.hoisted(() => ({ disable: vi.fn(), redirect: vi.fn() }));
vi.mock("next/headers", () => ({ draftMode: async () => ({ disable: mocks.disable }) }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
beforeEach(() => vi.clearAllMocks());

it.each(["//example.net", "/\\example.net", "/\t/example.net", "https://example.net", "//[invalid"])(
  "rejects an external or invalid redirect: %s", async value => {
    await GET(new Request(`https://www.realismthrift.com/api/draft-mode/disable?redirect=${encodeURIComponent(value)}`));
    expect(mocks.redirect).toHaveBeenCalledWith("/");
    expect(mocks.disable).toHaveBeenCalledOnce();
  },
);

it("preserves a local path, query and fragment", async () => {
  await GET(new Request("https://www.realismthrift.com/api/draft-mode/disable?redirect=" + encodeURIComponent("/blog?page=2#posts")));
  expect(mocks.redirect).toHaveBeenCalledWith("https://www.realismthrift.com/blog?page=2#posts");
});

it("keeps normalized double-slash paths on the same origin", async () => {
  await GET(new Request("https://www.realismthrift.com/api/draft-mode/disable?redirect=" + encodeURIComponent("/.//example.net")));
  expect(mocks.redirect).toHaveBeenCalledWith("https://www.realismthrift.com//example.net");
});
