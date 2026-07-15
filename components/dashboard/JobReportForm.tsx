'use client';

import { saveJobReport } from '@/app/actions/reports';
import SignaturePad from '@/components/dashboard/SignaturePad';
import { useState } from 'react';

export default function JobReportForm({
  jobId,
  jobTitle,
  initial,
}: {
  jobId: string;
  jobTitle: string;
  initial: {
    workNotes: string;
    signedByName: string;
    signatureData: string | null;
    photoData: string | null;
  };
}) {
  const [signature, setSignature] = useState<string | null>(initial.signatureData);
  const [photo, setPhoto] = useState<string | null>(initial.photoData);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="brand-card space-y-4 p-4 sm:p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        const fd = new FormData(e.currentTarget);
        fd.set('signatureData', signature || '');
        fd.set('photoData', photo || '');
        const res = await saveJobReport(fd);
        setMessage(res.ok ? 'Rapportino salvato.' : res.error);
        setPending(false);
      }}
    >
      <input type="hidden" name="jobId" value={jobId} />
      <h2 className="font-display text-lg font-semibold text-brand-navy">Rapportino — {jobTitle}</h2>

      <label className="block">
        <span className="brand-label">Lavoro eseguito</span>
        <textarea
          name="workNotes"
          rows={4}
          defaultValue={initial.workNotes}
          placeholder="Descrivi cosa hai fatto, materiali usati, esito test…"
          className="brand-input mt-1.5"
        />
      </label>

      <label className="block">
        <span className="brand-label">Nome cliente (firma)</span>
        <input
          name="signedByName"
          defaultValue={initial.signedByName}
          placeholder="Nome e cognome"
          className="brand-input mt-1.5"
        />
      </label>

      <div>
        <span className="brand-label">Firma cliente</span>
        <div className="mt-1.5">
          <SignaturePad onChange={setSignature} />
        </div>
      </div>

      <label className="block">
        <span className="brand-label">Foto lavoro (opzionale)</span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="brand-input mt-1.5"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => setPhoto(String(reader.result));
            reader.readAsDataURL(file);
          }}
        />
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="Anteprima foto" className="mt-2 max-h-40 rounded-lg border" />
        )}
      </label>

      {message && <p className="text-sm text-brand-teal">{message}</p>}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={pending} className="brand-btn-dark">
          {pending ? 'Salvataggio…' : 'Salva rapportino'}
        </button>
        <a
          href={`/api/jobs/${jobId}/report.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="brand-btn-primary inline-flex items-center"
        >
          Scarica PDF
        </a>
      </div>
    </form>
  );
}