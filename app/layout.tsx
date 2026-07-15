import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Source_Sans_3 } from 'next/font/google';
import { BRAND } from '@/lib/brand';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: BRAND.name,
    template: `%s · ${BRAND.name}`,
  },
  description: BRAND.descriptor,
  applicationName: BRAND.name,
  icons: { icon: '/brand/logo-mark.svg' },
};

export const viewport: Viewport = {
  themeColor: BRAND.colors.navy,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${plusJakarta.variable} ${sourceSans.variable}`}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}