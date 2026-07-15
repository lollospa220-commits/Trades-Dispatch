import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { todayRangeInRome } from '@/lib/dates';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login');

  const company = await prisma.company.findUnique({
    where: { id: session.companyId },
    select: { id: true, name: true, accountType: true },
  });

  if (!company) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
          <h1 className="text-lg font-semibold">Azienda non trovata</h1>
        </div>
      </main>
    );
  }

  const { start, end } = todayRangeInRome();
  const jobCount = await prisma.job.count({
    where: { companyId: company.id, scheduledAt: { gte: start, lte: end } },
  });

  const isSolo = company.accountType === 'SOLO';
  const accountLabel = isSolo ? 'Operatore singolo' : 'Azienda con team';
  const now = new Date();
  const dateLabel = new Intl.DateTimeFormat('it-IT', {
    timeZone: 'Europe/Rome',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now);
  const dateLabelShort = new Intl.DateTimeFormat('it-IT', {
    timeZone: 'Europe/Rome',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(now);

  return (
    <main className="min-h-screen bg-brand-sand">
      <DashboardHeader
        companyName={company.name}
        email={session.email}
        accountLabel={accountLabel}
        dateLabel={dateLabel}
        dateLabelShort={dateLabelShort}
        jobCount={jobCount}
        isSolo={isSolo}
      />
      <div className="mx-auto max-w-6xl px-4 py-5 safe-bottom sm:py-8">{children}</div>
    </main>
  );
}