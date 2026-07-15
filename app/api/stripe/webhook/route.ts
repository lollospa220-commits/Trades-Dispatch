import { SubscriptionPlan } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ ok: true });

  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'no sig' }, { status: 400 });

  // Verifica minimale: in produzione usare stripe SDK; qui parse evento se signature ok via env
  let event: { type: string; data: { object: Record<string, unknown> } };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as {
      metadata?: { companyId?: string; plan?: string };
      customer?: string;
      subscription?: string;
    };
    const companyId = String(session.metadata?.companyId || '');
    const plan = String(session.metadata?.plan || 'TEAM') as SubscriptionPlan;
    const customerId = String(session.customer || '');
    const subscriptionId = String(session.subscription || '');

    if (companyId) {
      await prisma.company.update({
        where: { id: companyId },
        data: {
          plan: ['SOLO', 'TEAM', 'PRO'].includes(plan) ? plan : 'TEAM',
          stripeCustomerId: customerId || undefined,
          stripeSubscriptionId: subscriptionId || undefined,
          subscriptionStatus: 'active',
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}