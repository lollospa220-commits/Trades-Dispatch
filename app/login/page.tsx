import LoginForm from '@/components/auth/LoginForm';
import Logo from '@/components/brand/Logo';
import { BRAND } from '@/lib/brand';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect('/dashboard');

  return (
    <main className="brand-hero-bg flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo className="mb-6" />
          <h1 className="font-display text-2xl font-bold text-brand-navy">Accedi alla dashboard</h1>
          <p className="mt-2 max-w-sm text-sm text-brand-muted">{BRAND.descriptor}</p>
        </div>

        <LoginForm />

        <p className="mt-8 text-center text-xs text-brand-muted">
          Demo idraulica: <span className="font-mono text-brand-ink">admin@demo-idraulica.it</span> /{' '}
          <span className="font-mono text-brand-ink">demo1234</span>
          <br />
          Demo elettrica: <span className="font-mono text-brand-ink">admin@demo-elettrica.it</span> /{' '}
          <span className="font-mono text-brand-ink">demo1234</span>
        </p>
      </div>
    </main>
  );
}