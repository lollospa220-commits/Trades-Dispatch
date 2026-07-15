'use server';

import { redirect } from 'next/navigation';
import { createSession, destroySession, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export type AuthResult = { ok: true } | { ok: false; error: string };

export async function loginAction(
  _prev: AuthResult | null,
  formData: FormData,
): Promise<AuthResult> {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  if (!email || !password) {
    return { ok: false, error: 'Email e password sono obbligatorie.' };
  }

  let company;
  try {
    company = await prisma.company.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, passwordHash: true },
    });
  } catch (err) {
    console.error('[loginAction] DB error:', err);
    return {
      ok: false,
      error:
        'Database Supabase non raggiungibile. Controlla DATABASE_URL in .env, poi: npm run db:migrate && npm run db:seed',
    };
  }

  if (!company || !(await verifyPassword(password, company.passwordHash))) {
    return { ok: false, error: 'Credenziali non valide.' };
  }

  await createSession({
    companyId: company.id,
    companyName: company.name,
    email: company.email,
  });

  redirect('/dashboard');
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect('/login');
}