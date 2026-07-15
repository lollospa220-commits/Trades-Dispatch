import InvoiceWizard, { type WizardInitial } from '@/components/dashboard/InvoiceWizard';
import { romeDateString } from '@/lib/dates';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const CUSTOMER_SELECT = {
  id: true,
  name: true,
  address: true,
  vatNumber: true,
  taxCode: true,
  sdiCode: true,
  pec: true,
} as const;

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ jobId?: string }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const { jobId } = await searchParams;

  const [customers, job] = await Promise.all([
    prisma.customer.findMany({
      where: { companyId: session.companyId },
      orderBy: { name: 'asc' },
      select: CUSTOMER_SELECT,
    }),
    jobId
      ? prisma.job.findFirst({
          where: { id: jobId, companyId: session.companyId },
          select: { id: true, title: true, customerId: true, status: true },
        })
      : Promise.resolve(null),
  ]);

  // Precompilazione da intervento completato (createInvoiceFromJob flow)
  const initial: WizardInitial =
    job && job.status === 'COMPLETED'
      ? {
          jobId: job.id,
          customerId: job.customerId,
          customerLocked: true,
          issueDate: romeDateString(),
          lines: [
            { description: `Intervento: ${job.title}`, quantity: '1', unitPriceEuro: '', vatRate: 22 },
          ],
        }
      : { issueDate: romeDateString(), lines: [] };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-brand-navy">Nuova fattura</h2>
        <Link href="/dashboard/invoices" className="text-sm text-brand-blue hover:underline">
          ← Fatture
        </Link>
      </div>
      {job && job.status !== 'COMPLETED' && (
        <p className="mb-4 rounded-lg bg-brand-amber-light px-3 py-2 text-sm text-brand-amber">
          L&apos;intervento non è ancora completato: la fattura parte vuota.
        </p>
      )}
      <InvoiceWizard customers={customers} initial={initial} />
    </div>
  );
}
