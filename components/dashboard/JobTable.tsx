'use client';

import { JobStatus } from '@prisma/client';
import { useTransition } from 'react';
import { assignTechnicianToJob, deleteJob, updateJobStatus } from '@/app/actions/jobs';
import JobCard, {
  InvoiceLink,
  StatusBadge,
  StatusSelect,
  TechnicianSelect,
  type DashboardJob,
  type TechnicianOption,
} from '@/components/dashboard/JobCard';
import { formatDateRome, formatTimeRome } from '@/lib/dates';
import Link from 'next/link';
import { VOICE } from '@/lib/brand';

export type { DashboardJob } from '@/components/dashboard/JobCard';

export default function JobTable({
  jobs,
  technicians,
  isSolo = false,
  showActions = false,
  emptyCta,
}: {
  jobs: DashboardJob[];
  technicians: TechnicianOption[];
  isSolo?: boolean;
  showActions?: boolean;
  emptyCta?: { href: string; label: string };
}) {
  const [pending, startTransition] = useTransition();

  const onAssign = (jobId: string, technicianId: string) => {
    startTransition(async () => {
      await assignTechnicianToJob(jobId, technicianId);
    });
  };

  const onStatus = (jobId: string, status: JobStatus) => {
    startTransition(async () => {
      await updateJobStatus(jobId, status);
    });
  };

  const onDelete = (jobId: string) => {
    if (!confirm('Eliminare questo intervento?')) return;
    startTransition(() => {
      void deleteJob(jobId);
    });
  };

  if (jobs.length === 0) {
    return (
      <div className="brand-card border-dashed px-4 py-12 text-center sm:px-6 sm:py-16">
        <p className="text-sm font-medium text-brand-muted">{VOICE.examples.emptyState}</p>
        {emptyCta && (
          <a href={emptyCta.href} className="brand-btn-primary mt-5 px-6">
            {emptyCta.label}
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="brand-card overflow-hidden p-0">
      {/* Mobile e tablet: card */}
      <ul className="divide-y divide-brand-sand-dark lg:hidden">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            technicians={technicians}
            isSolo={isSolo}
            showActions={showActions}
            pending={pending}
            onAssign={onAssign}
            onStatus={onStatus}
            onDelete={onDelete}
          />
        ))}
      </ul>

      {/* Desktop: tabella */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-brand-sand-dark text-left text-sm">
          <thead className="bg-brand-sand">
            <tr>
              <th className="px-4 py-3 font-semibold text-brand-muted">Orario</th>
              <th className="px-4 py-3 font-semibold text-brand-muted">Cliente</th>
              <th className="px-4 py-3 font-semibold text-brand-muted">Intervento</th>
              {!isSolo && (
                <th className="px-4 py-3 font-semibold text-brand-muted">Tecnico</th>
              )}
              <th className="px-4 py-3 font-semibold text-brand-muted">Stato</th>
              <th className="px-4 py-3 font-semibold text-brand-muted">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-sand-dark/60">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-brand-sand/80">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-brand-navy">
                  {formatTimeRome(job.scheduledAt)}
                  <div className="text-xs font-normal text-brand-muted">
                    {formatDateRome(job.scheduledAt)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-brand-navy">{job.customer.name}</div>
                  {job.customer.address && (
                    <div className="text-xs text-brand-muted">{job.customer.address}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-brand-ink">{job.title}</td>
                {!isSolo && (
                  <td className="px-4 py-3">
                    <TechnicianSelect
                      jobId={job.id}
                      technicianId={job.technician?.id ?? ''}
                      technicians={technicians}
                      pending={pending}
                      disabled={job.status === 'COMPLETED'}
                      onAssign={onAssign}
                      className="min-w-[140px] py-1.5"
                    />
                  </td>
                )}
                <td className="px-4 py-3">
                  <StatusBadge status={job.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusSelect
                      jobId={job.id}
                      status={job.status}
                      pending={pending}
                      onStatus={onStatus}
                      className="py-1.5"
                    />
                    {showActions && (
                      <>
                        <InvoiceLink
                          job={job}
                          className="text-xs font-semibold text-brand-blue hover:underline"
                        />
                        <Link
                          href={`/dashboard/jobs/${job.id}/report`}
                          className="text-xs font-semibold text-brand-teal hover:underline"
                        >
                          Rapportino
                        </Link>
                        <Link
                          href={`/dashboard/jobs/${job.id}/edit`}
                          className="text-xs font-semibold text-brand-blue hover:underline"
                        >
                          Modifica
                        </Link>
                        <button
                          type="button"
                          onClick={() => onDelete(job.id)}
                          className="text-xs font-semibold text-red-600 hover:underline"
                        >
                          Elimina
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pending && (
        <div className="border-t border-brand-sand-dark bg-brand-sand px-4 py-2 text-xs text-brand-muted">
          Aggiornamento in corso…
        </div>
      )}
    </div>
  );
}
