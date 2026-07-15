'use client';

import { upsertBillingProfile, type ActionResult } from '@/app/actions/invoices';
import { useActionState } from 'react';

export type BillingProfileData = {
  businessName: string | null;
  vatNumber: string | null;
  taxCode: string | null;
  address: string | null;
  pec: string | null;
  sdiCode: string | null;
  iban: string | null;
} | null;

const initial: ActionResult | null = null;

export default function BillingProfileForm({
  profile,
  companyName,
}: {
  profile: BillingProfileData;
  companyName: string;
}) {
  const [state, formAction, pending] = useActionState(upsertBillingProfile, initial);

  return (
    <form action={formAction} className="brand-card mt-6 p-4 sm:p-5">
      <h3 className="font-display text-base font-semibold text-brand-navy">Dati fatturazione</h3>
      <p className="mt-1 text-sm text-brand-muted">
        Finiscono nell&apos;intestazione delle tue fatture PDF.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="brand-label">Ragione sociale</span>
          <input
            name="businessName"
            defaultValue={profile?.businessName ?? ''}
            placeholder={companyName}
            maxLength={120}
            className="brand-input mt-1.5"
          />
        </label>
        <label className="block">
          <span className="brand-label">Partita IVA</span>
          <input
            name="vatNumber"
            defaultValue={profile?.vatNumber ?? ''}
            placeholder="IT01234567890"
            maxLength={20}
            className="brand-input mt-1.5"
          />
        </label>
        <label className="block">
          <span className="brand-label">Codice fiscale</span>
          <input
            name="taxCode"
            defaultValue={profile?.taxCode ?? ''}
            maxLength={20}
            className="brand-input mt-1.5"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="brand-label">Indirizzo (via, CAP, città)</span>
          <input
            name="address"
            defaultValue={profile?.address ?? ''}
            placeholder="Via Roma 1, 20100 Milano (MI)"
            maxLength={200}
            className="brand-input mt-1.5"
          />
        </label>
        <label className="block">
          <span className="brand-label">PEC</span>
          <input
            name="pec"
            type="email"
            defaultValue={profile?.pec ?? ''}
            maxLength={120}
            className="brand-input mt-1.5"
          />
        </label>
        <label className="block">
          <span className="brand-label">Codice SDI (facoltativo)</span>
          <input
            name="sdiCode"
            defaultValue={profile?.sdiCode ?? ''}
            placeholder="0000000"
            maxLength={10}
            className="brand-input mt-1.5"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="brand-label">IBAN (mostrato in fattura per il pagamento)</span>
          <input
            name="iban"
            defaultValue={profile?.iban ?? ''}
            placeholder="IT00 A000 0000 0000 0000 0000 000"
            maxLength={34}
            className="brand-input mt-1.5"
          />
        </label>
      </div>

      {state && !state.ok && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p className="mt-4 rounded-lg bg-brand-teal-light px-3 py-2 text-sm text-brand-teal ring-1 ring-brand-teal/20">
          Dati fatturazione salvati.
        </p>
      )}

      <button type="submit" disabled={pending} className="brand-btn-primary mt-5">
        {pending ? 'Salvataggio…' : 'Salva dati fatturazione'}
      </button>
    </form>
  );
}
