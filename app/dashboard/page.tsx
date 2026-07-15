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
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-900 sm:p-6">
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

  const romeTodayLong = new Intl.DateTimeFormat('it-IT', {
    timeZone: 'Europe/Rome',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const romeTodayShort = new Intl.DateTimeFormat('it-IT', {
    timeZone: 'Europe/Rome',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date());

  return (
    <main className="min-h-screen bg-brand-sand">
      <header className="border-b border-brand-sand-dark bg-brand-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-5">
              <Logo theme="light" variant="mark" className="shrink-0 sm:hidden" />
              <Logo theme="light" className="hidden shrink-0 sm:inline-flex" />
              <div className="min-w-0">
                <h1 className="truncate font-display text-base font-semibold sm:text-lg">
                  {company.name}
                </h1>
                <p className="truncate text-xs text-white/60">
                  <span className="sm:hidden">{accountLabel}</span>
                  <span className="hidden sm:inline">
                    {session.email} · {accountLabel}
                  </span>
                </p>
                <p className="truncate text-xs text-white/45 sm:hidden">{session.email}</p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-4">
              <div className="text-right text-sm text-white/70">
                <p className="hidden font-medium capitalize text-white sm:block">{romeTodayLong}</p>
                <p className="font-medium capitalize text-white sm:hidden">{romeTodayShort}</p>
                <p className="text-xs sm:text-sm">
                  {jobs.length} intervent{jobs.length === 1 ? 'o' : 'i'} oggi
                </p>
              </div>
              <LogoutButton theme="light" />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-5 safe-bottom sm:py-8">
        <CreateJobForm
          customers={customers}
          technicians={technicians}
          isSolo={isSolo}
        />

        <div className="mb-4 sm:mb-6">
          <h2 className="font-display text-base font-semibold text-brand-navy sm:text-lg">
            Interventi di oggi
          </h2>
          <p className="mt-1 text-sm text-brand-muted">{VOICE.examples.smsStub}</p>
        </div>

        <JobTable jobs={serializedJobs} technicians={technicians} isSolo={isSolo} />
      </div>
    </main>
  );
}