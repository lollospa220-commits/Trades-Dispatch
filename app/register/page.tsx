import RegisterForm from '@/components/auth/RegisterForm';
import Logo from '@/components/brand/Logo';
import { BRAND } from '@/lib/brand';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect('/dashboard');

  return (
    <main className="brand-hero-bg flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo className="mb-6" />
          <h1 className="font-display text-2xl font-bold text-brand-navy">Crea il tuo account</h1>
          <p className="mt-2 max-w-md text-sm text-brand-muted">
            Scegli se lavori da solo o con un team di operatori. Potrai gestire interventi e clienti
            da subito.
          </p>
        </div>

        <RegisterForm />

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