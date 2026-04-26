import type { Metadata } from 'next';
import { Montserrat, Open_Sans } from 'next/font/google';
import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity/visual-editing';
import './globals.css';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { SanityLive } from '@/lib/sanity/live';
import Analytics from '@/components/Analytics';
import { siteHeader, siteFooter } from '@/data/siteData';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['700', '800', '900'],
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.realismthrift.com'),
  title: {
    default: 'RealismThrift Export Co., Ltd | #1 Used Clothes & Shoes Supplier in China',
    template: '%s | RealismThrift'
  },
  description: 'Leading wholesale supplier of second-hand clothes, shoes and bags from China. Export to 100+ countries with A-Grade quality.',
  keywords: ['used clothes wholesale', 'second hand clothes china', 'used shoes supplier', 'used bags exporter', 'wholesale used clothing africa'],
  authors: [{ name: 'RealismThrift' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.realismthrift.com',
    siteName: 'RealismThrift Export',
    title: 'RealismThrift Export Co., Ltd | #1 Used Clothes & Shoes Supplier in China',
    description: 'Leading wholesale supplier of second-hand clothes, shoes and bags from China. Export to 100+ countries with A-Grade quality.',
    images: [
      {
        url: '/img/logo.png',
        width: 800,
        height: 600,
        alt: 'RealismThrift Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RealismThrift Export Co., Ltd | #1 Used Clothes & Shoes Supplier in China',
    description: 'Leading wholesale supplier of second-hand clothes, shoes and bags from China. Export to 100+ countries with A-Grade quality.',
    images: ['/img/logo.png'],
  },
  icons: {
    icon: '/img/logo.png',
    shortcut: '/img/logo.png',
    apple: '/img/logo.png',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: isDraftModeEnabled } = await draftMode();

  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable}`} data-scroll-behavior="smooth">
      <body className="antialiased font-sans bg-white text-[#333]">
        <Analytics />
        <div className="flex min-h-screen flex-col">
          <SiteHeader data={siteHeader} />
          <main className="flex-grow">{children}</main>
          <SiteFooter data={siteFooter} />
        </div>
        {isDraftModeEnabled ? <VisualEditing /> : null}
        <SanityLive
          refreshOnMount={false}
          refreshOnFocus={false}
          refreshOnReconnect={false}
        />
      </body>
    </html>
  );
}
