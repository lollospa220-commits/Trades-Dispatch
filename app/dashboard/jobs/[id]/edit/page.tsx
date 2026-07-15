import EditJobForm from '@/components/dashboard/EditJobForm';
import { romeDateString, romeTimeString } from '@/lib/dates';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return null;

  const { id } = await params;
  const job = await prisma.job.findFirst({
    where: { id, companyId: session.companyId },
    include: { company: { select: { accountType: true } } },
  });
  if (!job) notFound();

  const technicians = await prisma.technician.findMany({
    where: { companyId: session.companyId, active: true },
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });

  const date = romeDateString(job.scheduledAt);
  const time = romeTimeString(job.scheduledAt);

  return (
    <div>
      <Link href="/dashboard" className="text-sm font-semibold text-brand-blue hover:underline">
        ← Torna all&apos;agenda
      </Link>
      <h2 className="font-display mt-4 text-lg font-semibold text-brand-navy">Modifica intervento</h2>
      <div className="mt-4">
        <EditJobForm
          job={{
            id: job.id,
            title: job.title,
            description: job.description,
            date,
            time,
            technicianId: job.technicianId ?? '',
          }}
          technicians={technicians}
          isSolo={job.company.accountType === 'SOLO'}
        />
      </div>
    </div>
  );
}