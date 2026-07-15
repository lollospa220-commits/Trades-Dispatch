'use client';

import { JobStatus } from '@prisma/client';
import { useTransition } from 'react';
import { assignTechnicianToJob, deleteJob, updateJobStatus } from '@/app/actions/jobs';
import { formatDateRome, formatTimeRome } from '@/lib/dates';
import Link from 'next/link';
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

function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function StatusSelect({
  jobId,
  status,
  pending,
  onStatus,
  className = '',
}: {
  jobId: string;
  status: JobStatus;
  pending: boolean;
  onStatus: (jobId: string, status: JobStatus) => void;
  className?: string;
}) {
  return (
    <select
      className={`brand-input py-2 ${className}`}
      value={status}
      disabled={pending}
      aria-label="Cambia stato intervento"
      onChange={(e) => onStatus(jobId, e.target.value as JobStatus)}
    >
      <option value="SCHEDULED">Programmato</option>
      <option value="IN_PROGRESS">In corso</option>
      <option value="COMPLETED">Completato</option>
    </select>
  );
}

function TechnicianSelect({
  jobId,
  technicianId,
  technicians,
  pending,
  disabled,
  onAssign,
  className = '',
}: {
  jobId: string;
  technicianId: string;
  technicians: TechnicianOption[];
  pending: boolean;
  disabled: boolean;
  onAssign: (jobId: string, technicianId: string) => void;
  className?: string;
}) {
  return (
    <select
      className={`brand-input py-2 ${className}`}
      value={technicianId}
      disabled={pending || disabled}
      aria-label="Assegna tecnico"
      onChange={(e) => {
        if (e.target.value) onAssign(jobId, e.target.value);
      }}
    >
      <option value="">— Assegna —</option>
      {technicians.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </select>
  );
}

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
      {/* Mobile: card layout */}
      <ul className="divide-y divide-brand-sand-dark md:hidden">
        {jobs.map((job) => (
          <li key={job.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-lg font-bold text-brand-navy">
                  {formatTimeRome(job.scheduledAt)}
                </p>
                <p className="mt-1 font-medium text-brand-ink">{job.customer.name}</p>
                {job.customer.address && (
                  <p className="mt-0.5 text-xs text-brand-muted">{job.customer.address}</p>
                )}
              </div>
              <StatusBadge status={job.status} />
            </div>

            <p className="mt-3 text-sm text-brand-ink">{job.title}</p>
            <p className="mt-1 text-xs text-brand-muted">{formatDateRome(job.scheduledAt)}</p>

            {!isSolo && (
              <div className="mt-4">
                <p className="brand-label mb-1.5">Tecnico</p>
                <TechnicianSelect
                  jobId={job.id}
                  technicianId={job.technician?.id ?? ''}
                  technicians={technicians}
                  pending={pending}
                  disabled={job.status === 'COMPLETED'}
                  onAssign={onAssign}
                  className="w-full"
                />
              </div>
            )}

            <div className="mt-4">
              <p className="brand-label mb-1.5">Stato</p>
              <StatusSelect
                jobId={job.id}
                status={job.status}
                pending={pending}
                onStatus={onStatus}
                className="w-full"
              />
            </div>

            {showActions && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/dashboard/jobs/${job.id}/report`}
                  className="rounded-lg border border-brand-teal/40 bg-brand-teal-light px-3 py-2 text-xs font-semibold text-brand-teal"
                >
                  Rapportino
                </Link>
                <Link
                  href={`/dashboard/jobs/${job.id}/edit`}
                  className="brand-btn-primary flex-1 py-2 text-center text-xs"
                >
                  Modifica
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(job.id)}
                  disabled={pending}
                  className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
                >
                  Elimina
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto md:block">
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