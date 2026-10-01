import { NextResponse } from "next/server";
import { logOutreachError, OutreachError } from "./config";

export function preferenceResponse(value: unknown, status = 200) {
  return NextResponse.json(value, { status, headers: { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow" } });
}
export function preferenceError(operation: string, error: unknown) {
  if (error instanceof OutreachError && error.status < 500) return preferenceResponse({ code: error.code }, error.status);
  logOutreachError(operation, error);
  return preferenceResponse({ code: "service_unavailable" }, 503);
}

export async function limitedRequestText(request: Request, limit: number) {
  const reader = request.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const part = await reader.read();
    if (part.done) break;
    size += part.value.byteLength;
    if (size > limit) { await reader.cancel(); throw new OutreachError("invalid_request", 413); }
    chunks.push(part.value);
  }
  return Buffer.concat(chunks).toString("utf8");
}
