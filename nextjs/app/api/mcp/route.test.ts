import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";

vi.mock("@/lib/outreach/auth", () => ({
  verifyMcpToken: vi.fn(async (_request: Request, token?: string) => token === "operator-test" ? { token, clientId: "test-client", scopes: [] } : undefined),
  mcpAuthOptions: () => ({ required: true, resourceUrl: "https://www.realismthrift.com", resourceMetadataPath: "/.well-known/oauth-protected-resource" }),
}));

async function rpc(method: string, params: unknown, authorized = true) {
  return POST(new Request("https://www.realismthrift.com/api/mcp", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream", ...(authorized ? { Authorization: "Bearer operator-test" } : {}) },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  }));
}

describe("cold email MCP discovery", () => {
  it("advertises all nine tools through the actual HTTP handler with their input contracts", async () => {
    const response = await rpc("tools/list", {});
    expect(response.status).toBe(200);
    const body = await response.text();
    const payload = JSON.parse(body.startsWith("event:") ? body.split("\n").find(line => line.startsWith("data: "))!.slice(6) : body);
    const tools = payload.result.tools as { name: string; inputSchema: { required?: string[] }; description: string; annotations: { readOnlyHint: boolean } }[];
    expect(tools.map(tool => tool.name).sort()).toEqual([
      "lookup_cold_email_contact", "register_cold_email_contact", "get_cold_email_history",
      "get_pending_cold_email_inbound", "record_cold_email_inbound", "create_cold_email_draft",
      "review_outreach_draft", "send_approved_outreach", "reconcile_outreach_send",
    ].sort());
    expect(tools.find(tool => tool.name === "record_cold_email_inbound")).toMatchObject({
      inputSchema: { required: ["contact_id", "gmail_message_id", "classification", "note"] }, annotations: { readOnlyHint: false },
    });
    expect(tools.find(tool => tool.name === "lookup_cold_email_contact")?.description).toContain("No manual eligibility");
  });
  it("keeps anonymous tool discovery protected by OAuth", async () => {
    expect((await rpc("tools/list", {}, false)).status).toBe(401);
  });
});
