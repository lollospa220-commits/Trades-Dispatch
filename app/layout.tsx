import CookieBanner from '@/components/CookieBanner';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Source_Sans_3 } from 'next/font/google';
import { BRAND } from '@/lib/brand';
import { siteUrl } from '@/lib/site';
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
  icons: {
    icon: [
      { url: '/brand/app-icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/app-icon.png', sizes: '1024x1024', type: 'image/png' },
    ],
    apple: '/brand/app-icon-180.png',
  },
  manifest: '/manifest.json',
  metadataBase: new URL(siteUrl()),
  openGraph: {
    title: BRAND.name,
    description: BRAND.descriptor,
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: BRAND.colors.navy,
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${plusJakarta.variable} ${sourceSans.variable}`}>
      <body className="antialiased font-sans">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}