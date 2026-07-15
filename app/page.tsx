import AudienceSection from '@/components/landing/AudienceSection';
import FaqSection from '@/components/landing/FaqSection';
import FinalCtaSection from '@/components/landing/FinalCtaSection';
import HeroSection from '@/components/landing/HeroSection';
import LandingFooter from '@/components/landing/LandingFooter';
import LandingNav from '@/components/landing/LandingNav';
import OperatorsGallery from '@/components/landing/OperatorsGallery';
import PricingSection from '@/components/landing/PricingSection';
import ProblemsSection from '@/components/landing/ProblemsSection';
import ProductShowcase from '@/components/landing/ProductShowcase';
import SolutionSection from '@/components/landing/SolutionSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import { BRAND } from '@/lib/brand';
import { getSession } from '@/lib/auth';
import { PRICING_PLANS } from '@/lib/pricing';
import { siteUrl } from '@/lib/site';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

const HOME_TITLE = `${BRAND.name} — Gestionale interventi per idraulici, elettricisti e artigiani`;
const HOME_DESCRIPTION =
  'Programma interventi, avvisa i clienti su WhatsApp, rapportino PDF con firma. Il gestionale per artigiani tecnici. Prova 14 giorni gratis.';

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: '/' },
  // Next non fonde openGraph tra layout e page: qui va l'oggetto completo
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: '/',
    type: 'website',
    siteName: BRAND.name,
    locale: 'it_IT',
    images: [
      {
        url: '/brand/app-icon-1024.png',
        width: 1024,
        height: 1024,
        alt: `${BRAND.name} — gestionale interventi per artigiani`,
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ['/brand/app-icon-1024.png'],
  },
};

function StructuredData() {
  const base = siteUrl();
  const prices = PRICING_PLANS.map((p) => p.price);
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: BRAND.name,
      description: HOME_DESCRIPTION,
      url: base,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      inLanguage: 'it',
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'EUR',
        lowPrice: Math.min(...prices),
        highPrice: Math.max(...prices),
        offerCount: PRICING_PLANS.length,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: BRAND.name,
      url: base,
      logo: `${base}/brand/app-icon-1024.png`,
      slogan: BRAND.tagline,
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function HomePage() {
  const session = await getSession();
  if (session) redirect('/dashboard');

  return (
    <div className="min-h-screen">
      <StructuredData />
      <LandingNav />
      <main>
        <HeroSection />
        <ProductShowcase />
        <OperatorsGallery />
        <ProblemsSection />
        <SolutionSection />
        <TestimonialsSection />
        <AudienceSection />
        <PricingSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}