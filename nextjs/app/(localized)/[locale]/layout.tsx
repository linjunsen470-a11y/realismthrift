import { notFound } from "next/navigation";
import RootShell, { baseMetadata } from "@/components/RootShell";
import { isLocale, translatedLocales } from "@/lib/i18n/routing";

export const metadata = baseMetadata;
export const dynamicParams = false;
export function generateStaticParams() {
  return translatedLocales.map((locale) => ({ locale }));
}

export default async function LocalizedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();
  return <RootShell locale={locale}>{children}</RootShell>;
}
