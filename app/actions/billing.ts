'use server';

import { SubscriptionPlan } from '@prisma/client';
import { redirect } from 'next/navigation';
import { sessionOrError } from '@/lib/action-auth';
import { prisma } from '@/lib/prisma';
import { createCheckoutSession, stripeConfigured } from '@/lib/stripe';
import { siteUrl } from '@/lib/site';

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function startCheckoutForm(formData: FormData): Promise<void> {
  const plan = String(formData.get('plan') || 'TEAM') as SubscriptionPlan;
  await startCheckout(plan);
}

export async function startCheckout(plan: SubscriptionPlan): Promise<void> {
  const auth = await sessionOrError();
  if (!auth.ok) redirect('/login');

  if (!stripeConfigured()) {
    await prisma.company.update({
      where: { id: auth.companyId },
      data: { plan, subscriptionStatus: 'trialing' },
    });
    redirect('/dashboard/settings?upgraded=1');
  }

  const company = await prisma.company.findUnique({
    where: { id: auth.companyId },
    select: { email: true },
  });
  if (!company) redirect('/dashboard/settings');

  const url = await createCheckoutSession({
    customerEmail: company.email,
    companyId: auth.companyId,
    plan,
    successUrl: `${siteUrl()}/dashboard/settings?paid=1`,
    cancelUrl: `${siteUrl()}/dashboard/settings`,
  });

  if (url) redirect(url);
  redirect('/dashboard/settings?error=stripe');
}