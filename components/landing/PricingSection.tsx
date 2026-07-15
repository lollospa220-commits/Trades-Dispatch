import { LANDING } from '@/lib/landing';
import { PRICE_ANCHOR, PRICING_PLANS } from '@/lib/pricing';
import Link from 'next/link';

export default function PricingSection() {
  const { pricingIntro } = LANDING;

  return (
    <section id="prezzi" className="scroll-mt-20 bg-brand-sand py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-brand-navy sm:text-4xl">
            {pricingIntro.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-muted">{pricingIntro.subtitle}</p>

          <div className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full border border-brand-teal/30 bg-brand-teal-light px-5 py-2.5 text-sm font-medium text-brand-teal">
            <span className="font-bold">€{PRICE_ANCHOR.lostJob}</span>
            <span className="text-brand-teal/80">= un intervento perso</span>
            <span className="text-brand-muted">·</span>
            <span>
              <span className="font-bold">€{PRICING_PLANS[0].price}</span>/mese = meno di €
              {PRICE_ANCHOR.monthlyCoffee} al giorno
            </span>
          </div>
        </div>

        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <article
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border p-6 sm:p-8 ${
                plan.highlight
                  ? 'border-brand-blue bg-white shadow-xl shadow-brand-blue/10 ring-2 ring-brand-blue/20 lg:scale-[1.02]'
                  : 'border-brand-sand-dark bg-white'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-blue px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  {plan.badge}
                </span>
              )}

              <div>
                <h3 className="font-display text-xl font-bold text-brand-navy">{plan.name}</h3>
                <p className="mt-1 text-sm text-brand-muted">{plan.tagline}</p>
              </div>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-5xl font-extrabold tracking-tight text-brand-navy">
                  €{plan.price}
                </span>
                <span className="text-brand-muted">/{plan.period}</span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-brand-muted">{plan.audience}</p>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-sm text-brand-ink">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={`/register?plan=${plan.id}`}
                className={`mt-8 block w-full rounded-xl py-3.5 text-center text-sm font-bold transition ${
                  plan.highlight
                    ? 'bg-brand-blue text-white hover:bg-brand-blue-dark'
                    : 'bg-brand-navy text-white hover:opacity-90'
                }`}
              >
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-brand-muted">
          Prezzi IVA esclusa dove applicabile. Nessun costo nascosto. Upgrade o downgrade quando vuoi.
        </p>
      </div>
    </section>
  );
}