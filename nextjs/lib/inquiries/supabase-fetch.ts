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

async function postgrestAuthenticationRejection(response: Response): Promise<AuthenticationRejection | null> {
  if (response.status !== 401) return null;
  try {
    const body: unknown = await response.clone().json();
    if (!body || typeof body !== "object" || !("code" in body) || body.code !== "PGRST303") return null;
    return "message" in body && body.message === "JWT issued at future" ? "jwt_issued_in_future" : "other";
  } catch {
    return null;
  }
}

/**
 * PGRST303 is a PostgREST authentication rejection: the SQL operation did not
 * run. Retry that specific response only, including for the inquiry/claim RPCs.
 * Never replay a network error, timeout, generic 401, or ambiguous server error.
 */
export function createSupabaseAuthRetryFetch(fetchImpl: typeof fetch, wait: Wait = abortableWait): typeof fetch {
  return async (input, init) => {
    const request = new Request(input, init);
    if (!new URL(request.url).pathname.startsWith("/rest/v1/")) {
      return fetchImpl(request);
    }

    let retries = 0;
    let reason: AuthenticationRejection | null = null;
    for (;;) {
      const response = await fetchImpl(request.clone());
      const rejected = await postgrestAuthenticationRejection(response);
      if (rejected) reason = rejected;
      if (!rejected || retries === AUTH_RETRY_DELAYS_MS.length) {
        if (retries) {
          console.warn("Supabase PostgREST authentication retry", {
            providerCode: "PGRST303",
            reason,
            retries,
            outcome: response.ok ? "recovered" : "failed",
            status: response.status,
          });
        }
        return response;
      }

      // This response will not be returned; release its unread body before retrying.
      void response.body?.cancel().catch(() => {});
      await wait(AUTH_RETRY_DELAYS_MS[retries], request.signal);
      retries += 1;
    }
  };
}
