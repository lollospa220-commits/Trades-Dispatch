import { createCustomer, deleteCustomer, updateCustomer } from '@/app/actions/customers';
import DeleteCustomerButton from '@/components/dashboard/DeleteCustomerButton';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function CustomersPage() {
  const session = await getSession();
  if (!session) return null;

  const customers = await prisma.customer.findMany({
    where: { companyId: session.companyId },
    orderBy: { name: 'asc' },
    include: { _count: { select: { jobs: true } } },
  });

  return (
    <div>
      <h2 className="font-display mb-6 text-lg font-semibold text-brand-navy">Clienti</h2>

      <form action={createCustomer} className="brand-card mb-6 grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
        <h3 className="font-display text-sm font-semibold text-brand-navy sm:col-span-2">Nuovo cliente</h3>
        <input name="name" required placeholder="Nome *" className="brand-input" />
        <input name="phone" type="tel" placeholder="Telefono (SMS)" className="brand-input" />
        <input name="email" type="email" placeholder="Email" className="brand-input" />
        <input name="address" placeholder="Indirizzo" className="brand-input" />
        <button type="submit" className="brand-btn-dark sm:col-span-2 sm:w-auto">
          Aggiungi cliente
        </button>
      </form>

      <ul className="space-y-3">
        {customers.map((c) => (
          <li key={c.id} className="brand-card p-4">
            <form action={updateCustomer} className="grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={c.id} />
              <input name="name" required defaultValue={c.name} className="brand-input" />
              <input name="phone" type="tel" defaultValue={c.phone ?? ''} className="brand-input" />
              <input name="email" type="email" defaultValue={c.email ?? ''} className="brand-input" />
              <input name="address" defaultValue={c.address ?? ''} className="brand-input" />
              <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
                <button type="submit" className="brand-btn-primary text-xs">
                  Salva
                </button>
                {c._count.jobs === 0 && <DeleteCustomerButton id={c.id} />}
                <span className="text-xs text-brand-muted">{c._count.jobs} interventi</span>
              </div>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}