import { startCheckoutForm } from '@/app/actions/billing';
import BillingProfileForm from '@/components/dashboard/BillingProfileForm';
import { PLAN_LIMITS } from '@/lib/plans';
import { stripeConfigured } from '@/lib/stripe';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { SubscriptionPlan } from '@prisma/client';

const PLANS: SubscriptionPlan[] = ['SOLO', 'TEAM', 'PRO'];

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ paid?: string; upgraded?: string; error?: string }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const params = await searchParams;
  const company = await prisma.company.findUnique({
    where: { id: session.companyId },
    select: {
      name: true,
      plan: true,
      subscriptionStatus: true,
      accountType: true,
      billingProfile: {
        select: {
          businessName: true,
          vatNumber: true,
          taxCode: true,
          address: true,
          pec: true,
          sdiCode: true,
          iban: true,
        },
      },
    },
  });
  if (!company) return null;

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-brand-navy">Impostazioni e piano</h2>

      {params.paid === '1' && (
        <p className="mt-4 rounded-lg bg-brand-teal-light p-3 text-sm text-brand-teal">
          Pagamento ricevuto. Piano attivo.
        </p>
      )}
      {params.upgraded === '1' && (
        <p className="mt-4 rounded-lg bg-brand-teal-light p-3 text-sm text-brand-teal">
          Piano aggiornato (modalità prova — Stripe non configurato).
        </p>
      )}
      {params.error === 'stripe' && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          Errore checkout. Controlla le variabili Stripe su Vercel.
        </p>
      )}

      <div className="brand-card mt-6 p-4">
        <p className="text-sm text-brand-muted">Piano attuale</p>
        <p className="font-display text-xl font-bold text-brand-navy">
          {PLAN_LIMITS[company.plan].label} · €{PLAN_LIMITS[company.plan].price}/mese
        </p>
        <p className="mt-1 text-xs text-brand-muted">Stato: {company.subscriptionStatus}</p>
        {!stripeConfigured() && (
          <p className="mt-2 text-xs text-brand-amber">
            Stripe non configurato: cambio piano immediato in prova.
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {PLANS.map((plan) => {
          const meta = PLAN_LIMITS[plan];
          const current = company.plan === plan;
          return (
            <div
              key={plan}
              className={`brand-card p-4 ${current ? 'ring-2 ring-brand-blue' : ''}`}
            >
              <h3 className="font-display font-bold text-brand-navy">{meta.label}</h3>
              <p className="text-2xl font-extrabold">€{meta.price}</p>
              <p className="mt-2 text-xs text-brand-muted">
                Fino a {meta.technicians >= 999 ? '∞' : meta.technicians} tecnici
              </p>
              {!current && (
                <form action={startCheckoutForm} className="mt-4">
                  <input type="hidden" name="plan" value={plan} />
                  <button type="submit" className="brand-btn-primary w-full text-xs">
                    Passa a {meta.label}
                  </button>
                </form>
              )}
              {current && (
                <p className="mt-4 text-xs font-semibold text-brand-teal">Piano attivo</p>
              )}
            </div>
          );
        })}
      </div>

      <BillingProfileForm profile={company.billingProfile} companyName={company.name} />

      <div className="mt-8 text-sm text-brand-muted">
        <p>
          <a href="/privacy" className="text-brand-blue hover:underline">
            Privacy
          </a>{' '}
          ·{' '}
          <a href="/termini" className="text-brand-blue hover:underline">
            Termini
          </a>
        </p>
      </div>
    </div>
  );
}