import Logo from '@/components/brand/Logo';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Come Opifice tratta i dati di aziende, clienti e interventi: conservazione in UE, nessuna vendita a terzi.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Logo className="mb-8" />
      <h1 className="font-display text-2xl font-bold text-brand-navy">Privacy Policy</h1>
      <div className="prose prose-sm mt-6 max-w-none text-brand-ink">
        <p>
          Opifice tratta i dati necessari per erogare il servizio: account azienda, clienti,
          interventi e numeri di telefono per notifiche SMS.
        </p>
        <p>
          I dati sono conservati su server in UE (Supabase). Non vendiamo dati a terzi. Puoi
          richiedere cancellazione scrivendo all&apos;email del titolare del servizio.
        </p>
        <p>Base giuridica: esecuzione contratto e legittimo interesse operativo.</p>
      </div>
      <Link href="/" className="mt-8 inline-block text-sm text-brand-blue hover:underline">
        ← Home
      </Link>
    </main>
  );
}