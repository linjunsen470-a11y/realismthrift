import "./globals.css";
import { connection } from "next/server";
import { getClientMessages } from "@/lib/i18n/server";
import { GlobalNotFoundDocument } from "@/components/GlobalNotFoundDocument";
import { locales } from "@/lib/i18n/routing";

export const dynamic = "force-dynamic";

export default async function GlobalNotFound() {
  await connection();
  return (
    <GlobalNotFoundDocument
      copies={Object.fromEntries(
        locales.map((locale) => [locale, getClientMessages(locale, "status")]),
      )}
    />
  );
}
