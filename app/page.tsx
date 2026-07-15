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
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: `${BRAND.name} — Gestionale per artigiani tecnici`,
  description:
    'Programma interventi, avvisa i clienti su WhatsApp, rapportino PDF con firma. Prova 14 giorni gratis.',
};

export default async function HomePage() {
  const session = await getSession();
  if (session) redirect('/dashboard');

  return (
    <div className="min-h-screen">
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