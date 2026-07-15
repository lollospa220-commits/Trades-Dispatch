'use client';

import { JobStatus } from '@prisma/client';
import { useTransition } from 'react';
import { assignTechnicianToJob, updateJobStatus } from '@/app/actions/jobs';
import { formatTimeRome } from '@/lib/dates';
import { VOICE } from '@/lib/brand';

export type DashboardJob = {
  id: string;
  title: string;
  status: JobStatus;
  scheduledAt: string;
  customer: { name: string; address: string | null };
  technician: { id: string; name: string } | null;
};

type TechnicianOption = { id: string; name: string };

const STATUS_LABEL: Record<JobStatus, string> = {
  SCHEDULED: 'Programmato',
  IN_PROGRESS: 'In corso',
  COMPLETED: 'Completato',
};

const STATUS_STYLE: Record<JobStatus, string> = {
  SCHEDULED: 'bg-brand-sand text-brand-ink ring-brand-sand-dark',
  IN_PROGRESS: 'bg-brand-amber-light text-brand-amber ring-brand-amber/30',
  COMPLETED: 'bg-brand-teal-light text-brand-teal ring-brand-teal/30',
};

export default function JobTable({
  jobs,
  technicians,
}: {
  jobs: DashboardJob[];
  technicians: TechnicianOption[];
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

  if (jobs.length === 0) {
    return (
      <div className="brand-card border-dashed px-6 py-16 text-center">
        <p className="text-sm font-medium text-brand-muted">{VOICE.examples.emptyState}</p>
      </div>
    );
  }

  return (
    <div className="brand-card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-sand-dark text-left text-sm">
          <thead className="bg-brand-sand">
            <tr>
              <th className="px-4 py-3 font-semibold text-brand-muted">Orario</th>
              <th className="px-4 py-3 font-semibold text-brand-muted">Cliente</th>
              <th className="px-4 py-3 font-semibold text-brand-muted">Intervento</th>
              <th className="px-4 py-3 font-semibold text-brand-muted">Tecnico</th>
              <th className="px-4 py-3 font-semibold text-brand-muted">Stato</th>
              <th className="px-4 py-3 font-semibold text-brand-muted">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-sand-dark/60">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-brand-sand/80">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-brand-navy">
                  {formatTimeRome(job.scheduledAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-brand-navy">{job.customer.name}</div>
                  {job.customer.address && (
                    <div className="text-xs text-brand-muted">{job.customer.address}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-brand-ink">{job.title}</td>
                <td className="px-4 py-3">
                  <select
                    className="brand-input min-w-[140px] py-1.5"
                    value={job.technician?.id ?? ''}
                    disabled={pending || job.status === 'COMPLETED'}
                    onChange={(e) => {
                      if (e.target.value) onAssign(job.id, e.target.value);
                    }}
                  >
                    <option value="">— Assegna —</option>
                    {technicians.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLE[job.status]}`}
                  >
                    {STATUS_LABEL[job.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    className="brand-input py-1.5"
                    value={job.status}
                    disabled={pending}
                    onChange={(e) => onStatus(job.id, e.target.value as JobStatus)}
                  >
                    <option value="SCHEDULED">Programmato</option>
                    <option value="IN_PROGRESS">In corso</option>
                    <option value="COMPLETED">Completato</option>
                  </select>
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