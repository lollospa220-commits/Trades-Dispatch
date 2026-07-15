import Logo from '@/components/brand/Logo';
import CreateJobForm from '@/components/dashboard/CreateJobForm';
import JobTable from '@/components/dashboard/JobTable';
import LogoutButton from '@/components/dashboard/LogoutButton';
import { VOICE } from '@/lib/brand';
import { todayRangeInRome } from '@/lib/dates';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const company = await prisma.company.findUnique({
    where: { id: session.companyId },
    select: { id: true, name: true, accountType: true },
  });

  if (!company) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          <h1 className="text-lg font-semibold">Azienda non trovata</h1>
          <p className="mt-2 text-sm">Esegui il seed o contatta il supporto.</p>
        </div>
      </main>
    );
  }

  const { start, end } = todayRangeInRome();

  const [jobs, technicians, customers] = await Promise.all([
    prisma.job.findMany({
      where: {
        companyId: company.id,
        scheduledAt: { gte: start, lte: end },
      },
      orderBy: { scheduledAt: 'asc' },
      include: {
        customer: { select: { name: true, address: true } },
        technician: { select: { id: true, name: true } },
      },
    }),
    prisma.technician.findMany({
      where: { companyId: company.id, active: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
    prisma.customer.findMany({
      where: { companyId: company.id },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
  ]);

  const isSolo = company.accountType === 'SOLO';
  const accountLabel = isSolo ? 'Operatore singolo' : 'Azienda con team';

  const serializedJobs = jobs.map((j) => ({
    id: j.id,
    title: j.title,
    status: j.status,
    scheduledAt: j.scheduledAt.toISOString(),
    customer: j.customer,
    technician: j.technician,
  }));

  const romeToday = new Intl.DateTimeFormat('it-IT', {
    timeZone: 'Europe/Rome',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <main className="min-h-screen bg-brand-sand">
      <header className="border-b border-brand-sand-dark bg-brand-navy text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div className="flex flex-wrap items-center gap-5">
            <Logo theme="light" />
            <div className="hidden h-8 w-px bg-white/15 sm:block" aria-hidden />
            <div>
              <h1 className="font-display text-lg font-semibold">{company.name}</h1>
              <p className="text-xs text-white/60">
                {session.email} · {accountLabel}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-sm text-white/70">
              <p className="font-medium capitalize text-white">{romeToday}</p>
              <p>{jobs.length} interventi oggi</p>
            </div>
            <LogoutButton theme="light" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <CreateJobForm
          customers={customers}
          technicians={technicians}
          isSolo={isSolo}
        />

        <div className="mb-6">
          <h2 className="font-display text-lg font-semibold text-brand-navy">Interventi di oggi</h2>
          <p className="text-sm text-brand-muted">{VOICE.examples.smsStub}</p>
        </div>

        <JobTable jobs={serializedJobs} technicians={technicians} isSolo={isSolo} />
      </div>
    </main>
  );
}