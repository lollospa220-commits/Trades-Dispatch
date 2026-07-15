'use client';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="brand-card max-w-md p-6 text-center">
        <h1 className="font-display text-lg font-bold text-brand-navy">Qualcosa è andato storto</h1>
        <p className="mt-2 text-sm text-brand-muted">Riprova. Se persiste, contatta il supporto.</p>
        <button type="button" onClick={reset} className="brand-btn-primary mt-4">
          Riprova
        </button>
      </div>
    </main>
  );
}