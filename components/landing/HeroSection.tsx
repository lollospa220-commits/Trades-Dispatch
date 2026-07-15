import LandingImage from '@/components/landing/LandingImage';
import { LANDING } from '@/lib/landing';
import { LANDING_IMAGES } from '@/lib/landing-images';
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

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-14 lg:grid-cols-2 lg:gap-16 lg:pb-20 lg:pt-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-amber">
            {hero.eyebrow}
          </p>
          <h1 className="font-display mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.25rem]">
            {hero.title}
            <span className="block text-brand-amber">{hero.titleAccent}</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/75">{hero.subtitle}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-brand-amber px-6 py-3.5 text-sm font-bold text-brand-navy shadow-lg shadow-brand-amber/25 transition hover:brightness-110"
            >
              {hero.ctaPrimary}
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {hero.ctaSecondary}
            </Link>
          </div>
          <p className="mt-8 text-sm text-white/50">{hero.trust}</p>

          <div className="mt-10 flex flex-wrap gap-6 border-t border-white/10 pt-8">
            {[
              { value: '2 min', label: 'per registrarti' },
              { value: '€20', label: 'al mese da' },
              { value: 'SMS', label: 'cliente avvisato' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/45">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl shadow-black/40 ring-1 ring-white/15 sm:aspect-[5/6] lg:aspect-[4/5]">
            <LandingImage
              src={LANDING_IMAGES.hero.src}
              alt={LANDING_IMAGES.hero.alt}
              priority
              sizes="(max-width: 1024px) 100vw, 540px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent" />
          </div>

          {/* Floating dashboard card */}
          <div className="absolute -bottom-6 -left-4 z-10 hidden w-[min(100%,280px)] rounded-2xl border border-white/15 bg-brand-navy/90 p-4 shadow-xl backdrop-blur-md sm:block lg:-left-8">
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>Oggi · 3 interventi</span>
              <span className="rounded-full bg-brand-amber/25 px-2 py-0.5 font-semibold text-brand-amber">
                In corso
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {[
                { time: '09:00', job: 'Perdita lavandino' },
                { time: '11:30', job: 'Caldaia — in corso' },
              ].map((row) => (
                <div
                  key={row.time}
                  className="flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-2"
                >
                  <span className="font-mono text-xs font-bold text-brand-amber">{row.time}</span>
                  <span className="text-xs text-white/85">{row.job}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Small avatar strip */}
          <div className="absolute -right-2 top-6 z-10 flex -space-x-2 sm:right-4">
            {[LANDING_IMAGES.solo, LANDING_IMAGES.electrician, LANDING_IMAGES.plumber].map(
              (img, i) => (
                <div
                  key={img.src}
                  className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-brand-navy"
                  style={{ zIndex: 3 - i }}
                >
                  <LandingImage src={img.src} alt="" sizes="44px" className="object-cover" />
                </div>
              ),
            )}
            <span className="flex h-11 items-center rounded-full bg-brand-amber px-3 text-xs font-bold text-brand-navy ring-2 ring-brand-navy">
              +500
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}