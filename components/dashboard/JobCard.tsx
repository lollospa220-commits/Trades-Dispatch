'use client';

import type { JobStatus } from '@prisma/client';
import { formatDateRome, formatTimeRome } from '@/lib/dates';
import Link from 'next/link';

export type DashboardJob = {
  id: string;
  title: string;
  status: JobStatus;
  scheduledAt: string;
  customer: { name: string; address: string | null };
  technician: { id: string; name: string } | null;
  invoiceId: string | null;
};

export type TechnicianOption = { id: string; name: string };

export const STATUS_LABEL: Record<JobStatus, string> = {
  SCHEDULED: 'Programmato',
  IN_PROGRESS: 'In corso',
  COMPLETED: 'Completato',
};

export const STATUS_STYLE: Record<JobStatus, string> = {
  SCHEDULED: 'bg-brand-sand text-brand-ink ring-brand-sand-dark',
  IN_PROGRESS: 'bg-brand-amber-light text-brand-amber ring-brand-amber/30',
  COMPLETED: 'bg-brand-teal-light text-brand-teal ring-brand-teal/30',
};

export function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function StatusSelect({
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

export function TechnicianSelect({
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

/** Link Fattura: crea da intervento completato, o apre quella già emessa. */
export function InvoiceLink({
  job,
  className = '',
}: {
  job: Pick<DashboardJob, 'id' | 'status' | 'invoiceId'>;
  className?: string;
}) {
  if (job.invoiceId) {
    return (
      <Link href={`/dashboard/invoices/${job.invoiceId}`} className={className}>
        Vedi fattura
      </Link>
    );
  }
  if (job.status !== 'COMPLETED') return null;
  return (
    <Link href={`/dashboard/invoices/new?jobId=${job.id}`} className={className}>
      Fattura
    </Link>
  );
}

export default function JobCard({
  job,
  technicians,
  isSolo,
  showActions,
  pending,
  onAssign,
  onStatus,
  onDelete,
}: {
  job: DashboardJob;
  technicians: TechnicianOption[];
  isSolo: boolean;
  showActions: boolean;
  pending: boolean;
  onAssign: (jobId: string, technicianId: string) => void;
  onStatus: (jobId: string, status: JobStatus) => void;
  onDelete: (jobId: string) => void;
}) {
  return (
    <li className="p-4">
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
          <InvoiceLink
            job={job}
            className="flex min-h-11 items-center rounded-lg border border-brand-blue/40 bg-white px-3 text-xs font-semibold text-brand-blue"
          />
          <Link
            href={`/dashboard/jobs/${job.id}/report`}
            className="flex min-h-11 items-center rounded-lg border border-brand-teal/40 bg-brand-teal-light px-3 text-xs font-semibold text-brand-teal"
          >
            Rapportino
          </Link>
          <Link
            href={`/dashboard/jobs/${job.id}/edit`}
            className="brand-btn-primary min-h-11 flex-1 py-2 text-center text-xs"
          >
            Modifica
          </Link>
          <button
            type="button"
            onClick={() => onDelete(job.id)}
            disabled={pending}
            className="flex min-h-11 items-center rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-600"
          >
            Elimina
          </button>
        </div>
      )}
    </li>
  );
}
