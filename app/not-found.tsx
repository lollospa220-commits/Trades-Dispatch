import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold text-brand-navy">404</h1>
        <p className="mt-2 text-brand-muted">Pagina non trovata.</p>
        <Link href="/" className="brand-btn-primary mt-6 inline-flex">
          Torna alla home
        </Link>
      </div>
    </main>
  );
}