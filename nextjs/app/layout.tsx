import type { Metadata } from 'next';
import { Montserrat, Open_Sans } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/AppShell';

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
  title: 'RealismThrift Export Co., Ltd | #1 Used Clothes & Shoes Supplier in China',
  description: 'Leading wholesale supplier of second-hand clothes, shoes and bags from China. Export to 100+ countries with A-Grade quality.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable}`}>
      <body className="antialiased font-sans bg-white text-[#333]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

