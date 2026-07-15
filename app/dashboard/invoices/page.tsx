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
import type { InvoiceStatus, Prisma } from '@prisma/client';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const FILTERS: { id: string; label: string; where: Prisma.InvoiceWhereInput }[] = [
  { id: 'all', label: 'Tutte', where: {} },
  { id: 'draft', label: 'Bozze', where: { status: 'DRAFT' } },
  { id: 'sent', label: 'Da incassare', where: { status: 'SENT' } },
  { id: 'paid', label: 'Pagate', where: { status: 'PAID' } },
  { id: 'cancelled', label: 'Annullate', where: { status: 'CANCELLED' } },
];

function StatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${INVOICE_STATUS_STYLE[status as InvoiceStatusKey]}`}
    >
      {INVOICE_STATUS_LABEL[status as InvoiceStatusKey]}
    </span>
  );
}

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const { status: statusRaw } = await searchParams;
  const filter = FILTERS.find((f) => f.id === statusRaw) ?? FILTERS[0];

  const [invoices, statusCounts, toCollect] = await Promise.all([
    prisma.invoice.findMany({
      where: { companyId: session.companyId, ...filter.where },
      orderBy: [{ year: 'desc' }, { number: 'desc' }],
      take: 100,
      select: {
        id: true,
        year: true,
        number: true,
        status: true,
        issueDate: true,
        totalCents: true,
        customer: { select: { name: true } },
      },
    }),
    prisma.invoice.groupBy({
      by: ['status'],
      where: { companyId: session.companyId },
      _count: true,
    }),
    prisma.invoice.aggregate({
      where: { companyId: session.companyId, status: 'SENT' },
      _sum: { totalCents: true },
    }),
  ]);

  const countFor = (id: string): number => {
    if (id === 'all') return statusCounts.reduce((s, c) => s + c._count, 0);
    const st = FILTERS.find((f) => f.id === id)?.where.status;
    return statusCounts.find((c) => c.status === st)?._count ?? 0;
  };
  const toCollectCents = toCollect._sum.totalCents ?? 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-brand-navy">Fatture</h2>
          {toCollectCents > 0 && (
            <p className="mt-0.5 text-sm text-brand-muted">
              Da incassare:{' '}
              <span className="font-semibold text-brand-amber">{formatEuro(toCollectCents)}</span>
            </p>
          )}
        </div>
        <Link href="/dashboard/invoices/new" className="brand-btn-primary px-5">
          + Nuova fattura
        </Link>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {FILTERS.map((f) => {
          const active = f.id === filter.id;
          const count = countFor(f.id);
          return (
            <Link
              key={f.id}
              href={f.id === 'all' ? '/dashboard/invoices' : `/dashboard/invoices?status=${f.id}`}
              className={`flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition ${
                active
                  ? 'bg-brand-navy text-white'
                  : 'bg-white text-brand-muted ring-1 ring-brand-sand-dark hover:text-brand-navy'
              }`}
            >
              {f.label}
              <span
                className={`rounded-full px-1.5 text-xs ${active ? 'bg-white/20' : 'bg-brand-sand'}`}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      {invoices.length === 0 ? (
        <div className="brand-card mt-4 border-dashed px-4 py-12 text-center sm:py-16">
          <p className="text-sm font-medium text-brand-muted">
            {filter.id === 'all'
              ? 'Nessuna fattura ancora. Crea la prima in un minuto.'
              : 'Nessuna fattura in questo stato.'}
          </p>
          {filter.id === 'all' && (
            <Link href="/dashboard/invoices/new" className="brand-btn-primary mt-5 px-6">
              Crea la prima fattura
            </Link>
          )}
        </div>
      ) : (
        <div className="brand-card mt-4 overflow-hidden p-0">
          {/* Mobile: cards */}
          <ul className="divide-y divide-brand-sand-dark lg:hidden">
            {invoices.map((inv) => (
              <li key={inv.id}>
                <Link href={`/dashboard/invoices/${inv.id}`} className="block p-4 active:bg-brand-sand/60">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display text-base font-bold text-brand-navy">
                        n° {invoiceNumberLabel(inv.number, inv.year)}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-brand-ink">{inv.customer.name}</p>
                      <p className="mt-0.5 text-xs text-brand-muted">{formatDateRome(inv.issueDate)}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-display text-base font-bold text-brand-navy">
                        {formatEuro(inv.totalCents)}
                      </p>
                      <div className="mt-1">
                        <StatusBadge status={inv.status} />
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop: tabella */}
          <table className="hidden min-w-full divide-y divide-brand-sand-dark text-left text-sm lg:table">
            <thead className="bg-brand-sand">
              <tr>
                <th className="px-4 py-3 font-semibold text-brand-muted">Numero</th>
                <th className="px-4 py-3 font-semibold text-brand-muted">Cliente</th>
                <th className="px-4 py-3 font-semibold text-brand-muted">Data</th>
                <th className="px-4 py-3 text-right font-semibold text-brand-muted">Totale</th>
                <th className="px-4 py-3 font-semibold text-brand-muted">Stato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-sand-dark/60">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-brand-sand/80">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/invoices/${inv.id}`}
                      className="font-semibold text-brand-blue hover:underline"
                    >
                      n° {invoiceNumberLabel(inv.number, inv.year)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-brand-ink">{inv.customer.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-brand-muted">
                    {formatDateRome(inv.issueDate)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-brand-navy">
                    {formatEuro(inv.totalCents)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={inv.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
