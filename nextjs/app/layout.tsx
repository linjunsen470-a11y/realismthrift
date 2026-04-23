import type { Metadata } from 'next';
import { Montserrat, Open_Sans } from 'next/font/google';
import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity/visual-editing';
import './globals.css';
import { AppShell } from '@/components/AppShell';
import NextTopLoader from 'nextjs-toploader';
import { SanityLive } from '@/lib/sanity/live';
import Analytics from '@/components/Analytics';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  weight: ['400', '500', '600', '700'],
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
        url: '/img/rt-icon.png',
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
    images: ['/img/rt-icon.png'],
  },
  icons: {
    icon: '/img/rt-icon.png',
    shortcut: '/img/rt-icon.png',
    apple: '/img/rt-icon.png',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: isDraftModeEnabled } = await draftMode();

  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable}`}>
      <body className="antialiased font-sans bg-white text-[#333]">
        <Analytics />
        <NextTopLoader 
          color="#c0392b"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #c0392b,0 0 5px #c0392b"
        />
        <AppShell>{children}</AppShell>
        {isDraftModeEnabled ? <VisualEditing /> : null}
        {isDraftModeEnabled ? (
          <SanityLive
            refreshOnMount={false}
            refreshOnFocus={false}
            refreshOnReconnect={false}
          />
        ) : null}
      </body>
    </html>
  );
}
