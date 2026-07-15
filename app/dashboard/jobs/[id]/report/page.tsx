import JobReportForm from '@/components/dashboard/JobReportForm';
import { formatDateRome, formatTimeRome } from '@/lib/dates';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function JobReportPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return null;

  const { id } = await params;
  const job = await prisma.job.findFirst({
    where: { id, companyId: session.companyId },
    include: {
      customer: { select: { name: true, address: true } },
      technician: { select: { name: true } },
      report: true,
      company: { select: { name: true } },
    },
  });
  if (!job) notFound();

  const when = `${formatDateRome(job.scheduledAt)} ${formatTimeRome(job.scheduledAt)}`;

  return (
    <div>
      <Link href="/dashboard" className="text-sm font-semibold text-brand-blue hover:underline">
        ← Agenda
      </Link>
      <p className="mt-2 text-sm text-brand-muted">
        {job.company.name} · {job.customer.name} · {when}
        {job.technician ? ` · ${job.technician.name}` : ''}
      </p>
      <div className="mt-4">
        <JobReportForm
          jobId={job.id}
          jobTitle={job.title}
          initial={{
            workNotes: job.report?.workNotes ?? '',
            signedByName: job.report?.signedByName ?? job.customer.name,
            signatureData: job.report?.signatureData ?? null,
            photoData: job.report?.photoData ?? null,
          }}
        />
      </div>
    </div>
  );
}