import Logo from '@/components/brand/Logo';
import { BRAND } from '@/lib/brand';
import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="border-t border-brand-sand-dark bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 safe-bottom sm:flex-row sm:items-center sm:justify-between sm:py-10">
        <div>
          <Logo />
          <p className="mt-2 max-w-xs text-sm text-brand-muted">{BRAND.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm">
          <Link href="/register" className="font-semibold text-brand-blue hover:text-brand-blue-dark">
            Registrati
          </Link>
          <Link href="/login" className="text-brand-muted hover:text-brand-ink">
            Accedi
          </Link>
          <a href="#prezzi" className="text-brand-muted hover:text-brand-ink">
            Prezzi
          </a>
        </div>
      </div>
      <div className="border-t border-brand-sand-dark px-4 py-4 text-center text-xs text-brand-muted">
        © {new Date().getFullYear()} {BRAND.name}. Gestionale per artigiani tecnici.
      </div>
    </footer>
  );
}