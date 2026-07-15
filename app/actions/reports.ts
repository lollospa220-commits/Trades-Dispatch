'use server';

import { revalidatePath } from 'next/cache';
import { sessionOrError } from '@/lib/action-auth';
import { prisma } from '@/lib/prisma';

export type ReportResult = { ok: true } | { ok: false; error: string };

const MAX_PHOTO_BYTES = 800_000;

export async function saveJobReport(formData: FormData): Promise<ReportResult> {
  const auth = await sessionOrError();
  if (!auth.ok) return auth;

  const jobId = String(formData.get('jobId') || '');
  const workNotes = String(formData.get('workNotes') || '').trim() || null;
  const signedByName = String(formData.get('signedByName') || '').trim() || null;
  const signatureData = String(formData.get('signatureData') || '').trim() || null;
  const photoData = String(formData.get('photoData') || '').trim() || null;

  if (!jobId) return { ok: false, error: 'Intervento non valido.' };
  if (photoData && photoData.length > MAX_PHOTO_BYTES) {
    return { ok: false, error: 'Foto troppo grande. Riduci la dimensione.' };
  }

  const job = await prisma.job.findFirst({
    where: { id: jobId, companyId: auth.companyId },
  });
  if (!job) return { ok: false, error: 'Intervento non trovato.' };

  await prisma.jobReport.upsert({
    where: { jobId },
    create: {
      jobId,
      companyId: auth.companyId,
      workNotes,
      signedByName,
      signatureData,
      photoData,
    },
    update: { workNotes, signedByName, signatureData, photoData },
  });

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/jobs/${jobId}/report`);
  return { ok: true };
}