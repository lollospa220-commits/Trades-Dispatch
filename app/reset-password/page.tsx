import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import Logo from '@/components/brand/Logo';
import Link from 'next/link';

type Props = { searchParams: Promise<{ token?: string }> };

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;

  return (
    <main className="brand-hero-bg flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Logo className="mb-4 inline-flex" />
          <h1 className="font-display text-xl font-bold text-brand-navy">Nuova password</h1>
        </div>
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="brand-card p-6 text-center text-sm text-brand-muted">
            Link non valido.{' '}
            <Link href="/forgot-password" className="text-brand-blue">
              Richiedine uno nuovo
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}