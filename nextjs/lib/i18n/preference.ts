import type { Locale } from "./routing";

export const LANGUAGE_PREFERENCE_COOKIE = "rt_language_preference";
export const LANGUAGE_SESSION_COOKIE = "rt_language_session";
export const LANGUAGE_PREFERENCE_MAX_AGE = 60 * 60 * 24 * 365;

/** Remember an explicit selection without changing the ordinary language links. */
export function saveLanguagePreference(locale: Locale) {
  try {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${LANGUAGE_PREFERENCE_COOKIE}=${locale}; Path=/; Max-Age=${LANGUAGE_PREFERENCE_MAX_AGE}; SameSite=Lax${secure}`;
  } catch {
    // Navigation must continue when the browser refuses cookie access.
  }
}
