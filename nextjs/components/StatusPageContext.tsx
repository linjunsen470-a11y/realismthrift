"use client";

import { createContext, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n/routing";
import type { Messages } from "@/lib/i18n/translate";

// Error boundaries receive no locale props. Share only their small copy allowlist.
export const StatusPageContext = createContext<{
  locale: Locale;
  messages: Messages;
}>({
  locale: "en",
  messages: {},
});

export function StatusPageProvider({
  children,
  locale,
  messages,
}: {
  children: ReactNode;
  locale: Locale;
  messages: Messages;
}) {
  return (
    <StatusPageContext.Provider value={{ locale, messages }}>
      {children}
    </StatusPageContext.Provider>
  );
}
