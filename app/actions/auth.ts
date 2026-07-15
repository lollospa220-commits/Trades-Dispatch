'use server';

import { AccountType, SubscriptionPlan } from '@prisma/client';
import { createHash, randomBytes } from 'crypto';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSession, destroySession, hashPassword, verifyPassword } from '@/lib/auth';
import { sendPasswordResetEmail, sendWelcomeEmail } from '@/lib/email';
import { defaultPlanForAccount, planFromRegisterParam } from '@/lib/plans';
import { isLoginBlocked, recordLoginAttempt } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';
import { siteUrl } from '@/lib/site';
import { uniqueCompanySlug } from '@/lib/slug';

export type AuthResult = { ok: true } | { ok: false; error: string };

function parseAccountType(raw: FormDataEntryValue | null): AccountType | null {
  const value = String(raw || '').toUpperCase();
  if (value === 'COMPANY' || value === 'SOLO') return value;
  return null;
}

async function clientIp(): Promise<string | undefined> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined;
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

  if (await isLoginBlocked(email)) {
    return { ok: false, error: 'Troppi tentativi. Riprova tra 15 minuti.' };
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
    return { ok: false, error: 'Servizio temporaneamente non disponibile. Riprova.' };
  }

  const ip = await clientIp();
  const valid = company && (await verifyPassword(password, company.passwordHash));
  await recordLoginAttempt(email, Boolean(valid), ip);

  if (!valid || !company) {
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
  const planParam = String(formData.get('plan') || '');

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

  const plan: SubscriptionPlan =
    planFromRegisterParam(planParam) ?? defaultPlanForAccount(accountType);

  let existing;
  try {
    existing = await prisma.company.findUnique({
      where: { email },
      select: { id: true },
    });
  } catch (err) {
    console.error('[registerAction] DB lookup:', err);
    return { ok: false, error: 'Servizio temporaneamente non disponibile. Riprova.' };
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
          plan: 'SOLO',
          technicians: {
            create: { name: operatorName, email, phone },
          },
        },
        select: { id: true, name: true, email: true, accountType: true },
      });

      await createSession({
        companyId: company.id,
        companyName: company.name,
        email: company.email,
        accountType: company.accountType,
      });
      await sendWelcomeEmail(company.email, company.name);
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
          plan,
          technicians: {
            create: {
              name: 'Responsabile operativo',
              email,
              phone: null,
            },
          },
        },
        select: { id: true, name: true, email: true, accountType: true },
      });

      await createSession({
        companyId: company.id,
        companyName: company.name,
        email: company.email,
        accountType: company.accountType,
      });
      await sendWelcomeEmail(company.email, company.name);
    }
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error('[registerAction]', err);
    return { ok: false, error: 'Errore durante la registrazione. Riprova.' };
  }

  redirect('/dashboard');
}

export async function forgotPasswordAction(
  _prev: AuthResult | null,
  formData: FormData,
): Promise<AuthResult> {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  if (!email) return { ok: false, error: 'Inserisci la tua email.' };

  const company = await prisma.company.findUnique({ where: { email }, select: { id: true } });
  if (company) {
    const raw = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(raw).digest('hex');
    await prisma.passwordResetToken.deleteMany({ where: { companyId: company.id } });
    await prisma.passwordResetToken.create({
      data: {
        companyId: company.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
    const resetUrl = `${siteUrl()}/reset-password?token=${raw}`;
    await sendPasswordResetEmail(email, resetUrl);
  }

  return { ok: true };
}

export async function resetPasswordAction(
  _prev: AuthResult | null,
  formData: FormData,
): Promise<AuthResult> {
  const token = String(formData.get('token') || '');
  const password = String(formData.get('password') || '');
  const passwordConfirm = String(formData.get('passwordConfirm') || '');

  if (!token || !password) return { ok: false, error: 'Dati mancanti.' };
  if (password.length < 8) return { ok: false, error: 'Password minimo 8 caratteri.' };
  if (password !== passwordConfirm) return { ok: false, error: 'Le password non coincidono.' };

  const tokenHash = createHash('sha256').update(token).digest('hex');
  const row = await prisma.passwordResetToken.findFirst({
    where: { tokenHash, expiresAt: { gt: new Date() } },
    include: { company: { select: { id: true } } },
  });
  if (!row) return { ok: false, error: 'Link scaduto o non valido.' };

  const passwordHash = await hashPassword(password);
  await prisma.company.update({
    where: { id: row.companyId },
    data: { passwordHash },
  });
  await prisma.passwordResetToken.deleteMany({ where: { companyId: row.companyId } });

  return { ok: true };
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect('/login');
}