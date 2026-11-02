import { Fragment, type ReactNode } from "react";
import { getTranslator } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/routing";

/** Translate a complete sentence while letting each language position its links and emphasis. */
export function TranslatedText({
  locale,
  text,
  values,
}: {
  locale: Locale;
  text: string;
  values: Record<string, ReactNode>;
}) {
  return getTranslator(locale)(text)
    .split(/(\{\w+\})/g)
    .map((part, index) => (
      <Fragment key={index}>
        {part.startsWith("{") ? (values[part.slice(1, -1)] ?? part) : part}
      </Fragment>
    ));
}
