import { SubscriptionPlan } from '@prisma/client';
import { PLAN_LIMITS } from '@/lib/plans';

const PLAN_TO_PRICE_ENV: Record<SubscriptionPlan, string> = {
  SOLO: 'STRIPE_PRICE_SOLO',
  TEAM: 'STRIPE_PRICE_TEAM',
  PRO: 'STRIPE_PRICE_PRO',
};

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function priceIdForPlan(plan: SubscriptionPlan): string | null {
  const key = PLAN_TO_PRICE_ENV[plan];
  return process.env[key] ?? null;
}

export async function createCheckoutSession(params: {
  customerEmail: string;
  companyId: string;
  plan: SubscriptionPlan;
  successUrl: string;
  cancelUrl: string;
}): Promise<string | null> {
  const secret = process.env.STRIPE_SECRET_KEY;
  const priceId = priceIdForPlan(params.plan);
  if (!secret || !priceId) return null;

  const body = new URLSearchParams({
    mode: 'subscription',
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    customer_email: params.customerEmail,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    'metadata[companyId]': params.companyId,
    'metadata[plan]': params.plan,
  });

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!res.ok) {
    console.error('[stripe checkout]', await res.text());
    return null;
  }

  const data = (await res.json()) as { url?: string };
  return data.url ?? null;
}

export function planDisplayPrice(plan: SubscriptionPlan): number {
  return PLAN_LIMITS[plan].price;
}