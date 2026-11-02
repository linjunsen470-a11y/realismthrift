import { notFound } from "next/navigation";
import { isLocale, localizedPaths } from "@/lib/i18n/routing";
import Home, { getPageMetadata as homeMetadata } from "@/components/pages/home";
import About, {
  getPageMetadata as aboutMetadata,
} from "@/components/pages/about-us";
import Clothes, {
  getPageMetadata as clothesMetadata,
} from "@/components/pages/used-brand-clothes";
import Shoes, {
  getPageMetadata as shoesMetadata,
} from "@/components/pages/used-brand-shoes";
import Bags, {
  getPageMetadata as bagsMetadata,
} from "@/components/pages/used-brand-bag";
import Order, {
  getPageMetadata as orderMetadata,
} from "@/components/pages/how-to-order";
import Faq, { getPageMetadata as faqMetadata } from "@/components/pages/faq";
import Contact, {
  getPageMetadata as contactMetadata,
} from "@/components/pages/contact-us";
import Privacy, {
  getPageMetadata as privacyMetadata,
} from "@/components/pages/privacy-policy";
import Terms, {
  getPageMetadata as termsMetadata,
} from "@/components/pages/terms-of-service";

const pages = {
  "/": { Component: Home, metadata: homeMetadata },
  "/about-us": { Component: About, metadata: aboutMetadata },
  "/used-brand-clothes": { Component: Clothes, metadata: clothesMetadata },
  "/used-brand-shoes": { Component: Shoes, metadata: shoesMetadata },
  "/used-brand-bag": { Component: Bags, metadata: bagsMetadata },
  "/how-to-order": { Component: Order, metadata: orderMetadata },
  "/faq": { Component: Faq, metadata: faqMetadata },
  "/contact-us": { Component: Contact, metadata: contactMetadata },
  "/privacy-policy": { Component: Privacy, metadata: privacyMetadata },
  "/terms-of-service": { Component: Terms, metadata: termsMetadata },
};

type Props = { params: Promise<{ locale: string; slug?: string[] }> };
function resolve({ locale, slug = [] }: Awaited<Props["params"]>) {
  const path = `/${slug.join("/")}`;
  if (!isLocale(locale) || locale === "en" || !(path in pages)) notFound();
  return { locale, page: pages[path as keyof typeof pages] };
}

export const revalidate = 300;
export const dynamicParams = false;
export function generateStaticParams() {
  return localizedPaths.map((path) => ({
    slug: path === "/" ? [] : path.slice(1).split("/"),
  }));
}
export async function generateMetadata({ params }: Props) {
  const { locale, page } = resolve(await params);
  return page.metadata(locale);
}
export default async function LocalizedPage({ params }: Props) {
  const {
    locale,
    page: { Component },
  } = resolve(await params);
  return <Component locale={locale} />;
}
