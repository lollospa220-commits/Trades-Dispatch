'use client';

import Logo from '@/components/brand/Logo';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function LandingNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-navy/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="min-w-0 shrink" onClick={() => setOpen(false)}>
          <Logo theme="light" className="max-w-[calc(100vw-8rem)]" />
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          <a href="#prodotto" className="text-sm font-medium text-white/70 transition hover:text-white">
            Prodotto
          </a>
          <a href="#prezzi" className="text-sm font-medium text-white/70 transition hover:text-white">
            Prezzi
          </a>
          <a href="#faq" className="hidden text-sm font-medium text-white/70 transition hover:text-white sm:inline">
            FAQ
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

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-white transition hover:bg-white/10 md:hidden"
          aria-expanded={open}
          aria-controls="landing-mobile-menu"
          aria-label={open ? 'Chiudi menu' : 'Apri menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div
          id="landing-mobile-menu"
          className="border-t border-white/10 bg-brand-navy px-4 py-4 md:hidden"
        >
          <nav className="flex flex-col gap-2">
            <a href="#prodotto" className="rounded-lg px-3 py-3 text-base font-medium text-white/90 transition hover:bg-white/10" onClick={() => setOpen(false)}>
              Prodotto
            </a>
            <a href="#prezzi" className="rounded-lg px-3 py-3 text-base font-medium text-white/90 transition hover:bg-white/10" onClick={() => setOpen(false)}>
              Prezzi
            </a>
            <a href="#faq" className="rounded-lg px-3 py-3 text-base font-medium text-white/90 transition hover:bg-white/10" onClick={() => setOpen(false)}>
              FAQ
            </a>
            <Link
              href="/login"
              className="rounded-lg px-3 py-3 text-base font-medium text-white/90 transition hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              Accedi
            </Link>
            <Link
              href="/register"
              className="brand-btn-primary mt-1 w-full py-3 text-center"
              onClick={() => setOpen(false)}
            >
              Registrati gratis
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}