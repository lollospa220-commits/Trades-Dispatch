import LoginForm from '@/components/auth/LoginForm';
import Logo from '@/components/brand/Logo';
import { BRAND } from '@/lib/brand';
import { getSession } from '@/lib/auth';
import { isProduction } from '@/lib/site';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Accedi',
  description: 'Entra nella dashboard Opifice: agenda interventi, clienti e rapportini della tua attività.',
  alternates: { canonical: '/login' },
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect('/dashboard');

  return (
    <main className="brand-hero-bg flex min-h-screen items-center justify-center px-4 py-8 safe-bottom sm:py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
          <Logo className="mb-5 sm:mb-6" />
          <h1 className="font-display text-xl font-bold text-brand-navy sm:text-2xl">Accedi alla dashboard</h1>
          <p className="mt-2 max-w-sm text-sm text-brand-muted">{BRAND.descriptor}</p>
        </div>

        <LoginForm />

        <p className="mt-4 text-center text-sm">
          <Link href="/forgot-password" className="text-brand-blue hover:underline">
            Password dimenticata?
          </Link>
        </p>

        <p className="mt-8 text-center text-sm text-brand-muted">
          Non hai un account?{' '}
          <Link href="/register" className="font-semibold text-brand-blue hover:text-brand-blue-dark">
            Registrati
          </Link>
        </p>

        {!isProduction && (
        <div className="mt-4 space-y-2 text-center text-xs text-brand-muted">
          <p className="break-all">
            Demo azienda:{' '}
            <span className="font-mono text-brand-ink">admin@demo-idraulica.it</span> /{' '}
            <span className="font-mono text-brand-ink">demo1234</span>
          </p>
          <p className="break-all">
            Demo operatore:{' '}
            <span className="font-mono text-brand-ink">marco@demo-solo.it</span> /{' '}
            <span className="font-mono text-brand-ink">demo1234</span>
          </p>
        </div>
        )}
      </div>
    </main>
  );
}