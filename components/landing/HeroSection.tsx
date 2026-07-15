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

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-12 pt-10 sm:gap-12 sm:pb-16 sm:pt-14 lg:grid-cols-2 lg:gap-16 lg:pb-20 lg:pt-20">
        <div className="order-2 lg:order-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-amber">{hero.eyebrow}</p>
          <h1 className="font-display mt-3 text-[1.75rem] font-extrabold leading-[1.1] tracking-tight sm:mt-4 sm:text-4xl sm:leading-[1.08] lg:text-[3.25rem]">
            {hero.title}
            <span className="block text-brand-amber">{hero.titleAccent}</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/75 sm:mt-6 sm:text-lg">{hero.subtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link
              href="/register"
              className="flex min-h-11 w-full items-center justify-center rounded-xl bg-brand-amber px-6 py-3.5 text-sm font-bold text-brand-navy shadow-lg shadow-brand-amber/25 transition hover:brightness-110 sm:w-auto"
            >
              {hero.ctaPrimary}
            </Link>
            <a
              href="#prodotto"
              className="flex min-h-11 w-full items-center justify-center rounded-xl border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
            >
              {hero.ctaSecondary}
            </a>
          </div>
          <p className="mt-6 text-sm text-white/50 sm:mt-8">{hero.trust}</p>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 sm:mt-10 sm:flex sm:flex-wrap sm:gap-6 sm:pt-8">
            {[
              { value: '14 gg', label: 'prova gratis' },
              { value: 'WhatsApp', label: 'avviso cliente' },
              { value: 'PDF', label: 'rapportino firmato' },
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

          <div className="absolute -bottom-4 left-0 right-0 z-10 mx-auto w-[min(100%,300px)] rounded-2xl border border-white/15 bg-brand-navy/95 p-3 shadow-xl backdrop-blur-md sm:-bottom-6 sm:-left-4 sm:right-auto sm:mx-0 sm:p-4 lg:-left-8">
            <div className="flex items-center gap-2 text-xs">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-[10px] font-bold text-white">
                WA
              </span>
              <span className="text-white/85">Messaggio inviato al cliente</span>
            </div>
            <p className="mt-2 rounded-lg bg-white/10 px-2.5 py-2 text-[11px] leading-snug text-white/90">
              Marco è in partenza per la perdita lavandino. Arrivo stimato 09:15.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}