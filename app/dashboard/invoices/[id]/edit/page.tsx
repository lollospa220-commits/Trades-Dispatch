import InvoiceWizard, { type WizardInitial } from '@/components/dashboard/InvoiceWizard';
import { getSession } from '@/lib/auth';
import { invoiceNumberLabel, type VatRate } from '@/lib/invoices';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const { id } = await params;
  const [invoice, customers] = await Promise.all([
    prisma.invoice.findFirst({
      where: { id, companyId: session.companyId },
      include: { lines: { orderBy: { position: 'asc' } } },
    }),
    prisma.customer.findMany({
      where: { companyId: session.companyId },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        address: true,
        vatNumber: true,
        taxCode: true,
        sdiCode: true,
        pec: true,
      },
    }),
  ]);
  if (!invoice) notFound();
  if (invoice.status !== 'DRAFT') redirect(`/dashboard/invoices/${invoice.id}`);

  const initial: WizardInitial = {
    invoiceId: invoice.id,
    jobId: invoice.jobId ?? undefined,
    customerId: invoice.customerId,
    issueDate: invoice.issueDate.toISOString().slice(0, 10),
    notes: invoice.notes ?? undefined,
    lines: invoice.lines.map((l) => ({
      description: l.description,
      quantity: String(Number(l.quantity)).replace('.', ','),
      unitPriceEuro: (l.unitPriceCents / 100).toFixed(2).replace('.', ','),
      vatRate: l.vatRate as VatRate,
    })),
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-brand-navy">
          Modifica bozza n° {invoiceNumberLabel(invoice.number, invoice.year)}
        </h2>
        <Link
          href={`/dashboard/invoices/${invoice.id}`}
          className="text-sm text-brand-blue hover:underline"
        >
          ← Dettaglio
        </Link>
      </div>
      <InvoiceWizard customers={customers} initial={initial} />
    </div>
  );
}
