import Logo from '@/components/brand/Logo';
import Link from 'next/link';

export default function TerminiPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Logo className="mb-8" />
      <h1 className="font-display text-2xl font-bold text-brand-navy">Termini di servizio</h1>
      <div className="prose prose-sm mt-6 max-w-none text-brand-ink">
        <p>
          Opifice è un software gestionale in abbonamento. L&apos;utente è responsabile dei
          dati inseriti (clienti, interventi) e dell&apos;uso delle notifiche SMS nel rispetto delle
          norme vigenti.
        </p>
        <p>
          Il servizio è fornito &quot;as is&quot;. Possono esserci interruzioni per manutenzione. Il
          abbonamento è mensile e disdicibile secondo le condizioni del piano scelto.
        </p>
      </div>
      <Link href="/" className="mt-8 inline-block text-sm text-brand-blue hover:underline">
        ← Home
      </Link>
    </main>
  );
}