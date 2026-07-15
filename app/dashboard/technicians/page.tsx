import { createTechnician, updateTechnician } from '@/app/actions/technicians';
import ToggleTechnicianButton from '@/components/dashboard/ToggleTechnicianButton';
import { PLAN_LIMITS, technicianLimitLabel } from '@/lib/plans';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function TechniciansPage() {
  const session = await getSession();
  if (!session) return null;
  if (session.accountType === 'SOLO') redirect('/dashboard');

  const company = await prisma.company.findUnique({
    where: { id: session.companyId },
    select: { plan: true },
  });
  if (!company) return null;

  const technicians = await prisma.technician.findMany({
    where: { companyId: session.companyId },
    orderBy: [{ active: 'desc' }, { name: 'asc' }],
  });

  const activeCount = technicians.filter((t) => t.active).length;
  const limit = PLAN_LIMITS[company.plan].technicians;

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-lg font-semibold text-brand-navy">Tecnici</h2>
        <p className="text-sm text-brand-muted">
          {activeCount} attivi · limite piano {technicianLimitLabel(company.plan)} (
          {limit >= 999 ? '∞' : limit})
        </p>
      </div>

      <form action={createTechnician} className="brand-card mb-6 grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
        <h3 className="font-display text-sm font-semibold text-brand-navy sm:col-span-2">Nuovo tecnico</h3>
        <input name="name" required placeholder="Nome e cognome *" className="brand-input" />
        <input name="phone" type="tel" placeholder="Telefono (SMS assegnazioni)" className="brand-input" />
        <input name="email" type="email" placeholder="Email" className="brand-input sm:col-span-2" />
        <button type="submit" className="brand-btn-dark sm:col-span-2 sm:w-auto">
          Aggiungi tecnico
        </button>
      </form>

      <ul className="space-y-3">
        {technicians.map((t) => (
          <li key={t.id} className="brand-card p-4">
            <form action={updateTechnician} className="grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={t.id} />
              <input name="name" required defaultValue={t.name} className="brand-input" />
              <input name="phone" type="tel" defaultValue={t.phone ?? ''} className="brand-input" />
              <input
                name="email"
                type="email"
                defaultValue={t.email ?? ''}
                className="brand-input sm:col-span-2"
              />
              <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
                <button type="submit" className="brand-btn-primary text-xs">
                  Salva
                </button>
                <ToggleTechnicianButton id={t.id} active={t.active} />
                <span
                  className={`text-xs font-semibold ${t.active ? 'text-brand-teal' : 'text-brand-muted'}`}
                >
                  {t.active ? 'Attivo' : 'Inattivo'}
                </span>
              </div>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}