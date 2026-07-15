import CreateJobForm from '@/components/dashboard/CreateJobForm';
import AgendaTabs, { type AgendaCounts, type AgendaView } from '@/components/dashboard/AgendaTabs';
import JobSearch from '@/components/dashboard/JobSearch';
import JobTable from '@/components/dashboard/JobTable';
import OnboardingBanner from '@/components/dashboard/OnboardingBanner';
import { VOICE } from '@/lib/brand';
import { todayRangeInRome, weekRangeInRome } from '@/lib/dates';
import { formatEuro } from '@/lib/invoices';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<{ view?: string; q?: string }>;
};

function parseView(raw?: string): AgendaView {
  if (raw === 'week' || raw === 'history') return raw;
  return 'today';
}

function KpiTile({
  label,
  value,
  tone,
  href,
}: {
  label: string;
  value: string;
  tone: 'navy' | 'amber' | 'teal' | 'blue';
  href?: string;
}) {
  const toneClass = {
    navy: 'text-brand-navy',
    amber: 'text-brand-amber',
    teal: 'text-brand-teal',
    blue: 'text-brand-blue',
  }[tone];

  const inner = (
    <>
      <p className={`font-display text-2xl font-extrabold tabular-nums ${toneClass}`}>{value}</p>
      <p className="mt-0.5 text-xs font-medium text-brand-muted">{label}</p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="brand-card block p-3 transition hover:ring-2 hover:ring-brand-blue/30 sm:p-4">
        {inner}
      </Link>
    );
  }
  return <div className="brand-card p-3 sm:p-4">{inner}</div>;
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
  const today = todayRangeInRome();
  const week = weekRangeInRome();

  let range: { start: Date; end: Date };
  if (view === 'week') {
    range = week;
  } else if (view === 'history') {
    range = { start: new Date(0), end: new Date() };
  } else {
    range = today;
  }

  const [jobs, technicians, customers, todayByStatus, weekCount, historyCount, toCollect] =
    await Promise.all([
      prisma.job.findMany({
        where: {
          companyId: company.id,
          scheduledAt: view === 'history' ? { lt: today.start } : { gte: range.start, lte: range.end },
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
        select: {
          id: true,
          title: true,
          status: true,
          scheduledAt: true,
          customer: { select: { name: true, address: true } },
          technician: { select: { id: true, name: true } },
          invoices: { select: { id: true }, take: 1, orderBy: { createdAt: 'desc' } },
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
      prisma.job.groupBy({
        by: ['status'],
        where: { companyId: company.id, scheduledAt: { gte: today.start, lte: today.end } },
        _count: true,
      }),
      prisma.job.count({
        where: { companyId: company.id, scheduledAt: { gte: week.start, lte: week.end } },
      }),
      prisma.job.count({
        where: { companyId: company.id, scheduledAt: { lt: today.start } },
      }),
      prisma.invoice.aggregate({
        where: { companyId: company.id, status: 'SENT' },
        _sum: { totalCents: true },
      }),
    ]);

  const serializedJobs = jobs.map((j) => ({
    id: j.id,
    title: j.title,
    status: j.status,
    scheduledAt: j.scheduledAt.toISOString(),
    customer: j.customer,
    technician: j.technician,
    invoiceId: j.invoices[0]?.id ?? null,
  }));

  const countFor = (status: string) =>
    todayByStatus.find((c) => c.status === status)?._count ?? 0;
  const todayTotal = todayByStatus.reduce((s, c) => s + c._count, 0);
  const toCollectCents = toCollect._sum.totalCents ?? 0;

  const counts: AgendaCounts = { today: todayTotal, week: weekCount, history: historyCount };

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

      {/* KPI del giorno */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:mb-6 lg:grid-cols-4">
        <KpiTile label="Interventi oggi" value={String(todayTotal)} tone="navy" />
        <KpiTile label="In corso" value={String(countFor('IN_PROGRESS'))} tone="amber" />
        <KpiTile label="Completati oggi" value={String(countFor('COMPLETED'))} tone="teal" />
        <KpiTile
          label="Da incassare"
          value={formatEuro(toCollectCents)}
          tone="blue"
          href="/dashboard/invoices?status=sent"
        />
      </div>

      <CreateJobForm customers={customers} technicians={technicians} isSolo={isSolo} />

      <AgendaTabs view={view} q={q} counts={counts} />
      <Suspense fallback={null}>
        <JobSearch />
      </Suspense>

      <div className="mb-4 sm:mb-6">
        <h2 className="font-display text-base font-semibold text-brand-navy sm:text-lg">
          {viewTitles[view]}
        </h2>
        <p className="mt-1 text-sm text-brand-muted">{VOICE.examples.smsStub}</p>
      </div>

      <JobTable
        jobs={serializedJobs}
        technicians={technicians}
        isSolo={isSolo}
        showActions
        emptyCta={
          view === 'history'
            ? undefined
            : { href: '#nuovo-intervento', label: 'Crea il primo intervento' }
        }
      />

      {/* FAB mobile: crea intervento da qualsiasi punto della pagina */}
      <a
        href="#nuovo-intervento"
        className="fixed bottom-5 right-4 z-40 flex min-h-12 items-center gap-2 rounded-full bg-brand-amber px-5 font-display text-sm font-bold text-brand-navy shadow-lg shadow-brand-amber/30 active:scale-95 lg:hidden"
      >
        ＋ Nuovo intervento
      </a>
    </>
  );
}
