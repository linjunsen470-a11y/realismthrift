import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const redirectTo = requestUrl.searchParams.get("redirect") || "/";
  let safeRedirect = "/";
  try {
    const target = new URL(redirectTo, requestUrl);
    if (redirectTo.startsWith("/") && !redirectTo.includes("\\") && target.origin === requestUrl.origin) {
      safeRedirect = target.href;
    }
  } catch {
    // Malformed URLs fall back to the home page.
  }

  const draftModeStore = await draftMode();
  draftModeStore.disable();

  redirect(safeRedirect);
}
