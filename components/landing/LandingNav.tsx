import Logo from '@/components/brand/Logo';
import Link from 'next/link';

export default function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-navy/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="shrink-0">
          <Logo theme="light" />
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <a
            href="#prezzi"
            className="hidden text-sm font-medium text-white/70 transition hover:text-white sm:inline"
          >
            Prezzi
          </a>
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
          >
            Accedi
          </Link>
          <Link href="/register" className="brand-btn-primary whitespace-nowrap px-4 py-2">
            Registrati
          </Link>
        </nav>
      </div>
    </header>
  );
}