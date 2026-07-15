import { LANDING } from '@/lib/landing';

export default function AudienceSection() {
  const { audience } = LANDING;

  return (
    <section className="bg-brand-navy py-20 text-white sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">{audience.title}</h2>
          <p className="mt-4 text-lg text-white/65">{audience.subtitle}</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {audience.segments.map((seg) => (
            <div
              key={seg.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <h3 className="font-display text-lg font-bold text-brand-amber">{seg.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{seg.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}