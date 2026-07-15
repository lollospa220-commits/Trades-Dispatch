'use client';

import { updateJob, type ActionResult } from '@/app/actions/jobs';
import { useState } from 'react';

type Props = {
  job: {
    id: string;
    title: string;
    description: string | null;
    date: string;
    time: string;
    technicianId: string;
  };
  technicians: { id: string; name: string }[];
  isSolo: boolean;
};

export default function EditJobForm({ job, technicians, isSolo }: Props) {
  const [state, setState] = useState<ActionResult | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="brand-card space-y-4 p-4 sm:p-6"
      action={async (fd) => {
        setPending(true);
        const res = await updateJob(fd);
        setState(res);
        setPending(false);
      }}
    >
      <input type="hidden" name="id" value={job.id} />

      <label className="block">
        <span className="brand-label">Titolo *</span>
        <input name="title" required defaultValue={job.title} className="brand-input mt-1.5" />
      </label>

      <label className="block">
        <span className="brand-label">Descrizione</span>
        <textarea
          name="description"
          rows={2}
          defaultValue={job.description ?? ''}
          className="brand-input mt-1.5"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="brand-label">Data *</span>
          <input name="date" type="date" required defaultValue={job.date} className="brand-input mt-1.5" />
        </label>
        <label className="block">
          <span className="brand-label">Ora *</span>
          <input name="time" type="time" required defaultValue={job.time} className="brand-input mt-1.5" />
        </label>
      </div>

      {!isSolo && (
        <label className="block">
          <span className="brand-label">Tecnico</span>
          <select name="technicianId" defaultValue={job.technicianId} className="brand-input mt-1.5">
            <option value="">— Nessuno —</option>
            {technicians.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
      )}

      {state && !state.ok && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      {state?.ok && (
        <p className="rounded-lg bg-brand-teal-light px-3 py-2 text-sm text-brand-teal">Salvato.</p>
      )}

      <button type="submit" disabled={pending} className="brand-btn-dark w-full sm:w-auto">
        {pending ? 'Salvataggio…' : 'Salva modifiche'}
      </button>
    </form>
  );
}