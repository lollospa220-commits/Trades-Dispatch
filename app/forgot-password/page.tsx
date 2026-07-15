import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import Logo from '@/components/brand/Logo';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <main className="brand-hero-bg flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Logo className="mb-4 inline-flex" />
          <h1 className="font-display text-xl font-bold text-brand-navy">Password dimenticata</h1>
        </div>
        <ForgotPasswordForm />
        <p className="mt-6 text-center text-sm">
          <Link href="/login" className="text-brand-blue hover:underline">
            Torna al login
          </Link>
        </p>
      </div>
    </main>
  );
}