/* eslint-disable @next/next/no-head-element -- Shared App Router root shell owns the document head. */
import type { Metadata } from "next";
import localFont from "next/font/local";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import "@/app/globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SanityLive } from "@/lib/sanity/live";
import Analytics, { MetaPixelHead } from "@/components/Analytics";
import SiteChrome from "@/components/SiteChrome";
import { StatusPageProvider } from "@/components/StatusPageContext";
import { siteHeader, siteFooter } from "@/data/siteData";
import { siteUrl } from "@/lib/metadata";
import {
  getClientMessages,
  getLocalizedData,
  getTranslator,
} from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/routing";

// Bundled fonts keep builds independent of Google Fonts response formats/availability.
const montserrat = localFont({
  src: "../app/fonts/Montserrat.woff2",
  variable: "--font-montserrat",
  weight: "700 900",
  style: "normal",
  display: "swap",
});

const openSans = localFont({
  src: "../app/fonts/OpenSans.woff2",
  variable: "--font-open-sans",
  weight: "400 700",
  style: "normal",
  display: "swap",
});

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RealismThrift | Used Clothes, Shoes & Bags Supplier in China",
    template: "%s | RealismThrift",
  },
  description:
    "Wholesale supplier of sorted second-hand clothes, shoes and bags from China. Export support for used fashion buyers worldwide.",
  authors: [{ name: "RealismThrift" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.realismthrift.com",
    siteName: "RealismThrift Export",
    title:
      "Dongguan Huihe Realismthrift Trading Co., Ltd. | Used Clothes, Shoes & Bags Supplier in China",
    description:
      "Wholesale supplier of sorted second-hand clothes, shoes and bags from China. Export support for used fashion buyers worldwide.",
    images: [
      {
        url: "/img/og-realismthrift.webp",
        width: 1200,
        height: 630,
        alt: "RealismThrift wholesale second hand fashion warehouse",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Dongguan Huihe Realismthrift Trading Co., Ltd. | Used Clothes, Shoes & Bags Supplier in China",
    description:
      "Wholesale supplier of sorted second-hand clothes, shoes and bags from China. Export support for used fashion buyers worldwide.",
    images: ["/img/og-realismthrift.webp"],
  },
  icons: {
    icon: "/img/logo.webp",
    shortcut: "/img/logo.webp",
    apple: "/img/logo.webp",
  },
  verification: {
    other: {
      "facebook-domain-verification": ["sfeva1yjqtp74l34zrf0b68l4vzb6p"],
    },
  },
};

export default async function RootShell({
  children,
  locale = "en",
}: {
  children: React.ReactNode;
  locale?: Locale;
}) {
  const t = getTranslator(locale);
  const { isEnabled: isDraftModeEnabled } = await draftMode();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${montserrat.variable} ${openSans.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        <MetaPixelHead />
      </head>
      <body className="antialiased font-sans bg-white text-[#333]">
        <a className="rt-skip-link" href="#main-content">
          {t("Skip to main content")}
        </a>
        <Analytics />
        <StatusPageProvider
          locale={locale}
          messages={getClientMessages(locale, "status")}
        >
          <SiteChrome
            header={
              <SiteHeader
                locale={locale}
                data={getLocalizedData(siteHeader, locale)}
              />
            }
            footer={
              <SiteFooter
                locale={locale}
                data={getLocalizedData(siteFooter, locale)}
              />
            }
            editing={
              isDraftModeEnabled ? (
                <>
                  <VisualEditing />
                  <SanityLive
                    refreshOnMount={false}
                    refreshOnFocus={false}
                    refreshOnReconnect={false}
                  />
                </>
              ) : null
            }
          >
            {children}
          </SiteChrome>
        </StatusPageProvider>
      </body>
    </html>
  );
}
