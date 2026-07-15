import LandingImage from '@/components/landing/LandingImage';
import { LANDING } from '@/lib/landing';
import { HERO_AVATARS, LANDING_IMAGES } from '@/lib/landing-images';
import Link from 'next/link';

export default function HeroSection() {
  const { hero } = LANDING;

  return (
    <section className="relative overflow-hidden bg-brand-navy text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 50% at 70% 30%, rgb(232 123 53 / 0.3), transparent 55%), radial-gradient(ellipse 40% 40% at 20% 90%, rgb(30 77 140 / 0.35), transparent 50%)',
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-12 pt-10 sm:gap-12 sm:pb-16 sm:pt-14 lg:grid-cols-2 lg:gap-16 lg:pb-20 lg:pt-20">
        <div className="order-2 lg:order-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-amber">
            {hero.eyebrow}
          </p>
          <h1 className="font-display mt-3 text-[1.75rem] font-extrabold leading-[1.1] tracking-tight sm:mt-4 sm:text-4xl sm:leading-[1.08] lg:text-[3.25rem]">
            {hero.title}
            <span className="block text-brand-amber">{hero.titleAccent}</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/75 sm:mt-6 sm:text-lg">
            {hero.subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link
              href="/register"
              className="flex min-h-11 w-full items-center justify-center rounded-xl bg-brand-amber px-6 py-3.5 text-sm font-bold text-brand-navy shadow-lg shadow-brand-amber/25 transition hover:brightness-110 sm:w-auto"
            >
              {hero.ctaPrimary}
            </Link>
            <Link
              href="/login"
              className="flex min-h-11 w-full items-center justify-center rounded-xl border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
            >
              {hero.ctaSecondary}
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/50 sm:mt-8">{hero.trust}</p>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 sm:mt-10 sm:flex sm:flex-wrap sm:gap-6 sm:pt-8">
            {[
              { value: '2 min', label: 'per registrarti' },
              { value: '€20', label: 'al mese da' },
              { value: 'SMS', label: 'cliente avvisato' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-xl font-bold text-white sm:text-2xl">{stat.value}</p>
                <p className="text-[11px] text-white/45 sm:text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative order-1 lg:order-2">
          <div className="relative aspect-[5/4] overflow-hidden rounded-2xl shadow-2xl shadow-black/40 ring-1 ring-white/15 sm:aspect-[4/5] sm:rounded-3xl lg:aspect-[4/5]">
            <LandingImage
              src={LANDING_IMAGES.hero.src}
              alt={LANDING_IMAGES.hero.alt}
              priority
              sizes="(max-width: 1024px) 100vw, 540px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-4 left-0 right-0 z-10 mx-auto w-[min(100%,280px)] rounded-2xl border border-white/15 bg-brand-navy/90 p-3 shadow-xl backdrop-blur-md sm:absolute sm:-bottom-6 sm:-left-4 sm:right-auto sm:mx-0 sm:block sm:p-4 lg:-left-8">
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>Oggi · 3 interventi</span>
              <span className="rounded-full bg-brand-amber/25 px-2 py-0.5 font-semibold text-brand-amber">
                In corso
              </span>
            </div>
            <div className="mt-2 space-y-2 sm:mt-3">
              {[
                { time: '09:00', job: 'Perdita lavandino' },
                { time: '11:30', job: 'Caldaia — in corso' },
              ].map((row) => (
                <div
                  key={row.time}
                  className="flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-2"
                >
                  <span className="font-mono text-xs font-bold text-brand-amber">{row.time}</span>
                  <span className="truncate text-xs text-white/85">{row.job}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -right-1 top-4 z-10 flex -space-x-2 sm:right-4 sm:top-6">
            {HERO_AVATARS.map((img, i) => (
              <div
                key={img.src}
                className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-brand-navy sm:h-11 sm:w-11"
                style={{ zIndex: 3 - i }}
              >
                <LandingImage src={img.src} alt="" sizes="44px" className="object-cover" />
              </div>
            ))}
            <span className="flex h-9 items-center rounded-full bg-brand-amber px-2.5 text-[10px] font-bold text-brand-navy ring-2 ring-brand-navy sm:h-11 sm:px-3 sm:text-xs">
              +500
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}