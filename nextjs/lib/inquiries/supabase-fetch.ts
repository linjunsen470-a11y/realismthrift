const AUTH_RETRY_DELAYS_MS = [250, 750, 1500, 2500] as const;

type Wait = (milliseconds: number, signal: AbortSignal) => Promise<void>;

function abortableWait(milliseconds: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }

    const timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, milliseconds);
    function onAbort() {
      clearTimeout(timer);
      reject(signal.reason);
    }
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

type AuthenticationRejection = "jwt_issued_in_future" | "other";

async function readAuthenticationError(response: Response): Promise<Record<string, unknown> | null> {
  if (response.status !== 401) return null;
  try {
    const body: unknown = await response.clone().json();
    return body && typeof body === "object" ? body as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

type ServiceRoleFallback = { origin: string; secretKey: string; serviceRoleKey: string };

function reportRetry(response: Response, reason: AuthenticationRejection | null, delays: number, usedServiceRole: boolean) {
  console.warn("Supabase PostgREST authentication retry", {
    providerCode: "PGRST303",
    reason,
    retries: delays + Number(usedServiceRole),
    outcome: response.ok ? "recovered" : "failed",
    status: response.status,
    usedServiceRoleFallback: usedServiceRole,
  });
  return response;
}

/**
 * PGRST303 is a PostgREST authentication rejection: the SQL operation did not
 * run. A project-issued service_role JWT has a fixed issuance time and can
 * recover an iat rejection while the platform's clock fix rolls out.
 * Never replay a network error, timeout, generic 401, or ambiguous server error.
 */
export function createSupabaseAuthRetryFetch(
  fetchImpl: typeof fetch,
  wait: Wait = abortableWait,
  serviceRoleFallback?: ServiceRoleFallback,
): typeof fetch {
  return async (input, init) => {
    const request = new Request(input, init);
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/rest/v1/")) {
      return fetchImpl(request);
    }

    let delays = 0;
    let usedServiceRole = false;
    let reason: AuthenticationRejection | null = null;
    for (;;) {
      const response = await fetchImpl(request.clone());
      const error = await readAuthenticationError(response);
      if (error?.code !== "PGRST303") {
        return delays || usedServiceRole ? reportRetry(response, reason, delays, usedServiceRole) : response;
      }
      reason = error.message === "JWT issued at future" ? "jwt_issued_in_future" : "other";

      if (
        reason === "jwt_issued_in_future" && !usedServiceRole &&
        serviceRoleFallback?.origin === url.origin &&
        serviceRoleFallback.serviceRoleKey !== serviceRoleFallback.secretKey &&
        request.headers.get("apikey") === serviceRoleFallback.secretKey &&
        request.headers.get("authorization") === `Bearer ${serviceRoleFallback.secretKey}`
      ) {
        usedServiceRole = true;
        const alternate = request.clone();
        alternate.headers.set("apikey", serviceRoleFallback.serviceRoleKey);
        alternate.headers.set("authorization", `Bearer ${serviceRoleFallback.serviceRoleKey}`);
        const result = await fetchImpl(new Request(alternate, { redirect: "error" }));
        const rejection = await readAuthenticationError(result);
        const credentialRejected =
          rejection?.code === "PGRST301" || rejection?.code === "PGRST303" || rejection?.message === "Invalid API key";
        if (!credentialRejected) {
          void response.body?.cancel().catch(() => {});
          return reportRetry(result, reason, delays, usedServiceRole);
        }
        void result.body?.cancel().catch(() => {});
      }

      if (delays === AUTH_RETRY_DELAYS_MS.length) {
        return reportRetry(response, reason, delays, usedServiceRole);
      }

      // This response will not be returned; release its unread body before retrying.
      void response.body?.cancel().catch(() => {});
      await wait(AUTH_RETRY_DELAYS_MS[delays], request.signal);
      delays += 1;
    }
  };
}
