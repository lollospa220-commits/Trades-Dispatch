'use client';

import { deleteInvoice, setInvoiceStatus } from '@/app/actions/invoices';
import type { InvoiceStatus } from '@prisma/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useTransition } from 'react';

export default function InvoiceActions({
  invoiceId,
  status,
}: {
  invoiceId: string;
  status: InvoiceStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) setError(res.error ?? 'Errore.');
    });
  };

  const onDelete = () => {
    if (!confirm('Eliminare questa bozza? Non si può annullare.')) return;
    setError(null);
    startTransition(async () => {
      const res = await deleteInvoice(invoiceId);
      if (res.ok) router.push('/dashboard/invoices');
      else setError(res.error);
    });
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <a
          href={`/api/invoices/${invoiceId}/pdf`}
          className="brand-btn-primary px-5"
          target="_blank"
          rel="noopener"
        >
          Scarica PDF
        </a>

        {status === 'DRAFT' && (
          <>
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => setInvoiceStatus(invoiceId, 'SENT'))}
              className="flex min-h-11 items-center justify-center rounded-lg border border-brand-amber/50 bg-brand-amber-light px-5 text-sm font-semibold text-brand-amber disabled:opacity-60"
            >
              Segna inviata
            </button>
            <Link
              href={`/dashboard/invoices/${invoiceId}/edit`}
              className="flex min-h-11 items-center justify-center rounded-lg border border-brand-sand-dark px-5 text-sm font-semibold text-brand-ink"
            >
              Modifica
            </Link>
            <button
              type="button"
              disabled={pending}
              onClick={onDelete}
              className="flex min-h-11 items-center justify-center rounded-lg border border-red-200 px-5 text-sm font-semibold text-red-600 disabled:opacity-60"
            >
              Elimina bozza
            </button>
          </>
        )}

        {status === 'SENT' && (
          <>
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => setInvoiceStatus(invoiceId, 'PAID'))}
              className="flex min-h-11 items-center justify-center rounded-lg border border-brand-teal/50 bg-brand-teal-light px-5 text-sm font-semibold text-brand-teal disabled:opacity-60"
            >
              Segna pagata
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => setInvoiceStatus(invoiceId, 'CANCELLED'))}
              className="flex min-h-11 items-center justify-center rounded-lg border border-red-200 px-5 text-sm font-semibold text-red-600 disabled:opacity-60"
            >
              Annulla fattura
            </button>
          </>
        )}
      </div>

      {pending && <p className="mt-3 text-xs text-brand-muted">Aggiornamento in corso…</p>}
      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100">
          {error}
        </p>
      )}
    </div>
  );
}
