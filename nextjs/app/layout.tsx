import type { Metadata } from 'next';
import { Montserrat, Open_Sans } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/AppShell';
import NextTopLoader from 'nextjs-toploader';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable}`}>
      <body className="antialiased font-sans bg-white text-[#333]">
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
      </body>
    </html>
  );
}
