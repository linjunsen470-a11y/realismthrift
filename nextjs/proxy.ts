import { NextRequest, NextResponse } from "next/server";
import { preferredLanguage } from "@/lib/i18n/detection";
import {
  LANGUAGE_PREFERENCE_COOKIE,
  LANGUAGE_SESSION_COOKIE,
} from "@/lib/i18n/preference";
import { localePath, localizedPaths, splitLocale } from "@/lib/i18n/routing";

function isDocumentNavigation(request: NextRequest) {
  return (
    request.method === "GET" &&
    request.headers.get("sec-fetch-mode") === "navigate" &&
    request.headers.get("sec-fetch-dest") === "document" &&
    !/prefetch/i.test(request.headers.get("purpose") ?? "") &&
    !/prefetch/i.test(request.headers.get("sec-purpose") ?? "")
  );
}

function rememberSession(response: NextResponse, request: NextRequest) {
  response.cookies.set(LANGUAGE_SESSION_COOKIE, "1", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
  });
  // This response varies by visitor; never let a CDN replay its cookie or redirect.
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("CDN-Cache-Control", "no-store");
  response.headers.set("Vercel-CDN-Cache-Control", "no-store");
  return response;
}

export function proxy(request: NextRequest) {
  if (
    process.env.AUTO_LOCALE_DETECTION_ENABLED === "false" ||
    !isDocumentNavigation(request) ||
    request.cookies.get(LANGUAGE_SESSION_COOKIE)?.value === "1"
  ) return NextResponse.next();

  const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";
  const { locale, path } = splitLocale(pathname);
  const isCorePage = localizedPaths.includes(path as (typeof localizedPaths)[number]);

  // English-only entry pages mark the session without changing their content.
  if (pathname === "/blog" || pathname === "/search") {
    return rememberSession(NextResponse.next(), request);
  }
  if (!isCorePage) return NextResponse.next();

  // A published language URL is an explicit choice and is never redirected.
  if (locale !== "en") return rememberSession(NextResponse.next(), request);

  // In-site links (including a manual switch to English) remain usable even
  // when the browser refuses cookies. Entry from the apex domain is same-site.
  const site = request.headers.get("sec-fetch-site");
  if (site !== "none" && site !== "cross-site" && site !== "same-site") {
    return NextResponse.next();
  }

  const selected = preferredLanguage({
    preference: request.cookies.get(LANGUAGE_PREFERENCE_COOKIE)?.value,
    acceptLanguage: request.headers.get("accept-language"),
    country: request.headers.get("x-vercel-ip-country"),
  });
  if (selected === "en") return rememberSession(NextResponse.next(), request);

  const destination = request.nextUrl.clone();
  destination.pathname = localePath(path, selected);
  return rememberSession(NextResponse.redirect(destination, 307), request);
}

// Match only published core routes and the two English-only entry pages.
export const config = {
  matcher: [
    "/",
    "/used-brand-clothes",
    "/used-brand-shoes",
    "/used-brand-bag",
    "/about-us",
    "/how-to-order",
    "/faq",
    "/contact-us",
    "/privacy-policy",
    "/terms-of-service",
    "/blog",
    "/search",
    "/es/:path*",
    "/fr/:path*",
    "/ar/:path*",
    "/vi/:path*",
    "/id/:path*",
  ],
};
