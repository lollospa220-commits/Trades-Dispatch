import CreateJobForm from '@/components/dashboard/CreateJobForm';
import AgendaTabs, { type AgendaView } from '@/components/dashboard/AgendaTabs';
import JobSearch from '@/components/dashboard/JobSearch';
import JobTable from '@/components/dashboard/JobTable';
import OnboardingBanner from '@/components/dashboard/OnboardingBanner';
import { VOICE } from '@/lib/brand';
import { todayRangeInRome, weekRangeInRome } from '@/lib/dates';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<{ view?: string; q?: string }>;
};

function parseView(raw?: string): AgendaView {
  if (raw === 'week' || raw === 'history') return raw;
  return 'today';
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session) return null;

  const { view: viewRaw, q } = await searchParams;
  const view = parseView(viewRaw);
  const query = (q || '').trim().toLowerCase();

  const company = await prisma.company.findUnique({
    where: { id: session.companyId },
    select: { id: true, accountType: true },
  });
  if (!company) return null;

  const isSolo = company.accountType === 'SOLO';

  let range: { start: Date; end: Date };
  if (view === 'week') {
    range = weekRangeInRome();
  } else if (view === 'history') {
    range = { start: new Date(0), end: new Date() };
  } else {
    range = todayRangeInRome();
  }

  const [jobs, technicians, customers] = await Promise.all([
    prisma.job.findMany({
      where: {
        companyId: company.id,
        scheduledAt: view === 'history' ? { lt: todayRangeInRome().start } : { gte: range.start, lte: range.end },
        ...(view === 'history' ? {} : {}),
        ...(query
          ? {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { customer: { name: { contains: query, mode: 'insensitive' } } },
              ],
            }
          : {}),
      },
      orderBy: { scheduledAt: view === 'history' ? 'desc' : 'asc' },
      take: view === 'history' ? 50 : undefined,
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

  const serializedJobs = jobs.map((j) => ({
    id: j.id,
    title: j.title,
    status: j.status,
    scheduledAt: j.scheduledAt.toISOString(),
    customer: j.customer,
    technician: j.technician,
  }));

  const viewTitles: Record<AgendaView, string> = {
    today: 'Interventi di oggi',
    week: 'Interventi della settimana',
    history: 'Storico interventi',
  };

  return (
    <>
      <OnboardingBanner
        hasCustomers={customers.length > 0}
        hasTechnicians={technicians.length > 0}
        isSolo={isSolo}
      />

      <CreateJobForm customers={customers} technicians={technicians} isSolo={isSolo} />

      <AgendaTabs view={view} q={q} />
      <Suspense fallback={null}>
        <JobSearch />
      </Suspense>

      <div className="mb-4 sm:mb-6">
        <h2 className="font-display text-base font-semibold text-brand-navy sm:text-lg">
          {viewTitles[view]}
        </h2>
        <p className="mt-1 text-sm text-brand-muted">{VOICE.examples.smsStub}</p>
      </div>

      <JobTable jobs={serializedJobs} technicians={technicians} isSolo={isSolo} showActions />
    </>
  );
}