import LandingImage from '@/components/landing/LandingImage';
import { LANDING } from '@/lib/landing';
import { LANDING_IMAGES } from '@/lib/landing-images';
import type { ReactNode } from 'react';

const ICONS: Record<string, ReactNode> = {
  phone: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  ),
  calendar: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  ),
  clock: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  ),
  money: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  ),
};

export default function ProblemsSection() {
  const { problems } = LANDING;

  return (
    <section className="bg-brand-sand py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl ring-1 ring-brand-sand-dark">
              <LandingImage
                src={LANDING_IMAGES.plumber.src}
                alt={LANDING_IMAGES.plumber.alt}
                sizes="(max-width: 1024px) 100vw, 480px"
              />
            </div>
            <div className="absolute -bottom-5 -right-4 w-2/5 overflow-hidden rounded-2xl shadow-lg ring-4 ring-brand-sand sm:-right-8">
              <div className="relative aspect-square">
                <LandingImage
                  src={LANDING_IMAGES.solo.src}
                  alt=""
                  sizes="200px"
                />
              </div>
            </div>
            <div className="absolute -left-3 top-8 max-w-[200px] rounded-xl bg-white px-4 py-3 shadow-lg ring-1 ring-brand-sand-dark sm:-left-6">
              <p className="text-xs font-semibold text-brand-amber">Prima</p>
              <p className="mt-1 text-sm font-medium text-brand-navy">
                12 chiamate mentre lavori
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="font-display text-3xl font-bold text-brand-navy sm:text-4xl">
              {problems.title}
            </h2>
            <p className="mt-4 text-lg text-brand-muted">{problems.subtitle}</p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {problems.items.map((item) => (
                <article
                  key={item.pain}
                  className="brand-card group p-5 transition hover:border-brand-amber/40 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-amber-light text-brand-amber">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden
                    >
                      {ICONS[item.icon]}
                    </svg>
                  </div>
                  <h3 className="font-display mt-3 text-base font-bold text-brand-navy">
                    {item.pain}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-muted">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}