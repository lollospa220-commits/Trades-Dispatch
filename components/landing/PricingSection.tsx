'use client';

import LandingImage from '@/components/landing/LandingImage';
import { LANDING } from '@/lib/landing';
import { LANDING_IMAGES } from '@/lib/landing-images';
import { ANNUAL_SAVINGS_MONTHS, PRICE_ANCHOR, PRICING_PLANS } from '@/lib/pricing';
import Link from 'next/link';
import { useState } from 'react';

const PLAN_IMAGES = {
  solo: LANDING_IMAGES.hvac,
  team: LANDING_IMAGES.team,
  pro: LANDING_IMAGES.fridgeTech,
} as const;

export default function PricingSection() {
  const { pricingIntro } = LANDING;
  const [annual, setAnnual] = useState(false);

  return (
    <section id="prezzi" className="landing-section scroll-mt-20 bg-brand-sand">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-brand-navy sm:text-3xl lg:text-4xl">
            {pricingIntro.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-muted">{pricingIntro.subtitle}</p>

          <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-brand-sand-dark bg-white p-1">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                !annual ? 'bg-brand-navy text-white' : 'text-brand-muted'
              }`}
            >
              Mensile
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                annual ? 'bg-brand-navy text-white' : 'text-brand-muted'
              }`}
            >
              Annuale · {ANNUAL_SAVINGS_MONTHS} mesi gratis
            </button>
          </div>
        </div>

        <div className="mt-10 grid items-stretch gap-5 sm:mt-14 sm:gap-6 lg:grid-cols-3">
          {PRICING_PLANS.map((plan) => {
            const img = PLAN_IMAGES[plan.id];
            const displayPrice = annual ? plan.annualPrice : plan.price;
            const period = annual ? 'anno' : plan.period;

            return (
              <article
                key={plan.id}
                className={`relative flex flex-col overflow-hidden rounded-2xl border ${
                  plan.highlight
                    ? 'border-brand-blue bg-white shadow-xl ring-2 ring-brand-blue/20 lg:scale-[1.02]'
                    : 'border-brand-sand-dark bg-white'
                }`}
              >
                <div className="relative h-36">
                  <LandingImage src={img.src} alt={img.alt} sizes="400px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-8">
                  {plan.badge && (
                    <span className="mb-3 inline-flex w-fit rounded-full bg-brand-blue px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                      {plan.badge}
                    </span>
                  )}

                  <h3 className="font-display text-xl font-bold text-brand-navy">{plan.name}</h3>
                  <p className="mt-1 text-sm text-brand-muted">{plan.tagline}</p>

                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="font-display text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
                      €{displayPrice}
                    </span>
                    <span className="text-brand-muted">/{period}</span>
                  </div>
                  {annual && (
                    <p className="mt-1 text-xs text-brand-teal">
                      Risparmi €{plan.price * ANNUAL_SAVINGS_MONTHS} rispetto al mensile
                    </p>
                  )}

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
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-10 text-center text-xs text-brand-muted">
          Prova gratuita 14 giorni · Prezzi IVA esclusa · Un intervento perso = €{PRICE_ANCHOR.lostJob}
        </p>
      </div>
    </section>
  );
}