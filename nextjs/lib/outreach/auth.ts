import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { AuthInfo } from "@modelcontextprotocol/server";
import { OutreachError, outreachOrigin, requiredSetting } from "./config";

export const mcpResource = () => `${outreachOrigin()}/api/mcp`;
export const mcpAuthOptions = () => ({
  required: true,
  // mcp-handler concatenates this URL with resourceMetadataPath, so pass the origin.
  resourceUrl: outreachOrigin(),
  resourceMetadataPath: "/.well-known/oauth-protected-resource",
});
export const authIssuer = () => `${requiredSetting("SUPABASE_URL").replace(/\/$/, "")}/auth/v1`;
let jwks: ReturnType<typeof createRemoteJWKSet> | undefined;

export async function verifyMcpToken(_request: Request, token?: string): Promise<AuthInfo | undefined> {
  if (!token) return undefined;
  try {
    jwks ??= createRemoteJWKSet(new URL(`${authIssuer()}/.well-known/jwks.json`));
    // Supabase OAuth access tokens use aud=authenticated. The pinned client_id and operator
    // distinguish this integration from ordinary Supabase sessions and other OAuth apps.
    const { payload } = await jwtVerify(token, jwks, { issuer: authIssuer(), audience: "authenticated", algorithms: ["ES256", "RS256"], requiredClaims: ["sub", "exp", "iat", "client_id"] });
    if (payload.sub !== requiredSetting("OUTREACH_OPERATOR_USER_ID") || payload.client_id !== requiredSetting("OUTREACH_OAUTH_CLIENT_ID")) return undefined;
    return { token, clientId: payload.client_id as string, scopes: typeof payload.scope === "string" ? payload.scope.split(" ") : [], extra: { userId: payload.sub } };
  } catch { return undefined; }
}

export async function operatorAuthClient() {
  const store = await cookies();
  return createServerClient(requiredSetting("SUPABASE_URL"), requiredSetting("SUPABASE_PUBLISHABLE_KEY"), {
    cookieOptions: { httpOnly: true, sameSite: "lax", secure: outreachOrigin().startsWith("https:") },
    cookies: {
      getAll: () => store.getAll(),
      setAll(values) {
        try { values.forEach(({ name, value, options }) => store.set(name, value, options)); }
        catch { /* Server Component cannot persist refreshed cookies; route handlers do. */ }
      },
    },
  });
}
export async function requireOperator() {
  const client = await operatorAuthClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user || user.id !== requiredSetting("OUTREACH_OPERATOR_USER_ID")) throw new OutreachError("operator_required", 403);
  return client;
}

export function validAuthorizationId(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{1,200}$/.test(value);
}
