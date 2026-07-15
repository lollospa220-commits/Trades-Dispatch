import { LANDING } from '@/lib/landing';
import Link from 'next/link';

export default function HeroSection() {
  const { hero } = LANDING;

  return (
    <section className="relative overflow-hidden bg-brand-navy text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 70% 50% at 80% 20%, rgb(232 123 53 / 0.35), transparent 50%), radial-gradient(ellipse 50% 40% at 10% 80%, rgb(30 77 140 / 0.4), transparent 50%)',
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:pb-28 sm:pt-24">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-amber">
          {hero.eyebrow}
        </p>
        <h1 className="font-display mt-4 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          {hero.title}
          <span className="block text-brand-amber">{hero.titleAccent}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">{hero.subtitle}</p>
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

        {/* Mini preview card */}
        <div className="mt-14 hidden sm:block">
          <div className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>Oggi · 3 interventi</span>
              <span className="rounded-full bg-brand-amber/20 px-2 py-0.5 font-semibold text-brand-amber">
                In corso
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { time: '09:00', job: 'Perdita sotto lavandino', status: 'Programmato' },
                { time: '11:30', job: 'Sostituzione caldaia', status: 'In corso' },
              ].map((row) => (
                <div
                  key={row.time}
                  className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5"
                >
                  <span className="font-mono text-sm font-semibold text-brand-amber">{row.time}</span>
                  <span className="flex-1 text-sm text-white/90">{row.job}</span>
                  <span className="text-xs text-white/40">{row.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}