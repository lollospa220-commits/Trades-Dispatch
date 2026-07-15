'use server';

import { AccountType } from '@prisma/client';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { redirect } from 'next/navigation';
import { createSession, destroySession, hashPassword, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uniqueCompanySlug } from '@/lib/slug';

export type AuthResult = { ok: true } | { ok: false; error: string };

function parseAccountType(raw: FormDataEntryValue | null): AccountType | null {
  const value = String(raw || '').toUpperCase();
  if (value === 'COMPANY' || value === 'SOLO') return value;
  return null;
}

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
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        accountType: true,
      },
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
    accountType: company.accountType,
  });

  redirect('/dashboard');
}

export async function registerAction(
  _prev: AuthResult | null,
  formData: FormData,
): Promise<AuthResult> {
  const accountType = parseAccountType(formData.get('accountType'));
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  const passwordConfirm = String(formData.get('passwordConfirm') || '');

  if (!accountType) {
    return { ok: false, error: 'Seleziona se sei un\'azienda o un operatore singolo.' };
  }
  if (!email || !password) {
    return { ok: false, error: 'Email e password sono obbligatorie.' };
  }
  if (password.length < 8) {
    return { ok: false, error: 'La password deve avere almeno 8 caratteri.' };
  }
  if (password !== passwordConfirm) {
    return { ok: false, error: 'Le password non coincidono.' };
  }

  let existing;
  try {
    existing = await prisma.company.findUnique({
      where: { email },
      select: { id: true },
    });
  } catch (err) {
    console.error('[registerAction] DB lookup:', err);
    return {
      ok: false,
      error:
        'Database non raggiungibile. Controlla la connessione Supabase e riprova.',
    };
  }

  if (existing) {
    return { ok: false, error: 'Esiste già un account con questa email.' };
  }

  const passwordHash = await hashPassword(password);

  try {
    if (accountType === 'SOLO') {
      const operatorName = String(formData.get('operatorName') || '').trim();
      const phone = String(formData.get('phone') || '').trim() || null;
      const businessName = String(formData.get('businessName') || '').trim();

      if (!operatorName) {
        return { ok: false, error: 'Il nome dell\'operatore è obbligatorio.' };
      }

      const displayName = businessName || operatorName;
      const slug = await uniqueCompanySlug(operatorName);

      const company = await prisma.company.create({
        data: {
          name: displayName,
          slug,
          email,
          passwordHash,
          accountType: 'SOLO',
          technicians: {
            create: {
              name: operatorName,
              email,
              phone,
            },
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          accountType: true,
        },
      });

      await createSession({
        companyId: company.id,
        companyName: company.name,
        email: company.email,
        accountType: company.accountType,
      });
    } else {
      const companyName = String(formData.get('companyName') || '').trim();
      if (!companyName) {
        return { ok: false, error: 'Il nome dell\'azienda è obbligatorio.' };
      }

      const slug = await uniqueCompanySlug(companyName);
      const company = await prisma.company.create({
        data: {
          name: companyName,
          slug,
          email,
          passwordHash,
          accountType: 'COMPANY',
        },
        select: {
          id: true,
          name: true,
          email: true,
          accountType: true,
        },
      });

      await createSession({
        companyId: company.id,
        companyName: company.name,
        email: company.email,
        accountType: company.accountType,
      });
    }
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error('[registerAction]', err);
    return { ok: false, error: 'Errore durante la registrazione. Riprova.' };
  }

  redirect('/dashboard');
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect('/login');
}