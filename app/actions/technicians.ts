'use server';

import { revalidatePath } from 'next/cache';
import { sessionOrError } from '@/lib/action-auth';
import { canAddTechnician } from '@/lib/plans';
import { prisma } from '@/lib/prisma';

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createTechnician(formData: FormData): Promise<void> {
  await createTechnicianImpl(formData);
}

async function createTechnicianImpl(formData: FormData): Promise<ActionResult> {
  const auth = await sessionOrError();
  if (!auth.ok) return auth;
  if (auth.accountType === 'SOLO') {
    return { ok: false, error: 'Gli operatori singoli hanno un solo profilo tecnico.' };
  }

  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim() || null;
  const phone = String(formData.get('phone') || '').trim() || null;
  if (!name) return { ok: false, error: 'Il nome è obbligatorio.' };

  const company = await prisma.company.findUnique({
    where: { id: auth.companyId },
    select: { plan: true },
  });
  if (!company) return { ok: false, error: 'Azienda non trovata.' };

  const activeCount = await prisma.technician.count({
    where: { companyId: auth.companyId, active: true },
  });
  if (!canAddTechnician(company.plan, activeCount)) {
    return { ok: false, error: 'Limite tecnici del piano raggiunto. Passa a un piano superiore.' };
  }

  await prisma.technician.create({
    data: { name, email, phone, companyId: auth.companyId },
  });

  revalidatePath('/dashboard/technicians');
  revalidatePath('/dashboard');
  return { ok: true };
}

export async function updateTechnician(formData: FormData): Promise<void> {
  await updateTechnicianImpl(formData);
}

async function updateTechnicianImpl(formData: FormData): Promise<ActionResult> {
  const auth = await sessionOrError();
  if (!auth.ok) return auth;

  const id = String(formData.get('id') || '');
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim() || null;
  const phone = String(formData.get('phone') || '').trim() || null;
  if (!id || !name) return { ok: false, error: 'Dati non validi.' };

  const tech = await prisma.technician.findFirst({
    where: { id, companyId: auth.companyId },
  });
  if (!tech) return { ok: false, error: 'Tecnico non trovato.' };

  await prisma.technician.update({
    where: { id },
    data: { name, email, phone },
  });

  revalidatePath('/dashboard/technicians');
  revalidatePath('/dashboard');
  return { ok: true };
}

export async function toggleTechnicianActive(id: string, active: boolean): Promise<ActionResult> {
  const auth = await sessionOrError();
  if (!auth.ok) return auth;

  const tech = await prisma.technician.findFirst({
    where: { id, companyId: auth.companyId },
  });
  if (!tech) return { ok: false, error: 'Tecnico non trovato.' };

  if (active) {
    const company = await prisma.company.findUnique({
      where: { id: auth.companyId },
      select: { plan: true },
    });
    const activeCount = await prisma.technician.count({
      where: { companyId: auth.companyId, active: true },
    });
    if (company && !canAddTechnician(company.plan, activeCount)) {
      return { ok: false, error: 'Limite tecnici del piano raggiunto.' };
    }
  }

  await prisma.technician.update({ where: { id }, data: { active } });
  revalidatePath('/dashboard/technicians');
  revalidatePath('/dashboard');
  return { ok: true };
}