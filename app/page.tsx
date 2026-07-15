import AudienceSection from '@/components/landing/AudienceSection';
import FinalCtaSection from '@/components/landing/FinalCtaSection';
import HeroSection from '@/components/landing/HeroSection';
import LandingFooter from '@/components/landing/LandingFooter';
import LandingNav from '@/components/landing/LandingNav';
import OperatorsGallery from '@/components/landing/OperatorsGallery';
import PricingSection from '@/components/landing/PricingSection';
import ProblemsSection from '@/components/landing/ProblemsSection';
import SolutionSection from '@/components/landing/SolutionSection';
import { BRAND } from '@/lib/brand';
import { getSession } from '@/lib/auth';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: `${BRAND.name} — Gestionale per artigiani tecnici`,
  description:
    'Programma interventi, assegna tecnici e avvisa i clienti. Per operatori singoli e piccole imprese. Da €20/mese.',
};

export default async function HomePage() {
  const session = await getSession();
  if (session) redirect('/dashboard');

  return (
    <div className="min-h-screen">
      <LandingNav />
      <main>
        <HeroSection />
        <OperatorsGallery />
        <ProblemsSection />
        <SolutionSection />
        <AudienceSection />
        <PricingSection />
        <FinalCtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}