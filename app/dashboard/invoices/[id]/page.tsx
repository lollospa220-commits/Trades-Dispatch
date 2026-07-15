import InvoiceActions from '@/components/dashboard/InvoiceActions';
import { formatDateRome } from '@/lib/dates';
import { getSession } from '@/lib/auth';
import {
  formatEuro,
  invoiceNumberLabel,
  INVOICE_STATUS_LABEL,
  INVOICE_STATUS_STYLE,
  type InvoiceStatusKey,
} from '@/lib/invoices';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const { id } = await params;
  const invoice = await prisma.invoice.findFirst({
    where: { id, companyId: session.companyId },
    include: {
      customer: {
        select: { name: true, address: true, vatNumber: true, taxCode: true, sdiCode: true, pec: true },
      },
      job: { select: { id: true, title: true } },
      lines: { orderBy: { position: 'asc' } },
    },
  });
  if (!invoice) notFound();

  const statusKey = invoice.status as InvoiceStatusKey;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-brand-navy">
          Fattura n° {invoiceNumberLabel(invoice.number, invoice.year)}
        </h2>
        <Link href="/dashboard/invoices" className="text-sm text-brand-blue hover:underline">
          ← Fatture
        </Link>
      </div>

      <div className="brand-card p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-brand-muted">Cliente</p>
            <p className="font-display text-base font-bold text-brand-navy">{invoice.customer.name}</p>
            {invoice.customer.address && (
              <p className="text-sm text-brand-muted">{invoice.customer.address}</p>
            )}
            {invoice.customer.vatNumber && (
              <p className="text-sm text-brand-muted">P.IVA {invoice.customer.vatNumber}</p>
            )}
            {invoice.customer.taxCode && (
              <p className="text-sm text-brand-muted">CF {invoice.customer.taxCode}</p>
            )}
          </div>
          <div className="text-right">
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${INVOICE_STATUS_STYLE[statusKey]}`}
            >
              {INVOICE_STATUS_LABEL[statusKey]}
            </span>
            <p className="mt-2 text-sm text-brand-muted">
              Emessa il {formatDateRome(invoice.issueDate)}
            </p>
            {invoice.paidAt && (
              <p className="text-sm text-brand-teal">Pagata il {formatDateRome(invoice.paidAt)}</p>
            )}
          </div>
        </div>

        {invoice.job && (
          <p className="mt-3 rounded-lg bg-brand-sand px-3 py-2 text-sm text-brand-ink">
            Da intervento:{' '}
            <Link
              href={`/dashboard/jobs/${invoice.job.id}/report`}
              className="font-semibold text-brand-blue hover:underline"
            >
              {invoice.job.title}
            </Link>
          </p>
        )}

        <ul className="mt-5 divide-y divide-brand-sand-dark/60 border-t border-brand-sand-dark/60">
          {invoice.lines.map((line) => (
            <li key={line.id} className="flex items-start justify-between gap-4 py-3 text-sm">
              <div className="min-w-0">
                <p className="font-medium text-brand-ink">{line.description}</p>
                <p className="mt-0.5 text-xs text-brand-muted">
                  {Number(line.quantity)} × {formatEuro(line.unitPriceCents)} · IVA {line.vatRate}%
                </p>
              </div>
              <p className="shrink-0 font-semibold text-brand-navy">{formatEuro(line.totalCents)}</p>
            </li>
          ))}
        </ul>

        <dl className="mt-2 space-y-1 border-t border-brand-sand-dark pt-3 text-sm">
          <div className="flex justify-between text-brand-muted">
            <dt>Imponibile</dt>
            <dd>{formatEuro(invoice.subtotalCents)}</dd>
          </div>
          <div className="flex justify-between text-brand-muted">
            <dt>IVA</dt>
            <dd>{formatEuro(invoice.vatCents)}</dd>
          </div>
          <div className="flex justify-between font-display text-lg font-bold text-brand-navy">
            <dt>Totale</dt>
            <dd>{formatEuro(invoice.totalCents)}</dd>
          </div>
        </dl>

        {invoice.notes && (
          <p className="mt-4 rounded-lg bg-brand-sand px-3 py-2 text-sm text-brand-ink">
            {invoice.notes}
          </p>
        )}
      </div>

      <div className="mt-5">
        <InvoiceActions invoiceId={invoice.id} status={invoice.status} />
      </div>
    </div>
  );
}
