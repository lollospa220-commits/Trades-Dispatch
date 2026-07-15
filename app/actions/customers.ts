'use server';

import { revalidatePath } from 'next/cache';
import { sessionOrError } from '@/lib/action-auth';
import { prisma } from '@/lib/prisma';

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createCustomer(formData: FormData): Promise<void> {
  await createCustomerImpl(formData);
}

async function createCustomerImpl(formData: FormData): Promise<ActionResult> {
  const auth = await sessionOrError();
  if (!auth.ok) return auth;

  const name = String(formData.get('name') || '').trim();
  const phone = String(formData.get('phone') || '').trim() || null;
  const email = String(formData.get('email') || '').trim() || null;
  const address = String(formData.get('address') || '').trim() || null;
  if (!name) return { ok: false, error: 'Il nome è obbligatorio.' };

  await prisma.customer.create({
    data: { name, phone, email, address, companyId: auth.companyId },
  });

  revalidatePath('/dashboard/customers');
  revalidatePath('/dashboard');
  return { ok: true };
}

export async function updateCustomer(formData: FormData): Promise<void> {
  await updateCustomerImpl(formData);
}

async function updateCustomerImpl(formData: FormData): Promise<ActionResult> {
  const auth = await sessionOrError();
  if (!auth.ok) return auth;

  const id = String(formData.get('id') || '');
  const name = String(formData.get('name') || '').trim();
  const phone = String(formData.get('phone') || '').trim() || null;
  const email = String(formData.get('email') || '').trim() || null;
  const address = String(formData.get('address') || '').trim() || null;
  if (!id || !name) return { ok: false, error: 'Dati non validi.' };

  const customer = await prisma.customer.findFirst({
    where: { id, companyId: auth.companyId },
  });
  if (!customer) return { ok: false, error: 'Cliente non trovato.' };

  await prisma.customer.update({
    where: { id },
    data: { name, phone, email, address },
  });

  revalidatePath('/dashboard/customers');
  revalidatePath('/dashboard');
  return { ok: true };
}

export async function deleteCustomer(id: string): Promise<ActionResult> {
  const auth = await sessionOrError();
  if (!auth.ok) return auth;

  const customer = await prisma.customer.findFirst({
    where: { id, companyId: auth.companyId },
    include: { jobs: { take: 1 } },
  });
  if (!customer) return { ok: false, error: 'Cliente non trovato.' };
  if (customer.jobs.length > 0) {
    return { ok: false, error: 'Cliente con interventi collegati: non eliminabile.' };
  }

  await prisma.customer.delete({ where: { id } });
  revalidatePath('/dashboard/customers');
  return { ok: true };
}