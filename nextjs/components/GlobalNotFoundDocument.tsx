"use client";

import { usePathname } from "next/navigation";
import NotFoundPage from "./NotFoundPage";
import { StatusPageProvider } from "./StatusPageContext";
import { splitLocale } from "@/lib/i18n/routing";
import { createTranslator, type Messages } from "@/lib/i18n/translate";

export function GlobalNotFoundDocument({
  copies,
}: {
  copies: Record<string, Messages>;
}) {
  const { locale } = splitLocale(usePathname());
  const t = createTranslator(copies[locale]);
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className="antialiased bg-white text-[#333]">
        <title>{`${t("Page Not Found")} | RealismThrift`}</title>
        <StatusPageProvider locale={locale} messages={copies[locale] ?? {}}>
          <main id="main-content">
            <NotFoundPage />
          </main>
        </StatusPageProvider>
      </body>
    </html>
  );
}
