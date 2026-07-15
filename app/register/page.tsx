import RegisterForm from '@/components/auth/RegisterForm';
import Logo from '@/components/brand/Logo';
import { BRAND } from '@/lib/brand';
import { getSession } from '@/lib/auth';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Registrati — prova 14 giorni gratis',
  description:
    'Crea il tuo account Opifice: programma interventi, avvisa i clienti su WhatsApp e firma i rapportini. 14 giorni di prova gratuita.',
  alternates: { canonical: '/register' },
};

type RegisterPageProps = {
  searchParams: Promise<{ plan?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const session = await getSession();
  if (session) redirect('/dashboard');

  const { plan } = await searchParams;
  const defaultPlan =
    plan === 'solo' ? 'SOLO' : plan === 'team' || plan === 'pro' ? 'COMPANY' : undefined;

  return (
    <main className="brand-hero-bg flex min-h-screen items-center justify-center px-4 py-8 safe-bottom sm:py-12">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
          <Logo className="mb-5 sm:mb-6" />
          <h1 className="font-display text-xl font-bold text-brand-navy sm:text-2xl">Crea il tuo account</h1>
          <p className="mt-2 max-w-md text-sm text-brand-muted">
            Scegli se lavori da solo o con un team di operatori. Potrai gestire interventi e clienti
            da subito.
          </p>
        </div>

        <RegisterForm defaultAccountType={defaultPlan} defaultPlan={plan} />

        <p className="mt-8 text-center text-sm text-brand-muted">
          Hai già un account?{' '}
          <Link href="/login" className="font-semibold text-brand-blue hover:text-brand-blue-dark">
            Accedi
          </Link>
        </p>
      </div>
    </main>
  );
}