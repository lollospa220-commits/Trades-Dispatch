'use server';

import { revalidatePath } from 'next/cache';
import { JobStatus } from '@prisma/client';
import { sessionOrError } from '@/lib/action-auth';
import { parseScheduleRome } from '@/lib/parseSchedule';
import { formatDateRome, formatTimeRome } from '@/lib/dates';
import { prisma } from '@/lib/prisma';
import {
  sendTechnicianAssignedSms,
  sendTechnicianEnRouteSms,
} from '@/lib/notifications';

export type ActionResult = { ok: true } | { ok: false; error: string };
export type CreateJobResult = ActionResult;

const VALID_STATUSES: JobStatus[] = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED'];

async function soloTechnicianId(companyId: string): Promise<string | null> {
  const tech = await prisma.technician.findFirst({
    where: { companyId, active: true },
    orderBy: { createdAt: 'asc' },
    select: { id: true },
  });
  return tech?.id ?? null;
}

async function jobInCompany(jobId: string, companyId: string) {
  return prisma.job.findFirst({
    where: { id: jobId, companyId },
    select: { id: true, companyId: true, status: true, title: true, startedAt: true },
  });
}

export async function createJob(
  _prev: CreateJobResult | null,
  formData: FormData,
): Promise<CreateJobResult> {
  const auth = await sessionOrError();
  if (!auth.ok) return auth;

  const title = String(formData.get('title') || '').trim();
  const description = String(formData.get('description') || '').trim() || null;
  const date = String(formData.get('date') || '');
  const time = String(formData.get('time') || '');
  let technicianId = String(formData.get('technicianId') || '').trim() || null;
  if (auth.accountType === 'SOLO' && !technicianId) {
    technicianId = await soloTechnicianId(auth.companyId);
  }
  const isNewCustomer = formData.get('newCustomer') === '1';

  if (!title) return { ok: false, error: 'Il titolo è obbligatorio.' };

  const scheduledAt = parseScheduleRome(date, time);
  if (!scheduledAt) return { ok: false, error: 'Data o ora non validi.' };

  try {
    let customerId = String(formData.get('customerId') || '').trim();

    if (isNewCustomer) {
      const name = String(formData.get('customerName') || '').trim();
      const phone = String(formData.get('customerPhone') || '').trim() || null;
      const address = String(formData.get('customerAddress') || '').trim() || null;
      if (!name) return { ok: false, error: 'Il nome del nuovo cliente è obbligatorio.' };

      const created = await prisma.customer.create({
        data: { name, phone, address, companyId: auth.companyId },
      });
      customerId = created.id;
    }

    if (!customerId) return { ok: false, error: 'Seleziona o crea un cliente.' };

    const customer = await prisma.customer.findFirst({
      where: { id: customerId, companyId: auth.companyId },
    });
    if (!customer) return { ok: false, error: 'Cliente non valido.' };

    let technician = null;
    if (technicianId) {
      technician = await prisma.technician.findFirst({
        where: { id: technicianId, companyId: auth.companyId, active: true },
      });
      if (!technician) return { ok: false, error: 'Tecnico non valido.' };
    }

    await prisma.job.create({
      data: {
        title,
        description,
        scheduledAt,
        status: 'SCHEDULED',
        companyId: auth.companyId,
        customerId,
        technicianId,
      },
    });

    if (technician?.phone) {
      const label = `${formatDateRome(scheduledAt)} ${formatTimeRome(scheduledAt)}`;
      await sendTechnicianAssignedSms(technician.phone, technician.name, title, label);
    }

    revalidatePath('/dashboard');
    return { ok: true };
  } catch (err) {
    console.error('[createJob]', err);
    return { ok: false, error: 'Errore durante la creazione dell\'intervento.' };
  }
}

export async function updateJob(formData: FormData): Promise<ActionResult> {
  const auth = await sessionOrError();
  if (!auth.ok) return auth;

  const id = String(formData.get('id') || '');
  const title = String(formData.get('title') || '').trim();
  const description = String(formData.get('description') || '').trim() || null;
  const date = String(formData.get('date') || '');
  const time = String(formData.get('time') || '');
  const technicianId = String(formData.get('technicianId') || '').trim() || null;

  if (!id || !title) return { ok: false, error: 'Dati non validi.' };
  const scheduledAt = parseScheduleRome(date, time);
  if (!scheduledAt) return { ok: false, error: 'Data o ora non validi.' };

  const existing = await prisma.job.findFirst({ where: { id, companyId: auth.companyId } });
  if (!existing) return { ok: false, error: 'Intervento non trovato.' };

  if (technicianId) {
    const tech = await prisma.technician.findFirst({
      where: { id: technicianId, companyId: auth.companyId, active: true },
    });
    if (!tech) return { ok: false, error: 'Tecnico non valido.' };
  }

  await prisma.job.update({
    where: { id },
    data: { title, description, scheduledAt, technicianId },
  });

  revalidatePath('/dashboard');
  return { ok: true };
}

export async function deleteJob(id: string): Promise<ActionResult> {
  const auth = await sessionOrError();
  if (!auth.ok) return auth;

  const job = await jobInCompany(id, auth.companyId);
  if (!job) return { ok: false, error: 'Intervento non trovato.' };

  await prisma.job.delete({ where: { id } });
  revalidatePath('/dashboard');
  return { ok: true };
}

export async function assignTechnicianToJob(
  jobId: string,
  technicianId: string,
): Promise<ActionResult> {
  const auth = await sessionOrError();
  if (!auth.ok) return auth;

  if (!jobId || !technicianId) {
    return { ok: false, error: 'Job e tecnico sono obbligatori.' };
  }

  try {
    const job = await prisma.job.findFirst({
      where: { id: jobId, companyId: auth.companyId },
      include: { customer: { select: { name: true } } },
    });
    if (!job) return { ok: false, error: 'Intervento non trovato.' };

    const technician = await prisma.technician.findFirst({
      where: { id: technicianId, companyId: auth.companyId, active: true },
    });
    if (!technician) {
      return { ok: false, error: 'Tecnico non valido per questa azienda.' };
    }

    await prisma.job.update({
      where: { id: jobId },
      data: { technicianId },
    });

    if (technician.phone) {
      const label = `${formatDateRome(job.scheduledAt)} ${formatTimeRome(job.scheduledAt)}`;
      await sendTechnicianAssignedSms(technician.phone, technician.name, job.title, label);
    }

    revalidatePath('/dashboard');
    return { ok: true };
  } catch (err) {
    console.error('[assignTechnicianToJob]', err);
    return { ok: false, error: 'Errore durante l\'assegnazione.' };
  }
}

export async function updateJobStatus(
  jobId: string,
  status: JobStatus,
): Promise<ActionResult> {
  const auth = await sessionOrError();
  if (!auth.ok) return auth;

  if (!jobId || !VALID_STATUSES.includes(status)) {
    return { ok: false, error: 'Stato non valido.' };
  }

  try {
    const existing = await prisma.job.findFirst({
      where: { id: jobId, companyId: auth.companyId },
      include: {
        customer: { select: { name: true, phone: true } },
        technician: { select: { name: true } },
      },
    });
    if (!existing) return { ok: false, error: 'Intervento non trovato.' };

    const now = new Date();
    const data: {
      status: JobStatus;
      startedAt?: Date | null;
      completedAt?: Date | null;
    } = { status };

    if (status === 'IN_PROGRESS' && existing.status !== 'IN_PROGRESS') {
      data.startedAt = now;
    }
    if (status === 'COMPLETED') {
      data.completedAt = now;
      if (!existing.startedAt) data.startedAt = now;
    }
    if (status === 'SCHEDULED') {
      data.startedAt = null;
      data.completedAt = null;
    }

    const updated = await prisma.job.update({
      where: { id: jobId },
      data,
      include: {
        customer: { select: { name: true, phone: true } },
        technician: { select: { name: true } },
      },
    });

    if (
      status === 'IN_PROGRESS' &&
      existing.status !== 'IN_PROGRESS' &&
      updated.customer.phone
    ) {
      await sendTechnicianEnRouteSms({
        to: updated.customer.phone,
        customerName: updated.customer.name,
        technicianName: updated.technician?.name ?? 'Il nostro tecnico',
        jobTitle: updated.title,
      });
    }

    revalidatePath('/dashboard');
    return { ok: true };
  } catch (err) {
    console.error('[updateJobStatus]', err);
    return { ok: false, error: 'Errore durante l\'aggiornamento dello stato.' };
  }
}